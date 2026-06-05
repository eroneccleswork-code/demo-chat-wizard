import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Share2, Download, Clock, Plus, FileSearch } from 'lucide-react';
import InvocaShell from '@/components/invoca/InvocaShell';
import { seededRand, isHomeService, useIndustryDashboard } from '@/lib/invoca-industry';
import callDetailsIcon from '@/assets/call-details-icon.png.asset.json';


// ---- Industry-aware column data ----
function getIndustryConfig(industry?: string) {
  const home = isHomeService(industry);
  return {
    home,
    facilityLabel: home ? 'Branch' : 'Facility',
    specialtyLabel: home ? 'Service' : 'Specialty',
    facilities: home
      ? ['Northeast Branch', 'Pacific Branch', 'Mountain West Branch', 'Southeast Branch']
      : ["St Luke's Orthopedic", 'Joint Rehab Center', 'CardioVascular Institute', 'Elizabeth Medical Center'],
    specialties: home
      ? ['Windows', 'Roofing', 'HVAC', 'Gutters']
      : ['Orthopedics', 'Oncology', 'Heart and Vascular', 'Primary Care'],
    divisions: home
      ? ['New England', 'South', 'Mid-West', 'Mountain States']
      : ['New England', 'South', 'Mid-West', 'Mountain States'],
    lobOptions: home ? ['Install', 'Service', 'Estimate'] : ['Surgery', 'Medical', 'Surgery', 'Medical'],
    callerTypeNew: home ? 'Caller Type: New Customers' : 'Caller Type: New Patients',
    callerTypeExisting: home ? 'Caller Type: Existing Customer …' : 'Caller Type: Existing Patient …',
    apptScheduled: home ? 'Estimate: Scheduled' : 'Appointment: Scheduled',
    apptRescheduled: home ? 'Estimate: Rescheduled …' : 'Appointment: Rescheduled …',
    apptCanceled: home ? 'Estimate: Canceled' : 'Appointment: Canceled',
    existingQuality: home ? 'Existing Customer Call Quality' : 'Existing Patient Call Quality',
    qaInsurance: home ? '(QA) Financing' : '(QA) Insurance',
    insCommercial: home ? 'Financing Type: 3rd Party' : 'Insurance Type: Commercial',
    insMedicare: home ? 'Financing Type: In-House' : 'Insurance Type: Medicare',
    insPrivate: home ? 'Payment Type: Cash' : 'Insurance Type: Private Pay',
    sourceDomain: home ? 'renewalsathome.com' : 'stlukesmedical.com',
    landingPath: home ? '/service/windows' : '/service/orthopedics',
    websiteJourney: home ? 'home/products/service/windows' : 'home/surgery/service/orthopedics',
  };
}

const SOURCES = ['Paid Search', 'Direct Mail', 'Radio', 'Print', 'Social Media', 'Email', 'Organic'];
const MEDIUMS: Record<string, string> = {
  'Paid Search': 'Google Ad', 'Direct Mail': 'Post Card', 'Radio': '—', 'Print': '—',
  'Social Media': 'Facebook', 'Email': 'SFMC', 'Organic': '—',
};
const END_REASONS = ['Success (OK)', 'Success (OK)', 'Success (OK)', 'Destination No Answer', 'Destination No Answer: Voice Mail'];
const PHONES = ['866-398-7557', '800-593-6000', '888-545-6000', '888-712-3456', '877-844-7575'];

function maskPhone(s: string) {
  return s.length > 9 ? s.slice(0, 9) + '…' : s;
}

interface Row {
  time: string; callerId: string; phone: string; division: string; facility: string; specialty: string;
  duration: string; endReason: string; source: string; medium: string; campaign: string; searchTerm: string;
  landingUrl: string; gclid: string; gaClientId: string; msClickId: string; adobeId: string;
  websiteJourney: string; callingPage: string; lob: string;
  newPatient: boolean; existingPatient: boolean; scheduling: boolean; apptSched: boolean; qaIns: boolean;
  apptResched: boolean; apptCanceled: boolean; billing: boolean; availability: boolean;
  insCommercial: boolean; insMedicare: boolean; insPrivate: boolean;
  agentQ: number; legal: number; existQ: number;
}

