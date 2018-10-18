## Application Features

This section contains application-specific features that may vary depending on the final implementation.

The ACA supports the following set of extension points:

- Create menu
- Navigation Bar
- Toolbar
- Context Menu
- Viewer
- Sidebar (aka Info Drawer)
- Content metadata presets (for `Properties` tab)

All the customizations are stored in the `features` section of the configuration file:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "create": [],
    "navbar": [],
    "toolbar": [],
    "contextMenu": [],
    "viewer": {
      "toolbarActions:": [],
      "toolbarMoreMenu:": [],
      "openWith": [],
      "content": []
    },
    "sidebar": [],
    "content-metadata-presets": []
  }
}
```

Other applications or external plugins can utilise different subsets of the configuration above.
Also, extra entries can be added to the configuration schema.