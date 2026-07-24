import { SourceConfig } from './types';

export const SOURCES_REGISTRY: SourceConfig[] = [
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    category: 'ai-tech',
    feedUrl: 'https://techcrunch.com/feed/',
    homepageUrl: 'https://techcrunch.com',
    enabled: true,
    sourceType: 'rss'
  },
  {
    id: 'arstechnica',
    name: 'Ars Technica',
    category: 'ai-tech',
    feedUrl: 'https://feeds.arstechnica.com/arstechnica/index',
    homepageUrl: 'https://arstechnica.com',
    enabled: true,
    sourceType: 'rss'
  },
  {
    id: 'wired',
    name: 'Wired',
    category: 'ai-tech',
    feedUrl: 'https://www.wired.com/feed/rss',
    homepageUrl: 'https://www.wired.com',
    enabled: true,
    sourceType: 'rss'
  },
  {
    id: 'cnbc-business',
    name: 'CNBC Business',
    category: 'business',
    feedUrl: 'https://www.cnbc.com/id/10000115/device/rss/rss.html',
    homepageUrl: 'https://www.cnbc.com/business',
    enabled: true,
    sourceType: 'rss'
  },
  {
    id: 'bbc-world',
    name: 'BBC World News',
    category: 'world',
    feedUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    homepageUrl: 'https://www.bbc.com/news/world',
    enabled: true,
    sourceType: 'rss'
  },
  {
    id: 'npr-world',
    name: 'NPR World News',
    category: 'world',
    feedUrl: 'https://feeds.npr.org/1004/rss.xml',
    homepageUrl: 'https://www.npr.org/sections/world/',
    enabled: true,
    sourceType: 'rss'
  }
];

export function getEnabledSources(): SourceConfig[] {
  return SOURCES_REGISTRY.filter((s) => s.enabled);
}

export function getSourceById(id: string): SourceConfig | undefined {
  return SOURCES_REGISTRY.find((s) => s.id === id);
}
