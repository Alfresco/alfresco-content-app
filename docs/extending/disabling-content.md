### Disabling content

Most of the schema elements can be switched off by using the `disabled` property:

```json
{
  "$schema": "../../extension.schema.json",
  "$name": "app",
  "$version": "1.0.0",

  "features": {
    "create": [
      {
        "id": "app.create.folder",
        "disabled": true,
        "order": 100,
        "icon": "create_new_folder",
        "title": "Create Folder"
      }
    ]
  }
}
```

This feature becomes handy when you want to disable existing functionality from within the external plugin.

In the example below, the plugin called `plugin1` replaces standard `app.create.folder` menu
exposed by the application with a custom one coming with the plugin.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "create": [
            {
                "id": "app.create.folder",
                "disabled": true,
                ...
            },
            {
                "id": "plugin1.create.folder",
                "title": "Create Folder",
                ...
            }
        ]
    }
}
```