export { createJourneyRouter } from './router.js';
export {
  buildPrompt,
  callGeminiItinerary,
  generateDeterministicFallback,
  generateJourney,
} from './service.js';
export {
  validateJourneyPreference,
  parseAndValidateGeminiResponse,
} from './validator.js';

if (process.env.NODE_TEST_CONTEXT) {
  await import('./test/journey.test.js');
}
