---
Title: Application Actions
---

# Application Actions

The app uses **NgRx** (Reactive libraries for Angular, inspired by Redux)
to implement application actions.

For more information on NgRx, please refer to the following resources:

- [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)

Most of the application features are already exposed in the form of NgRx Actions and corresponding Effects.
You can invoke any action via a single `Store` dispatcher, similar to the following:

```ts
export class MyComponent {
  constructor(private store: Store<AppStore>) {}

  onClick() {
    this.store.dispatch(new SearchByTermAction('*'));
  }
}
```

The code above demonstrates a simple 'click' handler that invokes `Search by Term` feature
and automatically redirects user to the **Search Results** page.

Another example demonstrates viewing a node from a custom application service API:

```ts
export class MyService {
  constructor(private store: Store<AppStore>) {}

  viewFile(node: MinimalNodeEntity) {
    this.store.dispatch(new ViewFileAction(node));
  }
}
```

## Using with Extensions

You can invoke every application action from the extensions, i.e. buttons, menus, etc.

**Tip:** Many of the actions take currently selected nodes if no payload provided.
That simplifies declaring and invoking actions from the extension files.

In the example below, we create a new entry to the "NEW" menu dropdown
and provide a new `Create Folder (plugin1)` command that invokes the `CREATE_FOLDER` application action.

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "create": [
      {
        "id": "plugin1.create.folder",
        "type": "default",
        "icon": "create_new_folder",
        "title": "Create Folder (plugin1)",
        "actions": {
          "click": "CREATE_FOLDER"
        }
      }
    ]
  }
}
```

The `CREATE_FOLDER` action will trigger corresponding NgRx Effects to show the dialog
and perform document list reload if needed.

Below is the list of public actions types you can use in the plugin definitions as a reference to the action:

| Name                   | Payload             | Description                                                                                     |
| ---------------------- | ------------------- | ----------------------------------------------------------------------------------------------- |
| SET_CURRENT_FOLDER     | Node                | Notify components about currently opened folder.                                                |
| SET_CURRENT_URL        | string              | Notify components about current browser URL.                                                    |
| SET_USER_PROFILE       | Person              | Assign current user profile.                                                                    |
| TOGGLE_INFO_DRAWER     | n/a                 | Toggle info drawer for the selected node.                                                       |
| ADD_FAVORITE           | MinimalNodeEntity[] | Add nodes (or selection) to favorites.                                                          |
| REMOVE_FAVORITE        | MinimalNodeEntity[] | Removes nodes (or selection) from favorites.                                                    |
| DELETE_LIBRARY         | string              | Delete a Library by id. Takes selected node if payload not provided.                            |
| CREATE_LIBRARY         | n/a                 | Invoke a "Create Library" dialog.                                                               |
| SET_SELECTED_NODES     | MinimalNodeEntity[] | Notify components about selected nodes.                                                         |
| DELETE_NODES           | MinimalNodeEntity[] | Delete the nodes (or selection). Supports undo actions.                                         |
| UNDO_DELETE_NODES      | any[]               | Reverts deletion of nodes (or selection).                                                       |
| RESTORE_DELETED_NODES  | MinimalNodeEntity[] | Restores deleted nodes (or selection). Typically used with Trashcan.                            |
| PURGE_DELETED_NODES    | MinimalNodeEntity[] | Permanently delete nodes (or selection). Typically used with Trashcan.                          |
| DOWNLOAD_NODES         | MinimalNodeEntity[] | Download nodes (or selections). Creates a ZIP archive for folders or multiple items.            |
| CREATE_FOLDER          | string              | Invoke a "Create Folder" dialog for the opened folder (or the parent folder id in the payload). |
| EDIT_FOLDER            | MinimalNodeEntity   | Invoke an "Edit Folder" dialog for the node (or selection).                                     |
| SHARE_NODE             | MinimalNodeEntity   | Invoke a "Share" dialog for the node (or selection).                                            |
| UNSHARE_NODES          | MinimalNodeEntity[] | Remove nodes (or selection) from the shared nodes (does not remove content).                    |
| COPY_NODES             | MinimalNodeEntity[] | Invoke a "Copy" dialog for the nodes (or selection). Supports undo actions.                     |
| MOVE_NODES             | MinimalNodeEntity[] | Invoke a "Move" dialog for the nodes (or selection). Supports undo actions.                     |
| MANAGE_PERMISSIONS     | MinimalNodeEntity   | Invoke a "Manage Permissions" dialog for the node (or selection).                               |
| MANAGE_VERSIONS        | MinimalNodeEntity   | Invoke a "Manage Versions" dialog for the node (or selection).                                  |
| NAVIGATE_URL           | string              | Navigate to a given route URL within the application.                                           |
| NAVIGATE_ROUTE         | any[]               | Navigate to a particular Route (supports parameters).                                           |
| NAVIGATE_FOLDER        | MinimalNodeEntity   | Navigate to a folder based on the Node properties.                                              |
| NAVIGATE_PARENT_FOLDER | MinimalNodeEntity   | Navigate to a containing folder based on the Node properties.                                   |
| NAVIGATE_LIBRARY       | string              | Navigate to library.                                                                            |
| SEARCH_BY_TERM         | string              | Perform a simple search by the term and navigate to Search results.                             |
| SNACKBAR_INFO          | string              | Show information snackbar with the message provided.                                            |
| SNACKBAR_WARNING       | string              | Show warning snackbar with the message provided.                                                |
| SNACKBAR_ERROR         | string              | Show error snackbar with the message provided.                                                  |
| UPLOAD_FILES           | n/a                 | Invoke "Upload Files" dialog and upload files to the currently opened folder.                   |
| UPLOAD_FOLDER          | n/a                 | Invoke "Upload Folder" dialog and upload selected folder to the currently opened one.           |
| UPLOAD_FILE_VERSION    | n/a                 | Invoke "New File Version" dialog.                                                               |
| VIEW_FILE              | MinimalNodeEntity   | Preview the file (or selection) in the Viewer.                                                  |
| UNLOCK_WRITE           | NodeEntry           | Unlock file from read only mode                                                                 |
| PRINT_FILE             | MinimalNodeEntity   | Print the file opened in the Viewer (or selected).                                              |
| FULLSCREEN_VIEWER      | n/a                 | Enters fullscreen mode to view the file opened in the Viewer.                                   |
| LOGOUT                 | n/a                 | Log out and redirect to Login screen.                                                           |
| RELOAD_DOCUMENT_LIST   | n/a                 | Reload active document list                                                                     |
| TOGGLE_SEARCH_FILTER   | n/a                 | Toggle Filter component visibility in Search Results.                                           |
| SHOW_SEARCH_FILTER     | n/a                 | Show Filter component in Search Results.                                                        |
| HIDE_SEARCH_FILTER     | n/a                 | Hide Filter component in Search Results                                                         |
