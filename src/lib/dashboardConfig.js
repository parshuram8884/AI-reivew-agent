/**
 * Dashboard configuration and helper functions
 */

export const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        classes: "border-sky-500/30 bg-sky-500/10 text-sky-200",
    },
    approved: {
        label: "Approved",
        classes: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    },
    rejected: {
        label: "Rejected",
        classes: "border-red-500/30 bg-red-500/10 text-red-200",
    },
    feedback_sent: {
        label: "Feedback Sent",
        classes: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    },
}

export const TAB_META = {
    high: {
        badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
        message:
            "✓ These submissions passed AI review with high confidence (≥70%). AI has already decided. You can review, override, or accept the AI decision.",
    },
    low: {
        badge: "bg-amber-500/10 border-amber-500/20 text-amber-200",
        message:
            "⚠ These submissions had low AI confidence (<70%). AI was unsure. Each requires your manual review and decision before the employee is notified.",
    },
}

export function getStatusBadge(status) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
    return config
}

export function getScoreColorClasses(score) {
    if (score >= 75) return "bg-emerald-500 text-emerald-400"
    if (score >= 50) return "bg-amber-500 text-amber-300"
    return "bg-red-500 text-red-300"
}
