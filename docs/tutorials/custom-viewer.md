---
Title: Custom file preview
---

## Custom file preview

Supports dynamically-loaded viewer preview extensions.

See the [ACA monaco extension](https://github.com/eromano/aca-monaco-extension) for
an example of a real working viewer extension project.

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| extension | `string` |  | File extension (.jpg, .png, etc) for the viewer. |
| id | `string` |  | ID string of the component to preview. |
| node | `Node` |  | Node containing the content to display. |
| url | `string` |  | URL of the content in the repository. |

## Details

To create your custom extension viewer you need to create the following files in a separate project:

The Module needs to declare the ID of your extension:

```ts
export class YourExtensionViewerModule {
  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      'your-extension.main.component': YourExtensionViewerComponent
    });
  }
}
```

Your extension contains the business logic:

```ts
import { Node } from '@alfresco/js-api';
import { ViewerExtensionInterface } from '@alfresco/adf-extensions';

@Component({
  selector: 'your-extension-viewer',
  template: '<div> This is your custom extension viewer template</div>',
  styleUrls: ['./your-extension-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class YourExtensionViewerComponent implements ViewerExtensionInterface {

  showToolbar = true;

  @Input()
  url: string;

  @Input()
  node: Node;
  
  
  ....YOUR CUSTOM LOGIC
}
```

You also need to provide in your `app.extension.json` its details:

```JSON
{
  "$version": "1.0.0",
  "$name": "my viewer extension",
  "$description": "my viewer  plugin",
  "features": {
    "viewer": {
      "content": [
        {
          "id": "my.custom.viewer",
          "fileExtension": ["png", "jpg"],
          "component": "your-extension.main.component"
        }
      ]
    }
  }
}
```

You can also use the `*` wildcard symbol to make your custom viewer implementation handle all files:

```json
{
  "$version": "1.0.0",
  "$name": "my viewer extension",
  "$description": "my viewer  plugin",
  "features": {
    "viewer": {
      "content": [
        {
          "id": "my.custom.viewer",
          "fileExtension": "*",
          "component": "your-extension.main.component"
        }
      ]
    }
  }
}
```
