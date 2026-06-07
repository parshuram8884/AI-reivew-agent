import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"
import Sidebar from "../components/layout/Sidebar"

// ─── Helpers ────────────────────────────────────────────────────────────────

function ScoreMeter({ value, label, color }) {
  const clr =
    value >= 75 ? "from-emerald-500 to-emerald-400" :
      value >= 50 ? "from-amber-500 to-amber-400" :
        "from-red-500 to-red-400"
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full bg-gradient-to-r ${clr} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function CriteriaGrid({ criteria }) {
  if (!Array.isArray(criteria) || criteria.length === 0) return null
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {criteria.map((c, i) => {
        const score = c.score ?? 0
        const color = score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400"
        const bar = score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
        return (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="mb-1 text-[10px] uppercase tracking-widest text-slate-500 truncate">{c.name}</div>
            <div className={`text-lg font-bold ${color}`}>{score}<span className="text-xs text-slate-600">/100</span></div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-800">
              <div className={`h-full ${bar} rounded-full`} style={{ width: `${score}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Detail Panel ────────────────────────────────────────────────────────────

function DetailPanel({ row, onClose }) {
  if (!row) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" style={{ background: "rgba(2,6,23,.75)", backdropFilter: "blur(4px)" }}>
      <div
        className="flex h-screen w-full max-w-[520px] flex-col overflow-hidden border-l border-slate-800 bg-[#0b1120]"
        style={{ animation: "slideIn .22s cubic-bezier(.22,1,.36,1)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-6">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {row.confidence_score < 70 && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                  Low Confidence
                </span>
              )}
              {row.confidence_score >= 70 && (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  High Confidence
                </span>
              )}
            </div>
            <h2 className="text-base font-semibold leading-snug text-slate-50">{row.title || "Untitled"}</h2>
            <p className="mt-1 text-xs text-slate-500">{row.employee_name} · {row.category} · <span className="font-mono text-slate-600">{row.share_token}</span></p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-500 hover:text-white"
          >
            ✕ Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Scores */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Overall Score</div>
              <div className={`mt-2 text-3xl font-black ${row.overall_score >= 75 ? "text-emerald-400" : row.overall_score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                {row.overall_score}
                <span className="text-sm font-normal text-slate-600">/100</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">AI Confidence</div>
              <div className={`mt-2 text-3xl font-black ${row.confidence_score >= 70 ? "text-emerald-400" : row.confidence_score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                {row.confidence_score}
                <span className="text-sm font-normal text-slate-600">%</span>
              </div>
            </div>
          </div>

          {/* Criteria Breakdown */}
          {Array.isArray(row.criteria_scores) && row.criteria_scores.length > 0 && (
            <div>
              <SectionHeading label="Criteria Breakdown" color="text-blue-400" />
              <CriteriaGrid criteria={row.criteria_scores} />
            </div>
          )}

          {/* Summary */}
          {row.summary && (
            <div>
              <SectionHeading label="AI Summary" color="text-slate-400" />
              <p className="text-sm leading-7 text-slate-300">{row.summary}</p>
            </div>
          )}

          {/* Content */}
          {row.content && (
            <div>
              <SectionHeading label="Submitted Content" color="text-slate-400" />
              <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm leading-7 text-slate-400">
                {row.content}
              </div>
            </div>
          )}

          {/* Strengths */}
          {Array.isArray(row.strengths) && row.strengths.length > 0 && (
            <div>
              <SectionHeading label="Strengths" color="text-emerald-400" />
              <ul className="space-y-2">
                {row.strengths.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-6 text-slate-200">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {Array.isArray(row.weaknesses) && row.weaknesses.length > 0 && (
            <div>
              <SectionHeading label="Weaknesses" color="text-red-400" />
              <ul className="space-y-2">
                {row.weaknesses.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-6 text-slate-200">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {Array.isArray(row.suggestions) && row.suggestions.length > 0 && (
            <div>
              <SectionHeading label="Suggestions" color="text-blue-400" />
              <ul className="space-y-2">
                {row.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-6 text-slate-200">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ label, color }) {
  return <div className={`mb-3 text-[10px] font-bold uppercase tracking-widest ${color}`}>{label}</div>
}

// ─── Table Row ────────────────────────────────────────────────────────────────

function TableRow({ row, onClick }) {
  const scoreColor =
    row.overall_score >= 75 ? "text-emerald-400" :
      row.overall_score >= 50 ? "text-amber-400" : "text-red-400"

  const confColor =
    row.confidence_score >= 70 ? "text-emerald-400" :
      row.confidence_score >= 50 ? "text-amber-400" : "text-red-400"

  return (
    <tr
      onClick={onClick}
      className="group cursor-pointer border-b border-slate-800/60 transition hover:bg-slate-800/40"
    >
      <td className="px-4 py-3.5">
        <div className="font-medium text-slate-100 text-sm leading-snug group-hover:text-white transition">{row.title || "—"}</div>
        <div className="mt-0.5 font-mono text-[10px] text-slate-600">{row.share_token}</div>
      </td>
      <td className="px-4 py-3.5 text-sm text-slate-400">{row.employee_name || "—"}</td>
      <td className="px-4 py-3.5 text-sm text-slate-400">{row.category || "—"}</td>
      <td className="px-4 py-3.5 text-right">
        <span className={`text-base font-bold tabular-nums ${scoreColor}`}>{row.overall_score}</span>
      </td>
      <td className="px-4 py-3.5 text-right">
        <span className={`text-base font-bold tabular-nums ${confColor}`}>{row.confidence_score}%</span>
      </td>
      <td className="px-4 py-3.5 text-right">
        <span className="text-xs text-slate-600 group-hover:text-slate-400 transition">View →</span>
      </td>
    </tr>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const SORT_KEYS = [
  { key: "title", label: "Title" },
  { key: "employee_name", label: "Employee" },
  { key: "overall_score", label: "Score" },
  { key: "confidence_score", label: "Confidence" },
]

export default function SubmissionsDatabase() {
  const { user, loading } = useAuth()

  const [rows, setRows] = useState([])
  const [fetching, setFetching] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState("")
  const [confFilter, setConfFilter] = useState("all")
  const [sortKey, setSortKey] = useState("overall_score")
  const [sortDir, setSortDir] = useState("desc")

  useEffect(() => {
    if (loading) return
      ; (async () => {
        try {
          let agentTokens = []

          if (user?.id) {
            const { data: agents, error } = await supabase
              .from("agents")
              .select("share_token")
              .eq("created_by", user.id)
            if (!error && Array.isArray(agents))
              agentTokens = agents.map((a) => a.share_token).filter(Boolean)
          }

          if (!agentTokens.length) {
            const stored = JSON.parse(sessionStorage.getItem("rb_agents") || "[]")
            agentTokens = stored.map((a) => a.shareToken).filter(Boolean)
          }

          if (!agentTokens.length) { setFetching(false); return }

          const { data: submissions, error: subError } = await supabase
            .from("submissions")
            .select(
              "share_token, employee_name, title, category, content, summary, overall_score, confidence_score, criteria_scores, strengths, weaknesses, suggestions"
            )
            .in("share_token", agentTokens)

          if (subError) throw subError

          setRows(
            (submissions || []).map((s, idx) => ({
              id: s.id ?? idx,
              share_token: s.share_token ?? "",
              employee_name: s.employee_name ?? "",
              title: s.title ?? "",
              category: s.category ?? "",
              content: s.content ?? "",
              summary: s.summary ?? "",
              overall_score: s.overall_score ?? 0,
              confidence_score: s.confidence_score ?? 0,
              criteria_scores: Array.isArray(s.criteria_scores) ? s.criteria_scores : [],
              strengths: Array.isArray(s.strengths) ? s.strengths : [],
              weaknesses: Array.isArray(s.weaknesses) ? s.weaknesses : [],
              suggestions: Array.isArray(s.suggestions) ? s.suggestions : [],
            }))
          )
        } catch (err) {
          console.warn("DB page load error:", err)
        } finally {
          setFetching(false)
        }
      })()
  }, [loading])

  // ── Derived data ──────────────────────────────────────────────────────────
  const q = search.trim().toLowerCase()

  const filtered = rows
    .filter((r) => {
      if (q) {
        const hit =
          r.employee_name.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.share_token.toLowerCase().includes(q)
        if (!hit) return false
      }
      if (confFilter === "high" && r.confidence_score < 70) return false
      if (confFilter === "low" && r.confidence_score >= 70) return false
      return true
    })
    .sort((a, b) => {
      const av = a[sortKey] ?? ""
      const bv = b[sortKey] ?? ""
      if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("desc") }
  }

  // ── Summary stats ─────────────────────────────────────────────────────────
  const stats = {
    total: rows.length,
    highConf: rows.filter((r) => r.confidence_score >= 70).length,
    lowConf: rows.filter((r) => r.confidence_score < 70).length,
    avgScore: rows.length ? Math.round(rows.reduce((s, r) => s + r.overall_score, 0) / rows.length) : 0,
    avgConf: rows.length ? Math.round(rows.reduce((s, r) => s + r.confidence_score, 0) / rows.length) : 0,
  }

  const selectedRow = selected !== null ? rows.find((r) => r.id === selected) ?? null : null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <style>{`
        @keyframes slideIn { from { transform: translateX(32px); opacity: 0 } to { transform: none; opacity: 1 } }
        @keyframes fadeUp  { from { transform: translateY(12px); opacity: 0 } to { transform: none; opacity: 1 } }
        .fade-up { animation: fadeUp .3s ease both }
      `}</style>

      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 overflow-hidden p-6 sm:p-8">
          {/* Page Header */}
          <div className="mb-8 fade-up">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">Manager View</p>
                <h1 className="text-2xl font-black tracking-tight text-white">Submissions Database</h1>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">
                {fetching ? "Loading…" : `${filtered.length} / ${rows.length} records`}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5 fade-up" style={{ animationDelay: ".05s" }}>
            {[
              { label: "Total", value: stats.total, color: "text-slate-100" },
              { label: "High Conf.", value: stats.highConf, color: "text-emerald-400" },
              { label: "Low Conf.", value: stats.lowConf, color: "text-amber-400" },
              { label: "Avg Score", value: stats.avgScore, color: stats.avgScore >= 75 ? "text-emerald-400" : stats.avgScore >= 50 ? "text-amber-400" : "text-red-400" },
              { label: "Avg Conf.", value: `${stats.avgConf}%`, color: stats.avgConf >= 70 ? "text-emerald-400" : stats.avgConf >= 50 ? "text-amber-400" : "text-red-400" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{s.label}</div>
                <div className={`mt-2 text-2xl font-black tabular-nums ${s.color}`}>{s.value}{s.label === "Avg Score" ? "" : ""}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-3 fade-up" style={{ animationDelay: ".1s" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, title, category, token…"
              className="flex-1 min-w-[180px] rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-blue-500 transition"
            />

            <select
              value={confFilter}
              onChange={(e) => setConfFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-blue-500 transition"
            >
              <option value="all">All Confidence</option>
              <option value="high">High (≥70%)</option>
              <option value="low">Low (&lt;70%)</option>
            </select>
          </div>

          {/* Table */}
          <div className="fade-up rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden" style={{ animationDelay: ".15s" }}>
            {fetching ? (
              <div className="flex items-center justify-center py-24 text-slate-500 text-sm">
                <svg className="mr-3 h-5 w-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading submissions…
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-24 text-center text-sm text-slate-500">No records match your filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60">
                      {[
                        { key: "title", label: "Title / Token" },
                        { key: "employee_name", label: "Employee" },
                        { key: "category", label: "Category" },
                        { key: "overall_score", label: "Score", right: true },
                        { key: "confidence_score", label: "Conf.", right: true },
                        { key: null, label: "", right: true },
                      ].map((col, i) => (
                        <th
                          key={i}
                          onClick={() => col.key && toggleSort(col.key)}
                          className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 ${col.key ? "cursor-pointer select-none hover:text-slate-200 transition" : ""} ${col.right ? "text-right" : ""}`}
                        >
                          {col.label}
                          {col.key && sortKey === col.key && (
                            <span className="ml-1 text-blue-400">{sortDir === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <TableRow key={row.id} row={row} onClick={() => setSelected(row.id)} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Detail Drawer */}
      {selectedRow && <DetailPanel row={selectedRow} onClose={() => setSelected(null)} />}
    </div>
  )
}