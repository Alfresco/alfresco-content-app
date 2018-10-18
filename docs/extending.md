---
title: Extending
---

<!-- markdownlint-disable MD033 -->




         |





### Content Actions

Most of the UI elements that operate with content, like toolbar buttons or menus,
are based on `ContentActionRef` interface implementation:

```ts
interface ContentActionRef {
  id: string;
  type: ContentActionType;

  title?: string;
  description?: string;
  order?: number;
  icon?: string;
  disabled?: boolean;
  children?: Array<ContentActionRef>;
  component?: string;
  actions?: {
    click?: string;
    [key: string]: string;
  };
  rules?: {
    enabled?: string;
    visible?: string;
    [key: string]: string;
  };
}
```

You can define content actions in the `app.extensions.json` file using the structure above.

### Create Menu

Provides extension endpoint for the "NEW" menu options.

You can populate the menu with an extra entries like in the example below:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "create": [
      {
        "id": "plugin1.create.folder",
        "icon": "create_new_folder",
        "title": "Create Folder (plugin1)",
        "actions": {
          "click": "CREATE_FOLDER"
        },
        "rules": {
          "enabled": "app.navigation.folder.canCreate"
        }
      },
      {
        "id": "plugin1.create.uploadFile",
        "icon": "file_upload",
        "title": "Upload Files (plugin1)",
        "actions": {
          "click": "UPLOAD_FILES"
        },
        "rules": {
          "enabled": "app.navigation.folder.canUpload"
        }
      }
    ]
  }
}
```

Please refer to the [Content Actions](#content-actions) section for more details on supported properties.

<p class="tip">
It is also possible to update or disable existing entries from within the external extension files. You will need to know the `id` of the target element to customize.
</p>

### Navigation Bar

The Navigation bar consists of Link elements (`NavBarLinkRef`) organized into Groups (`NavBarGroupRef`).

```ts
export interface NavBarGroupRef {
  id: string;
  items: Array<NavBarLinkRef>;

  order?: number;
  disabled?: boolean;
}

export interface NavBarLinkRef {
  id: string;
  icon: string;
  title: string;
  route: string;

  url?: string; // evaluated at runtime based on route ref
  description?: string;
  order?: number;
  disabled?: boolean;
}
```

Your extensions can perform the following actions at runtime:

- Register new groups with links
- Insert new links into existing groups
- Update properties of the existing links
- Disable existing links or entire groups

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "navbar": [
      {
        "id": "app.navbar.primary",
        "items": [
          {
            "id": "app.navbar.personalFiles",
            "icon": "folder",
            "title": "Personal Files",
            "route": "personal-files"
          },
          {
            "id": "app.navbar.libraries",
            "icon": "group_work",
            "title": "Libraries",
            "route": "libraries"
          }
        ]
      },
      {
        "id": "app.navbar.secondary",
        "items": [
          {
            "id": "app.navbar.shared",
            "icon": "people",
            "title": "Shared",
            "route": "shared"
          }
        ]
      }
    ]
  }
}
```

### Sidebar (Info Drawer)

You can provide the following customizations for the Sidebar (aka Info Drawer) component:

