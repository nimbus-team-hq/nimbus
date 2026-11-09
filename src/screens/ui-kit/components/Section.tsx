import type { ReactNode } from 'react';
import styles from './Section.module.css';

type SectionProps = {
  id: string;
  title: string;
  /** One or two sentences: what it is and when to use it. */
  description: ReactNode;
  children: ReactNode;
};

/** Local UI kit component: a section with a title, a description and a frame for examples. */
export function Section({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={styles.head}>
        <h2 id={`${id}-title`} className={styles.title}>
          {title}
        </h2>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.frame}>{children}</div>
    </section>
  );
}
