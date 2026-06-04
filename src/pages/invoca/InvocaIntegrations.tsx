import InvocaShell from '@/components/invoca/InvocaShell';

const integrated = [
  { name: 'Invoca APIs', initial: '◆', color: 'bg-[#1F2937] text-white' },
  { name: 'Custom Webhooks', initial: '⚭', color: 'bg-[#0F2540] text-white' },
];

const library = [
  { name: 'Google Universal Analytics', initial: 'GA', color: 'bg-[#F9AB00] text-white' },
  { name: 'Snapchat', initial: '👻', color: 'bg-[#FFFC00] text-black' },
  { name: 'Search Ads 360', initial: 'SA', color: 'bg-[#4285F4] text-white' },
  { name: 'Google Campaign Manager', initial: 'CM', color: 'bg-[#34A853] text-white' },
  { name: 'Facebook Conversions API', initial: 'f', color: 'bg-[#1877F2] text-white' },
  { name: 'Tealium', initial: 'T', color: 'bg-[#00A0DF] text-white' },
  { name: 'Medallia', initial: 'M', color: 'bg-[#4B2E83] text-white' },
  { name: 'Google Analytics 4', initial: 'GA4', color: 'bg-[#E37400] text-white' },
  { name: 'Slack', initial: '#', color: 'bg-[#4A154B] text-white' },
  { name: 'TEST - Do not turn live', initial: '🐦', color: 'bg-gray-300 text-white' },
  { name: 'Adobe Analytics', initial: 'Aa', color: 'bg-[#FA0F00] text-white' },
  { name: 'Impact', initial: '◐', color: 'bg-black text-white' },
  { name: 'Salesforce', initial: 'sf', color: 'bg-[#00A1E0] text-white' },
  { name: 'HubSpot', initial: 'H', color: 'bg-[#FF7A59] text-white' },
  { name: 'Marketo', initial: 'M', color: 'bg-[#5C4C9F] text-white' },
  { name: 'Microsoft Advertising', initial: 'm', color: 'bg-[#00A4EF] text-white' },
  { name: 'TikTok Events API', initial: 't', color: 'bg-black text-white' },
  { name: 'Pinterest Conversions', initial: 'P', color: 'bg-[#E60023] text-white' },
];

const Card = ({ name, initial, color, status }: { name: string; initial: string; color: string; status: string }) => (
  <div className="border border-[#E5E7EB] rounded-md p-5 flex items-center gap-4 bg-white hover:shadow-sm transition-shadow cursor-pointer relative">
    <div className={`w-12 h-12 rounded-md flex items-center justify-center text-lg font-bold ${color}`}>{initial}</div>
    <div className="flex-1">
      <div className={`text-[11px] font-medium inline-block px-2 py-0.5 rounded mb-1 ${status === 'Integrated' ? 'bg-[#E6F7EF] text-[#1FA37A]' : 'bg-[#F3E8FF] text-[#7A4FCB]'}`}>{status}</div>
      <div className="text-[15px] text-[#0F2540] font-medium">{name}</div>
    </div>
  </div>
);

export default function InvocaIntegrations() {
  return (
    <InvocaShell>
      <div className="px-10 py-6 max-w-[1500px]">
        <h1 className="text-[28px] font-semibold text-[#0F2540] mb-2">Integrations</h1>
        <div className="border-b border-[#E5E7EB] mb-8" />

        <div className="text-[12px] tracking-wider text-[#5B6B7E] font-semibold mb-4">INTEGRATED</div>
        <div className="grid grid-cols-2 gap-4 mb-10">
          {integrated.map((i) => <Card key={i.name} {...i} status="Integrated" />)}
        </div>

        <div className="text-[12px] tracking-wider text-[#5B6B7E] font-semibold mb-4">LIBRARY</div>
        <div className="grid grid-cols-3 gap-4">
          {library.map((i) => <Card key={i.name} {...i} status="Learn More" />)}
        </div>
        <div className="h-16" />
      </div>
    </InvocaShell>
  );
}
