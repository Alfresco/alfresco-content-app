---
Title: Custom Icons
---

# Custom Icons

You can register and use custom `.svg` icons with toolbars, context menus, etc.

The icons are declared in the `features.icons` section, for example:

```json
{
  "features": {
    "icons": [
      {
        "id": "adf:join_library",
        "value": "./assets/images/join-library.svg"
      },
      {
        "id": "adf:move_file",
        "value": "./assets/images/adf-move-file-24px.svg"
      }
    ]
  }
}
```

The `id` value must conform to the format `[namespace]:[name]`,
similar to that of the [Material Icon](https://material.angular.io/components/icon/api) component.
The icon file path should be relative to the deployed application root (or `index.html` file);

After that, you can use the icon id with other elements, for example:

```json
{
  "id": "app.toolbar.move",
  "order": 500,
  "title": "APP.ACTIONS.MOVE",
  "icon": "adf:move_file",
  "actions": {
    "click": "MOVE_NODES"
  }
}
```

It is also possible to override the icon value or disable the entry from within external extensions.
