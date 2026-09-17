import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InvocaShell from '@/components/invoca/InvocaShell';
import { buildLeads, jobsFor, signalsFor, type Lead } from '@/lib/lsa-leads';

const GreenCheck = () => (
  <svg viewBox="0 0 20 20" className="w-[22px] h-[22px]" aria-label="yes">
    <circle cx="10" cy="10" r="9" fill="#34A853" />
    <path d="M5.8 10.2l2.7 2.7 5.7-5.7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RedX = () => (
  <svg viewBox="0 0 20 20" className="w-[22px] h-[22px]" aria-label="no">
    <circle cx="10" cy="10" r="9" fill="#EA4335" />
    <path d="M7 7l6 6M13 7l-6 6" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

const SortIcon = () => (
  <svg viewBox="0 0 10 14" className="w-[9px] h-[13px] shrink-0 text-[#9AA4B2]" fill="currentColor">
    <path d="M5 0l3.5 4.5h-7z" /><path d="M5 14l3.5-4.5h-7z" />
  </svg>
);

const LSA_CAMPAIGNS = [
  'Local Services — Always On',
  'Emergency Service Now',
  'Same Day Dispatch',
  'Top Rated Pros',
  'Weekend Coverage',
];

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function InvocaLsaReport() {
  const navigate = useNavigate();
  const loc = useLocation() as { state?: { companyName?: string; industry?: string; domain?: string } };

  const ctx = useMemo(() => {
    if (loc.state?.companyName || loc.state?.industry) return loc.state;
    try {
      const raw = sessionStorage.getItem('invoca-context');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }, [loc.state]);

  const company: string = ctx?.companyName || 'Sherlock Plumbing';
  const industry: string = ctx?.industry || 'Home Services';
  const host: string = (ctx?.domain || `${company.replace(/[^A-Za-z]/g, '')}.com`).replace(/^https?:\/\//, '').replace(/\/$/, '');

  const leads = useMemo(() => buildLeads(jobsFor(industry)), [industry]);

  const rows = useMemo(() => {
    const base: Lead[] = [...leads, ...leads.slice(0, 4)];
    return base.map((l, i) => {
      const job = l.jobType && l.jobType !== '-' ? l.jobType : 'Service request';
      const term = i % 7 === 5 ? '—' : `${job.toLowerCase()} ${['near me', 'same day', 'best rated', 'emergency', 'today'][i % 5]}`;
      const medium = i % 4 === 3 ? 'lsa_message' : 'lsa_call';
      return {
        key: `${l.id}-${i}`,
        campaign: LSA_CAMPAIGNS[i % LSA_CAMPAIGNS.length],
        term,
        url: `https://${host}/${slug(job)}?utm_source=google_lsa&utm_me...`,
        journey: `Home / Services / ${job}`,
        ok: signalsFor(l).qualified,
      };
    });
  }, [leads, host]);

  const cols = [
    { key: 'campaign', w: 245, head: 'Marketing Campaign', sortable: true },
    { key: 'term', w: 385, head: 'Marketing Search Term', sortable: true },
    { key: 'url', w: 535, head: 'Full Landing Page URL', sortable: false },
    { key: 'journey', w: 380, head: 'Website Journey', sortable: true },
  ];

  return (
    <InvocaShell networkName={company}>
      <div className="bg-white min-h-full">
        <div className="flex items-center justify-between px-9 pt-7 pb-5">
          <div className="text-[15px] font-semibold text-[#0F2540]">Total Interactions: {61547}</div>
          <div className="text-[15px] text-[#2D6CDF]">
            <span className="hover:underline cursor-pointer">Edit Columns</span>
            <span className="text-gray-300 mx-2">|</span>
            <span className="hover:underline cursor-pointer">Reset Sorting</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1700px]">
            <div className="flex px-9 pb-3">
              {cols.map(c => (
                <div key={c.key} style={{ width: c.w }} className="shrink-0 pr-6 flex items-center justify-between gap-2">
                  <span className="text-[14px] font-semibold text-[#0F2540] truncate">{c.head}</span>
                  {c.sortable && <SortIcon />}
                </div>
              ))}
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[#0F2540]">Qualified Lead</span>
                <span className="text-[10px] font-semibold text-[#6B7280] bg-[#E5E7EB] rounded-full px-2 py-[1px]">Rule</span>
              </div>
            </div>

            {rows.map((r, i) => (
              <div
                key={r.key}
                onClick={() => navigate('/invoca/call-review')}
                className={`flex px-9 py-[22px] cursor-pointer border-t border-[#EDEFF2] ${i % 2 === 1 ? 'bg-[#F7F8F9]' : 'bg-white'} hover:bg-[#EEF4FC]`}
              >
                <div style={{ width: cols[0].w }} className="shrink-0 pr-6 text-[15px] text-[#3C4043] truncate">{r.campaign}</div>
                <div style={{ width: cols[1].w }} className="shrink-0 pr-6 text-[15px] text-[#3C4043] truncate">{r.term}</div>
                <div style={{ width: cols[2].w }} className="shrink-0 pr-6 text-[15px] text-[#3C4043] truncate">{r.url}</div>
                <div style={{ width: cols[3].w }} className="shrink-0 pr-6 text-[15px] text-[#3C4043] truncate">{r.journey}</div>
                <div className="shrink-0 w-[140px] flex items-center">{r.ok ? <GreenCheck /> : <RedX />}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </InvocaShell>
  );
}
