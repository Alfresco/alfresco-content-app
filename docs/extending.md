<p class="danger">
  Work is still in progress, the documentation and examples may change.
</p>

# Extending

Application extensibility is preformed via the root `/src/assets/app.extensions.json`,
and any number of external plugins that are references of the main entry point.

The application also comes with the `/src/assets/plugins/` folder
already preconfigured to store external files.

## Format

The format is represented by a JSON file with the structure similar to the following one:

```json
{
    "$name": "app",
    "$version": "1.0.0",

    "routes": [],
    "actions": [],
    "rules": [],
    "features": {}
}
```

### Schema

You can find the JSON schema at the project root folder: [extension.schema.json](https://github.com/Alfresco/alfresco-content-app/blob/master/extension.schema.json).

<p class="tip">
Schema allows validating extension files, provides code completion and documentation hints.
</p>

```json
{
    "$schema": "../../extension.schema.json",
    "$name": "app",
    "$version": "1.0.0",
}
```

### Multiple files

You can have multiple extension files distributed separately.
All additional files are linked via the `$references` property,
the order of declaration defines also the order of loading.

```json
{
    "$schema": "../../extension.schema.json",
    "$name": "app",
    "$version": "1.0.0",
    "$references": [
        "plugin1.json",
        "plugin2.json"
    ]
}
```

<p class="warning">
Always keep in mind that all extension files are merged together at runtime.
That allows plugins overwriting the code from the main application or altering other plugins.
</p>

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
            "component": "app.components.trashcan"
        }
    ],
```

### Route properties

| Name | Description |
| --- | --- |
| **id** | Unique identifier. |
| **path** | Runtime path of the route. |
| **component** | The main [component](#components) to use for the route. |
| *layout* | The layout [component](#components) to use for the route. |
| *auth* | List of [authentication guards](#authentication-guards). Defaults to `[ "app.auth" ]`. |
| *data* | Custom property bag to carry with the route. |

<p class="tip">
Use the `app.layout.main` value for the `layout` property to get the default application layout,
with header, navigation sidebar and main content area.
Do not set the `layout` property if you want your route component take the whole page.
</p>

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
            "component": "app.components.trashcan",
            "layout": "app.layout.main",
            "auth": [ "app.auth" ],
            "data": {
                "title": "Custom Trashcan"
            }
        }
    ],
```

### Authentication Guards

Below is the list of the authentication guards main application registers on startup.

| Key | Type | Description |
| --- | --- | --- |
| app.auth | AuthGuardEcm | ADF guard, validates ACS authentication and redirects to Login if needed. |

