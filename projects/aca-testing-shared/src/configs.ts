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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

export const BROWSER_WAIT_TIMEOUT = 10000;

// Application configs
export const USE_HASH_STRATEGY = true;

// Application Routes
export const APP_ROUTES = {
  FAVORITES: '/favorites',
  MY_LIBRARIES: '/libraries',
  FAVORITE_LIBRARIES: '/favorite/libraries',
  LOGIN: '/login',
  LOGOUT: '/logout',
  PERSONAL_FILES: '/personal-files',
  RECENT_FILES: '/recent-files',
  SHARED_FILES: '/shared',
  TRASHCAN: '/trashcan'
};

// Sidebar labels
export const SIDEBAR_LABELS = {
  PERSONAL_FILES: 'Personal Files',
  MY_LIBRARIES: 'My Libraries',
  FAVORITE_LIBRARIES: 'Favorite Libraries',
  SHARED_FILES: 'Shared',
  RECENT_FILES: 'Recent Files',
  FAVORITES: 'Favorites',
  TRASH: 'Trash'
};

// Site visibility
export const SITE_VISIBILITY = {
  PUBLIC: 'PUBLIC',
  MODERATED: 'MODERATED',
  PRIVATE: 'PRIVATE'
};

// Site roles
export const SITE_ROLES = {
  SITE_CONSUMER: {
    ROLE: 'SiteConsumer',
    LABEL: 'Consumer'
  },
  SITE_COLLABORATOR: {
    ROLE: 'SiteCollaborator',
    LABEL: 'Collaborator'
  },
  SITE_CONTRIBUTOR: {
    ROLE: 'SiteContributor',
    LABEL: 'Contributor'
  },
  SITE_MANAGER: {
    ROLE: 'SiteManager',
    LABEL: 'Manager'
  },
  NONE: {
    LABEL: 'Not a member'
  }
};

export const FILES = {
  docxFile: 'file-docx.docx',
  docxFile2: 'file2-docx.docx',
  xlsxFile: 'file-xlsx.xlsx',
  xlsxFile2: 'file2-xlsx.xlsx',
  pdfFile: 'file-pdf.pdf',
  unsupportedFile: 'file_unsupported.3DS',
  protectedFile: {
    name: 'protected.pdf',
    password: '0000'
  },
  jpgFile: 'file-jpg.jpg'
};
