/**
 * Text processing utilities
 */

export function wordCount(text) {
    return text.trim().split(/\s+/).filter(Boolean).length
}

export function readTime(text) {
    return Math.max(1, Math.round(wordCount(text) / 200))
}

export async function extractTextFromFile(file) {
    const ext = file.name.split('.').pop().toLowerCase()

    if (ext === 'txt' || ext === 'md') {
        return await file.text()
    }

    if (ext === 'pdf') {
        const url = URL.createObjectURL(file)
        const pdfjsLib = window['pdfjs-dist/build/pdf']
        if (!pdfjsLib) throw new Error('PDF.js not loaded')
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        const pdf = await pdfjsLib.getDocument(url).promise
        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const content = await page.getTextContent()
            fullText += content.items.map(item => item.str).join(' ') + '\n'
        }
        URL.revokeObjectURL(url)
        return fullText.trim()
    }

    if (ext === 'docx') {
        const mammoth = window.mammoth
        if (!mammoth) throw new Error('mammoth.js not loaded')
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        return result.value.trim()
    }

    throw new Error(`Unsupported file type: .${ext}`)
}
