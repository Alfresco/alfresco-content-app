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

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "toolbar": [
      {
        "id": "app.toolbar.share",
        "rules": {
          "visible": "app.record.canShareRecord"
        }
      }
    ]
  } 
}
```

**Handling Multiple Extensions**

When multiple extensions rely on the same component, the visibility rules from all extensions 
should be **passed as an array**. This way, the rules will be merged and evaluated, ensuring that all conditions
from different extensions are considered. 

For example, if the `app.toolbar.share` component is modified by both the `Extension1` and 
`Extension2` extensions, the visibility rules will be combined:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "Extension1",

  "features": {
    "toolbar": [
      {
        "id": "app.toolbar.share",
        "rules": {
          "visible": ["extension1.rule1"]
        }
      }
    ]
  } 
}
```

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "Extension2",

  "features": {
    "toolbar": [
      {
        "id": "app.toolbar.share",
        "rules": {
          "visible": ["extension2.rule2"]
        }
      }
    ]
  } 
}
```

In this case, the component will be visible only if both extension1.rule1 and extension2.rule2 evaluate to true.

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


**Tips:** 
1. You can also negate any rule by utilizing a `!` prefix: `!app.navigation.isTrashcan` is the opposite of the `app.navigation.isTrashcan`.
2. See the [Registration](./registration) section for more details on how to register your own entries to be re-used at runtime.
3. See [Rules List](./rules-list.md) for a full list of rules available with the Alfresco Content Application

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
