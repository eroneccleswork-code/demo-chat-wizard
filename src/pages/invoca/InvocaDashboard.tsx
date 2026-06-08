import { useLocation } from 'react-router-dom';
import { ChevronDown, Download, History, MoreVertical } from 'lucide-react';
import InvocaShell from '@/components/invoca/InvocaShell';
import MarketingTrio, { TrioRow } from '@/components/invoca/sections/MarketingTrio';
import DataTable from '@/components/invoca/sections/DataTable';
import KpiRow from '@/components/invoca/sections/KpiRow';
import CallTrending from '@/components/invoca/sections/CallTrending';
import { useIndustryDashboard, seededRand } from '@/lib/invoca-industry';

const SOURCE_LABELS = ['Paid Search', 'Organic', 'Direct Mail', 'Email', 'Social Media'];
const MEDIUM_LABELS = ['cpc', 'organic', 'Post Card', 'SFMC', 'Facebook'];

function buildRows(labels: string[], seed: string, callBase: number): TrioRow[] {
  const r = seededRand(seed);
  return labels.map((label, i) => ({
    label,
    calls: Math.round(callBase * (1 - i * 0.18) * (0.85 + r() * 0.3)),
    apptPct: Math.round(20 + r() * 70),
  }));
}

export default function InvocaDashboard() {
  const loc = useLocation() as { state?: { companyName?: string; industry?: string; websiteContext?: string; customSignals?: string[] } };
  const company = loc.state?.companyName;
  const industry = loc.state?.industry;
  const websiteContext = loc.state?.websiteContext;
  const customSignals = loc.state?.customSignals;
  // Persist so other Invoca pages (Call Report, etc.) keep the same context after sidebar navigation
  if (typeof window !== 'undefined' && (company || industry || customSignals)) {
    try { sessionStorage.setItem('invoca-context', JSON.stringify({ companyName: company, industry, websiteContext, customSignals })); } catch {}
  }
  const data = useIndustryDashboard(company, industry, websiteContext);
  const seed = `${company || 'invoca'}-${industry || 'healthcare'}`;

  const sourceRows = buildRows(SOURCE_LABELS, seed + '-source', 650);
  const mediumRows = buildRows(MEDIUM_LABELS, seed + '-medium', 650);
  // Reconcile totals: campaign + search calls should roughly equal source/medium totals
  const totalCalls = sourceRows.reduce((s, r) => s + r.calls, 0);

  const rawCampaigns: TrioRow[] = data.campaigns.map(c => ({
    label: c.name.length > 22 ? c.name.slice(0, 20) + '…' : c.name,
    calls: c.calls,
    apptPct: Math.round(c.apptPct),
  }));
  while (rawCampaigns.length < 5) {
    const i = rawCampaigns.length;
    const r = seededRand(seed + '-camp' + i)();
    rawCampaigns.push({ label: `Campaign ${i + 1}`, calls: Math.round(50 + r * 150), apptPct: Math.round(30 + r * 50) });
  }
  const campTotal = rawCampaigns.reduce((s, r) => s + r.calls, 0) || 1;
  const campScale = totalCalls / campTotal;
  const campaignRows: TrioRow[] = rawCampaigns.map(r => ({
    ...r,
    calls: Math.max(1, Math.round(r.calls * campScale)),
  }));

  const rawSearch: TrioRow[] = data.searchTerms.map(s => ({ label: s.term, calls: s.calls, apptPct: Math.round(s.apptPct) }));
  const searchTotal = rawSearch.reduce((s, r) => s + r.calls, 0) || 1;
  const searchScale = (totalCalls * 0.85) / searchTotal;
  const searchRows: TrioRow[] = rawSearch.map(r => ({
    ...r,
    calls: Math.max(1, Math.round(r.calls * searchScale)),
  }));

  return (
    <InvocaShell networkName={company || data.networkName}>
      <div className="px-8 py-6 space-y-6 bg-white">
        {/* Dashboard Header */}
        <div>
          <div className="text-[12px] font-semibold tracking-wide text-[#2D6CDF] uppercase mb-2">Manage Dashboards</div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[26px] font-semibold text-[#0F2540] tracking-tight">ADVANCED CALL TRACKING: Optimization</h1>
                <ChevronDown className="w-5 h-5 text-[#0F2540]" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="bg-[#C8F0D4] text-[#1F6B3A] text-[12px] font-medium rounded-full px-3 py-0.5">Shared</span>
                <span className="bg-[#C8F0D4] text-[#1F6B3A] text-[12px] font-medium rounded-full px-3 py-0.5">View Only</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button className="border border-[#0F2540] rounded-full px-3 py-1 text-[13px] font-medium text-[#0F2540]">{(() => { const n = new Date(); const s = new Date(n.getFullYear(), n.getMonth(), 1); const e = new Date(n.getFullYear(), n.getMonth() + 1, 0); const f = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`; return `${f(s)}-${f(e)}`; })()}</button>
                <button className="border border-[#D1D5DB] rounded-full px-3 py-1 text-[13px] font-medium text-[#0F2540]">Marketing Data</button>
                <button className="border border-[#D1D5DB] rounded-full px-3 py-1 text-[13px] font-medium text-[#0F2540]">Signals</button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#6B7280] pt-1">
              <Download className="w-5 h-5" />
              <div className="relative">
                <History className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#2D6CDF]" />
              </div>
              <MoreVertical className="w-5 h-5" />
            </div>
          </div>
          <div className="border-t border-[#E5E7EB] mt-4" />
        </div>

        {/* KPI Row — Total Calls / New / Existing */}
        <KpiRow industry={industry} inquiryLabel={data.inquiryKpiLabel} inquiryPct={data.inquiryKpiPercent} />

        {/* Call Trending */}
        <CallTrending categories={data.inquiryTypes} seed={seed + '-trend'} />

        {/* 4 trio rows */}
        <MarketingTrio category="Source" rows={sourceRows} callsAxisMax={800} industry={industry}
          appointmentsBadge="MARKETING SOURCE: …" />
        <MarketingTrio category="Medium" rows={mediumRows} callsAxisMax={800} industry={industry}
          appointmentsBadge="MARKETING MEDIUM: …" />
        <MarketingTrio category="Campaign" rows={campaignRows} industry={industry} />
        <MarketingTrio category="Search Terms" rows={searchRows} industry={industry} />

        {/* Lines of Business */}
        <DataTable title="LINES OF BUSINESS" columnLabel="Line of Business" rows={data.linesOfBusiness} industry={industry} />

        {/* Divisions */}
        <DataTable title="DIVISIONS" columnLabel="Division" rows={data.divisions} industry={industry} />
      </div>
    </InvocaShell>
  );
}

function KpiPanel({ title, topLabel, topValue, bottomLabel, bottomValue }: {
  title: string; topLabel: string; topValue: string; bottomLabel: string; bottomValue: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-md p-6 min-h-[260px]">
      <div className="flex items-start justify-between">
        <div className="text-[13px] font-semibold tracking-wide text-[#6B7280] uppercase">{title}</div>
        <MoreVertical className="w-4 h-4 text-[#9CA3AF]" />
      </div>
      <div className="text-center mt-6">
        <div className="text-[13px] text-[#0F2540] mb-2">{topLabel}</div>
        <div className="text-[44px] leading-none font-semibold text-[#0F2540]">{topValue}</div>
      </div>
      <div className="text-center mt-6">
        <div className="text-[13px] text-[#0F2540] mb-2">{bottomLabel}</div>
        <div className="text-[44px] leading-none font-semibold text-[#0F2540]">{bottomValue}</div>
      </div>
    </div>
  );
}

