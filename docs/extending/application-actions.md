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

| Version | Name                   | Payload                                                                        | Description                                                                                                                                 |
| ------- | ---------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.7.0   | SET_CURRENT_FOLDER     | Node                                                                           | Notify components about currently opened folder.                                                                                            |
| 1.7.0   | SET_CURRENT_URL        | string                                                                         | Notify components about current browser URL.                                                                                                |
| 1.7.0   | SET_USER_PROFILE       | Person                                                                         | Assign current user profile.                                                                                                                |
| 1.7.0   | TOGGLE_INFO_DRAWER     | n/a                                                                            | Toggle info drawer for the selected node.                                                                                                   |
| 1.7.0   | ADD_FAVORITE           | MinimalNodeEntity[]                                                            | Add nodes (or selection) to favorites.                                                                                                      |
| 1.7.0   | REMOVE_FAVORITE        | MinimalNodeEntity[]                                                            | Removes nodes (or selection) from favorites.                                                                                                |
| 1.7.0   | DELETE_LIBRARY         | string                                                                         | Delete a Library by id. Takes selected node if payload not provided.                                                                        |
| 1.7.0   | CREATE_LIBRARY         | n/a                                                                            | Invoke a "Create Library" dialog.                                                                                                           |
| 1.7.0   | SET_SELECTED_NODES     | MinimalNodeEntity[]                                                            | Notify components about selected nodes.                                                                                                     |
| 1.7.0   | DELETE_NODES           | MinimalNodeEntity[]                                                            | Delete the nodes (or selection). Supports undo actions.                                                                                     |
| 1.7.0   | UNDO_DELETE_NODES      | any[]                                                                          | Reverts deletion of nodes (or selection).                                                                                                   |
| 1.7.0   | RESTORE_DELETED_NODES  | MinimalNodeEntity[]                                                            | Restores deleted nodes (or selection). Typically used with Trashcan.                                                                        |
| 1.7.0   | PURGE_DELETED_NODES    | MinimalNodeEntity[]                                                            | Permanently delete nodes (or selection). Typically used with Trashcan.                                                                      |
| 1.7.0   | DOWNLOAD_NODES         | MinimalNodeEntity[]                                                            | Download nodes (or selections). Creates a ZIP archive for folders or multiple items.                                                        |
| 1.7.0   | CREATE_FOLDER          | string                                                                         | Invoke a "Create Folder" dialog for the opened folder (or the parent folder id in the payload).                                             |
| 1.7.0   | EDIT_FOLDER            | MinimalNodeEntity                                                              | Invoke an "Edit Folder" dialog for the node (or selection).                                                                                 |
| 1.7.0   | SHARE_NODE             | MinimalNodeEntity                                                              | Invoke a "Share" dialog for the node (or selection).                                                                                        |
| 1.7.0   | UNSHARE_NODES          | MinimalNodeEntity[]                                                            | Remove nodes (or selection) from the shared nodes (does not remove content).                                                                |
| 1.7.0   | COPY_NODES             | MinimalNodeEntity[]                                                            | Invoke a "Copy" dialog for the nodes (or selection). Supports undo actions.                                                                 |
| 1.7.0   | MOVE_NODES             | MinimalNodeEntity[]                                                            | Invoke a "Move" dialog for the nodes (or selection). Supports undo actions.                                                                 |
| 1.7.0   | MANAGE_PERMISSIONS     | MinimalNodeEntity                                                              | Invoke a "Manage Permissions" dialog for the node (or selection).                                                                           |
| 1.7.0   | MANAGE_VERSIONS        | MinimalNodeEntity                                                              | Invoke a "Manage Versions" dialog for the node (or selection).                                                                              |
| 1.7.0   | NAVIGATE_URL           | string                                                                         | Navigate to a given route URL within the application.                                                                                       |
| 1.7.0   | NAVIGATE_ROUTE         | any[]                                                                          | Navigate to a particular Route (supports parameters).                                                                                       |
| 1.7.0   | NAVIGATE_FOLDER        | MinimalNodeEntity                                                              | Navigate to a folder based on the Node properties.                                                                                          |
| 1.7.0   | NAVIGATE_PARENT_FOLDER | MinimalNodeEntity                                                              | Navigate to a containing folder based on the Node properties.                                                                               |
| 1.7.0   | NAVIGATE_LIBRARY       | string                                                                         | Navigate to library.                                                                                                                        |
| 1.7.0   | SEARCH_BY_TERM         | string                                                                         | Perform a simple search by the term and navigate to Search results.                                                                         |
| 1.7.0   | SNACKBAR_INFO          | string                                                                         | Show information snackbar with the message provided.                                                                                        |
| 1.7.0   | SNACKBAR_WARNING       | string                                                                         | Show warning snackbar with the message provided.                                                                                            |
| 1.7.0   | SNACKBAR_ERROR         | string                                                                         | Show error snackbar with the message provided.                                                                                              |
| 1.7.0   | UPLOAD_FILES           | n/a                                                                            | Invoke "Upload Files" dialog and upload files to the currently opened folder.                                                               |
| 1.7.0   | UPLOAD_FOLDER          | n/a                                                                            | Invoke "Upload Folder" dialog and upload selected folder to the currently opened one.                                                       |
| 1.7.0   | UPLOAD_FILE_VERSION    | n/a                                                                            | Invoke "New File Version" dialog.                                                                                                           |
| 1.7.0   | VIEW_FILE              | MinimalNodeEntity                                                              | Preview the file (or selection) in the Viewer.                                                                                              |
| 1.7.0   | UNLOCK_WRITE           | NodeEntry                                                                      | Unlock file from read only mode                                                                                                             |
| 1.7.0   | PRINT_FILE             | MinimalNodeEntity                                                              | Print the file opened in the Viewer (or selected).                                                                                          |
| 1.7.0   | FULLSCREEN_VIEWER      | n/a                                                                            | Enters fullscreen mode to view the file opened in the Viewer.                                                                               |
| 1.7.0   | LOGOUT                 | n/a                                                                            | Log out and redirect to Login screen.                                                                                                       |
| 1.7.0   | RELOAD_DOCUMENT_LIST   | n/a                                                                            | Reload active document list                                                                                                                 |
| 1.8.0   | VIEW_NODE              | NodeId<`string`> , [ViewNodeExtras](../features/file-viewer.md#details)<`any`> | Lightweight preview of a node by id. Can be invoked from extensions. For details also see [File Viewer](../features/file-viewer.md#details) |
| 1.8.0   | CLOSE_PREVIEW          | n/a                                                                            | Closes the viewer ( preview of the item )                                                                                                   |
| 1.9.0   | RESET_SELECTION        | n/a                                                                            | Resets active document list selection                                                                                                       |
| 1.10.0  | FILE_FROM_TEMPLATE     | n/a                                                                            | Invoke dialogs flow for creating a file from a template into current folder                                                                 |
| 1.10.0  | FOLDER_FROM_TEMPLATE   | n/a                                                                            | Invoke dialogs flow for creating a folder structure from a template into current folder                                                     |
| 1.10.0  | CONTEXT_MENU           | MouseEvent                                                                     | Invoke context menu for [DocumentListComponent](https://www.alfresco.com/abn/adf/docs/content-services/components/document-list.component)  |
| 1.11.0  | SET_HEADER_COLOR       | string                                                                         | Set the header color at runtime                                                                                                             |
