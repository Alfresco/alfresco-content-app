---
Title: Upgrading from ACA v6.0 to v7.0.1
---

# Upgrading from ACA v6.0 to v7.0.1

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v6.0.0 project to
v7.0.1 (covering the 7.0.0 and 7.0.1 releases).

**This is the largest release in the series.** It moves **Angular 17 → 19** (via an internal 18 step), converts
ACA into a **standalone-bootstrapped application** (the root `AppModule` is gone), and takes ADF /
`@alfresco/js-api` to **8.0.0 / 9.0.0**. Alongside that it upgrades **`@ngx-translate/core` 14 → 16**, **pdf.js
3 → 5**, **NgRx 17 → 19**, **TypeScript 5.3 → 5.8**, **zone.js 0.14 → 0.15**, **Nx 17 → 21**, and **Node 20 → 22**.
It also adds a markdown/diagram rendering stack (`ngx-markdown`, `mermaid`, `katex`, `prismjs`) for Knowledge
Retrieval. The corresponding ADF guide is:

- [ADF — Upgrading from v7.0 to v8.0](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade70-80.md)

Budget substantial time: you must migrate to Angular 19, adopt the standalone bootstrap, migrate your i18n setup,
re-audit your theme against ADF's theming clean-up, and move your PDF viewer worker asset. Read the
[breaking changes](#breaking-changes) carefully.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Move your
application to **Angular 19 / TypeScript 5.8 / zone.js 0.15 / NgRx 19** in lockstep, update your build/CI
environment to **Node 22** (`.nvmrc` is now `22.14.0`), and plan for the **standalone bootstrap** and **theming**
migrations below.

## Contents

- [Library updates](#library-updates)
- [Aligning with Angular 19 / ADF 8.0](#aligning-with-angular-19--adf-80)
  - [Angular 19 migration](#angular-19-migration)
  - [Standalone application bootstrap](#standalone-application-bootstrap)
  - [Internationalisation — ngx-translate 16](#internationalisation--ngx-translate-16)
  - [Theming clean-up](#theming-clean-up)
  - [PDF viewer — pdf.js 5](#pdf-viewer--pdfjs-5)
  - [Node 22](#node-22)
- [Breaking changes](#breaking-changes)
  - [Platform lockstep](#platform-lockstep)
  - [Standalone bootstrap and extension registration](#standalone-bootstrap-and-extension-registration)
  - [Library public API](#library-public-api)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.0.1",
        "@alfresco/adf-content-services": "8.0.1",
        "@alfresco/adf-extensions": "8.0.1",
        "@alfresco/js-api": "9.0.1",
        "@angular/core": "19.2.6",
        "@angular/material": "19.2.9",
        "@ngrx/store": "19.2.1",
        "@ngrx/operators": "19.2.1",
        "@ngx-translate/core": "^16.0.4",
        "pdfjs-dist": "^5.1.91",
        "typescript": "5.8.2",
        "zone.js": "0.15.0"
    }
}
```

The whole `@angular/*` toolchain moves to `19.2.x`, `@ngrx/*` to `19.2.1` (with the new **`@ngrx/operators`**
package), `@angular-eslint/*` to `19.3.0`, `@typescript-eslint/*` `6 → 7/8`, `@nx/*` and `nx` `17 → 20/21`,
`ng-packagr` `17 → 19`, `@mat-datetimepicker/core` `13 → 15`, `prettier` `2 → 3.5`, and `@alfresco/adf-cli` /
`@alfresco/eslint-plugin-eslint-angular` to `8.0.1`. New runtime dependencies **`ngx-markdown` `19.1.1`,
`mermaid`, `katex` and `prismjs`** are added for Knowledge Retrieval. `rxjs` moves `7.8.1 → 7.8.2`. **Node moves
20 → 22.14.0** (`.nvmrc`). ACA still uses **Karma/Jasmine**. Clean `node_modules` and the lockfile, then reinstall.

> The **7.0.1** patch bumps ADF `8.0.0 → 8.0.1` and `@alfresco/js-api` `9.0.0 → 9.0.1`, fixes an SSO login
> regression (see [Standalone application bootstrap](#standalone-application-bootstrap)), and pulls in a
> `form-data` security bump. There are no other functional changes between 7.0.0 and 7.0.1.

## Aligning with Angular 19 / ADF 8.0

See the ADF [7.0 → 8.0 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade70-80.md)
for the underlying platform detail — the sections below map ACA's work onto it.

### Angular 19 migration

ACA was lifted through **Angular 18** (#4448) and then **Angular 19** (#4520). Run the Angular update schematics
in the same order (`ng update @angular/core@18 @angular/cli@18 …` then `@19`), and re-audit Material style overrides
against Angular 19's Material.

### Standalone application bootstrap

ACA is now a **standalone-bootstrapped application** (AAE-36484 / AAE-36580): the root `AppModule` was removed and
`app/src/main.ts` calls `bootstrapApplication(AppComponent, AppConfig)`, where `AppConfig` is an
`ApplicationConfig` of providers. If your fork maintains its own root module or `main.ts`, migrate to the
standalone bootstrap and register providers (including ACA's, via `provideExtensions()` — see
[Standalone bootstrap and extension registration](#standalone-bootstrap-and-extension-registration)).

> **Provider ordering (SSO):** with the standalone bootstrap, the order of providers in `AppConfig` matters. A
> login regression fixed in **7.0.1** (ACS-9934) was caused by `provideTranslations('app', 'assets')` being
> registered before the auth module; the fix moves `importProvidersFrom(AuthModule.forRoot({ useHash: true }))`
> **ahead of** `provideTranslations(...)`. If SSO login fails after your standalone migration, check that the auth
> providers are registered before the translation providers.

### Internationalisation — ngx-translate 16

`@ngx-translate/core` moved `14 → 16`, whose provider API changed. Follow ADF's
[i18n section](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade70-80.md#internationalisation-i18n)
and register translations through the new provider functions in your standalone `ApplicationConfig` rather than the
old `TranslateModule.forRoot()` NgModule import.

### Theming clean-up

ADF 8.0 removed its prebuilt themes and colour/variable SCSS partials. In step with this, ACA **broke its
dependency on ADF Material selectors** (AAE-34494) and **added the missing palette colour variables** locally
(#4535). If your fork `@import`s ADF theme partials or styles ADF components through `.mat-*` selectors, re-audit
your SCSS against ADF's [theming clean-up](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade70-80.md#theming-clean-up).

### PDF viewer — pdf.js 5

`pdfjs-dist` moved `3.x → 5.x`. If your fork bundles or overrides the PDF worker asset, update it to the pdf.js 5
worker per ADF's [PDF viewer section](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade70-80.md#pdf-viewer-pdfjs-5).

### Node 22

The build now requires **Node 22** (`.nvmrc` `22.14.0`). Update your local toolchain, Docker base image and CI
runners; Node 20 is no longer supported.

## Breaking changes

### Platform lockstep

You must move your application to **Angular 19, TypeScript 5.8, zone.js 0.15 and NgRx 19** (adding the new
`@ngrx/operators` package) together with ACA, and run it on **Node 22**. This — together with the standalone
bootstrap below — is the dominant breaking change.

### Standalone bootstrap and extension registration

Because the root `AppModule` was removed, ACA's extensions are no longer registered by importing an NgModule.
`@alfresco/aca-content` now exports a **`provideExtensions()`** function (built on Angular 19's
`provideAppInitializer` / `inject`) that returns the providers to add to your standalone `ApplicationConfig`:

```ts
import { provideExtensions } from '@alfresco/aca-content';

export const AppConfig: ApplicationConfig = {
  providers: [
    // …
    provideExtensions()
  ]
};
```

If your fork registered ACA via an NgModule import, switch to `provideExtensions()` in your bootstrap providers.

### Library public API

The published ACA libraries **removed** the following exports:

- **`@alfresco/aca-shared`** — the deprecated **`shared.module`** and **`shared-toolbar.module`** NgModules were
  removed. Import the standalone components/directives you need directly instead of these modules.
- **`@alfresco/aca-shared/store`** — the **`snackbar.actions`** and **`snackbar.effects`** were removed. Snackbar
  handling now goes through ADF's `NotificationService` (this completes the migration started in earlier releases);
  if you dispatched ACA snackbar actions, call the ADF service instead.

Additive:

- **`@alfresco/aca-content`** — new **`provideExtensions()`** export (see above).

## New components and features

- **Markdown rendering in Knowledge Retrieval** — AI responses now render **Markdown** (ACS-9427) via
  `ngx-markdown`, including code highlighting (`prismjs`), diagrams (`mermaid`) and math (`katex`). Links embedded in
  a response open in a **separate browser tab** (ACS-9535), and the repeated-question behaviour was fixed
  (ACS-9546).
- **Folder Information enhancements** — the folder-information dialog now shows the **number of files** (ACS-9249)
  and no longer displays an error while the API response is `IN_PROGRESS` (ACS-9466).
- **Favorite action notifications** (ACS-9398) — adding/removing favorites now shows snackbar notifications.
- **Folder-rule script name** (MNT-25175) — the folder-rule display now shows the script name.

## Behavioural changes

| Area             | Change                                                                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Viewer           | The print button is now hidden / disabled for media files (ACS-9388).                                                                    |
| Login            | The login screen uses a white background and forces a light colour scheme (ACS-9670).                                                    |
| Permissions      | The user is redirected away from the permissions page after the node is deleted (ACS-9554).                                              |
| About page       | Tasks and processes are displayed correctly when the About page is refreshed (ACS-9510).                                                 |
| Search           | Property fields are now included in search header calls (MNT-24848).                                                                     |
| Libraries        | Library-permission warnings now use the notification service (with yellow warning styling) instead of the store (ACS-8746).              |
| Folder rules     | An invalid rule definition shows a correct error message (ACS-5503); the edit-rule dialog uses the correct title/button text (ACS-9386). |
| Legal hold       | Legal-hold capabilities are verified correctly (MNT-24923).                                                                              |
| Accessibility    | Focus is restored after a dialog is closed (ACS-9702).                                                                                   |
| Metadata sidebar | Several metadata-sidebar issues were fixed (ACS-9789).                                                                                   |
