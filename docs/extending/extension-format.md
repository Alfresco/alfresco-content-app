---
Title: Extension format
---

# Extension format

The format is represented by a JSON file with the structure similar to the following:

```json
{
  "$id": "unique.id",
  "$name": "extension.name",
  "$version": "1.0.0",
  "$vendor": "author.name",
  "$license": "license",
  "$runtime": "1.5.0",
  "$description": "some description",

  "routes": [],
  "actions": [],
  "rules": [],
  "features": {}
}
```

## Schema

You can find the JSON schema at the project root folder: `extension.schema.json`.

**Tip:** The Schema allows you to validate extension files, provides code completion and documentation hints.

```json
{
  "$schema": "../../extension.schema.json",
  "$name": "app",
  "$version": "1.0.0"
}
```

## Multiple files

You can have multiple extension files distributed separately.
All additional files are linked via the `$references` property.
The order of declaration defines the order of loading.

```json
{
  "$schema": "../../extension.schema.json",
  "$name": "app",
  "$version": "1.0.0",
  "$references": ["plugin1.json", "plugin2.json"]
}
```

**Note:** All extension files are merged together at runtime.
This allows plugins to overwrite the code from the main application or to alter other plugins.

## Startup behavior

First, the root `app.extensions.json` is loaded by means of the special `Loader` service.
The file can contain all the necessary declarations for an application to function. Extra plugin files are fully optional.

Next, the `Loader` traverses the `$references` metadata and loads additional files if provided.
For the sake of speed the files are loaded in parallel, however once everything is loaded, they are applied in the order of declaration.

After all the external files are fetched, the `Loader` sorts them, removes the metadata properties and stacks the resulting JSON objects on top of each other.

**Tip:** Any top-level property name that starts with the `$` symbol is considered metadata and does not participate in the merge process.
That allows a plugin to carry extra information for maintenance and visualisation purposes, for example: `$name`, `$version`, `$description`, `$license`, etc.

### Merging properties

There are no limits in the JSON structure and level of nesting.
All objects are merged into a single set based on property keys and object IDs (for arrays).

Before: Plugin 1

```json
{
  "$name": "plugin1",
  "plugin1.key": "value",
  "plugin1.text": "string"
}
```

Before: Plugin 2

```json
{
  "$name": "plugin2",
  "plugin2.key": "value",
  "plugin1.text": "custom string"
}
```

Final result:

```json
{
  "plugin1.key": "value",
  "plugin1.text": "custom string",
  "plugin2.key": "value"
}
```

Note that as a result we have two unique properties `plugin1.key` and `plugin2.key`,
and also a `plugin1.text` that was first defined in the `Plugin 1`, but then overwritten by the `Plugin 2`.

**Tip:** JSON merging is a very powerful concept as it gives you the ability to alter any base application settings,
or toggle features in other plugins without rebuilding the application or corresponding plugin libraries.

### Merging objects

The complex objects are merged by properties. This process is recursive and has no limits for nesting levels.

Before: Plugin 1

```json
{
  "$name": "plugin1",
  "features": {
    "title": "some title",
    "page1": {
      "title": "page 1"
    }
  }
}
```

Before: Plugin 2

```json
{
  "$name": "plugin2",
  "features": {
    "page1": {
      "title": "custom title"
    },
    "page2": {
      "title": "page 2"
    }
  }
}
```

Final result:

```json
{
  "features": {
    "title": "some title",
    "page1": {
      "title": "custom title"
    },
    "page2": {
      "title": "page 2"
    }
  }
}
```

You can see the unique properties get merged together in a single object.
However the last non-unique property overwrites the previous value.

Using the current design it is not possible to delete any application property from the plugin.
The loader engine only supports overwriting values. Many components however support the `disabled` property you can change using an external definition:

Before: Plugin 1

```json
{
  "$name": "plugin1",
  "feature1": {
    "disabled": false,
    "text": "some-feature",
    "icon": "some-icon"
  }
}
```

Before: Plugin 2

```json
{
  "$name": "plugin2",
  "feature1": {
    "disabled": true
  }
}
```

Final result:

```json
{
  "feature1": {
    "disabled": true,
    "text": "some-feature",
    "icon": "some-icon"
  }
}
```

You can find more details in the [Disabling Content](#disabling-content) section

### Merging arrays

The extension `Loader` provides a special support for merging Arrays.
By default, two collections will be merged into a single array unless objects have `id` properties.

**Tip:** If the array contains two objects with the same `id` property, the objects will be merged rather than appended.

Before: Plugin 1

```json
{
  "$name": "plugin1",
  "features": [
    { "text": "common 1" },
    {
      "id": "page1",
      "text": "page 1"
    }
  ]
}
```

Before: Plugin 2

```json
{
  "$name": "plugin2",
  "features": [
    { "text": "common 2" },
    {
      "id": "page1",
      "text": "custom page"
    }
  ]
}
```

Final result:

```json
{
  "features": [
    { "text": "common 1" },
    { "text": "common 2" },
    {
      "id": "page1",
      "text": "custom page"
    }
  ]
}
```

Note that objects with the same `page1` identifiers were merged while other unique entries were appended to the resulting array.

## Disabling content

Most of the schema elements can be switched off by using the `disabled` property:

```json
{
  "$schema": "../../extension.schema.json",
  "$name": "app",
  "$version": "1.0.0",

  "features": {
    "create": [
      {
        "id": "app.create.folder",
        "disabled": true,
        "order": 100,
        "icon": "create_new_folder",
        "title": "Create Folder"
      }
    ]
  }
}
```

This feature becomes handy when you want to disable existing functionality from within the external plugin.

In the example below, the plugin called `plugin1` replaces standard `app.create.folder` menu
exposed by the application with a custom one coming with the plugin.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "create": [
            {
                "id": "app.create.folder",
                "disabled": true
            },
            {
                "id": "plugin1.create.folder",
                "title": "Create Folder"
            }
        ]
    }
}
```
