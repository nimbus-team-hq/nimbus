import type { ReactNode } from 'react';
import styles from './Card.module.css';

type CardProps = {
  title?: string;
  /** Buttons or badges to the right of the title. */
  actions?: ReactNode;
  children: ReactNode;
};

export function Card({ title, actions, children }: CardProps) {
  return (
    <section className={styles.card}>
      {(title || actions) && (
        <header className={styles.head}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
