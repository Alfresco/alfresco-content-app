----
Title: Legacy Rules for ACA
----

# Legacy rules

Below is a list of all unused rules that were removed with ACA 5.1.1. You may use them as a reference in case your application/extension is still dependent on them, 
however we do advise that you revisit those implementations and substitute them with a different approach, since these rules will no longer be supported.

```typescript
/**
 * app.selection.file.canLock
 * Checks if user can lock selected file.
 */
export const canLockFile = (context: RuleContext): boolean => !isWriteLocked(context) && canUpdateSelectedNode(context);

/**
 * app.selection.file.canUnlock
 * Checks if user can unlock selected file.
 */
export function canUnlockFile(context: RuleContext): boolean {
  const { file } = context.selection;
  return isWriteLocked(context) && (context.permissions.check(file?.entry, ['delete']) || isUserWriteLockOwner(context));
}

/**
 * app.selection.file.isLockOwner
 * Checks if the selected file has **write** or **read-only** locks specified,
 * and that current user is the owner of the lock.
 */
export const isUserWriteLockOwner = (context: RuleContext): boolean =>
  isWriteLocked(context) &&
  context.selection.file?.entry.properties['cm:lockOwner'] &&
  context.selection.file?.entry.properties['cm:lockOwner'].id === context.profile.id;

/**
 * app.selection.file.canShare
 * Checks if user can share selected file.
 */
export const canShareFile = (context: RuleContext): boolean =>
  [context.selection.file, navigation.isNotTrashcan(context), repository.hasQuickShareEnabled(context), !isShared(context)].every(Boolean);

/**
 * app.selection.canUnshare
 * Checks if user can un-share selected nodes.
 */
export function canUnshareNodes(context: RuleContext): boolean {
  if (hasSelection(context)) {
    return context.permissions.check(context.selection.nodes, ['delete'], {
      target: 'allowableOperationsOnTarget'
    });
  }
  return false;
}

/**
 * app.selection.file.isShared
 * Checks if the selected file is already shared.
 */
export function isShared(context: RuleContext): boolean {
  if (navigation.isSharedFiles(context) && context.selection.file) {
    return true;
  }

  if (navigation.isNotTrashcan(context) && hasSelection(context) && context.selection.file) {
    return !!context.selection.file.entry?.properties?.['qshare:sharedId'];
  }

  return false;
}

/**
 * app.selection.isPrivateLibrary
 * Checks if user has selected a **private** library (site)
 */
export function isPrivateLibrary(context: RuleContext): boolean {
  return context.selection.library?.entry?.visibility === 'PRIVATE';
}

/**
 * app.selection.hasNoLibraryRole
 * Checks if the selected library has no **role** property defined.
 */
export const hasNoLibraryRole = (context: RuleContext): boolean => !hasLibraryRole(context);

/**
 * app.navigation.isLibraryFiles
 * Checks if a **Library Files** route is activated.
 */
export function isLibraryFiles(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.startsWith('/libraries');
}

/**
 * app.navigation.isPersonalFiles
 * Checks if a **Personal Files** route is activated.
 */
export function isPersonalFiles(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.startsWith('/personal-files');
}

/**
 * app.navigation.isSharedPreview
 * Checks if a **Shared Preview** route is activated.
 */
export function isSharedPreview(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.startsWith('/shared/preview/') || (url?.startsWith('/shared') && url?.includes('viewer:view'));
}

/**
 * app.navigation.isFavoritesPreview
 * Checks if a **Favorites Preview** route is activated.
 */
export function isFavoritesPreview(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.startsWith('/favorites/preview/') || (url?.startsWith('/favorites') && url?.includes('viewer:view'));
}

/**
 * app.navigation.isSharedFileViewer
 * Checks if a **Shared File Preview** route is activated.
 */
export function isSharedFileViewer(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url?.startsWith('/preview/s/');
}

/**
 * repository.isQuickShareEnabled
 * Checks if the quick share repository option is enabled or not.
 */
export const hasQuickShareEnabled = (context: RuleContext): boolean => context.repository.status.isQuickShareEnabled;

/**
 * user.isAdmin
 * Checks if user is admin.
 */
export const isAdmin = (context: RuleContext): boolean => context.profile.isAdmin;
```
