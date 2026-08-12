---
Title: Upgrading from ACA v4.4.1 to v5.0.1
---

# Upgrading from ACA v4.4.1 to v5.0.1

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v4.4.1 project to
v5.0.1 (covering the 5.0.0 and 5.0.1 releases).

**This is a major release.** The headline change is **Angular 14 → 15**, which brings the **Angular Material MDC
migration** — the single biggest source of visual breakage. It moves **ADF 6.7.1 → 7.0.0-alpha.2** and
**`@alfresco/js-api` 7.6.1 → 8.0.0-alpha.2**, and **TypeScript 4.7 → 4.9**. The ADF span crosses three ADF guides
(most relevant is the **7.0.0-alpha.2** section of the 6.9 → 7.0 guide, which is the Angular-15 + MDC step):

- [ADF — Upgrading from v6.7.1 to v6.8.0](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade671-68.md)
- [ADF — Upgrading from v6.8 to v6.9](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade68-69.md)
- [ADF — Upgrading from v6.9 to v7.0](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade69-70.md) (see the **7.0.0-alpha.2** section)

Because of the MDC migration, budget time to re-audit any Material CSS overrides in your fork. Read the
[breaking changes](#breaking-changes) carefully.

> **rxjs / Nx note:** although ADF's 7.0.0-alpha.2 itself moved to rxjs 7.8 and a newer Nx, ACA's root manifest at
> 5.0.1 still pins **rxjs 6.6.6** and **Nx 17.3.1** (and zone.js 0.11.8), so those ADF implications do **not** apply
> to your ACA app at this version.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Move your
application to **Angular 15 / TypeScript 4.9** in lockstep. Node 18 (`.nvmrc`) is unchanged. Budget time to build,
re-theme (Material MDC) and re-test after upgrading.

## Contents

- [Library updates](#library-updates)
- [Aligning with Angular 15 / ADF 7.0-alpha](#aligning-with-angular-15--adf-70-alpha)
  - [Angular Material MDC migration](#angular-material-mdc-migration)
  - [ADF standalone components and MaterialModule](#adf-standalone-components-and-materialmodule)
  - [ADF Notification Service](#adf-notification-service)
  - [ADF document-list reload](#adf-document-list-reload)
  - [js-api v8](#js-api-v8)
- [Breaking changes](#breaking-changes)
  - [Library public API](#library-public-api)
  - [Services and state rework](#services-and-state-rework)
  - [Extension schema and configuration](#extension-schema-and-configuration)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@angular/core": "15.2.10",
        "@angular/material": "15.2.9",
        "typescript": "4.9.5",
        "@alfresco/adf-core": "7.0.0-alpha.2",
        "@alfresco/adf-content-services": "7.0.0-alpha.2",
        "@alfresco/adf-extensions": "7.0.0-alpha.2",
        "@alfresco/js-api": "8.0.0-alpha.2"
    }
}
```

`@alfresco/adf-cli` moves to `7.0.0-alpha.2` too. `rxjs` (`6.6.6`), `nx` (`17.3.1`), `zone.js` (`0.11.8`) and Node
(`.nvmrc` `18`) are unchanged. Clean `node_modules` and the lockfile, then reinstall.

## Aligning with Angular 15 / ADF 7.0-alpha

Most of this release is the Angular 15 platform move and adapting to ADF's 7.0.0-alpha.2 changes. See the ADF
[6.9 → 7.0 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade69-70.md)
(7.0.0-alpha.2 section) for the underlying detail.

### Angular Material MDC migration

Angular 15's Material components were rewritten onto MDC, changing their internal DOM and CSS class names
(`.mat-*` → `.mat-mdc-*`). ACA's NG15 migration (ACS-6693) was followed by a wave of MDC-driven restyling and
layout fixes (toolbar buttons, create/upload buttons, `mat-tabs`, dialog paddings, search input, bulk-action
dropdown, badges, folder-rules dialogs). **If your fork styles Material internals — directly or by overriding ACA
component styles — you must re-audit those styles.** This is the biggest source of visual breakage in this upgrade.

### ADF standalone components and MaterialModule

ADF 7.0-alpha.2 makes most components standalone and deprecates the shared `MaterialModule`. ACA:

- updated document-list / column / context-menu / sidenav imports to the **standalone** ADF symbols (e.g. importing
  `DynamicColumnComponent` / `DocumentListPresetRef` directly instead of `ExtensionsModule`);
- removed the deprecated shared **`MaterialModule`** from its imports.

If your fork imports ADF via NgModules or `MaterialModule`, import the standalone components / specific
`@angular/material/*` modules directly.

### ADF Notification Service

ACA now calls ADF's `NotificationService` directly for snackbars instead of dispatching NgRx snackbar actions
(reworked across the content-management / node-template services, search input, toggle-edit-offline,
toggle-join-library, and the library/template/upload/router effects). If you dispatched those ACA snackbar actions,
call the ADF service instead.

### ADF document-list reload

ACA switched its list-refresh plumbing to ADF's **`DocumentListService.reload()` / `reload$`** (a 7.0.0-alpha.2
addition), removing its own reload logic from `app-hook.service` and related effects/actions.

### js-api v8

`@alfresco/js-api` moved to `8.0.0-alpha.2`. ACA wired the linked js-api path into `tsconfig.adf.json` and raised
the ACA libraries' peer ranges accordingly. Update any pins to allow js-api 8.

## Breaking changes

### Library public API

The published ACA libraries changed their public surface:

**`@alfresco/aca-shared`:**

- **Renamed:** `aca-file-auto-download.service` → **`auto-download.service`** (`AcaFileAutoDownloadService` reworked
  into `AutoDownloadService`).
- **Moved:** the `modal-configuration` model moved out of `@alfresco/aca-shared` to `@alfresco/aca-shared/store`.
- **Added:** `constants`, the `plugin-enabled.guard` (route guard), and the new `app-settings.service` /
  `user-profile.service` (see [Services and state rework](#services-and-state-rework)).

**`@alfresco/aca-shared/store`:**

- **Removed `StoreModule`** (`store.module`) — effect registration was simplified; register effects via the app's
  `app-store.module.ts` instead of importing the old module.
- **Removed** `dialog.effects` (dialog effects were removed) and the unused logout action.
- **Added** the relocated `modal-configuration` model.

**`@alfresco/aca-content/viewer`:** now also exports `PreviewComponent`.

### Services and state rework

Several concerns moved out of the NgRx store into root-provided services (migrate direct store/config reads):

- **`UserProfileService`** — holds the current user profile (`userProfile$`, `loadUserProfile()` via `PeopleApi` +
  groups); replaces the profile slice of the app reducer.
- **`AppSettingsService`** — typed getters over `AppConfigService` (`appName`, `appVersion`, `appCopyright`,
  `landingPage`, `aosHost`, `mimeTypes`, `appLogoUrl`, …). Roughly 800 lines were removed from `app.config.json`
  and the corresponding store state; components now read settings from this service.
- **`AutoDownloadService`** — the renamed auto-download service now reads its size threshold from `AppSettingsService`.

### Extension schema and configuration

Update your `app.config.json` / `app.extensions.json` and any custom extensions:

- **`aca:fields` → `app:fields`** — the custom search-form field property was renamed (in `DEFAULT_SEARCH`,
  `DUBLIN_CORE`, `EFFECTIVITY`). Rename it in any custom search configuration.
- **`extension.schema.json` review** — the `userActions` and `mainAction` feature definitions (and a duplicate
  top-level `badges`) were removed / relocated. Extensions relying on those schema keys must be updated.
- **Blank-page route removed** — the `blank` route was removed from `app.routes.ts` and `app.config.json`.
- **Plugin routing guard** — routes for optional plugins are now gated by a new `plugin-enabled.guard` (exported
  from `@alfresco/aca-shared`).

## New components and features

- **Manage Holds / bulk Legal Hold** — a new *Manage Holds* dialog with Apply-New-Hold / Manage-Existing-Holds
  tabs for bulk operations, backed by new `bulk-actions-dropdown` and `datatable-cell-badges` components and new
  `bulk-actions` / badge-`tooltip` entries in `extension.schema.json` (aligns with ADF 7.0's Legal Hold area).
- **Security marks for Folder Rules** — rule actions can set security marks.
- **HxI connector availability** — a new store selector reports whether the HxI connector is available.

## Behavioural changes

| Area                | Change                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Multi-select        | Multi-selection is now **on by default** across the document lists (files, favorites, libraries, recent-files, shared-files, search-results, trashcan). |
| Search results      | Delete and move actions are now available on the search-results page.                                                                                   |
| Folder rules        | Rule-action node selection changed from multiple to **single**.                                                                                         |
| Checkboxes          | Selection checkboxes use the Hyland-blue checked state.                                                                                                 |
| Testing (fork note) | Protractor e2e was removed (migration to Playwright is complete); if your fork extends ACA's Protractor harness, move to Playwright.                    |
