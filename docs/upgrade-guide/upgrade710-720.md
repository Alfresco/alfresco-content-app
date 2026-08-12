---
Title: Upgrading from ACA v7.1.0 to v7.2.0
---

# Upgrading from ACA v7.1.0 to v7.2.0

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v7.1.0 project to
v7.2.0.

This is a minor release on the Angular 19 / ADF 8 line: it moves **ADF 8.1.1 → 8.2.1** and `@alfresco/js-api`
9.1.1 → 9.2.1. Angular (19.2), Material, TypeScript (5.8), zone.js, NgRx (19.2) and Node (`.nvmrc` 22.14.0) are
**unchanged**. Despite being a minor bump, it carries a few consumer-facing items: an **OAuth config change**,
**ADF removed from the libraries' peer dependencies**, the continuation of the **ADF → ACA theming decoupling**,
new **All Libraries** and **custom user-profile-section** capabilities, and a large **accessibility** pass. The
corresponding ADF guide is:

- [ADF — Upgrading from v8.1.1 to v8.2.1](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade811-821.md)

Read the [breaking changes](#breaking-changes).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. The Angular 19 /
TypeScript 5.8 platform and Node 22 (`.nvmrc`) are unchanged from 7.1.0.

## Contents

- [Library updates](#library-updates)
- [Aligning with ADF 8.2](#aligning-with-adf-82)
- [Breaking changes](#breaking-changes)
  - [OAuth configuration — secret field removed](#oauth-configuration--secret-field-removed)
  - [ADF removed from library peer dependencies](#adf-removed-from-library-peer-dependencies)
  - [Theme variables moved from ADF to ACA](#theme-variables-moved-from-adf-to-aca)
  - [Deprecated API and module cleanup](#deprecated-api-and-module-cleanup)
  - [Library public API](#library-public-api)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.2.1",
        "@alfresco/adf-content-services": "8.2.1",
        "@alfresco/adf-extensions": "8.2.1",
        "@alfresco/js-api": "9.2.1"
    }
}
```

`@alfresco/adf-cli` and `@alfresco/eslint-plugin-eslint-angular` move to `8.2.1` too. Dev tooling advances
(`nx` / `@nx/*` `21.3 → 21.5`, `@playwright/test` `1.53 → 1.56`, `jasmine-core` `4.6 → 5.12`, `dotenv` `16 → 17`),
a `webpack-bundle-analyzer` devDependency and several `ci:*` npm scripts were added. Angular (`19.2.6`),
`@angular/material` (`19.2.9`), TypeScript (`5.8.2`), `@ngrx/*` (`19.2.1`), zone.js (`0.15.0`) and Node
(`.nvmrc` `22.14.0`) are unchanged. Clean `node_modules` and the lockfile, then reinstall.

## Aligning with ADF 8.2

See the ADF [8.1.1 → 8.2.1 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade811-821.md)
for the underlying library changes. Beyond adopting ADF `8.2.1` / js-api `9.2.1`, the ADF-driven work in ACA is the
**theming decoupling** below — ACA now owns the theme variables it previously inherited from ADF.

## Breaking changes

### OAuth configuration — secret field removed

The empty **`secret`** field was removed from the OAuth2 block of `app.config.json` across ADF / ACA / ADW
(ACS-10592). Remove `oauth2.secret` from any custom `app.config.json`.

### ADF removed from library peer dependencies

`@alfresco/adf-*` was **removed from the `peerDependencies`** of ACA's published libraries (`@alfresco/aca-shared`,
`@alfresco/aca-content`) — AAE-37857. Consuming projects are now responsible for declaring and aligning their own
ADF versions; ACA no longer pins them for you.

### Theme variables moved from ADF to ACA

Continuing the theming decoupling, ACA now defines locally the theme variables it previously inherited from ADF
(ACS-10448 added `projects/aca-content/src/lib/ui/overrides/adf-variables.scss`). If your fork relied on ADF theme
variables being provided transitively through ACA, re-audit your SCSS against the new ACA-owned variables.

### Deprecated API and module cleanup

ACA removed deprecated methods from its auth-related components (ACS-9768) and replaced other deprecated APIs and
modules (ACS-9859). If your fork subclasses those components or calls the removed methods, migrate to the current
equivalents.

### Library public API

The published API is otherwise **additive** — `@alfresco/aca-content` gains an **`isFeatureSupportedInCurrentAcs`**
pipe, and `@alfresco/aca-shared` gains a **`UserProfileSection`** type (with
`AppExtensionService.getUserProfileSections()`) and an **`isSSOEnabled`** rule (`@alfresco/aca-shared/rules`). No
exports were removed or renamed.

## New components and features

- **All Libraries page** (ACS-10165) — the libraries screens were refactored onto a shared `libraries-base`
  component with a new reusable `library-list` component, and a new *all libraries* route was added.
- **Custom user-profile sections** (ACS-9980) — you can now contribute custom sections to the user-profile page
  via a new `userProfileSections` extension in `app.extensions.json`, surfaced through the new `UserProfileSection`
  type and `AppExtensionService.getUserProfileSections()`.
- **Feature gating by ACS version** — a new `isFeatureSupportedInCurrentAcs` pipe (with folder-information and
  bulk-update evaluators, ACS-10036 / ACS-10038) resolves whether a feature is supported by the connected ACS
  repository version.
- **Saved-searches backward compatibility** — ACA now also supports the legacy `config.json`-based saved-searches
  approach alongside the Preferences API (ACS-10421), and ADW/ACA gracefully handle repositories below ACS 25.x
  that do not support the preferences `PUT` method (ACS-10035).

## Behavioural changes

| Area          | Change                                                                                                                                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search        | The search results page now renders the Description / Title fields as **plain text** instead of interpreting embedded HTML (ACS-10116).                                                                                                                                                      |
| Search        | The search input no longer clears when using a special search such as `text:value` (ACS-10076); filters clear correctly when the input is empty (MNT-25411).                                                                                                                                 |
| Search        | Filtering now behaves correctly in files and sites (ACS-10083), and switching between saved searches works correctly (MNT-25409).                                                                                                                                                            |
| Viewer        | The version preview can now be changed from within the preview window (MNT-25285).                                                                                                                                                                                                           |
| Libraries     | Permission-checking logic in library navigation was fixed (ACS-10409).                                                                                                                                                                                                                       |
| Navigation    | The *Go to personal files* button on the profile page now navigates correctly (ACS-10214); doubled menu-collapsing was removed (MNT-25423).                                                                                                                                                  |
| Accessibility | A large screen-reader / keyboard pass landed — context-menu keyboard navigation, rule-set header labels, profile-page field labels and error messages, and search clear / save-search dialog icons among others (ACS-10198 / 10238 / 10253 / 10285 / 10286 / 10290 / 10295 / 10297 / 10303). |