- Add extra tabs with custom components
- Disable tabs from the main application or extensions
- Replace content or properties of existing tabs

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "sidebar": [
      {
        "id": "app.sidebar.properties",
        "order": 100,
        "title": "Properties",
        "component": "app.components.tabs.metadata"
      },
      {
        "id": "app.sidebar.comments",
        "order": 200,
        "title": "Comments",
        "component": "app.components.tabs.comments"
      }
    ]
  }
}
```

The example above renders two tabs:

- `Properties` tab that references the `app.components.tabs.metadata` component
- `Comments` tab that references the `app.components.tabs.comments` component

All corresponding components must be registered for runtime use.

<p class="tip">
See the [Registration](#registration) section for more details
on how to register your own entries to be re-used at runtime.
</p>

#### Tab properties

| Name          | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| **id**        | Unique identifier.                                          |
| **component** | The main [component](#components) to use for the route.     |
| **title**     | Tab title or resource key.                                  |
| icon          | Tab icon                                                    |
| disabled      | Toggles disabled state. Can be assigned from other plugins. |
| order         | The order of the element.                                   |

#### Tab components

Every component you assign for the tab content receives the following additional properties at runtime:

| Name | Type                   | Description                 |
| ---- | ---------------------- | --------------------------- |
| node | MinimalNodeEntryEntity | Node entry to be displayed. |

### Toolbar

The toolbar extension point is represented by an array of Content Action references.

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "toolbar": [
      {
        "id": "app.toolbar.preview",
        "title": "View",
        "icon": "open_in_browser",
        "actions": {
          "click": "VIEW_FILE"
        },
        "rules": {
          "visible": "app.toolbar.canViewFile"
        }
      },
      {
        "id": "app.toolbar.download",
        "title": "Download",
        "icon": "get_app",
        "actions": {
          "click": "DOWNLOAD_NODES"
        },
        "rules": {
          "visible": "app.toolbar.canDownload"
        }
      }
    ]
  }
}
```

The content actions are applied to the toolbars for the following Views:

- Personal Files
- Libraries
- Shared
- Recent Files
- Favorites
- Trash
- Search Results

### Context Menu

Context Menu extensibility is similar to the one of the Toolbar.
You may want to define a list of content actions backed by Rules and wired with Application Actions.

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "contextMenu": [
      {
        "id": "app.context.menu.download",
        "order": 100,
        "title": "Download",
        "icon": "get_app",
        "actions": {
          "click": "DOWNLOAD_NODES"
        },
        "rules": {
          "visible": "app.toolbar.canDownload"
        }
      }
    ]
  }
}
```

Note, you can re-use any rules and evaluators that are available.

In the example above, the context menu action `Download` utilizes the `app.toolbar.canDownload` rule,
declared in the `rules` section:

```json
{
  "rules": [
    {
      "id": "app.toolbar.canDownload",
      "type": "core.every",
      "parameters": [
        { "type": "rule", "value": "app.selection.canDownload" },
        { "type": "rule", "value": "app.navigation.isNotTrashcan" }
      ]
    }
  ]
}
```

### Viewer

Viewer component in ACA supports the following extension points:

- Content Viewers
- Toolbar actions
- `More` toolbar actions
- `Open With` actions

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "viewer": {
      "content": [],
      "toolbarActions:": [],
      "toolbarMoreMenu:": [],
      "openWith": []
    }
  }
}
```

#### Content View

You can provide custom components that render a particular type of the content based on extensions.

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "viewer": {
      "content": [
        {
          "id": "app.viewer.pdf",
          "fileExtension": "pdf",
          "component": "app.components.tabs.metadata"
        },
        {
          "id": "app.viewer.docx",
          "fileExtension": "docx",
          "component": "app.components.tabs.comments"
        }
      ]
    }
  }
}
```

In the example above we replace `PDF` view with the `metadata` tab
and `DOCX` view with the `comments` tab.

Every custom component receives the following properties at runtime:

| Name      | Type                   | Description                 |
| --------- | ---------------------- | --------------------------- |
| node      | MinimalNodeEntryEntity | Node entry to be displayed. |
| url       | string                 | File content URL.           |
| extension | string                 | File name extension.        |

#### Toolbar actions

The default toolbar actions from the ACA viewer can be customized through extensions to be replaced, modified or disabled.
New viewer toolbar actions can also be added from the extensions config:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "viewer": {
      "toolbarActions": [
        {
          "id": "app.viewer.versions",
          "order": 500,
          "title": "APP.ACTIONS.VERSIONS",
          "icon": "history",
          "actions": {
            "click": "MANAGE_VERSIONS"
          },
          "rules": {
            "visible": "app.toolbar.versions"
          }
        }
      ],
      "toolbarMoreMenu": [...]
    }
  }
}
```

