<p class="danger">
  Work is still in progress, the documentation and examples may change.
</p>

# Extending

Application extensibility is preformed via the root `app.extensions.json`,
and any number of external plugins that are references of the main entry point.

## Format

The format is represented by a JSON file with at least the following structure:

```json
{
    "$name": "app",
    "$version": "1.0.0",

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

## Components

| Key | Type | Description |
| --- | --- | --- |
| app.layout.main | LayoutComponent | --- |
| app.components.trashcan | TrashcanComponent | --- |
| app.toolbar.toggleInfoDrawer | ToggleInfoDrawerComponent | --- |
| app.toolbar.toggleFavorite | ToggleFavoriteComponent | --- |

## Routes

### Authentication Guards

| Key | Type | Description |
| --- | --- | --- |
| app.auth | AuthGuardEcm | --- |

## Actions

## Content Actions

## Application Actions

| Name | Payload | Description |
| --- | --- | --- |
| SET_APP_NAME | string | --- |
| SET_HEADER_COLOR | string | --- |
| SET_LOGO_PATH | string | --- |
| SET_LANGUAGE_PICKER | boolean | --- |
| SET_SHARED_URL | string | --- |
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
