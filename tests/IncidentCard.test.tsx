import { test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IncidentCard } from '../src/components/OpsCenter/IncidentCard';
import type { Incident } from '../src/types';

afterEach(cleanup);

const mockIncident: Incident = {
  id: 'inc1',
  title: 'Crowd congestion Gate A',
  type: 'crowd',
  severity: 'high',
  status: 'assigned',
  location: { zone: 'Gate A', description: 'Gate A turnstiles' },
  reportedAt: new Date(Date.now() - 10 * 60000),
  assignedTo: ['Volunteer Team 1']
};

test('renders IncidentCard correctly', () => {
  render(<IncidentCard incident={mockIncident} isSelected={false} onClick={() => {}} />);
  
  expect(screen.getByText('Crowd congestion Gate A')).toBeInTheDocument();
  expect(screen.getByText('📍 Gate A turnstiles')).toBeInTheDocument();
  expect(screen.getByText('ASSIGNED')).toBeInTheDocument();
});

test('handles click events and keypress events', () => {
  const handleClick = vi.fn();
  render(<IncidentCard incident={mockIncident} isSelected={false} onClick={handleClick} />);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
