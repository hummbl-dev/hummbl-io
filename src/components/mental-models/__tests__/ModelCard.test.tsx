/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModelCard from '../ModelCard';

const mockModel = {
  id: '1',
  name: 'First Principles',
  code: 'FP',
  description: 'Breaking down problems into basics',
  category: 'Problem Solving',
  tags: ['thinking'],
  transformations: ['P'],
  sources: [{ name: 'Aristotle', reference: 'Metaphysics' }],
  meta: { added: '2025-01-01', updated: '2025-01-01', isCore: true, difficulty: 3 },
};

describe('ModelCard', () => {
  it('renders full model info', () => {
    render(<ModelCard model={mockModel} onSelect={() => {}} />);
    expect(screen.getByText('First Principles')).toBeInTheDocument();
    expect(screen.getByText('Problem Solving')).toBeInTheDocument();
    expect(screen.getByText(/Breaking down problems/i)).toBeInTheDocument();
  });

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn();
    render(<ModelCard model={mockModel} onSelect={onSelect} />);
    await userEvent.click(screen.getByText('First Principles'));
    expect(onSelect).toHaveBeenCalledWith(mockModel);
  });

  it('renders gracefully with missing optional fields', () => {
    const incomplete = { ...mockModel, description: undefined, category: undefined };
    render(<ModelCard model={incomplete} onSelect={() => {}} />);
    expect(screen.getByText('First Principles')).toBeInTheDocument();
  });
});
