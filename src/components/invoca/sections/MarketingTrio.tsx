import { HBarChart, PanelCard, CHART_COLORS } from './ChartPrimitives';
import { industryTerms } from '@/lib/invoca-industry';

export interface TrioRow { label: string; calls: number; apptPct: number }

interface Props {
  category: string; // "Source" | "Medium" | "Campaign" | "Search Terms"
  rows: TrioRow[];
  callsAxisMax?: number;
  appointmentsBadge?: string;
  industry?: string;
}

export default function MarketingTrio({ category, rows, callsAxisMax, appointmentsBadge, industry }: Props) {
  const t = industryTerms(industry);
  const callsRows = [...rows].sort((a, b) => b.calls - a.calls);
  const apptRows = [...rows].sort((a, b) => b.apptPct - a.apptPct);
  const maxCalls = callsAxisMax ?? (Math.ceil(Math.max(...rows.map(r => r.calls)) / 100) * 100 || 800);

  return (
    <div className="grid grid-cols-3 gap-6">
      <PanelCard title="Calls">
        <HBarChart
          rows={callsRows.map(r => ({ label: r.label, value: r.calls }))}
          max={maxCalls}
        />
      </PanelCard>

      <PanelCard
        title={t.apptTitleShort}
        badge={appointmentsBadge || `${t.apptShort}`}
      >
        <HBarChart
          rows={apptRows.map(r => ({ label: r.label, value: r.apptPct }))}
          max={Math.max(95, Math.ceil(Math.max(...rows.map(r => r.apptPct)) / 5) * 5)}
          showPercent
        />
      </PanelCard>

      <PanelCard title={`${t.apptShort} & Calls`}>
        <div className="px-5 pb-4">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] text-[13px] font-semibold text-[#0F2540] py-2 border-b border-[#F3F4F6]">
            <div>Marketing {category.split(' ')[0].slice(0, 10)}…</div>
            <div>Call Count</div>
            <div>{t.apptShort}</div>
          </div>
          {callsRows.map((r, i) => (
            <div key={r.label} className="grid grid-cols-[1.4fr_1fr_1fr] text-[14px] text-[#0F2540] py-3 border-b border-[#F3F4F6]">
              <div className="truncate pr-2">{r.label}</div>
              <div>{r.calls}</div>
              <div>{r.apptPct}%</div>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}
