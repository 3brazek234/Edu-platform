# go-fluent-ui

Lightweight React + Vite UI for a tutoring/order flow (Tailwind + shadcn-style components).

This repository contains a small frontend that includes an order flow (subject selection, package selection, and a final `OrderSummary` form).

## Quick start

Requirements
- Node.js 18+ (or compatible)
- npm (or yarn/pnpm)

Install

```powershell
npm install
```

Run dev server

```powershell
npm run dev
```

Build

```powershell
npm run build
```

Preview production build

```powershell
npm run preview
```

## Important files
- `src/components/OrderPage/OrderSummary.tsx` — React form for submitting orders (now uses react-hook-form + zod)
- `src/services/submitOrder.ts` — Service that posts order payload to the backend endpoint
- `src/types/interface.ts` — shared types for `Package` and `Subject`

## Order submission

The app posts order payloads to the WordPress endpoint:

```
http://gos-test.local/wp-json/gos/order/submit
```

The payload shape is defined in `src/services/submitOrder.ts` (exported `OrderPayload`). The `OrderSummary` component will include package and subject details when submitting.

If you need to test the endpoint locally:

- Ensure `gos-test.local` resolves and the WordPress site is running.
- Or modify the endpoint in `src/services/submitOrder.ts` to point to a reachable test server.

## Environment

This project expects no special Vite env variables for the order form. If you add secrets later, put them in a `.env` file and reference them as `import.meta.env.VITE_...`.

## Tests / Validation

Form validation uses `zod` via `@hookform/resolvers`. Validation runs on field touch (`mode: 'onTouched'`) and re-validates on change.

## Design / Patterns

The project follows a small service pattern: network calls are pulled into `src/services/*` and the UI components call those services. This makes the components easier to test and keeps network logic isolated.

## Next steps
- Add integration tests around `OrderSummary` with React Testing Library and MSW.
- Add better payment handling (tokenization) instead of raw card submission.

---

If you want a shorter README or additional sections (contributing, license, CI), tell me which sections to add and I'll update it.
