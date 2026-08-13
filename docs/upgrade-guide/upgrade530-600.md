---
Title: Upgrading from ACA v5.3 to v6.0
---

# Upgrading from ACA v5.3 to v6.0

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v5.3.0 project to
v6.0.0.

**This is a major release.** The headline changes are **Angular 16 → 17**, **Node 18 → 20**, and ADF /
`@alfresco/js-api` reaching their **final `7.0.0` / `8.0.0`** releases (from `7.0.0-alpha.7` / `8.0.0-alpha.7`). It
also moves **TypeScript 5.0 → 5.3**, **zone.js 0.13 → 0.14**, and **NgRx 16 → 17**. The relevant ADF change is the
**7.0.0 (final)** section — the Angular 17 step — of:

- [ADF — Upgrading from v6.9 to v7.0](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade69-70.md) (see the **7.0.0 (final)** section)

Because of the Angular 17 / Material 17 move and the Node 20 bump, budget time to rebuild your toolchain, re-audit
Material styles and re-test. Read the [breaking changes](#breaking-changes) carefully.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Move your
application to **Angular 17 / TypeScript 5.3 / zone.js 0.14 / NgRx 17** in lockstep, and update your build/CI
environment to **Node 20** (`.nvmrc` is now `20.18.1`).

## Contents

- [Library updates](#library-updates)
- [Aligning with Angular 17 / ADF 7.0](#aligning-with-angular-17--adf-70)
  - [Angular 17 migration](#angular-17-migration)
  - [Node 20](#node-20)
  - [ADF 7.0 final — what applies to ACA](#adf-70-final--what-applies-to-aca)
- [Breaking changes](#breaking-changes)
  - [Platform lockstep](#platform-lockstep)
  - [Library public API](#library-public-api)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "7.0.0",
        "@alfresco/adf-content-services": "7.0.0",
        "@alfresco/adf-extensions": "7.0.0",
        "@alfresco/js-api": "8.0.0",
        "@angular/core": "17.1.3",
        "@angular/material": "17.1.2",
        "@ngrx/store": "17.0.1",
        "typescript": "5.3.3",
        "zone.js": "0.14.8"
    }
}
```

The whole `@angular/*` toolchain moves to `17.1.x`, `@ngrx/*` to `17.0.1`, `@angular-eslint/*` to `17.x`,
`@typescript-eslint/*` `5 → 6.21.0`, `@nx/*` `17.0.2 → 17.3.2`, `ng-packagr` `16 → 17.1.2`,
`@mat-datetimepicker/core` `12 → 13`, `tslib` `→ 2.8.1`, and `@alfresco/adf-cli` /
`@alfresco/eslint-plugin-eslint-angular` to `7.0.0`. `rxjs` stays `7.8.1`. **Node moves 18 → 20.18.1** (`.nvmrc`).
Unlike ADF (which migrated its test runner to Jest in 7.0.0), **ACA keeps Karma/Jasmine**. Clean `node_modules` and
the lockfile, then reinstall.

## Aligning with Angular 17 / ADF 7.0

See the **7.0.0 (final)** section of the ADF
[6.9 → 7.0 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade69-70.md)
for the underlying platform detail.

### Angular 17 migration

ACA was lifted to Angular 17 / Material 17 / NgRx 17 (ACS-6849). Run the Angular 17 update
(`ng update @angular/core@17 @angular/cli@17 @angular/material@17`) against your fork. **ACA did not adopt Angular
17's new built-in control-flow syntax** (the `@if` / `@for` blocks); templates still use the classic `ngIf` / `ngFor` structural directives, so you do not
need to run that migration to stay aligned. Re-audit any Material style overrides against Angular 17.

### Node 20

The build now requires **Node 20** (`.nvmrc` `20.18.1`, MNT-24892). Update your local toolchain, Docker base image
and CI runners to Node 20; Node 18 is no longer supported.

### ADF 7.0 final — what applies to ACA

Most of ADF 7.0.0's breaking removals are in areas ACA does not consume:

- **`MomentDatePipe` / `MomentDateTimePipe` removed** — ACA does not use them (no change needed).
- The `FormModel` / `FullNamePipe` signature changes, the new form-validator injection tokens, the service-task
  data-shape change and the Screens API are **process/forms-cloud** concerns and do not apply to ACA.

What ACA does pick up from ADF 7.0.0:

- **`DocumentListComponent` `displayDragAndDropHint` input** — ACA binds this to hide the drag-and-drop upload hint
  when files cannot be uploaded to the current location (see [New components and features](#new-components-and-features)).
- **`SavedSearchesPreferencesApiService` / `SAVED_SEARCHES_SERVICE_PREFERENCES`** — ADF 7.0.0 made Saved Searches
  persist through the Preferences API, which ACA now adopts (see below).

## Breaking changes

### Platform lockstep

You must move your application to **Angular 17, TypeScript 5.3, zone.js 0.14 and NgRx 17** together with ACA, and
run it on **Node 20**. This is the dominant breaking change; there are no ACA source-API removals in this release.

### Library public API

The published ACA libraries are **additive only** — no exports were removed or renamed (only the copyright header
year changed across the barrels). `@alfresco/aca-content` gains two new exports:

- **`ContentManagementService`** — the content-management service is now part of the public API (previously
  internal), so extensions can call it directly.
- **`ExternalNodePermissionCommentsTabService`** — a new **abstract** service (`canAddComments(node): boolean`)
  intended as a DI override point, letting a downstream app decide whether comments can be added for a node (e.g.
  on retained / record documents).

## New components and features

- **Saved Searches persisted via the Preferences API** (ACS-9166) — Saved Searches now persist through the
  Alfresco Preferences API (adopting ADF 7.0.0's `SavedSearchesPreferencesApiService`) instead of the config file.
  (This migration was first attempted in the 5.3.0 cycle and reverted; it lands in 6.0.0.)
- **Comments extension point** — the new `ExternalNodePermissionCommentsTabService` lets an app control comment
  availability; ACA uses it so comment creation is available on documents that have been retained / declared as
  records (ACS-9083).
- **Drag-and-drop hint gating** (ACS-8782) — the drag-and-drop upload hint is hidden when files cannot be uploaded
  to the current location (e.g. frozen files under a hold); this is what surfaced `ContentManagementService` as a
  public export.
- **Accessibility** — the notification and user menus are now keyboard-accessible (ACS-9266), plus a wave of a11y
  fixes across the sidebar, search page, breadcrumbs and Create Rule dialog (colour-contrast thresholds, supported
  ARIA attributes, and discernible button text — ACS-9225 / 9228 / 9229 / 9235 / 9236).

## Behavioural changes

| Area              | Change                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node Details page | The *View Details* button was removed from the node Details page (ACS-9158).                                                                      |
| Extensions        | Extension visibility rules are used in **array** form in `app.extensions.json`; single-element arrays no longer log errors (ACS-9346 / ACS-9369). |
| Records mgmt      | The permission error message shown when opening a records-management library was changed (ACS-9344).                                              |
| Saved searches    | The Saved Search navbar title is now translated (ACS-9119).                                                                                       |
| Login             | The license displayed on the login page is updated from SSO (ACS-9213).                                                                           |
| Search input      | Search-input focus styles were fixed (ACA-4735).                                                                                                  |
| Documentation     | Product documentation links moved from `docs.alfresco.com` to `support.hyland.com` (ACS-9371); update any hardcoded doc links in a fork.          |
