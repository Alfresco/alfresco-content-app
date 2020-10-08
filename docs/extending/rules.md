---
Title: Rules
---

# Rules

Rules allow you to evaluate conditions for extension components, so you can disable or hide elements based on certain rules, for example.

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

**Tip:** You can also negate any rule by utilizing a `!` prefix:
`!app.navigation.isTrashcan` is the opposite of the `app.navigation.isTrashcan`.

It is also possible to use inline references to registered evaluators without declaring rules,
in case you do not need providing extra parameters, or chaining multiple rules together.

## Core Evaluators

You can create new rules by chaining other rules and evaluators.

| Version | Key        | Description                                                                   |
| ------- | ---------- | ----------------------------------------------------------------------------- |
| 1.7.0   | core.every | Evaluates to `true` if all chained rules evaluate to `true`.                  |
| 1.7.0   | core.some  | Evaluates to `true` if at least one of the chained rules evaluates to `true`. |
| 1.7.0   | core.not   | Evaluates to `true` if all chained rules evaluate to `false`.                 |

Below is an example of the composite rule definition that combines the following conditions:

- user has selected a single file
- user is not using the **Trashcan** page

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
      }
    ]
  }
}
```

The button will be visible only when the linked rule evaluates to `true`.

## Application Evaluators

| Ver.  | Key                                 | Description                                                              |
| ----- | ----------------------------------- | ------------------------------------------------------------------------ |
| 1.7.0 | app.selection.canDelete             | User has permission to delete selected node(s).                          |
| 1.7.0 | app.selection.canDownload           | User can download selected node(s).                                      |
| 1.7.0 | app.selection.notEmpty              | At least one node is selected.                                           |
| 1.7.0 | app.selection.canUnshare            | User is able to remove selected node(s) from public sharing.             |
| 1.7.0 | app.selection.canAddFavorite        | User can add selected node(s) to favorites.                              |
| 1.7.0 | app.selection.canRemoveFavorite     | User can remove selected node(s) from favorites.                         |
| 1.7.0 | app.selection.first.canUpdate       | User has permission to update selected node(s).                          |
| 1.7.0 | app.selection.file                  | A single File node is selected.                                          |
| 1.7.0 | app.selection.file.canShare         | User is able to share the selected file.                                 |
| 1.7.0 | app.selection.file.isShared         | A shared node is selected.                                               |
| 1.7.0 | app.selection.file.isLocked         | File is locked for editing.                                              |
| 1.7.0 | app.selection.file.isLockOwner      | File is locked and current user is the lock owner.                       |
| 1.7.0 | app.selection.file.canUploadVersion | User can update file version.                                            |
| 1.7.0 | app.selection.library               | A single Library node is selected.                                       |
| 1.7.0 | app.selection.isPrivateLibrary      | A private Library node is selected.                                      |
| 1.7.0 | app.selection.hasLibraryRole        | The selected Library node has a role property.                           |
| 1.7.0 | app.selection.hasNoLibraryRole      | The selected Library node has no role property.                          |
| 1.7.0 | app.selection.folder                | A single Folder node is selected.                                        |
| 1.7.0 | app.selection.folder.canUpdate      | User has permissions to update the selected folder.                      |
| 1.7.0 | app.selection.folder.canUpdate      | User has permissions to update the selected folder.                      |
| 1.7.0 | app.selection.file.canLock          | User has permissions to lock file.                                       |
| 1.7.0 | app.selection.file.canUnlock        | User has permissions to unlock file.                                     |
| 1.7.0 | repository.isQuickShareEnabled      | Whether the quick share repository option is enabled or not.             |
| 1.8.0 | canCopyNode                         | Checks if user can copy selected node.                                   |
| 1.8.0 | canToggleJoinLibrary                | Checks if user can perform "Join" or "Cancel Join Request" on a library. |
| 1.8.0 | canEditFolder                       | Checks if user can edit the selected folder.                             |
| 1.8.0 | isTrashcanItemSelected              | Checks if user has trashcan item selected.                               |
| 1.8.0 | canViewFile                         | Checks if user can view the file.                                        |
| 1.8.0 | canLeaveLibrary                     | Checks if user can **Leave** selected library.                           |
| 1.8.0 | canToggleSharedLink                 | Checks if user can toggle shared link mode.                              |
| 1.8.0 | canShowInfoDrawer                   | Checks if user can show **Info Drawer** for the selected node.           |
| 1.8.0 | canManageFileVersions               | Checks if user can manage file versions for the selected node.           |
| 1.8.0 | canManagePermissions                | Checks if user can manage permissions for the selected node.             |
| 1.8.0 | canToggleEditOffline                | Checks if user can toggle **Edit Offline** mode for selected node.       |
| 1.8.0 | user.isAdmin                        | Checks if user is admin.                                                 |
| 1.9.0 | app.canShowLogout                   | Whether logout action should be present or not.                          |
| 1.12.0 | app.isLibraryManager               | Checks if user is library manager.                                       |

## Navigation Evaluators

The application exposes a set of navigation-related evaluators to help developers restrict or enable certain actions based on the route or page displayed.

The negated evaluators are provided just to simplify development, and to avoid having complex rule trees just to negate the rules,
for example mixing `core.every` and `core.not`.

**Tip:** You can also negate any rule by utilizing a `!` prefix:
`!app.navigation.isTrashcan` is the opposite of the `app.navigation.isTrashcan`.

| Version | Key                               | Description                                                      |
| ------- | --------------------------------- | ---------------------------------------------------------------- |
| 1.7.0   | app.navigation.folder.canCreate   | User can create content in the currently opened folder.          |
| 1.7.0   | app.navigation.folder.canUpload   | User can upload content to the currently opened folder.          |
| 1.7.0   | app.navigation.isTrashcan         | User is using the **Trashcan** page.                             |
| 1.7.0   | app.navigation.isNotTrashcan      | Current page is not a **Trashcan**.                              |
| 1.7.0   | app.navigation.isLibraries        | User is using a **Libraries** or **Library Search Result** page. |
| 1.7.0   | app.navigation.isNotLibraries     | Current page is not a **Libraries** page.                        |
| 1.7.0   | app.navigation.isSharedFiles      | User is using the **Shared Files** page.                         |
| 1.7.0   | app.navigation.isNotSharedFiles   | Current page is not **Shared Files**.                            |
| 1.7.0   | app.navigation.isFavorites        | User is using the **Favorites** page.                            |
| 1.7.0   | app.navigation.isNotFavorites     | Current page is not **Favorites**.                               |
| 1.7.0   | app.navigation.isRecentFiles      | User is using the **Recent Files** page.                         |
| 1.7.0   | app.navigation.isNotRecentFiles   | Current page is not **Recent Files**.                            |
| 1.7.0   | app.navigation.isSearchResults    | User is using the **Search Results** page.                       |
| 1.7.0   | app.navigation.isNotSearchResults | Current page is not the **Search Results**.                      |
| 1.7.0   | app.navigation.isSharedPreview    | Current page is preview **Shared Files**.                        |
| 1.7.0   | app.navigation.isFavoritesPreview | Current page is preview **Favorites**.                           |
| 1.7.0   | app.navigation.isSharedFileViewer | Current page is shared file preview page.                        |
| 1.7.0   | app.navigation.isPreview          | Current page is **Preview**.                                     |
| 1.7.0   | app.navigation.isPersonalFiles    | Current page is **Personal Files**.                              |
| 1.7.0   | app.navigation.isLibraryFiles     | Current page is **Library Files**.                               |

**Tip:** See the [Registration](/extending/registration) section for more details
on how to register your own entries to be re-used at runtime.

### Example

The rule in the example below evaluates to `true` if all the conditions are met:

- user has selected node(s)
- user is not using the **Trashcan** page
- user is not using a **Libraries** page (**My Libraries**, **Favorite Libraries** or **Libraries Search Results** pages)

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
