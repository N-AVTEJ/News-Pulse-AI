import { RegressionBenchmark } from '../types';

const storedBenchmarks: Map<string, RegressionBenchmark> = new Map([
  [
    'bench_tech_breakthrough',
    {
      id: 'bench_tech_breakthrough',
      clusterHeadline: 'Next-Generation AI Reasoning Chip Released',
      baselineScore: 84,
      lastEvaluatedScore: 86,
      scoreDelta: 2,
      isRegressed: false,
      modelId: 'gemini-2.0-flash',
      promptVersion: 2
    }
  ],
  [
    'bench_market_consolidation',
    {
      id: 'bench_market_consolidation',
      clusterHeadline: 'Tech Conglomerate Acquires Leading Cloud Infrastructure Provider',
      baselineScore: 88,
      lastEvaluatedScore: 89,
      scoreDelta: 1,
      isRegressed: false,
      modelId: 'gemini-1.5-pro',
      promptVersion: 2
    }
  ],
  [
    'bench_regulatory_action',
    {
      id: 'bench_regulatory_action',
      clusterHeadline: 'Global Antitrust Commission Proposes New Framework',
      baselineScore: 80,
      lastEvaluatedScore: 81,
      scoreDelta: 1,
      isRegressed: false,
      modelId: 'gpt-4o-mini',
      promptVersion: 1
    }
  ]
]);

export function getRegressionBenchmarks(): RegressionBenchmark[] {
  return Array.from(storedBenchmarks.values());
}

export function recordBenchmarkResult(
  id: string,
  clusterHeadline: string,
  baselineScore: number,
  newScore: number,
  modelId: string,
  promptVersion: number
): RegressionBenchmark {
  const delta = newScore - baselineScore;
  const isRegressed = delta < -5; // Greater than 5 points drop is flagged as regression

  const benchmark: RegressionBenchmark = {
    id,
    clusterHeadline,
    baselineScore,
    lastEvaluatedScore: newScore,
    scoreDelta: delta,
    isRegressed,
    modelId,
    promptVersion
  };

  storedBenchmarks.set(id, benchmark);
  return benchmark;
}
