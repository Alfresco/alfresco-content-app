---
title: Extending
---

<!-- markdownlint-disable MD033 -->

<p class="danger">
  Work is still in progress, the documentation and examples may change.
</p>

# Extending

Application extensibility is performed via the root `/src/assets/app.extensions.json`,
and any number of external plugins that are references of the main entry point.

The application also comes with the `/src/assets/plugins/` folder
already preconfigured to store external files.

You can create plugins that change, toggle or extend the following areas:

* Navigation sidebar links and groups
* Context Menu
* Sidebar (aka Info Drawer)
* Toolbar entries
  * buttons
  * menu buttons
  * separators
* Viewer actions
  * "Open With" entries
  * "More actions" toolbar entries

Extensions can also:

* Overwrite or disable extension points of the main application or other plugins
* Change rules, actions or any visual element
* Register new application routes based on empty pages or layouts
* Register new rule evaluators, components, guards, etc.

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

### Startup behaviour

First, the root `app.extensions.json` is loaded by means of the special `Loader` service.
The file can contain all the necessary declarations for an application to function,
and having extra plugin files is fully optional.

Next, the `Loader` traverses the `$references` metadata and loads additional files if provided.
For the sake of speed the files are loaded in parallel,
however, once everything is loaded, they are applied in the order of declaration.

After all the external files are fetched, the `Loader` sorts them, removes the metadata properties
and stacks the resulting JSON objects on top of each other.

<p class="tip">
Any top-level property name that starts with the `$` symbol is considered a metadata and does not participate in merge process.
That allows a plugin to carry extra information for maintenance and visualisation purposes,
for example: `$name`, `$version`, `$description`, `$license`, etc.
</p>

#### Merging properties

There are no limits in the JSON structure and level of nesting.
All objects are merged into a single set based on property keys and object IDs (for arrays).

Before: Plugin 1

```json
{
    "$name": "plugin1",
    "plugin1.key": "value",
    "plugin1.text": "string"
}
```

Before: Plugin 2

```json
{
    "$name": "plugin2",
    "plugin2.key": "value",
    "plugin1.text": "custom string"
}
```

Final result:

```json
{
    "plugin1.key": "value",
    "plugin1.text": "custom string",
    "plugin2.key": "value"
}
```

Note that as a result we have two unique properties `plugin1.key` and `plugin2.key`,
and also a `plugin1.text` that was first defined in the `Plugin 1`, but then overwritten by the `Plugin 2`.

<p class="tip">
JSON merging is very powerful concept as it gives you abilities to alter any base application settings,
or toggle features in other plugins without rebuilding the application or corresponding plugin libraries.
</p>

#### Merging objects

The complex objects are merged by properties. This process is recursive and has no limits for nesting levels.

Before: Plugin 1

```json
{
    "$name": "plugin1",
    "features": {
        "title": "some title",
        "page1": {
            "title": "page 1"
        }
    }
}
```

Before: Plugin 2

```json
{
    "$name": "plugin2",
    "features": {
        "page1": {
            "title": "custom title"
        },
        "page2": {
            "title": "page 2"
        }
    }
}
```

Final result:

```json
{
    "features": {
        "title": "some title",
        "page1": {
            "title": "custom title"
        },
        "page2": {
            "title": "page 2"
        }
    }
}
```

As you can see, the unique properties get merged together in a single object.
However the last non-unique property always wins and overwrites the previous value.

As per current design it is not possible to delete any application property from the plugin.
The loader engine supports only overwriting values on purpose.
Many components however support the `disabled` property you can change from external definition:

Before: Plugin 1

```json
{
    "$name": "plugin1",
    "feature1": {
        "disabled": false,
        "text": "some-feature",
        "icon": "some-icon"
    }
}
```

Before: Plugin 2

```json
{
    "$name": "plugin2",
    "feature1": {
        "disabled": true
    }
}
```

Final result:

```json
{
    "feature1": {
        "disabled": true,
        "text": "some-feature",
        "icon": "some-icon"
    }
}
```

