---
Title: Application Features
---

# Application Features

This section contains application-specific features that may vary depending on the final implementation.

The ACA supports the following set of extension points:

- Create menu
- Navigation Bar
- Toolbar
- Context Menu
- Viewer
- Sidebar (aka Info Drawer)
- Content metadata presets (for `Properties` tab)
- File list layout
- Search

All the customizations are stored in the `features` section of the configuration file:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "create": [],
    "navbar": [],
    "toolbar": [],
    "contextMenu": [],
    "viewer": {
      "toolbarActions:": [],
      "openWith": [],
      "content": []
    },
    "sidebar": [],
    "content-metadata-presets": []
  }
}
```

Other applications or external plugins can utilise different subsets of the configuration above.
Also, extra entries can be added to the configuration schema.

## Content Actions

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

## Create Menu

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

**Tip:** It is also possible to update or disable existing entries from within the external extension files. You will need to know the `id` of the target element to customize.

## Main action

Add possibility to show application `Main Action` button. The action is going to be shown above the `New` button, additionally `Main Action` will be highlighted as primary button, and `New` as secondary.

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "mainAction": {
        "id": "plugin1.id",
        "type": "button",
        "title": "Create",
        "actions": {
          "click": "MAIN_ACTION_CALL"
        },
        "rules": {
          "enabled": "app.navigation.canCall"
        }
      }
  }
}
```

## Navigation Bar

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

## Sidebar (Info Drawer)

You can provide the following customizations for the Sidebar (aka Info Drawer) component:

- Add extra tabs with custom components
- Disable tabs from the main application or extensions
- Replace content or properties of existing tabs
- Add toolbar buttons

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "sidebar": {
      "toolbar": [
            {
              "id": "app.sidebar.close",
              "order": 100,
              "title": "close",
              "icon": "highlight_off"
            }
      ],
      "tabs": [
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
}
```

The example above renders two tabs with `close` icon:

- `Properties` tab that references the `app.components.tabs.metadata` component
- `Comments` tab that references the `app.components.tabs.comments` component

All corresponding components must be registered for runtime use.

**Tip:** See the [Registration](/extending/registration) section for more details
on how to register your own entries to be re-used at runtime.

### Tab properties

| Name          | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| **id**        | Unique identifier.                                                |
| **component** | The main [component](/extending/components) to use for the route. |
| **title**     | Tab title or resource key.                                        |
| icon          | Tab icon                                                          |
| disabled      | Toggles disabled state. Can be assigned from other plugins.       |
| order         | The order of the element.                                         |

### Tab components

Every component you assign for the tab content receives the following additional properties at runtime:

| Name | Type                   | Description                 |
| ---- | ---------------------- | --------------------------- |
| node | MinimalNodeEntryEntity | Node entry to be displayed. |

## Toolbar

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
- Libraries Search Results

## Context Menu

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

## Viewer

Viewer component in ACA supports the following extension points:

- Content Viewers
- Toolbar actions
- `More` toolbar actions
- `Open With` actions
- Rules

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "viewer": {
      "content": [],
      "toolbarActions:": [],
      "openWith": []
    }
  }
}
```

### Content View

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

#### Rules

You can also provide a rule for the `disabled` state.
That allows to provide conditional availability for Viewer extensions based on external factors.

```json
{
  "id": "app.viewer.pdf",
  "fileExtension": "png",
  "component": "app.components.tabs.metadata",
  "rules": {
    "disabled": "isViewerDisabled"
  }
}
```

### Toolbar actions

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
      ]
    }
  }
}
```

You can also provide sub-menus:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "viewer": {
      "toolbarActions": [
        {
          "id": "app.toolbar.more",
          "type": "menu",
          "order": 10000,
          "icon": "more_vert",
          "title": "APP.ACTIONS.MORE",
          "children": [
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
      ]
    }
  }
}
```

### Open With actions

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

### Rules

You can provide global rules for the Viewer by utilizing the `features.viewer.rules` object:

```ts
export interface ViewerRules {
  /**
   * Checks if user can preview the node.
   */
  canPreview?: string;

  /**
   * Shows navigation options
   */
  showNavigation?: string;
}
```

For example:

```json
{
  "features": {
    "viewer": {
      "rules": {
        "canPreview": "customRule"
      }
    }
  }
}
```

The rule should return `true` if node preview is allowed, otherwise `false`.

## Content metadata presets

The content metadata presets are needed by the [Content Metadata Component](https://www.alfresco.com/abn/adf/docs/content-services/components/content-metadata-card.component/) to render the properties of metadata aspects for a given node.
The different aspects and their properties are configured in the `app.config.json` file, but they can also be set on runtime through extension files.

Configuring these presets from `app.extensions.json` will overwrite the default application setting.
Settings them from custom plugins allows user to disable, update or extend these presets.
Check out more info about merging extensions [here](/extending/extension-format#merging-properties).

The `content-metadata-presets` elements can be switched off by setting the `disabled` property.
This can be applied also for nested items, allowing disabling down to aspect level.

**Tip:** In order to modify or disable existing entries, you need to know the id of the target element, along with its parents ids.

Your extensions can perform the following actions at runtime:

- Add new presets items.
- Add new items to existing presets at any level.
- Disable specific items down to the aspect level.
- Modify any existing item based on id.

Regarding properties, you can either:

- Add new properties to existing aspect, or
- Redefine the properties of an aspect.

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
{
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
}
```

**Tip:** In order to allow the content-metadata presets to be extended, the settings from `app.config.json` must be copied to the `app.extensions.json` file and its ids must be added to all the items.
Having ids allows external plugins to extend the current setting.

## Search

The search configurations are needed by the [Search Filter Component](https://www.alfresco.com/abn/adf/docs/content-services/components/search-filter.component/) to render the filters.

Configuring search from `app.extensions.json` will overwrite/update the application search.

Settings them from custom plugins allows user to disable, update or extend.

Here is the example [extension configuration](https://github.com/Alfresco/alfresco-content-app/blob/develop/src/assets/plugins/app.search.json)
