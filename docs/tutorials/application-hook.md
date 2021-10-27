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
| 2.2.2   | reload                 | n/a                                          | Reloads the details in the current page.                                           |
| 2.2.2   | reset                  | n/a                                          | Resets the document list.                                                          |
| 2.2.2   | nodesDeleted           | n/a                                          | Notifies the node deleted.                                                         |
| 2.2.2   | libraryDeleted         | n/a                                          | Notifies the library deleted.                                                      |
| 2.2.2   | libraryCreated         | SiteEntry                                    | Notifies the library created.                                                      |
| 2.2.2   | libraryUpdated         | SiteEntry                                    | Notifies the library updated.                                                      |
| 2.2.2   | libraryJoined          | string                                       | Notifies user joined to library.                                                   |
| 2.2.2   | libraryLeft            | n/a                                          | Notifies user left to library.                                                     |
| 2.2.2   | library400Error        | n/a                                          | Notifies library errored operation.                                                |
| 2.2.2   | joinLibraryToggle      | string                                       | Notifies user toggled join library.                                                |
| 2.2.2   | linksUnshared          | n/a                                          | Notifies the shared link unshared.                                                 |
| 2.2.2   | favoriteLibraryToggle  | n/a                                          | Notifies user toggle favorite library.                                             |
