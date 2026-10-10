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
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      stories: [
        {
          id: 'story-nv-1',
          sourceId: 'tech-wire',
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
      sources: ['TechWire'],
      publishers: ['TechWire'],
      primaryCategory: 'ai-tech',
      velocity: 1.5,
      urgencyScore: 80,
      verificationResult: {
        clusterId: 'cluster-ai-1',
        verificationStatus: 'LIMITED_CORROBORATION',
        corroborationScore: 75,
        sourceDiversityScore: 50,
        evidenceQualityScore: 80,
        publicationConsistencyScore: 85,
        corroboratingSourcesCount: 1,
        primarySourceCount: 1,
        evidenceCount: 1,
        conflictDetected: false,
        evaluatedAt: new Date().toISOString()
      }
    },
    {
      clusterId: 'cluster-fin-2',
      canonicalHeadline: 'Central banks maintain interest rate stability amid steady economic expansion',
      summary: 'Monetary policy boards decided to hold key benchmark rates unchanged this quarter.',
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      stories: [
        {
          id: 'story-cb-1',
          sourceId: 'fin-times',
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
      sources: ['Financial Times'],
      publishers: ['Financial Times'],
      primaryCategory: 'business',
      velocity: 0.8,
      urgencyScore: 50
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
