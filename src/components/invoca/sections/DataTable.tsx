interface Row {
  name: string;
  calls: number;
  newPct: number;
  existingPct: number;
  apptPct: number;
}

export default function DataTable({ title, columnLabel, rows }: { title: string; columnLabel: string; rows: Row[] }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-md">
      <div className="px-6 pt-5 pb-4 flex items-start justify-between">
        <h3 className="text-[18px] font-semibold text-[#0F2540] tracking-wide">{title}</h3>
        <button className="text-[#9CA3AF] hover:text-[#5B6B7E] text-lg leading-none">⋮</button>
      </div>
      <div className="px-6 pb-6">
        <div className="grid grid-cols-[1.4fr_1fr_1.6fr_1.6fr_1.6fr] text-[13px] font-semibold text-[#0F2540] py-3 border-b border-[#E5E7EB]">
          <div>{columnLabel}</div>
          <div>Call Count</div>
          <div>Caller Type: New Patients (Percent)</div>
          <div>Caller Type: Existing Patient (Perc…</div>
          <div>Appointment: Scheduled (Percent)</div>
        </div>
        {rows.map(r => (
          <div key={r.name} className="grid grid-cols-[1.4fr_1fr_1.6fr_1.6fr_1.6fr] text-[14px] text-[#0F2540] py-4 border-b border-[#F3F4F6]">
            <div>{r.name}</div>
            <div>{r.calls}</div>
            <div>{r.newPct}%</div>
            <div>{r.existingPct}%</div>
            <div>{r.apptPct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