You can find more details in the [Disabling Content](#disabling-content) section

#### Merging arrays

The extension `Loader` provides a special support for merging Arrays.
By default, two collections will be merged into a single array unless objects have `id` properties.

<p class="tip">
If array contains two objects with the same `id` property, the objects will be merged rather than appended.
</p>

Before: Plugin 1

```json
{
    "$name": "plugin1",
    "features": [
        { "text": "common 1" },
        {
            "id": "page1",
            "text": "page 1"
        }
    ]
}
```

Before: Plugin 2

```json
{
    "$name": "plugin2",
    "features": [
        { "text": "common 2" },
        {
            "id": "page1",
            "text": "custom page"
        }
    ]
}
```

Final result:

```json
{
    "features": [
        { "text": "common 1" },
        { "text": "common 2" },
        {
            "id": "page1",
            "text": "custom page"
        }
    ]
}
```

Note that objects with the same `page1` identifiers were merged while other unique entries were appended to the resulting array.

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
| layout | The layout [component](#components) to use for the route. |
| auth | List of [authentication guards](#authentication-guards). Defaults to `[ "app.auth" ]`. |
| data | Custom property bag to carry with the route. |

Use the `app.layout.main` value for the `layout` property to get the default application layout,
with header, navigation sidebar and main content area.
You can register any component to back the `app.layout.main` value.

<p class="tip">
By default, the `app.layout.main` is used if you do not specify any custom values.
Use `blank` if you want your route component take the whole page.
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

<p class="warning">
All application routes require at least one authentication guard.
Defaults to the `['app.auth']` value.
</p>

### Authentication Guards

Below is the list of the authentication guards main application registers on startup.

| Key | Type | Description |
| --- | --- | --- |
| app.auth | AuthGuardEcm | ADF guard, validates ACS authentication and redirects to Login if needed. |

You can refer those guards from within your custom extensions,
or [register](#registration) your custom implementations.

## Components

You can register any Angular component to participate in extensibility.

The components are used to create custom:

* routes and pages
* toolbar buttons
* menu items

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

Note that custom extensions can also replace any existing component at runtime by a known identifier,
besides registering a new one.

## Actions

| Name | Description |
| --- | --- |
| **id** | Unique identifier. |
| **type** | Action type, see [Application Actions](#application-actions) for more details. |
| *payload* | Action payload, a string containing value or expression. |

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "actions": [
        {
            "id": "plugin1.actions.settings",
            "type": "NAVIGATE_URL",
            "payload": "/settings"
        },
        {
            "id": "plugin1.actions.info",
            "type": "SNACKBAR_INFO",
            "payload": "I'm a nice little popup raised by extension."
        },
        {
            "id": "plugin1.actions.node-name",
            "type": "SNACKBAR_INFO",
            "payload": "$('Action for ' + context.selection.first.entry.name)"
        }
    ]
}
```

### Value expressions

You can use light-weight expression syntax to provide custom parameters for the action payloads.

```text
$(<expression>)
```

Expressions are valid JavaScript blocks that evaluate to values.

Examples:

```text
$('hello world')                //  'hello world'
$('hello' + ', ' + 'world')     //  'hello, world'
$(1 + 1)                        //  2
$([1, 2, 1 + 2])                //  [1, 2, 3]
```

## Application Actions

Application is using NgRx (Reactive libraries for Angular, inspired by Redux).
To get more information on NxRx please refer to the following resources:

* [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)

Most of the application features are already exposed in the form of NgRx Actions and corresponding Effects.
You can invoke any action via a single `Store` dispatcher, similar to the following:

```typescript
export class MyComponent {

    constructor(private store: Store<AppStore>) {}

    onClick() {
        this.store.dispatch(new SearchByTermAction('*'));
    }

}
```

The code above demonstrates a simple 'click' handler that invokes `Search by Term` feature
and automatically redirects user to the **Search Results** page.

Another example demonstrates viewing a node from a custom application service API:

```typescript
export class MyService {

    constructor(private store: Store<AppStore>) {}

    viewFile(node: MinimalNodeEntity) {
        this.store.dispatch(new ViewFileAction(node));
    }
}
```

### Using with Extensions

You can invoke every application action from the extensions, i.e. buttons, menus, etc.

<p class="tip">
Many of the actions take currently selected nodes if no payload provided.
That simplifies declaring and invoking actions from the extension files.
</p>

In the example below, we create a new entry to the "NEW" menu dropdown
and provide a new `Create Folder (plugin1)` command that invokes the `CREATE_FOLDER` application action.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "create": [
            {
                "id": "plugin1.create.folder",
                "type": "default",
                "icon": "create_new_folder",
                "title": "Create Folder (plugin1)",
                "actions": {
                    "click": "CREATE_FOLDER"
                }
            }
        ]
    }
}
```

The `CREATE_FOLDER` action will trigger corresponding NgRx Effects to show the dialog
and perform document list reload if needed.

Below is the list of public actions types you can use in the plugin definitions as a reference to the action:

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

Rules can accept other rules as parameters:

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "rules": [
        {
            "id": "app.toolbar.favorite.canAdd",
            "type": "core.every",
            "parameters": [
                { "type": "rule", "value": "app.selection.canAddFavorite" },
                { "type": "rule", "value": "app.navigation.isNotRecentFiles" },
                { "type": "rule", "value": "app.navigation.isNotSharedFiles" },
                { "type": "rule", "value": "app.navigation.isNotSearchResults" }
            ]
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
        "toolbar": [
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
| app.selection.file.canShare | User is able share selected file. |
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

* user has selected node(s)
* user is not using **Trashcan** page
* user is not using **Libraries** page

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

## Application Features

This section contains application-specific features that may vary depending on the final implementation.

The ACA supports the following set of extension points:

* Create menu
* Navigation Bar
* Toolbar
* Context Menu
* Viewer
* Sidebar (aka Info Drawer)

All the customisations are stored in the `features` section of the configuration file:

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
            "toolbar:": [],
            "openWith": [],
            "content": []
        },
        "sidebar": []
    }
}
```

Other applications or external plugins can utilise different subsets of the configuration above.
Also, extra entries can be added to the configuration schema.

### Content Actions

Most of the UI elements that operate with content, like toolbar buttons or menus,
are based on `ContentActionRef` interface implementation:

```ts
interface ContentActionRef {
    id: string;
    type: ContentActionType;

    title?: string;
    description?: string;
    order?: number;
    icon?: string;
    disabled?: boolean;
    children?: Array<ContentActionRef>;
    component?: string;
    actions?: {
        click?: string;
        [key: string]: string;
    };
    rules?: {
        enabled?: string;
        visible?: string;
        [key: string]: string;
    };
}
```

You can define content actions in the `app.extensions.json` file using the structure above.

### Create Menu

Provides extension endpoint for the "NEW" menu options.

You can populate the menu with an extra entries like in the example below:

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "create": [
            {
                "id": "plugin1.create.folder",
                "icon": "create_new_folder",
                "title": "Create Folder (plugin1)",
                "actions": {
                    "click": "CREATE_FOLDER"
                },
                "rules": {
                    "enabled": "app.navigation.folder.canCreate"
                }
            },
            {
                "id": "plugin1.create.uploadFile",
                "icon": "file_upload",
                "title": "Upload Files (plugin1)",
                "actions": {
                    "click": "UPLOAD_FILES"
                },
                "rules": {
                    "enabled": "app.navigation.folder.canUpload"
                }
            }
        ]
    }
}
```

Please refer to the [Content Actions](#content-actions) section for more details on supported properties.

<p class="tip">
It is also possible to update or disable existing entries from within the external extension files. You will need to know the `id` of the target element to customise.
</p>

### Navigation Bar

Navigation bar consists of Link elements (`NavBarLinkRef`) organized into Groups (`NavBarGroupRef`).

```ts
export interface NavBarGroupRef {
    id: string;
    items: Array<NavBarLinkRef>;

    order?: number;
    disabled?: boolean;
}

export interface NavBarLinkRef {
    id: string;
    icon: string;
    title: string;
    route: string;

    url?: string; // evaluated at runtime based on route ref
    description?: string;
    order?: number;
    disabled?: boolean;
}
```

You extensions can perform the following actions at runtime:

* Register new groups with links
* Insert new links into existing groups
* Update properties of the existing links
* Disable existing links or entire groups

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "navbar": [
            {
                "id": "app.navbar.primary",
                "items": [
                    {
                        "id": "app.navbar.personalFiles",
                        "icon": "folder",
                        "title": "Personal Files",
                        "route": "personal-files"
                    },
                    {
                        "id": "app.navbar.libraries",
                        "icon": "group_work",
                        "title": "Libraries",
                        "route": "libraries"
                    }
                ]
            },
            {
                "id": "app.navbar.secondary",
                "items": [
                    {
                        "id": "app.navbar.shared",
                        "icon": "people",
                        "title": "Shared",
                        "route": "shared"
                    }
                ]
            }
        ]
    }
}
```

### Sidebar (Info Drawer)

You can provide the following customisations for the Sidebar (aka Info Drawer) component:

* Add extra tabs with custom components
* Disable tabs from the main application or extensions
* Replace content or properties of existing tabs

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "sidebar": [
            {
                "id": "app.sidebar.properties",
                "order": 100,
                "title": "Properties",
                "component": "app.components.tabs.metadata"
            },
            {
                "id": "app.sidebar.comments",
                "order": 200,
                "title": "Comments",
                "component": "app.components.tabs.comments"
            }
        ]
    }
}
```

The example above renders two tabs:

* `Properties` tab that references `app.components.tabs.metadata` component
* `Comments` tab that references `app.components.tabs.comments` component

All corresponding components must be registered for runtime use.

<p class="tip">
See [Registration](#registration) section for more details
on how to register your own entries to be re-used at runtime.
</p>

#### Tab properties

| Name | Description |
| --- | --- |
| **id** | Unique identifier. |
| **component** | The main [component](#components) to use for the route. |
| **title** | Tab title or resource key. |
| icon | Tab icon |
| disabled | Toggles disabled state. Can be assigned from other plugins. |
| order | The order of the element. |

#### Tab components

Every component you assign for the tab content receives the following additional properties at runtime:

| Name | Type | Description |
| --- | --- | --- |
| node | MinimalNodeEntryEntity | Node entry to be displayed. |

### Toolbar

The toolbar extension point is represented by an array of Content Action references.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "toolbar": [
            {
                "id": "app.toolbar.preview",
                "title": "View",
                "icon": "open_in_browser",
                "actions": {
                    "click": "VIEW_FILE"
                },
                "rules": {
                    "visible": "app.toolbar.canViewFile"
                }
            },
            {
                "id": "app.toolbar.download",
                "title": "Download",
                "icon": "get_app",
                "actions": {
                    "click": "DOWNLOAD_NODES"
                },
                "rules": {
                    "visible": "app.toolbar.canDownload"
                }
            }
        ]
    }
}
```

The content actions are applied to the toolbars for the following Views:

* Personal Files
* Libraries
* Shared
* Recent Files
* Favorites
* Trash
* Search Results

### Context Menu

Context Menu extensibility is similar to the one of the Toolbar.
You may want to define a list of content actions backed by Rules and wired with Application Actions.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "contextMenu": [
            {
                "id": "app.context.menu.download",
                "order": 100,
                "title": "Download",
                "icon": "get_app",
                "actions": {
                    "click": "DOWNLOAD_NODES"
                },
                "rules": {
                    "visible": "app.toolbar.canDownload"
                }
            },
        ]
    }
}
```

Note that you can re-use any rules and evaluators available.

In the example above, the context menu action `Download` utilizes the `app.toolbar.canDownload` rule,
declared in the `rules` section:

```json
{
    "rules": [
        {
            "id": "app.toolbar.canDownload",
            "type": "core.every",
            "parameters": [
                { "type": "rule", "value": "app.selection.canDownload" },
                { "type": "rule", "value": "app.navigation.isNotTrashcan" }
            ]
        }
    ]
}
```

### Viewer

Viewer component in ACA supports the following extension points:

* Content Viewers
* `More` toolbar actions
* `Open With` actions

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "viewer": {
            "content": [],
            "toolbar:": [],
            "openWith": []
        }
    }
}
```

#### Content View

You can provide custom components that render particular type of the content based on extensions.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "viewer": {
            "content": [
                {
                    "id": "app.viewer.pdf",
                    "fileExtension": "pdf",
                    "component": "app.components.tabs.metadata"
                },
                {
                    "id": "app.viewer.docx",
                    "fileExtension": "docx",
                    "component": "app.components.tabs.comments"
                }
            ]
        }
    }
}
```

In the example above we replace `PDF` view with the `metadata` tab
and `DOCX` view with the `comments` tab.

Every custom component receives the following properties at runtime:

| Name | Type | Description |
| --- | --- | --- |
| node | MinimalNodeEntryEntity | Node entry to be displayed. |
| url | string | File content URL. |
| extension | string | File name extension. |

#### Toolbar actions

The ADF Viewer component allows providing custom entries for the `More` menu button on the toolbar.
The ACA provides an extension point for this menu that you can utilise to populate custom menu items:

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "viewer": {
            "toolbar:": [
                {
                    "id": "app.viewer.share",
                    "order": 300,
                    "title": "Share",
                    "icon": "share",
                    "actions": {
                        "click": "SHARE_NODE"
                    },
                    "rules": {
                        "visible": "app.selection.file.canShare"
                    }
                }
            ]
        }
    }
}
```

#### Open With actions

You can provide a list of `Open With` actions to render with every instance of the Viewer.

In the following example, we create a simple `Snackbar` action reference,
and invoke it from the custom `Open With` menu entry called `Snackbar`.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "actions": [
        {
            "id": "plugin1.actions.info",
            "type": "SNACKBAR_INFO",
            "payload": "I'm a nice little popup raised by extension."
        },
    ],

    "features": {
        "viewer": {
            "openWith": [
                {
                    "id": "plugin1.viewer.openWith.action1",
                    "type": "button",
                    "icon": "build",
                    "title": "Snackbar",
                    "actions": {
                        "click": "plugin1.actions.info"
                    }
                }
            ]
        }
    }
}
```

