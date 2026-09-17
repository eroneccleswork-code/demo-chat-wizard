import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InvocaShell from '@/components/invoca/InvocaShell';
import { buildLeads, jobsFor, signalsFor } from '@/lib/lsa-leads';

const GreenCheck = () => (
  <svg viewBox="0 0 20 20" className="w-[20px] h-[20px]" aria-label="yes">
    <circle cx="10" cy="10" r="9" fill="#34A853" />
    <path d="M5.8 10.2l2.7 2.7 5.7-5.7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RedX = () => (
  <svg viewBox="0 0 20 20" className="w-[20px] h-[20px]" aria-label="no">
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

  const leads = useMemo(() => buildLeads(jobsFor(industry, company)), [industry, company]);

  const rows = useMemo(() => leads.map((l, i) => {
    const job = l.jobType && l.jobType !== '-' ? l.jobType : 'Service request';
    const term = `${job.toLowerCase()} ${['near me', 'same day', 'best rated', 'emergency', 'today'][i % 5]}`;
    return {
      key: l.id,
      name: l.name,
      job: l.jobType,
      completed: l.completed,
      leadType: l.leadType,
      campaign: LSA_CAMPAIGNS[i % LSA_CAMPAIGNS.length],
      term,
      url: `${host}/${slug(job)}`,
      ok: signalsFor(l).qualified,
    };
  }), [leads, host]);

  const qualified = rows.filter(r => r.ok).length;

  return (
    <InvocaShell networkName={company}>
      <div className="bg-white h-full flex flex-col">
        <div className="flex items-center justify-between px-8 pt-5 pb-3 shrink-0">
          <div className="text-[15px] font-semibold text-[#0F2540]">
            Total Interactions: {rows.length}
            <span className="ml-3 text-[13px] font-normal text-[#5F6368]">
              {qualified} qualified · {rows.length - qualified} not qualified
            </span>
          </div>
          <div className="text-[14px] text-[#2D6CDF]">
            <span className="hover:underline cursor-pointer">Edit Columns</span>
            <span className="text-gray-300 mx-2">|</span>
            <span className="hover:underline cursor-pointer">Reset Sorting</span>
          </div>
        </div>

        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="text-left">
              {[
                { h: 'Name', w: '13%', s: true },
                { h: 'Job Type', w: '14%', s: true },
                { h: 'Lead Received', w: '10%', s: true },
                { h: 'Lead Type', w: '9%', s: false },
                { h: 'Marketing Campaign', w: '18%', s: true },
                { h: 'Marketing Search Term', w: '18%', s: true },
                { h: 'Landing Page', w: '13%', s: false },
              ].map(c => (
                <th key={c.h} style={{ width: c.w }} className="px-4 pb-2 align-bottom">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-[#0F2540]">{c.h}</span>
                    {c.s && <SortIcon />}
                  </span>
                </th>
              ))}
              <th className="px-4 pb-2 align-bottom" style={{ width: '9%' }}>
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[#0F2540]">Qualified Lead</span>
                  <span className="text-[9px] font-semibold text-[#6B7280] bg-[#E5E7EB] rounded-full px-1.5">Rule</span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.key}
                onClick={() => navigate('/invoca/call-review')}
                className={`cursor-pointer border-t border-[#EDEFF2] ${i % 2 === 1 ? 'bg-[#F7F8F9]' : 'bg-white'} hover:bg-[#EEF4FC]`}
              >
                <td className="px-4 py-[11px] text-[13px] text-[#3C4043] truncate">{r.name}</td>
                <td className="px-4 py-[11px] text-[13px] text-[#3C4043] truncate">{r.job}</td>
                <td className="px-4 py-[11px] text-[13px] text-[#3C4043] whitespace-nowrap">{r.completed}</td>
                <td className="px-4 py-[11px] text-[13px] text-[#3C4043]">{r.leadType}</td>
                <td className="px-4 py-[11px] text-[13px] text-[#3C4043] truncate">{r.campaign}</td>
                <td className="px-4 py-[11px] text-[13px] text-[#3C4043] truncate">{r.term}</td>
                <td className="px-4 py-[11px] text-[13px] text-[#3C4043] truncate">{r.url}</td>
                <td className="px-4 py-[11px]">{r.ok ? <GreenCheck /> : <RedX />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InvocaShell>
  );
}
