## Routes

To create a new route, populate the `routes` section with the corresponding entries.

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "routes": [
    {
      "id": "plugin1.routes.bin",
      "path": "ext/bin",
      "layout": "app.layout.main",
      "component": "your.component.id"
    }
  ]
}
```