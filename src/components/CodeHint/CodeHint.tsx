import styles from './CodeHint.module.css';

type CodeHintProps = {
  /** Screen folder, e.g. 'src/screens/dashboard' */
  folder: string;
  /** Branch name pattern, e.g. 'feat/dashboard-*' */
  branch: string;
};

/**
 * A hint at the bottom of every screen: where its code lives and how to name the branch.
 * Shared, because three screens need it (the "rule of two").
 */
export function CodeHint({ folder, branch }: CodeHintProps) {
  return (
    <p className={styles.hint}>
      <span className={styles.k}>code</span> {folder}/
      <span className={styles.sep}>·</span>
      <span className={styles.k}>branch</span> {branch}
      <span className={styles.sep}>·</span>
      change it freely, other screens won't be affected
    </p>
  );
}