function buildRows(cfg: ReturnType<typeof getIndustryConfig>, seed: string, campaigns: string[], terms: string[]): Row[] {
  const r = seededRand(seed);
  return Array.from({ length: 40 }, (_, i) => {
    const d = (i % 30) + 1;
    const hrs24 = 8 + (i % 12);
    const hrs = hrs24 > 12 ? hrs24 - 12 : hrs24;
    const ampm = hrs24 >= 12 ? 'pm' : 'am';
    const mins = (i * 7) % 60;
    const src = SOURCES[i % SOURCES.length];
    const camp = campaigns[i % campaigns.length] || 'Restoring hope';
    const hasLanding = src === 'Paid Search' || src === 'Social Media';
    const term = src === 'Paid Search' ? terms[i % terms.length] : '—';
    const showGclid = src === 'Paid Search' && i % 3 === 0;
    return {
      time: `3/${d}/22 ${hrs}:${mins.toString().padStart(2, '0')} ${ampm}`,
      callerId: `${(700 + i * 13) % 900 + 100}-${(200 + i * 7) % 900 + 100}-${((1000 + i * 173) % 9000).toString().padStart(4, '0')}`.slice(0, 12) + '…',
      phone: PHONES[i % PHONES.length],
      division: cfg.divisions[i % cfg.divisions.length],
      facility: cfg.facilities[(i + 1) % cfg.facilities.length],
      specialty: cfg.specialties[(i + 2) % cfg.specialties.length],
      duration: `${Math.floor(r() * 5)}:${Math.floor(r() * 60).toString().padStart(2, '0')}`,
      endReason: END_REASONS[i % END_REASONS.length],
      source: src,
      medium: MEDIUMS[src],
      campaign: camp,
      searchTerm: term,
      landingUrl: hasLanding
        ? `www.${cfg.sourceDomain}?utm_source=${src === 'Paid Search' ? 'google' : 'Facebook'}&utm_medium=${src === 'Paid Search' ? 'cpc' : 'Social'}&utm_campaign=FSSL_${1000 + i * 37}`
        : '—',
      gclid: showGclid ? 'Cj0KCQiAj9iBBhCJARIsA…' : '—',
      gaClientId: showGclid ? `${1593940126 + i}.${1614184536 + i * 17}` : '—',
      msClickId: showGclid ? `0584517172569981${(75 + i).toString().padStart(2, '0')}…` : '—',
      adobeId: showGclid ? `0599091840012009465${(100 + i).toString().padStart(3, '0')}…` : '—',
      websiteJourney: showGclid || (i % 6 === 4) ? cfg.websiteJourney : '—',
      callingPage: showGclid || (i % 6 === 4) ? cfg.landingPath : '—',
      lob: cfg.lobOptions[i % cfg.lobOptions.length],
      newPatient: true,
      existingPatient: false,
      scheduling: true,
      apptSched: i % 3 !== 0,
      qaIns: i % 4 !== 0,
      apptResched: i % 2 === 0,
      apptCanceled: false,
      billing: false,
      availability: i % 2 === 1,
      insCommercial: i % 3 === 1,
      insMedicare: i % 5 === 0,
      insPrivate: i % 2 === 0,
      agentQ: 80 + Math.floor(r() * 20),
      legal: 100,
      existQ: i % 4 === 0 ? 57 : 100,
    };
  });
}

