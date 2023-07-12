/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { resolve } from 'path';

export const TEST_FILES = {
    DOCX: {
        path: resolve(__dirname, 'file-docx.docx'),
        name: 'file-docx',
        data: 'Lorem ipsum dolor sit amet'
    },
    PDF: {
        path: resolve(__dirname, 'file-pdf.pdf'),
        name: 'file-pdf',
        data: 'Lorem ipsum dolor sit amet'
    },
    DOCX_PROTECTED: {
      path: resolve(__dirname, 'file-pdf-protected.pdf'),
      name: 'file-pdf-protected',
      data: 'Lorem ipsum dolor sit amet',
      password: "0000"
  },
};
