import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  /**
   * Added for the Dashboard toolbar.
   * The default 'md' is the original behavior, so Settings and the other screens did not change.
   */
  size?: 'md' | 'sm';
  children: ReactNode;
};

export function Button({ variant = 'primary', size = 'md', children, className, ...rest }: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
