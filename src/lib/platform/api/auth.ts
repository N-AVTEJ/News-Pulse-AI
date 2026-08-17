import { ApiKey } from '../types';

let apiKeysStore: ApiKey[] = [
  {
    id: 'key_prod_01',
    key: 'np_live_sec_8923749283749823',
    name: 'Enterprise SIEM Production Key',
    ownerId: 'mem_owner_01',
    scopes: ['read:events', 'write:workflows', 'read:graph', 'admin:plugins'],
    rateLimitPerMinute: 120,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];

export function getApiKeys(): ApiKey[] {
  return apiKeysStore;
}

export function createApiKey(name: string, ownerId: string = 'mem_analyst_01', scopes: string[] = ['read:events']): ApiKey {
  const apiKey: ApiKey = {
    id: `key_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: `np_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
    name,
    ownerId,
    scopes,
    rateLimitPerMinute: 60,
    createdAt: new Date().toISOString()
  };

  apiKeysStore.unshift(apiKey);
  return apiKey;
}

export function validateApiKey(keyString: string, requiredScope?: string): { valid: boolean; apiKey?: ApiKey; error?: string } {
  const found = apiKeysStore.find(k => k.key === keyString);
  if (!found) {
    return { valid: false, error: 'Invalid API key.' };
  }

  if (requiredScope && !found.scopes.includes(requiredScope)) {
    return { valid: false, error: `API key lacks required scope '${requiredScope}'.` };
  }

  return { valid: true, apiKey: found };
}
