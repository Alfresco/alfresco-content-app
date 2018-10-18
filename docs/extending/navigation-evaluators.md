### Navigation Evaluators

The application exposes a set of navigation-related evaluators to help developers restrict or enable certain actions based on the route or page displayed.

The negated evaluators are provided just to simplify development, and to avoid having complex rule trees just to negate the rules,
for example mixing `core.every` and `core.not`.

<p class="tip">
You can also negate any rule by utilizing a `!` prefix:
`!app.navigation.isTrashcan` is the opposite of the `app.navigation.isTrashcan`.
</p>

| Key                               | Description                                             |
| --------------------------------- | ------------------------------------------------------- |
| app.navigation.folder.canCreate   | User can create content in the currently opened folder. |
| app.navigation.folder.canUpload   | User can upload content to the currently opened folder. |
| app.navigation.isTrashcan         | User is using the **Trashcan** page.                        |
| app.navigation.isNotTrashcan      | Current page is not a **Trashcan**.                     |
| app.navigation.isLibraries        | User is using the **Libraries** page.                       |
| app.navigation.isNotLibraries     | Current page is not **Libraries**.                      |
| app.navigation.isSharedFiles      | User is using the **Shared Files** page.                    |
| app.navigation.isNotSharedFiles   | Current page is not **Shared Files**.                   |
| app.navigation.isFavorites        | User is using the **Favorites** page.                       |
| app.navigation.isNotFavorites     | Current page is not **Favorites**                       |
| app.navigation.isRecentFiles      | User is using the **Recent Files** page.                    |
| app.navigation.isNotRecentFiles   | Current page is not **Recent Files**.                   |
| app.navigation.isSearchResults    | User is using the **Search Results** page.                  |
| app.navigation.isNotSearchResults | Current page is not the **Search Results**.                 |

<p class="tip">
See [Registration](#registration) section for more details
on how to register your own entries to be re-used at runtime.
</p>

#### Example

The rule in the example below evaluates to `true` if all the conditions are met:

- user has selected node(s)
- user is not using the **Trashcan** page
- user is not using the **Libraries** page

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