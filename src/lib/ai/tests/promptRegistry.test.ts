import { describe, it, expect } from 'vitest';
import { getPrompt, registerPromptVersion, renderPrompt } from '../prompts/promptRegistry';

describe('Prompt Registry', () => {
  it('retrieves default registered prompts', () => {
    const prompt = getPrompt('intel_cluster_analysis');
    expect(prompt).toBeDefined();
    expect(prompt?.variables).toContain('articles');
  });

  it('renders variables correctly into template', () => {
    const prompt = getPrompt('intel_cluster_analysis');
    expect(prompt).toBeDefined();
    const rendered = renderPrompt(prompt!, {
      title: 'Global Tech Breakthrough',
      articles: 'Article 1 content here'
    });
    expect(rendered).toContain('Global Tech Breakthrough');
    expect(rendered).toContain('Article 1 content here');
  });

  it('creates and versions new prompt iterations', () => {
    const newVersion = registerPromptVersion(
      'intel_cluster_analysis',
      'V3 Strict Reasoning',
      'New version testing hypothesis testing',
      'Test template {{title}}',
      ['title']
    );
    expect(newVersion.version).toBeGreaterThan(1);
    
    const latest = getPrompt('intel_cluster_analysis');
    expect(latest?.version).toBe(newVersion.version);
  });
});
