import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // Modern formats first — Next will serve AVIF to supporting clients.
    formats: ['image/avif', 'image/webp'],
    // Responsive breakpoints tuned to the layout system (360 / 480 / 768 /
    // 1024 / 1280 / 1440+ in globals.css). These generate the `srcset` next
    // emits for <Image fill /> and <Image sizes>.
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
    // Allow inline SVG rendering for our schematic placeholders. We author
    // every SVG ourselves, so this is safe; it would NOT be safe for
    // user-uploaded SVGs.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
    // When real photography is uploaded to Supabase storage, add the bucket
    // hostname here. Current entry reflects the project's Supabase URL.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fsmbwtpgzcubbquoavlj.supabase.co',
      },
    ],
  },
  // Tight default headers — no referrer leak, frames off, MIME sniffing off.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
