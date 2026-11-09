import { Badge, Button, Card, CodeHint } from '@/components';
import { StatCard } from './components/StatCard';
import styles from './Dashboard.module.css';

const stats = [
  { label: 'MRR', value: '$12,480', delta: '+8%', trend: 'up' as const },
  { label: 'Active users', value: '1,284', delta: '+12%', trend: 'up' as const },
  { label: 'Churn', value: '2.1%', delta: '−0.4 pp', trend: 'up' as const },
];

const events = [
  { text: 'Olena Koval subscribed to the Team plan', tone: 'success' as const, tag: 'payment', time: '12 min' },
  { text: 'New workspace "Studio North"', tone: 'accent' as const, tag: 'sign-up', time: '48 min' },
  { text: 'Card **** 4021 declined', tone: 'danger' as const, tag: 'payment', time: '2 h' },
  { text: 'August report export finished', tone: 'neutral' as const, tag: 'system', time: '5 h' },
  { text: 'Plan Pro → Team for acme.co', tone: 'done' as const, tag: 'upgrade', time: 'yesterday' },
];

export function Dashboard() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Overview of the last 30 days</p>
        </div>
        <div className={styles.actions}>
          {/* size="sm" was added as a variant; nobody changed the md default. */}
          <Button variant="secondary" size="sm">
            Export CSV
          </Button>
          <Button size="lg">New report</Button>
        </div>
      </header>

      <div className={styles.stats}>
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Card title="Recent events" actions={<Badge tone="accent">5 new</Badge>}>
        <ul className={styles.events}>
          {events.map((e) => (
            <li key={e.text} className={styles.event}>
              <span className={styles.eventText}>{e.text}</span>
              <Badge tone={e.tone}>{e.tag}</Badge>
              <span className={styles.time}>{e.time}</span>
            </li>
          ))}
        </ul>
      </Card>

      <CodeHint folder="src/screens/dashboard" branch="feat/dashboard-*" />
    </div>
  );
}
