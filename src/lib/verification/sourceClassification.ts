import { SourceCategory } from './types';

interface SourceClassification {
  category: SourceCategory;
  isPrimary: boolean;
}

// Registry mapping known publisher IDs / names
const KNOWN_CLASSIFICATIONS: Record<string, SourceClassification> = {
  'techcrunch': { category: 'INDUSTRY_PUB', isPrimary: false },
  'arstechnica': { category: 'INDUSTRY_PUB', isPrimary: false },
  'wired': { category: 'TECH_PUB', isPrimary: false },
  'cnbc-business': { category: 'NEWS_ORG', isPrimary: false },
  'bbc-world': { category: 'NEWS_ORG', isPrimary: false },
  'npr-world': { category: 'NEWS_ORG', isPrimary: false },
  'reuters': { category: 'WIRE_SERVICE', isPrimary: false },
  'associated-press': { category: 'WIRE_SERVICE', isPrimary: false },
  'ap-news': { category: 'WIRE_SERVICE', isPrimary: false }
};

/**
 * Classifies a news source into a SourceCategory and determines if it is a Primary Source.
 */
export function classifySource(sourceName: string, articleUrl: string): SourceClassification {
  const urlLower = (articleUrl || '').toLowerCase();
  const nameLower = (sourceName || '').toLowerCase();

  // 1. Government domain check (.gov)
  if (urlLower.includes('.gov') || nameLower.includes('government') || nameLower.includes('white house') || nameLower.includes('state department')) {
    return { category: 'GOVERNMENT', isPrimary: true };
  }

  // 2. Academic / Research domain check (.edu, arxiv, nature, ieee)
  if (urlLower.includes('.edu') || urlLower.includes('arxiv.org') || urlLower.includes('nature.com') || urlLower.includes('ieee.org')) {
    return { category: 'ACADEMIC', isPrimary: true };
  }

  // 3. Official Corporate Newsrooms & Tech Blogs (Google Blog, OpenAI News, Apple Newsroom, etc.)
  if (
    urlLower.includes('blog.google') ||
    urlLower.includes('openai.com/index') ||
    urlLower.includes('openai.com/blog') ||
    urlLower.includes('newsroom.apple.com') ||
    urlLower.includes('news.microsoft.com') ||
    urlLower.includes('press.aboutamazon.com') ||
    nameLower.includes('official blog') ||
    nameLower.includes('press release')
  ) {
    return { category: 'COMPANY_BLOG', isPrimary: true };
  }

  // 4. Registry check by source name or ID
  for (const [key, config] of Object.entries(KNOWN_CLASSIFICATIONS)) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return config;
    }
  }

  // 5. Wire services check
  if (nameLower.includes('reuters') || nameLower.includes('associated press') || nameLower.includes('ap news') || nameLower.includes('afp')) {
    return { category: 'WIRE_SERVICE', isPrimary: false };
  }

  // 6. News Organizations check
  if (nameLower.includes('bbc') || nameLower.includes('cnbc') || nameLower.includes('npr') || nameLower.includes('times') || nameLower.includes('journal')) {
    return { category: 'NEWS_ORG', isPrimary: false };
  }

  // 7. Industry / Tech Publications check
  if (nameLower.includes('techcrunch') || nameLower.includes('ars technica') || nameLower.includes('wired') || nameLower.includes('verge')) {
    return { category: 'INDUSTRY_PUB', isPrimary: false };
  }

  return { category: 'OTHER', isPrimary: false };
}
