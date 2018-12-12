/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

export const BROWSER_RESOLUTION_WIDTH = 1200;
export const BROWSER_RESOLUTION_HEIGHT = 800;

export const BROWSER_WAIT_TIMEOUT = 10000;

// Application configs
export const USE_HASH_STRATEGY = true;

// Repository configs
export const REPO_API_HOST = 'http://localhost:8080';
export const REPO_API_TENANT = '-default-';

// Admin details
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'admin';
export const ADMIN_FULL_NAME = 'Administrator';

export const E2E_ROOT_PATH = __dirname;

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
  FILE_LIBRARIES: 'File Libraries',
  MY_LIBRARIES: 'My Libraries',
  FAVORITE_LIBRARIES: 'Favorite Libraries',
  SHARED_FILES: 'Shared',
  RECENT_FILES: 'Recent Files',
  FAVORITES: 'Favorites',
  TRASH: 'Trash'
};

// Page titles
export const PAGE_TITLES = {
  VIEWER: 'Preview',
  SEARCH: 'Search Results',
  MY_LIBRARIES: 'My Libraries',
  FAVORITE_LIBRARIES: 'Favorite Libraries'
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
  }
};

export const FILES = {
  docxFile: 'file-docx.docx',
  xlsxFile: 'file-xlsx.xlsx',
  pdfFile: 'file-pdf.pdf',
  unsupportedFile: 'file_unsupported.3DS'
};

export const EXTENSIBILITY_CONFIGS = {
  DEFAULT_EXTENSIONS_CONFIG: 'extensions-default.json',
  INFO_DRAWER: 'info-drawer-ext.json',
  INFO_DRAWER_EMPTY: 'info-drawer-no-tabs-ext.json',
  VIEWER: 'viewer-ext.json',
  HEADER: 'header-ext.json',
  METADATA_PRESETS: 'metadata-ext.json',
  DOCUMENT_LIST_PRESETS: 'document-presets-ext.json',
  CONTEXT_SUBMENUS: 'context-submenus-ext.json'
};
