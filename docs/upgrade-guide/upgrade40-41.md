---
Title: Upgrading from ACA v4.0 to v4.1
---

# Upgrading from ACA v4.0 to v4.1

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v4.0.0 project to
v4.1.0.

The headline of this release is the **ADF platform bump from 6.0.0 to 6.2.0** (and `@alfresco/js-api` 6.0.0 → 6.2.0).
Because that spans **two** ADF releases, most of the required work in this upgrade is **adapting to the breaking
changes ADF introduced in 6.1 and 6.2** — read those two ADF guides alongside this one:

- [ADF — Upgrading from v6.0 to v6.1](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade60-61.md)
- [ADF — Upgrading from v6.1 to v6.2](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade61-62.md)

Angular is a patch bump only (`14.1.2` → `14.1.3`), but the **Node requirement moved to 18**. On the ACA side the
most significant change is that three bundled extensions (**About**, **MS-Office/AOS**, **Folder Rules**) became
**secondary entry points of `@alfresco/aca-content`**, changing their import paths. Read the
[breaking changes](#breaking-changes) carefully.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. The steps below
involve code and configuration changes — commit or back up your work first.

**Node 18 is now required.** ACA's pinned Node version (`.nvmrc`) moved from **14** to **18**; move your build/CI
to Node 18 before upgrading. (This matches the ADF 6.1 Node bump.)

## Contents

- [Library updates](#library-updates)
- [Aligning with ADF 6.1 / 6.2](#aligning-with-adf-61--62)
  - [ADF / js-api versions and caret ranges](#adf--js-api-versions-and-caret-ranges)
  - [Angular Flex-Layout removed](#angular-flex-layout-removed)
  - [Shared-link dialog is date-only](#shared-link-dialog-is-date-only)
  - [Advanced search widgets](#advanced-search-widgets)
  - [Theming — remove CSS variables that ADF now provides](#theming--remove-css-variables-that-adf-now-provides)
  - [Fonts are now published packages](#fonts-are-now-published-packages)
  - [Standalone components, `inject()` and view encapsulation](#standalone-components-inject-and-view-encapsulation)
- [Breaking changes](#breaking-changes)
  - [Extensions moved to `aca-content` secondary entry points](#extensions-moved-to-aca-content-secondary-entry-points)
  - [AcaAboutModule no longer uses forRoot](#acaaboutmodule-no-longer-uses-forroot)
  - [aca-shared exports](#aca-shared-exports)
  - [Removed plugins and components](#removed-plugins-and-components)
  - [Changed automation ids](#changed-automation-ids)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.2.0",
        "@alfresco/adf-content-services": "6.2.0",
        "@alfresco/adf-extensions": "6.2.0",
        "@alfresco/js-api": "6.2.0",
        "@angular/core": "14.1.3"
    }
}
```

`@alfresco/adf-cli` and `@alfresco/adf-testing` move to `6.2.0` as well. Two vendored assets became real
dependencies — `material-icons` (`^1.13.8`) and `@fontsource/open-sans` (`^5.0.3`) — and `@angular/flex-layout`
was **removed** (see below). Clean `node_modules` and the lockfile, then reinstall on Node 18.

## Aligning with ADF 6.1 / 6.2

Most of this release is adapting ACA to the breaking changes ADF shipped across 6.1 and 6.2. Each item below links
back to the ADF guide that describes the underlying change.

### ADF / js-api versions and caret ranges

`@alfresco/adf-*` and `@alfresco/js-api` moved from exact pins to **caret ranges** in the ACA libraries'
`peerDependencies` (e.g. `>=6.0.0` / exact pin → `^6.1.0-0`), mirroring the ADF 6.1 change. If you maintain a fork
with its own `package.json` pins, switch to caret ranges so a compatible `6.x` build resolves.
(See ADF 6.1 → "`@alfresco/js-api` and ADF peers use a caret range".)

### Angular Flex-Layout removed

`@angular/flex-layout` was removed from ACA's `package.json` (root, `aca-shared`, `folder-rules`), following its
removal from the ADF libraries. Any spec/code importing `CoreModule` from `@angular/flex-layout` was repointed to
`@alfresco/adf-core`. If your fork used flex-layout only transitively via ADF/ACA, add it to your own
`package.json`, or migrate those templates off `fxLayout`/`fxFlex`.
(See ADF 6.1 → "Angular Flex-Layout removed".)

### Shared-link dialog is date-only

ADF 6.2 changed the share-link expiry control to a **date-only** picker and stopped reading the
`sharedLinkDateTimePickerType` app-config key. ACA removed that key from `app.config.json` accordingly
(`"sharedLinkDateTimePickerType": "datetime"` deleted from `app/src/app.config.json.tpl`). Remove it from any
custom `app.config.json`.
(See ADF 6.2 → "Share dialog: expiry is now date-only".)

### Advanced search widgets

ACA adopted the new ADF search widgets in `projects/aca-content/assets/app.extensions.json`:

- The **logical filter** (`"selector": "logical-filter"`) was wired into the search configuration.
- The **Tags** and **Location** filters switched to the new `autocomplete-chips` widget (`field: "TAG"` with
  `allowOnlyPredefinedValues: true`; `field: "SITE"` with `options: ["_REPOSITORY_"]`).
- Several **facets were converted to filters** using the new search-filter widget model, and unused i18n keys were
  dropped.

If you customised ACA's search configuration, reconcile it against the new `app.extensions.json` search block.
(See ADF 6.1/6.2 → new `logical-filter` / `autocomplete-chips` search widgets.)

### Theming — remove CSS variables that ADF now provides

ADF 6.2 exposes component styling through `--adf-*` CSS custom properties. ACA deleted its redundant local
`--theme-*` overrides that ADF now provides by default (in `adf-about.theme.scss`, `adf-pagination.theme.scss`
and `variables.scss`). If your fork re-declared any of those `--theme-*` variables, drop them and theme through
the ADF `--adf-*` properties instead.
(See ADF 6.2 → theme changes / new `--adf-*` custom properties.)

### Fonts are now published packages

The vendored **Material Icons** and **Open Sans** fonts were removed from `app/src/assets/fonts/` and replaced by
the published packages `material-icons` and `@fontsource/open-sans`, imported from `styles.scss`. `AppModule` now
injects `MatIconRegistry` and calls `setDefaultFontSetClass('material-icons-outlined')`. If your fork vendored
these fonts, switch to the packages.
(See ADF 6.1 → material-icons externalised to the published package.)

### Standalone components, `inject()` and view encapsulation

Aligning with ADF 6.2's `inject()` refactor and standalone direction, ACA:

- flattened component/service constructors, removing now-unused injections (`Optimise injections and imports`);
- migrated a number of modules/components to **standalone**;
- enforced `ViewEncapsulation.None` across components via a new lint rule
  (`@alfresco/eslint-angular/use-none-component-view-encapsulation`) so `--adf-*` design tokens cascade correctly.

If you subclass ACA components or rely on their emulated encapsulation, re-check your styles.

## Breaking changes

### Extensions moved to `aca-content` secondary entry points

The three bundled extensions are no longer separate packages — they are **secondary entry points of
`@alfresco/aca-content`**. Update the imports in your `extensions.module.ts` (and `package.json`):

| Extension       | Before (v4.0.0)                     | After (v4.1.0)                       |
| --------------- | ----------------------------------- | ------------------------------------ |
| Folder Rules    | `@alfresco/aca-folder-rules`        | `@alfresco/aca-content/folder-rules` |
| MS-Office (AOS) | `@alfresco/adf-office-services-ext` | `@alfresco/aca-content/ms-office`    |
| About           | `@alfresco/aca-about`               | `@alfresco/aca-content/about`        |

### AcaAboutModule no longer uses forRoot

`AcaAboutModule.forRoot(...)` was removed. Import the module directly and supply the former `forRoot` arguments
through the new injection tokens `DEV_MODE_TOKEN` and `PACKAGE_JSON` (exported from `@alfresco/aca-content/about`):

```ts
// Before (v4.0.0)
import { AcaAboutModule } from '@alfresco/aca-about';
// ...
imports: [ AcaAboutModule.forRoot(environment.production, packageJson) ]

// After (v4.1.0)
import { AcaAboutModule, DEV_MODE_TOKEN, PACKAGE_JSON } from '@alfresco/aca-content/about';
// ...
imports: [ AcaAboutModule ],
providers: [
    { provide: DEV_MODE_TOKEN, useValue: !environment.production },
    { provide: PACKAGE_JSON, useValue: packageJson }
]
```

### aca-shared exports

`@alfresco/aca-shared` changed its public surface (standalone migration):

- **Removed** module exports: `LockedByModule`, `GenericErrorModule`, `SharedInfoDrawerModule`
  (`locked-by.module`, `generic-error.module`, `info-drawer/shared-info-drawer.module`). Import the now-standalone
  components directly instead of the modules.
- **Added** exports: the new `OpenInAppComponent` / `OpenInAppModule` (`components/open-in-app`).

`@alfresco/aca-shared/rules` and `@alfresco/aca-shared/store` are unchanged.

### Removed plugins and components

- The internal plugin assets `app.debug.json`, `app.metadata.json` and `app.search.json` were removed, along with
  the `DocumentDisplayModeComponent` (and its toolbar entry). If you referenced these, remove the references.
- The unused `create-menu` component was deleted.

### Changed automation ids

Some non-unique `data-automation-id`s were disambiguated — update any e2e selectors that relied on the old values:

- Toolbar menu item title `menu-item-title` split into `mat-button-menu-item-title` and
  `mat-flat-button-menu-item-title`.
- The search button locator changed from `.app-search-button` to the scoped `aca-search-input .app-search-button`.

## New components and features

- **Open in App dialog** — a new `OpenInAppComponent` (`@alfresco/aca-shared`) prompts users to open content in the
  mobile app; shown after login and for private files.
- **Multi-select** enabled for the Files and Trashcan views.
- **User initials** displayed for the current user.
- New **filter-state** styles and a facets-section UI refresh.

## Behavioural changes

| Area         | Change                                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Navigation   | Navigation behaviour was reworked to improve the user experience.                                                           |
| Search input | Several search-input bugs were fixed.                                                                                       |
| Performance  | Template function calls were replaced with variable references (change-detection cost); the thumbnail column was optimised. |
| Libraries    | Library-details styles are no longer lost after refreshing the page.                                                        |
| Security     | An insecure-randomness issue was fixed.                                                                                     |
