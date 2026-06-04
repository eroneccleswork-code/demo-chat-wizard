import InvocaShell from '@/components/invoca/InvocaShell';
import { ChevronDown, Download, Clock, MoreVertical } from 'lucide-react';

const KpiCard = ({ title, items }: { title: string; items: { label: string; value: string }[] }) => (
  <div className="bg-white border border-[#E5E7EB] rounded-md p-6 min-h-[280px] relative">
    <div className="flex items-start justify-between">
      <h3 className="text-[15px] font-bold tracking-wide text-[#0F2540]">{title}</h3>
      <MoreVertical className="w-4 h-4 text-gray-400" />
    </div>
    <div className={`mt-8 grid ${items.length > 1 ? 'grid-cols-2 gap-y-8' : 'grid-cols-1'} gap-6`}>
      {items.map((it) => (
        <div key={it.label} className="text-center">
          <div className="text-[13px] text-[#5B6B7E] mb-1">{it.label}</div>
          <div className="text-[40px] font-light text-[#0F2540] leading-none">{it.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border border-[#E5E7EB] rounded-md p-6 relative">
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-[15px] font-bold tracking-wide text-[#0F2540]">{title}</h3>
      <MoreVertical className="w-4 h-4 text-gray-400" />
    </div>
    {children}
  </div>
);

const BarRow = ({ label, value, color, max, suffix = '' }: { label: string; value: number; color: string; max: number; suffix?: string }) => (
  <div className="flex items-center gap-3 mb-3">
    <div className="w-20 text-[11px] text-[#5B6B7E] text-right leading-tight">{label}</div>
    <div className="flex-1 flex items-center">
      <div className="h-7 rounded-sm flex items-center justify-end px-2 text-white text-xs font-semibold" style={{ width: `${(value / max) * 100}%`, backgroundColor: color, minWidth: '40px' }}>
        {value}{suffix}
      </div>
    </div>
  </div>
);

const Table = ({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) => (
  <div>
    <div className="grid text-[13px] font-semibold text-[#0F2540] py-3 border-b border-[#E5E7EB]" style={{ gridTemplateColumns: `1.5fr repeat(${headers.length - 1}, 1fr)` }}>
      {headers.map((h) => <div key={h}>{h}</div>)}
    </div>
    {rows.map((row, i) => (
      <div key={i} className="grid text-[14px] text-[#0F2540] py-4 border-b border-[#F3F4F6]" style={{ gridTemplateColumns: `1.5fr repeat(${headers.length - 1}, 1fr)` }}>
        {row.map((c, j) => <div key={j}>{c}</div>)}
      </div>
    ))}
  </div>
);

// Stacked call trending bars
const CallTrendingChart = () => {
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    scheduling: 25 + Math.floor(Math.random() * 20),
    billing: 18 + Math.floor(Math.random() * 15),
    insurance: 12 + Math.floor(Math.random() * 10),
  }));
  const max = 80;
  return (
    <div>
      <div className="flex items-center gap-6 mb-4 text-xs">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#2D6CDF] rounded-sm" /> Scheduling</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#1FA37A] rounded-sm" /> Billing Inquiry</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#E55B4B] rounded-sm" /> Insurance Verification</div>
      </div>
      <div className="flex items-end gap-1 h-[280px] border-l border-b border-[#E5E7EB] pl-2 pb-2 relative">
        {[80, 60, 40, 20, 0].map((v) => (
          <div key={v} className="absolute left-[-24px] text-[10px] text-[#5B6B7E]" style={{ bottom: `${(v / max) * 100}%` }}>{v}</div>
        ))}
        {days.map((d) => {
          const total = d.scheduling + d.billing + d.insurance;
          return (
            <div key={d.day} className="flex-1 flex flex-col-reverse" style={{ height: `${(total / max) * 100}%` }}>
              <div style={{ height: `${(d.scheduling / total) * 100}%`, backgroundColor: '#2D6CDF' }} />
              <div style={{ height: `${(d.billing / total) * 100}%`, backgroundColor: '#1FA37A' }} />
              <div style={{ height: `${(d.insurance / total) * 100}%`, backgroundColor: '#E55B4B' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function InvocaDashboard() {
  return (
    <InvocaShell>
      <div className="px-10 py-6 max-w-[1600px]">
        <div className="text-[11px] text-[#2D6CDF] font-semibold tracking-wider mb-1">MANAGE DASHBOARDS</div>
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-light text-[#0F2540]">
            ADVANCED CALL TRACKING: <span className="font-semibold">Optimization</span> <ChevronDown className="inline w-5 h-5 text-[#0F2540]" />
          </h1>
          <div className="flex items-center gap-3 text-gray-400">
            <Download className="w-5 h-5" />
            <div className="relative">
              <Clock className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#2D6CDF] rounded-full" />
            </div>
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-[11px] bg-[#E6F7EF] text-[#1FA37A] rounded-full px-3 py-1 font-medium">Shared</span>
          <span className="text-[11px] bg-[#E6F7EF] text-[#1FA37A] rounded-full px-3 py-1 font-medium">View Only</span>
        </div>
        <div className="flex gap-3 mt-4 items-center">
          <button className="text-sm border border-[#0F2540] rounded-full px-4 py-2 font-medium text-[#0F2540]">1/1/2023-1/31/2023</button>
          <button className="text-sm border border-[#D1D5DB] rounded-full px-4 py-2 text-[#0F2540]">Marketing Data</button>
          <button className="text-sm border border-[#D1D5DB] rounded-full px-4 py-2 text-[#0F2540]">Signals</button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <KpiCard title="TOTAL CALLS" items={[
            { label: 'Call Count', value: '1,309' },
            { label: 'Avg. Duration', value: '4:13' },
            { label: 'Avg. Connected Duration', value: '3:49' },
          ]} />
          <KpiCard title="NEW PATIENTS" items={[
            { label: 'Caller Type: New Patients (Count)', value: '890' },
            { label: 'Appointment: Scheduled (Percent)', value: '50%' },
          ]} />
          <KpiCard title="EXISTING PATIENTS" items={[
            { label: 'Caller Type: Existing Patient (Count)', value: '416' },
            { label: 'Inquiry Type: Billing and Payments (Percent)', value: '21%' },
          ]} />
        </div>

        {/* Call Trending */}
        <div className="mt-6">
          <SectionCard title="CALL TRENDING"><CallTrendingChart /></SectionCard>
        </div>

        {/* Marketing Campaigns */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <SectionCard title="MARKETING: Campaign (Calls)">
            <BarRow label="Nationally ranked. Clo..." value={674} color="#2D6CDF" max={800} />
            <BarRow label="Restoring hope" value={148} color="#1FA37A" max={800} />
            <BarRow label="We are ready to se..." value={140} color="#E55B4B" max={800} />
            <BarRow label="Keeping you happy and ..." value={64} color="#15807A" max={800} />
          </SectionCard>
          <SectionCard title="MARKETING: Campaign (Appoint...)">
            <BarRow label="Restoring hope" value={86} color="#2D6CDF" max={100} suffix="%" />
            <BarRow label="We are ready to se..." value={39} color="#1FA37A" max={100} suffix="%" />
            <BarRow label="Nationally ranked. Clo..." value={37} color="#E55B4B" max={100} suffix="%" />
            <BarRow label="Keeping you happy and ..." value={28} color="#15807A" max={100} suffix="%" />
          </SectionCard>
          <SectionCard title="MARKETING: Search Campaign (C...)">
            <Table
              headers={['Marketing Ca...', 'Call Count', 'Appointment:...']}
              rows={[
                ['Nationally ranked. Close to home.', 674, '37%'],
                ['Restoring hope', 148, '86%'],
                ['We are ready to see you now', 140, '39%'],
                ['Keeping you happy and healthy', 64, '28%'],
              ]}
            />
          </SectionCard>
        </div>

        {/* Search Terms */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <SectionCard title="MARKETING: Search Terms (Calls)">
            <BarRow label="ENT Doctors" value={130} color="#2D6CDF" max={200} />
            <BarRow label="Orthopedists" value={118} color="#1FA37A" max={200} />
            <BarRow label="Pediatricians" value={92} color="#E55B4B" max={200} />
            <BarRow label="Facebook" value={45} color="#7A4FCB" max={200} />
          </SectionCard>
          <SectionCard title="MARKETING: Search Terms (Co...)">
            <BarRow label="Orthopedists" value={51} color="#2D6CDF" max={100} suffix="%" />
            <BarRow label="ENT Doctors" value={42} color="#1FA37A" max={100} suffix="%" />
            <BarRow label="Pediatricians" value={31} color="#E55B4B" max={100} suffix="%" />
            <BarRow label="Facebook" value={20} color="#7A4FCB" max={100} suffix="%" />
          </SectionCard>
          <SectionCard title="MARKETING: Search Terms (Calls r...)">
            <Table
              headers={['Marketing Se...', 'Call Count', 'Appointment:...']}
              rows={[
                ['ENT Doctors', 130, '42%'],
                ['Orthopedists', 118, '51%'],
                ['Pediatricians', 92, '31%'],
                ['Facebook', 60, '20%'],
              ]}
            />
          </SectionCard>
        </div>

        {/* Specialties */}
        <div className="mt-6">
          <SectionCard title="SPECIALTIES">
            <Table
              headers={['Specialty', 'Call Count', 'Caller Type: New Patients (Percent)', 'Caller Type: Existing Patient (Perc...', 'Appointment: Scheduled (Percent)']}
              rows={[
                ['Primary Care', 324, '76%', '24%', '47%'],
                ['Cardiology', 273, '70%', '29%', '27%'],
                ['Orthopedic Care', 246, '88%', '12%', '60%'],
                ['Emergency Care', 228, '45%', '55%', '54%'],
                ['Oncology', 168, '61%', '39%', '62%'],
              ]}
            />
          </SectionCard>
        </div>

        {/* Facilities */}
        <div className="mt-6">
          <SectionCard title="FACILITIES">
            <Table
              headers={['Facility', 'Call Count', 'Caller Type: New Patients (Percent)', 'Caller Type: Existing Patient (Perc...', 'Appointment: Scheduled (Percent)']}
              rows={[
                ['HCA Florida Trinity Hospital', 52, '100%', '0%', '0%'],
                ['North Suburban Medical Center', 15, '80%', '0%', '53%'],
                ['Angel Medical Center', 12, '100%', '0%', '50%'],
                ['Bolton Regional Medical Center', 12, '100%', '0%', '50%'],
              ]}
            />
          </SectionCard>
        </div>

        {/* Lines of Business */}
        <div className="mt-6">
          <SectionCard title="LINES OF BUSINESS">
            <Table
              headers={['Line of Business', 'Call Count', 'Caller Type: New Patients (Percent)', 'Caller Type: Existing Patient (Perc...', 'Appointment: Scheduled (Percent)']}
              rows={[
                ['Medical/Office', 924, '72%', '28%', '49%'],
                ['ER/Urgent Care', 216, '47%', '53%', '56%'],
                ['Surgery Center', 169, '75%', '25%', '50%'],
              ]}
            />
          </SectionCard>
        </div>

        {/* Divisions */}
        <div className="mt-6">
          <SectionCard title="DIVISIONS">
            <Table
              headers={['Division', 'Call Count', 'Caller Type: New Patients (Percent)', 'Caller Type: Existing Patient (Perc...', 'Appointment: Scheduled (Percent)']}
              rows={[
                ['West Florida', 134, '81%', '19%', '30%'],
                ['North Texas', 102, '59%', '41%', '61%'],
                ['Gulf Coast', 92, '72%', '28%', '63%'],
                ['North Florida', 90, '87%', '13%', '53%'],
                ['Continental', 89, '61%', '36%', '38%'],
              ]}
            />
          </SectionCard>
        </div>

        <div className="h-16" />
      </div>
    </InvocaShell>
  );
}