The ADF Viewer component allows you to provide custom entries for the `More` menu button on the toolbar.
The ACA provides an extension point for this menu that you can utilize to populate custom menu items:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "viewer": {
      "toolbarActions": [...],
      "toolbarMoreMenu": [
        {
          "id": "app.viewer.share",
          "order": 300,
          "title": "Share",
          "icon": "share",
          "actions": {
            "click": "SHARE_NODE"
          },
          "rules": {
            "visible": "app.selection.file.canShare"
          }
        }
      ]
    }
  }
}
```

#### Open With actions

You can provide a list of `Open With` actions to render with every instance of the Viewer.

In the following example, we create a simple `Snackbar` action reference,
and invoke it from the custom `Open With` menu entry called `Snackbar`.

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "actions": [
    {
      "id": "plugin1.actions.info",
      "type": "SNACKBAR_INFO",
      "payload": "I'm a nice little popup raised by extension."
    }
  ],

  "features": {
    "viewer": {
      "openWith": [
        {
          "id": "plugin1.viewer.openWith.action1",
          "type": "button",
          "icon": "build",
          "title": "Snackbar",
          "actions": {
            "click": "plugin1.actions.info"
          }
        }
      ]
    }
  }
}
```

As with other content actions, custom plugins can disable, update or extend `Open With` actions.

### Content metadata presets

