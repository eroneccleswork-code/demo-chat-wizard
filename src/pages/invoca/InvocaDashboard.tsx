import { useLocation } from 'react-router-dom';
import { ChevronDown, Download, History, MoreVertical } from 'lucide-react';
import InvocaShell from '@/components/invoca/InvocaShell';
import MarketingTrio, { TrioRow } from '@/components/invoca/sections/MarketingTrio';
import DataTable from '@/components/invoca/sections/DataTable';
import { useIndustryDashboard, seededRand } from '@/lib/invoca-industry';
import callTrendingImg from '@/assets/invoca-call-trending-v2.png.asset.json';

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
  const loc = useLocation() as { state?: { companyName?: string; industry?: string; websiteContext?: string } };
  const company = loc.state?.companyName;
  const industry = loc.state?.industry;
  const data = useIndustryDashboard(company, industry, loc.state?.websiteContext);
  const seed = `${company || 'invoca'}-${industry || 'healthcare'}`;

  const sourceRows = buildRows(SOURCE_LABELS, seed + '-source', 650);
  const mediumRows = buildRows(MEDIUM_LABELS, seed + '-medium', 650);
  const campaignRows: TrioRow[] = data.campaigns.map(c => ({
    label: c.name.length > 22 ? c.name.slice(0, 20) + '…' : c.name,
    calls: c.calls,
    apptPct: c.apptPct,
  }));
  while (campaignRows.length < 5) {
    const i = campaignRows.length;
    const r = seededRand(seed + '-camp' + i)();
    campaignRows.push({ label: `Campaign ${i + 1}`, calls: Math.round(50 + r * 150), apptPct: Math.round(30 + r * 50) });
  }
  const searchRows: TrioRow[] = data.searchTerms.map(s => ({ label: s.term, calls: s.calls, apptPct: s.apptPct }));

  return (
    <InvocaShell networkName={data.networkName}>
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

        {/* KPI Row — Total Calls / New {Noun} / Existing {Noun} */}
        <KpiRow industry={industry} />


        {/* Call Trending */}
        <img src={callTrendingImg.url} alt="Call Trending" className="block w-full h-auto select-none" draggable={false} />

        {/* 4 trio rows */}
        <MarketingTrio category="Source" rows={sourceRows} callsAxisMax={800}
          appointmentsBadge="MARKETING SOURCE: …" />
        <MarketingTrio category="Medium" rows={mediumRows} callsAxisMax={800}
          appointmentsBadge="MARKETING MEDIUM: …" />
        <MarketingTrio category="Campaign" rows={campaignRows} />
        <MarketingTrio category="Search Terms" rows={searchRows} />

        {/* Lines of Business */}
        <DataTable title="LINES OF BUSINESS" columnLabel="Line of Business" rows={data.linesOfBusiness} />

        {/* Divisions */}
        <DataTable title="DIVISIONS" columnLabel="Division" rows={data.divisions} />
      </div>
    </InvocaShell>
  );
}

function KpiRow({ industry }: { industry?: string }) {
  const isHealthcare = (industry || '').toLowerCase().includes('health') ||
    (industry || '').toLowerCase().includes('medical') ||
    (industry || '').toLowerCase().includes('patient') ||
    !industry;
  const noun = isHealthcare ? 'Patient' : 'Customer';
  const nounPlural = noun + 's';
  return (
    <div className="grid grid-cols-3 gap-6">
      <KpiPanel title="TOTAL CALLS">
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="text-center border-r border-[#EAECEF]">
            <div className="text-[13px] text-[#0F2540] mb-2">Call Count</div>
            <div className="text-[44px] leading-none font-semibold text-[#0F2540]">1,309</div>
          </div>
          <div className="text-center">
            <div className="text-[13px] text-[#0F2540] mb-2">Avg. Duration</div>
            <div className="text-[44px] leading-none font-semibold text-[#0F2540]">4:13</div>
          </div>
        </div>
        <div className="text-center mt-8">
          <div className="text-[13px] text-[#0F2540] mb-2">Avg. Connected Duration</div>
          <div className="text-[44px] leading-none font-semibold text-[#0F2540]">3:49</div>
        </div>
      </KpiPanel>
      <KpiPanel title={`NEW ${nounPlural.toUpperCase()}`}>
        <SingleStat label={`Caller Type: New ${nounPlural} (Count)`} value="890" />
        <SingleStat label="Appointment: Scheduled (Percent)" value="50%" />
      </KpiPanel>
      <KpiPanel title={`EXISTING ${nounPlural.toUpperCase()}`}>
        <SingleStat label={`Caller Type: Existing ${noun} (Count)`} value="416" />
        <SingleStat label="Inquiry Type: Billing and Payments (Percent)" value="21%" />
      </KpiPanel>
    </div>
  );
}

function KpiPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#EAECEF] rounded-lg p-6 min-h-[260px] shadow-[0_1px_2px_rgba(15,37,64,0.04)]">
      <div className="flex items-start justify-between">
        <div className="text-[13px] font-semibold tracking-wide text-[#0F2540] uppercase">{title}</div>
        <MoreVertical className="w-4 h-4 text-[#9CA3AF]" />
      </div>
      {children}
    </div>
  );
}

function SingleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center mt-6">
      <div className="text-[13px] text-[#0F2540] mb-2">{label}</div>
      <div className="text-[44px] leading-none font-semibold text-[#0F2540]">{value}</div>
    </div>
  );
}