You can refer those guards from within your custom extensions,
or [register](#registration) your custom implementations.

## Components

| Key | Type | Description |
| --- | --- | --- |
| app.layout.main | LayoutComponent | --- |
| app.components.trashcan | TrashcanComponent | --- |
| app.toolbar.toggleInfoDrawer | ToggleInfoDrawerComponent | --- |
| app.toolbar.toggleFavorite | ToggleFavoriteComponent | --- |

See [Registration](#registration) section for more details
on how to register your own component for runtime reuse.

## Actions

## Content Actions

## Application Actions

Below is the list of public actions you can dispatch from any part of the code:

| Name | Payload | Description |
| --- | --- | --- |
| SET_CURRENT_FOLDER | Node | --- |
| SET_CURRENT_URL | string | --- |
| SET_USER | Person | --- |
| TOGGLE_INFO_DRAWER | n/a | --- |
| ADD_FAVORITE | MinimalNodeEntity[] | --- |
| REMOVE_FAVORITE | MinimalNodeEntity[] | --- |
| DELETE_LIBRARY | string | --- |
| CREATE_LIBRARY | n/a | --- |
| SET_SELECTED_NODES | MinimalNodeEntity[] | --- |
| DELETE_NODES | MinimalNodeEntity[] | --- |
| UNDO_DELETE_NODES | any[] | --- |
| RESTORE_DELETED_NODES | MinimalNodeEntity[] | --- |
| PURGE_DELETED_NODES | MinimalNodeEntity[] | --- |
| DOWNLOAD_NODES | MinimalNodeEntity[] | --- |
| CREATE_FOLDER | string | --- |
| EDIT_FOLDER | MinimalNodeEntity | --- |
| SHARE_NODE | MinimalNodeEntity | --- |
| UNSHARE_NODES | MinimalNodeEntity[] | --- |
| COPY_NODES | MinimalNodeEntity[] | --- |
| MOVE_NODES | MinimalNodeEntity[] | --- |
| MANAGE_PERMISSIONS | MinimalNodeEntity | --- |
| MANAGE_VERSIONS | MinimalNodeEntity | --- |
| NAVIGATE_URL | string | --- |
| NAVIGATE_ROUTE | any[] | --- |
| NAVIGATE_FOLDER | MinimalNodeEntity | --- |
| NAVIGATE_PARENT_FOLDER | MinimalNodeEntity | --- |
| SEARCH_BY_TERM | string | --- |
| SNACKBAR_INFO | string | --- |
| SNACKBAR_WARNING | string | --- |
| SNACKBAR_ERROR | string | --- |
| UPLOAD_FILES | n/a | --- |
| UPLOAD_FOLDER | n/a | --- |
| VIEW_FILE | MinimalNodeEntity | --- |

## Rules

### Core Evaluators

| Key | Description |
| --- | --- |
| core.every | --- |
| core.some | --- |
| core.not | --- |

### Application Evaluators

| Key | Description |
| --- | --- |
| app.selection.canDelete | --- |
| app.selection.canDownload | --- |
| app.selection.notEmpty | --- |
| app.selection.canUnshare | --- |
| app.selection.canAddFavorite | --- |
| app.selection.canRemoveFavorite | --- |
| app.selection.first.canUpdate | --- |
| app.selection.file | --- |
| app.selection.file.canShare | --- |
| app.selection.library | --- |
| app.selection.folder | --- |
| app.selection.folder.canUpdate | --- |

### Navigation Evaluators

| Key | Description |
| --- | --- |
| app.navigation.folder.canCreate | --- |
| app.navigation.folder.canUpload | --- |
| app.navigation.isTrashcan | --- |
| app.navigation.isNotTrashcan | --- |
| app.navigation.isLibraries | --- |
| app.navigation.isNotLibraries | --- |
| app.navigation.isSharedFiles | --- |
| app.navigation.isNotSharedFiles | --- |
| app.navigation.isFavorites | --- |
| app.navigation.isNotFavorites | --- |
| app.navigation.isRecentFiles | --- |
| app.navigation.isNotRecentFiles | --- |
| app.navigation.isSearchResults | --- |
| app.navigation.isNotSearchResults | --- |

## Registration

You can use `ExtensionService` to register custom components, authentication guards,
rule evaluators, etc.

It is recommended to register custom content during application startup
by utilising the `APP_INITIALIZER` injection token that comes with Angular.
In that case all plugins will be available right after main application component is ready.

Update the main application module `app.module.ts`, or create your own module,
and use the following snippet to register custom content:

```js
export function setupExtensions(extensions: ExtensionService): Function {
    return () =>
        new Promise(resolve => {

            extensions.setComponents({
                'plugin1.components.my': MyComponent1,
                'plugin1.layouts.my': MyLayout
            });

            extensions.setAuthGuards({
                'plugin.auth': MyAuthGuard
            });

            extensions.setEvaluators({
                'plugin1.rules.custom1': MyCustom1Evaluator,
                'plugin1.rules.custom2': MyCustom2Evaluator
            });

            resolve(true);
        });
}

@NgModule({
    declarations: [ MyComponent1, MyLayout ],
    entryComponents: [ MyComponent1, MyLayout ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: setupExtensions,
            deps: [ ExtensionService ],
            multi: true
        }
    ]
})
export class MyExtensionModule {}
```

<p class="warning">
According to Angular rules, all components that are created dynamically at runtime
need to be registered within the `entryComponents` section of the NgModule.
</p>

The registration API is not limited to the custom content only.
You can replace any existing entries by replacing the values from your module.
