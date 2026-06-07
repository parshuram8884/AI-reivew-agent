/**
 * Gemini API integration
 */

export async function callGemini(agentData, submissionData, userApiKey) {

    const modelName = agentData.model || 'gemini-flash'
    const criteriaList = Array.isArray(agentData.criteria)
        ? agentData.criteria.join(', ')
        : agentData.criteria

    const prompt = `OUTPUT ONLY THE JSON BELOW. NO OTHER TEXT BEFORE OR AFTER.

AGENT INSTRUCTIONS:
${agentData.instructions}

EVALUATION CRITERIA: you must evaluate the submission based on the following criteria and provide a score from 0 to 100 for each and give the critieria mark according to the title or name that the give 
${Array.isArray(agentData.criteria) ? agentData.criteria.join('\n') : agentData.criteria}

SUBMISSION:

Title: ${submissionData.title}
Content: ${submissionData.content}

REQUIRED OUTPUT (and ONLY this JSON, nothing else):
confidence Score in depend on the criteria that they full fill according to the titke or name that the give
{"overallScore": <0-100>, "confidenceScore": <0-100>, "criteriaScores": [{"name": "<criterion>", "score": <0-100>}], "strengths": ["<strength1>", "<strength2>", "<strength3>"], "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"], "suggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>"], "critique": "<brief paragraph>"}`

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${userApiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 4000, stopSequences: ['\n\n'] },
            }),
        }
    )

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        const msg = errData?.error?.message || `API error ${res.status}`
        throw new Error(msg)
    }

    const data = await res.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}'

    // Aggressive JSON extraction
    let jsonStr = raw.trim()

    // Remove common markdown patterns
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '')

    // Try to find the first complete JSON object { ... }
    let braceStart = jsonStr.indexOf('{')
    let braceEnd = -1
    let braceCount = 0

    if (braceStart !== -1) {
        for (let i = braceStart; i < jsonStr.length; i++) {
            const char = jsonStr[i]
            if (char === '{') braceCount++
            else if (char === '}') {
                braceCount--
                if (braceCount === 0) {
                    braceEnd = i + 1
                    break
                }
            }
        }

        if (braceEnd !== -1) {
            jsonStr = jsonStr.substring(braceStart, braceEnd)
        }
    }

    // Clean control characters
    jsonStr = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ').trim()

    let parsed
    try {
        parsed = JSON.parse(jsonStr)
    } catch (err) {
        console.error('JSON parse error:', err.message)
        console.error('Raw response (first 500 chars):', raw.substring(0, 500))
        console.error('Extracted JSON (first 500 chars):', jsonStr.substring(0, 500))
        throw new Error(`The AI did not return valid JSON. Please try again. (Error: ${err.message})`)
    }

    return {
        overallScore: parsed.overallScore || 0,
        confidenceScore: parsed.confidenceScore || 0,
        criteriaScores: parsed.criteriaScores || [],
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        suggestions: parsed.suggestions || [],
        critique: parsed.critique || 'The reviewer did not provide a critique summary.',
    }
}
