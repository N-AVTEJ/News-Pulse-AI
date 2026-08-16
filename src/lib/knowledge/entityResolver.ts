export interface ResolvedEntity {
  entityId: string;
  canonicalName: string;
  type: string;
  aliases: string[];
}

const entityAliasMap: Record<string, { canonical: string; type: string; aliases: string[] }> = {
  openai: { canonical: 'OpenAI', type: 'COMPANY', aliases: ['OpenAI Inc.', 'OpenAI', 'Open AI', 'OpenAI Global'] },
  google: { canonical: 'Google', type: 'COMPANY', aliases: ['Google LLC', 'Alphabet', 'Google'] },
  microsoft: { canonical: 'Microsoft', type: 'COMPANY', aliases: ['Microsoft Corp.', 'MSFT', 'Microsoft'] },
  nvidia: { canonical: 'NVIDIA', type: 'COMPANY', aliases: ['NVIDIA Corp.', 'Nvidia', 'NVIDIA'] },
  apple: { canonical: 'Apple', type: 'COMPANY', aliases: ['Apple Inc.', 'Apple'] },
  tsmc: { canonical: 'TSMC', type: 'COMPANY', aliases: ['Taiwan Semiconductor Manufacturing Co.', 'TSMC'] },
  chatgpt: { canonical: 'ChatGPT', type: 'PRODUCT', aliases: ['ChatGPT Plus', 'ChatGPT Search', 'ChatGPT'] },
  gemini: { canonical: 'Gemini', type: 'PRODUCT', aliases: ['Google Gemini', 'Gemini 2.0', 'Gemini'] },
  sam_altman: { canonical: 'Sam Altman', type: 'PERSON', aliases: ['Samuel Altman', 'Sam Altman'] },
  satya_nadella: { canonical: 'Satya Nadella', type: 'PERSON', aliases: ['Satya Nadella'] }
};

/**
 * Deterministically resolves a raw entity string to its canonical name and aliases.
 */
export function resolveEntity(rawName: string, defaultType: string = 'COMPANY'): ResolvedEntity {
  if (!rawName || rawName.trim() === '') {
    return { entityId: 'ent_unknown', canonicalName: 'Unknown Entity', type: defaultType, aliases: [] };
  }

  const cleaned = rawName.trim();
  const lower = cleaned.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Direct Alias Map lookup
  for (const entry of Object.values(entityAliasMap)) {
    if (entry.aliases.some(alias => alias.toLowerCase().replace(/[^a-z0-9]/g, '') === lower)) {
      return {
        entityId: `ent_${entry.canonical.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        canonicalName: entry.canonical,
        type: entry.type,
        aliases: entry.aliases
      };
    }
  }

  // 2. Fallback clean canonical representation
  const canonicalName = cleaned
    .replace(/\s+(Inc\.|Corp\.|LLC|Ltd\.|Global)$/i, '')
    .trim();

  return {
    entityId: `ent_${canonicalName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    canonicalName,
    type: defaultType,
    aliases: [cleaned]
  };
}
