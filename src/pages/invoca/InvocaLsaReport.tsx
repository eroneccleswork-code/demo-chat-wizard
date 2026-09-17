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

type Col = { key: string; w: number; head: React.ReactNode; cell: (r: Lead) => React.ReactNode; align?: 'left' | 'center' };

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
    { key: 'outcome', w: 230, head: <>Lead Outcome<Pill label="AI" tone="blue" /></>, cell: r => {
      const s = signalsFor(r);
      return (
        <span className={`inline-block text-[12px] font-semibold rounded px-2 py-[3px] ${
          s.qualified ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-[#FCE8E6] text-[#C5221F]'
        }`}>
          {s.qualified ? (s.converted ? 'Qualified — Booked' : 'Qualified Lead') : `Not Qualified — ${REASON[r.truth]}`}
        </span>
      );
    } },
    { key: 'time', w: 170, head: <>Call Start Time <span className="text-[#2D6CDF]">↑</span></>, cell: r => r.time },
    { key: 'name', w: 170, head: 'Caller Name', cell: r => r.name },
    { key: 'caller', w: 150, head: 'Caller ID', cell: r => r.callerId },
    { key: 'city', w: 160, head: 'Caller Location', cell: r => r.city },
    { key: 'src', w: 150, head: 'Marketing Source', cell: () => 'Google LSA' },
    { key: 'med', w: 150, head: 'Marketing Medium', cell: () => 'Local Services Ad' },
    { key: 'camp', w: 230, head: 'Marketing Campaign', cell: r => r.campaign },
    { key: 'term', w: 160, head: 'Search Term', cell: r => r.keyword },
    { key: 'job', w: 180, head: home ? 'Job Type' : 'Reason for Call', cell: r => r.jobType },
    { key: 'dur', w: 150, head: 'Connected Duration', cell: r => r.duration },
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

          {/* Summary tiles — qualified vs not, at a glance */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { key: 'all' as const, label: 'LSA Leads Analyzed', value: leads.length, sub: 'Every call scored automatically', tone: 'text-[#0F2540]' },
              { key: 'qualified' as const, label: 'Qualified', value: qualifiedCount, sub: 'Real jobs worth paying for', tone: 'text-[#137333]' },
              { key: 'unqualified' as const, label: 'Not Qualified', value: unqualifiedCount, sub: 'Spam, existing or out of area — disputed', tone: 'text-[#C5221F]' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`text-left rounded-[10px] border px-5 py-4 bg-white transition-colors ${
                  filter === t.key ? 'border-[#2D6CDF] shadow-[0_1px_3px_rgba(15,37,64,0.12)]' : 'border-[#EAECEF] hover:border-[#C9D3E0]'
                }`}
              >
                <div className="text-[12px] text-[#5B6B7E]">{t.label}</div>
                <div className={`text-[30px] font-semibold leading-tight ${t.tone}`}>{t.value}</div>
                <div className="text-[11px] text-[#8A97A6]">{t.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pl-6 pr-6">
          <div className="flex items-center justify-between py-3">
            <div className="text-sm font-semibold text-[#0F2540]">Total Leads: {rows.length}</div>
            <div className="text-sm text-[#2D6CDF]">
              <span className="hover:underline cursor-pointer">Edit Columns</span>
              <span className="text-gray-300 mx-2">|</span>
              <span className="hover:underline cursor-pointer">Reset Sorting</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white border-t border-[#E5E7EB]">
          <div style={{ width: totalW }}>
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
            {rows.map((r, i) => {
              const s = signalsFor(r);
              return (
                <div
                  key={r.id}
                  onClick={() => navigate('/invoca/call-review')}
                  className={`flex border-b border-[#F3F4F6] hover:bg-[#F8FAFC] cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]'}`}
                  style={{ boxShadow: `inset 4px 0 0 0 ${s.qualified ? '#5FBC63' : '#E8837D'}` }}
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
              );
            })}
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
