import { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({ width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor', ...p });

// Dashboards: asymmetric 4-tile grid (big top-left, 3 smaller)
export const IcDashboards = (p: P) => (
  <svg {...base(p)}>
    <rect x="2" y="2" width="11" height="11" rx="1.2" />
    <rect x="15" y="2" width="7" height="7" rx="1.2" />
    <rect x="2" y="15" width="7" height="7" rx="1.2" />
    <rect x="11" y="11" width="11" height="11" rx="1.2" />
  </svg>
);

// Call Review: clapperboard / film slate
export const IcCallReview = (p: P) => (
  <svg {...base(p)}>
    <path d="M2 9h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z" />
    <path d="M3 3h5l1.2 4H4.2L3 3zm6.5 0h5l1.2 4h-5L9.5 3zM16 3h5l1 4h-5l-1-4z" />
    <rect x="6" y="12" width="4" height="6" rx=".5" fill="#F4F6F8" />
    <rect x="11" y="12" width="4" height="6" rx=".5" fill="#F4F6F8" />
    <rect x="16" y="12" width="2.5" height="6" rx=".5" fill="#F4F6F8" />
  </svg>
);

// Advertisers: stacked folders
export const IcAdvertisers = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 5h5l2 2h7a2 2 0 0 1 2 2v1H3V7a2 2 0 0 1 2-2z" opacity=".55" />
    <path d="M3 10h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z" />
  </svg>
);

// Campaigns: phone with outgoing arrow
export const IcCampaigns = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.6 3.5a2 2 0 0 1 2.7.9l1.1 2.2a2 2 0 0 1-.5 2.4L8.5 10.4a13 13 0 0 0 5.1 5.1l1.4-1.4a2 2 0 0 1 2.4-.5l2.2 1.1a2 2 0 0 1 .9 2.7l-.7 1.4a3 3 0 0 1-3.3 1.6C11.7 19.6 4.4 12.3 3.1 6.3A3 3 0 0 1 4.7 3l1.9-.5z" transform="translate(-1 0)" />
    <path d="M14 3h7v7l-2.2-2.2-4 4-2.6-2.6 4-4L14 3z" />
  </svg>
);

// Publishers: group of people (3)
export const IcPublishers = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.5" />
    <circle cx="5" cy="9" r="2.5" />
    <circle cx="19" cy="9" r="2.5" />
    <path d="M4 20c0-3 2.7-5 8-5s8 2 8 5v1H4v-1z" />
    <path d="M0 20c.3-2.2 2-3.5 4.5-3.7-1.2.9-1.8 2.2-1.9 3.7H0zm24 0h-2.6c-.1-1.5-.7-2.8-1.9-3.7 2.5.2 4.2 1.5 4.5 3.7z" />
  </svg>
);

// Promo Numbers: 3x4 dot keypad grid
export const IcPromoNumbers = (p: P) => {
  const dots = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    dots.push(<circle key={`${r}-${c}`} cx={5 + c * 7} cy={3 + r * 6} r="1.6" />);
  }
  return <svg {...base(p)}>{dots}</svg>;
};

// Reports: 3 vertical bars (middle tallest)
export const IcReports = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="11" width="4" height="10" rx="1" />
    <rect x="10" y="5" width="4" height="16" rx="1" />
    <rect x="16" y="9" width="4" height="12" rx="1" />
  </svg>
);

// Integrations: org/tree chart (1 top, 3 below connected)
export const IcIntegrations = (p: P) => (
  <svg {...base(p)} stroke="currentColor" strokeWidth="1.5">
    <rect x="9" y="2" width="6" height="5" rx="1" />
    <rect x="2" y="16" width="6" height="5" rx="1" />
    <rect x="9" y="16" width="6" height="5" rx="1" />
    <rect x="16" y="16" width="6" height="5" rx="1" />
    <path d="M12 7v4M5 16v-2h14v2M12 14v2" fill="none" />
  </svg>
);

// Signal: filled dark circle w/ paper-plane/compass needle
export const IcSignal = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M17 7l-8 3-2 7 4-4 6-6z" fill="#F4F6F8" />
    <circle cx="11" cy="13" r="1" fill="currentColor" />
  </svg>
);

// Score: clipboard with check
export const IcScore = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="16" height="18" rx="2" />
    <rect x="8" y="2" width="8" height="4" rx="1" fill="currentColor" stroke="#F4F6F8" strokeWidth="1" />
    <path d="M8 13l3 3 5-6" stroke="#F4F6F8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Labs: erlenmeyer flask
export const IcLabs = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 2h6v2h-1v5l5.8 10A2 2 0 0 1 18 22H6a2 2 0 0 1-1.8-3L10 9V4H9V2z" />
  </svg>
);

// Settings: gear
export const IcSettings = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 2l1.5 2.5 2.9-.4.6 2.9 2.7 1.2-1.1 2.7 1.6 2.5-2.3 1.8.1 2.9-2.8.7-1.4 2.6-2.8-1-2.8 1-1.4-2.6-2.8-.7.1-2.9L1.8 14l1.6-2.5L2.3 8.8 5 7.6l.6-2.9 2.9.4L10 2.6 12 2z" />
    <circle cx="12" cy="12" r="3.5" fill="#F4F6F8" />
  </svg>
);
