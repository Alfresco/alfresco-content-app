---
Title: File preview
---

### File preview from a plugin with custom route

There might be scenarios where you build a plugin with a custom route, and from that route you might want to preview a file within an overlay.
When having a plugin's entry point in a custom route, using the `/view` root-level application routes for previewing a file might be contradictory, since hitting any of these urls results a navigation away from the original route implying a reload of the original route's entry component when closing the preview panel (navigating back).

#### Example

Let's say you have a custom plugin with which you can start a process with any of your files. The plugin registers a custom route (`start-process`) with its entry component, where the user can start a process.
In this component the user can fill in a form with different values for text fields and selectboxes and select a file. But for file selection, we would like to provide a preview functionality (with the `PreviewComponent` provided by the core application) to let the user be sure that the right file was selected. Obviously having a form filled in values (but not saved) means, that we don't want to loose our filled in data just because we are previewing a file. Because of this we would like the file preview to be opened in an overlay mode. The core application has one overlay region already defined for this reason, called `viewer`. This is the named router outlet we need to target without route change.

#### Solution

In our plugin we need to do the following steps:

##### Registering the custom route in the plugin.json

We need to add the custom route with our entry component and its child route for the preview:

```json
{
  "routes": [
    {
      "id": "start-process",
      "path": "start-process",
      "parentRoute": "",
      "layout": "app.layout.main",
      // The component we register to be our entry point for this particular route
      "component": "myplugin.components.start-process",
      "children": [
        {
          "id": "start-process-preview",
          // It can be accessed on the "/start-process(viewer:preview/nodeId)" route
          "path": "preview/:nodeId",
          "component": "app.components.preview",
          "data": {
            // Using history.back() when closing the preview
            "navigateBackAsClose": true,
            // Disabling complex action and buttons for the preview
            "simplestMode": true
          },
          // We would like to target that named router outlet which is used for the viewer overlay
          "outlet": "viewer"
        }
      ]
    }
  ]
}
```

##### Dispatching the right action within our component to open the file preview

```ts
import { PluginPreviewAction } from '@alfresco/aca-shared/store';

@Component({...})
export class StartProcessComponent {
  onFilePreview({ nodeId }) {
      this.store.dispatch(new PluginPreviewAction('start-process-cloud', nodeId));
  }
}
```
