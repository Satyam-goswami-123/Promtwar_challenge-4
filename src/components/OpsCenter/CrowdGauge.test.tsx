import { test, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CrowdGauge } from './CrowdGauge';

afterEach(() => {
  cleanup();
});

test('renders CrowdGauge with given density and status', () => {
  render(<CrowdGauge density={75} name="Gate A" status="crowded" />);
  
  // The density text should be visible
  expect(screen.getByText('75%')).toBeInTheDocument();
  
  // The name should be visible
  expect(screen.getByText('Gate A')).toBeInTheDocument();
  
  // The status should be rendered inside the badge
  expect(screen.getByText('CROWDED')).toBeInTheDocument();
});

test('renders critical status badge correctly', () => {
  render(<CrowdGauge density={95} name="Gate B" status="critical" />);
  expect(screen.getByText('CRITICAL')).toBeInTheDocument();
  // check for the badge-red class
  const badge = screen.getByText('CRITICAL');
  expect(badge).toHaveClass('badge-red');
});
