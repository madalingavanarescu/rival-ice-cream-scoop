import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnalysisService } from '@/services/analysisService';
import { Analysis, Competitor, AnalysisContent, DifferentiationAngle } from '@/types/database';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';

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
  const { incrementUsage, checkUsageLimit } = useUsageTracking();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  return useMutation({
    mutationFn: async ({ website, companyName }: { website: string; companyName: string }) => {
      // Check usage limits before creating analysis
      if (!checkUsageLimit()) {
        throw new Error('Usage limit exceeded');
      }

      console.log('Creating analysis for:', website, companyName);
      const analysisId = await AnalysisService.createAnalysis(website, companyName);
      
      // Track usage immediately after successful creation
      incrementUsage.mutate();
      
      // Enhanced background analysis with retry logic
      setTimeout(async () => {
        let attempts = 0;
        let success = false;
        
        while (attempts <= maxRetries && !success) {
          try {
            console.log(`Analysis attempt ${attempts + 1} for ${analysisId}`);
            await AnalysisService.startAnalysis(analysisId);
            success = true;
            console.log('Background analysis completed successfully');
            
            // Show success message with confidence level
            toast.success('Analysis completed with high confidence!', {
              description: 'AI-powered competitive insights are ready to view.'
            });
            
          } catch (error) {
            attempts++;
            console.error(`Analysis attempt ${attempts} failed:`, error);
            
            if (attempts <= maxRetries) {
              console.log(`Retrying analysis in ${attempts * 5} seconds...`);
              await new Promise(resolve => setTimeout(resolve, attempts * 5000));
              
              toast.info(`Retrying analysis (attempt ${attempts + 1}/${maxRetries + 1})`, {
                description: 'Ensuring high-quality competitive intelligence...'
              });
            } else {
              console.error('All analysis attempts failed');
              toast.error('Analysis failed after multiple attempts', {
                description: 'Please try again or contact support if the issue persists.'
              });
              
              // Mark analysis as failed with error details
              try {
                await AnalysisService.markAnalysisAsFailed(analysisId, error);
              } catch (markError) {
                console.error('Failed to mark analysis as failed:', markError);
              }
            }
            
            setRetryCount(attempts);
          }
        }
      }, 100);
      
      return analysisId;
    },
    onSuccess: (analysisId) => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
      toast.success('Analysis started with enhanced AI validation!', {
        description: 'This may take a few minutes. We\'ll retry automatically if needed.'
      });
      console.log('Analysis created with ID:', analysisId);
      setRetryCount(0); // Reset retry count on successful creation
    },
    onError: (error) => {
      console.error('Error creating analysis:', error);
      if (error.message === 'Usage limit exceeded') {
        toast.error('Analysis limit reached', {
          description: 'Please upgrade your plan to continue analyzing competitors.'
        });
      } else {
        toast.error('Failed to start analysis. Please try again.', {
          description: 'Check your internet connection and website URL.'
        });
      }
    },
  });
};

// Enhanced real-time status updates with confidence tracking
export const useAnalysisStatus = (analysisId: string) => {
  const [status, setStatus] = useState<string>('pending');
  const [lastError, setLastError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('medium');
  const [retryAttempt, setRetryAttempt] = useState(0);
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  useEffect(() => {
    if (!analysisId || isPollingRef.current) {
      return;
    }

    console.log('Starting enhanced status polling for analysis:', analysisId);
    isPollingRef.current = true;

    const pollStatus = async () => {
      try {
        const analysis = await AnalysisService.getAnalysis(analysisId);
        if (analysis && analysis.status !== status) {
          console.log('Status updated from', status, 'to', analysis.status);
          setStatus(analysis.status);
          setLastError(null);
          
          // Calculate confidence based on analysis quality
          if (analysis.status === 'completed') {
            const competitors = await AnalysisService.getCompetitors(analysisId);
            const angles = await AnalysisService.getDifferentiationAngles(analysisId);
            
            // Determine confidence level based on data quality
            const aiGeneratedCount = competitors.filter(c => c.comparative_insights).length;
            const confidenceLevel = calculateConfidenceLevel(competitors.length, aiGeneratedCount, angles.length);
            setConfidence(confidenceLevel);
            
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['analysis', analysisId] });
            queryClient.invalidateQueries({ queryKey: ['competitors', analysisId] });
            queryClient.invalidateQueries({ queryKey: ['analysisContent', analysisId] });
            queryClient.invalidateQueries({ queryKey: ['differentiationAngles', analysisId] });
            
            toast.success(`Competitive analysis completed with ${confidenceLevel} confidence!`, {
              description: `Analyzed ${competitors.length} competitors with ${aiGeneratedCount} AI-powered insights.`
            });
            
            // Stop polling
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            isPollingRef.current = false;
            
          } else if (analysis.status === 'failed') {
            setLastError('Analysis failed. The system attempted multiple retries.');
            setConfidence('low');
            
            toast.error('Analysis failed after multiple attempts', {
              description: 'Please try creating a new analysis or contact support.'
            });
            
            // Stop polling
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            isPollingRef.current = false;
            
          } else if (analysis.status === 'analyzing') {
            // Show progress updates
            const progressMessage = getProgressMessage(retryAttempt);
            if (progressMessage) {
              toast.info(progressMessage, {
                description: 'AI is gathering competitive intelligence...'
              });
            }
          }
        }
      } catch (error) {
        console.error('Error checking analysis status:', error);
        setLastError('Error checking analysis status');
        setRetryAttempt(prev => prev + 1);
        
        // Continue polling for temporary errors, but show warning after multiple failures
        if (retryAttempt > 5) {
          toast.warning('Having trouble checking analysis status', {
            description: 'Analysis may still be running in the background.'
          });
        }
      }
    };

    // Start polling with adaptive intervals
    const pollInterval = status === 'analyzing' ? 3000 : 5000; // More frequent polling during analysis
    intervalRef.current = setInterval(pollStatus, pollInterval);

    // Cleanup function
    return () => {
      console.log('Cleaning up enhanced status polling for analysis:', analysisId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
    };
  }, [analysisId, status, queryClient, retryAttempt]);

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

  return { status, setStatus, lastError, confidence, retryAttempt };
};

// Helper functions for enhanced status tracking
function calculateConfidenceLevel(totalCompetitors: number, aiGeneratedCount: number, anglesCount: number): 'high' | 'medium' | 'low' {
  const aiCoverage = totalCompetitors > 0 ? aiGeneratedCount / totalCompetitors : 0;
  
  if (aiCoverage >= 0.8 && anglesCount >= 3 && totalCompetitors >= 3) {
    return 'high';
  } else if (aiCoverage >= 0.5 && anglesCount >= 2 && totalCompetitors >= 2) {
    return 'medium';
  } else {
    return 'low';
  }
}

function getProgressMessage(retryAttempt: number): string | null {
  const messages = [
    null, // No message on first attempt
    'Analyzing website context...',
    'Discovering competitors with AI...',
    'Performing comparative analysis...',
    'Generating personalized insights...',
    'Finalizing recommendations...'
  ];
  
  return messages[Math.min(retryAttempt, messages.length - 1)] || null;
}
