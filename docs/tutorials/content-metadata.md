---
Title: Content Metadata
---

## Custom Content Metadata layout

In this tutorial, we are going to implement the following features:

- [MetadataLayout oriented config](#metadata-layout-oriented-config)

### Metadata Layout oriented config

Update `your-app.extensions.json` file, and insert a new entry to the `features.content-metadata-presets.custom`section:

```json
{
  "features": {
    "content-metadata-presets": [
      {
        "custom": [
          ......
        ]
      }
    ]
  }
}
```

If you need to configure the groups and properties in a more detailed way. With this type of configuration any property
of any aspect/type can be "cherry picked" and grouped into an accordion drawer, along with a translatable title defined
in the preset configuration.

In the example below we are going to display in a new group all the properties of the ```cm:versionable``` aspect

```json
{
  "features": {
    "content-metadata-presets": [
      {
        "custom": [
          {
            "id": "custom.features",
            "title": "MY_CUSTOM_TITLE",
            "items": [
              {
                "id": "cm:versionable",
                "aspect": "cm:versionable",
                "properties": "*"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

In the example below we are going to display in a new group some of the ```cm:dublincore``` aspect:

```json
{
  "features": {
    "content-metadata-presets": [
      {
        "custom": [
          {
            "id": "custom.features.two",
            "title": "MY_CUSTOM_TITLE_TWO",
            "items": [
              {
                "id": "cm:dublincore",
                "aspect": "cm:dublincore",
                "properties": [
                  "cm:rights",
                  "cm:title"
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

In the example below we are going to display in the same group a mix of ```cm:dublincore``` and ```cm:versionable```
aspect:

```json
{
  "features": {
    "content-metadata-presets": [
      {
        "custom": [
          {
            "id": "custom.features.two",
            "title": "MY_CUSTOM_TITLE_TWO",
            "items": [
              {
                "id": "cm:dublincore",
                "aspect": "cm:dublincore",
                "properties": [
                  "cm:rights",
                  "cm:title"
                ]
              },
              {
                "id": "cm:versionable",
                "aspect": "cm:versionable",
                "properties": "*"
              }
            ]
          }
        ]
      }
    ]
  }
}

```
Note: empty aspect or aspect not associated to the node will not be displayed

# Exclude aspects or properties


You can also exclude specific aspects by adding the exclude property. It can be either a string if it's only one aspect or an array if you want to exclude multiple aspects at once:

```json
{
  "features": {
    "content-metadata-presets": [
      {
        "custom": [
          {
            "id": "app.content.metadata.customSetting",
            "includeAll": true,
            "exclude": ["exif:exif", "owner:parameters"]
          }
        ]
      }
    ]
  }
}

```
When using this configuration you can still whitelist aspects and properties as you desire. The example below shows this with an aspect-oriented config:

```json
{
  "features": {
    "content-metadata-presets": [
      {
        "custom": [
          {
            "id": "app.content.metadata.customSetting",
            "includeAll": true,
            "exclude": ["cm:dublincore", "owner:parameters"]
          },
          {
            "id": "custom.features.two",
            "title": "MY_CUSTOM_TITLE_TWO",
            "items": [
              {
                "id": "cm:dublincore",
                "aspect": "cm:dublincore",
                "properties": [
                  "cm:rights",
                  "cm:title"
                ]
              },
              {
                "id": "cm:versionable",
                "aspect": "cm:versionable",
                "properties": "*"
              }
            ]
          }
        ]
      }
    ]
  }
}

```
