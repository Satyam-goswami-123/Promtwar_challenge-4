import { test, expect } from 'vitest';
import { getAIResponse, AI_RESPONSES } from './ai';

test('getAIResponse returns food recommendations when asked about food', async () => {
  const response = await getAIResponse('Where can I get food?');
  expect(AI_RESPONSES.food).toContain(response);
});

test('getAIResponse returns parking info when asked about parking', async () => {
  const response = await getAIResponse('Where did I park?');
  expect(AI_RESPONSES.parking).toContain(response);
});

test('getAIResponse returns default fallback for unknown queries', async () => {
  const response = await getAIResponse('xyz123 unknown query');
  expect(AI_RESPONSES.default).toContain(response);
});
