# Travelstick — Frontend

Clean, maintainable Next.js frontend for the Travelstick admin and public website.

This repository contains the Next.js (App Router) frontend used by Travelstick. It includes the public-facing site and the dashboard/admin area used to manage hotels, packages, bookings and other content.

## Key Features

- Next.js (App Router) application
- Tailwind CSS for styling
- Ant Design components used in dashboard forms and lists
- Multi-language support via a simple i18n context
- File upload helpers and image handling
- Modular components split into `components/`, `app/`, `helper/`, and `contexts/`

## Tech Stack

- Next.js 13+ (App Router)
- React 18+
- Tailwind CSS
- Ant Design (`antd`)
- Firebase (optional integration present)

## Prerequisites

- Node.js 16+ (recommended LTS)
- npm, pnpm or yarn
- Git

On Windows PowerShell you may need to use `npm.cmd` instead of `npm` for scripts if execution policy blocks runnable npm binaries.

## Quick Start

1. Install dependencies:

```bash
npm install
# or: pnpm install
# or: yarn install
```

2. Run the development server:

```bash
npm run dev
# or: npm.cmd run dev (Windows PowerShell)
```

Open http://localhost:3000 in your browser. The dashboard is available under the admin routes (e.g. `/admin/...`).

## Useful NPM Scripts

- `npm run dev` — Start the Next.js development server
- `npm run build` — Build for production
- `npm run start` — Start the production server after build
- `npm run lint` — Run linting (if configured)

Check `package.json` for the exact scripts available in this project.

## Environment Variables

This project may require environment variables for API endpoints and third-party services (Firebase, analytics, etc.). Create a `.env.local` in the project root and add required keys. Common examples:

- `NEXT_PUBLIC_API_URL` — URL of the backend API
- `NEXT_PUBLIC_FIREBASE_API_KEY` — Firebase project key (if using Firebase features)

If the project includes an `.env.example` file, copy it to `.env.local` and fill values accordingly.

## Project Structure (high level)

- `app/` — Next.js app routes and pages (public site + dashboard)
- `components/` — Reusable React components and UI building blocks
- `contexts/` — React contexts (i18n, user, cart, etc.)
- `helper/` — API helpers, backend calls and utility functions
- `provider/` — Providers used by the app
- `styles/` — Global styles and Tailwind configuration
- `public/` — Static assets

Important files:

- [app/](app/) — main application routes and dashboard pages
- [app/(dashboard)/admin/hotelManagement/hotel/hotelForm/page.js](app/(dashboard)/admin/hotelManagement/hotel/hotelForm/page.js) — Hotel form used in admin area
- [components/form/select.js](app/components/form/select.js) — Form select wrapper around Ant Design Select
- [helper/backend.js](app/helper/backend.js) — API request helpers

(Paths above are workspace-relative; explore `app/` and `components/` for more.)

## Contributing

- Create feature branches from `main` (or your team's chosen branch)
- Run the dev server and test locally
- Keep changes focused and provide descriptive commits

If you plan to add features or modify API integrations, coordinate with the backend team to share expected payload shapes and environment variables.

## Troubleshooting

- If UI changes don't appear, restart the dev server after clearing cache
- If image uploads fail, check the API endpoint and any required credentials
- On Windows PowerShell, use `npm.cmd` for scripts when executables are blocked

## Deployment

This app is built for modern Vercel deployment but can be deployed to any Node-compatible host.

Example deployment flow (Vercel):

1. Push branch to remote
2. Connect the repository in Vercel dashboard
3. Configure environment variables in the Vercel project settings
4. Trigger a deploy (automatic on push to the production branch)

## Where to go next

- Review the `app/(dashboard)` area for admin pages and `app/site` (or top-level `app/`) for public pages.
- If you need me to add an `.env.example`, CI scripts, or a CONTRIBUTING.md, tell me which you'd like and I can scaffold them.

---
