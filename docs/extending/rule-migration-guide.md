---
Title: Rule Migration Guide
---

# Migrating rules to be ACA 5.1.1 compatible

As part of cleanup of the evaluators section in ACA 5.1.1, several rules from the application were removed and
replaced with their alternatives. The biggest change involves the preference to use array based visibility rules
instead of string based. What this means is that developers will now be able to provide a set of smaller visibility
rules via array, instead of having to provide one single rule, which would internally call multiple smaller rules
via code.

For e.g., for a rule `app.canManageFileVersions`, which was basically a combination of `hasFileSelection(app.selection.file)`,
`isNotTrashcan (app.navigation.isNotTrashcan)`, and `isNotLocked(app.selection.file.isNotLocked)`, earlier, the code
used to look something like -

app.extensions.json

```json
{
  "rules": {
    "visible": "canManageFileVersions"
  }
}
```

aca-content.module.ts -

```ts
extensions.setEvaluators({
  'app.canManageFileVersions': rules.canManageFileVersions,
  'app.selection.file': rules.hasFileSelection,
  'app.navigation.isNotTrashcan': rules.isNotTrashcan,
  'app.navigation.isTrashcan': rules.isTrashcan,
  'app.selection.file.isNotLocked': rules.isNotLocked
})

```

app.rules.ts -

```ts
import { isTrashcan } from './navigation.rules';

export const rules = {
  canManageFileVersions: () => hasFileSelection() && isNotTrashcan() && isNotLocked(),
  hasFileSelection: (context) => !!context?.selection?.file,
  isTrashcan: (context) => context.navigation.startsWith('/trashcan'),
  isNotTrashcan: (context) => !isTrashcan(context),
  isNotLocked: (context) => context.selection.file.entry.isLocked || context.selection.file.entry.properties?.['cm:lockType'] === 'READ_ONLY_LOCK'
}


```

Now, the visibility of this extension unit can be controlled in more compact way -

```json
{
  "rules": {
    "visible": [
      "app.selection.file",
      "!app.navigation.isTrashcan",
      "!app.selection.file.isLocked"
    ]
  }
}
```

No further changes in aca-content.module.ts, or app.rules.ts is required, apart from removing the unused rules and functions

**NOTE**: Notice the use of the rule negation `!` in the app.navigation.isTrashcan rule above, thereby removing another unneeded rule.

Below is a full list of rules that would need to be migrated, along with the corresponding set of rules that can be used in their place. Do note that the default OOTB ACA already has the migrations applied on extensions.json, and the changes would
only need to be done on any extensions configuration that is custom to you. All old migrated rules have been removed from the code base, so performing this migration is necessary in order to ensure a stable Alfresco Content Application experience

