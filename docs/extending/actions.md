---
Title: Actions
---

# Actions

Below are the details of the JSON properties that are used to define actions.

| Name | Description |
| -- | -- |
| **id** | Unique identifier. |
| **type** | Action type, see [Application Actions](/extending/application-actions) for more details. |
| **payload** | Action payload, a string containing value or expression. |

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

## Value expressions

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
