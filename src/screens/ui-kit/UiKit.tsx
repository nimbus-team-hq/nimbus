import { useState } from 'react';
import { Badge, Button, Card, CodeHint, Logo, Toggle } from '@/components';
import { Canvas, Specimen } from './components/Canvas';
import { KitNav, type NavGroup } from './components/KitNav';
import { PropsTable } from './components/PropsTable';
import { Section } from './components/Section';
import { ColorGroup, RadiusScale, SpaceScale, TypeScale } from './components/Tokens';
import styles from './UiKit.module.css';

const nav: NavGroup[] = [
  {
    title: 'Foundations',
    items: [
      { id: 'logo', label: 'Logo' },
      { id: 'colors', label: 'Colors' },
      { id: 'type', label: 'Type' },
      { id: 'space', label: 'Spacing' },
      { id: 'radius', label: 'Radii' },
    ],
  },
  {
    title: 'Components',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'badge', label: 'Badge' },
      { id: 'toggle', label: 'Toggle' },
      { id: 'card', label: 'Card' },
      { id: 'codehint', label: 'CodeHint' },
    ],
  },
];

const colorGroups = [
  { title: 'Surfaces', tokens: ['--color-bg', '--color-surface', '--color-inset'] },
  { title: 'Borders', tokens: ['--color-border', '--color-border-muted'] },
  { title: 'Text', tokens: ['--color-text', '--color-text-muted', '--color-text-faint'] },
  { title: 'Action', tokens: ['--color-action', '--color-action-hover', '--color-on-action'] },
  {
    title: 'Status and accents',
    tokens: ['--color-accent', '--color-success', '--color-attention', '--color-danger', '--color-done', '--color-tab-active'],
  },
];

const fontTokens = [
  '--font-display',
  '--font-heading-lg',
  '--font-heading-md',
  '--font-body-md-semibold',
  '--font-body-md',
  '--font-body-sm-semibold',
  '--font-body-sm',
  '--font-mono-sm',
];

const spaceTokens = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-8'];
const radiusTokens = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-full'];

/**
 * Component library. Opens as #/ui-kit; the client never sees it.
 * Every variant of every shared component is here, with the tokens it is built from.
 * A reviewer of a PR in src/components looks at this screen instead of hunting for buttons across the product.
 */
