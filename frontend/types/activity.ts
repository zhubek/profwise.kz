export type ActivityType =
  | 'test_completed'
  | 'profile_updated'
  | 'profession_matched'
  | 'achievement_earned'
  | 'license_activated'
  | 'classroom_joined'
  | 'profession_liked'
  | 'test_started';

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface RecentActivity extends Activity {
  icon?: string;
  color?: string;
}

// Specific activity metadata types
export interface TestCompletedActivity extends Activity {
  type: 'test_completed';
  metadata: {
    testId: string;
    testName: string;
    score?: number;
  };
}

export interface ProfessionMatchedActivity extends Activity {
  type: 'profession_matched';
  metadata: {
    professionId: string;
    professionName: string;
    matchScore: number;
  };
}

export interface AchievementEarnedActivity extends Activity {
  type: 'achievement_earned';
  metadata: {
    achievementId: string;
    achievementName: string;
    achievementIcon?: string;
  };
}
