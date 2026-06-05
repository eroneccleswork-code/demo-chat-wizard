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

export const HOME_SERVICE_FALLBACK: IndustryDashboardData = {
  networkName: 'Invoca for Home Services 2.0',
  inquiryKpiLabel: 'Inquiry Type: Pricing and Quotes (Percent)',
  inquiryKpiPercent: 28,
  inquiryTypes: ['Free Estimate', 'Service Request', 'Pricing Inquiry'],
  searchTerms: [
    { term: 'window replacement', calls: 142, apptPct: 52 },
    { term: 'roof repair near me', calls: 118, apptPct: 44 },
    { term: 'HVAC installation cost', calls: 96, apptPct: 39 },
    { term: 'gutter installation', calls: 71, apptPct: 47 },
    { term: 'bathroom remodel', calls: 64, apptPct: 36 },
  ],
  campaigns: [
    { name: 'Free in-home estimate', calls: 612, apptPct: 41 },
    { name: 'Spring savings event', calls: 184, apptPct: 58 },
    { name: 'Lifetime warranty promise', calls: 88, apptPct: 49 },
  ],
  linesOfBusiness: [
    { name: 'Window Replacement', calls: 884, newPct: 78, existingPct: 22, apptPct: 52 },
    { name: 'Roofing', calls: 247, newPct: 81, existingPct: 19, apptPct: 47 },
    { name: 'HVAC Service', calls: 193, newPct: 54, existingPct: 46, apptPct: 61 },
  ],
  divisions: [
    { name: 'West Florida', calls: 128, newPct: 79, existingPct: 21, apptPct: 38 },
    { name: 'North Texas', calls: 109, newPct: 71, existingPct: 29, apptPct: 55 },
    { name: 'Gulf Coast', calls: 88, newPct: 66, existingPct: 34, apptPct: 49 },
    { name: 'Mid-Atlantic', calls: 74, newPct: 58, existingPct: 42, apptPct: 44 },
    { name: 'Pacific Northwest', calls: 57, newPct: 69, existingPct: 31, apptPct: 51 },
  ],
};

export function isHomeService(industry?: string) {
  const s = (industry || '').toLowerCase();
  return s.includes('home') || (s.includes('service') && !s.includes('health'));
}

export function industryTerms(industry?: string) {
  if (isHomeService(industry)) {
    return {
      newPctLabel: 'Caller Type: New Customers (Percent)',
      existingPctLabel: 'Caller Type: Existing Customer (Perc…',
      apptPctLabel: 'Estimate: Scheduled (Percent)',
      apptShort: 'Estimate:…',
      apptTitleShort: 'Estimate',
      apptTitle: 'Estimates',
    };
  }
  return {
    newPctLabel: 'Caller Type: New Patients (Percent)',
    existingPctLabel: 'Caller Type: Existing Patient (Perc…',
    apptPctLabel: 'Appointment: Scheduled (Percent)',
    apptShort: 'Appointment:…',
    apptTitleShort: 'Appointment',
    apptTitle: 'Appointments',
  };
}

const CACHE_KEY = 'invoca-industry-dashboard';

export function useIndustryDashboard(companyName?: string, industry?: string, websiteContext?: string) {
  const baseFallback = isHomeService(industry) ? HOME_SERVICE_FALLBACK : FALLBACK;
  const [data, setData] = useState<IndustryDashboardData>(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY + ':' + (industry || 'default'));
      if (cached) return JSON.parse(cached);
    } catch {}
    return baseFallback;
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
        const merged = { ...baseFallback, ...resp };
        setData(merged);
        sessionStorage.setItem(CACHE_KEY + ':' + (industry || 'default'), JSON.stringify(merged));
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
