---
Title: Upgrading from ACA v7.2.0 to v7.3.0
---

# Upgrading from ACA v7.2.0 to v7.3.0

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v7.2.0 project to
v7.3.0.

This is a minor release on the Angular 19 / ADF 8 line: it moves **ADF 8.2.1 → 8.3.1** and `@alfresco/js-api`
9.2.1 → 9.3.1, and bumps **Node 22 → 24** (`.nvmrc` `24.13.0`). Angular stays on the 19.2 line (a patch bump from
`19.2.6` to `19.2.19`), and TypeScript, zone.js and NgRx are unchanged. The bulk of the release is a **large
accessibility pass**, plus the `adf-toolbar → mat-toolbar` migration, a generalised node **Information dialog**, and
search-query hardening. The corresponding ADF guide is:

- [ADF — Upgrading from v8.2.1 to v8.3.1](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade821-831.md)

Read the [breaking changes](#breaking-changes).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Update your
build/CI environment to **Node 24** (`.nvmrc` is now `24.13.0`); the Angular 19 / TypeScript 5.8 platform is
otherwise unchanged from 7.2.0.

## Contents

- [Library updates](#library-updates)
- [Aligning with ADF 8.3](#aligning-with-adf-83)
- [Breaking changes](#breaking-changes)
  - [Node 24](#node-24)
  - [adf-toolbar replaced with mat-toolbar](#adf-toolbar-replaced-with-mat-toolbar)
  - [Build — native Node env loader](#build--native-node-env-loader)
  - [Library public API](#library-public-api)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.3.1",
        "@alfresco/adf-content-services": "8.3.1",
        "@alfresco/adf-extensions": "8.3.1",
        "@alfresco/js-api": "9.3.1",
        "@angular/core": "19.2.19"
    }
}
```

The whole `@angular/*` toolchain moves to the `19.2.19` patch, `@alfresco/adf-cli` /
`@alfresco/eslint-plugin-eslint-angular` to `8.3.1`, and dev tooling advances (`@nx/*` `21 → 22`, `jasmine-core`
`5 → 6`, `@types/node` `18 → 25`, `eslint-plugin-playwright` `1 → 2`, `mermaid` `11.10 → 11.12`). **Node moves
22 → 24.13.0** (`.nvmrc`). `@ngx-translate/core` stays `^16.0.4` (see the note below), and TypeScript (`5.8.2`),
`@ngrx/*` (`19.2.1`) and zone.js (`0.15.0`) are unchanged. Clean `node_modules` and the lockfile, then reinstall.

> **Non-change (informational):** an `@ngx-translate/core` upgrade was attempted and **reverted** before 7.3.0
> (ACS-11213), so ngx-translate stays at `^16.0.4`. No action is needed — this is only noted in case you diff the
> intermediate commits.

## Aligning with ADF 8.3

See the ADF [8.2.1 → 8.3.1 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade821-831.md)
for the underlying library changes. ACA consumes ADF `8.3.1` / js-api `9.3.1`; the only notable source adaptation
is a refactor of `getChild` usage (ACS-11051) to match the js-api. If your fork calls the same js-api node methods,
review them against js-api 9.3.

## Breaking changes

### Node 24

The build now requires **Node 24** (`.nvmrc` `24.13.0`). Update your local toolchain, Docker base image and CI
runners; Node 22 is no longer the target.

### adf-toolbar replaced with mat-toolbar

ACA replaced ADF's `<adf-toolbar>` with Angular Material's `<mat-toolbar>` (ACS-10934, e.g. in the Manage Rules
screens). If your fork styles the `.adf-toolbar` / `.adf-toolbar--inline` DOM or depends on the ADF toolbar
component's markup, re-audit those styles against the Material toolbar.

### Build — native Node env loader

The build switched to Node 24's **native `.env` loader**, and `dotenv-expand` was removed as a dependency
(#4970). If your fork's scripts relied on `dotenv-expand`, move to the native `--env-file` mechanism.

### Library public API

The published API is **additive** — `@alfresco/aca-shared` gains a **`noLeadingTrailingOperatorsValidator`** form
validator (used to reject search queries with leading/trailing operators). No exports were removed or renamed.

## New components and features

- **Node Information dialog** (MNT-25478) — the earlier folder-information dialog was generalised into a node
  **Information dialog**, adding a new `location-link` component and a dialog for additional location references
  (for nodes that appear in more than one location).
- **Search-query validation** — a new `noLeadingTrailingOperatorsValidator` (ACS-10514) rejects queries with
  leading/trailing operators, and top-level filter management was added to the search filters (ACS-10083).

## Behavioural changes

| Area                | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accessibility       | A large screen-reader / keyboard / contrast pass landed — sidenav and snackbar now announce state, Esc no longer loses keyboard focus, headings and dropdown labels were corrected, folder-rules and bulk-actions controls were made SR-friendly, favourite add/remove is announced, and colour-contrast was improved in several places (ACS-10200 / 10201 / 10204 / 10217 / 10219 / 10226 / 10233 / 10283 / 10287 / 10293 / 10294 / 10307 / 10323 / 10885 / 10886 among others). |
| Search              | Leading and trailing operators in a query are now handled correctly (ACS-10514); the *Save Changes* button no longer becomes disabled after modifying the search or filter (ACS-10730); the loader is no longer shown for a nullish query (MNT-25408).                                                                                                                                                                                                                            |
| Sorting             | Sorting configured via the sorting key is now saved correctly in local storage (MNT-25276).                                                                                                                                                                                                                                                                                                                                                                                       |
| Knowledge Retrieval | The answer page now displays the response instead of a general error, with a workaround for the AI answer references id mapping (ACS-11033).                                                                                                                                                                                                                                                                                                                                      |
| Security            | Fixed an Angular i18n CSS vulnerability (PRODSEC-11289).                                                                                                                                                                                                                                                                                                                                                                                                                          |
