import type { ReactNode } from 'react';
import styles from './Canvas.module.css';

type CanvasProps = {
  /** row: inline items in a row; grid: blocks in several columns; stack: one under another. */
  layout?: 'row' | 'grid' | 'stack';
  children: ReactNode;
};

/** Local UI kit component: the canvas the examples sit on. */
export function Canvas({ layout = 'row', children }: CanvasProps) {
  return <div className={`${styles.canvas} ${styles[layout]}`}>{children}</div>;
}

type SpecimenProps = {
  /** The props that make this instance differ from the default, e.g. size="sm". */
  caption: string;
  children: ReactNode;
};

/** One component instance with a caption under it, like a variant in Figma. */
export function Specimen({ caption, children }: SpecimenProps) {
  return (
    <figure className={styles.specimen}>
      <div className={styles.item}>{children}</div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
