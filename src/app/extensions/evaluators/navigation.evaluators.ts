/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { RuleContext, RuleParameter } from '@alfresco/adf-extensions';

/**
 * Checks if a Preview route is activated.
 * JSON ref: `app.navigation.isPreview`
 */
export function isPreview(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url && url.includes('/preview/');
}

/**
 * Checks if a **Favorites** route is activated.
 * JSON ref: `app.navigation.isFavorites`
 */
export function isFavorites(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url && url.startsWith('/favorites') && !isPreview(context, ...args);
}

/**
 * Checks if the activated route is not **Favorites**.
 * JSON ref: `app.navigation.isNotFavorites`
 */
export function isNotFavorites(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  return !isFavorites(context, ...args);
}

/**
 * Checks if a **Shared Files** route is activated.
 * JSON ref: `app.navigation.isSharedFiles`
 */
export function isSharedFiles(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url && url.startsWith('/shared') && !isPreview(context, ...args);
}

/**
 * Checks if the activated route is not **Shared Files**.
 * JSON ref: `app.navigation.isNotSharedFiles`
 */
export function isNotSharedFiles(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  return !isSharedFiles(context, ...args);
}

/**
 * Checks if a **Trashcan** route is activated.
 * JSON ref: `app.navigation.isTrashcan`
 */
export function isTrashcan(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url && url.startsWith('/trashcan');
}

/**
 * Checks if the activated route is not **Trashcan**.
 * JSON ref: `app.navigation.isNotTrashcan`
 */
export function isNotTrashcan(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  return !isTrashcan(context, ...args);
}

/**
 * Checks if a **Personal Files** route is activated.
 * JSON ref: `app.navigation.isPersonalFiles`
 */
export function isPersonalFiles(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url && url.startsWith('/personal-files');
}

/**
 * Checks if a **Library Files** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 */
export function isLibraryFiles(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url && url.startsWith('/libraries');
}

/**
 * Checks if a **Library Files** or **Library Search Result** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 */
export function isLibraries(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return (
    url && (url.endsWith('/libraries') || url.startsWith('/search-libraries'))
  );
}

/**
 * Checks if the activated route is neither **Libraries** nor **Library Search Results**.
 * JSON ref: `app.navigation.isNotLibraries`
 */
export function isNotLibraries(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  return !isLibraries(context, ...args);
}

/**
 * Checks if a **Recent Files** route is activated.
 * JSON ref: `app.navigation.isRecentFiles`
 */
export function isRecentFiles(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url && url.startsWith('/recent-files');
}

/**
 * Checks if the activated route is not **Recent Files**.
 * JSON ref: `app.navigation.isNotRecentFiles`
 */
export function isNotRecentFiles(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  return !isRecentFiles(context, ...args);
}

/**
 * Checks if a **Search Results** route is activated.
 * JSON ref: `app.navigation.isSearchResults`
 */
export function isSearchResults(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url && url.startsWith('/search');
}

/**
 * Checks if the activated route is not **Search Results**.
 * JSON ref: `app.navigation.isNotSearchResults`
 */
export function isNotSearchResults(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  return !isSearchResults(context, ...args);
}

/**
 * Checks if a **Shared Preview** route is activated.
 * JSON ref: `app.navigation.isSharedPreview`
 */
export function isSharedPreview(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url && url.startsWith('/shared/preview/');
}

/**
 * Checks if a **Favorites Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 */
export function isFavoritesPreview(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url && url.startsWith('/favorites/preview/');
}

/**
 * Checks if a **Shared File Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 */
export function isSharedFileViewer(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { url } = context.navigation;
  return url && url.startsWith('/preview/s/');
}
