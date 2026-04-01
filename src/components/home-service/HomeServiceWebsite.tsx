import { motion } from 'framer-motion';

interface Props {
  websiteUrl: string;
  domain: string;
}

export default function HomeServiceWebsite({ websiteUrl, domain }: Props) {
  const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen bg-white flex flex-col"
    >
      {/* Chrome browser bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#dee1e6] border-b border-gray-300">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        {/* Tab */}
        <div className="ml-2 flex items-center gap-2 bg-white rounded-t-lg px-4 py-1.5 text-xs text-gray-700 border border-b-0 border-gray-300 max-w-[200px]">
          <span className="truncate">{domain}</span>
          <span className="text-gray-400 ml-auto">✕</span>
        </div>
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#f1f3f4] border-b border-gray-300">
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
        </div>
        <div className="flex-1 flex items-center bg-white rounded-full px-4 py-1.5 text-sm text-gray-700 border border-gray-300">
          <svg className="w-3.5 h-3.5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          {domain}
        </div>
      </div>

      {/* Actual website iframe */}
      <div className="flex-1">
        <iframe
          src={url}
          title={domain}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </motion.div>
  );
}
