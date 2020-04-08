/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Observable } from 'rxjs';
import { ContentService } from './content.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { LogService } from './log.service';
import { EcmUserModel } from '../models/ecm-user.model';
export declare class EcmUserService {
  private apiService;
  private contentService;
  private logService;
  constructor(
    apiService: AlfrescoApiService,
    contentService: ContentService,
    logService: LogService
  );
  /**
   * Gets information about a user identified by their username.
   * @param userName Target username
   * @returns User information
   */
  getUserInfo(userName: string): Observable<EcmUserModel>;
  /**
   * Gets information about the user who is currently logged-in.
   * @returns User information as for getUserInfo
   */
  getCurrentUserInfo(): Observable<EcmUserModel>;
  /**
   * Returns a profile image as a URL.
   * @param avatarId Target avatar
   * @returns Image URL
   */
  getUserProfileImage(avatarId: string): string;
  /**
   * Throw the error
   * @param error
   */
  private handleError;
}
