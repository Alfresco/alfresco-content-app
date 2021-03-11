---
Title: Application Hook
---

# Application Hook

The app exposes the user events (aka hooks) to implement the features.

Most of the application hooks are already exposed.
You can listen any events via `AppHookService`, similar to the following:

```ts
export class MyComponent {
  constructor(private appHookService: AppHookService) {
    this.appHookService.reload.subscribe(() => {
    // reload the feature
    });
  }
}
```

Below is the list of public hooks you can use in the plugin:

| Version | Name                   | Details                                      | Description                                                                        |
| ------- | ---------------------- | ---------------------------------------------| -----------------------------------------------------------------------------------|
| 1.7.0   | reload                 | n/a                                          | Reloads the details in the current page.                                           |
| 1.7.0   | reset                  | n/a                                          | Resets the document list.                                                          |
| 1.7.0   | nodesDeleted           | n/a                                          | Notifies the node deleted.                                                         |
| 1.7.0   | libraryDeleted         | n/a                                          | Notifies the library deleted.                                                      |
| 1.7.0   | libraryCreated         | SiteEntry                                    | Notifies the library created.                                                      |
| 1.7.0   | libraryUpdated         | SiteEntry                                    | Notifies the library updated.                                                      |
| 1.7.0   | libraryJoined          | string                                       | Notifies user joined to library.                                                   |
| 1.7.0   | libraryLeft            | n/a                                          | Notifies user left to library.                                                     |
| 1.7.0   | library400Error        | n/a                                          | Notifies library errored operation.                                                |
| 1.7.0   | joinLibraryToggle      | string                                       | Notifies user toggled join library.                                                |
| 1.7.0   | linksUnshared          | n/a                                          | Notifies the shared link unshared.                                                 |
| 1.7.0   | favoriteLibraryToggle  | n/a                                          | Notifies user toggle favorite library.                                             |
