import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section {...props} className={cn('py-12 sm:py-16 lg:py-20', className)}>
      <div className="container-main">
        {children}
      </div>
    </section>
  );
}

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function HeroSection({ title, subtitle, description, children, className }: HeroSectionProps) {
  return (
    <div className={cn('py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10', className)}>
      <div className="container-main text-center">
        {subtitle && (
          <p className="text-sm font-semibold text-primary mb-4">
            {subtitle}
          </p>
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 max-w-3xl mx-auto">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

interface GridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Grid({ children, columns = 3, gap = 'md', className }: GridProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div className={cn('grid', columnClasses[columns], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

interface PlaceholderPanelProps {
  title: string;
  description?: string;
  height?: string;
}

export function PlaceholderPanel({ title, description, height = 'h-64' }: PlaceholderPanelProps) {
  return (
    <div className={cn('bg-muted/50 border-2 border-dashed border-muted rounded-lg flex items-center justify-center', height)}>
      <div className="text-center">
        <p className="font-semibold text-foreground mb-2">{title}</p>
        {description && (
          <p className="text-sm text-foreground/60">{description}</p>
        )}
      </div>
    </div>
  );
}

interface AccordionItemProps {
  title: string;
  children: ReactNode;
}

export function AccordionItem({ title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-foreground">{title}</span>
        <svg
          className={cn('w-5 h-5 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-border bg-card/50">
          {children}
        </div>
      )}
    </div>
  );
}
