import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type BadgeProps = {
  /** Default 'neutral' is grey. A new tone is added as a new class; existing ones never change. */
  tone?: 'neutral' | 'success' | 'accent' | 'danger' | 'done' | 'attention';
  children: ReactNode;
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
