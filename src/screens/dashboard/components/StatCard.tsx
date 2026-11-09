import { Card } from '@/components';
import styles from './StatCard.module.css';

type StatCardProps = {
  label: string;
  value: string;
  delta: string;
  /** 'up' is green, 'down' is red */
  trend: 'up' | 'down';
};

/** Local Dashboard component. Moves to src/components once a second screen needs it. */
export function StatCard({ label, value, delta, trend }: StatCardProps) {
  return (
    <Card>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      <p className={trend === 'up' ? styles.up : styles.down}>{delta}</p>
    </Card>
  );
}
