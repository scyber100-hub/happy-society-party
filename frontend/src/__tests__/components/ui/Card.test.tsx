import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

describe('Card Component', () => {
  it('renders children content', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant styles (bordered)', () => {
    render(
      <Card data-testid="card">
        Content
      </Card>
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('rounded-[var(--radius-lg)]');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('border');
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>
    );
    expect(screen.getByTestId('card')).toHaveClass('custom-class');
  });

  it('applies elevated variant styles', () => {
    render(
      <Card variant="elevated" data-testid="card">
        Content
      </Card>
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-[var(--shadow-md)]');
  });

  it('applies different padding sizes', () => {
    const { rerender } = render(
      <Card padding="sm" data-testid="card">
        Content
      </Card>
    );
    expect(screen.getByTestId('card')).toHaveClass('p-4');

    rerender(
      <Card padding="lg" data-testid="card">
        Content
      </Card>
    );
    expect(screen.getByTestId('card')).toHaveClass('p-8');
  });

  it('applies no padding when specified', () => {
    render(
      <Card padding="none" data-testid="card">
        Content
      </Card>
    );
    const card = screen.getByTestId('card');
    expect(card).not.toHaveClass('p-4');
    expect(card).not.toHaveClass('p-6');
    expect(card).not.toHaveClass('p-8');
  });
});

describe('Card Sub-components', () => {
  it('renders CardHeader', () => {
    render(
      <CardHeader data-testid="header">
        Header Content
      </CardHeader>
    );
    expect(screen.getByTestId('header')).toHaveClass('mb-4');
  });

  it('renders CardTitle', () => {
    render(
      <CardTitle>Title</CardTitle>
    );
    expect(screen.getByText('Title')).toHaveClass('text-xl', 'font-semibold');
  });

  it('renders CardContent', () => {
    render(
      <CardContent data-testid="content">
        Content
      </CardContent>
    );
    expect(screen.getByTestId('content')).toHaveClass('text-[var(--gray-600)]');
  });
});
