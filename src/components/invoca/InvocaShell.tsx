import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Star, Bell, HelpCircle, Search, ChevronDown } from 'lucide-react';
import sidebarImg from '@/assets/invoca-sidebar.png.asset.json';

interface NavItem {
  label: string;
  to: string;
}

const items: NavItem[] = [
  { label: 'Dashboards', to: '/invoca' },
  { label: 'Call Review', to: '/invoca/call-review' },
  { label: 'Advertisers', to: '/invoca/advertisers' },
  { label: 'Campaigns', to: '/invoca/campaigns' },
  { label: 'Publishers', to: '/invoca/publishers' },
  { label: 'Promo Numbers', to: '/invoca/promo-numbers' },
  { label: 'Reports', to: '/invoca/call-report' },
  { label: 'Integrations', to: '/invoca/integrations' },
  { label: 'Signal', to: '/invoca/signal' },
  { label: 'Score', to: '/invoca/score' },
  { label: 'Labs', to: '/invoca/labs' },
  { label: 'Settings', to: '/invoca/settings' },
];

export default function InvocaShell({ children, networkName }: { children: ReactNode; networkName?: string }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <header className="h-[60px] bg-[#F4F5F7] flex items-center px-4 gap-4 border-b border-[#E5E7EB] flex-shrink-0">
        <button onClick={() => navigate('/invoca')} className="flex items-center gap-1 shrink-0">
          <span className="font-extrabold tracking-tight text-[22px] text-[#0F2540]">INVOCA</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#1FA37A" className="-ml-0.5">
            <path d="M4 4h12a4 4 0 014 4v6a4 4 0 01-4 4H10l-5 4v-4H4a0 0 0 010 0V4z"/>
          </svg>
        </button>
        <span className="ml-1 text-[11px] font-bold leading-tight text-[#7A4A00] bg-[#FFD79A] rounded px-2 py-1 shrink-0 text-center">DEMO<br/>NETWORK</span>
        <div className="flex items-center gap-2 ml-6">
          <span className="text-[#1FA37A] text-sm font-medium">Network</span>
          <button className="flex items-center gap-2 bg-white border border-[#D1D5DB] rounded px-3 py-1.5 text-sm text-[#0F2540] min-w-[260px] justify-between">
            <span>{networkName || 'Invoca for Healthcare 2.0'}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 flex items-center max-w-2xl ml-8">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Search className="w-4 h-4" />
            <span>Navigate to...</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <Star className="w-5 h-5" />
          <div className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-2 -right-3 bg-[#1FA37A] text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5">100</span>
          </div>
          <HelpCircle className="w-5 h-5" />
          <div className="w-8 h-8 rounded-full bg-[#2D6CDF] text-white text-xs font-semibold flex items-center justify-center">DJ</div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar — exact screenshot with invisible nav hit-areas */}
        <aside className="w-[84px] min-w-[84px] max-w-[84px] bg-[#F4F6F8] border-r border-[#E1E4E8] flex-shrink-0 self-stretch overflow-hidden">
          <div className="sticky top-0 relative w-[84px]">
            <img
              src={sidebarImg.url}
              alt=""
              width={84}
              className="block w-[84px] h-auto select-none pointer-events-none"
              draggable={false}
            />
            <div className="absolute inset-0 grid grid-rows-12">
              {items.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.to === '/invoca'}
                  aria-label={it.label}
                  className="block hover:bg-black/[0.04]"
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
