<p class="danger">
  Work is still in progress, the documentation and examples may change.
</p>

# Extending

Application extensibility is performed via the root `/src/assets/app.extensions.json`,
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
    ]
}
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
<br/><br/>
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
    ]
}
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
| app.layout.main | LayoutComponent | Main application layout with the menu bar, navigation sidebar and main content area to project your components. |
| app.components.trashcan | TrashcanComponent | Trashcan component, used for demo purposes. |
| app.toolbar.toggleInfoDrawer | ToggleInfoDrawerComponent | The toolbar button component that toggles Info Drawer for the selection. |
| app.toolbar.toggleFavorite | ToggleFavoriteComponent | The toolbar button component that toggles Favorite state for the selection. |

<p class="tip">
See [Registration](#registration) section for more details
on how to register your own entries to be re-used at runtime.
</p>

## Actions

## Content Actions

## Application Actions

Below is the list of public actions you can dispatch from any part of the code.

<p class="tip">
Many of the actions take currently selected nodes if no payload provided.
That simplifies declaring and invoking actions from the extension files.
</p>

| Name | Payload | Description |
| --- | --- | --- |
| SET_CURRENT_FOLDER | Node | Notify components about currently opened folder. |
| SET_CURRENT_URL | string | Notify components about current browser URL. |
| SET_USER_PROFILE | Person | Assign current user profile. |
| TOGGLE_INFO_DRAWER | n/a | Toggle info drawer for the selected node. |
| ADD_FAVORITE | MinimalNodeEntity[] | Add nodes (or selection) to favorites. |
| REMOVE_FAVORITE | MinimalNodeEntity[] | Removes nodes (or selection) from favorites. |
| DELETE_LIBRARY | string | Delete a Library by id. Takes selected node if payload not provided. |
| CREATE_LIBRARY | n/a | Invoke a "Create Library" dialog. |
| SET_SELECTED_NODES | MinimalNodeEntity[] | Notify components about selected nodes. |
| DELETE_NODES | MinimalNodeEntity[] | Delete the nodes (or selection). Supports undo actions. |
| UNDO_DELETE_NODES | any[] | Reverts deletion of nodes (or selection). |
| RESTORE_DELETED_NODES | MinimalNodeEntity[] | Restores deleted nodes (or selection). Typically used with Trashcan. |
| PURGE_DELETED_NODES | MinimalNodeEntity[] | Permanently delete nodes (or selection). Typically used with Trashcan. |
| DOWNLOAD_NODES | MinimalNodeEntity[] | Download nodes (or selections). Creates a ZIP archive for folders or multiple items. |
| CREATE_FOLDER | string | Invoke a "Create Folder" dialog for the opened folder (or the parent folder id in the payload). |
| EDIT_FOLDER | MinimalNodeEntity | Invoke an "Edit Folder" dialog for the node (or selection). |
| SHARE_NODE | MinimalNodeEntity | Invoke a "Share" dialog for the node (or selection). |
| UNSHARE_NODES | MinimalNodeEntity[] | Remove nodes (or selection) from the shared nodes (does not remove content). |
| COPY_NODES | MinimalNodeEntity[] | Invoke a "Copy" dialog for the nodes (or selection). Supports undo actions. |
| MOVE_NODES | MinimalNodeEntity[] | Invoke a "Move" dialog for the nodes (or selection). Supports undo actions. |
| MANAGE_PERMISSIONS | MinimalNodeEntity | Invoke a "Manage Permissions" dialog for the node (or selection). |
| MANAGE_VERSIONS | MinimalNodeEntity | Invoke a "Manage Versions" dialog for the node (or selection). |
| NAVIGATE_URL | string | Navigate to a given route URL within the application. |
| NAVIGATE_ROUTE | any[] | Navigate to a particular Route (supports parameters) |
| NAVIGATE_FOLDER | MinimalNodeEntity | Navigate to a folder based on the Node properties. |
| NAVIGATE_PARENT_FOLDER | MinimalNodeEntity | Navigate to a containing folder based on the Node properties. |
| SEARCH_BY_TERM | string | Perform a simple search by the term and navigate to Search results. |
| SNACKBAR_INFO | string | Show information snackbar with the message provided. |
| SNACKBAR_WARNING | string | Show warning snackbar with the message provided. |
| SNACKBAR_ERROR | string | Show error snackbar with the message provided. |
| UPLOAD_FILES | n/a | Invoke "Upload Files" dialog and upload files to the currently opened folder. |
| UPLOAD_FOLDER | n/a | Invoke "Upload Folder" dialog and upload selected folder to the currently opened one. |
| VIEW_FILE | MinimalNodeEntity | Preview the file (or selection) in the Viewer. |

## Rules

Rules allow evaluating conditions for extension components.
For example, you can disable or hide elements based on certain rules.

Every rule is backed by a condition evaluator.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "rules": [
        {
            "id": "app.trashcan",
            "type": "app.navigation.isTrashcan"
        }
    ]
}
```

<p class="tip">
You can also negate any rule by utilizing a `!` prefix:
`!app.navigation.isTrashcan` is the opposite of the `app.navigation.isTrashcan`.
</p>

It is also possible to use inline references to registered evaluators without declaring rules,
in case you do not need providing extra parameters, or chaining multiple rules together.

### Core Evaluators

You can create new rules by chaining other rules and evaluators.

| Key | Description |
| --- | --- |
| core.every | Evaluates to `true` if all chained rules evaluate to `true`. |
| core.some | Evaluates to `true` if at least one of the chained rules evaluates to `true`. |
| core.not | Evaluates to `true` if all chained rules evaluate to `false`. |

Below is an example of the composite rule definition that combines the following conditions:

* user has selected a single file
* user is not using **Trashcan** page

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "rules": [
        {
            "id": "app.toolbar.canViewFile",
            "type": "core.every",
            "parameters": [
                {
                    "type": "rule",
                    "value": "app.selection.file"
                },
                {
                    "type": "rule",
                    "value": "core.not",
                    "parameters": [
                        {
                            "type": "rule",
                            "value": "app.navigation.isTrashcan"
                        }
                    ]
                }
            ]
        }
    ]
}
```

