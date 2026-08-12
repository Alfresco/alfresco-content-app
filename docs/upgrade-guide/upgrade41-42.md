---
Title: Upgrading from ACA v4.1 to v4.2
---

# Upgrading from ACA v4.1 to v4.2

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v4.1.0 project to
v4.2.0.

The headline of this release is the **ADF 6.2.0 → 6.3.0** bump and, with it, the **`@alfresco/js-api` 6.2.0 → 7.0.0
(major)** upgrade. The bulk of the work is **adapting to the ADF 6.3 / js-api v7 breaking changes** — read the ADF
guide alongside this one:

- [ADF — Upgrading from v6.2 to v6.3](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade62-63.md)

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. The steps below
involve code and configuration changes — commit or back up your work first. Node 18 is still required (unchanged
from 4.1.0).

## Contents

- [Library updates](#library-updates)
- [Aligning with ADF 6.3 / js-api v7](#aligning-with-adf-63--js-api-v7)
  - [js-api v7 type migration](#js-api-v7-type-migration)
  - [Compatibility mode removed](#compatibility-mode-removed)
  - [Advanced search widgets](#advanced-search-widgets)
  - [Content metadata editable binding](#content-metadata-editable-binding)
  - [Breadcrumbs replaced by page headings](#breadcrumbs-replaced-by-page-headings)
  - [i18n resources moved to ADF](#i18n-resources-moved-to-adf)
- [Breaking changes](#breaking-changes)
  - [Viewer and preview moved to aca-content entry points](#viewer-and-preview-moved-to-aca-content-entry-points)
  - [aca-shared exports](#aca-shared-exports)
  - [Docker and environment-variable overhaul](#docker-and-environment-variable-overhaul)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.3.0",
        "@alfresco/adf-content-services": "6.3.0",
        "@alfresco/adf-extensions": "6.3.0",
        "@alfresco/js-api": "7.0.0",
        "@angular/material-date-fns-adapter": "14.1.3"
    }
}
```

`@alfresco/adf-cli` and `@alfresco/adf-testing` move to `6.3.0` as well. A new dependency,
`@angular/material-date-fns-adapter`, is required by ADF's date-fns-based advanced date-range search widget.
Angular (`14.1.3`), TypeScript (`4.7.4`), rxjs (`6.6.6`) and Node (`.nvmrc` `18`) are unchanged. Clean
`node_modules` and the lockfile, then reinstall.

## Aligning with ADF 6.3 / js-api v7

Most of this release adapts ACA to the ADF 6.3 breaking changes — driven largely by the `@alfresco/js-api` v7
major. See the [ADF 6.2 → 6.3 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade62-63.md)
for the underlying details.

### js-api v7 type migration

js-api v7 renamed its model types, and ACA migrated to them app-wide (across `aca-content` and `aca-shared`):

| Before (js-api v6)       | After (js-api v7)    |
| ------------------------ | -------------------- |
| `MinimalNodeEntity`      | `NodeEntry`          |
| `MinimalNodeEntryEntity` | `Node`               |
| `PathElementEntity`      | `PathElement`        |
| `SiteBody`               | `SiteBodyCreate`     |
| `FavoriteBody`           | `FavoriteBodyCreate` |

This changes some **public** ACA surfaces, so extension authors must adapt:

- **NgRx action payloads** (`@alfresco/aca-shared/store`, `node.actions.ts`) — copy/move/delete/share/favorite
  action types changed from `MinimalNodeEntity[]` / `MinimalNodeEntity` to `NodeEntry[]` / `NodeEntry`.
- **`ContentApiService`** (`@alfresco/aca-shared`) method signatures — e.g. `getNode()` / `restoreNode()` now
  return `Observable<NodeEntry>`, `unlockNode()` returns `Promise<NodeEntry>`, `addFavorite()` / `removeFavorite()`
  take `Array<NodeEntry>`, and `updateLibrary(siteId, siteBody: SiteBodyCreate)`.

Update your own type references accordingly. (See ADF 6.3 → "JS-API v7 and type migrations".)

### Compatibility mode removed

`AlfrescoApiCompatibility` was removed in js-api v7; ACA dropped its use (test utilities now use `AlfrescoApi` /
`NodesApi` / `UploadApi` directly, and the Playwright/API wrappers were refactored onto the v7 model classes, e.g.
`Site.VisibilityEnum.PUBLIC`). If your code referenced `AlfrescoApiCompatibility`, migrate to `AlfrescoApi`.
(See ADF 6.3 → "Removed and hidden items".)

### Advanced search widgets

ACA adopted the ADF 6.3 advanced-search widgets in `projects/aca-content/assets/app.extensions.json` /
`app/src/app.config.json`:

- **Created & Modified date filters merged** into one `date-range-advanced` widget (id `createdModifiedDateRange`,
  `field: "cm:created,cm:modified"`); the date format token changed `DD-MMM-YY` → **`dd-MMM-yy`** (moment →
  date-fns).
- The size / file-type facets were replaced by the new **`properties`** widget (`field: "content.size,cm:name"`).
- The **SITE** and **Categories** facets switched to the `autocomplete-chips` widget using the new
  **`autocompleteOptions`** object model (`[{ "value": "_REPOSITORY_" }]`) instead of plain string `options`.
- New styles for the tabbed facet component (`.adf-search-filter-chip-tabbed`).

If you customised the search configuration, reconcile it against the new `app.extensions.json`. (See ADF 6.3 →
"Advanced search" and "Search API changes".)

### Content metadata editable binding

The metadata tab now uses ADF 6.3's two-way `[(editable)]` binding on `adf-content-metadata-card`, and resets the
editable state to `false` when a node is locked (reacting to the `EditOffline` store action). If you extend the
metadata tab, adopt the two-way binding.

### Breadcrumbs replaced by page headings

Following ADF's breadcrumb rework (breadcrumbs moved to the `@alfresco/adf-core/breadcrumbs` secondary entry
point), ACA **replaced the `<adf-breadcrumb>` on its list pages with an `<h1 class="aca-page-title">` heading**
(favorites, libraries, recent-files, shared-files, trashcan, details, etc.). Any code or test targeting the
`adf-breadcrumb` selector on those pages must be updated.

### i18n resources moved to ADF

The join-library message keys (`APP.MESSAGES.ERRORS.JOIN_REQUEST_FAILED` / `JOIN_CANCEL_FAILED` /
`INVALID_SENDER_EMAIL` / `INVALID_RECEIVER_EMAIL`, and `JOINED` / `JOIN_REQUESTED` / `JOIN_CANCELED`) were removed
from ACA's locale files — they are now provided by ADF 6.3. If you overrode these keys, re-source them from ADF.

## Breaking changes

### Viewer and preview moved to aca-content entry points

The standalone `@alfresco/aca-viewer` and `@alfresco/aca-preview` packages were removed and became **secondary
entry points of `@alfresco/aca-content`**. The exported symbols are unchanged — only the import path:

| Package | Before (v4.1.0)         | After (v4.2.0)                  |
| ------- | ----------------------- | ------------------------------- |
| Viewer  | `@alfresco/aca-viewer`  | `@alfresco/aca-content/viewer`  |
| Preview | `@alfresco/aca-preview` | `@alfresco/aca-content/preview` |

### aca-shared exports

The standalone-component migration reshaped `@alfresco/aca-shared`'s public surface:

- **Toolbar components moved** from `.../components/tool-bar/...` to `.../components/toolbar/...` — deep imports
  into the old `tool-bar` path break (the package-root exports still resolve, only the deep path changed).
- **Removed exports:** `OpenInAppModule` (the `OpenInAppComponent` is still exported — import the standalone
  component), and `AlfrescoOfficeExtensionService` (plugin handling moved into the rules engine).
- `SharedModule` and `SharedToolbarModule` were moved under `aca-shared/src/lib/deprecated/` and marked
  `@deprecated` backward-compat shims — import the standalone components/directives directly.

### Docker and environment-variable overhaul

The ACA Docker image was reworked (epic `ACA-4715`). If you run the published image or build your own, note:

- **`envsubst` templating was removed.** `app/src/app.config.json.tpl` was renamed to `app.config.json` with ADF
  runtime tokens (`{protocol}//{hostname}{:port}`) and hard-coded defaults; a new entrypoint
  (`docker/docker-entrypoint.d/30-sed-on-appconfig.sh`) patches a **curated set of ~14 runtime env vars** via `sed`.
- **Env vars that are no longer applied at runtime** (plugin toggles, viewer / download-prompt, mobile-app-switch,
  session-timeout, etc.) now use fixed defaults and are **silently ignored** if passed — set them in your own
  `app.config.json` instead.
- The `--build-arg PROJECT_NAME` was removed (the image is wired to `dist/content-ce`), and the
  `envsub` / `assemble-app-config` / `prebuild` / `prestart` / `validate-app-config` npm scripts were deleted.

See the new `docs/getting-started/docker.md` for the current setup.

## New components and features

- **Standalone components** — a large migration converted the `aca-shared` component library to Angular standalone
  (dropping most `CoreModule` usage); this is the source of the module-export removals above.
- **Improved plugin handling** — plugin enable/disable moved into the rules engine (`app.rules.ts`); the About
  dialog's plugins section was fixed.

## Behavioural changes

| Area           | Change                                                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| File lists     | Row checkboxes are hidden by default in the Files and Trashcan lists (`[multiselect]="false"`; selection mode stays `multiple`).         |
| Document list  | The filter header is now retained when query params are present.                                                                         |
| Security marks | The files document-list preset is now reactive (`filesDocumentListPreset$`), fixing incorrect initial loading of security-marks columns. |
| Styling        | `!important` was removed from ACA style overrides (lint-enforced) — re-check custom styles that relied on the old cascade.               |
| Security       | Incomplete string-escaping in toolbar selectors was hardened (regex escaping).                                                           |
