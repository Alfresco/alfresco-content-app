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
import { RuleContext } from '@alfresco/adf-extensions';
/**
 * Checks if a Preview route is activated.
 * JSON ref: `app.navigation.isPreview`
 */
export declare function isPreview(context: RuleContext): boolean;
/**
 * Checks if a **Favorites** route is activated.
 * JSON ref: `app.navigation.isFavorites`
 */
export declare function isFavorites(context: RuleContext): boolean;
/**
 * Checks if the activated route is not **Favorites**.
 * JSON ref: `app.navigation.isNotFavorites`
 */
export declare function isNotFavorites(context: RuleContext): boolean;
/**
 * Checks if a **Shared Files** route is activated.
 * JSON ref: `app.navigation.isSharedFiles`
 */
export declare function isSharedFiles(context: RuleContext): boolean;
/**
 * Checks if the activated route is not **Shared Files**.
 * JSON ref: `app.navigation.isNotSharedFiles`
 */
export declare function isNotSharedFiles(context: RuleContext): boolean;
/**
 * Checks if a **Trashcan** route is activated.
 * JSON ref: `app.navigation.isTrashcan`
 */
export declare function isTrashcan(context: RuleContext): boolean;
/**
 * Checks if the activated route is not **Trashcan**.
 * JSON ref: `app.navigation.isNotTrashcan`
 */
export declare function isNotTrashcan(context: RuleContext): boolean;
/**
 * Checks if a **Personal Files** route is activated.
 * JSON ref: `app.navigation.isPersonalFiles`
 */
export declare function isPersonalFiles(context: RuleContext): boolean;
/**
 * Checks if a **Library Files** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 */
export declare function isLibraryFiles(context: RuleContext): boolean;
/**
 * Checks if a **Library Files** or **Library Search Result** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 */
export declare function isLibraries(context: RuleContext): boolean;
/**
 * Checks if the activated route is neither **Libraries** nor **Library Search Results**.
 * JSON ref: `app.navigation.isNotLibraries`
 */
export declare function isNotLibraries(context: RuleContext): boolean;
/**
 * Checks if a **Recent Files** route is activated.
 * JSON ref: `app.navigation.isRecentFiles`
 */
export declare function isRecentFiles(context: RuleContext): boolean;
/**
 * Checks if the activated route is not **Recent Files**.
 * JSON ref: `app.navigation.isNotRecentFiles`
 */
export declare function isNotRecentFiles(context: RuleContext): boolean;
/**
 * Checks if a **Search Results** route is activated.
 * JSON ref: `app.navigation.isSearchResults`
 */
export declare function isSearchResults(context: RuleContext): boolean;
/**
 * Checks if the activated route is not **Search Results**.
 * JSON ref: `app.navigation.isNotSearchResults`
 */
export declare function isNotSearchResults(context: RuleContext): boolean;
/**
 * Checks if a **Shared Preview** route is activated.
 * JSON ref: `app.navigation.isSharedPreview`
 */
export declare function isSharedPreview(context: RuleContext): boolean;
/**
 * Checks if a **Favorites Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 */
export declare function isFavoritesPreview(context: RuleContext): boolean;
/**
 * Checks if a **Shared File Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 */
export declare function isSharedFileViewer(context: RuleContext): boolean;
