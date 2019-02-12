# Alfresco Office Services Extension

An extension module for the Alfresco Content Application that enables "Edit in Microsoft Office" feature.

Integrates with:

- Context Menus
- Toolbars
- Viewer / Open With

## Automated Installation

Install the `ngi` as a global tool:

```sh
npm i -g @ngstack/install
```

In the project root:

```sh
ngi @alfresco/adf-office-services-ext --module=extensions
```

Update `app.extensions.json` and append a reference to the plugin definition:

```json
{
  "$references": ["aos.plugin.json"]
}
```

## Manual Installation

Install the extension library

```sh
npm i @alfresco/adf-office-services-ext
```

Update the `extensions.module.ts` and import corresponding module.

```ts
import { NgModule } from '@angular/core';
import { AosExtensionModule } from '@alfresco/adf-office-services-ext';

// Main entry point for external extensions only.
// For any application-specific code use CoreExtensionsModule instead.

@NgModule({
  imports: [AosExtensionModule]
})
export class AppExtensionsModule {}
```

Setup the resource references in the `angular.json` assets section:

```json
{
  "glob": "**/*.json",
  "input": "node_modules/@alfresco/adf-office-services-ext/assets",
  "output": "./assets/plugins"
}
```

Update `app.extensions.json` and append a reference to the plugin definition:

```json
{
  "$references": ["aos.plugin.json"]
}
```
