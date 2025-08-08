# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed by Turborepo and pnpm.
- Apps: `apps/nextjs` (web, Next.js 15), `apps/expo` (React Native via Expo).
- Packages: `packages/api` (tRPC server types), `packages/auth` (Better-Auth + helpers), `packages/db` (Drizzle ORM + schema), `packages/validators` (shared Zod schemas).
- Tooling: shared configs in `tooling/{eslint,prettier,tailwind,typescript}`. Docs in `docs/`. Assets in `apps/nextjs/public` and `apps/expo/assets`.

## Build, Test, and Development Commands
- `pnpm i`: install workspace dependencies.
- `cp .env.example .env`: seed environment; update values as needed.
- `pnpm dev`: run dev for affected workspaces (Turbo watch). Use `pnpm -F @menuplanner/nextjs dev` or `pnpm -F @menuplanner/expo dev` to focus.
- `pnpm build`: build all packages/apps. `pnpm -F <pkg> build` to scope.
- `pnpm lint` | `pnpm lint:fix`: lint all workspaces.
- `pnpm format` | `pnpm format:fix`: check/format with Prettier.
- DB: `pnpm db:push`, `pnpm db:migrate`, `pnpm db:studio`. Auth scaffolding: `pnpm auth:generate`.

## Coding Style & Naming Conventions
- Language: TypeScript (strict) across repo; modules are ESM.
- Formatting: Prettier via `@menuplanner/prettier-config` (import ordering, Tailwind class sorting). 2-space indentation.
- Linting: Flat-config ESLint presets in `@menuplanner/eslint-config` (React, Next.js rules, consistent type imports, forbid non-null assertions, restrict raw `process.env`).
- Paths: prefer aliases (e.g., `@/components/Button` in Next.js). Package names are scoped `@menuplanner/*`.

## Testing Guidelines
- Primary focus on integration/e2e (see `docs/testing.md`). Suggested stack: Vitest + Testing Library for unit/integration; Playwright for e2e.
- Co-locate tests next to sources or in `__tests__`.
- Naming: `*.test.ts`/`*.test.tsx`; e2e as `*.e2e.ts`.
- Add CI steps later; keep tests deterministic and independent.

## Commit & Pull Request Guidelines
- Commits follow Conventional Commits (seen in history: `feat:`, `docs:`, `refactor:`). Use scopes where helpful: `feat(nextjs): ...`.
- PRs must: pass `pnpm lint`, `pnpm format`, and `pnpm typecheck`; include a clear description, linked issues (`Closes #123`), and screenshots for UI changes.
- For changes requiring config/env, document updates in the PR and in `README.md` if user-facing.

## Security & Configuration Tips
- Required envs are listed in `turbo.json > globalEnv`. Load envs via scripts that use `dotenv` (e.g., `with-env`). Never access `process.env` directly in app code—import validated `env` modules.
