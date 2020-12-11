---
Title: File Viewer
---

# File Viewer

The File Viewer has been created using the [ViewerComponent](https://www.alfresco.com/abn/adf/core/viewer.component/) from ADF.

The Viewer has four main areas:

![File Viewer](../images/File-Viewer.png)

1. [Header & Toolbar](#header-and-toolbar)
2. [Content](#content)
3. [Thumbnails side pane](#thumbnails-side-pane)
4. [Viewer Controls](#viewer-controls)

## Header and Toolbar

The Header & Toolbar section of the viewer contains a number of features that relate to the file currently being displayed:

- Close 'X' will return the user to the folder that contains the file.
- The name and file type icon is shown in the middle.
- Next and previous buttons will be displayed either side of the file name so that users can navigate to other files in the folder without navigating away from the viewer.
- Finally, on the right hand side an actions toolbar provides users with the ability to download, favorite, move, copy, delete, manage versions and view info panel.

## Content

The File Viewer consists of four separate views that handle displaying the content based on four types of content, covering various [file/mime](https://www.alfresco.com/abn/adf/core/viewer.component/#supported-file-formats) types:

- Document View: PDF files are displayed in the application File Viewer, for other document types (DOCX etc) then a PDF rendition is automatically retrieved.
- Image View: JPEG, PNG, GIF, BMP and SVG images are natively displayed in the application File Viewer.
- Media View: MP4, MP3, WAV, OGG and WEBM files are played natively application File Viewer. The File Viewer will download, by default, 50MB of the content at a time to ensure a smooth playback of the content.
- Text View: TXT, XML, JS, HTML, JSON and TS files are natively displayed as text in the application File Viewer.

## Thumbnails side pane

The Document View includes a thumbnails pane which can be activated by a button in the Viewer Actions toolbar. Clicking on a thumbnail will take a user directly to the selected page and as users scroll through a document the current page is highlighted in the pane.

## Viewer Controls

At the bottom of the content the Viewer Controls allow users to interact with the content in various ways; the actions available are dependant on the type of content being displayed.

- Document View:
  - Activate/Deactivate thumbnails pane
  - Previous/Next page
  - Jump to page number
  - Zoom in/out
  - Fit to page
  - Print
- Image View:
  - Zoom in/out
  - Rotate left/right (does not alter content in the repository)
  - Reset image
  - Print
- Media View:
  - Play/pause
  - Timeline position
  - Toggle audio
  - Audio volume
  - Full screen

## Details

The viewer can be invoked by calling [ViewNodeAction](../extending/application-actions). This method supports a second parameter `ViewNodeExtras` which affects the behaviour on opening and closing hte viewer as detailed bellow.

```typescript
// ViewNodeExtras

export interface ViewNodeExtras {
  location?: string;
  path?: string;
}
```

```typescript
// app.routes.ts
export const APP_ROUTES: Routes = [
  {
      path: 'custom-path',
      children: [
          {
              path: '',
              component: CustomComponent
          },
          {
              path: 'view/:nodeId',
              outlet: 'viewer',
              children: [
                  {
                      path: '',
                      loadChildren: './components/viewer/viewer.module#AppViewerModule'
                  }
              ]
          }
      ]
  }
]
```

```typescript
// custom-component.component.ts

import { ViewNodeAction } from '@alfresco/aca-shared/store';
import { Router } from '@angular/router';

@Component({...})
export class CustomComponent {
    constructor(private store: Store<AppStore>, private router: Router) {}

    viewNode(nodeId: string) {
        this.store.dispatch(new ViewNodeAction(nodeId, { location: this.router.url }));
    }
}
```

In the above example, passing `location` when calling `ViewNodeAction` will open the viewer relative to current activated route _/custom-path/(viewer:view/nodeId)_.

If no location is passed, the viewer will default to open on a [predefined route](https://github.com/Alfresco/alfresco-content-app/blob/develop/src/app/app.routes.ts#L58). In this case, in order to get back to original location from where the viewer was invoked, `ViewNodeAction` should be called by passing a `path`.

```typescript
// when invoked from an extension
this.store.dispatch(new ViewNodeAction(nodeId, { path: this.router.url }));
```
