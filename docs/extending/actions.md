## Actions

| Name      | Description                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| **id**    | Unique identifier.                                                             |
| **type**  | Action type, see [Application Actions](#application-actions) for more details. |
| _payload_ | Action payload, a string containing value or expression.                       |

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