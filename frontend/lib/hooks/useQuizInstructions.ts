'use client';

import { useState, useEffect } from 'react';
import { getQuizInstructions } from '@/lib/api/tests';
import { GENERIC_QUIZ_INSTRUCTIONS } from '@/lib/constants/generic-instructions';
import type { QuizInstructionsContent } from '@/types/quiz-content';

// In-memory cache for quiz instructions
const instructionsCache = new Map<string, QuizInstructionsContent>();

interface UseQuizInstructionsResult {
  instructions: QuizInstructionsContent | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch and cache quiz instructions
 *
 * Features:
 * - Fetches instructions from API on first call
 * - Caches results in memory to avoid repeated API calls
 * - Returns generic fallback if quiz has no custom instructions
 * - Handles loading and error states
 *
 * @param quizId - The ID of the quiz to fetch instructions for
 * @returns Object with instructions, loading state, and error
 */
export function useQuizInstructions(quizId: string | null | undefined): UseQuizInstructionsResult {
  const [instructions, setInstructions] = useState<QuizInstructionsContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state if no quizId
    if (!quizId) {
      setInstructions(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Check cache first
    const cached = instructionsCache.get(quizId);
    if (cached) {
      setInstructions(cached);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch from API
    let isCancelled = false;

    async function fetchInstructions() {
      setLoading(true);
      setError(null);

      try {
        const response = await getQuizInstructions(quizId);

        if (isCancelled) return;

        // Use custom instructions if available, otherwise use generic fallback
        const instructionsToUse = response.instructionsContent
          ? response.instructionsContent
          : GENERIC_QUIZ_INSTRUCTIONS;

        // Cache the result (even if it's the generic fallback)
        instructionsCache.set(quizId, instructionsToUse);

        setInstructions(instructionsToUse);
        setLoading(false);
      } catch (err) {
        if (isCancelled) return;

        const error = err instanceof Error ? err : new Error('Failed to fetch instructions');
        setError(error);
        setLoading(false);

        // On error, use generic fallback and cache it
        instructionsCache.set(quizId, GENERIC_QUIZ_INSTRUCTIONS);
        setInstructions(GENERIC_QUIZ_INSTRUCTIONS);
      }
    }

    fetchInstructions();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isCancelled = true;
    };
  }, [quizId]);

  return { instructions, loading, error };
}

/**
 * Clear the instructions cache
 * Useful for testing or when you want to force a refresh
 */
export function clearInstructionsCache() {
  instructionsCache.clear();
}

/**
 * Clear a specific quiz's instructions from cache
 * @param quizId - The quiz ID to remove from cache
 */
export function clearQuizInstructionsCache(quizId: string) {
  instructionsCache.delete(quizId);
}
