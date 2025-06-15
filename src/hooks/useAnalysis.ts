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
      console.log('Creating analysis for:', website, companyName);
      const analysisId = await AnalysisService.createAnalysis(website, companyName);
      
      // Start the analysis process in the background with better error handling
      setTimeout(async () => {
        try {
          await AnalysisService.startAnalysis(analysisId);
        } catch (error) {
          console.error('Background analysis failed:', error);
          // Don't show toast here as we'll catch it in the status polling
        }
      }, 100);
      
      return analysisId;
    },
    onSuccess: (analysisId) => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      toast.success('Analysis started! This may take a few minutes.');
      console.log('Analysis created with ID:', analysisId);
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
  const [lastError, setLastError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!analysisId) return;

    console.log('Starting status polling for analysis:', analysisId);

    // Poll for status updates every 3 seconds
    const interval = setInterval(async () => {
      try {
        const analysis = await AnalysisService.getAnalysis(analysisId);
        if (analysis && analysis.status !== status) {
          console.log('Status updated from', status, 'to', analysis.status);
          setStatus(analysis.status);
          setLastError(null);
          
          if (analysis.status === 'completed') {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['analysis', analysisId] });
            queryClient.invalidateQueries({ queryKey: ['competitors', analysisId] });
            queryClient.invalidateQueries({ queryKey: ['analysisContent', analysisId] });
            queryClient.invalidateQueries({ queryKey: ['differentiationAngles', analysisId] });
            
            toast.success('Competitor analysis completed!');
            clearInterval(interval);
          } else if (analysis.status === 'failed') {
            setLastError('Analysis failed. Please try again.');
            toast.error('Analysis failed. Please try again.');
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Error checking analysis status:', error);
        setLastError('Error checking analysis status');
        // Don't clear interval, keep trying
      }
    }, 3000);

    return () => {
      console.log('Cleaning up status polling for analysis:', analysisId);
      clearInterval(interval);
    };
  }, [analysisId, status, queryClient]);

  return { status, setStatus, lastError };
};
