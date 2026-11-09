import styles from './Logo.module.css';

type LogoProps = {
  /** Mark size in pixels. Default 24, as in the top bar. Below 16 the monogram shoulders blur together. */
  size?: number;
  /** Show the "Nimbus" name to the right of the mark. */
  name?: boolean;
};

/**
 * Nimbus logo: an N monogram, two pillars with soft shoulders on top (a cloud)
 * and a flat base. One color, --color-text, no tile and no gradient,
 * so the mark works in any context and recolors with the theme.
 * Shared component: the app top bar and the UI kit screen (the "rule of two").
 */
export function Logo({ size = 24, name = false }: LogoProps) {
  return (
    <span className={styles.logo}>
      <svg
        className={styles.mark}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        role={name ? undefined : 'img'}
        aria-label={name ? undefined : 'Nimbus'}
        aria-hidden={name ? true : undefined}
      >
        <path d="M5 27V9.5A4.5 4.5 0 0 1 9.5 5Q11.25 5 13.18 7.5L21 17.62V5h1.5A4.5 4.5 0 0 1 27 9.5V27h-4.5Q20.75 27 18.82 24.5L11 14.38V27Z" />
      </svg>
      {name && <span className={styles.name}>Nimbus</span>}
    </span>
  );
}
