import { useState } from 'react';
import { Badge, Button, Card, CodeHint } from '@/components';
import { SettingRow } from './components/SettingRow';
import styles from './Settings.module.css';

const team = [
  { name: 'Maria Lytvyn', email: 'maria@nimbus.app', role: 'Owner', tone: 'done' as const },
  { name: 'Oleh Tkachenko', email: 'oleh@nimbus.app', role: 'Designer', tone: 'accent' as const },
  { name: 'Iryna Boiko', email: 'iryna@nimbus.app', role: 'Developer', tone: 'neutral' as const },
];

export function Settings() {
  const [notify, setNotify] = useState({
    orders: true,
    failures: true,
    renewals: false,
    digest: false,
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>

      <Card title="Notifications">
        <SettingRow
          label="New payments"
          description="An email when a customer starts or renews a plan"
          checked={notify.orders}
          onChange={(v) => setNotify({ ...notify, orders: v })}
        />
        <SettingRow
          label="Failed payments"
          description="A push notification the moment a card is declined"
          checked={notify.failures}
          onChange={(v) => setNotify({ ...notify, failures: v })}
        />
        <SettingRow
          label="Upcoming renewals"
          description="An email 3 days before a customer's plan renews"
          checked={notify.renewals}
          onChange={(v) => setNotify({ ...notify, renewals: v })}
        />
        <SettingRow
          label="Weekly digest"
          description="A metrics summary every Monday at 9:00"
          checked={notify.digest}
          onChange={(v) => setNotify({ ...notify, digest: v })}
        />
      </Card>

      <Card
        title="Team"
        actions={
          <Button variant="secondary" size="sm">
            Invite
          </Button>
        }
      >
        <ul className={styles.team}>
          {team.map((m) => (
            <li key={m.email} className={styles.member}>
              <span className={styles.avatar} aria-hidden="true">
                {m.name[0]}
              </span>
              <span className={styles.who}>
                <span>{m.name}</span>
                <span className={styles.email}>{m.email}</span>
              </span>
              <Badge tone={m.tone}>{m.role}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <div className={styles.footer}>
        <Button variant="secondary">Cancel</Button>
        {/* No size, so the md default. Adding sm did not touch this button. */}
        <Button>Save</Button>
      </div>

      <CodeHint folder="src/screens/settings" branch="feat/settings-*" />
    </div>
  );
}
