## Repo summary

- Monorepo with two primary packages: `client/` (Next.js front-end, app router) and `server/` (Express + Mongoose API). Root workspace is configured in `package.json` using npm workspaces.
- Front-end code lives under `client/src` (app router in `client/src/app`, components in `client/src/components`). Backend source is under `server/src` with controllers, models and routes.

## High-level architecture & data flow

- Client (Next.js) presents UI components such as `Viewer360` (`client/src/components/features/Viewer360.tsx`) and `LeadForm` (`client/src/components/features/LeadForm.tsx`).
- User actions (e.g., lead submission) call client API handlers in `client/src/app/api/` (see `client/src/app/api/leads/action.ts`) which forward to server endpoints or call helper services in `client/src/lib/services/`.
- Server exposes REST endpoints implemented under `server/src/routes` and `server/src/controllers` and persists via Mongoose models in `server/src/models` (e.g., `Lead.ts`).

## Important files & patterns (use these as anchors)

- Project scripts: root `package.json` (workspaces) and package-level scripts:
  - Run client: `cd client && npm run dev` (or from root: `npm run dev:client`).
  - Run server: `cd server && npm run dev` (or from root: `npm run dev:server`).
  - Build workspaces from root: `npm run build`.
- Next.js app router: `client/src/app/layout.tsx`, route segments use folders like `(auth)`, `(customer)` — follow existing nested layout/route conventions.
- 3D assets and three.js usage: `three` + `@react-three/fiber` are used; large models live in `client/public/images` (example: `client/public/images/yamaha_r1m.glb`). Avoid committing large model files to git history.
- Shared utilities: small helper code and services exist under `client/src/lib` and `src/lib` for shared logic (e.g., `leadScoring.ts`). Match existing style (TypeScript, default exports where present).

## Project-specific conventions

- TypeScript across both client and server; prefer adding types in `types/` when new shared types are needed.
- Naming: React components use PascalCase and live under `components/`. Route files within `app/` follow Next.js app-router conventions.
- Environment: `.env*` files are intentionally in `.gitignore`. Don't hardcode secrets — use `.env.local` for dev.

## Handling large assets (critical)

- There is a tracked file `client/public/images/yamaha_r1m.glb` (~109 MB). GitHub rejects files >100MB. To fix pushes you have two safe options:

  1) Move large models out of the repo or store them in external storage (S3, CDN) and load at runtime.
  2) Use Git LFS for binary assets. If adopting LFS, run `git lfs install` and track the pattern (e.g., `git lfs track "client/public/images/*.glb"`) then re-commit.

If you want to simply stop committing these files and remove the already-tracked large file from the latest commit (safe for most cases), run these PowerShell commands locally:

```powershell
# 1) Add the ignore rule (already present in repo). Then remove the file from the index but keep it locally:
git rm --cached "client/public/images/yamaha_r1m.glb"
git commit -m "chore: stop tracking large .glb model"
git push origin HEAD
```

If the large file is already in earlier commits (history), use the BFG or `git filter-repo` to remove it from history before pushing. See: https://rtyley.github.io/bfg-repo-cleaner/ and https://github.com/newren/git-filter-repo

If you prefer Git LFS instead, these are the minimal steps (PowerShell):

```powershell
# install git-lfs first (one-time):
git lfs install
git lfs track "client/public/images/*.glb"
git add .gitattributes
# re-add the large file so it gets committed as LFS pointer
git add "client/public/images/yamaha_r1m.glb"
git commit -m "chore: track .glb with git-lfs"
git push origin HEAD
```

## Helpful quick references for an AI assistant

- Start both packages during dev: `npm run dev:client` and `npm run dev:server` from root (or the individual `npm run dev` inside each package).
- Look at `client/src/app/api/leads/action.ts` to understand how lead submissions are wired from the frontend to server endpoints.
- For server routing and model shapes, inspect `server/src/controllers/leadController.ts` and `server/src/models/Lead.ts`.
- 3D viewer and model import points: `client/src/components/features/Viewer360.tsx` and `client/public/images/`.

## Do not guess — look here first

- Before changing app-router pages, check `client/src/app/layout.tsx` and `client/src/app/globals.css` for global layout/styles.
- When adding server endpoints, mirror existing controller/service patterns found in `server/src/controllers` and `server/src/services`.

## If you modify repository-level config

- Update root `package.json` workspaces or scripts consistently; CI and dev scripts expect `client` and `server` present.

---

If anything here is unclear or you want me to also run the git untracking commands locally (I can provide exact output/verify the push), tell me whether you prefer: (A) remove the file from history, (B) use Git LFS, or (C) move the model to external storage. I can then provide exact step-by-step commands and help with rewriting history if you choose that path.
