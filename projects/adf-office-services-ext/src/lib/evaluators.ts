import { RuleContext, RuleParameter } from '@alfresco/adf-extensions';

/* cspell:disable */
const supportedExtensions = {
  doc: 'ms-word',
  docx: 'ms-word',
  docm: 'ms-word',
  dot: 'ms-word',
  dotx: 'ms-word',
  dotm: 'ms-word',
  xls: 'ms-excel',
  xlsx: 'ms-excel',
  xlsb: 'ms-excel',
  xlsm: 'ms-excel',
  xlt: 'ms-excel',
  xltx: 'ms-excel',
  xltm: 'ms-excel',
  ppt: 'ms-powerpoint',
  pptx: 'ms-powerpoint',
  pot: 'ms-powerpoint',
  potx: 'ms-powerpoint',
  potm: 'ms-powerpoint',
  pptm: 'ms-powerpoint',
  pps: 'ms-powerpoint',
  ppsx: 'ms-powerpoint',
  ppam: 'ms-powerpoint',
  ppsm: 'ms-powerpoint',
  sldx: 'ms-powerpoint',
  sldm: 'ms-powerpoint'
};
/* cspell:enable */

function getFileExtension(fileName: string): string {
  if (fileName) {
    const match = fileName.match(/\.([^\./\?\#]+)($|\?|\#)/);
    return match ? match[1] : null;
  }
  return null;
}

export function canOpenWithOffice(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const file = context.selection.file;

  if (!file || !file.entry) {
    return false;
  }

  if (file.entry.isLocked) {
    return false;
  }

  const extension = getFileExtension(file.entry.name);
  if (!extension || !supportedExtensions[extension]) {
    return false;
  }

  if (file.entry && file.entry.aspectNames) {
    const checkedOut = file.entry.aspectNames.find(
      (aspect: string) => aspect === 'cm:checkedOut'
    );

    if (checkedOut) {
      return false;
    }
  }

  const lockOwner = file.entry.properties['cm:lockOwner'];
  if (lockOwner && lockOwner.id !== context.profile.id) {
    return false;
  }

  return true;
}
