import { MoreVertical } from 'lucide-react';
import { industryTerms, isHomeService } from '@/lib/invoca-industry';

interface Props {
  industry?: string;
  totalCalls?: number;
  avgDuration?: string;
  avgConnectedDuration?: string;
  newCount?: number;
  apptPct?: number;
  existingCount?: number;
  inquiryLabel?: string;
  inquiryPct?: number;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[10px] p-6 min-h-[260px] relative border border-[#EEF0F3] shadow-[0_1px_3px_rgba(15,37,64,0.06),0_4px_12px_rgba(15,37,64,0.04)]">
      <div className="flex items-start justify-between">
        <div className="text-[13px] font-semibold tracking-wide text-[#0F2540] uppercase">{title}</div>
        <MoreVertical className="w-4 h-4 text-[#9CA3AF]" />
      </div>
      {children}
    </div>
  );
}

function Metric({ label, value, align = 'center' }: { label: string; value: string; align?: 'center' | 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      <div className="text-[13px] text-[#0F2540] mb-2">{label}</div>
      <div className="text-[44px] leading-none font-normal text-[#0F2540]">{value}</div>
    </div>
  );
}

export default function KpiRow({
  industry,
  totalCalls = 1309,
  avgDuration = '4:13',
  avgConnectedDuration = '3:49',
  newCount = 890,
  apptPct = 50,
  existingCount = 416,
  inquiryLabel,
  inquiryPct,
}: Props) {
  const t = industryTerms(industry);
  const home = isHomeService(industry);
  const newTitle = home ? 'NEW CUSTOMERS' : 'NEW PATIENTS';
  const existingTitle = home ? 'EXISTING CUSTOMERS' : 'EXISTING PATIENTS';
  const newCountLabel = home ? 'Caller Type: New Customers (Count)' : 'Caller Type: New Patients (Count)';
  const existingCountLabel = home ? 'Caller Type: Existing Customer (Count)' : 'Caller Type: Existing Patient (Count)';
  const resolvedInquiryLabel = inquiryLabel || (home ? 'Inquiry Type: Pricing and Quotes (Percent)' : 'Inquiry Type: Billing and Payments (Percent)');
  const resolvedInquiryPct = inquiryPct ?? (home ? 28 : 21);

  return (
    <div className="grid grid-cols-3 gap-6">
      <Card title="TOTAL CALLS">
        <div className="grid grid-cols-2 gap-4 mt-6 items-start">
          <Metric label="Call Count" value={totalCalls.toLocaleString()} />
          <div className="relative">
            <div className="absolute -left-2 top-1 bottom-1 w-px bg-[#E5E7EB]" />
            <Metric label="Avg. Duration" value={avgDuration} />
          </div>
        </div>
        <div className="mt-8">
          <Metric label="Avg. Connected Duration" value={avgConnectedDuration} />
        </div>
      </Card>

      <Card title={newTitle}>
        <div className="mt-6">
          <Metric label={newCountLabel} value={newCount.toLocaleString()} />
        </div>
        <div className="mt-8">
          <Metric label={`${t.apptTitleShort}: Scheduled (Percent)`} value={`${apptPct}%`} />
        </div>
      </Card>

      <Card title={existingTitle}>
        <div className="mt-6">
          <Metric label={existingCountLabel} value={existingCount.toLocaleString()} />
        </div>
        <div className="mt-8">
          <Metric label={resolvedInquiryLabel} value={`${resolvedInquiryPct}%`} />
        </div>
      </Card>
    </div>
  );
}
