import * as Sentry from "@sentry/react";

Sentry.init({
  // Use the SAME Dsn as your backend project
  dsn: import.meta.env.VITE_SENTRY_DSN, // This reads from your .env file,
  
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],

  // Performance Monitoring
  tracesSampleRate: 1.0, 

  // --- IMPORTANT FOR DISTRIBUTED TRACING ---
  // This tells Sentry to attach tracing headers when calling your API
 tracePropagationTargets: [
    "localhost:8081", // Matches your local backend specifically
    new RegExp(`^${import.meta.env.VITE_API_URL.replace(/\./g, '\\.')}`) //new RegExp (Regular Expression) instead of a simple string is to make Sentry smarter and safer.
  ],

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});