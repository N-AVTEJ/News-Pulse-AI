import { PromptTemplate } from '../types';

const registeredPrompts: Map<string, PromptTemplate[]> = new Map();

const DEFAULT_PROMPTS: PromptTemplate[] = [
  {
    id: 'intel_cluster_analysis',
    version: 1,
    name: 'Standard Cluster Analysis',
    description: 'Initial prompt for grounded multi-angle intelligence reporting',
    template: `You are an impartial intelligence analyst. Analyze the provided verified event cluster.
Evidence Articles:
{{articles}}

Cluster Title: {{title}}

Answer concisely grounded strictly in the articles:
1. What happened?
2. Why does it matter?
3. Who is affected?
4. What changed?
5. What is uncertain?`,
    variables: ['articles', 'title'],
    createdAt: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'intel_cluster_analysis',
    version: 2,
    name: 'Evidence-Grounded Strict Citation Analysis',
    description: 'Enhanced prompt enforcing explicit inline source citations and forbidding speculation',
    template: `You are an elite intelligence analyst. Evaluate the following verified event cluster:
TITLE: {{title}}
SOURCES & ARTICLES:
{{articles}}

REQUIREMENTS:
- For every factual statement, attribute the supporting source ID [e.g. (Source: src_1)].
- Do not fabricate quotes, timelines, or entities not present in the text.
- If details are unconfirmed, mark them in "What is uncertain".

Structured Output:
- What happened:
- Why it matters:
- Who is affected:
- What changed:
- What remains uncertain:`,
    variables: ['articles', 'title'],
    createdAt: '2026-09-15T00:00:00.000Z'
  },
  {
    id: 'claim_verification_audit',
    version: 1,
    name: 'Claim-to-Evidence Verification Prompt',
    description: 'Prompts model to audit whether a specific claim has sufficient source citations',
    template: `Audit this claim against the provided evidence.
Claim: {{claim}}
Evidence Context: {{evidence}}
Verdict: Return SUPPORTED, CONTRADICTED, or UNVERIFIED with rationale.`,
    variables: ['claim', 'evidence'],
    createdAt: '2026-09-20T00:00:00.000Z'
  }
];

// Initialize prompt registry
for (const prompt of DEFAULT_PROMPTS) {
  const versions = registeredPrompts.get(prompt.id) || [];
  versions.push(prompt);
  registeredPrompts.set(prompt.id, versions);
}

export function getPrompt(id: string, version?: number): PromptTemplate | undefined {
  const versions = registeredPrompts.get(id);
  if (!versions || versions.length === 0) return undefined;
  if (version !== undefined) {
    return versions.find(p => p.version === version);
  }
  // Return latest version by default
  return versions[versions.length - 1];
}

export function registerPromptVersion(
  id: string,
  name: string,
  description: string,
  template: string,
  variables: string[]
): PromptTemplate {
  const versions = registeredPrompts.get(id) || [];
  const nextVersion = versions.length > 0 ? versions[versions.length - 1].version + 1 : 1;
  const newPrompt: PromptTemplate = {
    id,
    version: nextVersion,
    name,
    description,
    template,
    variables,
    createdAt: new Date().toISOString()
  };
  versions.push(newPrompt);
  registeredPrompts.set(id, versions);
  return newPrompt;
}

export function renderPrompt(prompt: PromptTemplate, values: Record<string, string>): string {
  let rendered = prompt.template;
  for (const key of prompt.variables) {
    const val = values[key] || '';
    rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), val);
  }
  return rendered;
}

export function getAllPromptTemplates(): PromptTemplate[] {
  const list: PromptTemplate[] = [];
  for (const versions of registeredPrompts.values()) {
    list.push(...versions);
  }
  return list;
}
