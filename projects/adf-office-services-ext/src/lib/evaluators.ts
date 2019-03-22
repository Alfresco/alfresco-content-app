import { RuleContext, RuleParameter } from '@alfresco/adf-extensions';
import { AuthenticationService } from '@alfresco/adf-core';
import { getFileExtension, supportedExtensions } from './utils';

export function canOpenWithOffice(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  if (
    context.navigation &&
    context.navigation.url &&
    context.navigation.url.startsWith('/trashcan')
  ) {
    return false;
  }

  // todo: needs to have typed access via SDK (1.8)
  const auth: AuthenticationService = (<any>context).auth;
  if (auth && auth.isOauth()) {
    return false;
  }

  if (!context || !context.selection) {
    return false;
  }

  const { file } = context.selection;

  if (!file || !file.entry) {
    return false;
  }

  const extension = getFileExtension(file.entry.name);
  if (!extension || !supportedExtensions[extension]) {
    return false;
  }

  // workaround for Shared files
  if (
    context.navigation &&
    context.navigation.url &&
    context.navigation.url.startsWith('/shared')
  ) {
    if (file.entry.hasOwnProperty('allowableOperationsOnTarget')) {
      return context.permissions.check(file, ['update'], {
        target: 'allowableOperationsOnTarget'
      });
    }
  }

  if (!file.entry.properties) {
    return false;
  }

  if (file.entry.isLocked) {
    return false;
  }

  /*
  if (file.entry && file.entry.aspectNames) {
    const checkedOut = file.entry.aspectNames.find(
      (aspect: string) => aspect === 'cm:checkedOut'
    );

    if (checkedOut) {
      return false;
    }
  }
  */

  if (
    file.entry.properties['cm:lockType'] === 'WRITE_LOCK' ||
    file.entry.properties['cm:lockType'] === 'READ_ONLY_LOCK'
  ) {
    return false;
  }

  const lockOwner = file.entry.properties['cm:lockOwner'];
  if (lockOwner && lockOwner.id !== context.profile.id) {
    return false;
  }

  return context.permissions.check(file, ['update']);
}
