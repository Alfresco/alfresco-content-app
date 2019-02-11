# Alfresco Office Services Extension

An extension module for the Alfresco Content Application that enables "Edit in Microsoft Office" feature.

Integrates with:

- Context Menus
- Toolbars
- Viewer / Open With

## Installation

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
