# Requirement Review - Scaffold

This repository contains a scaffold for an internal Requirement Review Application using Angular (standalone components) and Tailwind.

Quick notes:
- Framework: Angular 18+ (standalone components & Signals)
- Styling: Tailwind CSS
- State: Angular Signals (no NgRx)

How to proceed locally:

1. Install Angular CLI globally if needed: `npm i -g @angular/cli`
2. Install dependencies: `npm install`
3. Start dev server: `npm start`

Files added (key):
- `src/main.ts` bootstrap
- `src/app/app.component.ts` root standalone component
- `src/app/features/*` Dashboard, List, Detail standalone components
- `src/app/services/requirements.service.ts` Signal-based state
- `src/app/models/requirement.ts` TypeScript interfaces
- `tailwind.config.cjs`, `postcss.config.cjs`, `src/styles.css`

Next recommended steps:
- Hook up Angular CLI project files (angular.json, tsconfig.json) or generate project with `ng new` and merge scaffolded files.
- Add unit/e2e tests and CI.
- Integrate Heroicons SVG assets and refine design tokens.
