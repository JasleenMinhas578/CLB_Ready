import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { href } from '@/app/router';

type Variant = 'primary' | 'secondary' | 'quiet';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={`btn btn-${variant} ${className}`} {...rest}>
      {children}
    </button>
  );
}

interface LinkButtonProps {
  to: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

/** Looks like a button, navigates like a link. */
export function LinkButton({ to, variant = 'primary', className = '', children }: LinkButtonProps) {
  return (
    <a href={href(to)} className={`btn btn-${variant} ${className}`}>
      {children}
    </a>
  );
}
