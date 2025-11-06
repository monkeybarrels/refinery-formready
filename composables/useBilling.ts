import { ref, computed } from 'vue';
import type { Ref } from 'vue';

export interface Subscription {
  tier: 'free' | 'premium' | 'pro';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | 'incomplete';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface CheckoutSession {
  sessionUrl: string;
  sessionId: string;
}

export interface PortalSession {
  portalUrl: string;
}

/**
 * Composable for managing billing and subscriptions
 * Provides access to subscription status, checkout, and billing portal
 */
export const useBilling = () => {
  const { $api } = useNuxtApp();

  const subscription: Ref<Subscription | null> = ref(null);
  const loading = ref(false);
  const error: Ref<string | null> = ref(null);

  /**
   * Get current user ID from auth token
   */
  const getUserId = (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      // Decode JWT token to get user ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub || payload.id || null;
    } catch {
      return null;
    }
  };

  /**
   * Get user email from auth token
   */
  const getUserEmail = (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      // Decode JWT token to get email
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || null;
    } catch {
      return null;
    }
  };

  /**
   * Check if user has premium access
   */
  const isPremium = computed(() => {
    return (
      subscription.value?.tier === 'premium' &&
      ['active', 'trialing'].includes(subscription.value?.status || '')
    );
  });

  /**
   * Check if user is on free tier
   */
  const isFree = computed(() => {
    return subscription.value?.tier === 'free' || !subscription.value;
  });

  /**
   * Check if subscription is canceled but still active until period end
   */
  const isCanceled = computed(() => {
    return subscription.value?.cancelAtPeriodEnd === true;
  });

  /**
   * Check if payment has failed
   */
  const isPaymentFailed = computed(() => {
    return subscription.value?.status === 'past_due' || subscription.value?.status === 'unpaid';
  });

  /**
   * Get formatted period end date
   */
  const periodEndDate = computed(() => {
    if (!subscription.value?.currentPeriodEnd) return null;
    return new Date(subscription.value.currentPeriodEnd).toLocaleDateString();
  });

  /**
   * Fetch subscription status for current user
   */
  const fetchSubscription = async () => {
    const userId = getUserId();
    if (!userId) {
      error.value = 'User not authenticated';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await $api<{ success: boolean; subscription: Subscription }>(
        `/api/billing/subscription/${userId}`,
      );

      if (response.success) {
        subscription.value = response.subscription;
      } else {
        error.value = 'Failed to fetch subscription';
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch subscription';
      console.error('Subscription fetch error:', e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create Stripe checkout session and redirect
   */
  const createCheckoutSession = async (
    successUrl = `${window.location.origin}/billing/success`,
    cancelUrl = `${window.location.origin}/pricing`,
  ): Promise<boolean> => {
    const userId = getUserId();
    if (!userId) {
      error.value = 'User not authenticated';
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      // Get user email from token
      const email = getUserEmail();

      if (!email) {
        error.value = 'User email not found';
        return false;
      }

      const response = await $api<{ success: boolean; sessionUrl: string; sessionId: string }>(
        '/api/billing/checkout',
        {
          method: 'POST',
          body: {
            userId,
            email,
            successUrl,
            cancelUrl,
          },
        },
      );

      if (response.success && response.sessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = response.sessionUrl;
        return true;
      } else {
        error.value = 'Failed to create checkout session';
        return false;
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to create checkout session';
      console.error('Checkout error:', e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create billing portal session and redirect
   */
  const openBillingPortal = async (
    returnUrl = `${window.location.origin}/dashboard`,
  ): Promise<boolean> => {
    const userId = getUserId();
    if (!userId) {
      error.value = 'User not authenticated';
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await $api<{ success: boolean; portalUrl: string }>(
        '/api/billing/portal',
        {
          method: 'POST',
          body: {
            userId,
            returnUrl,
          },
        },
      );

      if (response.success && response.portalUrl) {
        // Redirect to Stripe billing portal
        window.location.href = response.portalUrl;
        return true;
      } else {
        error.value = 'Failed to open billing portal';
        return false;
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to open billing portal';
      console.error('Portal error:', e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cancel subscription at period end
   */
  const cancelSubscription = async (immediately = false): Promise<boolean> => {
    const userId = getUserId();
    if (!userId) {
      error.value = 'User not authenticated';
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await $api<{ success: boolean; subscription: Subscription }>(
        '/api/billing/cancel',
        {
          method: 'POST',
          body: {
            userId,
            immediately,
          },
        },
      );

      if (response.success) {
        subscription.value = response.subscription;
        return true;
      } else {
        error.value = 'Failed to cancel subscription';
        return false;
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to cancel subscription';
      console.error('Cancel error:', e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    subscription,
    loading,
    error,
    isPremium,
    isFree,
    isCanceled,
    isPaymentFailed,
    periodEndDate,
    fetchSubscription,
    createCheckoutSession,
    openBillingPortal,
    cancelSubscription,
  };
};
