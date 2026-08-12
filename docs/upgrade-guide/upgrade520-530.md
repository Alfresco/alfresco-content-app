---
Title: Upgrading from ACA v5.2 to v5.3
---

# Upgrading from ACA v5.2 to v5.3

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v5.2.0 project to
v5.3.0.

This is a small maintenance release on the ADF 7.0 alpha line: it moves **ADF 7.0.0-alpha.6 → 7.0.0-alpha.7** and
`@alfresco/js-api` 8.0.0-alpha.6 → 8.0.0-alpha.7, bumps **rxjs 7.5.7 → 7.8.1** and patches
`@angular-devkit/build-angular` (16.2.9 → 16.2.16). Angular (16.2.9), Material (16.2.9), TypeScript (5.0.4),
zone.js (0.13.3), Nx (17.3.1) and Node (`.nvmrc` 18) are all **unchanged**. Most of ADF's alpha.7 changes are
`process-services-cloud` only and do not affect ACA, so the work this cycle is mostly ACA's own fixes and a few new
capabilities. The corresponding ADF guide is the **7.0.0-alpha.7** section of:

- [ADF — Upgrading from v6.9 to v7.0](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade69-70.md) (see the **7.0.0-alpha.7** section)

Read the [breaking changes](#breaking-changes).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. The Angular 16 /
TypeScript 5 platform and Node 18 (`.nvmrc`) are unchanged from 5.2.0.

## Contents

- [Library updates](#library-updates)
- [Aligning with ADF 7.0-alpha.7](#aligning-with-adf-70-alpha7)
- [Breaking changes](#breaking-changes)
  - [Required component inputs](#required-component-inputs)
  - [DeleteNodesAction gained an allowUndo argument](#deletenodesaction-gained-an-allowundo-argument)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "7.0.0-alpha.7",
        "@alfresco/adf-content-services": "7.0.0-alpha.7",
        "@alfresco/adf-extensions": "7.0.0-alpha.7",
        "@alfresco/js-api": "8.0.0-alpha.7",
        "rxjs": "7.8.1"
    }
}
```

`@alfresco/adf-cli` and `@alfresco/eslint-plugin-eslint-angular` move to `7.0.0-alpha.7` too, and
`@angular-devkit/build-angular` moves `16.2.9 → 16.2.16` (a Vite security bump). Angular (`16.2.9`),
`@angular/material` (`16.2.9`), TypeScript (`5.0.4`), zone.js (`0.13.3`), `nx` (`17.3.1`) and Node (`.nvmrc` `18`)
are unchanged. Clean `node_modules` and the lockfile, then reinstall.

## Aligning with ADF 7.0-alpha.7

See the **7.0.0-alpha.7** section of the ADF
[6.9 → 7.0 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade69-70.md)
for the full detail. ADF alpha.7 is dominated by the **`process-services-cloud` standalone migration and removals**
(Start-Task-Cloud components, several process-cloud pipes/directives and NgModules, identity DI tokens) — **none of
which apply to ACA**, which does not depend on `@alfresco/adf-process-services-cloud`. The only cross-cutting
alpha.7 items are that ADF's `@alfresco/adf-core` peers were pinned to **exact Angular 16.2.9** (ACA already tracks
16.2.9, so no change) and that `@alfresco/adf-testing` was removed (ACA dropped that dependency back in 4.4.1). In
practice this ADF bump is drop-in for ACA.

## Breaking changes

ACA's published library API is effectively unchanged this release — every `@alfresco/aca-shared` and
`@alfresco/aca-content` `public-api.ts` barrel is byte-identical between 5.2.0 and 5.3.0 (no exports added, removed
or renamed). The two consumer-facing changes below are signature-level.

> **Non-change (informational):** a migration of Saved Searches from the config file to the preferences API
> (ACS-9166) was merged and then **reverted** before 5.3.0, so Saved Searches storage is unchanged from 5.2.0. No
> action is needed — this is only noted in case you diff the intermediate commits.

### Required component inputs

Following Angular 16's required-inputs feature, several component `@Input()`s were marked
`@Input({ required: true })`. Two are on **exported `@alfresco/aca-shared` components**:

- `ToolbarComponent` — `items` is now required.
- `InfoDrawerComponent` — its primary input is now required.

(Others were applied to internal components: `rule-list` / `rule-list-item`, `datatable-cell-badges`,
`search-results-row`, and the sidenav `button-menu` / `expand-menu`.) If your fork or extension instantiates any of
these components in a template **without binding the now-required input, the Angular compiler will error**
(`NG8008`). Bind the input, or remove the usage.

### DeleteNodesAction gained an allowUndo argument

`DeleteNodesAction` (exported from `@alfresco/aca-shared/store`) and
`ContentManagementService.deleteNodes()` gained a second parameter, `allowUndo`, defaulting to `true`:

```ts
// aca-shared/store
new DeleteNodesAction(payload /* , allowUndo = true */);

// content-management.service
deleteNodes(items: NodeEntry[], allowUndo = true): void;
```

This is backward-compatible (the new argument is optional and preserves the previous behaviour). Pass
`allowUndo: false` to delete without offering the **Undo** snackbar action.

## New components and features

- **Folder information dialog** (MNT-24575) — a new dialog that displays folder details (retrieved via API, with a
  retry on failure). It is not offered for items in the trashcan.
- **Suppressible delete-undo** (ACS-8604) — see
  [DeleteNodesAction gained an allowUndo argument](#deletenodesaction-gained-an-allowundo-argument); callers can now
  delete nodes without the Undo snackbar.
- **`takeUntilDestroyed` subscription cleanup** (ACS-8959) — ACA adopted Angular's `takeUntilDestroyed` operator
  (with `DestroyRef`) across the folder-rules components and several `aca-content` components, replacing manual
  `ngOnDestroy` / `takeUntil(Subject)` teardown. This is an internal refactor, but if your fork subclasses these
  components or relied on their destroy `Subject`s, adopt the same pattern.

## Behavioural changes

| Area           | Change                                                                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Search input   | The search input is now a reactive form control that disallows certain special characters (showing a validation error) and rewrites a leading `text:` to `TEXT:` on submit rather than erroring. |
| Search results | A loading spinner is now shown on the search-results page while filtering for files or folders.                                                                                                  |
| Libraries      | The context menu is no longer empty when multiple libraries are selected; the *Join library* option now shows the correct icon.                                                                  |
| Breadcrumb     | The file title in the breadcrumb now updates after the file is renamed.                                                                                                                          |
| Sidenav        | The `expandedSidenav` flag is removed from local storage on logout.                                                                                                                              |
| Info drawer    | Tag styling is applied to tags shown in the info drawer.                                                                                                                                         |
| Saved searches | Long saved-search descriptions are truncated.                                                                                                                                                    |
