
import { useState, useEffect, useRef } from 'react';
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
      
      // Start the analysis process in the background
      setTimeout(async () => {
        try {
          await AnalysisService.startAnalysis(analysisId);
          console.log('Background analysis started successfully');
        } catch (error) {
          console.error('Background analysis failed:', error);
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

// Optimized real-time status updates for analyses
export const useAnalysisStatus = (analysisId: string) => {
  const [status, setStatus] = useState<string>('pending');
  const [lastError, setLastError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  useEffect(() => {
    if (!analysisId || isPollingRef.current) {
      return;
    }

    console.log('Starting status polling for analysis:', analysisId);
    isPollingRef.current = true;

    const pollStatus = async () => {
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
            
            // Stop polling
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            isPollingRef.current = false;
          } else if (analysis.status === 'failed') {
            setLastError('Analysis failed. Please try again.');
            toast.error('Analysis failed. Please try again.');
            
            // Stop polling
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            isPollingRef.current = false;
          }
        }
      } catch (error) {
        console.error('Error checking analysis status:', error);
        setLastError('Error checking analysis status');
        // Continue polling in case of temporary errors
      }
    };

    // Start polling
    intervalRef.current = setInterval(pollStatus, 5000); // Increased to 5 seconds to reduce load

    // Cleanup function
    return () => {
      console.log('Cleaning up status polling for analysis:', analysisId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
    };
  }, [analysisId, status, queryClient]);

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
    };
  }, []);

  return { status, setStatus, lastError };
};
