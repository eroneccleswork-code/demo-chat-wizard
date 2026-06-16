import { firecrawlApi } from '@/lib/api/firecrawl';
import { supabase } from '@/integrations/supabase/client';

export interface ScrapeResult {
  scrapedAd: {
    description: string;
    metaTitle: string;
    sitelinks: string[];
  } | null;
  websiteMarkdown: string;
}

export interface SetupAnalysis {
  scrapedAd: ScrapeResult['scrapedAd'];
  aiQuestions: string[];
}

export async function analyzeCompanyWebsite(
  websiteUrl: string,
  companyName: string,
  industry: string
): Promise<SetupAnalysis> {
  let scrapedAd: ScrapeResult['scrapedAd'] = null;
  let websiteMarkdown = '';

  // Step 1: Scrape the website (with hard timeout so bad sites don't block the demo)
  try {
    const scrapePromise = firecrawlApi.scrape(websiteUrl, {
      formats: ['markdown'],
      onlyMainContent: true,
    });
    const timeoutPromise = new Promise<any>((resolve) =>
      setTimeout(() => resolve({ success: false, error: 'client timeout' }), 22000)
    );
    const result = await Promise.race([scrapePromise, timeoutPromise]);
    if (result.success) {

      const markdown = result.data?.markdown || result.markdown || '';
      const metadata = result.data?.metadata || result.metadata || {};
      websiteMarkdown = markdown;

      // Prefer the real meta description from the page
      const metaDesc = metadata.description || metadata.ogDescription || '';
      
      // Fallback: extract from markdown content
      let fallbackDesc = '';
      if (!metaDesc) {
        const lines = markdown
          .split('\n')
          .filter((l: string) => l.trim().length > 30 && !l.startsWith('#') && !l.startsWith('|') && !l.startsWith('[') && !l.startsWith('!'));
        fallbackDesc = lines.slice(0, 2).join(' ').slice(0, 200).trim();
      }

      const headings = markdown.match(/^#{1,3}\s+(.+)/gm) || [];
      const sitelinkTitles = headings
        .map((h: string) => h.replace(/^#+\s+/, '').trim())
        .filter((h: string) => h.length > 3 && h.length < 60)
        .slice(0, 3);

      scrapedAd = {
        description: metaDesc || fallbackDesc,
        metaTitle: metadata.title || '',
        sitelinks: sitelinkTitles,
      };
    }
  } catch (err) {
    console.warn('Failed to scrape site, using defaults:', err);
  }

  // Step 2: Generate AI-personalized questions
  let aiQuestions: string[] = [];
  try {
    const { data, error } = await supabase.functions.invoke('generate-questions', {
      body: { companyName, industry, websiteMarkdown: websiteMarkdown.slice(0, 3000) },
    });
    if (!error && data?.success && Array.isArray(data.questions)) {
      aiQuestions = data.questions;
    }
  } catch (err) {
    console.warn('Failed to generate AI questions, using defaults:', err);
  }

  return { scrapedAd, aiQuestions };
}
