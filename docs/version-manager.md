## Version Manager

The versions of a file can be viewed & managed by using the [VersionManagerComponent](https://alfresco.github.io/adf-component-catalog/components/VersionManagerComponent.html).

There are 2 ways users can access the Version Manager:

1. From the 'Manage Versions' option of the 'More actions' menu (check [Actions and the Actions Toolbar](/doc-list?id=actions-and-the-actions-toolbar)):
![](images/version-manager-action.png)
![](images/version-manager-dialog.png)

2. From the [Info Drawer](/info-drawer) (the Details right panel):
![](images/version-manager-tab.png)

### Upload new version

A new version for the selected file can be added by using this button. There is a restriction currently to only upload files of the same extension as the old version. The new version file will be automatically renamed to have the same name as the old version has. Please also check the [UploadVersionButtonComponent](https://alfresco.github.io/adf-component-catalog/components/UploadVersionButtonComponent.html). 

### Actions Menu

Each item in the version list has a couple of actions available: Restore, Download and Delete. These are displayed if user has permission to do that specific action. The 'Download' and 'Delete' can be also disabled from the app.config.

In the app.config.json file, these are the current settings for the ACA version manager:
```
   "adf-version-manager": {
       "allowComments": true,
       "allowDownload": true,
       "allowDelete": true
   },
    ...
```
Set the allowComments to false if the version comments should not be displayed on the version list.

Clicking to delete a version of a file triggers a confirmation dialog. Please see the [ConfirmDialogComponent](https://alfresco.github.io/adf-component-catalog/components/ConfirmDialogComponent.html) for more info.
