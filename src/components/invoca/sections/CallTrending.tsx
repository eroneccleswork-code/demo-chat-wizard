import { seededRand } from '@/lib/invoca-industry';

const COLORS = ['#4285F4', '#2EAD4D', '#EB6A5E'];

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
    return { i: i + 1, a, b, c };
  });
  const maxY = 80;
  const ticks = [0, 20, 40, 60, 80];
  const chartH = 280;

  return (
    <div className="bg-white border border-[#EEF0F3] rounded-[10px] shadow-[0_1px_3px_rgba(15,37,64,0.06),0_4px_12px_rgba(15,37,64,0.04)]">
      <div className="px-6 pt-5 pb-2 flex items-start justify-between">
        <h3 className="text-[17px] font-semibold text-[#0F2540] tracking-wide">CALL TRENDING</h3>
        <button className="text-[#9CA3AF] hover:text-[#5B6B7E] text-lg leading-none">⋮</button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-6 pb-4 justify-end text-[13px] text-[#0F2540]">
        {categories.map((c, i) => (
          <div key={c} className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-[3px]" style={{ backgroundColor: COLORS[i] }} />
            {c}
          </div>
        ))}
      </div>

      <div className="px-6 pb-6">
        <div className="flex">
          {/* Y axis labels */}
          <div className="relative w-10 mr-2" style={{ height: chartH }}>
            {ticks.map(t => (
              <div
                key={t}
                className="absolute right-2 text-[12px] text-[#6B7280] -translate-y-1/2"
                style={{ bottom: `${(t / maxY) * 100}%` }}
              >
                {t}
              </div>
            ))}
            <div className="absolute -left-1 top-1/2 -rotate-90 origin-center text-[12px] text-[#6B7280] whitespace-nowrap" style={{ transform: 'translate(-100%, -50%) rotate(-90deg)' }}>
              Call Count
            </div>
          </div>

          {/* Chart area */}
          <div className="flex-1">
            <div className="relative" style={{ height: chartH }}>
              {/* Horizontal gridlines */}
              {ticks.map(t => (
                <div
                  key={t}
                  className="absolute left-0 right-0 border-t border-[#EAECEF]"
                  style={{ bottom: `${(t / maxY) * 100}%` }}
                />
              ))}

              {/* Bars */}
              <div className="absolute inset-0 flex items-end gap-[6px] px-1">
                {data.map(d => {
                  const ha = (d.a / maxY) * 100;
                  const hb = (d.b / maxY) * 100;
                  const hc = (d.c / maxY) * 100;
                  return (
                    <div key={d.i} className="flex-1 h-full flex flex-col justify-end items-stretch min-w-0 gap-[2px]">
                      {d.c > 0 && (
                        <div className="rounded-[5px]" style={{ height: `${hc}%`, backgroundColor: COLORS[2] }} />
                      )}
                      {d.b > 0 && (
                        <div className="rounded-[5px]" style={{ height: `${hb}%`, backgroundColor: COLORS[1] }} />
                      )}
                      {d.a > 0 && (
                        <div className="rounded-[5px]" style={{ height: `${ha}%`, backgroundColor: COLORS[0] }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X axis labels */}
            <div className="flex mt-2 px-1 gap-[6px]">
              {data.map(d => (
                <span key={d.i} className="flex-1 text-center text-[11px] text-[#6B7280]">
                  {`01/${d.i.toString().padStart(2, '0')}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
