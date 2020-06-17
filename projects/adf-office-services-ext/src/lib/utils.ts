/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/* cspell:disable */
export const supportedExtensions = {
  doc: 'ms-word',
  docx: 'ms-word',
  docm: 'ms-word',
  dot: 'ms-word',
  dotx: 'ms-word',
  dotm: 'ms-word',
  rtf: 'ms-word',
  xls: 'ms-excel',
  xlsx: 'ms-excel',
  xlsb: 'ms-excel',
  xlsm: 'ms-excel',
  xlt: 'ms-excel',
  xltx: 'ms-excel',
  xltm: 'ms-excel',
  xlam: 'ms-excel',
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
  sldm: 'ms-powerpoint',
  vsd: 'ms-visio',
  vss: 'ms-visio',
  vst: 'ms-visio',
  vsdx: 'ms-visio',
  vsdm: 'ms-visio',
  vssx: 'ms-visio',
  vssm: 'ms-visio',
  vstx: 'ms-visio',
  vstm: 'ms-visio'
};
/* cspell:enable */

export function getFileExtension(fileName: string): string {
  if (fileName) {
    const match = fileName.match(/\.([^\./\?\#]+)($|\?|\#)/);
    return match ? match[1] : null;
  }
  return null;
}
