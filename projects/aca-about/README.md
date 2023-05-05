# About Plugin for Alfresco Content App

Provides the "About" page for ACA and ACA-based apps.

## Installing

Import the module into the application:

```ts
// src/app/extensions.module.ts

import { AcaAboutModule } from '@alfresco/aca-about';

@NgModule({
  imports: [
    // other modules
    AcaAboutModule
  ]
})
export class AcaAboutModule {}
```

Update the `app.extensions.json` extension configuration to enable extra routes and components:

```json
{
  "actions": [
    {
      "id": "app.actions.about",
      "type": "NAVIGATE_URL",
      "payload": "/about"
    }
  ],

  "routes": [
    {
      "id": "app.about",
      "path": "about",
      "layout": "app.layout.main",
      "component": "app.about.component"
    }
  ],

  "features": {
    "header": [
      {
        "id": "app.header.more",
        "children": [
          {
            "id": "app.header.about",
            "order": 100,
            "title": "APP.BROWSE.ABOUT.TITLE",
            "description": "APP.BROWSE.ABOUT.TITLE",
            "icon": "info",
            "actions": {
              "click": "app.actions.about"
            }
          }
        ]
      }
    ]
  }
}
```

Alternatively, you can use the `assets/about.plugin.json` file.

Compile and distribute/run the application.
