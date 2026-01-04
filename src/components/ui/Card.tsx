import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
