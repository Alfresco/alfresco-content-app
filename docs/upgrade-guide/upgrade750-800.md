---
Title: Upgrading from ACA v7.5.0 to v8.0.0
---

# Upgrading from ACA v7.5.0 to v8.0.0

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v7.5.0 project to
v8.0.0.

**This is a major release.** It moves ACA from **Angular 19 to 20**, takes ADF / `@alfresco/js-api` to their new
majors **9.0.0 / 10.0.0**, and upgrades **NgRx 19 → 20** and **TypeScript 5.8 → 5.9**. The most significant
functional change is the **removal of the embedded Knowledge Retrieval (AI) feature**, which is replaced by a link
to an **external Knowledge Discovery application**. The corresponding ADF guide is:

- [ADF — Upgrading from v8.5.0 to v9.0.0](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade850-900.md)

Budget time to migrate to Angular 20 and re-test. Read the [breaking changes](#breaking-changes) carefully.

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Move your
application to **Angular 20 / TypeScript 5.9 / NgRx 20** in lockstep. Node is a patch bump
(`.nvmrc` `24.13.0` to `24.13.1`).

## Contents

- [Library updates](#library-updates)
- [Aligning with Angular 20 / ADF 9.0](#aligning-with-angular-20--adf-90)
  - [Angular 20 migration](#angular-20-migration)
- [Breaking changes](#breaking-changes)
  - [Platform lockstep](#platform-lockstep)
  - [Embedded Knowledge Retrieval removed](#embedded-knowledge-retrieval-removed)
  - [Library public API](#library-public-api)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "9.0.0",
        "@alfresco/adf-content-services": "9.0.0",
        "@alfresco/adf-extensions": "9.0.0",
        "@alfresco/js-api": "10.0.0",
        "@angular/core": "20.3.25",
        "@angular/material": "20.2.14",
        "@ngrx/store": "~20.1.0",
        "typescript": "5.9.3"
    }
}
```

The whole `@angular/*` toolchain moves to `20.x`, `@ngrx/*` to `~20.1.0`, `@angular-eslint/*` `19.8 → 20.7`,
`@typescript-eslint/*` `→ 8.55.0`, `@nx/*` / `nx` `22 → 23`, `ng-packagr` `19 → 20`, `stylelint` `15 → 16`,
`@mat-datetimepicker/core` `15 → 16`, and `@alfresco/adf-cli` / `@alfresco/eslint-plugin-eslint-angular` to `9.0.0`.
The **`katex`, `mermaid`, `ngx-markdown` and `prismjs`** dependencies were **removed** (they backed the removed
Knowledge Retrieval markdown rendering), and an `overrides` entry pins `node-fetch` for `@module-federation/sdk`.
**Node is a patch bump** (`.nvmrc` `24.13.0 → 24.13.1`). Clean `node_modules` and the lockfile, then reinstall.

## Aligning with Angular 20 / ADF 9.0

See the ADF [8.5.0 → 9.0.0 guide](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade850-900.md)
for the underlying platform detail.

### Angular 20 migration

ACA was lifted to Angular 20 (ACS-11306). Run the Angular 20 update
(`ng update @angular/core@20 @angular/cli@20 @angular/material@20`) against your fork. Two notable points:

- **Built-in control flow adopted** — unlike the Angular 19 step, ACA now uses Angular's built-in control-flow
  syntax (`@if` / `@for`) in its templates. If your fork extends ACA templates, expect the new syntax.
- **`inject()` DI** — the `@angular-eslint` `prefer-inject` rule (enabled in 7.4.1) is now the norm; constructor
  injection has largely been converted to `inject()`.

## Breaking changes

### Platform lockstep

You must move your application to **Angular 20, TypeScript 5.9 and NgRx 20** together with ACA. This is the
dominant breaking change.

### Embedded Knowledge Retrieval removed

The embedded **Knowledge Retrieval (AI)** feature was **removed** from ACA (ACS-12037). All of its components were
deleted — `agents-button`, `search-ai-input`, `search-ai-input-container`, `search-ai-results` and the
`search-ai-marked-options` helper — along with the markdown rendering stack (`katex` / `mermaid` / `ngx-markdown` /
`prismjs`).

In its place, ACA now offers a **link to an external Knowledge Discovery application**: a new
`knowledge-discovery-sidenav` component navigates to the URL from the new **`knowledgeDiscoveryUrl`** app setting,
which can be provided at runtime (e.g. via a Docker env var, #5295). If your fork depended on the in-app AI answer
components or dispatched the AI search actions, migrate to the external Knowledge Discovery integration.

### Library public API

- **`@alfresco/aca-shared/store`** — **removed** the `search-ai.actions` and the `ai-search-by-term-payload` model
  (part of the Knowledge Retrieval removal above), and **added** `node-path.utils`.

`node-path.utils` exports a `NodeContentSource` type (`'personal-files' | 'libraries' | 'repository'`) and a
`getNodeContentSource(path)` helper for determining which content source a node belongs to.

## New components and features

- **External Knowledge Discovery link** — the `knowledge-discovery-sidenav` component and the runtime-configurable
  `knowledgeDiscoveryUrl` app setting replace the removed in-app AI feature (ACS-12037 / #5295).
- **`node-path.utils`** (`@alfresco/aca-shared/store`) — `NodeContentSource` / `getNodeContentSource()` for
  classifying a node's source (personal files, libraries or repository).
- **Repository Access improvements** (MNT-25732) — enhancements to the repository-view feature introduced in 7.5.0.
- **Search refactoring and unification** (MNT-25681), plus a debounce timer for saved searches that limits API
  calls on every keystroke (ACS-12041).

## Behavioural changes

| Area         | Change                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Shared Files | Sorting now works for the Location, Size, Modified-by and Shared-by columns (ACS-12246).                                                 |
| Bulk upload  | The context menu no longer disappears during a bulk upload (ACS-11973), and the preview no longer switches to the next file (ACS-12047). |
| Folder rules | Files can no longer be incorrectly marked as selected in the link-rules dialog (ACS-11975).                                              |
| Viewer       | The image-viewer toolbar is no longer transparent in crop mode (ACS-12014).                                                              |
| Search       | The same term can be executed again when the search mode changes (#5297).                                                                |
| Styling      | Container elevation now uses a proper shadow rather than `box-shadow: none` (ACS-11879, an MD3 follow-up).                               |
