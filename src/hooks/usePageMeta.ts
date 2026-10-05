import { useEffect } from 'react';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://pos.fahrudina.my.id';

interface PageMetaOptions {
  title?: string;
  description?: string;
  /** Route path used to build the canonical URL. */
  path?: string;
}

/**
 * Updates the single static <title>/<meta name="description">/<link rel="canonical">
 * already present in index.html, rather than injecting new tags — index.html is served
 * as-is for every route (SPA rewrite), so a library that only appends tags would leave
 * two conflicting canonical links per page, which makes Google ignore both.
 */
export const usePageMeta = ({ title, description, path }: PageMetaOptions) => {
  useEffect(() => {
    if (title) document.title = title;
    if (title) {
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    }

    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    }

    if (path !== undefined) {
      const url = `${SITE_URL.replace(/\/$/, '')}${path}`;
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
    }
  }, [title, description, path]);
};
