import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid, FolderOpen, Folder, PhoneForwarded, Users, Grid3x3,
  BarChart3, Network, Compass, ClipboardCheck, FlaskConical, Settings, Star, Bell, HelpCircle, Search, ChevronDown
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: typeof LayoutGrid;
  to: string;
  badge?: 'NEW';
}

const items: NavItem[] = [
  { label: 'Dashboards', icon: LayoutGrid, to: '/invoca' },
  { label: 'Call Review', icon: FolderOpen, to: '/invoca/call-review', badge: 'NEW' },
  { label: 'Advertisers', icon: Folder, to: '/invoca/advertisers' },
  { label: 'Campaigns', icon: PhoneForwarded, to: '/invoca/campaigns' },
  { label: 'Publishers', icon: Users, to: '/invoca/publishers' },
  { label: 'Promo Numbers', icon: Grid3x3, to: '/invoca/promo-numbers' },
  { label: 'Reports', icon: BarChart3, to: '/invoca/call-report' },
  { label: 'Integrations', icon: Network, to: '/invoca/integrations' },
  { label: 'Signal', icon: Compass, to: '/invoca/signal' },
  { label: 'Score', icon: ClipboardCheck, to: '/invoca/score' },
  { label: 'Labs', icon: FlaskConical, to: '/invoca/labs' },
  { label: 'Settings', icon: Settings, to: '/invoca/settings' },
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
        {/* Sidebar */}
        <aside className="w-[88px] bg-white border-r border-[#E5E7EB] flex flex-col py-2 flex-shrink-0">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === '/invoca'}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-1 py-3 text-[11px] ${
                  isActive ? 'text-[#1FA37A] font-semibold border-l-[3px] border-[#1FA37A] bg-[#F0FAF6]' : 'text-[#5B6B7E] border-l-[3px] border-transparent hover:bg-gray-50'
                }`
              }
            >
              {it.badge && (
                <span className="absolute top-1 right-2 text-[8px] font-bold text-[#E53935] bg-[#FFE9E7] rounded px-1">{it.badge}</span>
              )}
              <it.icon className="w-5 h-5" strokeWidth={2} />
              <span>{it.label}</span>
            </NavLink>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
