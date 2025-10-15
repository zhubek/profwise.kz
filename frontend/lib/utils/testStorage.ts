import type { HollandTestState } from '@/types/test';

const STORAGE_KEYS = {
  holland: 'profwise_holland_test',
} as const;

/**
 * Save Holland test state to localStorage
 */
export function saveHollandTestState(state: HollandTestState): void {
  try {
    if (typeof window === 'undefined') return;

    const serialized = JSON.stringify({
      ...state,
      lastUpdated: new Date().toISOString(),
    });

    localStorage.setItem(STORAGE_KEYS.holland, serialized);
  } catch (error) {
    console.error('Failed to save Holland test state:', error);
  }
}

/**
 * Load Holland test state from localStorage
 */
export function loadHollandTestState(): HollandTestState | null {
  try {
    if (typeof window === 'undefined') return null;

    const serialized = localStorage.getItem(STORAGE_KEYS.holland);

    if (!serialized) return null;

    const state = JSON.parse(serialized) as HollandTestState;

    // Validate the state has required fields
    if (!state.testId || !state.userId || state.currentSectionIndex === undefined) {
      console.warn('Invalid Holland test state in localStorage');
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to load Holland test state:', error);
    return null;
  }
}

/**
 * Clear Holland test state from localStorage
 */
export function clearHollandTestState(): void {
  try {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(STORAGE_KEYS.holland);
  } catch (error) {
    console.error('Failed to clear Holland test state:', error);
  }
}

/**
 * Check if Holland test is in progress
 */
export function hasHollandTestInProgress(): boolean {
  const state = loadHollandTestState();
  return state !== null;
}

/**
 * Get Holland test progress percentage
 */
export function getHollandTestProgress(): number {
  const state = loadHollandTestState();

  if (!state) return 0;

  // Calculate progress based on answered questions
  const totalQuestions = Object.keys(state.answers).length;
  const totalSections = 6; // RIASEC has 6 sections
  const questionsPerSection = 5; // We have 5 questions per section in mock
  const totalExpected = totalSections * questionsPerSection;

  return Math.round((totalQuestions / totalExpected) * 100);
}

/**
 * Update only answers in the Holland test state
 */
export function updateHollandTestAnswers(
  questionId: string,
  answer: number | string | string[]
): void {
  const state = loadHollandTestState();

  if (!state) {
    console.warn('No Holland test state found to update');
    return;
  }

  state.answers[questionId] = answer;
  saveHollandTestState(state);
}

/**
 * Update current section index
 */
export function updateHollandTestSection(sectionIndex: number): void {
  const state = loadHollandTestState();

  if (!state) {
    console.warn('No Holland test state found to update');
    return;
  }

  state.currentSectionIndex = sectionIndex;
  saveHollandTestState(state);
}
