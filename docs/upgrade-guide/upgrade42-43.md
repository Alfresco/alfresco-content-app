---
Title: Upgrading from ACA v4.2 to v4.3
---

# Upgrading from ACA v4.2 to v4.3

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v4.2.0 project to
v4.3.0.

This is a smaller release built on **ADF 6.3.0 → 6.4.0** (`@alfresco/js-api` 7.0.0 → 7.1.0, a minor bump). The main
ADF-driven change is completing the **moment → date-fns** move (ADF 6.4 dropped `moment`), and ACA **adopts several
new ADF 6.4 capabilities** (configurable document-list columns, custom metadata panels). Read the ADF guide
alongside this one:

- [ADF — Upgrading from v6.3 to v6.4](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade63-64.md)

Angular, Material, TypeScript, rxjs and the Node version are all **unchanged**. ACA's public library API
(`@alfresco/aca-shared` / `@alfresco/aca-content` entry points) is unchanged too — no exports were removed or
renamed — so most of this upgrade is dependency/config, not code. Read the [breaking changes](#breaking-changes).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Node 18 is still
required (unchanged).

## Contents

- [Library updates](#library-updates)
- [Aligning with ADF 6.4](#aligning-with-adf-64)
  - [moment removed (date-fns completion)](#moment-removed-date-fns-completion)
  - [Configurable document-list columns](#configurable-document-list-columns)
  - [Custom metadata side panels](#custom-metadata-side-panels)
  - [Folder-rules category autocomplete](#folder-rules-category-autocomplete)
- [Breaking changes](#breaking-changes)
  - [Nx 16 workspace migration](#nx-16-workspace-migration)
  - [Peer dependency ranges loosened](#peer-dependency-ranges-loosened)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.4.0",
        "@alfresco/adf-content-services": "6.4.0",
        "@alfresco/adf-extensions": "6.4.0",
        "@alfresco/js-api": "7.1.0"
    }
}
```

`@alfresco/adf-cli` and `@alfresco/adf-testing` move to `6.4.0` as well. Four **`moment`-related dependencies were
removed** — `moment`, `moment-es6`, `@angular/material-moment-adapter` and `@mat-datetimepicker/moment` — while
`@angular/material-date-fns-adapter`, `date-fns` and `@mat-datetimepicker/core` are retained. Angular (`14.1.3`),
TypeScript (`4.7.4`), rxjs (`6.6.6`) and Node (`.nvmrc` `18`) are unchanged. Clean `node_modules` and the lockfile,
then reinstall.

## Aligning with ADF 6.4

See the [ADF 6.3 → 6.4 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade63-64.md)
for the underlying changes.

### moment removed (date-fns completion)

ADF 6.4 completed its moment → date-fns migration and dropped `moment` as a runtime/peer dependency. ACA followed
suit and removed the `moment` family from `package.json` (see [Library updates](#library-updates)). ACA's own
library/component source was already date-fns-based, so the only code change was in e2e tests, which now format
dates through ADF's `DateFnsUtils.formatDate()` (from `@alfresco/adf-core`) instead of raw `date-fns`. If your fork
still imports `moment` (or the moment Material adapters) transitively via ACA/ADF, add them to your own
`package.json` or migrate to date-fns. (See ADF 6.4 → "Date handling (moment → date-fns)".)

### Configurable document-list columns

Adopting ADF 6.4's `DataColumn.isHidden` support, ACA added an `[isHidden]="column.isHidden"` binding to the
`data-column` definitions across its seven document lists (`files`, `favorites`, `favorite-libraries`,
`libraries`, `recent-files`, `shared-files`, `trashcan`), so columns can be shown/hidden. If you customise these
lists, carry the `isHidden` binding through.

### Custom metadata side panels

ACA adopts ADF 6.4's `ContentMetadataComponent` `@Input() customPanels` to let extensions contribute extra metadata
panels. This adds a new extension point (see [New components and features](#new-components-and-features)); the
metadata tab now binds `[customPanels]` on `adf-content-metadata-card`.

### Folder-rules category autocomplete

The Folder Rules "Has Category" condition gained an autocomplete backed by ADF's `CategoryService.searchCategories()`
(`@alfresco/adf-content-services`). Internally this added an `'auto-complete'` `RuleConditionFieldType`.

## Breaking changes

ACA's published library API is unchanged in this release (the `public-api.ts` of every `@alfresco/aca-shared` and
`@alfresco/aca-content` entry point is identical between 4.2.0 and 4.3.0 — no exports removed, renamed or newly
deprecated). The consumer-affecting changes are at the dependency/build level:

### Nx 16 workspace migration

The workspace moved to **Nx 16** and the Nx package scope was renamed **`@nrwl/*` → `@nx/*`** (`nx` / `@nx/angular`
/ `@nx/workspace` / `@nx/eslint-plugin` `16.10.0`). `nx.json`, `project.json`, `.eslintrc.json` and `tsconfig.json`
were rewritten accordingly. If you maintain a fork with custom Nx targets or `@nrwl/*` imports, migrate them to
`@nx/*` and run the Nx 16 migrations.

### Peer dependency ranges loosened

The published ACA libraries (`projects/aca-content`, `projects/aca-shared`) changed their `peerDependencies` from
caret ranges to `>=` (e.g. `@alfresco/adf-core` `^6.3.0` → `>=6.4.0`, `@alfresco/js-api` `>=7.0.0` → `>=7.1.0`, and
the `@angular/*` / `@ngx-translate/core` / `rxjs` / `zone.js` peers likewise). This mainly affects how versions
resolve when you install those packages.

## New components and features

- **Name-column badges** — extensions can add icon badges (with tooltip, and an optional custom component) to the
  document-list name column. New public `Badge` interface (`@alfresco/aca-shared`, `extends ContentActionRef` with
  a `tooltip`), a new `features.badges` block in `app.extensions.json` (a `badge` needs `id`, `icon`, `tooltip`,
  optional `component`), and a new `AppExtensionService.getBadges(node)` method.
- **Custom metadata side panels** — a new `features.customMetadataPanels` extension feature (array of
  `contentActionRef`) renders registered extension components as extra metadata panels, surfaced via the new
  `AppExtensionService.getCustomMetadataPanels(node)` method.
- **Configurable document-list columns** — see [Configurable document-list columns](#configurable-document-list-columns).
- **Breadcrumb navigation on the Details tab** — the Details page breadcrumb now navigates
  (`onBreadcrumbNavigate(path)` dispatching `NavigateToFolder`).

## Behavioural changes

| Area             | Change                                                                                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Info drawer      | The info drawer / Details tab now opens **over a custom file preview** — `PageComponent.infoDrawerOpened$` no longer suppresses the drawer while a viewer outlet is active.                |
| Library metadata | The library-metadata info-drawer was reworked into a single reactive form; update/cancel now reflect immediately in the UI, and renaming a library to a whitespace-only name is prevented. |
| Edit offline     | Toggling "edit offline" now reselects the node so dependent UI refreshes.                                                                                                                  |
| Icons            | Toolbar/info-drawer icons and button pressed/focus states were updated to match the current design (e.g. the info-drawer toggle icon `menu_open` → `view_sidebar`).                        |
