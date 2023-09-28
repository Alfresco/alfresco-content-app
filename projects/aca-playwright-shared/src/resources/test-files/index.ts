/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { resolve } from 'path';

export const TEST_FILES = {
  DOCX: {
    path: resolve(__dirname, 'file-docx.docx'),
    name: 'file-docx',
    data: 'Lorem ipsum dolor sit amet'
  },
  DOCX2: {
    path: resolve(__dirname, 'file2-docx.docx'),
    name: 'file-docx',
    data: 'Lorem ipsum dolor sit amet'
  },
  PDF: {
    path: resolve(__dirname, 'file-pdf.pdf'),
    name: 'file-pdf',
    data: 'Lorem ipsum dolor sit amet'
  },
  FILE_UNSUPPORTED: {
    path: resolve(__dirname, 'file_unsupported.3DS'),
    name: 'file-3DS',
    data: 'Lorem ipsum dolor sit amet'
  },
  PDF_PROTECTED: {
    path: resolve(__dirname, 'file-pdf-protected.pdf'),
    name: 'file-pdf-protected',
    data: 'Lorem ipsum dolor sit amet',
    password: '0000'
  },
  XLSX: {
    path: resolve(__dirname, 'file-xlsx.xlsx'),
    name: 'file-xlsx',
    data: 'Lorem ipsum dolor sit amet'
  },
  XLSX2: {
    path: resolve(__dirname, 'file2-xlsx.xlsx'),
    name: 'file-xlsx',
    data: 'Lorem ipsum dolor sit amet'
  },
  JPG_FILE: {
    path: resolve(__dirname, 'file-jpg.jpg'),
    name: 'file-jpg'
  },
  PDF_PROTECTED2: {
    path: resolve(__dirname, 'protected.pdf'),
    name: 'file-protected',
    data: 'Lorem ipsum dolor sit amet',
    password: '0000'
  }
};
