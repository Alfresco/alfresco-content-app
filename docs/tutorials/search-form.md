---
Title: Search Form
---

## Custom search form

From version 2.5.0 ACA search support multiple search configurations.
In this tutorial, we are going to implement the following features:

- [Add a new search form](#add-a-new-search-form)
- [Replace a search form](#replace-a-search-form)
- [Replace default search](#replace-default-search)
- [Adding rule to search form](#adding-rule-to-search-form)

### Extension Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| id | `string` |  | Unique identifier of the search |
| name | `string` | "" | Display title of the form |
| order | `string` |  | Visualization order in the dropdown  |
| default | `boolean` |  | if the search has to be used as default search  |
| aca:fields| `string[]`| | list of aspects property to add in the query and search in the value for the given text. The property will be concatenated in AND|

### Search configuration properties

In order to learn more about :
-The search UI configuration possibilities refer to the [ADF Search configuration documentation](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/user-guide/search-configuration-guide.md)
-The search Query configuration possibilities refer to the [Full text search reference documentation](https://docs.alfresco.com/search-services/latest/using/)

### Add a new search form

Update `your-app.extensions.json` file, and insert a new entry to the `features.search` section:

```json
{
  "features": {
    "search": [
      {
        "id": "app.search.custom_search",
        "order": 200,
        "name": "APP.SEARCH.MY_CUSTOM_SEARCH",
        "default": false,
        "aca:fields": [ "cm:name", "cm:title", "cm:description", "TEXT", "TAG"],
        "filterQueries": [
          {
            "query": "+ASPECT: 'cm:person'"
          }
        ]
      }
    ]
  }
}
```
Note that the entries of the filterQueries array are joined using the AND operator.

### Replace a search form
 To replace an already present search form you need to add a new search configuration with the same `id` of an already present configuration 


### Replace default search
To replace the default search with your configuration set to true the default field

```json
{
  "features": {
    "search": [
      {
        "id": "app.search.custom_search",
        "order": 200,
        "name": "APP.SEARCH.MY_CUSTOM_SEARCH",
        "default": true,
        "aca:fields": [ "cm:name", "cm:title", "cm:description", "TEXT", "TAG"],
        "filterQueries": [
          {
            "query": "+ASPECT: 'cm:person'"
          }
        ]
      }
    ]
  }
}
```
### Adding rule to search form 

It support the visible rule to show the configuration

```json
{
  "features": {
    "search": [
      {
        "id": "app.search.custom_search",
        "order": 200,
        "name": "APP.SEARCH.MY_CUSTOM_SEARCH",
        "rules": {
          "visible": "<name of the rule>"
        }
      }
    ]
  }
}
```
