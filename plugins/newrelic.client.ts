/**
 * New Relic Browser Monitoring Plugin
 *
 * This plugin initializes New Relic Browser (RUM - Real User Monitoring)
 * for frontend performance tracking, error monitoring, and user session analytics.
 *
 * Features:
 * - Page load performance tracking
 * - AJAX/fetch request monitoring
 * - JavaScript error tracking
 * - User session tracking
 * - Custom events and attributes
 *
 * Setup Instructions:
 * 1. Get your Browser monitoring script from New Relic:
 *    https://one.newrelic.com/nr1-core/browser-settings
 * 2. Add the following to your .env file:
 *    - NEW_RELIC_ENABLED=true|false
 *    - NEW_RELIC_BROWSER_LICENSE_KEY=your_browser_license_key
 *    - NEW_RELIC_BROWSER_APPLICATION_ID=your_app_id
 *    - NEW_RELIC_BROWSER_ACCOUNT_ID=your_account_id
 *    - NEW_RELIC_BROWSER_TRUST_KEY=your_trust_key
 *    - NEW_RELIC_BROWSER_AGENT_ID=your_agent_id
 *    - NEW_RELIC_BROWSER_BEACON=bam.nr-data.net (or your custom beacon)
 *    - NEW_RELIC_BROWSER_ERROR_BEACON=bam.nr-data.net (or your custom error beacon)
 *
 * @see https://docs.newrelic.com/docs/browser/browser-monitoring/installation/install-browser-monitoring-agent/
 */

export default defineNuxtPlugin(() => {
  // Only run on client-side
  if (process.server) return;

  const config = useRuntimeConfig();
  const enabled = config.public.newRelicEnabled === 'true' || config.public.newRelicEnabled === true;

  if (!enabled) {
    console.log('ℹ️  New Relic Browser monitoring is disabled');
    return;
  }

  // Check if required configuration is present
  const browserConfig = {
    licenseKey: config.public.newRelicBrowserLicenseKey,
    applicationID: config.public.newRelicBrowserApplicationId,
    accountID: config.public.newRelicBrowserAccountId,
    trustKey: config.public.newRelicBrowserTrustKey,
    agentID: config.public.newRelicBrowserAgentId,
    beacon: config.public.newRelicBrowserBeacon || 'bam.nr-data.net',
    errorBeacon: config.public.newRelicBrowserErrorBeacon || 'bam.nr-data.net',
  };

  // Validate required fields
  const requiredFields = ['licenseKey', 'applicationID'];
  const missingFields = requiredFields.filter(field => !browserConfig[field as keyof typeof browserConfig]);

  if (missingFields.length > 0) {
    console.warn(
      `⚠️  New Relic Browser monitoring is enabled but missing required configuration: ${missingFields.join(', ')}\n` +
      '   Please add the browser monitoring credentials to your environment variables.\n' +
      '   Get them from: https://one.newrelic.com/nr1-core/browser-settings'
    );
    return;
  }

  try {
    // Initialize New Relic Browser agent
    // This is a simplified version - you should replace this with the actual
    // browser agent snippet from New Relic UI which includes all the configuration
    const script = document.createElement('script');
    script.type = 'text/javascript';

    // New Relic Browser agent inline script
    // NOTE: In production, you should replace this with the actual snippet from New Relic
    script.text = `
      window.NREUM||(NREUM={});NREUM.info={
        "beacon":"${browserConfig.beacon}",
        "errorBeacon":"${browserConfig.errorBeacon}",
        "licenseKey":"${browserConfig.licenseKey}",
        "applicationID":"${browserConfig.applicationID}",
        "sa":1,
        "agent":""
      };
    `;

    document.head.appendChild(script);

    // Load the New Relic Browser agent
    const agentScript = document.createElement('script');
    agentScript.src = `https://js-agent.newrelic.com/nr-spa-${browserConfig.agentID || '1.latest'}.min.js`;
    agentScript.async = true;
    document.head.appendChild(agentScript);

    console.log('✅ New Relic Browser monitoring initialized');

    // Add custom attributes (example)
    if (window.newrelic) {
      window.newrelic.setCustomAttribute('appName', 'FormReady');
      window.newrelic.setCustomAttribute('environment', config.public.environment || 'development');
    }

  } catch (error) {
    console.error('❌ Failed to initialize New Relic Browser monitoring:', error);
  }
});

// Extend window type for New Relic
declare global {
  interface Window {
    NREUM: any;
    newrelic: {
      setCustomAttribute: (name: string, value: string | number | boolean) => void;
      addPageAction: (name: string, attributes?: Record<string, any>) => void;
      noticeError: (error: Error, customAttributes?: Record<string, any>) => void;
      setErrorHandler: (handler: (error: Error) => void) => void;
      finished: (timestamp?: number) => void;
      addToTrace: (customAttributes: Record<string, any>) => void;
      setCurrentRouteName: (name: string) => void;
      interaction: () => any;
    };
  }
}
