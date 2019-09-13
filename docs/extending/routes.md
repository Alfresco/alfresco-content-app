---
Title: Routes
---

# Routes

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

## Route properties

| Name          | Description                                                                            |
| ------------- | -------------------------------------------------------------------------------------- |
| **id**        | Unique identifier.                                                                     |
| **path**      | Runtime path of the route.                                                             |
| **component** | The main [component](/extending/components) to use for the route.                                |
| layout        | The layout [component](/extending/components) to use for the route.                              |
| auth          | List of [authentication guards](#authentication-guards). Defaults to `[ "app.auth" ]`. |
| data          | Custom property bag to carry with the route.                                           |

Use the `app.layout.main` value for the `layout` property to get the default application layout,
with header, navigation sidebar and main content area.
You can register any component to back the `app.layout.main` value.

**Tip:** By default, the `app.layout.main` is used if you do not specify any custom values.
Use `blank` if you want your route component take the whole page.

You can define the full route schema like in the next example:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "routes": [
    {
      "id": "plugin1.routes.bin",
      "path": "ext/bin",
      "component": "your.component.id",
      "layout": "app.layout.main",
      "auth": ["app.auth"],
      "data": {
        "title": "Custom Trashcan"
      }
    }
  ]
}
```

All application routes require at least one authentication guard.
Defaults to the `['app.auth']` value.

## Authentication Guards

Below is the list of the authentication guards main application registers on startup.

| Key      | Type         | Description                                                               |
| -------- | ------------ | ------------------------------------------------------------------------- |
| app.auth | AuthGuardEcm | ADF guard, validates ACS authentication and redirects to Login if needed. |

You can refer those guards from within your custom extensions,
or [register](/extending/registration) your custom implementations.
