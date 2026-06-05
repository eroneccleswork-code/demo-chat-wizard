import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface IndustryDashboardData {
  networkName: string;
  inquiryKpiLabel: string;
  inquiryKpiPercent: number;
  inquiryTypes: string[];
  searchTerms: { term: string; calls: number; apptPct: number }[];
  campaigns: { name: string; calls: number; apptPct: number }[];
  linesOfBusiness: { name: string; calls: number; newPct: number; existingPct: number; apptPct: number }[];
  divisions: { name: string; calls: number; newPct: number; existingPct: number; apptPct: number }[];
}

// Fallback (Healthcare) so the page always renders 1:1 even before AI returns.
export const FALLBACK: IndustryDashboardData = {
  networkName: 'Invoca for Healthcare 2.0',
  inquiryKpiLabel: 'Inquiry Type: Billing and Payments (Percent)',
  inquiryKpiPercent: 21,
  inquiryTypes: ['Scheduling', 'Billing Inquiry', 'Insurance Verification'],
  searchTerms: [
    { term: 'ENT Doctors', calls: 130, apptPct: 47 },
    { term: 'Cardiovascular doctors', calls: 104, apptPct: 41 },
    { term: 'Cancer Treatment Centers', calls: 80, apptPct: 48 },
    { term: 'Orthopedists', calls: 77, apptPct: 51 },
    { term: 'Primary care physicians', calls: 72, apptPct: 33 },
  ],
  campaigns: [
    { name: 'Nationally ranked. Close to home.', calls: 674, apptPct: 37 },
    { name: 'Restoring hope', calls: 148, apptPct: 86 },
    { name: 'Advanced care, every day', calls: 92, apptPct: 44 },
  ],
  linesOfBusiness: [
    { name: 'Medical/Office', calls: 924, newPct: 72, existingPct: 28, apptPct: 49 },
    { name: 'ER/Urgent Care', calls: 216, newPct: 47, existingPct: 53, apptPct: 56 },
    { name: 'Surgery Center', calls: 169, newPct: 75, existingPct: 25, apptPct: 50 },
  ],
  divisions: [
    { name: 'West Florida', calls: 134, newPct: 81, existingPct: 19, apptPct: 30 },
    { name: 'North Texas', calls: 102, newPct: 39, existingPct: 61, apptPct: 61 },
    { name: 'Gulf Coast', calls: 92, newPct: 72, existingPct: 28, apptPct: 63 },
    { name: 'Mid-Atlantic', calls: 78, newPct: 55, existingPct: 45, apptPct: 41 },
    { name: 'Pacific Northwest', calls: 61, newPct: 64, existingPct: 36, apptPct: 47 },
  ],
};

const CACHE_KEY = 'invoca-industry-dashboard';

export function useIndustryDashboard(companyName?: string, industry?: string, websiteContext?: string) {
  const [data, setData] = useState<IndustryDashboardData>(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return FALLBACK;
  });

  useEffect(() => {
    if (!companyName && !industry) return;
    let cancelled = false;
    (async () => {
      try {
        const { data: resp, error } = await supabase.functions.invoke('industry-dashboard', {
          body: { companyName, industry, websiteContext },
        });
        if (cancelled || error || !resp || resp.error) return;
        const merged = { ...FALLBACK, ...resp };
        setData(merged);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [companyName, industry, websiteContext]);

  return data;
}

// Deterministic PRNG so numbers are stable per session.
export function seededRand(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return ((h >>> 0) % 100000) / 100000;
  };
}