The content metadata presets are needed by the [Content Metadata Component](https://alfresco.github.io/adf-component-catalog/components/ContentMetadataComponent.html#readme) to render the properties of metadata aspects for a given node. 
The different aspects and their properties are configured in the `app.config.json` file, but they can also be set on runtime through extension files.

Configuring these presets from `app.extensions.json` will overwrite the default application setting. 
Settings them from custom plugins allows user to disable, update or extend these presets.
Check out more info about merging extensions [here](#merging-properties).

The `content-metadata-presets` elements can be switched off by setting the `disabled` property.
This can be applied also for nested items, allowing disabling down to aspect level. 

<p class="tip">
In order to modify or disable existing entries, you need to know the id of the target element, along with its parents ids.
</p>

Your extensions can perform the following actions at runtime:
* Add new presets items.
* Add new items to existing presets at any level.
* Disable specific items down to the aspect level.
* Modify any existing item based on id.  

Regarding properties, you can either:
 * Add new properties to existing aspect, or 
 * Redefine the properties of an aspect. 
 
Review this code snippet to see how you can overwrite the properties for `exif:exif` aspect from an external plugin:
```json
  {
     "$schema": "../../../extension.schema.json",
     "$version": "1.0.0",
     "$name": "plugin1",

     "features": {
       "content-metadata-presets": [
         {
           "id": "app.content.metadata.custom",
           "custom": [
             {
               "id": "app.content.metadata.customGroup",
               "items": [
                 {
                   "id": "app.content.metadata.exifAspect",
                   "disabled": true
                 },
                 {
                   "id": "app.content.metadata.exifAspect2",
                   "aspect": "exif:exif",
                   "properties": [
                     "exif:orientation",
                     "exif:manufacturer",
                     "exif:model",
                     "exif:software"
                   ]
                 }
               ]
             }
           ]
         }
       ]
     }
   }
``` 
This external plugin disables the initial `exif:exif` aspect already defined in the `app.extensions.json` and defines other properties for the `exif:exif` aspect. 
Here is the initial setting from `app.extension.json`:
```json
...
    "content-metadata-presets": [
      {
        "id": "app.content.metadata.custom",
        "custom": [
          {
            "id": "app.content.metadata.customGroup",
            "title": "APP.CONTENT_METADATA.EXIF_GROUP_TITLE",
            "items": [
              {
                "id": "app.content.metadata.exifAspect",
                "aspect": "exif:exif",
                "properties": [
                  "exif:pixelXDimension",
                  "exif:pixelYDimension",
                  "exif:dateTimeOriginal",
                  "exif:exposureTime",
                  "exif:fNumber",
                  "exif:flash",
                  "exif:focalLength",
                  "exif:isoSpeedRatings",
                  "exif:orientation",
                  "exif:manufacturer",
                  "exif:model",
                  "exif:software"
                ]
              }
            ]
          }
        ]
      }
    ]
...

``` 
<p class="tip">
In order to allow the content-metadata presets to be extended, the settings from `app.config.json` must be copied to the `app.extensions.json` file and its ids must be added to all the items.
Having ids allows external plugins to extend the current setting.
</p>

## Registration

You can use `ExtensionService` to register custom components, authentication guards,
rule evaluators, etc.

It is recommended to register custom content from within the module constructor.
In that case all plugins will be available right after the main application component is ready.

Update the main application module `app.module.ts`, or create your own module,
and use the following snippet to register custom content:

```typescript
import { ExtensionsModule, ExtensionService } from '@alfresco/adf-extensions';

@NgModule({
    imports: [ ExtensionsModule.forChild() ]
    declarations: [ MyComponent1, MyLayout ],
    entryComponents: [ MyComponent1, MyLayout ]
})
export class MyExtensionModule {

    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'plugin1.components.my': MyComponent1,
            'plugin1.layouts.my': MyLayout
        });

        extensions.setAuthGuards({
            'plugin.auth': MyAuthGuard
        });

        extensions.setEvaluators({
            'plugin1.rules.custom1': MyCustom1Evaluator,
            'plugin1.rules.custom2': MyCustom2Evaluator
        });
    }

}
```

Use `ExtensionsModule.forChild()` when importing into the child modules,
and `ExtensionsModule.forRoot()` for the main application module.

<p class="warning">
According to Angular rules, all components that are created dynamically at runtime
need to be registered within the `entryComponents` section of the NgModule.
</p>

The Registration API is not limited to the custom content only.
You can replace any existing entries by replacing the values from your module.

## Creating custom evaluator

Rule evaluators are plain JavaScript (or TypeScript) functions that take `RuleContext` references and an optional list of `RuleParameter` instances.

Application provides a special [RuleEvaluator](https://github.com/Alfresco/alfresco-content-app/blob/master/src/app/extensions/rule.extensions.ts#L30) type alias for evaluator functions:

```typescript
export type RuleEvaluator = (context: RuleContext, ...args: any[]) => boolean;
```

Create a function that is going to check if a user has selected one or multiple nodes.

```typescript
export function hasSelection(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  return !context.selection.isEmpty;
}
```

The `context` is a reference to a special instance of the [RuleContext](https://github.com/Alfresco/alfresco-content-app/blob/master/src/app/extensions/rule.extensions.ts#L32) type,
that provides each evaluator access to runtime entities.

```typescript
export interface RuleContext {
  selection: SelectionState;
  navigation: NavigationState;
  permissions: NodePermissions;

  getEvaluator(key: string): RuleEvaluator;
}
```

The `SelectionState` interface exposes information about the global selection state:

```typescript
export interface SelectionState {
  count: number;
  nodes: MinimalNodeEntity[];
  libraries: SiteEntry[];
  isEmpty: boolean;
  first?: MinimalNodeEntity;
  last?: MinimalNodeEntity;
  folder?: MinimalNodeEntity;
  file?: MinimalNodeEntity;
  library?: SiteEntry;
}
```

Next, register the function you have created earlier with the `ExtensionService` and give it a unique identifier:

```typescript
extensions.setEvaluators({
  'plugin1.rules.hasSelection': hasSelection
});
```

Now, the `plugin1.rules.hasSelection` evaluator can be used as an inline rule reference,
or part of the composite rule like `core.every`.

<p class="tip">
See the [Registration](#registration) section for more details
on how to register your own entries to be re-used at runtime.
</p>

## Tutorials

### Custom route with parameters

In this tutorial, we are going to implement the following features:

- Update the **Trashcan** component to receive and log route parameters.
- Create a new route that points to the **Trashcan** component and uses the main layout.
- Create an action reference that allows redirecting to the new route.
- Create a button in the **New** menu that invokes an action.

Update `src/app/components/trashcan/trashcan.component.ts` and append the following code to the `ngOnInit` body:

```typescript
import { ActivatedRoute, Params } from '@angular/router';

@Component({...})
export class TrashcanComponent {

    constructor(
        // ...
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // ...

        this.route.params.subscribe(({ nodeId }: Params) => {
            console.log('node: ', nodeId);
        });
    }

}
```

The code above logs the current route parameters to the browser console
and is proof the integration works as expected.

Next, add a new route definition as in the example below:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "routes": [
    {
      "id": "custom.routes.trashcan",
      "path": "ext/trashcan/:nodeId",
      "component": "your.component.id",
      "layout": "app.layout.main",
      "auth": ["app.auth"]
    }
  ]
}
```

The template above creates a new route reference with the id `custom.routes.trashcan` that points to the `ext/trashcan/` route and accepts the `nodeId` parameter.

Also, we are going to use the default application layout (`app.layout.main`)
and authentication guards (`app.auth`).

Next, create an action reference for the `NAVIGATE_ROUTE` application action
and pass route parameters: `/ext/trashcan` for the path, and `10` for the `nodeId` value.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "routes": [...],

    "actions": [
        {
            "id": "custom.actions.trashcan",
            "type": "NAVIGATE_ROUTE",
            "payload": "$(['/ext/trashcan', '10'])"
        }
    ]
}
```

Finally, declare a new menu item for the `NEW` button and use the `custom.actions.trashcan` action created above.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "routes": [...],
    "actions": [...],

    "features": {
        "create": [
            {
                "id": "custom.create.trashcan",
                "type": "default",
                "icon": "build",
                "title": "Custom trashcan route",
                "actions": {
                    "click": "custom.actions.trashcan"
                }
            }
        ]
    }
}
```

Now, if you run the application, you should see a new menu item called "Custom Trashcan Route" in the "NEW" dropdown.
Upon clicking this item you should navigate to the `/ext/trashcan/10` route containing a **Trashcan** component.

Check the browser console output and ensure you have the following output:

```text
node:  10
```

You have successfully created a new menu button that invokes your custom action
and redirects you to the extra application route.

### Dialog actions

In this tutorial, we are going to create an action that invokes a custom material dialog.

<p class="tip">
Please read more details on Dialog components here: [Dialog Overview](https://material.angular.io/components/dialog/overview)
</p>

#### Create a dialog

```sh
ng g component dialogs/my-extension-dialog --module=app
```

According to Angular rules, the component needs to also be registered within the `entryComponents` section of the module.

Update the `src/app/app.module.ts` file according to the example below:

```ts
@NgModule({
  imports: [...],
  declarations: [
    ...,
    MyExtensionDialogComponent
  ],
  entryComponents: [
    ...,
    MyExtensionDialogComponent
  ]
})
```

Update `my-extension-dialog.component.ts`:

```ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'aca-my-extension-dialog',
  templateUrl: './my-extension-dialog.component.html',
  styleUrls: ['./my-extension-dialog.component.scss']
})
export class MyExtensionDialogComponent {
  constructor(public dialogRef: MatDialogRef<MyExtensionDialogComponent>) {}
}
```

Update `my-extension-dialog.component.html`:

```html
<h2 mat-dialog-title>Delete all</h2>
<mat-dialog-content>Are you sure?</mat-dialog-content>
<mat-dialog-actions>
  <button mat-button mat-dialog-close>No</button>
  <!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->
  <button mat-button [mat-dialog-close]="true">Yes</button>
</mat-dialog-actions>
```

#### Create an action

Append the following code to the `src/app/store/actions/app.actions.ts`:

```ts
export const SHOW_MY_DIALOG = 'SHOW_MY_DIALOG';

export class ShowMydDialogAction implements Action {
  readonly type = SHOW_MY_DIALOG;
}
```

See also:

- [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)

#### Create an effect

Update `src/app/store/effects/app.effects.ts`:

```ts
import { ShowMydDialogAction, SHOW_MY_DIALOG } from '../actions/app.actions';

@Injectable()
export class AppEffects {
  constructor(...) {}

  @Effect({ dispatch: false })
  showMyDialog$ = this.actions$.pipe(
    ofType<ShowMydDialogAction>(SHOW_MY_DIALOG),
    map(() => {})
  );

  // ...
}
```

See also:

- [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)

Update to raise a dialog

```ts
import { MatDialog } from '@angular/material';
import { MyExtensionDialogComponent } from '../../dialogs/my-extension-dialog/my-extension-dialog.component';

@Injectable()
export class AppEffects {
  constructor(
    ...,
    private dialog: MatDialog
  ) {}

  @Effect({ dispatch: false })
  showMyDialog$ = this.actions$.pipe(
    ofType<ShowMydDialogAction>(SHOW_MY_DIALOG),
    map(() => {
      this.dialog.open(MyExtensionDialogComponent)
    })
  );

  ...

}
```

#### Register a toolbar action

Update the `src/assets/app.extensions.json` file, and insert a new entry to the `features.toolbar` section:

```json
{
  ...,

  "features": {
    "toolbar": [
      {
        "id": "my.custom.toolbar.button",
        "order": 10,
        "title": "Custom action",
        "icon": "extension",
        "actions": {
          "click": "SHOW_MY_DIALOG"
        }
      }
    ]
  }
}
```

Now, once you run the application, you should see an extra button that invokes your dialog on every click.

## Redistributable libraries

Extension libraries are based on the standard Angular libraries and definition files in the JSON format.

<p class="tip">
Please read more details in the following article: [Library support in Angular CLI 6](https://github.com/angular/angular-cli/wiki/stories-create-library#library-support-in-angular-cli-6)
</p>

See also

- The Angular Library Series - Creating a Library with the Angular CLI
  - Part 1: https://blog.angularindepth.com/creating-a-library-in-angular-6-87799552e7e5
  - Part 2: https://blog.angularindepth.com/creating-a-library-in-angular-6-part-2-6e2bc1e14121

### Creating extension library

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

#### Register dynamic components

Update `my-extension.module.ts` and put all the content you plan to use at runtime dynamically to the `entryComponents` section of the module.

```typescript
@NgModule({
  imports: [],
  declarations: [MyExtensionComponent],
  exports: [MyExtensionComponent],
  entryComponents: [MyExtensionComponent]
})
export class MyExtensionModule {}
```

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

#### Plugin definition file

Create a new `assets/my-extension.json` file in the library project root folder with the following content:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",
  "$description": "demo plugin",

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
        ...,

        "build:my-extension":
            "ng build my-extension && cpr projects/my-extension/assets dist/my-extension/assets --deleteFirst"
    }
}
```

You can now use that script to build the library and copy assets to the output folder.

<p class="tip">
It is good practice to provide installation instructions for your library in the `README.md` file.
Be sure to mention that developers should have a build rule to copy your plugin definition file to the `assets/plugins` folder of the main application.
</p>

### Publishing library to NPM

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

<p class="tip">
See more details in the [Publishing your library](https://github.com/angular/angular-cli/wiki/stories-create-library#publishing-your-library) article.
</p>

### Consuming extension library

Assuming you have published your extension library to NPM, you can install it using the standard command:

```sh
npm install my-extension
```

This installs the library and all its dependencies.

<p class="warning">
You do not need to install the library in the original workspace as the application is already configured to use the local version from the `dist` folder.
</p>

#### Copy assets

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

#### Register module

In the main application, edit the `src/app/extensions.module.ts` file and append the module declaration as in the next example:

```typescript
...
import { MyExtensionModule } from 'my-extension';

@NgModule({
    ...
    imports: [
        ...,
        MyExtensionModule
    ]
})
export class AppExtensionsModule {}
```

#### Register plugin

Finally, update the `assets/app.extensions.json` file and add a reference to the new plugin:

```json
{
    "$references": [
        ...,
        "my-extension.json"
    ]
}
```

### Testing library

Run the application and ensure you have an extra navigation sidebar entry:

```sh
npm start
```

Click the `My Extension` link and in the main content area you will see the extension component coming from your library.

<p class="warning">
Depending on the application setup, you may need enabling external plugins via the `Settings` dialog available for `admin` users (clicking the application profile button).
</p>
