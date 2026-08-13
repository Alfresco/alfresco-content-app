---
Title: Upgrading from ACA v7.4.1 to v7.5.0
---

# Upgrading from ACA v7.4.1 to v7.5.0

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v7.4.1 project to
v7.5.0.

This is a minor release on the Angular 19 / ADF 8 line: it moves **ADF 8.4.1 → 8.5.0** and `@alfresco/js-api`
9.4.1 → 9.5.0. Angular (19.2), Node (`.nvmrc` 24.13.0), TypeScript, zone.js and NgRx are all **unchanged**. The
headline is the **Material Design 3 (MD3) migration** — the biggest source of visual change in this release — plus
a new **Link document** capability and multivalued-property support in folder rules. The corresponding ADF guide
is:

- [ADF — Upgrading from v8.4.1 to v8.5.0](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade841-850.md)

Because of the MD3 migration, budget time to re-audit any custom theme or Material style overrides. Read the
[breaking changes](#breaking-changes).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. The Angular 19 /
TypeScript 5.8 platform and Node 24 (`.nvmrc`) are unchanged from 7.4.1. Budget time to re-theme (MD3) and re-test.

## Contents

- [Library updates](#library-updates)
- [Aligning with ADF 8.5](#aligning-with-adf-85)
- [Breaking changes](#breaking-changes)
  - [Material Design 3 (MD3) migration](#material-design-3-md3-migration)
  - [minimatch-browser dependency removed](#minimatch-browser-dependency-removed)
  - [Library public API](#library-public-api)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.5.0",
        "@alfresco/adf-content-services": "8.5.0",
        "@alfresco/adf-extensions": "8.5.0",
        "@alfresco/js-api": "9.5.0"
    }
}
```

`@alfresco/adf-cli` and `@alfresco/eslint-plugin-eslint-angular` move to `8.5.0` too, and `mermaid` moves
`11.12 → 11.15`. The **`minimatch-browser`** runtime dependency was removed. Angular (`19.2.20`),
`@angular/material` (`19.2`), TypeScript (`5.8.2`), `@ngrx/*` (`19.2.1`), zone.js (`0.15.0`) and Node
(`.nvmrc` `24.13.0`) are unchanged. Clean `node_modules` and the lockfile, then reinstall.

## Aligning with ADF 8.5

See the ADF [8.4.1 → 8.5.0 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade841-850.md)
for the underlying library changes. Beyond adopting ADF `8.5.0` / js-api `9.5.0`, the ADF-aligned work in ACA is
the Material Design 3 theming migration below.

## Breaking changes

### Material Design 3 (MD3) migration

ACA (and ADW / ACC) migrated their theming to **Angular Material 3 (MD3)** — ACS-10449. This reworked the theme
across roughly 70 files: `theme.scss`, `custom-theme.scss`, `variables.scss`, the ADF override partials
(`adf-style-fixes.theme.scss`, `adf-variables.scss`, `adf-pagination.theme.scss`, …), new `mixins.scss` /
`mat-selectors.scss`, and many component SCSS files. MD3 changes Material's design tokens, component styling and
CSS custom properties.

**If your fork defines a custom theme or overrides Material component styles, you must re-audit them against MD3.**
This is the largest source of visual breakage in this upgrade.

### minimatch-browser dependency removed

The `minimatch-browser` runtime dependency was removed from `package.json`. If your fork imported it transitively
through ACA, add it to your own dependencies.

### Library public API

The published API is **additive** — `@alfresco/aca-content` now exports the **`NodeActionsService`** (ACS-9765),
which also gained *copy/move/link* support (see [New components and features](#new-components-and-features)). No
exports were removed or renamed.

> **Non-change (informational):** a change to how sharable links handle redirects to the login page (ACS-11861)
> was merged and then **reverted** before 7.5.0, so that behaviour is unchanged. No action is needed — this is only
> noted in case you diff the intermediate commits.

## New components and features

- **Link document** (MNT-25522) — you can now create a **link** to a document in another location. This adds a new
  node store action and extends the now-public `NodeActionsService`; linked nodes display `N/A` for size and number
  of files in the Information dialog.
- **`NodeActionsService`** (`@alfresco/aca-content`) — the copy / move / link service is now part of the public API
  (`copyNodes()`, `moveNodes()`, and the new link action), so extensions can drive those actions directly.
- **Folder rules — multivalued properties** (MNT-25149 / MNT-25558) — folder-rule property conditions and actions
  now support multivalued properties.

## Behavioural changes

| Area          | Change                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Accessibility | Focus is handled correctly after collapsing the sidenav menu (ACS-11350), and the info-drawer tabs show a proper focus indicator during keyboard navigation (ACS-11980). |
| Styling       | General style updates accompanied the MD3 migration (ACS-11158).                                                                                                         |
| Info dialog   | Links display `N/A` for size and number of files (MNT-25522).                                                                                                            |
