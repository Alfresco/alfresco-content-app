---
Title: Rules List
---

# Rules List

The following is a comprehensive list of all rules/evaluators available in the Alfresco content application,
under different modules. You may use these existing rules, or create your own following the
[rules](./rules.md) guide when building your extensions.

### AOS Extension plugin

Rules related to the Alfresco Office Services plugin

| Ver.  | Key                   | Description                                     |
|-------|-----------------------|-------------------------------------------------|
| 2.9.0 | aos.canOpenWithOffice | Checks if the file can be opened with MS Office |

### Folder Rules plugin

Rules related to the folder rules plugin

| Ver.  | Key                        | Description                                         |
|-------|----------------------------|-----------------------------------------------------|
| 5.1.1 | rules.isFolderRulesEnabled | Checks if the folder rules plugin is enabled or not |

### Content Services plugin

#### Application Rules/Evaluators

Application related evaluators which can be used to check various different aspects of the users interaction with the application

| Ver.   | Key                                 | Description                                                                                                            |
|--------|-------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| 1.7.0  | app.selection.canDelete             | User has permission to delete selected node(s).                                                                        |
| 1.7.0  | app.selection.canDownload           | User can download selected node(s).                                                                                    |
| 1.7.0  | app.selection.notEmpty              | At least one node is selected.                                                                                         |
| 1.7.0  | app.selection.canAddFavorite        | User can add selected node(s) to favorites.                                                                            |
| 1.7.0  | app.selection.canRemoveFavorite     | User can remove selected node(s) from favorites.                                                                       |
| 1.7.0  | app.selection.first.canUpdate       | User has permission to update selected node(s).                                                                        |
| 1.7.0  | app.selection.file                  | A single File node is selected.                                                                                        |
| 1.7.0  | app.selection.file.isLocked         | File is locked for editing.                                                                                            |
| 1.7.0  | app.selection.file.canUploadVersion | User can update file version.                                                                                          |
| 1.7.0  | app.selection.library               | A single Library node is selected.                                                                                     |
| 1.7.0  | app.selection.hasLibraryRole        | The selected Library node has a role property.                                                                         |
| 1.7.0  | app.selection.folder                | A single Folder node is selected.                                                                                      |
| 1.7.0  | app.selection.folder.canUpdate      | User has permissions to update the selected folder.                                                                    |
| 1.8.0  | canToggleJoinLibrary                | Checks if user can perform "Join" or "Cancel Join Request" on a library.                                               |
| 1.8.0  | canToggleSharedLink                 | Checks if user can toggle shared link mode.                                                                            |
| 1.8.0  | canToggleFavorite                   | Checks whether the user can add/remove the selected file from favorites                                                |
| 1.9.0  | app.canShowLogout                   | Whether logout action should be present or not.                                                                        |
| 1.12.0 | isLibraryManager                    | Checks if user is library manager.                                                                                     |
| 2.3.0  | canEditAspects                      | Checks whether the user can change the aspects of the selected file                                                    |
| 2.10.0 | app.isContentServiceEnabled         | Checks if the content services plugin is enabled or not                                                                |
| 4.4.0  | app.areTagsEnabled                  | Checks if the tags module is enabled or not                                                                            |
| 4.4.0  | app.areCategoriesEnabled            | Checks if the categories module is enabled or not                                                                      |
| 5.1.1  | canToggleFileLock                   | Checks whether the user can lock/unlock the selected file                                                              |
| 5.1.1  | isSmartFolder                       | Checks if the selected folder has the 'smf:customConfigSmartFolder' or the 'smf:systemConfigSmartFolder' aspect or not |
| 5.1.1  | isMultiSelection                    | Checks if the user has selected multiple files                                                                         |
| 6.1.0  | canPrintFile                        | Checks if current file can be printed or not (media files such as audio/video cannot be printed).                      |  

#### Navigation Rules/Evaluators

Navigation related rules/evaluators which can be used to determine if the user is on a specific location within the application
or not.

| Version | Key                             | Description                                                      |
|---------|---------------------------------|------------------------------------------------------------------|
| 1.7.0   | app.navigation.folder.canCreate | User can create content in the currently opened folder.          |
| 1.7.0   | app.navigation.isTrashcan       | User is using the **Trashcan** page.                             |
| 1.7.0   | app.navigation.isLibraries      | User is using a **Libraries** or **Library Search Result** page. |
| 1.7.0   | app.navigation.isSharedFiles    | User is using the **Shared Files** page.                         |
| 1.7.0   | app.navigation.isFavorites      | User is using the **Favorites** page.                            |
| 1.7.0   | app.navigation.isRecentFiles    | User is using the **Recent Files** page.                         |
| 1.7.0   | app.navigation.isSearchResults  | User is using the **Search Results** page.                       |
| 1.7.0   | app.navigation.isPreview        | Current page is **Preview**.                                     |
| 5.1.1   | app.navigation.isDetails        | User is currently on the **Folder Details** page.                |

#### ACS Versions compatibility Rules/Evaluators

Rules/Evaluators created for specific features in ADW to be checked if supported in current ACS version. Evaluators are created using  **createVersionRule** helper function locking specific version number into the rule.

| Version | Key                             | Description                                                               |
|---------|---------------------------------|---------------------------------------------------------------------------|
| 8.1.0   | isPreferencesApiAvailable       | Checks whether current ACS version supports PUT method in Preferences API |
| 8.1.0   | isNodeInfoAvailable             | Checks whether current ACS version supports folder size calculation API   |
| 8.1.0   | isBulkActionsAvailable          | Checks whether current ACS version supports bulk update feature           |
