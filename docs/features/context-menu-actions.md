---
Title: Context Menu Actions
---

# Context Menu Actions

Context Menu Component, appearing on right-clicking a document list item, contains Actions executable on particular file or folder. This entry describes two ways of populating Context Menu.

**Important:** Those two ways are ***mutually exclusive***.

## Default behavior

When using `acaContextActions` directive as shown below, Context Menu actions are loaded from `app.extensions.json` by default.

```html
<adf-document-list
    #documentList
    acaContextActions>
</adf-document-list>
```

*Note:* To learn more, see [Extensibility features](../extending/extensibility-features.md) and [Extension format](../extending/extension-format.md).

## Injecting Context Menu Actions

In order to inject custom actions into Context Menu, assign an array of rules, formatted as described in [Extension format](../extending/extension-format.md), to an attribute of a Component using [Document List Component](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/content-services/components/document-list.component.md).

```ts
const contextMenuAction = [
  {
    "id": "custom.action.id",
    "title": "CUSTOM_ACTION",
    "order": 1,
    "icon": "adf:custom-icon",
    "actions": {
      "click": "CUSTOM_ACTION"
    },
    "rules": {
      "visible": "show.custom.action"
    }
  },
  {
    "id": "another.custom.action.id"

    ...
  }
]

...

@Component({...})
export class ComponentWithDocumentList {
    customContextMenuActions = contextMenuActions;
    
    ...
}
```

Next, pass them to `customActions` input of `acaContextActions` directive inside component's template.

```html
<adf-document-list
    #documentList
    acaContextActions
    customActions="customContextMenuActions">
</adf-document-list>
```

*Note:* Refer to [Application Actions](../extending/application-actions.md) and [Rules](../extending/rules.md) for information on creating custom *"actions"* and *"rules"* for Context Menu actions.
