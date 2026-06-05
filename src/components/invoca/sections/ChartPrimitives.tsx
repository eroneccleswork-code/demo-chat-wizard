// Color palette matching the reference Invoca dashboard charts.
export const CHART_COLORS = ['#3B82F6', '#2D8B47', '#E5685D', '#1FA37A', '#A78BFA'];
export const TRENDING_COLORS = ['#3B82F6', '#2D8B47', '#E5685D'];

interface Row { label: string; value: number }

export function HBarChart({ rows, max, showPercent = false, colors = CHART_COLORS }: {
  rows: Row[]; max: number; showPercent?: boolean; colors?: string[];
}) {
  const ticks = showPercent
    ? [0, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max]
    : [0, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max];
  return (
    <div className="px-5 pt-2 pb-4">
      <div className="space-y-3">
        {rows.map((r, i) => {
          const pct = Math.max(2, (r.value / max) * 100);
          const color = colors[i % colors.length];
          const labelInsideMin = 14; // need enough width to show label inside
          const showInside = pct > labelInsideMin;
          return (
            <div key={r.label} className="grid grid-cols-[110px_1fr] items-center gap-3">
              <div className="text-[12px] text-[#0F2540] text-right leading-tight whitespace-pre-wrap">{r.label}</div>
              <div className="relative h-7">
                <div
                  className="h-full rounded-[6px] flex items-center justify-center text-white text-[13px] font-semibold shadow-[0_1px_0_rgba(15,37,64,0.04)]"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                >
                  {showInside && (showPercent ? `${r.value}%` : r.value)}
                </div>
                {!showInside && (
                  <span className="absolute left-[calc(var(--w)+6px)] top-1/2 -translate-y-1/2 text-[12px] text-[#0F2540]"
                        style={{ ['--w' as any]: `${pct}%` }}>
                    {showPercent ? `${r.value}%` : r.value}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-[110px_1fr] gap-3 mt-3">
        <div />
        <div className="relative h-4 text-[10px] text-[#5B6B7E]">
          {ticks.map((t, i) => (
            <span key={i} className="absolute -translate-x-1/2" style={{ left: `${(i / (ticks.length - 1)) * 100}%` }}>
              {showPercent ? `${t}%` : t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PanelCard({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#EAECEF] rounded-lg overflow-hidden flex flex-col shadow-[0_1px_2px_rgba(15,37,64,0.04)]">
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold text-[#0F2540] tracking-tight truncate">{title}</h3>
          {badge && (
            <span className="inline-block mt-2 text-[10px] font-semibold tracking-wide text-[#5B6B7E] bg-[#F3F4F6] rounded px-2 py-1">
              {badge}
            </span>
          )}
        </div>
        <button className="text-[#9CA3AF] hover:text-[#5B6B7E] text-lg leading-none shrink-0">⋮</button>
      </div>
      {children}
    </div>
  );
}
