/* cspell:disable */
export const supportedExtensions = {
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

export function getFileExtension(fileName: string): string {
  if (fileName) {
    const match = fileName.match(/\.([^\./\?\#]+)($|\?|\#)/);
    return match ? match[1] : null;
  }
  return null;
}
