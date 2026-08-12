---
Title: Upgrading from ACA v4.3 to v4.4.1
---

# Upgrading from ACA v4.3 to v4.4.1

This guide provides instructions on how to upgrade your Alfresco Content Application (ACA) v4.3.0 project to
v4.4.1 (covering the 4.4.0 and 4.4.1 releases).

This is a large release: it moves **ADF 6.4.0 → 6.7.1** (spanning several ADF releases) and `@alfresco/js-api`
7.1.0 → 7.6.1, so most of the work is **adapting to the ADF breaking changes across 6.5.2, 6.6.0 and 6.7.x**. Read
those ADF guides alongside this one:

- [ADF — Upgrading from v6.4 to v6.5.2](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade64-652.md)
- [ADF — Upgrading from v6.5.2 to v6.6.0](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade652-66.md)
- [ADF — Upgrading from v6.6.0 to v6.7.1](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/upgrade-guide/upgrade66-671.md)

Angular, Material, TypeScript, rxjs and the Node version are all **unchanged**; the build tooling moves to
**Nx 17**. ACA's published library API (`@alfresco/aca-shared` / `@alfresco/aca-content` entry points) is
unchanged — no exports removed or renamed — so the consumer-facing work is mostly **`app.config.json` /
`app.extensions.json` configuration** plus adopting new ADF capabilities. Read the
[breaking changes](#breaking-changes).

## Before you begin

Always perform upgrades on a "clean" project state, back up your changes or make a project backup. Node 18 is still
required (unchanged). The steps below involve configuration changes — commit or back up your work first.

## Contents

- [Library updates](#library-updates)
- [Aligning with ADF 6.5 / 6.6 / 6.7](#aligning-with-adf-65--66--67)
  - [Authentication — PKCE / code flow](#authentication--pkce--code-flow)
  - [Search — Elasticsearch, date range and highlighting](#search--elasticsearch-date-range-and-highlighting)
  - [Content metadata read-only model](#content-metadata-read-only-model)
  - [Viewer close-button position](#viewer-close-button-position)
  - [Document-list resizing, persistence and drag-drop columns](#document-list-resizing-persistence-and-drag-drop-columns)
  - [Theming](#theming)
  - [Disabling tags and categories](#disabling-tags-and-categories)
- [Breaking changes](#breaking-changes)
  - [Configuration changes](#configuration-changes)
  - [Nx 17 workspace migration](#nx-17-workspace-migration)
  - [adf-testing dependency dropped](#adf-testing-dependency-dropped)
  - [E2E selector changes](#e2e-selector-changes)
- [New components and features](#new-components-and-features)
- [Behavioural changes](#behavioural-changes)

## Library updates

Update the `package.json` file with the latest library versions:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.7.1",
        "@alfresco/adf-content-services": "6.7.1",
        "@alfresco/adf-extensions": "6.7.1",
        "@alfresco/js-api": "7.6.1"
    }
}
```

`@alfresco/adf-cli` moves to `6.7.1`; **`@alfresco/adf-testing` was removed** as a dependency. (4.4.0 shipped ADF
`6.7.0` / js-api `7.6.0`; the 4.4.1 patch bumps them to `6.7.1` / `7.6.1`.) The build tooling
moved to **Nx 17** (`@nx/*` / `nx` `17.x`, from `16.10.0`). Angular (`14.1.3`), TypeScript (`4.7.4`), rxjs
(`6.6.6`) and Node (`.nvmrc` `18`) are unchanged. Clean `node_modules` and the lockfile, then reinstall.

## Aligning with ADF 6.5 / 6.6 / 6.7

Most of this release adapts ACA to the ADF breaking changes across three releases. Each item links back to the ADF
guide that describes the underlying change.

### Authentication — PKCE / code flow

ACA switched its default OAuth2 flow to **PKCE authorization-code flow**: in `app.config.json`, `implicitFlow: true` became `implicitFlow: false` + **`codeFlow: true`** (and a new
`APP_CONFIG_OAUTH2_CODE_FLOW` Docker env var).
If your `app.config.json` pins `oauth2.implicitFlow`, review it against the new default. (See ADF 6.6 →
"Authentication and SSO renames".)

### Search — Elasticsearch, date range and highlighting

- **Elasticsearch query migration** — the search configuration in `app.extensions.json` was updated for the
  Elasticsearch backend (e.g. `-PNAME:'0/wiki'` → `-PATH:'//cm:wiki/*'`, and autocomplete options gained a
  `query`). (See ADF 6.5.2 → "Search query migration (Elasticsearch)".)
- **Date-range widget** — every `"selector": "date-range-advanced"` reverted to **`"date-range"`** (now the tabbed
  advanced widget), the date-format token changed `DD-MMM-YY` → **`dd-MMM-yy`**, and `displayedLabelsByField` maps
  were added. (See ADF 6.6 → "Search date-range widget replaced".)
- **Search highlighting** — ACA now renders ADF search `highlight` snippets (config added under the results row).

If you customised the search configuration, reconcile it against the new `app.extensions.json`.

### Content metadata read-only model

Following ADF's content-metadata rework, ACA's metadata tab adopted the **`readOnly`** model (the previous
`editable` input was inverted to `readOnly` with the opposite meaning) and re-wires the displayed aspect through
the store. If you extend the metadata tab, migrate `editable` usage to `readOnly`. (See ADF 6.6 → "Content
metadata property panels".)

### Viewer close-button position

The viewer close button's position is now configurable via `viewer.closeButtonPosition` in `app.config.json`
(default `right`), adopting ADF 6.6's `CloseButtonPosition`. (See ADF 6.6 → "Viewer close button".)

### Document-list resizing, persistence and drag-drop columns

ACA adopted the ADF document-list column capabilities added across 6.5.2–6.7.x:

- **Resizable lists** — all document lists set `[isResizingEnabled]="true"` and `[blurOnResize]="false"`.
- **Per-column opt-out** — columns are resizable by default in newer ADF, so ACA marks the thumbnail/icon columns
  `"resizable": false` (new `resizable` field in `extension.schema.json`).
- **Persistence & drag-drop** — column size / visibility / order are persisted (via ADF's
  `setColumns*` inputs and `columns*Changed` outputs) and columns can be reordered by drag-drop
  (`"draggable": true`). Stable `id="app.*"` values were added to every `data-column`.

### Theming

- **Internal Angular Material CSS classes** — ACA removed most `.mat-*` / `.cdk-*` selector overrides in favour of
  ACA-owned `aca-*` / `adf-*` classes (preparation for ADF's Material MDC migration). If your fork overrides ACA
  styles via Material internals, re-audit them.
- **Theme reference variables** — hardcoded/removed theme references were replaced with dynamic `--theme-*` tokens
  (e.g. `--theme-secondary-text`, `--theme-card-background-color`, `--theme-sidenav-active-text-color`). (See ADF
  6.6 → "Theme reference variables".)

### Disabling tags and categories

ACA can now disable the tags and categories features via `app.config.json` (default `true`), using ADF's
`TagService.areTagsEnabled()` / `CategoryService.areCategoriesEnabled()`.

> **Config-key rename in 4.4.1:** the ACA keys were introduced in 4.4.0 as `plugins.tags` / `plugins.categories`,
> then **renamed in 4.4.1 to `plugins.tagsEnabled` / `plugins.categoriesEnabled`** (ACS-6924) to avoid a naming
> conflict with ADF's own plugin keys. Use the new `*Enabled` names in a custom `app.config.json` (or via the
> `APP_CONFIG_PLUGIN_TAGS` / `APP_CONFIG_PLUGIN_CATEGORIES` env vars) — the ACA rule functions
> `areTagsEnabled` / `areCategoriesEnabled` read the renamed keys.

## Breaking changes

ACA's published library API is unchanged in this release — the `public-api.ts` of every `@alfresco/aca-shared` and
`@alfresco/aca-content` entry point is byte-identical between 4.3.0 and 4.4.0 (no exports removed, renamed or newly
deprecated). The breaking changes are at the configuration, build and dependency level.

### Configuration changes

Update your `app.config.json` / `app.extensions.json` (and any custom extensions):

- `oauth2.implicitFlow: true` → `implicitFlow: false` + `codeFlow: true` (PKCE).
- The `date-range-advanced` search selector was removed — use `date-range`.
- Viewer extensions are now keyed under an **`extensions`** block (by `fileExtension`) instead of the old `content`
  key in `app.extensions.json`.

### Nx 17 workspace migration

The workspace moved to **Nx 17** (`@nx/*` / `nx` `17.x`). `nx.json` and the cache configuration were rewritten. If
you maintain a fork with custom Nx targets, run the Nx 17 migrations.

### adf-testing dependency dropped

`@alfresco/adf-testing` was removed from ACA's dependencies. If your tests imported it via ACA, add it to your own
`devDependencies`.

### E2E selector changes

The viewer close-button e2e locator changed from `button[data-automation-id="adf-toolbar-back"]` to
`button.adf-viewer-close-button` (following ADF's `adf-toolbar-back` → `adf-toolbar-left-back` id change). Update
any e2e selectors targeting the old value.

## New components and features

- **Search highlighting** — matched terms in search results are highlighted (`aca-highlight`), configurable via
  the results row `highlight` settings.
- **Configurable / persistent / draggable document-list columns** — see
  [Document-list resizing, persistence and drag-drop columns](#document-list-resizing-persistence-and-drag-drop-columns);
  the search-results list is now configurable with the same column model.
- **Dynamic Tags column** — the search-results tags column and its `getTags` call are now gated by
  `tagsService.areTagsEnabled()` and driven by `app.config.json`.
- **Manage permissions from the viewer** — the *Manage permissions* action can now be triggered from inside a file
  preview.
- **`AppExtensionService.updateSidebarActions()`** — a new (additive) public method that publishes
  `features.sidebar.toolbar` content actions; new `areTagsEnabled` / `areCategoriesEnabled` rule functions are
  exported from `@alfresco/aca-shared/rules`.

## Behavioural changes

| Area          | Change                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Smart folders | *Edit aspects*, *Manage rules* and *Manage permissions* are now hidden for smart folders, and *Manage permissions* is hidden on multi-selection. |
| Records       | *Edit Offline* and *Upload New Version* are hidden for declared records.                                                                         |
| Storage       | The local-storage prefix is set from the current username on login (via the unified `getUsername()` accessor), fixing an ADW prefix issue.       |
| Libraries     | After deleting a library from the Manage Members view, the user is redirected to the libraries page.                                             |
| Search input  | Clicking a search input that already contains text now lets you edit the term.                                                                   |
| Viewer        | *View details* is active in the expanded view.                                                                                                   |