You can now declare a toolbar button action that is based on the rule above.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "content": {
            "actions": [
                {
                    "id": "app.toolbar.preview",
                    "type": "button",
                    "title": "View File",
                    "icon": "open_in_browser",
                    "actions": {
                        "click": "VIEW_FILE"
                    },
                    "rules": {
                        "visible": "app.toolbar.canViewFile"
                    }
                },
            ]
        }
    }
}
```

The button will be visible only when the linked rule evaluates to `true`.

### Application Evaluators

| Key | Description |
| --- | --- |
| app.selection.canDelete | User has permission to delete selected node(s). |
| app.selection.canDownload | User can download selected node(s). |
| app.selection.notEmpty | At least one node is selected. |
| app.selection.canUnshare | User is able to remove selected node(s) from public sharing. |
| app.selection.canAddFavorite | User can add selected node(s) to favorites. |
| app.selection.canRemoveFavorite | User can remove selected node(s) from favorites. |
| app.selection.first.canUpdate | User has permission to update selected node(s). |
| app.selection.file | A single File node is selected. |
| app.selection.file.canShare | User is able to remove selected file from public sharing. |
| app.selection.library | A single Library node is selected. |
| app.selection.folder | A single Folder node is selected. |
| app.selection.folder.canUpdate | User has permissions to update selected folder. |

### Navigation Evaluators

The application exposes a set of navigation-related evaluators
to help developers restrict or enable certain actions based on the route or page displayed.

The negated evaluators are provided just to simplify development,
and to avoid having a complex rule trees just to negate the rules,
for example mixing `core.every` and `core.not`.

<p class="tip">
You can also negate any rule by utilizing a `!` prefix:
`!app.navigation.isTrashcan` is the opposite of the `app.navigation.isTrashcan`.
</p>

| Key | Description |
| --- | --- |
| app.navigation.folder.canCreate | User can create content in the currently opened folder. |
| app.navigation.folder.canUpload | User can upload content to the currently opened folder. |
| app.navigation.isTrashcan | User is using **Trashcan** page. |
| app.navigation.isNotTrashcan | Current page is not a **Trashcan**.  |
| app.navigation.isLibraries | User is using **Libraries** page. |
| app.navigation.isNotLibraries | Current page is not **Libraries**. |
| app.navigation.isSharedFiles | User is using **Shared Files** page. |
| app.navigation.isNotSharedFiles | Current page is not **Shared Files**. |
| app.navigation.isFavorites | User is using **Favorites** page. |
| app.navigation.isNotFavorites | Current page is not **Favorites** |
| app.navigation.isRecentFiles | User is using **Recent Files** page. |
| app.navigation.isNotRecentFiles | Current page is not **Recent Files**. |
| app.navigation.isSearchResults | User is using **Search Results** page. |
| app.navigation.isNotSearchResults | Current page is not **Search Results**. |

<p class="tip">
See [Registration](#registration) section for more details
on how to register your own entries to be re-used at runtime.
</p>

#### Example

The rule in the example below evaluates to `true` if all the conditions are met:

- user has selected node(s)
- user is not using **Trashcan** page
- user is not using **Libraries** page

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "rules": [
        {
            "id": "app.toolbar.canCopyNode",
            "type": "core.every",
            "parameters": [
                { "type": "rule", "value": "app.selection.notEmpty" },
                { "type": "rule", "value": "app.navigation.isNotTrashcan" },
                { "type": "rule", "value": "app.navigation.isNotLibraries" }
            ]
        }
    ]
}
```

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

## Creating custom evaluator

Rule evaluators are plain JavaScript (or TypeScript) functions
that take `RuleContext` reference and an optional list of `RuleParameter` instances.

Application provides a special [RuleEvaluator](https://github.com/Alfresco/alfresco-content-app/blob/master/src/app/extensions/rule.extensions.ts#L30) type alias for evaluator functions:

```js
export type RuleEvaluator = (context: RuleContext, ...args: any[]) => boolean;
```

Create a function that is going to check if user has selected one or multiple nodes.

```javascript
export function hasSelection(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    return !context.selection.isEmpty;
}
```

The `context` is a reference to a special instance of the [RuleContext](https://github.com/Alfresco/alfresco-content-app/blob/master/src/app/extensions/rule.extensions.ts#L32) type,
that provides each evaluator access to runtime entities.

```javascript
export interface RuleContext {
    selection: SelectionState;
    navigation: NavigationState;
    permissions: NodePermissions;

    getEvaluator(key: string): RuleEvaluator;
}
```

The `SelectionState` interface exposes information about global selection state:

```javascript
export interface SelectionState {
    count: number;
    nodes: MinimalNodeEntity[];
    libraries: SiteEntry[];
    isEmpty: boolean;
    first?: MinimalNodeEntity;
    last?: MinimalNodeEntity;
    folder?: MinimalNodeEntity;
    file?: MinimalNodeEntity;
    library?: SiteEntry;
}
```

Next, register the function you have created earlier with the `ExtensionService` and give it a unique identifier:

```js
extensions.setEvaluators({
    'plugin1.rules.hasSelection': hasSelection
});
```

Now, the `plugin1.rules.hasSelection` evaluator can be used as an inline rule reference,
or part of the composite rule like `core.every`.


<p class="tip">
See [Registration](#registration) section for more details
on how to register your own entries to be re-used at runtime.
</p>
