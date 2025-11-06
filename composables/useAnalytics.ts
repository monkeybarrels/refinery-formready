/**
 * Analytics composable for tracking user events
 * Wraps Plausible Analytics with typed event tracking
 */

export type AnalyticsEventName =
  // File upload events
  | 'file_upload_started'
  | 'file_upload_completed'
  | 'file_upload_failed'
  // Analysis events
  | 'analysis_started'
  | 'analysis_completed'
  | 'analysis_failed'
  | 'analysis_viewed'
  // User journey events
  | 'signup_started'
  | 'signup_completed'
  | 'login_completed'
  | 'logout'
  // Conversion funnel events
  | 'landing_viewed'
  | 'upload_page_viewed'
  | 'results_page_viewed'
  | 'cta_clicked'
  // Error events
  | 'error_occurred'
  | 'session_expired'
  // Feature engagement
  | 'premium_feature_clicked'
  | 'download_report'
  | 'share_results';

export interface AnalyticsEventProps {
  // Generic properties
  [key: string]: string | number | boolean;

  // Common properties
  documentId?: string;
  sessionId?: string;
  errorMessage?: string;
  errorCode?: string;
  fileType?: string;
  fileSize?: number;
  processingTime?: number;
  userId?: string;

  // Conversion tracking
  source?: string;
  medium?: string;
  campaign?: string;
}

export const useAnalytics = () => {
  const { $plausible } = useNuxtApp();

  /**
   * Track a custom event with properties
   * @param eventName - Name of the event (typed)
   * @param props - Event properties
   */
  const trackEvent = (eventName: AnalyticsEventName, props?: AnalyticsEventProps) => {
    if (!$plausible) {
      // Plausible not loaded (e.g., in development with localhost)
      if (import.meta.dev) {
        console.log('[Analytics - Dev]', eventName, props);
      }
      return;
    }

    try {
      $plausible.trackEvent(eventName, {
        props: props || {}
      });
    } catch (error) {
      // Silent failure - don't break the app if analytics fails
      console.warn('Analytics tracking failed:', error);
    }
  };

  /**
   * Track file upload lifecycle
   */
  const trackFileUpload = {
    started: (fileType: string, fileSize: number) => {
      trackEvent('file_upload_started', { fileType, fileSize });
    },
    completed: (documentId: string, fileType: string, fileSize: number, processingTime: number) => {
      trackEvent('file_upload_completed', { documentId, fileType, fileSize, processingTime });
    },
    failed: (errorMessage: string, errorCode?: string) => {
      trackEvent('file_upload_failed', { errorMessage, errorCode });
    }
  };

  /**
   * Track analysis lifecycle
   */
  const trackAnalysis = {
    started: (documentId: string, sessionId?: string) => {
      trackEvent('analysis_started', { documentId, sessionId });
    },
    completed: (documentId: string, processingTime: number, sessionId?: string) => {
      trackEvent('analysis_completed', { documentId, processingTime, sessionId });
    },
    failed: (documentId: string, errorMessage: string, errorCode?: string) => {
      trackEvent('analysis_failed', { documentId, errorMessage, errorCode });
    },
    viewed: (documentId: string, sessionId?: string) => {
      trackEvent('analysis_viewed', { documentId, sessionId });
    }
  };

  /**
   * Track user authentication events
   */
  const trackAuth = {
    signupStarted: () => {
      trackEvent('signup_started');
    },
    signupCompleted: (userId?: string) => {
      trackEvent('signup_completed', { userId });
    },
    loginCompleted: (userId?: string) => {
      trackEvent('login_completed', { userId });
    },
    logout: () => {
      trackEvent('logout');
    },
    sessionExpired: () => {
      trackEvent('session_expired');
    }
  };

  /**
   * Track conversion funnel steps
   */
  const trackFunnel = {
    landingViewed: (source?: string, medium?: string, campaign?: string) => {
      trackEvent('landing_viewed', { source, medium, campaign });
    },
    uploadPageViewed: (source?: string) => {
      trackEvent('upload_page_viewed', { source });
    },
    resultsPageViewed: (documentId: string, sessionId?: string) => {
      trackEvent('results_page_viewed', { documentId, sessionId });
    },
    ctaClicked: (ctaLocation: string, ctaText: string) => {
      trackEvent('cta_clicked', {
        location: ctaLocation,
        text: ctaText
      });
    }
  };

  /**
   * Track errors
   */
  const trackError = (errorMessage: string, errorCode?: string, context?: string) => {
    trackEvent('error_occurred', {
      errorMessage,
      errorCode,
      context
    });
  };

  /**
   * Track feature engagement
   */
  const trackFeature = {
    premiumClicked: (featureName: string) => {
      trackEvent('premium_feature_clicked', { feature: featureName });
    },
    downloadReport: (documentId: string, format: string) => {
      trackEvent('download_report', { documentId, format });
    },
    shareResults: (documentId: string, method: string) => {
      trackEvent('share_results', { documentId, method });
    }
  };

  return {
    trackEvent,
    trackFileUpload,
    trackAnalysis,
    trackAuth,
    trackFunnel,
    trackError,
    trackFeature
  };
};