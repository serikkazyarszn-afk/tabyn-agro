import { clsx } from 'clsx';

/**
 * Tabyn logo system — renders the original brand logo from /public/logo.png.
 *
 * Per the client spec: the logo height is ALWAYS 55px across the product.
 * The `size` / `markSize` props are kept for API compatibility but are
 * ignored — the logo is a locked brand asset at a locked height.
 */

const LOGO_HEIGHT = 44;

/**
 * Compact brand mark — used in favicon-style spots, 404 page, auth panes.
 * Always renders at a compact brand-safe size.
 */
export function TabynMark({
  // accepted for backwards compatibility, ignored on purpose
  size,
  className,
}: {
  size?: number;
  className?: string;
}) {
  void size;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/tabyn-logo-dark.svg"
      alt="Tabyn"
      width={LOGO_HEIGHT}
      height={LOGO_HEIGHT}
      className={clsx('shrink-0 object-contain origin-left', className)}
      style={{ width: LOGO_HEIGHT, height: LOGO_HEIGHT }}
    />
  );
}

/**
 * Full wordmark — the PNG contains the horse mark plus the "Tabyn"
 * wordmark. We render the whole image at h=55 and let it auto-size
 * on the width axis.
 */
export function TabynWordmark({
  className,
  // accepted for API compatibility, ignored on purpose
  markSize,
  showMark = true,
}: {
  className?: string;
  markSize?: number;
  showMark?: boolean;
}) {
  void markSize;
  void showMark;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/tabyn-logo-dark.svg"
      alt="Tabyn"
      height={LOGO_HEIGHT}
      className={clsx('shrink-0 object-contain origin-left', className)}
      style={{ height: LOGO_HEIGHT, width: 'auto' }}
    />
  );
}

export default TabynWordmark;
