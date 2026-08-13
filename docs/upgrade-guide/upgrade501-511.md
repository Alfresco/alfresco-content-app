---
Title: Upgrading from ACA v5.0.1 to v5.1.1
---

# Upgrading from ACA v5.0.1 to v5.1.1

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v5.0.1 project to
v5.1.1 (there was no 5.1.0 release).

This is a small release on the ADF 7.0 alpha line: it moves **ADF 7.0.0-alpha.2 → 7.0.0-alpha.3** and
`@alfresco/js-api` 8.0.0-alpha.2 → 8.0.0-alpha.3. Angular (15.2), TypeScript (4.9), rxjs, Nx, zone.js and Node are
all **unchanged**. The work is adapting to the ADF alpha.3 **auth + js-api relocation** changes, plus adopting the
new **Knowledge Retrieval** feature. The relevant ADF guide is the **7.0.0-alpha.3** section of:

- [ADF — Upgrading from v6.9 to v7.0](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade69-70.md) (see the **7.0.0-alpha.3** section)

Read the [breaking changes](#breaking-changes).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Node 18
(`.nvmrc`) and the Angular 15 platform are unchanged from 5.0.1.

## Contents

- [Library updates](#library-updates)
- [Aligning with ADF 7.0-alpha.3](#aligning-with-adf-70-alpha3)
  - [AlfrescoApiService moved to adf-content-services](#alfrescoapiservice-moved-to-adf-content-services)
  - [Functional route guards](#functional-route-guards)
- [Breaking changes](#breaking-changes)
  - [aca-playwright-shared is now a published library](#aca-playwright-shared-is-now-a-published-library)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "7.0.0-alpha.3",
        "@alfresco/adf-content-services": "7.0.0-alpha.3",
        "@alfresco/adf-extensions": "7.0.0-alpha.3",
        "@alfresco/js-api": "8.0.0-alpha.3"
    }
}
```

`@alfresco/adf-cli` moves to `7.0.0-alpha.3` too. Angular (`15.2.10`), `@angular/material` (`15.2.9`), TypeScript
(`4.9.5`), rxjs (`6.6.6`), Nx (`17.3.1`), zone.js (`0.11.8`) and Node (`.nvmrc` `18`) are unchanged. Clean
`node_modules` and the lockfile, then reinstall.

## Aligning with ADF 7.0-alpha.3

See the **7.0.0-alpha.3** section of the ADF
[6.9 → 7.0 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade69-70.md)
("Auth and js-api relocation") for the underlying changes.

### AlfrescoApiService moved to adf-content-services

ADF alpha.3 moved `AlfrescoApiService` (and `AlfrescoApiServiceMock`) from `@alfresco/adf-core` to
`@alfresco/adf-content-services`. ACA updated all its imports accordingly:

```ts
// Before
import { AlfrescoApiService } from '@alfresco/adf-core';

// After
import { AlfrescoApiService } from '@alfresco/adf-content-services';
```

Update this import wherever your fork or extensions use it. (See ADF 7.0.0-alpha.3 → "`AlfrescoApiService` moved
from `@alfresco/adf-core` to `@alfresco/adf-content-services`".)

### Functional route guards

Following ADF's move to functional route guards (the `AuthGuardBase` class was deleted and the guards became
`CanActivateFn` values), ACA converted its own guards to the functional pattern
(`view-profile.guard`, `plugin-enabled.guard`, `shared.guard`, and the `extensions-data-loader.guard`). If your
fork subclasses ACA guards or references them as injectable classes, migrate to the functional form. (See ADF
7.0.0-alpha.3 → "Auth route guards are now functional `CanActivateFn` values".)

## Breaking changes

ACA's `@alfresco/aca-shared` and `@alfresco/aca-content` root public APIs are unchanged in this release (no exports
removed or renamed). The consumer-facing changes are the ADF import move above and the test-library packaging
change below.

### aca-playwright-shared is now a published library

`projects/aca-playwright-shared` became a **buildable, publishable Angular library** (it gained `ng-package.json`
and `package.json` and is exported for consumers). If you wrote Playwright e2e tests against ACA, you can now
import the shared Playwright helpers from the published `@alfresco/aca-playwright-shared` package instead of a
relative source path.

## New components and features

- **Knowledge Retrieval (AI)** — a new feature that returns an AI response for one or more selected files, adopting
  ADF alpha.3's Knowledge Retrieval / `AgentService` / `SearchAiService`. It adds an `agents-button` and a
  `search-ai-input-container` component, and can be **toggled in the Docker image** via a runtime env var.

## Behavioural changes

| Area          | Change                                                                   |
| ------------- | ------------------------------------------------------------------------ |
| Document list | The list refreshes after a file version is restored.                     |
| Selection     | An error page is shown when an action is invoked with no nodes selected. |
| Extensions    | Visibility rules now accept arrays (documented).                         |
| Search        | The current location is passed as a query parameter.                     |
