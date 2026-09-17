// Shared lead set used by the Google LSA leads console and the matching Invoca report.

export type LeadTruth = 'booked' | 'qualified' | 'spam' | 'existing' | 'not-serviceable';

export interface Lead {
  id: string;
  name: string;
  jobType: string;
  location: string;
  completed: string;
  leadType: 'Phone' | 'Message';
  chargeStatus: string;
  received: string;
  lastActivity: string;
  duration: string;
  /** what Invoca knows that the LSA console does not */
  truth: LeadTruth;
  // report-only enrichment
  callerId: string;
  city: string;
  time: string;
  campaign: string;
  keyword: string;
}

const HOME_JOBS = [
  'Roof repair', 'Roof installation', 'Drain cleaning', 'Water heater repair',
  'AC tune-up', 'Garbage disposal repair', 'Leak detection', 'Furnace repair',
];

/** Trade-specific job lists keyed by words found in the company name / industry. */
const TRADE_JOBS: { test: RegExp; jobs: string[] }[] = [
  { test: /dent|ortho|smile/i, jobs: ['New patient exam', 'Cleaning', 'Emergency visit', 'Whitening consult', 'Implant consult'] },
  { test: /health|clinic|medical|care/i, jobs: ['New patient visit', 'Specialist referral', 'Urgent care', 'Annual physical'] },
  { test: /plumb|drain|rooter|sewer/i, jobs: ['Drain cleaning', 'Water heater repair', 'Leak detection', 'Toilet repair', 'Sewer line inspection', 'Garbage disposal repair'] },
  { test: /hvac|heating|air|furnace|cooling|climate/i, jobs: ['AC repair', 'AC tune-up', 'Furnace repair', 'New system install', 'Duct cleaning', 'Thermostat install'] },
  { test: /roof|gutter/i, jobs: ['Roof repair', 'Roof installation', 'Leak inspection', 'Gutter replacement', 'Storm damage repair'] },
  { test: /electric|amp|volt|wiring/i, jobs: ['Panel upgrade', 'Outlet repair', 'Lighting install', 'EV charger install', 'Whole-home rewire'] },
  { test: /blind|shade|shutter|window treat/i, jobs: ['Blinds installation', 'Shutter consult', 'Motorized shades', 'Window measure', 'Shade repair'] },
  { test: /window|door|andersen|glass/i, jobs: ['Window replacement', 'Patio door install', 'Free in-home estimate', 'Glass repair', 'Window measure'] },
  { test: /pest|termite|exterminat/i, jobs: ['Ant treatment', 'Termite inspection', 'Rodent control', 'Quarterly service', 'Bed bug treatment'] },
  { test: /landscap|lawn|tree|garden/i, jobs: ['Lawn maintenance', 'Tree trimming', 'Irrigation repair', 'Landscape design', 'Sod install'] },
  { test: /garage/i, jobs: ['Garage door repair', 'Spring replacement', 'Opener install', 'New door quote', 'Track alignment'] },
  { test: /clean|maid|janitor/i, jobs: ['Deep clean', 'Recurring clean', 'Move-out clean', 'Carpet cleaning', 'Window cleaning'] },
  { test: /solar/i, jobs: ['Solar consult', 'Panel install', 'Battery add-on', 'System repair', 'Roof assessment'] },
  { test: /appliance/i, jobs: ['Refrigerator repair', 'Washer repair', 'Oven repair', 'Dishwasher install', 'Dryer service'] },
  { test: /pool|spa/i, jobs: ['Weekly service', 'Pump repair', 'Heater repair', 'Green pool recovery', 'Filter clean'] },
  { test: /floor|carpet|tile/i, jobs: ['Flooring estimate', 'Tile install', 'Carpet replacement', 'Hardwood refinish', 'Subfloor repair'] },
];

/** Services scraped for this brand, cached by the LSA screen. */
function cachedBrandServices(companyName?: string): string[] {
  if (typeof window === 'undefined' || !companyName) return [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('lsa-data-v1:')) continue;
      if (!key.toLowerCase().includes(companyName.toLowerCase())) continue;
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      const services: unknown = saved?.services;
      if (Array.isArray(services) && services.length >= 3) {
        return services.filter((s): s is string => typeof s === 'string' && s.length > 2).slice(0, 6);
      }
    }
  } catch { /* ignore */ }
  return [];
}

