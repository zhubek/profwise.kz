/**
 * Quiz Cooldown Management
 * Manages cooldown period after quiz completion using localStorage
 * Cooldowns are user-specific to prevent conflicts when multiple users use same device
 */

// Cooldown duration: 2 hours
const COOLDOWN_DURATION_MS = 120 * 60 * 1000; // 2 hours in milliseconds
const COOLDOWN_KEY_PREFIX = 'quiz_cooldown_';

/**
 * Get the localStorage key for a specific user's quiz cooldown
 * Format: quiz_cooldown_{userId}_{quizId}
 */
function getCooldownKey(userId: string, quizId: string): string {
  return `${COOLDOWN_KEY_PREFIX}${userId}_${quizId}`;
}

/**
 * Set cooldown for a quiz (called after quiz completion)
 * @param userId - User ID to associate cooldown with specific user
 * @param quizId - Quiz ID
 */
export function setQuizCooldown(userId: string, quizId: string): void {
  if (typeof window === 'undefined') return;

  const cooldownEndTime = Date.now() + COOLDOWN_DURATION_MS;
  localStorage.setItem(getCooldownKey(userId, quizId), cooldownEndTime.toString());
}

/**
 * Check if a quiz is currently on cooldown for specific user
 * @param userId - User ID
 * @param quizId - Quiz ID
 */
export function isQuizOnCooldown(userId: string, quizId: string): boolean {
  if (typeof window === 'undefined') return false;

  const cooldownEndTime = localStorage.getItem(getCooldownKey(userId, quizId));

  if (!cooldownEndTime) return false;

  const endTime = parseInt(cooldownEndTime, 10);
  const now = Date.now();

  // If cooldown has expired, clean it up
  if (now >= endTime) {
    clearQuizCooldown(userId, quizId);
    return false;
  }

  return true;
}

/**
 * Get remaining cooldown time in milliseconds for specific user
 * Returns 0 if no cooldown is active
 * @param userId - User ID
 * @param quizId - Quiz ID
 */
export function getRemainingCooldownTime(userId: string, quizId: string): number {
  if (typeof window === 'undefined') return 0;

  const cooldownEndTime = localStorage.getItem(getCooldownKey(userId, quizId));

  if (!cooldownEndTime) return 0;

  const endTime = parseInt(cooldownEndTime, 10);
  const now = Date.now();
  const remaining = endTime - now;

  // If cooldown has expired, clean it up
  if (remaining <= 0) {
    clearQuizCooldown(userId, quizId);
    return 0;
  }

  return remaining;
}

/**
 * Get remaining cooldown time formatted as "Xh Ym" or "Ym Xs"
 * @param userId - User ID
 * @param quizId - Quiz ID
 */
export function getFormattedCooldownTime(userId: string, quizId: string): string {
  const remainingMs = getRemainingCooldownTime(userId, quizId);

  if (remainingMs <= 0) return '';

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Get cooldown end time as Date object for specific user
 * @param userId - User ID
 * @param quizId - Quiz ID
 */
export function getCooldownEndTime(userId: string, quizId: string): Date | null {
  if (typeof window === 'undefined') return null;

  const cooldownEndTime = localStorage.getItem(getCooldownKey(userId, quizId));

  if (!cooldownEndTime) return null;

  return new Date(parseInt(cooldownEndTime, 10));
}

/**
 * Clear cooldown for a specific user's quiz (manual override or after expiration)
 * @param userId - User ID
 * @param quizId - Quiz ID
 */
export function clearQuizCooldown(userId: string, quizId: string): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(getCooldownKey(userId, quizId));
}

/**
 * Clear all quiz cooldowns (useful for testing or admin purposes)
 */
export function clearAllQuizCooldowns(): void {
  if (typeof window === 'undefined') return;

  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(COOLDOWN_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}
