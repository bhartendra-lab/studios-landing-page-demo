import '@/styles/globals.css';
import { useEffect } from 'react';

const FONTS_LINK_ID = 'studio-theme-fonts';

function buildFontsUrl(fontHeading, fontBody) {
  const toParam = (name) => name.trim().replace(/\s+/g, '+');
  const families = [
    `${toParam(fontHeading)}:ital,wght@0,400;0,500;0,600;1,400`,
    `${toParam(fontBody)}:wght@300;400;500;600`,
  ]
    .map((f) => `family=${f}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export default function App({ Component, pageProps }) {
  const theme = pageProps?.config?.theme;

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    if (theme.primaryColor) {
      root.style.setProperty('--color-primary', theme.primaryColor);
    }
    if (theme.accentColor) {
      root.style.setProperty('--color-accent', theme.accentColor);
    }
    if (theme.fontHeading) {
      root.style.setProperty('--font-heading', `'${theme.fontHeading}'`);
    }
    if (theme.fontBody) {
      root.style.setProperty('--font-body', `'${theme.fontBody}'`);
    }

    if (theme.fontHeading && theme.fontBody) {
      const href = buildFontsUrl(theme.fontHeading, theme.fontBody);
      let link = document.getElementById(FONTS_LINK_ID);
      if (!link) {
        link = document.createElement('link');
        link.id = FONTS_LINK_ID;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      if (link.href !== href) link.href = href;
    }
  }, [theme]);

  return <Component {...pageProps} />;
}
