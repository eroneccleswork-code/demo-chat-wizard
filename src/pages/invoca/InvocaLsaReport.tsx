import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Share2, Download, Clock, Plus, Play } from 'lucide-react';
import InvocaShell from '@/components/invoca/InvocaShell';
import { buildLeads, jobsFor, signalsFor, REASON, type Lead } from '@/lib/lsa-leads';

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

type Col = { key: string; w: number; head: React.ReactNode; cell: (r: Lead) => React.ReactNode; align?: 'left' | 'center'; sortable?: boolean };

export default function InvocaLsaReport() {
  const navigate = useNavigate();
  const loc = useLocation() as { state?: { companyName?: string; industry?: string; customSignals?: string[] } };

  const ctx = useMemo(() => {
    if (loc.state?.companyName || loc.state?.industry) return loc.state;
    try {
      const raw = sessionStorage.getItem('invoca-context');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }, [loc.state]);

  const company: string = ctx?.companyName || 'Sherlock Plumbing';
  const industry: string = ctx?.industry || 'Home Services';
  const customSignals: string[] = (ctx?.customSignals as string[] | undefined)?.filter(s => s && s.trim()) ?? [];
  const home = !/health|dent/i.test(industry);

  const leads = useMemo(() => buildLeads(jobsFor(industry)), [industry]);
  const [filter, setFilter] = useState<'all' | 'qualified' | 'unqualified'>('all');

  const qualifiedCount = leads.filter(l => signalsFor(l).qualified).length;
  const unqualifiedCount = leads.length - qualifiedCount;

  const rows = leads.filter(l => {
    if (filter === 'all') return true;
    const q = signalsFor(l).qualified;
    return filter === 'qualified' ? q : !q;
  });

  const cols: Col[] = [
    { key: 'icon', w: 100, head: 'Call Details', cell: () => (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[22px]" aria-label="details">
        <path d="M3 2h12l5 5v15H3z" fill="#4DA9EA" />
        <path d="M15 2v5h5" fill="#2E8FD1" />
        <circle cx="10.5" cy="13.5" r="2.8" fill="none" stroke="#fff" strokeWidth="1.6" />
        <line x1="12.6" y1="15.6" x2="15" y2="18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ) },
    { key: 'outcome', sortable: true, w: 300, head: <>Lead Outcome<Pill label="AI" tone="blue" /></>, cell: r => {
      const s = signalsFor(r);
      return (
        <span className={`inline-block text-[12px] font-semibold rounded px-2 py-[3px] ${
          s.qualified ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-[#FCE8E6] text-[#C5221F]'
        }`}>
          {s.qualified ? (s.converted ? 'Qualified — Booked' : 'Qualified Lead') : `Not Qualified — ${REASON[r.truth]}`}
        </span>
      );
    } },
    { key: 'time', sortable: true, w: 170, head: <>Call Start Time <span className="text-[#2D6CDF]">↑</span></>, cell: r => r.time },
    { key: 'name', sortable: true, w: 170, head: 'Caller Name', cell: r => r.name },
    { key: 'caller', w: 170, head: 'Caller ID', cell: r => r.callerId },
    { key: 'city', sortable: true, w: 190, head: 'Caller Location', cell: r => r.city },
    { key: 'src', w: 150, head: 'Marketing Source', cell: () => 'Google LSA' },
    { key: 'med', w: 150, head: 'Marketing Medium', cell: () => 'Local Services Ad' },
    { key: 'camp', sortable: true, w: 230, head: 'Marketing Campaign', cell: r => r.campaign },
    { key: 'term', w: 160, head: 'Search Term', cell: r => r.keyword },
    { key: 'job', sortable: true, w: 180, head: home ? 'Job Type' : 'Reason for Call', cell: r => r.jobType },
    { key: 'dur', sortable: true, w: 150, head: 'Connected Duration', cell: r => r.duration },
    { key: 'qual', w: 170, head: <>Qualified Call<Pill label="RULE" /></>, cell: r => <Check on={signalsFor(r).qualified} />, align: 'center' },
    { key: 'conv', w: 190, head: <>Appointment Booked<Pill label="RULE" /></>, cell: r => <Check on={signalsFor(r).converted} />, align: 'center' },
    { key: 'newc', w: 190, head: <>{home ? 'New Customer' : 'New Patient'}<Pill label="RULE" /></>, cell: r => <Check on={signalsFor(r).newCustomer} />, align: 'center' },
    { key: 'area', w: 200, head: <>{home ? 'Serviceable Address' : 'Insurance Verified'}<Pill label="RULE" /></>, cell: r => <Check on={signalsFor(r).serviceable} />, align: 'center' },
    { key: 'human', w: 180, head: <>Not Spam<Pill label="RULE" /></>, cell: r => <Check on={signalsFor(r).humanCaller} />, align: 'center' },
    { key: 'billable', w: 220, head: <>Billable Lead (LSA)<Pill label="AI" tone="blue" /></>, cell: r => {
      const s = signalsFor(r);
      return s.billable
        ? <span className="text-[12px] text-[#137333] font-medium">Keep charge</span>
        : <span className="text-[12px] text-[#C5221F] font-medium">Dispute filed</span>;
    } },
    ...customSignals.map((label, idx) => ({
      key: `custom-${idx}`,
      w: Math.max(180, label.length * 9 + 60),
      head: <>{label}<Pill label="CUSTOM" tone="blue" /></>,
      cell: (r: Lead) => <Check on={signalsFor(r).qualified && (idx + r.name.length) % 3 !== 0} />,
      align: 'center' as const,
    })),
  ];

  const totalW = cols.reduce((s, c) => s + c.w, 0);

  return (
    <InvocaShell networkName={company}>
      <div className="py-6">
        <div className="pl-6 pr-6">
          <div className="text-[13px] text-[#2D6CDF] mb-1">
            <span className="hover:underline cursor-pointer">My Reports</span>{' '}
            <span className="text-gray-400">›</span> Google Local Services Leads
          </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[28px] font-semibold text-[#0F2540]">Local Services Ad — Lead Details</h1>
            <div className="flex items-center gap-4">
              <a className="text-[#2D6CDF] text-sm hover:underline cursor-pointer">Requested Reports</a>
              <Share2 className="w-5 h-5 text-gray-400" />
              <Download className="w-5 h-5 text-gray-400" />
              <Clock className="w-5 h-5 text-gray-400" />
              <button className="bg-[#2D6CDF] text-white text-sm font-semibold rounded px-5 py-1.5">Save</button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <button className="bg-[#1FA37A] text-white rounded px-4 py-2 text-sm font-medium flex items-center gap-3">
              <span>Custom:</span><span className="font-semibold">Mar 01, 2026 - Mar 31, 2026</span>
            </button>
            <button className="bg-[#2D6CDF] text-white rounded p-2"><Plus className="w-4 h-4" /></button>
          </div>

          {/* Inline filter links, styled like report quick filters */}
          <div className="flex items-center gap-4 mb-5 text-[13px]">
            {[
              { key: 'all' as const, label: `All Leads (${leads.length})` },
              { key: 'qualified' as const, label: `Qualified (${qualifiedCount})` },
              { key: 'unqualified' as const, label: `Not Qualified (${unqualifiedCount})` },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`pb-1 border-b-2 transition-colors ${
                  filter === t.key ? 'border-[#2D6CDF] text-[#0F2540] font-semibold' : 'border-transparent text-[#5B6B7E] hover:text-[#0F2540]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pl-6 pr-6">
          <div className="flex items-center justify-between py-4">
            <div className="text-[15px] font-semibold text-[#0F2540]">Total Interactions: {rows.length}</div>
            <div className="text-[15px] text-[#2D6CDF]">
              <span className="hover:underline cursor-pointer">Edit Columns</span>
              <span className="text-gray-300 mx-2">|</span>
              <span className="hover:underline cursor-pointer">Reset Sorting</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white">
          <div style={{ width: totalW }}>
            <div className="flex bg-white sticky top-0 z-10">
              {cols.map(c => (
                <div
                  key={c.key}
                  style={{ width: c.w }}
                  className={`shrink-0 overflow-hidden px-6 pb-3 text-[14px] font-semibold text-[#0F2540] flex items-center gap-1.5 ${c.align === 'center' ? 'justify-center' : ''}`}
                >
                  <span className="truncate">{c.head}</span>
                  {c.sortable && (
                    <svg viewBox="0 0 10 14" className="w-[9px] h-[13px] shrink-0 text-[#9AA4B2]" fill="currentColor">
                      <path d="M5 0l3.5 4.5h-7z" /><path d="M5 14l3.5-4.5h-7z" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            {rows.map((r, i) => (
              <div
                key={r.id}
                onClick={() => navigate('/invoca/call-review')}
                className={`flex cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-[#F7F8F9]'} hover:bg-[#EEF4FC]`}
              >
                {cols.map(c => (
                  <div
                    key={c.key}
                    style={{ width: c.w }}
                    className={`shrink-0 px-6 py-[22px] text-[15px] text-[#3C4043] truncate ${c.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {c.cell(r)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-[#5B6B7E]">
            <Play className="w-4 h-4 text-[#2D6CDF]" />
            No one listened to a single recording — Invoca scored all {leads.length} calls in real time.
          </div>
          <button
            onClick={() => navigate('/invoca', { state: { companyName: company, industry } })}
            className="text-sm text-[#2D6CDF] hover:underline"
          >
            View full dashboard →
          </button>
        </div>
      </div>
    </InvocaShell>
  );
}
