# Project guidance

This existing React 18 + TypeScript + Vite laundry project is maintained as a website.
Read AGENTS.md and its installed antislop instructions before UI work.

- Public customer storefront: src/pages/LandingPage.tsx and LandingPage.css.
- Public configuration, pricing helpers, request message: src/lib/laundrySite.ts.
- Public catalog: src/hooks/usePublicLaundry.ts. Query only the explicitly configured outlet.
- Source starter prices: DEFAULT_SERVICES in src/hooks/useServices.ts. Do not duplicate or change them casually.
- Customer request form prepares a WhatsApp message; it does not claim a confirmed order or charge a payment.
- Authentication: custom authService + AuthContext with the existing Supabase RPCs.
- Store scoping: StoreContext, protected/owner routes, and store_id filters.
- POS, orders, payments, points, receipts, reporting, and messaging must preserve existing business behavior.
- Printing: browser print, PDF, and Web Bluetooth. No native runtime dependencies.
- Browser offline data: IndexedDB/Dexie, existing queue/sync hooks, production-only service worker.
- Never fabricate customer reviews, business statistics, address, operating hours, or pickup availability.
- The owner supplied the active WhatsApp contact +62 821-3194-417; do not invent other contact details.

Development: npm install, npm run dev (default port 8080).
Validation: npm test, npx tsc --noEmit -p tsconfig.app.json, npm run build.
Preview: npm run preview.
See README.md and docs/WEB_REDESIGN.md for the current architecture and verification.