As with other content actions, custom plugins can disable, update or extend `Open With` actions.

## Registration

You can use `ExtensionService` to register custom components, authentication guards,
rule evaluators, etc.

It is recommended to register custom content from within the module constructor.
In that case all plugins will be available right after main application component is ready.

Update the main application module `app.module.ts`, or create your own module,
and use the following snippet to register custom content:

```typescript
import { ExtensionsModule, ExtensionService } from '@alfresco/adf-extensions';

@NgModule({
    imports: [ ExtensionsModule.forChild() ]
    declarations: [ MyComponent1, MyLayout ],
    entryComponents: [ MyComponent1, MyLayout ]
})
export class MyExtensionModule {

    constructor(extensions: ExtensionService) {
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
    }

}
```

Use `ExtensionsModule.forChild()` when importing into the child modules,
and `ExtensionsModule.forRoot()` for the main application module.

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

```typescript
export type RuleEvaluator = (context: RuleContext, ...args: any[]) => boolean;
```

Create a function that is going to check if user has selected one or multiple nodes.

```typescript
export function hasSelection(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    return !context.selection.isEmpty;
}
```

The `context` is a reference to a special instance of the [RuleContext](https://github.com/Alfresco/alfresco-content-app/blob/master/src/app/extensions/rule.extensions.ts#L32) type,
that provides each evaluator access to runtime entities.

```typescript
export interface RuleContext {
    selection: SelectionState;
    navigation: NavigationState;
    permissions: NodePermissions;

    getEvaluator(key: string): RuleEvaluator;
}
```

The `SelectionState` interface exposes information about global selection state:

```typescript
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

```typescript
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

## Tutorials

### Custom route with parameters

In this tutorial, we are going to implement the following features:

* update the **Trashcan** component to receive and log route parameters
* create a new route that points to the **Trashcan** component and uses main layout
* create an action reference that allows redirecting to the new route
* create a button in the **New** menu that invokes an action

Update `src/app/components/trashcan/trashcan.component.ts` and append the following code to the `ngOnInit` body:

```typescript
import { ActivatedRoute, Params } from '@angular/router';

@Component({...})
export class TrashcanComponent {

    constructor(
        // ...
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // ...

        this.route.params.subscribe(({ nodeId }: Params) => {
            console.log('node: ', nodeId);
        });
    }

}
```

The code above logs current route parameters to the browser console
and is a simple proof the integration works as expected.

Next, add a new route definition as in the example below:

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "routes": [
        {
            "id": "custom.routes.trashcan",
            "path": "ext/trashcan/:nodeId",
            "component": "app.components.trashcan",
            "layout": "app.layout.main",
            "auth": [ "app.auth" ]
        }
    ]
}
```

The template above creates a new route reference with the id `custom.routes.trashcan` that points to the `ext/trashcan/` route and accepts the `nodeId` parameter.

Also, we are going to use default application layout (`app.layout.main`)
and authentication guards (`app.auth`).

Next, create an action reference for the `NAVIGATE_ROUTE` application action
and pass route parameters: `/ext/trashcan` for the path, and `10` for the `nodeId` value.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "routes": [...],

    "actions": [
        {
            "id": "custom.actions.trashcan",
            "type": "NAVIGATE_ROUTE",
            "payload": "$(['/ext/trashcan', '10'])"
        }
    ]
}
```

Finally, declare a new menu item for the `NEW` button and use the `custom.actions.trashcan` action created above.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "routes": [...],
    "actions": [...],

    "features": {
        "create": [
            {
                "id": "custom.create.trashcan",
                "type": "default",
                "icon": "build",
                "title": "Custom trashcan route",
                "actions": {
                    "click": "custom.actions.trashcan"
                }
            }
        ]
    }
}
```

Now, if you run the application, you should see a new menu item called "Custom Trashcan Route" in the "NEW" dropdown.
Upon clicking this item you should navigate to the `/ext/trashcan/10` route containing a **Trashcan** component.

Check the browser console output and ensure you have the following output:

```text
node:  10
```

You have successfully created a new menu button that invokes your custom action
and redirects you to the extra application route.
