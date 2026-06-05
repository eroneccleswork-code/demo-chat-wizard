import { TRENDING_COLORS } from './ChartPrimitives';
import { seededRand } from '@/lib/invoca-industry';

interface Props {
  categories: string[]; // 3 names
  seed: string;
}

export default function CallTrending({ categories, seed }: Props) {
  const rand = seededRand(seed);
  const days = 28;
  const data = Array.from({ length: days }, (_, i) => {
    const a = Math.round(20 + rand() * 35);
    const b = Math.round(2 + rand() * 18);
    const c = Math.round(1 + rand() * 8);
    return { i: i + 1, a, b, c, total: a + b + c };
  });
  const maxY = 80;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-md">
      <div className="px-6 pt-5 pb-2 flex items-start justify-between">
        <h3 className="text-[18px] font-semibold text-[#0F2540]">CALL TRENDING</h3>
        <button className="text-[#9CA3AF] hover:text-[#5B6B7E] text-lg leading-none">⋮</button>
      </div>
      <div className="flex items-center gap-5 px-6 pb-3 justify-end text-[12px] text-[#0F2540]">
        {categories.map((c, i) => (
          <div key={c} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: TRENDING_COLORS[i] }} />
            {c}
          </div>
        ))}
      </div>
      <div className="px-6 pb-6">
        <div className="flex gap-4">
          <div className="flex flex-col justify-between text-[10px] text-[#5B6B7E] py-1 -mr-1">
            <span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
          </div>
          <div className="flex-1">
            <div className="relative h-[280px] border-l border-b border-[#E5E7EB] flex items-end gap-[3px] px-1">
              {[0.25, 0.5, 0.75].map(p => (
                <div key={p} className="absolute left-0 right-0 border-t border-[#F3F4F6]" style={{ bottom: `${p * 100}%` }} />
              ))}
              {data.map(d => (
                <div key={d.i} className="flex-1 flex flex-col-reverse min-w-0">
                  <div style={{ height: `${(d.a / maxY) * 100}%`, backgroundColor: TRENDING_COLORS[0] }} />
                  <div style={{ height: `${(d.b / maxY) * 100}%`, backgroundColor: TRENDING_COLORS[1] }} />
                  <div style={{ height: `${(d.c / maxY) * 100}%`, backgroundColor: TRENDING_COLORS[2] }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-[#5B6B7E] mt-1 px-1">
              {data.map(d => (
                <span key={d.i} className="flex-1 text-center">
                  {`01/${d.i.toString().padStart(2, '0')}`}
                </span>
              ))}
            </div>
            <div className="text-center text-[11px] text-[#5B6B7E] mt-1">Call Count</div>
          </div>
        </div>
      </div>
    </div>
  );
}
