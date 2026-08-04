import { EventCluster } from '../clustering/types';
import { GeminiProvider } from './providers/geminiProvider';
import { ILlmProvider } from './providers/providerInterface';
import { buildPromptContext } from './promptBuilder';
import { formatAndValidateReport } from './reportFormatter';
import { AnalysisReport } from './types';

// In-memory cache for analysis reports
const analysisCache = new Map<string, AnalysisReport>();

/**
 * Generates an evidence-grounded AI AnalysisReport for a single EventCluster.
 */
export async function generateAnalysisReport(
  cluster: EventCluster,
  allClusters: EventCluster[] = [],
  provider?: ILlmProvider
): Promise<AnalysisReport> {
  const cacheKey = cluster.clusterId;
  if (analysisCache.has(cacheKey)) {
    return analysisCache.get(cacheKey)!;
  }

  const startTime = Date.now();
  const llmProvider = provider || new GeminiProvider();

  const promptContext = buildPromptContext(cluster);
  const rawOutput = await llmProvider.generateAnalysis(promptContext);
  const durationMs = Date.now() - startTime;

  const report = formatAndValidateReport(rawOutput, cluster, allClusters, durationMs);
  analysisCache.set(cacheKey, report);

  console.log(`[AnalysisLog] [COMPLETE] Generated AI Report for cluster ${cluster.clusterId} via ${report.provider} in ${durationMs}ms`);

  return report;
}

/**
 * Retrieves a cached analysis report if available.
 */
export function getCachedAnalysisReport(clusterId: string): AnalysisReport | null {
  return analysisCache.get(clusterId) || null;
}

/**
 * Batch generates AI Analysis Reports for all EventClusters.
 */
export async function generateAllAnalysisReports(
  clusters: EventCluster[]
): Promise<{
  enrichedClusters: EventCluster[];
  reportsMap: Record<string, AnalysisReport>;
}> {
  const reportsMap: Record<string, AnalysisReport> = {};

  const enrichedClusters = await Promise.all(
    clusters.map(async (cluster) => {
      const report = await generateAnalysisReport(cluster, clusters);
      reportsMap[cluster.clusterId] = report;
      return {
        ...cluster,
        analysisReport: report
      };
    })
  );

  return { enrichedClusters, reportsMap };
}
