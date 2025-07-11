---
Title: How to create your first extension
---

The purpose of this tutorial is to describe how to develop a “hello world” extension for the [Alfresco Content Application (aka ACA)](https://github.com/Alfresco/alfresco-content-app "https://github.com/Alfresco/alfresco-content-app"). The [ACA extension mechanism](https://alfresco-content-app.netlify.app/#/extending/ "https://alfresco-content-app.netlify.app/#/extending/") is the suggested way to customise the supported front-end application, and this tutorial is supposed to be the foundation for a content to share with customers and partners.

# Prerequisites

The starting point for this tutorial is the availability of the full repository of the [Alfresco Content Application (aka ACA)](https://github.com/Alfresco/alfresco-content-app "https://github.com/Alfresco/alfresco-content-app") on your development environment (your laptop as an example). This tutorial has been written with the following versions of the software:
-   ACA version 5.3.0,
-   ACS 23.4,
-   NodeJs version 18.20.3

# Creating the ACA extension

First create a folder where you would like to place the extensions. i.e. `/extensions`.

Then run the `@nx/angular` library generator using the following command as a template:
```console
npx nx generate @nx/angular:library --name=@myorg/my-extension --buildable=true --directory=extensions/myextension --publishable=true --importPath=@myorg/my-extension --projectNameAndRootFormat=as-provided --no-interactive
```

where `name` is the name of the library, `directory` is a directory where the library is placed and `importPath` is the library name used for the import, like `@myorg/my-awesome-lib`. This must be a valid npm package name.

See the official [Nx Angular library](https://nx.dev/nx-api/angular/generators/library) documentation for more details.

Next to validate the changed verify the following:

- Check in `tsconfig.base.json` that an import path exists and points to the correct entry point:
- 
```json
{
  "paths" : {
    "@myorg/my-extension": [
      "extensions/my-extension/src/index.ts"
    ]
  }
}
```

- Test if npm i is working:

# Developing the basics of the ACA extension

Now that the `my-extension` is created, let's add the proper configuration to the extension module.
For this purpose, edit the `extensions/my-extension/src/lib/my-extension.module.ts` file changing what is described below:

```typescript
import { NgModule } from '@angular/core';

import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { provideTranslations } from '@alfresco/adf-core';

import { MyExtensionComponent } from './my-extension.component';
import { MyExtensionService } from './my-extension.service';

@NgModule({
  imports: [MyExtensionComponent],
  providers: [
    provideTranslations('my-extension', 'assets/my-extension'),
    MyExtensionService,
    provideExtensionConfig(['my-extension.json']),
  ]
})
export class MyExtensionModule {
  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      'my-extension.main.component': MyExtensionComponent,
    });
  }
}
```

It's now time for the configuration of the brand new extension. For this purpose, you are going instruct the extension to add a link that you can see on the left menu of the landing page of ACA.

To create the proper configuration, create the folder below in the described path.

    extensions/my-extension/assets

Once done, create the descriptor file `extensions/my-extension/assets/my-extension.json` file with the following content.
Please keep in mind that:
 - The file name must be unique inside the application.
 - Choose a name that does not conflict with other extensions.
 - The descriptor file follows the schema in `extension.schema.json`

```json
    {
      "$id": "my-extension-id",
      "$version": "1.0.0",
      "$vendor": "Your name or company name",
      "$name": "your plugin name",
      "$description": "demo plugin",
      "$license": "MIT",
      
      "routes": [ 
      {
        "id": "my.extension.route",
        "path": "ext/my/route",
        "component": "my-extension.main.component"
      }
    ],
      
      "features": { 
        "navbar": [
          {
            "id": "my.extension.nav",
            "items": [
              {
                "id": "my.extension.main",
                "icon": "extension",
                "title": "My Extension",
                "route": "my.extension.route"
            } 
          ]
        }
      ]
    }
    }

```

This is a very basic example, adding a “My Extension” item to the existing left menu, implementing a blank page containing “my-extension works!“ text appearing in the ACA landing page. From here, you can enrich the capabilities of your extension following the documentation at [https://alfresco-content-app.netlify.app/#/extending/](https://alfresco-content-app.netlify.app/#/extending/ "https://alfresco-content-app.netlify.app/#/extending/").

# Making the extension as part of the ACA application

Now that the ACA extension is developed in its initial version, let's add the extension module to the list of the ones used by the application. To complete the task, edit the `src/app/extensions.module.ts` file as described below.

```typescript
// Add the following import to the page.
import { MyExtensionModule } from 'my-extension';

@NgModule({
  imports: [MyExtensionModule]
})
export class AppExtensionsModule {}
```

In addition, edit the `src/assets/app.extensions.json` file on the `$references` array. Below how it should look like.

    "$references": ["my-extension.json"],

Let's instruct the configuration file for the extension to be visible from the ACA app through a public URL. To complete the task, edit the angular.json file as described below.

    // Add to 'src/app.config.json' array.
    ...
    {
      "glob": "my-extension.json",
      "input": "projects/my-extension/assets",
      "output": "./assets/plugins"
    },
    ...

Last but not least, edit the package.json file to allow the build of the extension, adding the following line to the scripts section.

    { ...
      "scripts": {
        ...,
        "build:my-extension": "nx build my-extension && npx cpr extensions/my-extension/assets dist/my-extension/assets --deleteFirst"
    }, ...
  }

Once done, create the build of the extension running the following command.

    npm install my-extension

# Running ACA with the extension included

Now that everything is properly developed, it’s time to launch ADW and see the result. To launch ADW, run the following command from a terminal.

    npm start

What you should see is a new item in left menu of the landing page for ACA, implementing the route to a new page with the following content. Below the screenshot describing what it should look like.

![extension](../images/extension-01.png)
