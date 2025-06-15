
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnalysisService } from '@/services/analysisService';
import { Analysis, Competitor, AnalysisContent, DifferentiationAngle } from '@/types/database';
import { toast } from 'sonner';

export const useAnalyses = () => {
  return useQuery({
    queryKey: ['analyses'],
    queryFn: AnalysisService.getUserAnalyses,
  });
};

export const useAnalysis = (analysisId: string) => {
  return useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: () => AnalysisService.getAnalysis(analysisId),
    enabled: !!analysisId,
  });
};

export const useCompetitors = (analysisId: string) => {
  return useQuery({
    queryKey: ['competitors', analysisId],
    queryFn: () => AnalysisService.getCompetitors(analysisId),
    enabled: !!analysisId,
  });
};

export const useAnalysisContent = (analysisId: string, contentType?: string) => {
  return useQuery({
    queryKey: ['analysisContent', analysisId, contentType],
    queryFn: () => AnalysisService.getAnalysisContent(analysisId, contentType),
    enabled: !!analysisId,
  });
};

export const useDifferentiationAngles = (analysisId: string) => {
  return useQuery({
    queryKey: ['differentiationAngles', analysisId],
    queryFn: () => AnalysisService.getDifferentiationAngles(analysisId),
    enabled: !!analysisId,
  });
};

export const useCreateAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ website, companyName }: { website: string; companyName: string }) => {
      const analysisId = await AnalysisService.createAnalysis(website, companyName);
      
      // Start the analysis process in the background
      AnalysisService.startAnalysis(analysisId).catch(error => {
        console.error('Background analysis failed:', error);
        toast.error('Analysis failed. Please try again.');
      });
      
      return analysisId;
    },
    onSuccess: (analysisId) => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      toast.success('Analysis started! This may take a few minutes.');
    },
    onError: (error) => {
      console.error('Error creating analysis:', error);
      toast.error('Failed to start analysis. Please try again.');
    },
  });
};

// Real-time status updates for analyses
export const useAnalysisStatus = (analysisId: string) => {
  const [status, setStatus] = useState<string>('pending');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!analysisId) return;

    // Poll for status updates every 5 seconds
    const interval = setInterval(async () => {
      try {
        const analysis = await AnalysisService.getAnalysis(analysisId);
        if (analysis && analysis.status !== status) {
          setStatus(analysis.status);
          
          if (analysis.status === 'completed') {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['analysis', analysisId] });
            queryClient.invalidateQueries({ queryKey: ['competitors', analysisId] });
            queryClient.invalidateQueries({ queryKey: ['analysisContent', analysisId] });
            queryClient.invalidateQueries({ queryKey: ['differentiationAngles', analysisId] });
            
            toast.success('Competitor analysis completed!');
            clearInterval(interval);
          } else if (analysis.status === 'failed') {
            toast.error('Analysis failed. Please try again.');
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Error checking analysis status:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [analysisId, status, queryClient]);

  return { status, setStatus };
};
