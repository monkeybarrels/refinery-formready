import { computed, type ComputedRef } from 'vue';

/**
 * Subscription tier hierarchy
 * Higher numbers = more access
 */
export const TIER_HIERARCHY = {
  anonymous: 0,
  free: 1,
  premium: 2,
  pro: 3,
} as const;

export type UserTier = keyof typeof TIER_HIERARCHY;
export type RequiredTier = Exclude<UserTier, 'anonymous'>;

/**
 * Feature gate configuration
 */
export interface FeatureGate {
  requiredTier: RequiredTier;
  featureName: string;
  description?: string;
}

/**
 * Feature access result
 */
export interface FeatureAccess {
  hasAccess: boolean;
  userTier: UserTier;
  requiredTier: RequiredTier;
  needsUpgrade: boolean;
  needsAuth: boolean;
  upgradeMessage: string;
}

/**
 * Composable for checking feature access based on subscription tier
 *
 * @example
 * ```typescript
 * const { checkAccess, requireTier } = useFeatureGate()
 *
 * // Simple check
 * const canUseFeature = checkAccess('premium')
 *
 * // Get detailed access info
 * const access = requireTier('premium', 'Advanced Analytics')
 * if (!access.hasAccess) {
 *   console.log(access.upgradeMessage)
 * }
 * ```
 */
export const useFeatureGate = () => {
  const { isAuthenticated } = useAuth();
  const { subscription, isPremium, isFree } = useBilling();

  /**
   * Get current user's tier
   */
  const userTier: ComputedRef<UserTier> = computed(() => {
    if (!isAuthenticated.value) return 'anonymous';
    return (subscription.value?.tier || 'free') as UserTier;
  });

  /**
   * Get user's tier level (numeric)
   */
  const userLevel = computed(() => {
    return TIER_HIERARCHY[userTier.value];
  });

  /**
   * Simple boolean check if user has access to a tier
   */
  const checkAccess = (requiredTier: RequiredTier): boolean => {
    const requiredLevel = TIER_HIERARCHY[requiredTier];
    return userLevel.value >= requiredLevel;
  };

  /**
   * Detailed access check with upgrade messaging
   */
  const requireTier = (
    requiredTier: RequiredTier,
    featureName: string,
    description?: string
  ): FeatureAccess => {
    const hasAccess = checkAccess(requiredTier);
    const needsAuth = !isAuthenticated.value;
    const needsUpgrade = isAuthenticated.value && !hasAccess;

    let upgradeMessage = '';
    if (needsAuth) {
      upgradeMessage = `Create a free account to access ${featureName}`;
    } else if (needsUpgrade) {
      upgradeMessage = `Upgrade to ${requiredTier} to access ${featureName}`;
    }

    return {
      hasAccess,
      userTier: userTier.value,
      requiredTier,
      needsUpgrade,
      needsAuth,
      upgradeMessage,
    };
  };

  /**
   * Get upgrade path for current user
   */
  const getUpgradePath = (): { tier: RequiredTier; price: string; path: string } | null => {
    if (isPremium.value) return null; // Already at highest tier (for now)

    if (!isAuthenticated.value || isFree.value) {
      return {
        tier: 'premium',
        price: '$19/month',
        path: '/pricing',
      };
    }

    // Future: handle pro tier
    // if (isPremium.value) {
    //   return {
    //     tier: 'pro',
    //     price: '$49/month',
    //     path: '/pricing#pro',
    //   };
    // }

    return null;
  };

  /**
   * Check if feature should be shown as locked
   */
  const shouldShowLocked = (requiredTier: RequiredTier): boolean => {
    return !checkAccess(requiredTier);
  };

  /**
   * Check if user can access multiple features (all required)
   */
  const checkMultipleFeatures = (features: RequiredTier[]): boolean => {
    return features.every(tier => checkAccess(tier));
  };

  /**
   * Get highest tier required from a list
   */
  const getHighestTier = (tiers: RequiredTier[]): RequiredTier => {
    return tiers.reduce((highest, current) => {
      return TIER_HIERARCHY[current] > TIER_HIERARCHY[highest] ? current : highest;
    });
  };

  return {
    // State
    userTier,
    userLevel,
    isPremium,
    isFree,
    isAuthenticated,

    // Methods
    checkAccess,
    requireTier,
    getUpgradePath,
    shouldShowLocked,
    checkMultipleFeatures,
    getHighestTier,

    // Constants
    TIER_HIERARCHY,
  };
};
