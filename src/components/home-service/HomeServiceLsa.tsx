import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, Camera, MoreVertical, Phone, CalendarDays, MessageSquareText, MapPin, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface LsaBusiness {
  name: string;
  rating: number;
  reviewCount: string;
  yearsInBusiness: number;
  attribute: string;
  hours: string;
  phone: string;
  website: string;
}

interface Props {
  domain: string;
  companyName: string;
  industry?: string;
  onClickAd: () => void;
  scrapedAd?: { description?: string; metaTitle?: string } | null;
}

const GoogleLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 272 92" className={className}>
    <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335" />
    <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05" />
    <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4" />
    <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853" />
    <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335" />
    <path d="M35.29 41.19V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49-.01z" fill="#4285F4" />
  </svg>
);

const AVATAR_COLORS = ['#1a73e8', '#188038', '#c5221f', '#e37400', '#7b1fa2', '#00796b', '#5f6368', '#ad1457'];

const loadedLogoUrls = new Set<string>();

function logoUrl(host: string) {
  return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
}

function preloadLogo(host: string) {
  if (!host) return Promise.resolve();
  const src = logoUrl(host);
  if (loadedLogoUrls.has(src)) return Promise.resolve();

  return new Promise<void>(resolve => {
    const image = new Image();
    const finish = () => resolve();
    image.onload = () => {
      loadedLogoUrls.add(src);
      finish();
    };
    image.onerror = finish;
    image.src = src;
  });
}

function preloadBusinessLogos(businesses: LsaBusiness[]) {
  return Promise.all(
    businesses.map(business => {
      const host = (business.website || '').replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      return preloadLogo(host);
    })
  );
}

function BizAvatar({ name, host, className = '' }: { name: string; host: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const src = host ? logoUrl(host) : '';
  const [loaded, setLoaded] = useState(() => Boolean(src && loadedLogoUrls.has(src)));
  const initials = name
    .replace(/[^a-zA-Z ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');
  const color = AVATAR_COLORS[(name.charCodeAt(0) + name.length) % AVATAR_COLORS.length];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden font-semibold text-white select-none ${className}`}
      style={{ backgroundColor: color }}
    >
      <span className={loaded && !failed ? 'invisible' : ''}>{initials || '?'}</span>
      {host && !failed && (
        <img
          src={src}
          alt=""
          loading="eager"
          decoding="sync"
          // @ts-expect-error fetchpriority is valid HTML
          fetchpriority="high"
          onLoad={() => {
            loadedLogoUrls.add(src);
            setLoaded(true);
          }}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-contain bg-white p-2 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-[#e7711b] tracking-[-0.5px] text-[11px]">
      {'★★★★★'.split('').map((s, i) => (
        <span key={i} style={{ opacity: i + 1 <= Math.round(rating) ? 1 : 0.25 }}>{s}</span>
      ))}
    </span>
  );
}

function fallbackData(companyName: string, domain: string, industry?: string) {
  const cat = /dental/i.test(industry || '') ? 'Dentists' : /health/i.test(industry || '') ? 'Clinics' : 'Home service pros';
  const query = /dental/i.test(industry || '') ? 'dentist' : /health/i.test(industry || '') ? 'urgent care' : 'home services';
  const names = [
    'Anderson Home Services',
    'Sherlock Pro Services',
    'ASI, The White Glove Guys',
    'Bill Howe Services',
    'John Padilla Inc.',
    'Thompson Service Co.',
    'We Care Home Pros',
  ];
  return {
    query,
    location: 'Encinitas, CA 92024',
    category: cat,
    businesses: [
      { name: companyName, rating: 4.9, reviewCount: '4.4K', yearsInBusiness: 24, attribute: 'Family owned', hours: 'Open 24 hours', phone: '(619) 555-0142', website: domain },
      ...names.map((n, i) => ({
        name: n,
        rating: [4.8, 4.8, 4.9, 4.8, 4.9, 4.8, 4.7][i],
        reviewCount: ['3.3K', '7.6K', '6K', '318', '1.3K', '1.3K', '2.1K'][i],
        yearsInBusiness: [48, 73, 46, 16, 45, 28, 18][i],
        attribute: ['Woman owned business', 'Local business', 'Family owned', 'Family owned', 'Family owned', 'Free in-home estimate', 'Local business'][i],
        hours: i % 2 === 0 ? 'Open 24 hours' : 'Open now',
        phone: `(619) 5${i}5-1${i}57`,
        website: `${n.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      })),
    ] as LsaBusiness[],
  };
}

