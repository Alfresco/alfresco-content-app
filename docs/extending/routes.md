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
      "component": "your.component.id",
      "children": [
        {
          "id": "plugin1.routes.bin.preview",
          "path": "preview/:nodeId",
          "component": "app.components.preview",
          "data": {
              "navigateBackAsClose": true,
              "simplestMode": true
          },
          "outlet": "viewer"
        }
      ],
      "parentRoute": "your-parent-route"
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
| children      | List of child routes of the injected route. [More info](#dynamically-injected-routes-with-their-children) |
| parentRoute   | The path that the route will become child of. See more info about and its limitations under the [Child routes](#child-routes) section |

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
      },
      "parentRoute": "your-parent-route"
    }
  ]
}
```

All application routes require at least one authentication guard.
Defaults to the `['app.auth']` value.

## Child Routes

### Injecting child routes under top-level routes: `parentRoute`

Extensions may register a routes that are children of some existing application routes.
Imagine the situation when application has the following route structure:

```ts
export const APP_ROUTES: Routes = [
  {
    path: 'files',
    component: FilesComponent,
    children: [
      {
        path: 'bin',
        component: BinComponent,
      },
    ],
  }
]
```

Within the extension, you can declare a route like:

```json
{
  "routes": [
    {
      "id": "custom.route",
      "parentRoute": "files",
      "path": "my-path",
      "layout": "app.layout.main",
      "component": "your.component.id"
    }
  ]
}
```

That registers a new route `my-path` that is a child of the existing `files` route,
so giving you an option for nested linking: `/files/my-path`.

> For the time being, you can provide child entries only for the root (top-level) routes.

### Dynamically injected routes with their children

For a dynamically created route, we can define the children property as well, which contain the child routes of the mainly injected route. For the time being, for a child route, the following properties are supported and translated to Angular's Router configuration:

| Property      | Description                                       |
| -             | -                                                 |
| **id**        | Unique identifier.                                |
| **path**      | Runtime path of the route.                        |
| **component** | The main [component](/extending/components) to use for the route. |
| data          | Custom property bag to carry with the route. |
| outlet        | Router outlet's name. Especially useful when using the PluginPreviewAction within a plugin |

## Authentication Guards

Below is the list of the authentication guards main application registers on startup.

| Key      | Type         | Description                                                               |
| -------- | ------------ | ------------------------------------------------------------------------- |
| app.auth | AuthGuardEcm | ADF guard, validates ACS authentication and redirects to Login if needed. |
| app.extensions.dataLoaderGuard | ExtensionsDataLoaderGuard | ACA guard, validates EXTENSION_DATA_LOADERS provider and redirects to Login if needed. |

You can refer those guards from within your custom extensions,
or [register](/extending/registration) your custom implementations.