const Check = ({ on }: { on: boolean }) => (
  on ? (
    <svg viewBox="0 0 20 20" className="inline-block w-[18px] h-[18px] align-middle" aria-label="yes">
      <circle cx="10" cy="10" r="9" fill="#5FBC63" />
      <path d="M5.8 10.2l2.7 2.7 5.7-5.7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" className="inline-block w-[18px] h-[18px] align-middle" aria-label="no">
      <circle cx="10" cy="10" r="9" fill="#C7CBD1" />
      <path d="M7 7l6 6M13 7l-6 6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
);



const Pill = ({ label, tone = 'gray' }: { label: string; tone?: 'gray' | 'blue' }) => (
  <span className={`ml-1.5 inline-block text-[9px] font-semibold tracking-wide rounded-full px-1.5 py-[1px] align-middle ${
    tone === 'blue' ? 'bg-[#E0EAFB] text-[#2D6CDF]' : 'bg-[#E5E7EB] text-[#6B7280]'
  }`}>{label}</span>
);

// Column definitions — single source of truth for header + cell + width
type Col = { key: string; w: number; head: React.ReactNode; cell: (r: Row) => React.ReactNode; align?: 'left' | 'center' };

export default function InvocaCallReport() {
  const navigate = useNavigate();
  const loc = useLocation() as { state?: { companyName?: string; industry?: string; websiteContext?: string; customSignals?: string[] } };

  // Read persisted context (set by Dashboard on entry)
  const ctx = useMemo(() => {
    if (loc.state?.companyName || loc.state?.industry) return loc.state;
    try {
      const raw = sessionStorage.getItem('invoca-context');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }, [loc.state]);
  const company = ctx?.companyName as string | undefined;
  const industry = ctx?.industry as string | undefined;
  const customSignals = (ctx?.customSignals as string[] | undefined)?.filter(s => s && s.trim()) ?? [];

  const cfg = useMemo(() => getIndustryConfig(industry), [industry]);
  const data = useIndustryDashboard(company, industry, ctx?.websiteContext);

  const rows = useMemo(() => {
    const seed = `${company || 'invoca'}-${industry || 'healthcare'}-report`;
    const camps = data.campaigns.map(c => c.name);
    const terms = data.searchTerms.map(t => t.term);
    return buildRows(cfg, seed, camps, terms);
  }, [cfg, company, industry, data]);

  const cols: Col[] = [
    { key: 'icon', w: 110, head: 'Call Details', cell: () => (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[22px]" aria-label="details">
        <path d="M3 2h12l5 5v15H3z" fill="#4DA9EA" />
        <path d="M15 2v5h5" fill="#2E8FD1" />
        <circle cx="10.5" cy="13.5" r="2.8" fill="none" stroke="#fff" strokeWidth="1.6" />
        <line x1="12.6" y1="15.6" x2="15" y2="18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ) },
    { key: 'time', w: 150, head: <>Call Start Time <span className="text-[#2D6CDF]">↑</span></>, cell: r => r.time },
    { key: 'caller', w: 130, head: 'Caller ID', cell: r => r.callerId },
    { key: 'masked', w: 130, head: 'Masked Caller ID', cell: () => '—' },
    { key: 'phone', w: 180, head: '(Destination) Phone Number', cell: r => r.phone },
    { key: 'div', w: 130, head: 'Division', cell: r => r.division },
    { key: 'fac', w: 200, head: cfg.facilityLabel, cell: r => r.facility },
    { key: 'spec', w: 130, head: cfg.specialtyLabel, cell: r => r.specialty },
    { key: 'dur', w: 150, head: 'Total Connected Duration', cell: r => r.duration },
    { key: 'end', w: 220, head: '(End) of Call Reason', cell: r => r.endReason },
    { key: 'src', w: 130, head: 'Marketing Source', cell: r => r.source },
    { key: 'med', w: 130, head: 'Marketing Medium', cell: r => r.medium },
    { key: 'camp', w: 220, head: 'Marketing Campaign', cell: r => r.campaign },
    { key: 'term', w: 200, head: 'Marketing Search Terms', cell: r => <span className="truncate">{r.searchTerm}</span> },
    { key: 'landing', w: 360, head: 'Full Landing Page URL', cell: r => <span className="text-[12px] truncate block">{r.landingUrl}</span> },
    { key: 'gclid', w: 180, head: 'Google Click ID', cell: r => r.gclid },
    { key: 'ga', w: 200, head: 'Google Analytics Client ID', cell: r => r.gaClientId },
    { key: 'ms', w: 200, head: 'Microsoft Ads Click ID', cell: r => r.msClickId },
    { key: 'adobe', w: 220, head: 'Adobe Experience Cloud ID', cell: r => r.adobeId },
    { key: 'journey', w: 240, head: 'Website Journey', cell: r => r.websiteJourney },
    { key: 'page', w: 180, head: 'Calling Page', cell: r => r.callingPage },
    { key: 'lob', w: 150, head: 'Line of Business', cell: r => r.lob },
    { key: 'qual', w: 180, head: <>Qualified Call<Pill label="RULE" /></>, cell: r => <Check on={r.scheduling} />, align: 'center' },
    { key: 'conv', w: 180, head: <>Converted Call<Pill label="RULE" /></>, cell: r => <Check on={r.apptSched} />, align: 'center' },
    { key: 'insv', w: 200, head: <>{cfg.home ? 'Serviceable Address' : 'Insurance Verified'}<Pill label="RULE" /></>, cell: r => <Check on={r.qaIns} />, align: 'center' },
    ...customSignals.map((label, idx) => ({
      key: `custom-${idx}`,
      w: Math.max(180, label.length * 9 + 60),
      head: <>{label}<Pill label="CUSTOM" tone="blue" /></>,
      cell: (r: Row) => <Check on={((idx + r.agentQ) % 3) !== 0} />,
      align: 'center' as const,
    })),
  ];

  const totalW = cols.reduce((s, c) => s + c.w, 0);

  // Chart bars — stable per company
  const barRand = useMemo(() => seededRand(`${company || 'invoca'}-bars`), [company]);
  const bars = useMemo(() => Array.from({ length: 31 }, () => 170 + Math.floor(barRand() * 40)), [barRand]);
  const convBars = useMemo(() => bars.map(h => Math.max(6, Math.floor(h * 0.11 + barRand() * 8))), [bars, barRand]);
  const [chartView, setChartView] = useState<'calls' | 'conv'>('calls');

  return (
    <InvocaShell networkName={company}>
      <div className="py-6">
        <div className="pl-6 pr-6">
          <div className="text-[13px] text-[#2D6CDF] mb-1">
            <span className="hover:underline cursor-pointer">My Reports</span>{' '}
            <span className="text-gray-400">›</span> Calls
          </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[28px] font-semibold text-[#0F2540]">Marketing Call Details</h1>
            <div className="flex items-center gap-4">
              <a className="text-[#2D6CDF] text-sm hover:underline cursor-pointer">Requested Reports</a>
              <Share2 className="w-5 h-5 text-gray-400" />
              <Download className="w-5 h-5 text-gray-400" />
              <Clock className="w-5 h-5 text-gray-400" />
              <button className="bg-[#2D6CDF] text-white text-sm font-semibold rounded px-5 py-1.5">Save</button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex border border-[#2D6CDF] rounded overflow-hidden">
              <button className="p-2 bg-white text-[#2D6CDF]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
              </button>
              <button className="p-2 bg-white text-gray-400 border-l border-[#2D6CDF]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect y="2" width="16" height="3"/><rect y="7" width="16" height="3"/><rect y="12" width="16" height="3"/></svg>
              </button>
            </div>
            <button className="bg-[#1FA37A] text-white rounded px-4 py-2 text-sm font-medium flex items-center gap-3">
              <span>Custom:</span><span className="font-semibold">Mar 01, 2022 - Mar 31, 2022</span>
            </button>
            <button className="bg-[#2D6CDF] text-white rounded p-2"><Plus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Chart — divider flush to sidebar */}
        <div className="border-t border-[#E5E7EB] pt-6 pb-2 mb-6 pl-6 pr-6">
          <div className="flex items-center gap-6 mb-4 text-xs">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#22A95A] rounded-full" /> Total Calls</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#F5A623] rounded-full" /> Conversions</div>
          </div>
          <div className="flex items-end gap-1 h-[260px] border-l border-b border-[#E5E7EB] pl-3 pb-2 relative ml-8">
            <div className="absolute -left-7 top-0 text-[10px] text-[#5B6B7E]">300</div>
            <div className="absolute -left-7 top-1/3 text-[10px] text-[#5B6B7E]">200</div>
            <div className="absolute -left-7 top-2/3 text-[10px] text-[#5B6B7E]">100</div>
            <div className="absolute -left-7 bottom-0 text-[10px] text-[#5B6B7E]">0</div>
            {bars.map((h, i) => (
              <div key={i} className="flex-1 relative h-full flex flex-col justify-end">
                <div className="bg-[#22A95A] w-full" style={{ height: `${(h / 300) * 100}%` }} />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 ml-8 pr-2 text-[10px] text-[#5B6B7E]">
            {['03/01','03/03','03/05','03/07','03/09','03/11','03/13','03/15','03/17','03/19','03/21','03/23','03/25','03/27','03/29'].map(d => <span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Total Calls header — divider flush to sidebar */}
        <div className="border-t border-[#E5E7EB] pl-6 pr-6">
          <div className="flex items-center justify-between py-3">
            <div className="text-sm font-semibold text-[#0F2540]">Total Calls: 2,334</div>
            <div className="text-sm text-[#2D6CDF]">
              <span className="hover:underline cursor-pointer">Edit Columns</span>
              <span className="text-gray-300 mx-2">|</span>
              <span className="hover:underline cursor-pointer">Reset Sorting</span>
            </div>
          </div>
        </div>

        {/* Wide horizontally-scrollable table — flush, no card */}
        <div className="overflow-x-auto bg-white border-t border-[#E5E7EB]">



          <div style={{ width: totalW }}>
            {/* Header */}
            <div className="flex border-b border-[#E5E7EB] bg-white sticky top-0 z-10">
              {cols.map(c => (
                <div
                  key={c.key}
                  style={{ width: c.w }}
                  className={`shrink-0 overflow-hidden px-6 py-2.5 text-[12px] font-semibold text-[#0F2540] truncate ${c.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {c.head}
                </div>
              ))}
            </div>
            {/* Rows */}
            {rows.map((r, i) => (
              <div
                key={i}
                onClick={() => navigate('/invoca/call-review')}
                className={`flex border-b border-[#F3F4F6] hover:bg-[#F8FAFC] cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]'}`}
              >
                {cols.map(c => (
                  <div
                    key={c.key}
                    style={{ width: c.w }}
                    className={`shrink-0 px-6 py-5 text-[14px] text-[#0F2540] truncate ${c.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {c.cell(r)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2 text-sm text-[#5B6B7E]">
            <select className="border border-[#D1D5DB] rounded px-2 py-1 text-sm">
              <option>100</option><option>50</option><option>25</option>
            </select>
            records per page
          </div>
          <div className="text-sm text-[#5B6B7E]">Showing 1 to 40 of 2,334 entries</div>
        </div>
      </div>
    </InvocaShell>
  );
}
