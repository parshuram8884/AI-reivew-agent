/**
 * Agent templates and constants
 */

export const CATEGORIES = [
    'Blog Posts & Articles',
    'Technical Documentation',
    'Marketing Copy',
    'Business Proposals',
    'Research Summaries',
    'Email Drafts',
    'Reports',
    'Scripts',
    'Essays',
    'General Writing',
]

export const MODELS = [
    { id: 'gemini-2.5-flash-lite', label: 'gemini-2.5-flash-lite', badge: 'Fast', badgeColor: 'text-emerald-400 bg-emerald-400/10' },
    { id: 'gemini-2.5-flash', label: 'gemini-2.5-flash', badge: 'Accurate', badgeColor: 'text-blue-400 bg-blue-400/10' },
    { id: 'gemini-3.5-pro', label: 'gemini-3.5-pro', badge: 'Powerful', badgeColor: 'text-violet-400 bg-violet-400/10' },
]

export const AGENT_TEMPLATES = [
    {
        name: 'Blog Content Reviewer',
        description: 'Reviews blog posts for SEO, readability, and engagement.',
        category: 'Blog Posts & Articles',
        instructions: 'Review the blog post for clarity, SEO optimization, engagement hooks, and readability. Check for proper use of headings, keyword density, and audience alignment.',
        criteria: 'Grammar & Spelling\nReadability Score\nSEO Optimization\nAudience Alignment\nEngagement Hooks',
        threshold: 80,
    },
    {
        name: 'Technical Docs Reviewer',
        description: 'Evaluates technical documentation for accuracy and clarity.',
        category: 'Technical Documentation',
        instructions: 'Assess technical documentation for accuracy, completeness, code example correctness, and developer-friendliness. Flag ambiguous instructions and missing context.',
        criteria: 'Technical Accuracy\nCompleteness\nCode Examples\nClarity\nDeveloper Experience',
        threshold: 85,
    },
    {
        name: 'Marketing Copy Reviewer',
        description: 'Analyzes marketing content for conversion and brand alignment.',
        category: 'Marketing Copy',
        instructions: 'Evaluate marketing copy for persuasive language, brand voice consistency, CTA effectiveness, and target audience alignment. Check for compliance with brand guidelines.',
        criteria: 'Brand Voice\nPersuasive Language\nCTA Effectiveness\nCompliance\nAudience Targeting',
        threshold: 75,
    },
]

export function generateShareToken() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    return 'rev-' + Array.from({ length: 8 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('')
}
