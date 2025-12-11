/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    name: 'file2-docx',
    data: 'Lorem ipsum dolor sit amet'
  },
  PDF: {
    path: resolve(__dirname, 'file-pdf.pdf'),
    name: 'file-pdf',
    extension: 'pdf',
    data: 'Lorem ipsum dolor sit amet'
  },
  FILE_UNSUPPORTED: {
    path: resolve(__dirname, 'file_unsupported.3DS'),
    name: 'file_unsupported.3DS',
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
    name: 'file2-xlsx',
    data: 'Lorem ipsum dolor sit amet'
  },
  JPG_FILE: {
    path: resolve(__dirname, 'file-jpg.jpg'),
    name: 'file-jpg'
  },
  JPG_FILE_1MB: {
    path: resolve(__dirname, 'file-jpg-1mb.jpg'),
    name: 'file-jpg-1mb'
  },
  PNG_FILE: {
    path: resolve(__dirname, 'file-png.png'),
    name: 'file-png'
  },
  GIF_FILE: {
    path: resolve(__dirname, 'file-gif.gif'),
    name: 'file-gif'
  },
  TIFF_FILE: {
    path: resolve(__dirname, 'file-tif.tif'),
    name: 'file-tif'
  },
  BMP_FILE: {
    path: resolve(__dirname, 'file-bmp.bmp'),
    name: 'file-bmp'
  },
  PPTX_FILE: {
    path: resolve(__dirname, 'file-pptx.pptx'),
    name: 'file-pptx'
  },
  MP3_FILE: {
    path: resolve(__dirname, 'file-mp3.mp3'),
    name: 'file-mp3'
  },
  MP4_FILE: {
    path: resolve(__dirname, 'file-mp4.mp4'),
    name: 'file-mp4'
  },
  WEBM_FILE: {
    path: resolve(__dirname, 'file-webm.webm'),
    name: 'file-webm'
  },
  PDF_PROTECTED2: {
    path: resolve(__dirname, 'protected.pdf'),
    name: 'file-protected',
    data: 'Lorem ipsum dolor sit amet',
    password: '0000'
  }
};
