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
