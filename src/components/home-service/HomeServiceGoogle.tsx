import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, Camera, MoreVertical } from 'lucide-react';

interface ScrapedAd {
  description?: string;
  metaTitle?: string;
  sitelinks?: string[];
}

interface Props {
  searchKeyword: string;
  domain: string;
  companyName: string;
  started: boolean;
  onClickAd: () => void;
  scrapedAd?: ScrapedAd | null;
}

export default function HomeServiceGoogle({ searchKeyword, domain, companyName, started, onClickAd, scrapedAd }: Props) {
  const [faviconError, setFaviconError] = useState(false);
  const hostname = (() => { try { return new URL(domain.startsWith('http') ? domain : `https://${domain}`).hostname.replace(/^www\./, ''); } catch { return domain; } })();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen bg-white flex flex-col"
    >
      {/* ===== Google Homepage (before started) ===== */}
      {!started && (
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600 hover:underline cursor-pointer">About</span>
              <span className="text-sm text-gray-600 hover:underline cursor-pointer">Store</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hover:underline cursor-pointer">Gmail</span>
              <span className="text-sm text-gray-600 hover:underline cursor-pointer">Images</span>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
            </div>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-16">
            {/* Google Logo */}
            <div className="mb-8">
              <svg viewBox="0 0 272 92" className="h-[92px]">
                <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
                <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
                <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
                <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
                <path d="M35.29 41.19V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49-.01z" fill="#4285F4"/>
              </svg>
            </div>

            {/* Search bar */}
            <div className="w-full max-w-[584px] px-4">
              <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Search className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-gray-400 text-base">|</span>
                <Mic className="w-5 h-5 text-blue-500 cursor-pointer" />
                <Camera className="w-5 h-5 text-blue-500 cursor-pointer" />
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200 cursor-pointer">
                  <span className="text-sm text-gray-700">✦ AI Mode</span>
                </div>
              </div>

              {/* Search buttons */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button className="px-5 py-2 bg-gray-100 hover:border-gray-300 border border-transparent rounded text-sm text-gray-700">
                  Google Search
                </button>
                <button className="px-5 py-2 bg-gray-100 hover:border-gray-300 border border-transparent rounded text-sm text-gray-700">
                  I'm Feeling Lucky
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
            <div className="flex items-center gap-6">
              <span>Advertising</span>
              <span>Business</span>
              <span>How Search works</span>
            </div>
            <div className="flex items-center gap-6">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Settings</span>
            </div>
          </div>
        </div>
      )}

      {/* ===== Google Search Results (after started) ===== */}
      {started && (
        <div className="flex-1 flex flex-col">
          {/* Google search header */}
          <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4 px-6 py-3">
              {/* Google logo small */}
              <svg viewBox="0 0 272 92" className="h-7 flex-shrink-0">
                <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
                <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
                <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
                <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
                <path d="M35.29 41.19V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49-.01z" fill="#4285F4"/>
              </svg>

              {/* Search input */}
              <div className="flex-1 max-w-2xl flex items-center gap-3 px-5 py-2.5 bg-white rounded-full border border-gray-200 shadow-sm">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: 'auto' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="text-gray-800 text-base overflow-hidden whitespace-nowrap"
                >
                  {searchKeyword}
                </motion.span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-gray-400 cursor-pointer">✕</span>
                  <div className="w-px h-6 bg-gray-300" />
                  <Mic className="w-5 h-5 text-blue-500" />
                  <Search className="w-5 h-5 text-blue-500" />
                </div>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 px-20 text-sm">
              <span className="text-blue-600 border-b-[3px] border-blue-600 pb-3 font-medium">All</span>
              <span className="text-gray-600 pb-3 cursor-pointer">AI Mode</span>
              <span className="text-gray-600 pb-3 cursor-pointer">Shopping</span>
              <span className="text-gray-600 pb-3 cursor-pointer">Images</span>
              <span className="text-gray-600 pb-3 cursor-pointer">Maps</span>
              <span className="text-gray-600 pb-3 cursor-pointer">Forums</span>
              <span className="text-gray-600 pb-3 cursor-pointer">Videos</span>
              <span className="text-gray-600 pb-3 cursor-pointer">More ▾</span>
              <span className="text-gray-600 pb-3 cursor-pointer ml-4">Tools ▾</span>
            </div>
          </div>

          {/* Results body */}
          <div className="flex-1 overflow-y-auto px-20 py-4">
            {/* Results info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-sm text-gray-500 mb-4"
            >
              Results for <strong>Encinitas, CA 92024</strong> · <span className="text-blue-600 cursor-pointer">Choose area</span> <MoreVertical className="inline w-3 h-3" />
            </motion.p>

            {/* Sponsored result */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <h2 className="text-xl font-normal text-gray-900 mb-4">Sponsored result</h2>
              <hr className="mb-4 border-gray-200" />

              {/* Ad card */}
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-1">
                  {faviconError || !hostname ? (
                    <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                      {companyName.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                      alt={companyName}
                      className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200"
                      onError={() => setFaviconError(true)}
                    />
                  )}
                  <div>
                    <p className="text-sm text-gray-900 font-medium">{companyName}</p>
                    <p className="text-xs text-gray-500">{`https://offers.${hostname}`} <MoreVertical className="inline w-3 h-3 text-gray-400" /></p>
                  </div>
                </div>

                <motion.button
                  onClick={onClickAd}
                  className="text-left group"
                  whileHover={{ scale: 1.005 }}
                >
                  <h3 className="text-xl text-[#1a0dab] group-hover:underline cursor-pointer mb-1">
                    {companyName}®
                  </h3>
                </motion.button>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                  20% Off Entire Purchase — Elevate your home's curb appeal with stylish new services. Next-day appointments available. Enjoy your new windows sooner with a variety of convenient payment and financing options. Free Quotes.
                </p>

                {/* Sitelinks */}
                <div className="mt-5 space-y-0 border-t border-gray-200 pt-4">
                  <div className="cursor-pointer flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <span className="text-[#1a0dab] hover:underline font-medium text-lg">12 Month 0% Financing</span>
                      <p className="text-sm text-gray-500 mt-0.5">Call, text, or schedule an appointment online and take advantage of our exclusive offer.</p>
                    </div>
                    <span className="text-gray-400 text-lg ml-4">›</span>
                  </div>
                  <div className="cursor-pointer flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <span className="text-[#1a0dab] hover:underline font-medium text-lg">Call or Text for a Free Quote</span>
                      <p className="text-sm text-gray-500 mt-0.5">Take 20% off your entire purchase plus 0 down, 0 payments and 0 interest for 12 months.</p>
                    </div>
                    <span className="text-gray-400 text-lg ml-4">›</span>
                  </div>
                  <div className="cursor-pointer flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <span className="text-[#1a0dab] hover:underline font-medium text-lg">Contact Us</span>
                      <p className="text-sm text-gray-500 mt-0.5">Our team of experts are ready to assist you with your home project.</p>
                    </div>
                    <span className="text-gray-400 text-lg ml-4">›</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Organic results */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              className="mt-6 space-y-6 max-w-2xl border-t border-gray-200 pt-6"
            >
              {/* Hide sponsored */}
              <div className="flex justify-center">
                <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50">
                  Hide sponsored result <span className="text-xs">▲</span>
                </button>
              </div>

              {/* Organic result 1 */}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <img src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`} alt="" className="w-5 h-5 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-900">{companyName}</p>
                    <p className="text-xs text-gray-500">https://{domain}</p>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400 ml-1" />
                </div>
                <h3 className="text-xl text-blue-700 hover:underline cursor-pointer">{companyName} | Official Site</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Visit the official website for {searchKeyword.replace(' near me', '')} services. Schedule your free consultation today. Trusted by thousands of homeowners.
                </p>
              </div>

              {/* Organic result 2 */}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <img src="https://www.google.com/s2/favicons?domain=yelp.com&sz=32" alt="" className="w-5 h-5 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-900">Yelp</p>
                    <p className="text-xs text-gray-500">https://www.yelp.com › search</p>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400 ml-1" />
                </div>
                <h3 className="text-xl text-blue-700 hover:underline cursor-pointer">Top 10 Best {searchKeyword.replace(' near me', '').replace(/^\w/, c => c.toUpperCase())} Near Me</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Top 10 Best {searchKeyword.replace(' near me', '')} near you. See ratings, reviews, hours, and photos. Free estimates from local professionals.
                </p>
              </div>

              {/* Organic result 3 */}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <img src="https://www.google.com/s2/favicons?domain=homeadvisor.com&sz=32" alt="" className="w-5 h-5 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-900">HomeAdvisor</p>
                    <p className="text-xs text-gray-500">https://www.homeadvisor.com › service</p>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400 ml-1" />
                </div>
                <h3 className="text-xl text-blue-700 hover:underline cursor-pointer">{searchKeyword.replace(' near me', '').replace(/^\w/, c => c.toUpperCase())} Services Near You - Free Quotes</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Compare local pros for your {searchKeyword.replace(' near me', '')} project. Read verified reviews and get free cost estimates. Connect with top-rated professionals.
                </p>
              </div>

              {/* Organic result 4 */}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <img src="https://www.google.com/s2/favicons?domain=angi.com&sz=32" alt="" className="w-5 h-5 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-900">Angi</p>
                    <p className="text-xs text-gray-500">https://www.angi.com › nearme</p>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400 ml-1" />
                </div>
                <h3 className="text-xl text-blue-700 hover:underline cursor-pointer">Find the Best {searchKeyword.replace(' near me', '').replace(/^\w/, c => c.toUpperCase())} Pros | Angi</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Browse our network of screened and certified {searchKeyword.replace(' near me', '')} professionals. Read real customer reviews and compare pricing.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
