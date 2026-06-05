import { useLocation } from 'react-router-dom';
import InvocaShell from '@/components/invoca/InvocaShell';
import CallTrending from '@/components/invoca/sections/CallTrending';
import MarketingTrio, { TrioRow } from '@/components/invoca/sections/MarketingTrio';
import DataTable from '@/components/invoca/sections/DataTable';
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
  // Pad to 5 rows to keep visual layout
  while (campaignRows.length < 5) {
    const i = campaignRows.length;
    const r = seededRand(seed + '-camp' + i)();
    campaignRows.push({ label: `Campaign ${i + 1}`, calls: Math.round(50 + r * 150), apptPct: Math.round(30 + r * 50) });
  }
  const searchRows: TrioRow[] = data.searchTerms.map(s => ({ label: s.term, calls: s.calls, apptPct: s.apptPct }));

  return (
    <InvocaShell networkName={data.networkName}>
      <div className="px-[30px] py-[20px] space-y-6 bg-white">
        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-6">
          <KpiTile label="Avg Call Duration" value="3:49" />
          <KpiTile label="Conversion Rate" value="50%" />
          <KpiTile label={data.inquiryKpiLabel} value={`${data.inquiryKpiPercent}%`} />
        </div>

        {/* Call Trending */}
        <CallTrending categories={data.inquiryTypes} seed={seed} />

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

function KpiTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-md p-6 flex flex-col items-center justify-center min-h-[160px]">
      <div className="text-[14px] text-[#0F2540] text-center mb-3 font-normal">{label}</div>
      <div className="text-[56px] leading-none font-semibold text-[#0F2540]">{value}</div>
    </div>
  );
}