export function jobsFor(industry?: string, companyName?: string) {
  const scraped = cachedBrandServices(companyName);
  if (scraped.length >= 3) return scraped;
  const haystack = `${companyName || ''} ${industry || ''}`;
  const match = TRADE_JOBS.find(t => t.test.test(haystack));
  if (match) return match.jobs;
  return HOME_JOBS;
}

const NAMES = [
  'Marcus Webb', 'Dana Ruiz', 'Priya Natarajan', 'Tom Callahan', 'Elaine Foster',
  'Jordan Mireles', 'Sofia Bennett', 'Ray Okafor', 'Hannah Lindqvist', 'Victor Pham',
  'Cheryl Dawson', 'Andre Salas',
];

const TRUTHS: LeadTruth[] = [
  'booked', 'qualified', 'spam', 'booked', 'existing', 'qualified',
  'spam', 'booked', 'not-serviceable', 'qualified', 'booked', 'spam',
];

const CITIES = [
  'Encinitas, CA', 'Carlsbad, CA', 'Solana Beach, CA', 'Oceanside, CA', 'Del Mar, CA',
  'Vista, CA', 'San Marcos, CA', 'Escondido, CA', 'Phoenix, AZ', 'La Jolla, CA',
  'Cardiff, CA', 'Poway, CA',
];

const CAMPAIGNS = ['Google LSA — Local Services', 'Google LSA — Emergency', 'Google LSA — Local Services'];
const KEYWORDS = ['near me', 'emergency service', 'same day', 'best rated', '—'];
const DURATIONS = ['4:12', '0:38', '6:47', '2:05', '0:22', '5:31', '1:14', '7:02', '0:51', '3:44', '—', '0:19'];

export function buildLeads(jobs: string[]): Lead[] {
  const dates = ['Mar 29', 'Mar 29', 'Mar 29', 'Mar 28', 'Mar 28', 'Mar 27', 'Mar 27', 'Mar 26', 'Mar 26', 'Feb 21', 'Mar 12', 'Mar 11'];
  return NAMES.map((name, i) => {
    const hrs24 = 8 + (i % 10);
    const hrs = hrs24 > 12 ? hrs24 - 12 : hrs24;
    return {
      id: `lead-${i}`,
      name,
      jobType: i % 5 === 3 ? '-' : jobs[i % jobs.length],
      location: '-',
      completed: dates[i],
      leadType: (i === 10 ? 'Message' : 'Phone') as Lead['leadType'],
      chargeStatus: 'Charged',
      received: dates[Math.min(i + 1, dates.length - 1)],
      lastActivity: dates[i],
      duration: DURATIONS[i],
      truth: TRUTHS[i],
      callerId: `(${(600 + i * 13) % 300 + 600}) ${(200 + i * 7) % 700 + 200}-${((1000 + i * 173) % 9000).toString().padStart(4, '0')}`,
      city: CITIES[i],
      time: `${dates[i]}, ${hrs}:${((i * 11) % 60).toString().padStart(2, '0')} ${hrs24 >= 12 ? 'pm' : 'am'}`,
      campaign: CAMPAIGNS[i % CAMPAIGNS.length],
      keyword: KEYWORDS[i % KEYWORDS.length],
    };
  });
}

export const TRUTH_LABEL: Record<LeadTruth, { label: string; tone: string }> = {
  booked: { label: 'Appointment Booked', tone: 'bg-[#E6F4EA] text-[#137333]' },
  qualified: { label: 'Qualified Lead', tone: 'bg-[#E8F0FE] text-[#1967D2]' },
  spam: { label: 'Spam — dispute filed', tone: 'bg-[#FCE8E6] text-[#C5221F]' },
  existing: { label: 'Existing customer — dispute filed', tone: 'bg-[#FEF7E0] text-[#B06000]' },
  'not-serviceable': { label: 'Out of area — dispute filed', tone: 'bg-[#FEF7E0] text-[#B06000]' },
};

/** Signals Invoca fires per lead — drives the report's check columns. */
export function signalsFor(lead: Lead) {
  const t = lead.truth;
  return {
    qualified: t === 'booked' || t === 'qualified',
    converted: t === 'booked',
    newCustomer: t === 'booked' || t === 'qualified' || t === 'not-serviceable',
    serviceable: t !== 'not-serviceable' && t !== 'spam',
    humanCaller: t !== 'spam',
    billable: t === 'booked' || t === 'qualified',
  };
}

export const REASON: Record<LeadTruth, string> = {
  booked: 'Job booked on call',
  qualified: 'Real job request',
  spam: 'Robocall / solicitation',
  existing: 'Existing customer',
  'not-serviceable': 'Outside service area',
};
