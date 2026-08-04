import { EventCluster } from '../clustering/types';
import { EntityCategory, EntityRelationship, ExtractedEntity } from './types';

// Known entity dictionaries
const KNOWN_ENTITIES: { name: string; category: EntityCategory }[] = [
  { name: 'OpenAI', category: 'COMPANY' },
  { name: 'Microsoft', category: 'COMPANY' },
  { name: 'Google', category: 'COMPANY' },
  { name: 'Nvidia', category: 'COMPANY' },
  { name: 'Apple', category: 'COMPANY' },
  { name: 'Meta', category: 'COMPANY' },
  { name: 'Amazon', category: 'COMPANY' },
  { name: 'Tesla', category: 'COMPANY' },
  { name: 'TSMC', category: 'COMPANY' },
  { name: 'ChatGPT', category: 'PRODUCT' },
  { name: 'Gemini', category: 'PRODUCT' },
  { name: 'Claude', category: 'PRODUCT' },
  { name: 'Llama', category: 'PRODUCT' },
  { name: 'Copilot', category: 'PRODUCT' },
  { name: 'Sam Altman', category: 'PERSON' },
  { name: 'Satya Nadella', category: 'PERSON' },
  { name: 'Sundar Pichai', category: 'PERSON' },
  { name: 'Jensen Huang', category: 'PERSON' },
  { name: 'Elon Musk', category: 'PERSON' },
  { name: 'White House', category: 'GOVERNMENT' },
  { name: 'US Government', category: 'GOVERNMENT' },
  { name: 'European Union', category: 'GOVERNMENT' },
  { name: 'FTC', category: 'GOVERNMENT' },
  { name: 'SEC', category: 'GOVERNMENT' },
  { name: 'Washington', category: 'LOCATION' },
  { name: 'San Francisco', category: 'LOCATION' },
  { name: 'Silicon Valley', category: 'LOCATION' },
  { name: 'Beijing', category: 'LOCATION' },
  { name: 'Tokyo', category: 'LOCATION' },
  { name: 'London', category: 'LOCATION' },
  { name: 'Generative AI', category: 'TECHNOLOGY' },
  { name: 'Semiconductors', category: 'TECHNOLOGY' },
  { name: 'Cybersecurity', category: 'TECHNOLOGY' },
  { name: 'Quantum Computing', category: 'TECHNOLOGY' },
  { name: 'Autonomous Driving', category: 'TECHNOLOGY' }
];

/**
 * Extracts structured entities from cluster stories and canonical headline.
 */
export function extractEntitiesFromCluster(cluster: EventCluster): ExtractedEntity[] {
  const stories = cluster.stories || [];
  const text = `${cluster.canonicalHeadline} ${cluster.summary} ${stories.map(s => `${s.headline} ${s.summary}`).join(' ')}`;
  const textLower = text.toLowerCase();

  const entityMap = new Map<string, ExtractedEntity>();

  for (const ent of KNOWN_ENTITIES) {
    if (textLower.includes(ent.name.toLowerCase())) {
      const matchingStoryIds = stories
        .filter(s => `${s.headline} ${s.summary}`.toLowerCase().includes(ent.name.toLowerCase()))
        .map(s => s.id);

      const regex = new RegExp(`\\b${ent.name}\\b`, 'gi');
      const matches = text.match(regex);
      const count = matches ? matches.length : 1;

      entityMap.set(ent.name, {
        id: `ent_${ent.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`,
        name: ent.name,
        category: ent.category,
        mentionCount: count,
        sourceArticles: matchingStoryIds.length > 0 ? matchingStoryIds : [stories[0]?.id || 's1']
      });
    }
  }

  // Fallback: If no dictionary entities matched, extract capitalized words
  if (entityMap.size === 0) {
    const words = cluster.canonicalHeadline.split(/\s+/);
    for (const w of words) {
      if (w.length > 3 && /^[A-Z][a-z]+$/.test(w)) {
        entityMap.set(w, {
          id: `ent_${w.toLowerCase()}`,
          name: w,
          category: 'ORGANIZATION',
          mentionCount: 1,
          sourceArticles: [stories[0]?.id || 's1']
        });
      }
    }
  }

  return Array.from(entityMap.values());
}

/**
 * Generates directed entity relationships based on evidence text.
 */
export function extractEntityRelationships(
  cluster: EventCluster,
  entities: ExtractedEntity[]
): EntityRelationship[] {
  const relationships: EntityRelationship[] = [];
  const primaryStoryId = cluster.stories[0]?.id || 's1';

  if (entities.length < 2) {
    if (entities.length === 1 && cluster.publishers[0]) {
      relationships.push({
        id: `rel_1`,
        subject: cluster.publishers[0],
        predicate: 'reported on',
        object: entities[0].name,
        evidenceStoryId: primaryStoryId
      });
    }
    return relationships;
  }

  // Build relationships between extracted entities
  for (let i = 0; i < entities.length - 1; i++) {
    const e1 = entities[i];
    const e2 = entities[i + 1];

    let predicate = 'associated with';
    if (e1.category === 'COMPANY' && e2.category === 'PRODUCT') predicate = 'released';
    else if (e1.category === 'COMPANY' && e2.category === 'COMPANY') predicate = fontPredicateCheck(cluster.canonicalHeadline);
    else if (e1.category === 'PERSON' && e2.category === 'COMPANY') predicate = 'leads';
    else if (e1.category === 'GOVERNMENT' && e2.category === 'COMPANY') predicate = 'regulates';

    relationships.push({
      id: `rel_${i + 1}`,
      subject: e1.name,
      predicate,
      object: e2.name,
      evidenceStoryId: e1.sourceArticles[0] || primaryStoryId
    });
  }

  return relationships;
}

function fontPredicateCheck(headline: string): string {
  const hLower = headline.toLowerCase();
  if (hLower.includes('acquire') || hLower.includes('buy') || hLower.includes('merge')) return 'merged with / acquired';
  if (hLower.includes('partner') || hLower.includes('deal')) return 'partnered with';
  if (hLower.includes('sue') || hLower.includes('lawsuit')) return 'filed lawsuit against';
  return 'competes with';
}
