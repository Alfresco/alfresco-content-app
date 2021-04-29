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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SiteEntry } from '@alfresco/js-api';

@Injectable({
  providedIn: 'root'
})
export class AppHookService {
  /**
   * Gets emitted when reloads event fired
   */
  reload = new Subject<any>();

  /**
   * Gets emitted when user reset the node
   */
  reset = new Subject<any>();

  /**
   * Gets emitted when user delete the node
   */
  nodesDeleted = new Subject<any>();

  /**
   * Gets emitted when user delete the library
   */
  libraryDeleted = new Subject<string>();

  /**
   * Gets emitted when user create the library
   */
  libraryCreated = new Subject<SiteEntry>();

  /**
   * Gets emitted when user update the library
   */
  libraryUpdated = new Subject<SiteEntry>();

  /**
   * Gets emitted when user join the library
   */
  libraryJoined = new Subject<string>();

  /**
   * Gets emitted when user left the library
   */
  libraryLeft = new Subject<string>();

  /**
   * Gets emitted when library throws 400 error code
   */
  library400Error = new Subject<any>();

  /**
   * Gets emitted when user join the library
   */
  joinLibraryToggle = new Subject<string>();

  /**
   * Gets emitted when user unlink the node
   */
  linksUnshared = new Subject<any>();

  /**
   * Gets emitted when user mark the the favorite library
   */
  favoriteLibraryToggle = new Subject<any>();
}
