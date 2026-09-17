import { useMemo, useState } from 'react';
import { buildLeads, jobsFor, TRUTH_LABEL, type Lead } from '@/lib/lsa-leads';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, ChevronDown, Search, Play, Check, X, Sparkles, ArrowRight } from 'lucide-react';

type Mode = 'manual' | 'invoca';

export default function LsaLeads() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as any) || {};
  const companyName: string = state.companyName || 'Sherlock Plumbing';
  const industry: string = state.industry || 'Home Services';

  const jobs = useMemo(() => jobsFor(industry, companyName), [industry, companyName]);

  const leads = useMemo(() => buildLeads(jobs), [jobs]);

  const [mode, setMode] = useState<Mode>('manual');
  const [reviewed, setReviewed] = useState<Record<string, 'confirmed' | 'disputed'>>({});
  const [playing, setPlaying] = useState<string | null>(null);

  const pending = leads.length - Object.keys(reviewed).length;
  const disputes = leads.filter(l => l.truth === 'spam' || l.truth === 'existing' || l.truth === 'not-serviceable').length;
  const manualMinutes = Math.round(leads.reduce((sum, l) => {
    const [m, s] = l.duration.split(':');
    return sum + (Number(m) || 0) + (Number(s) || 0) / 60 + 1.5;
  }, 0));

  return (
    <div className="min-h-screen bg-[#F1F3F4] flex flex-col">
      {/* Mode switch */}
      <div className="bg-[#202124] text-white px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="opacity-60">Google Local Services — Lead management</span>
        </div>
        <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
          {(['manual', 'invoca'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full transition-colors ${mode === m ? 'bg-white text-[#202124] font-medium' : 'text-white/70 hover:text-white'}`}
            >
              {m === 'manual' ? 'Before Invoca — manual review' : 'After Invoca — automated'}
            </button>
          ))}
        </div>
      </div>

      {/* Blue app bar */}
      <div className="bg-[#4285F4] text-white h-14 flex items-center px-4 gap-5">
        <Menu className="w-5 h-5" />
        <span className="text-[20px]">Leads</span>
        <div className="ml-auto relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#EA4335] text-[9px] flex items-center justify-center">1</span>
        </div>
      </div>

      {/* Account bar */}
      <div className="bg-white border-b border-[#E0E0E0] px-6 py-3 flex items-end gap-4">
        <div>
          <div className="text-[22px] leading-none font-medium text-[#3C4043]">{companyName}</div>
          <div className="text-[11px] text-[#5F6368] mt-1">
            Customer ID: <span className="text-[17px] font-medium text-[#3C4043] align-middle">999-999-999</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-[#5F6368] mb-2" />
      </div>

      {/* Filters */}
      <div className="bg-white px-6 py-4 flex items-center gap-8 border-b border-[#E8EAED]">
        <div className="flex items-center gap-8 text-[#3C4043] text-sm">
          <span className="flex items-center gap-10 border-b border-[#DADCE0] pb-1 w-56 justify-between">Completed <ChevronDown className="w-4 h-4 text-[#5F6368]" /></span>
          <span className="flex items-center gap-10 border-b border-[#DADCE0] pb-1 w-56 justify-between">Any charge status <ChevronDown className="w-4 h-4 text-[#5F6368]" /></span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Search className="w-4 h-4 text-[#5F6368]" />
          <button className="bg-[#1A73E8] text-white text-xs font-medium tracking-wide px-4 py-2 rounded-sm">DOWNLOAD</button>
        </div>
      </div>

      {/* Status strip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={`px-6 py-3 text-sm flex items-center gap-3 ${mode === 'manual' ? 'bg-[#FEF7E0] text-[#B06000]' : 'bg-[#E6F4EA] text-[#137333]'}`}
        >
          {mode === 'manual' ? (
            <>
              <span className="font-medium">{pending} leads need manual review</span>
              <span className="opacity-80">
                Someone has to listen to every call, decide if it was a real job, and file disputes by hand — about {manualMinutes} minutes a day.
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Invoca reviewed all {leads.length} leads automatically</span>
              <span className="opacity-80">{disputes} bad leads disputed, {leads.length - disputes} confirmed as real — 0 minutes of manual review.</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-[13px] text-[#3C4043]">
          <thead>
            <tr className="text-[#5F6368] bg-[#F8F9FA] border-b border-[#E8EAED]">
              <th className="text-left font-medium px-6 py-3">Name</th>
              <th className="text-left font-medium px-4 py-3">Job type</th>
              <th className="text-left font-medium px-4 py-3">Location</th>
              <th className="text-left font-medium px-4 py-3">Completed</th>
              <th className="text-left font-medium px-4 py-3">Lead type</th>
              <th className="text-left font-medium px-4 py-3">Charge status</th>
              <th className="text-left font-medium px-4 py-3">Lead received</th>
              <th className="text-left font-medium px-4 py-3">{mode === 'manual' ? 'Review' : 'Invoca outcome'}</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => {
              const decision = reviewed[lead.id];
              return (
                <tr key={lead.id} className="border-b border-[#F1F3F4] hover:bg-[#FAFAFA]">
                  <td className="px-6 py-3 whitespace-nowrap">{lead.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.jobType}</td>
                  <td className="px-4 py-3">{lead.location}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.completed}</td>
                  <td className="px-4 py-3">{lead.leadType}</td>
                  <td className="px-4 py-3">{lead.chargeStatus}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{lead.received}</td>
                  <td className="px-4 py-3">
                    {mode === 'manual' ? (
                      decision ? (
                        <span className={`text-xs font-medium ${decision === 'confirmed' ? 'text-[#137333]' : 'text-[#C5221F]'}`}>
                          {decision === 'confirmed' ? 'Confirmed by you' : 'Dispute filed by you'}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPlaying(playing === lead.id ? null : lead.id)}
                            className="flex items-center gap-1 text-xs text-[#1A73E8] hover:underline"
                          >
                            <Play className="w-3 h-3" /> {playing === lead.id ? 'Playing…' : `Listen ${lead.duration}`}
                          </button>
                          <button
                            onClick={() => setReviewed(r => ({ ...r, [lead.id]: 'confirmed' }))}
                            className="flex items-center gap-1 text-xs border border-[#DADCE0] rounded-sm px-2 py-1 hover:bg-[#F1F3F4]"
                          >
                            <Check className="w-3 h-3" /> Real job
                          </button>
                          <button
                            onClick={() => setReviewed(r => ({ ...r, [lead.id]: 'disputed' }))}
                            className="flex items-center gap-1 text-xs border border-[#DADCE0] rounded-sm px-2 py-1 hover:bg-[#F1F3F4]"
                          >
                            <X className="w-3 h-3" /> Dispute
                          </button>
                        </div>
                      )
                    ) : (
                      <span className={`inline-block text-xs font-medium px-2 py-1 rounded-sm ${TRUTH_LABEL[lead.truth].tone}`}>
                        {TRUTH_LABEL[lead.truth].label}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white border-t border-[#E8EAED] px-6 py-3 flex items-center justify-between">
        <span className="text-xs text-[#5F6368]">
          {mode === 'manual'
            ? 'Every row above is billed until somebody proves otherwise.'
            : 'Invoca listens to each call and files the disputes for you.'}
        </span>
        <button
          onClick={() => navigate('/invoca/lsa-report', { state: { companyName, industry, customSignals: state.customSignals } })}
          className="flex items-center gap-2 text-sm text-[#1A73E8] hover:underline"
        >
          See these leads in Invoca <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
