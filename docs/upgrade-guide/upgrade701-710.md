---
Title: Upgrading from ACA v7.0.1 to v7.1.0
---

# Upgrading from ACA v7.0.1 to v7.1.0

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v7.0.1 project to
v7.1.0.

This is a minor release on the Angular 19 / ADF 8 line: it moves **ADF 8.0.1 → 8.1.1** and `@alfresco/js-api`
9.0.1 → 9.1.1. Angular (19.2), Material, TypeScript (5.8), zone.js, NgRx (19.2) and Node (`.nvmrc` 22.14.0) are all
**unchanged** version-wise. The main consumer-facing work is a **provider-API migration** for extension
registration (finishing the standalone move started in 7.0.0) and an **NgRx API modernisation**. The corresponding
ADF guide is:

- [ADF — Upgrading from v8.0 to v8.1.1](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade80-811.md)

Read the [breaking changes](#breaking-changes).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. The Angular 19 /
TypeScript 5.8 platform and Node 22 (`.nvmrc`) are unchanged from 7.0.1.

## Contents

- [Library updates](#library-updates)
- [Aligning with ADF 8.1](#aligning-with-adf-81)
- [Breaking changes](#breaking-changes)
  - [Extension registration moved to the provider API](#extension-registration-moved-to-the-provider-api)
  - [NgRx API modernisation](#ngrx-api-modernisation)
  - [Build dependencies](#build-dependencies)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.1.1",
        "@alfresco/adf-content-services": "8.1.1",
        "@alfresco/adf-extensions": "8.1.1",
        "@alfresco/js-api": "9.1.1",
        "date-fns": "^4.1.0"
    }
}
```

`@alfresco/adf-cli` and `@alfresco/eslint-plugin-eslint-angular` move to `8.1.1` too. `date-fns` moves
`2.30.0 → 4.1.0` (a major bump — in ACA it is only used by the `@alfresco/aca-playwright-shared` test utilities),
`mermaid` `11.8 → 11.10`, and `nx` / `@nx/*` `21.2 → 21.3`. Angular (`19.2.6`), `@angular/material` (`19.2.9`),
TypeScript (`5.8.2`), `@ngrx/*` (`19.2.1`), zone.js (`0.15.0`) and Node (`.nvmrc` `22.14.0`) are unchanged. Clean
`node_modules` and the lockfile, then reinstall.

## Aligning with ADF 8.1

See the ADF [8.0 → 8.1.1 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade80-811.md)
for the underlying library changes. ACA simply consumes ADF `8.1.1` / js-api `9.1.1`; there is no ADF-driven
source migration required in ACA beyond adopting the versions.

## Breaking changes

### Extension registration moved to the provider API

ACA completed its move to Angular's provider API for extension registration (AAE-37293). The short-lived
`provideExtensions()` function that `@alfresco/aca-content` exported in 7.0.0 has been **removed**, along with the
`CoreExtensionsModule` (`core.extensions.module`) export. Extension registration now goes through:

- **`provideContentAppExtensions()`** — a new function exported from **`@alfresco/aca-shared`**, and
- your own application-level extensions provider (in ACA, `provideApplicationExtensions()` from
  `app/src/app/extensions.module.ts`).

```ts
// Before (7.0.x)
import { provideExtensions } from '@alfresco/aca-content';
// providers: [ …, provideExtensions() ]

// After (7.1.0)
import { provideContentAppExtensions } from '@alfresco/aca-shared';
// providers: [ …, provideContentAppExtensions(), provideApplicationExtensions() ]
```

Internally the content library now registers its components/guards through ADF's own
`provideExtensions` / `provideAppExtensions` (from `@alfresco/adf-extensions`). If your fork registered ACA
extensions via `provideExtensions()` from `@alfresco/aca-content` or imported `CoreExtensionsModule`, switch to
`provideContentAppExtensions()`.

### NgRx API modernisation

ACA's store was upgraded to the modern NgRx API (ACS-9911), including the effect and testing-module setup
(`app-testing.module` / `lib-testing-module` and the effects specs). If your fork extends ACA's effects or reuses
its testing modules, align them with the updated NgRx provider/testing API.

### Build dependencies

- **`@angular/cli` and `@schematics/angular` were removed** from `devDependencies` (AAE-37689) — the workspace
  builds through Nx executors, not the Angular CLI. If your fork invokes `ng` directly, add the CLI back to your
  own `devDependencies` or switch to the Nx equivalents.
- **`date-fns` moved `2 → 4`** (major). ACA only uses it in the Playwright test utilities, but if your fork uses
  `date-fns` directly, review the v3/v4 breaking changes.

## New components and features

- **`provideContentAppExtensions()`** (`@alfresco/aca-shared`) — the new provider-API entry point for registering
  ACA's content extensions (see [Extension registration moved to the provider API](#extension-registration-moved-to-the-provider-api)).
- **`noWhitespaceValidator`** (`@alfresco/aca-shared`) — a new reusable Angular form `ValidatorFn` that rejects
  whitespace-only input.
- **Current ACS version selector** (ACS-9907) — a new store selector in `@alfresco/aca-shared/store` exposes the
  current ACS repository version.

## Behavioural changes

| Area   | Change                                                                                                                                  |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Search | The search popup no longer flickers on Enter, and the infinite loading animation on the search results was fixed (ACS-9374 / ACS-9590). |
| Search | Search requests are no longer altered when the query uses quote marks (MNT-25070).                                                      |
