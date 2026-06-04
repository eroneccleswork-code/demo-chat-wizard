import InvocaShell from '@/components/invoca/InvocaShell';
import { Share2, Download, Clock, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const callRows = Array.from({ length: 40 }, (_, i) => {
  const d = (i % 30) + 1;
  const hrs = (8 + (i % 12));
  const mins = (i * 7) % 60;
  const ampm = hrs >= 12 ? 'pm' : 'am';
  const divisions = ['New England', 'South', 'Mid-West', 'Pacific Coast'];
  const facilities = ['St Luke\'s Orthopedic', 'Joint Rehab Center', 'CardioVascular Institute', 'Elizabeth Medical Center'];
  const specialties = ['Orthopedics', 'Oncology', 'Heart and Vascular', 'Primary Care'];
  const phones = ['866-398-7557', '800-593-6000', '888-545-6000', '888-712-3456'];
  return {
    time: `3/${d}/22 ${hrs > 12 ? hrs - 12 : hrs}:${mins.toString().padStart(2, '0')} ${ampm}`,
    callerId: `${(700 + i * 13) % 900 + 100}-${(200 + i * 7) % 900 + 100}-${(1000 + i * 17) % 9000}`.slice(0, 12) + '...',
    phone: phones[i % 4],
    division: divisions[i % 4],
    facility: facilities[(i + 1) % 4],
    specialty: specialties[(i + 2) % 4],
  };
});

export default function InvocaCallReport() {
  const navigate = useNavigate();
  return (
    <InvocaShell>
      <div className="px-10 py-6">
        <div className="text-[13px] text-[#2D6CDF] mb-1"><span className="hover:underline cursor-pointer">My Reports</span> <span className="text-gray-400">›</span> Calls</div>
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
            <button className="p-2 bg-white text-[#2D6CDF]"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg></button>
            <button className="p-2 bg-white text-gray-400 border-l border-[#2D6CDF]"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect y="2" width="16" height="3"/><rect y="7" width="16" height="3"/><rect y="12" width="16" height="3"/></svg></button>
          </div>
          <button className="bg-[#1FA37A] text-white rounded px-4 py-2 text-sm font-medium flex items-center gap-3">
            <span>Custom:</span><span className="font-semibold">Mar 01, 2022 - Mar 31, 2022</span>
          </button>
          <button className="bg-[#2D6CDF] text-white rounded p-2"><Plus className="w-4 h-4" /></button>
        </div>

        {/* Chart */}
        <div className="border border-[#E5E7EB] rounded p-6 mb-6">
          <div className="flex items-center gap-6 mb-4 text-xs">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#1FA37A] rounded-full" /> Total Calls</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#F5A623] rounded-full" /> Conversions</div>
          </div>
          <div className="flex items-end gap-1 h-[260px] border-l border-b border-[#E5E7EB] pl-3 pb-2 relative">
            <div className="absolute left-[-30px] top-0 text-[10px] text-[#5B6B7E]">300</div>
            <div className="absolute left-[-30px] top-1/3 text-[10px] text-[#5B6B7E]">200</div>
            <div className="absolute left-[-30px] top-2/3 text-[10px] text-[#5B6B7E]">100</div>
            <div className="absolute left-[-30px] bottom-0 text-[10px] text-[#5B6B7E]">0</div>
            <div className="absolute left-[-50px] top-1/2 text-[10px] text-[#5B6B7E] -rotate-90">Calls</div>
            {Array.from({ length: 31 }, (_, i) => {
              const h = 170 + Math.floor(Math.random() * 40);
              return (
                <div key={i} className="flex-1 relative h-full flex flex-col justify-end">
                  <div className="bg-[#1FA37A] w-full rounded-t-sm" style={{ height: `${(h / 300) * 100}%` }} />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 px-3 text-[10px] text-[#5B6B7E]">
            {['03/01','03/03','03/05','03/07','03/09','03/11','03/13','03/15','03/17','03/19','03/21','03/23','03/25','03/27','03/29'].map(d => <span key={d}>{d}</span>)}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-[#0F2540]">Total Calls: 2,334</div>
          <div className="text-sm text-[#2D6CDF]">
            <span className="hover:underline cursor-pointer">Edit Columns</span> <span className="text-gray-300 mx-2">|</span> <span className="hover:underline cursor-pointer">Reset Sorting</span>
          </div>
        </div>

        {/* Table */}
        <div className="border-t border-[#E5E7EB]">
          <div className="grid grid-cols-[60px_1.2fr_1fr_1fr_1.2fr_1fr_1.2fr_1fr] text-[13px] font-semibold text-[#0F2540] py-3 border-b border-[#E5E7EB] gap-2">
            <div>Call Details</div>
            <div>Call Start Time ↑</div>
            <div>Caller ID</div>
            <div>Masked Caller ID</div>
            <div>(Destination) Phone Number</div>
            <div>Division</div>
            <div>Facility</div>
            <div>Specialty</div>
          </div>
          {callRows.map((r, i) => (
            <div
              key={i}
              onClick={() => navigate('/invoca/call-review')}
              className="grid grid-cols-[60px_1.2fr_1fr_1fr_1.2fr_1fr_1.2fr_1fr] text-[14px] text-[#0F2540] py-4 border-b border-[#F3F4F6] gap-2 hover:bg-gray-50 cursor-pointer"
            >
              <div><Search className="w-4 h-4 text-[#2D6CDF] bg-[#E6F0FF] p-0.5 rounded" /></div>
              <div>{r.time}</div>
              <div>{r.callerId}</div>
              <div>—</div>
              <div>{r.phone}</div>
              <div>{r.division}</div>
              <div>{r.facility}</div>
              <div>{r.specialty}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2 text-sm text-[#5B6B7E]">
            <select className="border border-[#D1D5DB] rounded px-2 py-1 text-sm">
              <option>100</option><option>50</option><option>25</option>
            </select>
            records per page
          </div>
          <div className="text-sm text-[#5B6B7E]">Showing 1 to 100 of 334 entries</div>
        </div>
      </div>
    </InvocaShell>
  );
}