| Old rule                             | New Rule                                                                                                                                                                                                                          |
|--------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| app.navigation.isNotTrashcan         | !app.navigation.isTrashcan                                                                                                                                                                                                        |
| app.navigation.isNotFavorites        | !app.navigation.isFavorites                                                                                                                                                                                                       |
| app.navigation.isNotSharedFiles      | !app.navigation.isSharedFiles                                                                                                                                                                                                     |
| app.navigation.isNotLibraries        | !app.navigation.isLibraries                                                                                                                                                                                                       |
| app.navigation.isNotRecentFiles      | !app.navigation.isRecentFiles                                                                                                                                                                                                     |
| app.navigation.isNotSearchResults    | !app.navigation.isSearchResults                                                                                                                                                                                                   |
| canViewFile                          | app.selection.file<br/>!app.navigation.isTrashcan                                                                                                                                                                                 |
| app.canCreateLibrary                 | app.isContentServiceEnabled<br/>app.navigation.isLibraries                                                                                                                                                                        |
| app.selection.canDownload            | app.selection.notEmpty<br/>!app.navigation.isTrashcan<br/>app.selection.canDownload                                                                                                                                               |
| isTrashcanItemSelected               | app.navigation.isTrashcan<br/>app.selection.notEmpty                                                                                                                                                                              |
| canLeaveLibrary                      | app.selection.library<br/>app.selection.hasLibraryRole                                                                                                                                                                            |
| canShowInfoDrawer                    | app.selection.notEmpty<br/>!app.navigation.isLibraries<br/>!app.navigation.isTrashcan                                                                                                                                             |
| app.toolbar.favorite.canEditMetadata | app.selection.library<br/>isLibraryManager                                                                                                                                                                                        |
| canToggleEditOffline                 | app.selection.file<br/>!app.navigation.isTrashcan<br/>canToggleFileLock                                                                                                                                                           |
| canEditFolder                        | app.selection.folder.canUpdate<br/>!app.navigation.isTrashcan                                                                                                                                                                     | 
| app.toolbar.favorite.canAdd          | app.selection.notEmpty<br/>app.selection.canAddFavorite<br/>!app.navigation.isTrashcan<br/>!app.navigation.isRecentFiles<br/>!app.navigation.isSharedFiles<br/>!app.navigation.isSearchResults<br/>!app.navigation.isFavorites    |
| app.toolbar.favorite.canRemove       | app.selection.notEmpty<br/>app.selection.canRemoveFavorite<br/>!app.navigation.isTrashcan<br/>!app.navigation.isRecentFiles<br/>!app.navigation.isSharedFiles<br/>!app.navigation.isSearchResults<br/>!app.navigation.isFavorites |
| canCopyNode                          | app.selection.notEmpty<br/>!app.navigation.isTrashcan<br/>!app.navigation.isLibraries                                                                                                                                             | 
| canManageFileVersions                | app.selection.file<br/>!app.navigation.isTrashcan<br/>!app.selection.file.isLocked                                                                                                                                                | 
| canManagePermissions                 | app.selection.first.canUpdate<br/>!app.navigation.isTrashcan<br/>!isSmartFolder<br/>!isMultiSelection                                                                                                                             | 
| rules.canManageFolderRules           | rules.isFolderRulesEnabled<br/>app.selection.folder.canUpdate<br/>!app.navigation.isTrashcan<br/>app.selection.folder<br/>!app.navigation.isFavorites<br/>!isSmartFolder                                                          | 
| app.navigation.folder.canCreate      | app.isContentServiceEnabled<br/>app.navigation.folder.canCreate                                                                                                                                                                   | 
| app.navigation.folder.canUpload      | app.isContentServiceEnabled<br/>app.navigation.folder.canCreate                                                                                                                                                                   | 
| app.isUploadSupported                | app.isContentServiceEnabled<br/>app.navigation.folder.canCreate                                                                                                                                                                   | 
| canToggleSharedLink                  | app.selection.file<br/>canToggleSharedLink                                                                                                                                                                                        | 
| canToggleJoinLibrary                 | app.selection.library<br/>!app.selection.hasLibraryRole<br/>canToggleJoinLibrary                                                                                                                                                  |
| canShowExpand                        | !app.navigation.isLibraries<br/>!app.navigation.isDetails                                                                                                                                                                         |
| canInfoPreview                       | app.navigation.isSearchResults<br/>!isMultiSelection<br/>!app.selection.folder<br/>!app.navigation.isPreview                                                                                                                      |
| app.selection.canDelete              | !app.navigation.isTrashcan<br/>!app.navigation.isLibraries<br/>app.selection.notEmpty<br/>app.selection.canDelete                                                                                                                 |

In addition to the above-mentioned migrations, the following set of rules were removed from the ACA codebase, since they were not being used by the application. If you still need access to these rules however, the original implementation
can be found in [legacy-rules.md](./legacy-rules.md). However, do note that since these rules have been removed from the ACA codebase, no support will be provided for them in the future. We advise that you should only use the provided rules as reference,
and migrate your current implementation to use a different approach instead.

| Rule                              |
|-----------------------------------|
| app.selection.file.canLock        |
| app.selection.file.canUnlock      |
| app.selection.file.isLockOwner    |
| app.selection.file.canShare       |
| app.selection.file.isShared       |
| app.selection.canUnshare          |
| app.selection.isPrivateLibrary    |
| app.selection.hasNoLibraryRole    |
| app.navigation.isLibraryFiles     |
| app.navigation.isPersonalFiles    |
| app.navigation.isSharedPreview    |
| app.navigation.isFavoritesPreview |
| app.navigation.isSharedFileViewer |
| repository.isQuickShareEnabled    |
| user.isAdmin                      |
