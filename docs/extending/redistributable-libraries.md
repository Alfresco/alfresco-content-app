---
Title: Redistributable libraries
---

# Redistributable libraries

Extension libraries are based on the standard Angular libraries and definition files in the JSON format.

Please read more details in the following article: [Library support in Angular CLI 6](https://github.com/angular/angular-cli/wiki/stories-create-library#library-support-in-angular-cli-6)

See also

- The Angular Library Series - Creating a Library with the Angular CLI
  - Part 1: https://blog.angularindepth.com/creating-a-library-in-angular-6-87799552e7e5
  - Part 2: https://blog.angularindepth.com/creating-a-library-in-angular-6-part-2-6e2bc1e14121

## Creating extension library

First, generate a new project within the workspace:

```sh
ng generate library my-extension
```

You will get a new project in the `projects/my-extensions` folder.
By default, the project contains at least the following content:

- Example component `my-extension.component.ts`
- Example service `my-extension.service.ts`
- Angular Module example `my-extension.module.ts`

Next, build the project with the following command:

```sh
ng build my-extension
```

Angular CLI automatically configures Typescript path mappings for the project, so that you do not need any additional steps to link the library.

### Register dynamic components

Now we need to register `MyExtensionComponent` as an extension component.
Update the code as in the next example:

```typescript
import { ExtensionService } from '@alfresco/adf-extensions';

@NgModule({...})
export class MyExtensionModule {
    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'my-extension.main.component': MyExtensionComponent,
        });
    }
}
```

Now you can use the `my-extension.main.component` identifier in the JSON definitions
if you want to reference the `MyExtensionComponent`.

### Plugin definition file

Create a new `assets/my-extension.json` file in the library project root folder with the following content:

```json
{
  "$schema": "../../../extension.schema.json",
  "$id": "my-extension",
  "$version": "1.0.0",
  "$vendor": "Your name or company name",
  "$name": "plugin1",
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

Update the root `package.json` file and append the following entry to the `scripts` section:

```json
{
    "scripts": {
        "build:my-extension":
            "ng build my-extension && npx cpr projects/my-extension/assets dist/my-extension/assets --deleteFirst"
    }
}
```

You can now use that script to build the library and copy assets to the output folder.

**Tip:** It is good practice providing installation instructions for your library in the `README.md` file.
Be sure to mention that developers should have a build rule to copy your plugin definition file to the `assets/plugins` folder of the main application.

## Publishing library to NPM

Before you publish you should always rebuild the library:

```sh
npm run build:my-extension
```

Go to the output folder and run the publish command.

```sh
cd dist/my-extension
npm publish
```

Note, you are required to have a valid [NPM](https://www.npmjs.com/) account.

See more details in the [Publishing your library](https://github.com/angular/angular-cli/wiki/stories-create-library#publishing-your-library) article.

## Consuming extension library

Assuming you have published your extension library to NPM, you can install it using the standard command:

```sh
npm install my-extension
```

This installs the library and all its dependencies.

**Note:** You do not need to install the library in the original workspace as the application is already configured to use the local version from the `dist` folder.

### Copy assets

Edit the `angular.json` configuration file and add the following rule if you develop and test extension libraries in the same workspace.

```json
{
  "glob": "**/*.json",
  "input": "dist/my-extension/assets",
  "output": "/assets/plugins"
}
```

Use the following rule if you are installing an extension from NPM:

```json
{
  "glob": "**/*.json",
  "input": "node_modules/my-extension/assets",
  "output": "/assets/plugins"
}
```

### Register module

In the main application, edit the `src/app/extensions.module.ts` file and append the module declaration as in the next example:

```typescript
import { MyExtensionModule } from 'my-extension';

@NgModule({
    imports: [
        MyExtensionModule
    ]
})
export class AppExtensionsModule {}
```

### Register plugin

Finally, update the `src/assets/app.extensions.json` file and add a reference to the new plugin:

```json
{
    "$references": [
        "my-extension.json"
    ]
}
```

## Testing library

Run the application and ensure you have an extra navigation sidebar entry:

```sh
npm start
```

Click the `My Extension` link and in the main content area you will see the extension component coming from your library.

**Note:** Depending on the application setup, you may need enabling external plugins via the `Settings` dialog available for `admin` users (clicking the application profile button).
