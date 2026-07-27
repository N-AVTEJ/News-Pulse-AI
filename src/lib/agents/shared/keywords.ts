export type TechSignalKey = 
  | 'MODEL_RELEASE' 
  | 'PRODUCT_LAUNCH' 
  | 'SECURITY_INCIDENT' 
  | 'MAJOR_RESEARCH' 
  | 'REGULATORY_CHANGE' 
  | 'ACQUISITION' 
  | 'FUNDING' 
  | 'INFRASTRUCTURE' 
  | 'PLATFORM_CHANGE';

export type BusinessSignalKey = 
  | 'EARNINGS' 
  | 'ACQUISITION' 
  | 'MERGER' 
  | 'FUNDING' 
  | 'LAYOFF' 
  | 'EXECUTIVE_CHANGE' 
  | 'REGULATION' 
  | 'INVESTMENT' 
  | 'PARTNERSHIP' 
  | 'MARKET_MOVE';

export type WorldSignalKey = 
  | 'GOVERNMENT_ACTION' 
  | 'ELECTION' 
  | 'DIPLOMACY' 
  | 'ECONOMIC_POLICY' 
  | 'DISASTER' 
  | 'INFRASTRUCTURE' 
  | 'INTERNATIONAL_AGREEMENT' 
  | 'PUBLIC_SAFETY';

export const TECH_SIGNALS: Record<TechSignalKey, string[]> = {
  MODEL_RELEASE: ['gpt', 'claude', 'gemini', 'llama', 'model', 'llm', 'transformer', 'weights', 'open source model', 'ai release', 'parameters', 'open-source'],
  PRODUCT_LAUNCH: ['launch', 'unveil', 'announce', 'release', 'app', 'desktop', 'feature', 'tool', 'platform', 'copilot', 'assistant'],
  SECURITY_INCIDENT: ['vulnerability', 'exploit', 'breach', 'zero-day', 'malware', 'ransomware', 'cybersecurity', 'patch', 'hack', 'security'],
  MAJOR_RESEARCH: ['paper', 'arxiv', 'breakthrough', 'research', 'benchmark', 'qubit', 'quantum', 'algorithm', 'fidelity', 'lab'],
  REGULATORY_CHANGE: ['ai act', 'safety framework', 'regulation', 'executive order', 'copyright', 'antitrust', 'doj', 'ftc', 'policy'],
  ACQUISITION: ['acquire', 'acquisition', 'buy', 'bought', 'merger', 'takeover'],
  FUNDING: ['raised', 'funding', 'series a', 'series b', 'valuation', 'venture capital', 'investment', 'capital'],
  INFRASTRUCTURE: ['chip', 'gpu', 'semiconductor', 'nvidia', 'tsmc', 'fab', 'cloud', 'datacenter', 'compute', 'cluster', 'bgp', 'outage', 'router'],
  PLATFORM_CHANGE: ['api', 'developer', 'sdk', 'framework', 'github', 'repository', 'open source']
};

export const BUSINESS_SIGNALS: Record<BusinessSignalKey, string[]> = {
  EARNINGS: ['earnings', 'revenue', 'quarterly', 'q1', 'q2', 'q3', 'q4', 'profit', 'margin', 'fiscal', 'sales', 'growth'],
  ACQUISITION: ['acquire', 'acquisition', 'buyout', 'takeover', 'purchased', 'bought'],
  MERGER: ['merger', 'combine', 'deal', 'joint venture', 'merging'],
  FUNDING: ['raised', 'funding', 'capital', 'invest', 'series', 'ipo', 'stock', 'shares'],
  LAYOFF: ['layoff', 'layoffs', 'job cuts', 'severance', 'workforce reduction', 'restructuring', 'firing', 'cut jobs'],
  EXECUTIVE_CHANGE: ['ceo', 'cfo', 'exec', 'stepping down', 'appointed', 'hired', 'resigns', 'leadership', 'board'],
  REGULATION: ['sec', 'ftc', 'antitrust', 'lawsuit', 'fine', 'penalty', 'regulator', 'policy', 'rates', 'fed', 'interest rate', 'central bank'],
  INVESTMENT: ['investment', 'billion', 'million', 'billion-dollar', 'stake', 'shareholding', 'invested'],
  PARTNERSHIP: ['partner', 'partnership', 'collaboration', 'alliance', 'agreement', 'deal'],
  MARKET_MOVE: ['market', 'stocks', 's&p', 'nasdaq', 'inflation', 'treasury', 'yield', 'shares', 'equity', 'wall street']
};

export const WORLD_SIGNALS: Record<WorldSignalKey, string[]> = {
  GOVERNMENT_ACTION: ['parliament', 'congress', 'president', 'prime minister', 'sanctions', 'government', 'decree', 'court', 'ruling', 'white house', 'state department'],
  ELECTION: ['election', 'vote', 'ballot', 'candidate', 'poll', 'campaign', 'voters', 'electoral'],
  DIPLOMACY: ['summit', 'treaty', 'talks', 'ambassador', 'diplomat', 'peace', 'accord', 'un', 'united nations', 'ceasefire'],
  ECONOMIC_POLICY: ['tariff', 'trade', 'central bank', 'gdp', 'inflation', 'currency', 'wto', 'imf', 'exports', 'imports'],
  DISASTER: ['earthquake', 'volcano', 'flood', 'storm', 'hurricane', 'disaster', 'wildfire', 'tsunami', 'eruption'],
  INFRASTRUCTURE: ['port', 'shipping', 'blackout', 'grid', 'pipeline', 'rail', 'canal', 'freight', 'maritime', 'logistics'],
  INTERNATIONAL_AGREEMENT: ['accord', 'pact', 'coalition', 'treaty', 'bilateral', 'convention', 'alliance'],
  PUBLIC_SAFETY: ['emergency', 'evacuation', 'outbreak', 'quarantine', 'warning', 'hazard', 'health', 'safety']
};
