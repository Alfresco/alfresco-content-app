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
import { AlfrescoApiService } from './alfresco-api.service';
import { LogService } from './log.service';
import { BpmUserModel } from '../models/bpm-user.model';
/**
 *
 * BPMUserService retrieve all the information of an Ecm user.
 *
 */
export declare class BpmUserService {
  private apiService;
  private logService;
  constructor(apiService: AlfrescoApiService, logService: LogService);
  /**
   * Gets information about the current user.
   * @returns User information object
   */
  getCurrentUserInfo(): Observable<BpmUserModel>;
  /**
   * Gets the current user's profile image as a URL.
   * @returns URL string
   */
  getCurrentUserProfileImage(): string;
  /**
   * Throw the error
   * @param error
   */
  private handleError;
}