export function UiKit() {
  const [on, setOn] = useState(true);

  return (
    <div className={styles.page}>
      <KitNav groups={nav} />

      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>UI kit</h1>
          <p className={styles.subtitle}>
            Shared components from <code>src/components</code> in every state, and the tokens from{' '}
            <code>src/tokens</code> they are built from. Changed a component? Open this screen and add a screenshot to the PR.
          </p>
        </header>

        <Section
          id="logo"
          title="Logo"
          description={
            <>
              An N monogram: soft shoulders on top for a cloud, a flat base. One color, <code>--color-text</code>, no
              tile and no gradient. In the top bar it sits next to the name; it scales down to 16 px.
            </>
          }
        >
          <Canvas>
            <Specimen caption="size={16}">
              <Logo size={16} />
            </Specimen>
            <Specimen caption="default, 24">
              <Logo />
            </Specimen>
            <Specimen caption="size={32}">
              <Logo size={32} />
            </Specimen>
            <Specimen caption="size={48}">
              <Logo size={48} />
            </Specimen>
            <Specimen caption="size={64}">
              <Logo size={64} />
            </Specimen>
            <Specimen caption="name">
              <Logo name />
            </Specimen>
          </Canvas>
          <PropsTable
            rows={[
              { name: 'size', type: 'number', def: '24', note: 'mark size in pixels' },
              { name: 'name', type: 'boolean', def: 'false', note: 'show the "Nimbus" name next to it' },
            ]}
          />
        </Section>

        <Section
          id="colors"
          title="Colors"
          description={
            <>
              Semantic tokens from <code>src/tokens/colors.css</code>. A component picks a color by role, not by hue: a
              button uses <code>--color-action</code>, not "green".
            </>
          }
        >
          <Canvas layout="stack">
            {colorGroups.map((g) => (
              <ColorGroup key={g.title} title={g.title} tokens={g.tokens} />
            ))}
          </Canvas>
        </Section>

        <Section
          id="type"
          title="Type"
          description={
            <>
              Ready-made size and line-height pairs from <code>src/tokens/typography.css</code>. Written in one line:{' '}
              <code>font: var(--font-body-md)</code>.
            </>
          }
        >
          <Canvas layout="stack">
            <TypeScale tokens={fontTokens} text="Overview of the last 30 days" />
          </Canvas>
        </Section>

        <Section
          id="space"
          title="Spacing"
          description="A 4 px step. Inside a component use 1–3, between components 4–6, between sections of a screen 8."
        >
          <Canvas layout="stack">
            <SpaceScale tokens={spaceTokens} />
          </Canvas>
        </Section>

        <Section
          id="radius"
          title="Radii"
          description="sm for small parts inside components, md for buttons and inputs, lg for cards, full for badges and toggles."
        >
          <Canvas>
            <RadiusScale tokens={radiusTokens} />
          </Canvas>
        </Section>

        <Section
          id="button"
          title="Button"
          description="One main action per screen is primary, the rest are secondary. Size sm is for toolbars and card headers."
        >
          <Canvas>
            <Specimen caption="default">
              <Button>Save</Button>
            </Specimen>
            <Specimen caption='variant="secondary"'>
              <Button variant="secondary">Cancel</Button>
            </Specimen>
            <Specimen caption='size="sm"'>
              <Button size="sm">New report</Button>
            </Specimen>
            <Specimen caption='variant="secondary" size="sm"'>
              <Button variant="secondary" size="sm">
                Export CSV
              </Button>
            </Specimen>
            <Specimen caption="disabled">
              <Button disabled>Save</Button>
            </Specimen>
          </Canvas>
          <PropsTable
            rows={[
              { name: 'variant', type: "'primary' | 'secondary'", def: "'primary'" },
              { name: 'size', type: "'md' | 'sm'", def: "'md'", note: 'added later; the default keeps the original look' },
              { name: 'disabled', type: 'boolean', def: 'false' },
            ]}
          />
        </Section>

        <Section
          id="badge"
          title="Badge"
          description="A status or category in one or two words. Pick the tone by what the event means, not for decoration."
        >
          <Canvas>
            <Specimen caption="default">
              <Badge>system</Badge>
            </Specimen>
            <Specimen caption='tone="success"'>
              <Badge tone="success">payment</Badge>
            </Specimen>
            <Specimen caption='tone="accent"'>
              <Badge tone="accent">sign-up</Badge>
            </Specimen>
            <Specimen caption='tone="attention"'>
              <Badge tone="attention">pending</Badge>
            </Specimen>
            <Specimen caption='tone="danger"'>
              <Badge tone="danger">declined</Badge>
            </Specimen>
            <Specimen caption='tone="done"'>
              <Badge tone="done">upgrade</Badge>
            </Specimen>
          </Canvas>
          <PropsTable
            rows={[
              {
                name: 'tone',
                type: "'neutral' | 'success' | 'accent' | 'attention' | 'danger' | 'done'",
                def: "'neutral'",
              },
            ]}
          />
        </Section>

        <Section
          id="toggle"
          title="Toggle"
          description="A setting that applies at once, with no Save button. The screen renders the visible label; label is for screen readers."
        >
          <Canvas>
            <Specimen caption="checked, interactive">
              <Toggle checked={on} onChange={setOn} label="Example toggle" />
            </Specimen>
            <Specimen caption="disabled">
              <Toggle checked={false} onChange={() => undefined} label="Off" disabled />
            </Specimen>
            <Specimen caption="checked disabled">
              <Toggle checked onChange={() => undefined} label="On, locked" disabled />
            </Specimen>
          </Canvas>
          <PropsTable
            rows={[
              { name: 'checked', type: 'boolean', def: '—', required: true },
              { name: 'onChange', type: '(checked: boolean) => void', def: '—', required: true },
              { name: 'label', type: 'string', def: '—', required: true, note: 'for screen readers' },
              { name: 'disabled', type: 'boolean', def: 'false' },
            ]}
          />
        </Section>

        <Section
          id="card"
          title="Card"
          description="A container for one block of content. The title and the actions slot on the right are optional: without them it is just a padded frame."
        >
          <Canvas layout="grid">
            <Specimen caption="default">
              <Card>No title, content only.</Card>
            </Specimen>
            <Specimen caption="title, actions">
              <Card title="Recent events" actions={<Badge tone="accent">5 new</Badge>}>
                A title, the <code>actions</code> slot on the right, content.
              </Card>
            </Specimen>
          </Canvas>
          <PropsTable
            rows={[
              { name: 'title', type: 'string', def: '—' },
              { name: 'actions', type: 'ReactNode', def: '—', note: 'buttons or badges to the right of the title' },
            ]}
          />
        </Section>

        <Section
          id="codehint"
          title="CodeHint"
          description="A hint at the bottom of every screen: where its code lives and how to name the branch."
        >
          <Canvas layout="stack">
            <Specimen caption="folder, branch">
              <CodeHint folder="src/screens/<screen>" branch="feat/<screen>-*" />
            </Specimen>
          </Canvas>
          <PropsTable
            rows={[
              { name: 'folder', type: 'string', def: '—', required: true, note: "screen folder, e.g. 'src/screens/dashboard'" },
              { name: 'branch', type: 'string', def: '—', required: true, note: "branch name pattern, e.g. 'feat/dashboard-*'" },
            ]}
          />
        </Section>

        <CodeHint folder="src/screens/ui-kit" branch="ds/* together with the component change" />
      </div>
    </div>
  );
}
