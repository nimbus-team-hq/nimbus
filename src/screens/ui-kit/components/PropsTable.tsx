import styles from './PropsTable.module.css';

type Row = { name: string; type: string; def: string; required?: boolean; note?: string };

/**
 * Local UI kit component: the props table under the examples.
 * A required prop has no default, and the Default column says so.
 */
export function PropsTable({ rows }: { rows: Row[] }) {
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td className={styles.name}>
                <code>{r.name}</code>
              </td>
              <td className={styles.type}>
                <code>{r.type}</code>
              </td>
              <td className={styles.def}>
                {r.required ? <span className={styles.required}>required</span> : <code>{r.def}</code>}
              </td>
              <td className={styles.note}>{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
