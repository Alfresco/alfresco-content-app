### Core Evaluators

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