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

| Key        | Description                                                                   |
| ---------- | ----------------------------------------------------------------------------- |
| core.every | Evaluates to `true` if all chained rules evaluate to `true`.                  |
| core.some  | Evaluates to `true` if at least one of the chained rules evaluates to `true`. |
| core.not   | Evaluates to `true` if all chained rules evaluate to `false`.                 |

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

| Key                                 | Description                                                  |
| ----------------------------------- | ------------------------------------------------------------ |
| app.selection.canDelete             | User has permission to delete selected node(s).              |
| app.selection.canDownload           | User can download selected node(s).                          |
| app.selection.notEmpty              | At least one node is selected.                               |
| app.selection.canUnshare            | User is able to remove selected node(s) from public sharing. |
| app.selection.canAddFavorite        | User can add selected node(s) to favorites.                  |
| app.selection.canRemoveFavorite     | User can remove selected node(s) from favorites.             |
| app.selection.first.canUpdate       | User has permission to update selected node(s).              |
| app.selection.file                  | A single File node is selected.                              |
| app.selection.file.canShare         | User is able to share the selected file.                     |
| app.selection.file.isShared         | A shared node is selected.                                   |
| app.selection.file.isLocked         | File is locked for editing.                                  |
| app.selection.file.isLockOwner      | File is locked and current user is the lock owner.           |
| app.selection.file.canUploadVersion | User can update file version.                                |
| app.selection.library               | A single Library node is selected.                           |
| app.selection.isPrivateLibrary      | A private Library node is selected.                          |
| app.selection.hasLibraryRole        | The selected Library node has a role property.               |
| app.selection.hasNoLibraryRole      | The selected Library node has no role property.              |
| app.selection.folder                | A single Folder node is selected.                            |
| app.selection.folder.canUpdate      | User has permissions to update the selected folder.          |
| app.selection.folder.canUpdate      | User has permissions to update the selected folder.          |
| app.selection.file.canLock          | User has permissions to lock file.                           |
| app.selection.file.canUnlock        | User has permissions to unlock file.                         |
| repository.isQuickShareEnabled      | Whether the quick share repository option is enabled or not. |

## Navigation Evaluators

The application exposes a set of navigation-related evaluators to help developers restrict or enable certain actions based on the route or page displayed.

The negated evaluators are provided just to simplify development, and to avoid having complex rule trees just to negate the rules,
for example mixing `core.every` and `core.not`.

**Tip:** You can also negate any rule by utilizing a `!` prefix:
`!app.navigation.isTrashcan` is the opposite of the `app.navigation.isTrashcan`.

| Key                               | Description                                                      |
| --------------------------------- | ---------------------------------------------------------------- |
| app.navigation.folder.canCreate   | User can create content in the currently opened folder.          |
| app.navigation.folder.canUpload   | User can upload content to the currently opened folder.          |
| app.navigation.isTrashcan         | User is using the **Trashcan** page.                             |
| app.navigation.isNotTrashcan      | Current page is not a **Trashcan**.                              |
| app.navigation.isLibraries        | User is using a **Libraries** or **Library Search Result** page. |
| app.navigation.isNotLibraries     | Current page is not a **Libraries** page.                        |
| app.navigation.isSharedFiles      | User is using the **Shared Files** page.                         |
| app.navigation.isNotSharedFiles   | Current page is not **Shared Files**.                            |
| app.navigation.isFavorites        | User is using the **Favorites** page.                            |
| app.navigation.isNotFavorites     | Current page is not **Favorites**.                               |
| app.navigation.isRecentFiles      | User is using the **Recent Files** page.                         |
| app.navigation.isNotRecentFiles   | Current page is not **Recent Files**.                            |
| app.navigation.isSearchResults    | User is using the **Search Results** page.                       |
| app.navigation.isNotSearchResults | Current page is not the **Search Results**.                      |
| app.navigation.isSharedPreview    | Current page is preview **Shared Files**.                        |
| app.navigation.isFavoritesPreview | Current page is preview **Favorites**.                           |
| app.navigation.isSharedFileViewer | Current page is shared file preview page.                        |
| app.navigation.isPreview          | Current page is **Preview**.                                     |
| app.navigation.isPersonalFiles    | Current page is **Personal Files**.                              |
| app.navigation.isLibraryFiles     | Current page is **Library Files**.                               |

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
