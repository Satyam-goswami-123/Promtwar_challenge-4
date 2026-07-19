import { test, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AIReportCard } from '../src/components/OpsCenter/AIReportCard';
import type { AIInsight } from '../src/types';

afterEach(cleanup);

const mockInsight: AIInsight = {
  id: 'ins1',
  title: 'Pre-Match Gate Surge Alert',
  type: 'alert',
  severity: 'critical',
  confidence: 94,
  content: 'Predicting 120% gate capacity overload at Gate A in 15 minutes.',
  timestamp: new Date(),
  actionItems: ['Open Gate C', 'Deploy 4 additional volunteers to Gate A']
};

test('renders AIReportCard correctly', () => {
  render(<AIReportCard insight={mockInsight} />);
  
  expect(screen.getByText('Pre-Match Gate Surge Alert')).toBeInTheDocument();
  expect(screen.getByText('CRITICAL')).toBeInTheDocument();
  expect(screen.getByText('94% confidence')).toBeInTheDocument();
});

test('expands to show recommendations when clicked', async () => {
  render(<AIReportCard insight={mockInsight} />);
  
  // Content should not be visible initially (wrapped in expanded state)
  expect(screen.queryByText('Open Gate C')).not.toBeInTheDocument();

  // Click the header to expand
  const header = screen.getByRole('article').querySelector('.report-header');
  if (header) {
    fireEvent.click(header);
  }

  // Recommendations and action items should be visible now
  expect(screen.getByText('Open Gate C')).toBeInTheDocument();
  expect(screen.getByText('Deploy 4 additional volunteers to Gate A')).toBeInTheDocument();
});
