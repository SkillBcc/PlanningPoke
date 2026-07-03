import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DonutChart } from '../features/room/components/DonutChart';
import React from 'react';

describe('DonutChart', () => {
  it('renders "Empty" when voteCounts is empty', () => {
    render(<DonutChart voteCounts={{}} />);
    expect(screen.getByText('Empty')).toBeDefined();
  });

  it('renders the chart with correct total votes', () => {
    render(<DonutChart voteCounts={{ '5': 2, '8': 1 }} />);
    expect(screen.getByTestId('donut-chart')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined(); // Total votes
    expect(screen.getByText('votes')).toBeDefined();
  });

  it('renders "vote" instead of "votes" for a single vote', () => {
    render(<DonutChart voteCounts={{ '13': 1 }} />);
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('vote')).toBeDefined();
  });
});
