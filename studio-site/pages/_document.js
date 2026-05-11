import { Html, Head, Main, NextScript } from 'next/document';

// Platform-default theme values used server-side to prevent flash of unstyled content.
// Per-studio overrides are applied client-side in _app.js once pageProps.config is available.
const DEFAULT_CSS_VARS = `
  :root {
    --color-bg: #f6f3ec;
    --color-surface: #ffffff;
    --color-primary: #111111;
    --color-muted: rgba(17, 17, 17, 0.55);
    --color-faint: rgba(17, 17, 17, 0.35);
    --color-line: rgba(17, 17, 17, 0.12);
    --color-accent: #8a6d4b;
    --font-heading: 'Instrument Serif';
    --font-body: 'Inter Tight';
    --max-w: 1240px;
    --gutter: clamp(20px, 4vw, 56px);
  }
`.trim();

const DEFAULT_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600&display=swap';

export default function Document() {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={DEFAULT_FONTS_HREF} rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: DEFAULT_CSS_VARS }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
