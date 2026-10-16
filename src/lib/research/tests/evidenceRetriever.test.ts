import { describe, it, expect } from 'vitest';
import { retrieveEvidenceForTask } from '../evidenceRetriever';
import { ResearchTask } from '../types';
import { EventCluster } from '@/lib/clustering/types';

describe('Phase 14: Evidence Retriever', () => {
  const sampleClusters: EventCluster[] = [
    {
      clusterId: 'cluster-ai-1',
      canonicalHeadline: 'Nvidia introduces Blackwell ultra architecture for AI supercomputing',
      summary: 'Nvidia revealed its newest Blackwell platform featuring ultra-fast interconnects for massive scale intelligence models.',
      primaryCategory: 'ai-tech',
      stories: [
        {
          id: 'story-nv-1',
          sourceType: 'rss',
          sourceName: 'TechWire',
          sourceUrl: 'https://techwire.com',
          articleUrl: 'https://techwire.com/nvidia-blackwell',
          headline: 'Nvidia introduces Blackwell ultra architecture',
          summary: 'Nvidia revealed its newest Blackwell platform featuring ultra-fast interconnects.',
          publishedAt: new Date().toISOString(),
          retrievedAt: new Date().toISOString(),
          category: 'ai-tech'
        }
      ],
      publishers: ['TechWire'],
      storyCount: 1,
      publisherCount: 1,
      firstPublished: new Date().toISOString(),
      latestPublished: new Date().toISOString(),
      matchedScouts: ['tech-scout'],
      matchedSignals: ['Nvidia'],
      perScoutScores: { 'tech-scout': 80 },
      topSelectionScore: 80,
      selectionReason: 'AI hardware release',
      status: 'ACTIVE',
      clusterReason: 'Nvidia architecture launch',
      clusterBreakdown: { headlineSimilarity: 40, entityOverlap: 30, timeProximity: 20, categoryMatch: 10, totalScore: 100 },
      importanceScore: null,
      verificationScore: null,
      verificationResult: {
        clusterId: 'cluster-ai-1',
        verificationStatus: 'LIMITED_CORROBORATION',
        supportingSources: ['TechWire'],
        independentSources: 1,
        primarySources: [],
        secondarySources: [],
        conflictingSources: [],
        evidenceCount: 1,
        verificationReasons: ['Single primary source reported'],
        generatedAt: new Date().toISOString(),
        semanticAgreement: null,
        claimConsistency: null
      }
    },
    {
      clusterId: 'cluster-fin-2',
      canonicalHeadline: 'Central banks maintain interest rate stability amid steady economic expansion',
      summary: 'Monetary policy boards decided to hold key benchmark rates unchanged this quarter.',
      primaryCategory: 'business',
      stories: [
        {
          id: 'story-cb-1',
          sourceType: 'rss',
          sourceName: 'Financial Times',
          sourceUrl: 'https://ft.com',
          articleUrl: 'https://ft.com/central-banks-rates',
          headline: 'Central banks maintain interest rate stability',
          summary: 'Monetary policy boards decided to hold key benchmark rates unchanged.',
          publishedAt: new Date().toISOString(),
          retrievedAt: new Date().toISOString(),
          category: 'business'
        }
      ],
      publishers: ['Financial Times'],
      storyCount: 1,
      publisherCount: 1,
      firstPublished: new Date().toISOString(),
      latestPublished: new Date().toISOString(),
      matchedScouts: ['business-scout'],
      matchedSignals: ['Central banks'],
      perScoutScores: { 'business-scout': 70 },
      topSelectionScore: 70,
      selectionReason: 'Economic policy',
      status: 'ACTIVE',
      clusterReason: 'Central bank meeting',
      clusterBreakdown: { headlineSimilarity: 40, entityOverlap: 30, timeProximity: 20, categoryMatch: 10, totalScore: 100 },
      importanceScore: null,
      verificationScore: null
    }
  ];

  it('should retrieve matching clusters based on question keywords and target entities', async () => {
    const task: ResearchTask = {
      id: 'task-test-1',
      question: 'What are the technical specs of Nvidia Blackwell platform?',
      topic: 'Technology',
      targetEntities: ['NVIDIA'],
      requiredEvidenceType: 'PRIMARY_SOURCE',
      status: 'PENDING',
      resultReferences: [],
      findingsCount: 0
    };

    const evidence = await retrieveEvidenceForTask(task, sampleClusters);

    expect(evidence.taskId).toBe('task-test-1');
    expect(evidence.matchingClusters.length).toBeGreaterThan(0);
    expect(evidence.matchingClusters[0].clusterId).toBe('cluster-ai-1');
    expect(evidence.citations.length).toBeGreaterThan(0);
    expect(evidence.citations[0].publisherName).toBe('TechWire');
    expect(evidence.citations[0].articleUrl).toBe('https://techwire.com/nvidia-blackwell');
  });

  it('should preserve article URLs and publisher names without fabrication', async () => {
    const task: ResearchTask = {
      id: 'task-test-2',
      question: 'What is monetary policy decision regarding benchmark rates?',
      topic: 'Finance',
      targetEntities: [],
      requiredEvidenceType: 'CORROBORATED_REPORT',
      status: 'PENDING',
      resultReferences: [],
      findingsCount: 0
    };

    const evidence = await retrieveEvidenceForTask(task, sampleClusters);

    expect(evidence.matchingClusters.some(c => c.clusterId === 'cluster-fin-2')).toBe(true);
    const ftCite = evidence.citations.find(c => c.publisherName === 'Financial Times');
    expect(ftCite).toBeDefined();
    expect(ftCite?.articleUrl).toBe('https://ft.com/central-banks-rates');
  });
});
