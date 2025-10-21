import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByTestId('button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('bg-blue-600'); // primary variant
    expect(button).not.toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByTestId('button');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByTestId('button')).toHaveClass('bg-gray-200');
  });

  it('renders with danger variant', () => {
    render(<Button variant="danger">Danger</Button>);
    expect(screen.getByTestId('button')).toHaveClass('bg-red-600');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByTestId('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    
    const button = screen.getByTestId('button');
    await userEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});
