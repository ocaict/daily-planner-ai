/**
 * Central application configuration.
 * Exposes a frozen config object and feature-flag helpers.
 * Never store secrets (API keys) here.
 */

const config = Object.freeze({
  environment: Object.freeze({
    mode: import.meta.env.MODE || 'development',
    isDevelopment: (import.meta.env.MODE || 'development') === 'development',
    isProduction: (import.meta.env.MODE || 'development') === 'production',
  }),

  api: Object.freeze({
    groq: Object.freeze({
      baseUrl: 'https://api.groq.com/openai/v1',
      // API key must be injected at runtime, never hard-coded
    }),
  }),

  features: Object.freeze({
    aiEnabled: false,
    voiceEnabled: false,
    notificationsEnabled: false,
    cloudSyncEnabled: false,
    calendarEnabled: false,
  }),

  database: Object.freeze({
    name: 'daily_planner.db',
    version: 1,
  }),
});

/**
 * Check whether a feature flag is enabled.
 * @param {string} featureName
 * @returns {boolean}
 */
export function isFeatureEnabled(featureName) {
  return config.features[featureName] === true;
}

/**
 * Get the frozen application config.
 * @returns {Readonly<object>}
 */
export function getConfig() {
  return config;
}

export default config;