function QuoteModal({
  business,
  category,
  host,
  onClose,
  onSend,
}: {
  business: LsaBusiness;
  category: string;
  host: string;
  onClose: () => void;
  onSend: () => void;
}) {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState<'sms' | 'email'>('sms');

  const services = /dent/i.test(category)
    ? ['Routine cleaning', 'Emergency visit', 'Teeth whitening', 'Implants consult']
    : /clinic|health/i.test(category)
      ? ['Urgent care visit', 'New patient exam', 'Lab work', 'Telehealth']
      : ['Emergency repair', 'Installation', 'Maintenance / tune-up', 'Free estimate'];

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center bg-black/40 pt-10 px-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[600px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85%]"
      >
        <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200">
          <button onClick={onClose} className="text-gray-600 text-xl leading-none">←</button>
          <h3 className="text-[19px] text-gray-900">Send request to {business.name}</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex gap-4 mb-6">
            <BizAvatar
              name={business.name}
              host={host}
              className="w-[70px] h-[70px] rounded-lg border border-gray-200 bg-white p-2 text-[16px] flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[17px] text-gray-900">{business.name}</p>
              <p className="text-[13px] text-gray-700 flex items-center gap-1">
                {business.rating.toFixed(1)} <Stars rating={business.rating} /> ({business.reviewCount})
              </p>
              <p className="text-[13px] text-gray-600 flex items-center gap-1.5 mt-0.5">
                <MessageSquareText className="w-3.5 h-3.5 text-blue-600" /> Typically replies in 15 min
              </p>
              <p className="text-[13px] text-gray-600 mt-0.5">Contacted by 37 people in the last week</p>
            </div>
          </div>

          <label className="block text-[15px] text-gray-800 mb-2">Your message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value.slice(0, 600))}
            placeholder="Give details like what you need done and how soon you need it"
            className="w-full h-28 border border-gray-400 rounded-lg p-3 text-[15px] outline-none focus:border-blue-600 resize-none"
          />
          <p className="text-right text-xs text-gray-500 mb-4">{message.length}/600</p>

          <label className="block text-[15px] text-gray-800 mb-2">Service (optional)</label>
          <select
            defaultValue=""
            className="w-full border border-gray-400 rounded-lg px-3 py-3 text-[15px] text-gray-700 outline-none focus:border-blue-600 mb-5 bg-white"
          >
            <option value="" disabled>Choose the service you need</option>
            {services.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <label className="block text-[15px] text-gray-800 mb-2">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value.slice(0, 50))}
            placeholder="Name"
            className="w-full max-w-[400px] border border-gray-400 rounded-lg px-3 py-3 text-[15px] outline-none focus:border-blue-600"
          />
          <p className="text-[11px] text-gray-500 mb-5 max-w-[400px] text-right">{name.length}/50</p>

          <p className="text-[15px] text-gray-800 mb-3">How would you like to hear back?</p>
          {(['sms', 'email'] as const).map(opt => (
            <button
              key={opt}
              onClick={() => setContact(opt)}
              className="flex items-center gap-3 mb-3 text-[15px] text-gray-800"
            >
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${contact === opt ? 'border-blue-600' : 'border-gray-500'}`}>
                {contact === opt && <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
              </span>
              {opt === 'sms' ? 'SMS or phone call' : 'Email'}
            </button>
          ))}
        </div>

        <div className="flex gap-4 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="flex-1 py-3 rounded-full border border-gray-300 text-blue-700 text-[15px] font-medium">
            No thanks
          </button>
          <button onClick={onSend} className="flex-1 py-3 rounded-full bg-[#1a73e8] text-white text-[15px] font-medium">
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function HomeServiceLsa({ domain, companyName, industry, onClickAd, scrapedAd }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [quoteFor, setQuoteFor] = useState<LsaBusiness | null>(null);
  const [started, setStarted] = useState(false);
  const [data, setData] = useState(() => fallbackData(companyName, domain, industry));
  const inputRef = useRef<HTMLInputElement>(null);

  const hostname = (() => {
    try {
      return new URL(domain.startsWith('http') ? domain : `https://${domain}`).hostname.replace(/^www\./, '');
    } catch {
      return domain;
    }
  })();

  useEffect(() => {
    if (!started) inputRef.current?.focus();
  }, [started]);

  useEffect(() => {
    void preloadBusinessLogos(data.businesses);
  }, [data.businesses]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: res, error } = await supabase.functions.invoke('lsa-competitors', {
          body: { companyName, industry, websiteMarkdown: scrapedAd?.description || '' },
        });
        if (!cancelled && !error && res?.success && Array.isArray(res.businesses)) {
          const nextData = {
            query: res.query,
            location: res.location,
            category: res.category,
            businesses: [{ ...res.businesses[0], name: companyName, website: hostname }, ...res.businesses.slice(1)],
          };
          await preloadBusinessLogos(nextData.businesses);
          if (cancelled) return;
          setData(nextData);
          setSearchQuery(q => q || '');
        }
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = data.businesses;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen bg-white flex flex-col"
    >
      {!started && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600">About</span>
              <span className="text-sm text-gray-600">Store</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Gmail</span>
              <span className="text-sm text-gray-600">Images</span>
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center -mt-16">
            <GoogleLogo className="h-[92px] mb-8" />
            <form
              onSubmit={e => {
                e.preventDefault();
                if (searchQuery.trim()) setStarted(true);
              }}
              className="w-full max-w-[584px] px-4"
            >
              <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 text-base text-gray-800 bg-transparent outline-none"
                  autoFocus
                />
                <Mic className="w-5 h-5 text-blue-500" />
                <Camera className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex items-center justify-center gap-3 mt-6">
                <button type="submit" className="px-5 py-2 bg-gray-100 border border-transparent hover:border-gray-300 rounded text-sm text-gray-700">
                  Google Search
                </button>
                <button type="button" className="px-5 py-2 bg-gray-100 border border-transparent hover:border-gray-300 rounded text-sm text-gray-700">
                  I'm Feeling Lucky
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-6">Try “{data.query}”</p>
            </form>
          </div>
        </div>
      )}

      {started && (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4 px-6 py-3">
              <GoogleLogo className="h-7 flex-shrink-0" />
              <div className="flex-1 max-w-2xl flex items-center gap-3 px-5 py-2.5 bg-white rounded-full border border-gray-200 shadow-sm">
                <span className="text-gray-800 text-base whitespace-nowrap">{searchQuery}</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-gray-400">✕</span>
                  <div className="w-px h-6 bg-gray-300" />
                  <Mic className="w-5 h-5 text-blue-500" />
                  <Search className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 ml-auto" />
            </div>
            <div className="flex items-center gap-6 px-20 text-sm">
              <span className="text-gray-600 pb-3">AI Mode</span>
              <span className="text-blue-600 border-b-[3px] border-blue-600 pb-3 font-medium">All</span>
              <span className="text-gray-600 pb-3">Shopping</span>
              <span className="text-gray-600 pb-3">Images</span>
              <span className="text-gray-600 pb-3">Jobs</span>
              <span className="text-gray-600 pb-3">Videos</span>
              <span className="text-gray-600 pb-3">News</span>
              <span className="text-gray-600 pb-3">More ▾</span>
              <span className="text-gray-600 pb-3 ml-4">Tools ▾</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-20 py-4 bg-white">
            <div className="flex items-center gap-2 text-[13px] text-gray-600 mb-4">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              <span>{data.location}</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-blue-700 text-xs">
                ⊕ Use precise location
              </span>
              <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* LSA unit */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-[640px]"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[17px] text-gray-900">
                  Sponsored {data.category} | {data.location.split(',')[0]}
                  <MoreVertical className="inline w-3.5 h-3.5 text-gray-400 ml-1" />
                </h2>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-full text-[12px] text-blue-700">
                  <MessageSquareText className="w-3.5 h-3.5" /> Get competitive quotes
                </button>
              </div>

              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {results.map((b, i) => {
                  const isCompany = i === 0;
                  const host = (b.website || '').replace(/^https?:\/\//, '').replace(/^www\./, '');
                  return (
                    <div
                      key={b.name + i}
                      onClick={isCompany ? onClickAd : undefined}
                      className={`flex gap-3 py-3 ${isCompany ? 'cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg' : ''}`}
                    >
                      <BizAvatar
                        name={b.name}
                        host={host}
                        className="w-[52px] h-[52px] rounded-lg object-contain bg-white border border-gray-200 flex-shrink-0 p-2 text-[15px]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[15px] truncate ${isCompany ? 'text-[#1a0dab] hover:underline' : 'text-gray-900'}`}>
                          {b.name}
                        </p>
                        <p className="text-[12px] text-gray-600 flex items-center gap-1">
                          <span className="text-gray-900">{b.rating.toFixed(1)}</span>
                          <Stars rating={b.rating} />
                          <span>({b.reviewCount})</span>
                          <span>· {data.category.replace(/s$/, 's')}</span>
                        </p>
                        <p className="text-[12px] text-gray-600">
                          {b.yearsInBusiness}+ years in business · Serves {data.location.split(',')[0]}
                        </p>
                        <p className="text-[12px]">
                          <span className="text-[#1e8e3e]">{b.hours}</span>
                          <span className="text-gray-600"> · {b.attribute}</span>
                        </p>
                        <p className="text-[12px] text-gray-600">{b.phone}</p>
                      </div>

                      <div className="flex items-start gap-5 flex-shrink-0 pt-1">
                        {i % 3 !== 2 && (
                          <div className="flex flex-col items-center w-[54px]">
                            <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                              <MessageSquareText className="w-4 h-4 text-blue-600" />
                            </span>
                            <span className="text-[11px] text-blue-700 mt-1 text-center leading-tight">Get quote</span>
                          </div>
                        )}
                        <div className="flex flex-col items-center w-[54px]">
                          <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                            <CalendarDays className="w-4 h-4 text-blue-600" />
                          </span>
                          <span className="text-[11px] text-blue-700 mt-1 text-center leading-tight">Book</span>
                        </div>
                        <div className="flex flex-col items-center w-[54px]">
                          <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                            <Phone className="w-4 h-4 text-blue-600" />
                          </span>
                          <span className="text-[11px] text-blue-700 mt-1 text-center leading-tight">Get phone number</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center py-4">
                <button className="flex items-center gap-1 px-5 py-2 border border-gray-300 rounded-full text-[13px] text-gray-700 hover:bg-gray-50">
                  More {data.category.toLowerCase()} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sponsored text ad below */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-[15px] text-gray-900 mb-3">Sponsored Results</h3>
                <div className="flex items-center gap-3 mb-1">
                  <BizAvatar name={companyName} host={hostname} className="w-7 h-7 rounded-full border border-gray-200 bg-white object-contain p-1 text-[10px]" />
                  <div>
                    <p className="text-sm text-gray-900 font-medium">{companyName}</p>
                    <p className="text-xs text-gray-500">https://{hostname}</p>
                  </div>
                </div>
                <button onClick={onClickAd} className="text-left">
                  <p className="text-xl text-[#1a0dab] hover:underline">{scrapedAd?.metaTitle || `${companyName} — Book Online Today`}</p>
                </button>
                <p className="text-sm text-gray-600 max-w-xl">
                  {scrapedAd?.description || `Trusted local pros. Same-day appointments available. Free estimates and financing options.`}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
