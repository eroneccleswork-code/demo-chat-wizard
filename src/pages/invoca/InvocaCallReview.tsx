import InvocaShell from '@/components/invoca/InvocaShell';
import { Play, Pause, SkipBack, SkipForward, Download, Share2, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const transcript = [
  { who: 'Agent', time: '0:02', text: 'Thank you for calling St. Luke\'s Orthopedic Center. This is Sarah, how may I help you today?' },
  { who: 'Caller', time: '0:08', text: 'Hi Sarah. I\'m calling because I\'ve been having some pretty bad knee pain for about three weeks now, and I\'d like to schedule an appointment to see an orthopedic surgeon.' },
  { who: 'Agent', time: '0:21', text: 'I\'m sorry to hear that. I can definitely help you get an appointment scheduled. Have you been seen at our practice before?' },
  { who: 'Caller', time: '0:29', text: 'No, this would be my first time. I just moved to the area a few months ago.' },
  { who: 'Agent', time: '0:35', text: 'Welcome to the area! I\'ll get you set up as a new patient. Can I get your full name and date of birth?' },
  { who: 'Caller', time: '0:43', text: 'Sure, it\'s Michael Thompson, and my date of birth is March 14th, 1985.' },
  { who: 'Agent', time: '0:52', text: 'Great, thank you Michael. And do you have insurance you\'d like to use for this visit?' },
  { who: 'Caller', time: '0:58', text: 'Yes, I have Blue Cross Blue Shield through my employer.' },
  { who: 'Agent', time: '1:05', text: 'Perfect, we accept Blue Cross. Let me check the schedule for Dr. Patel, our knee specialist. I have an opening this Thursday at 2:30 PM. Does that work?' },
  { who: 'Caller', time: '1:18', text: 'Thursday at 2:30 works great. Thank you so much.' },
  { who: 'Agent', time: '1:24', text: 'Wonderful. You\'re all set. We\'ll send a confirmation text and an intake form to fill out beforehand. See you Thursday!' },
];

const tags = [
  { label: 'Caller Type', value: 'New Patient', color: 'bg-[#E6F7EF] text-[#1FA37A]' },
  { label: 'Inquiry Type', value: 'Appointment', color: 'bg-[#E6F0FF] text-[#2D6CDF]' },
  { label: 'Appointment', value: 'Scheduled', color: 'bg-[#E6F7EF] text-[#1FA37A]' },
  { label: 'Insurance', value: 'Blue Cross Blue Shield', color: 'bg-[#F3E8FF] text-[#7A4FCB]' },
  { label: 'Specialty', value: 'Orthopedics', color: 'bg-[#FFF4E5] text-[#B86E00]' },
];

export default function InvocaCallReview() {
  const navigate = useNavigate();
  return (
    <InvocaShell>
      <div className="px-10 py-6 max-w-[1500px]">
        <div className="text-[13px] text-[#2D6CDF] mb-2">
          <span className="hover:underline cursor-pointer" onClick={() => navigate('/invoca/call-report')}>Marketing Call Details</span>
          <span className="text-gray-400"> › </span>Call Detail
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[26px] font-semibold text-[#0F2540]">Call from 919-380-6234</h1>
            <div className="text-sm text-[#5B6B7E] mt-1">3/1/22 1:13 pm · St Luke's Orthopedic · Oncology · New England</div>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Share2 className="w-5 h-5" />
            <Download className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>

        {/* Player */}
        <div className="bg-[#0F2540] text-white rounded-lg p-5 mb-6 flex items-center gap-6">
          <button className="w-12 h-12 rounded-full bg-[#1FA37A] flex items-center justify-center"><Play className="w-5 h-5 ml-0.5" fill="white" /></button>
          <button className="text-white/70 hover:text-white"><SkipBack className="w-5 h-5" /></button>
          <button className="text-white/70 hover:text-white"><SkipForward className="w-5 h-5" /></button>
          <div className="text-sm font-mono">0:00</div>
          <div className="flex-1 h-1.5 bg-white/20 rounded-full relative">
            <div className="absolute left-0 top-0 h-full w-0 bg-[#1FA37A] rounded-full" />
            <div className="absolute h-full w-full flex">
              {Array.from({ length: 80 }).map((_, i) => <div key={i} className="flex-1 mx-px bg-white/30" style={{ height: `${20 + Math.random() * 80}%`, marginTop: 'auto' }} />)}
            </div>
          </div>
          <div className="text-sm font-mono">1:32</div>
        </div>

        <div className="grid grid-cols-[1fr_360px] gap-6">
          {/* Transcript */}
          <div className="bg-white border border-[#E5E7EB] rounded-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-[#0F2540]">Transcript</h2>
              <div className="text-xs text-[#5B6B7E]">AI-generated</div>
            </div>
            <div className="space-y-5">
              {transcript.map((t, i) => (
                <div key={i} className="grid grid-cols-[80px_50px_1fr] gap-3 text-sm">
                  <div className={`font-semibold ${t.who === 'Agent' ? 'text-[#1FA37A]' : 'text-[#2D6CDF]'}`}>{t.who}</div>
                  <div className="text-[#5B6B7E] text-xs pt-0.5">{t.time}</div>
                  <div className="text-[#0F2540] leading-relaxed">{t.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Signals / Metadata */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-md p-5">
              <h3 className="text-[14px] font-bold text-[#0F2540] mb-3 tracking-wide">SIGNAL AI</h3>
              <div className="space-y-2">
                {tags.map((t) => (
                  <div key={t.label} className="flex items-center justify-between text-xs">
                    <span className="text-[#5B6B7E]">{t.label}</span>
                    <span className={`px-2 py-1 rounded-full font-medium ${t.color}`}>{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-md p-5">
              <h3 className="text-[14px] font-bold text-[#0F2540] mb-3 tracking-wide">SCORE</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-[42px] font-light text-[#1FA37A] leading-none">94</span>
                <span className="text-sm text-[#5B6B7E]">/ 100</span>
              </div>
              <div className="text-xs text-[#5B6B7E] mt-2">High-quality conversion call</div>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-md p-5">
              <h3 className="text-[14px] font-bold text-[#0F2540] mb-3 tracking-wide">CALL DETAILS</h3>
              <dl className="space-y-2 text-sm">
                {[
                  ['Caller ID', '919-380-6234'],
                  ['Destination', '866-398-7557'],
                  ['Duration', '1:32'],
                  ['Source', 'Google Ads'],
                  ['Campaign', 'Restoring hope'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><dt className="text-[#5B6B7E]">{k}</dt><dd className="text-[#0F2540] font-medium">{v}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        <div className="h-16" />
      </div>
    </InvocaShell>
  );
}
