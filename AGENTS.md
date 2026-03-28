# Agent Guidelines

## Deployment

- **Always deploy with InsForge CLI** — use `npx @insforge/cli deployments deploy` for all deployments.
- Do NOT use Vercel CLI or other deployment tools directly.
- Always run `npm run build` locally before deploying to catch errors early.
- Deploy the `./dist` directory for Vite projects.
- Pass environment variables via `--env` flag, not in code.

## Component Patterns

### Global UI Components
- Add components that should appear on all pages to `src/layouts/AppLayout.tsx` (between header and main content), not to individual page components.

### Progress Indicators
- Use `--gradient-progress` CSS variable for progress bar fills and `bg-secondary` for tracks to match the app's design system.

## Data Access Patterns

### Training Plan Data
- Access training plan data (dates, week numbers) via `useTrainingPlan()` from `src/contexts/TrainingPlanContext.tsx`.
- Use date utilities from `src/lib/date-utils.ts` for common operations.

### Date Handling
- Use `date-fns` for all date manipulation: `parseISO`, `differenceInDays`, `format`.
- Avoid native Date methods to prevent timezone and parsing inconsistencies.
