---
Title: Upgrading from ACA v5.1 to v5.2
---

# Upgrading from ACA v5.1 to v5.2

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v5.1.1 project to
v5.2.0.

This release is another platform lift: **Angular 15 → 16**, **TypeScript 4.9 → 5.0**, **rxjs 6 → 7** and
**zone.js 0.11 → 0.13**, on **ADF 7.0.0-alpha.3 → 7.0.0-alpha.6** (`@alfresco/js-api` 8.0.0-alpha.3 → alpha.6). The
big new feature is **Saved Searches**. The relevant ADF changes are the **7.0.0-alpha.4** (Angular 15 → 16) and
**7.0.0-alpha.6** sections of:

- [ADF — Upgrading from v6.9 to v7.0](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade69-70.md) (see the **7.0.0-alpha.4** and **7.0.0-alpha.6** sections)

Nx (17.3.1), `@ngx-translate/core` and Node (`.nvmrc` 18) are unchanged. Because of the Angular 16 / Material 16
move, budget time to re-audit Material styles and re-test. Read the [breaking changes](#breaking-changes).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Move your
application to **Angular 16 / TypeScript 5.0 / rxjs 7 / zone.js 0.13** in lockstep. Node 18 (`.nvmrc`) is unchanged.

## Contents

- [Library updates](#library-updates)
- [Aligning with Angular 16 / ADF 7.0-alpha](#aligning-with-angular-16--adf-70-alpha)
  - [Angular 16 migration](#angular-16-migration)
  - [rxjs 7](#rxjs-7)
  - [TypeScript 5 class-field initialization](#typescript-5-class-field-initialization)
  - [Version manager inputs](#version-manager-inputs)
- [Breaking changes](#breaking-changes)
  - [Platform lockstep](#platform-lockstep)
  - [Context-menu action injection](#context-menu-action-injection)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@angular/core": "16.2.9",
        "@angular/material": "16.2.9",
        "typescript": "5.0.4",
        "rxjs": "7.5.7",
        "zone.js": "0.13.3",
        "@ngrx/store": "16.3.0",
        "@alfresco/adf-core": "7.0.0-alpha.6",
        "@alfresco/adf-content-services": "7.0.0-alpha.6",
        "@alfresco/adf-extensions": "7.0.0-alpha.6",
        "@alfresco/js-api": "8.0.0-alpha.6"
    }
}
```

`@alfresco/adf-cli`, the `@angular/*` toolchain, `@angular-eslint/*`, `ng-packagr` and `@ngrx/*` all move to their
Angular-16 lines. `nx` (`17.3.1`), `@ngx-translate/core` and Node (`.nvmrc` `18`) are unchanged. Clean
`node_modules` and the lockfile, then reinstall.

## Aligning with Angular 16 / ADF 7.0-alpha

See the **7.0.0-alpha.4** / **7.0.0-alpha.6** sections of the ADF
[6.9 → 7.0 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade69-70.md)
for the underlying changes.

### Angular 16 migration

The Angular 16 lift (ACS-6693 / the NG16 migration) rewrote a large amount of ACA to Angular 16 / Material 16 /
ngrx 16, with the dominant pattern being **constructor DI → `inject()`** across components, effects and services.
A batch of **Material-16 visual fixes** was folded in (checkbox focus colour, create-rule dialog, input fill,
sidenav/menu colours). If your fork styles Material internals or overrides ACA component styles, re-audit them.
(Some NG16 fixes in that squashed migration were provisional — re-test the areas you customise.)

### rxjs 7

rxjs moved 6 → 7. The main source change was tightening empty subjects to **`Subject<void>`**. Note ACA
**deliberately kept `toPromise()`** (still present in a handful of services) rather than migrating to
`firstValueFrom` / `lastValueFrom`; if you do the migration in your own code, be aware `toPromise` is deprecated in
rxjs 7.

### TypeScript 5 class-field initialization

TypeScript 5 / Angular 16 enforce stricter class-field semantics (`useDefineForClassFields`): a class-field
initializer that references a constructor-injected dependency now runs **before** the constructor assigns it. ACA
hit this in `FolderRuleSetsService` (`selectedRuleSet$` referenced an injected service in a field initializer and
threw on the Manage Rules page); the fix moved the observable construction into the constructor. **Audit your own
field initializers that use injected dependencies** and move them into the constructor (or use `inject()`).

### Version manager inputs

Adopting ADF alpha.4's `VersionManagerComponent` inputs, ACA's versions tab now binds `[allowViewVersions]`,
`[allowVersionDelete]` and `[showActions]`, driven by new `app.config.json` keys under **`adf-version-manager`**
(`allowViewVersions` / `allowVersionDelete` / `showActions`, default `true`) exposed through `AppSettingsService`.

> The process-services-cloud changes in ADF alpha.4/alpha.6 (`counters$` → `counters`, `RUNNING_STATUS` →
> `DEPLOYED_STATUS`, `ContainerModel` getters, the process/task search tokens) do **not** apply to ACA — they are
> process-cloud only.

## Breaking changes

ACA's published library API is **additive only** this release — no exports were removed, renamed or deprecated
(the barrels gain `NavigationHistoryService` in `@alfresco/aca-shared` and `aca-search-utils` in
`@alfresco/aca-content`; the store gains a `CustomContextMenu` action). The breaking work is the platform move.

### Platform lockstep

You must move your application to **Angular 16, TypeScript 5.0, rxjs 7 and zone.js 0.13** together with ACA. Run
the Angular 16 update (`ng update @angular/core@16 @angular/cli@16 @angular/material@16`), address the TypeScript-5
class-field caveat above, and re-audit Material 16 styles. A new
`@angular-eslint/template/prefer-self-closing-tags` lint rule was enabled (cosmetic template churn).

### Context-menu action injection

The context menu was split so custom actions can be injected. A new base directive **`[acaContextActions]`** (with
a `customActions` `@Input()`), a `CustomContextMenuComponent`, and a new injection token
**`CONTEXT_MENU_CUSTOM_ACTIONS`** were added, alongside a store `CustomContextMenu` action. There are now two
population modes: the default `acaContextActions` (loads from `app.extensions.json`) or injecting an array of
rule-formatted actions via `customActions` / the token. This is additive, but if you customised the context menu,
see `docs/features/context-menu-actions.md` for the new model.

## New components and features

- **Saved Searches** — save the current search, manage saved searches, and edit / save-as-new. Adds a
  `save-search` dialog and an `[acaSaveSearch]` directive, a full-page **Manage Searches** list at the new
  `saved-searches` route (`SavedSearchesSmartListComponent`, guarded by `AuthGuard`), and a sidenav entry
  registered as the `app.search.navbar` extension component (under a new `app.navbar.secondary` group in
  `app.extensions.json`). It is backed by ADF's `SavedSearchesService` / `SavedSearch` (ADF 7.0-alpha.4).
- **Context-menu custom-action injection** — see [Context-menu action injection](#context-menu-action-injection).
- **`NavigationHistoryService`** (`@alfresco/aca-shared`) — tracks router history so views can restore the last
  selection (used by the Knowledge Retrieval "keep selection on back-navigation" behaviour).

## Behavioural changes

| Area                | Change                                                                                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Knowledge Retrieval | Agent avatars are loaded from the backend (previously mocked); the query/question is removed from the input on the results page; selections and the question are kept when navigating back to the previous page. |
| Pagination          | The items-per-page selector button is now visible.                                                                                                                                                               |
| Version manager     | Whether versions can be viewed/deleted and whether actions show is now configurable via `app.config.json` (`adf-version-manager.*`).                                                                             |
