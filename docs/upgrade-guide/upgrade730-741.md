---
Title: Upgrading from ACA v7.3.0 to v7.4.1
---

# Upgrading from ACA v7.3.0 to v7.4.1

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v7.3.0 project to
v7.4.1 (there was no 7.4.0 release).

This is a minor release on the Angular 19 / ADF 8 line: it moves **ADF 8.3.1 → 8.4.1** and `@alfresco/js-api`
9.3.1 → 9.4.1. Angular stays on the 19.2 line (patch `19.2.19` to `19.2.20`), and Node (`.nvmrc` 24.13.0),
TypeScript, zone.js and NgRx are unchanged. The notable items are the **`@ngx-translate/core` 16 → 17** major bump
(which was attempted and reverted in 7.3.0, and now lands), a **front-end rebrand**, a new **repository view**, and
a **search UX rework** that removed two recently-added form validators. The corresponding ADF guide is:

- [ADF — Upgrading from v8.3.1 to v8.4.1](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade831-841.md)

Read the [breaking changes](#breaking-changes).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. The Angular 19 /
TypeScript 5.8 platform and Node 24 (`.nvmrc`) are unchanged from 7.3.0.

## Contents

- [Library updates](#library-updates)
- [Aligning with ADF 8.4](#aligning-with-adf-84)
  - [ngx-translate 17](#ngx-translate-17)
  - [js-api LazyApi decorator](#js-api-lazyapi-decorator)
  - [Library peer dependencies](#library-peer-dependencies)
- [Breaking changes](#breaking-changes)
  - [Removed search validators](#removed-search-validators)
  - [prefer-inject lint rule](#prefer-inject-lint-rule)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.4.1",
        "@alfresco/adf-content-services": "8.4.1",
        "@alfresco/adf-extensions": "8.4.1",
        "@alfresco/js-api": "9.4.1",
        "@ngx-translate/core": "^17.0.0",
        "@angular/core": "19.2.20"
    }
}
```

The whole `@angular/*` toolchain moves to the `19.2.20` patch, `@alfresco/adf-cli` /
`@alfresco/eslint-plugin-eslint-angular` to `8.4.1`, `@angular-eslint/*` `19.3 → 19.8.1`, `@nx/*` / `nx`
`21/22 → 22.5.4`, and `prettier` `3.5 → 3.8`. `pdfjs-dist` is now pinned exactly (`5.1.91`). **`@ngx-translate/core`
moves `16 → 17`** (a major — see below). TypeScript (`5.8.2`), `@ngrx/*` (`19.2.1`), zone.js (`0.15.0`) and Node
(`.nvmrc` `24.13.0`) are unchanged. Clean `node_modules` and the lockfile, then reinstall.

## Aligning with ADF 8.4

See the ADF [8.3.1 → 8.4.1 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade831-841.md)
for the underlying library changes.

### ngx-translate 17

`@ngx-translate/core` moved `16 → 17`. This is the upgrade that was reverted in 7.3.0 and now lands together with
ADF 8.4. If your fork registers translation providers or a custom `TranslateLoader`, align them with the
ngx-translate 17 API. A related fix ensures the app no longer reverts components to English after switching the
language and reloading (ACS-10732).

### js-api LazyApi decorator

ACA adopted js-api's new **`LazyApi`** decorator (ACS-11205) and added the `declare` keyword to affected class
fields (with a matching `tsconfig` adjustment) to prevent field shadowing under `useDefineForClassFields`. If your
fork extends the same js-api-backed services, apply the same pattern.

### Library peer dependencies

The published libraries' `peerDependencies` for Angular and NgRx were updated to **v19.2** (#5151). Align your
consuming project's Angular / NgRx versions accordingly.

## Breaking changes

### Removed search validators

As part of the search UX rework (ACS-10475), the two form validators added in the previous releases were
**removed** from `@alfresco/aca-shared` (their files were deleted):

- `noWhitespaceValidator`
- `noLeadingTrailingOperatorsValidator`

If your fork imported either validator from `@alfresco/aca-shared`, inline the check or provide your own
`ValidatorFn`; the search input now handles this internally.

### prefer-inject lint rule

The `@angular-eslint` **`prefer-inject`** rule was enabled by default (ACS-11417), in line with the Angular 20
direction. This is a lint-level change that may produce warnings/errors in a fork that still uses constructor
injection; migrate to `inject()` or adjust your lint config.

## New components and features

- **Repository view** (MNT-25615) — a new `repository-view` component and route that surface the repository
  (Company Home) root as a browsable location.
- **Search UX improvements** (ACS-10475) — a set of front-end search UX refinements (including the internalised
  input validation that replaced the removed validators above).

## Behavioural changes

| Area          | Change                                                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branding      | The application was rebranded — the Alfresco logo and favicon were updated (ACS-11271).                                                                             |
| Localisation  | Switching the language and reloading no longer reverts components back to English (ACS-10732).                                                                      |
| Records       | The *Edit Offline* option is hidden when a node is checked out (MNT-25584).                                                                                         |
| Node info     | The Information button display was fixed (MNT-25478 follow-up).                                                                                                     |
| Accessibility | The search page is now readable at 320px width (ACS-10258), and the Saved Search dialog manages focus correctly on open and return to trigger on close (ACS-10273). |
| Libraries     | Library-properties handling was cleaned up (ACS-10621).                                                                                                             |
