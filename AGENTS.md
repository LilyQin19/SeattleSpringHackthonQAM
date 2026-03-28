# Agent Guidelines

## Deployment

- **Always deploy with InsForge CLI** — use `npx @insforge/cli deployments deploy` for all deployments.
- Do NOT use Vercel CLI or other deployment tools directly.
- Always run `npm run build` locally before deploying to catch errors early.
- Deploy the `./dist` directory for Vite projects.
- Pass environment variables via `--env` flag, not in code.
