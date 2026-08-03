import { describe, it, expect } from 'vitest';
import { classifySource } from '../sourceClassification';

describe('Source Classification Registry', () => {

  it('classifies government websites as Primary GOVERNMENT sources', () => {
    const res = classifySource('US State Dept', 'https://www.state.gov/press-release');
    expect(res.isPrimary).toBe(true);
    expect(res.category).toBe('GOVERNMENT');
  });

  it('classifies official corporate blogs as Primary COMPANY_BLOG sources', () => {
    const res = classifySource('OpenAI Blog', 'https://openai.com/index/gpt-4o-announcement');
    expect(res.isPrimary).toBe(true);
    expect(res.category).toBe('COMPANY_BLOG');
  });

  it('classifies wire services as Secondary WIRE_SERVICE sources', () => {
    const res = classifySource('Reuters News', 'https://reuters.com/article/123');
    expect(res.isPrimary).toBe(false);
    expect(res.category).toBe('WIRE_SERVICE');
  });

  it('classifies tech publications as Secondary INDUSTRY_PUB sources', () => {
    const res = classifySource('TechCrunch', 'https://techcrunch.com/2026/article');
    expect(res.isPrimary).toBe(false);
    expect(res.category).toBe('INDUSTRY_PUB');
  });

});
