/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { Injectable } from '@angular/core';
import { from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ContentService } from './content.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { LogService } from './log.service';
import { EcmUserModel } from '../models/ecm-user.model';
import * as i0 from '@angular/core';
import * as i1 from './alfresco-api.service';
import * as i2 from './content.service';
import * as i3 from './log.service';
export class EcmUserService {
  /**
   * @param {?} apiService
   * @param {?} contentService
   * @param {?} logService
   */
  constructor(apiService, contentService, logService) {
    this.apiService = apiService;
    this.contentService = contentService;
    this.logService = logService;
  }
  /**
   * Gets information about a user identified by their username.
   * @param {?} userName Target username
   * @return {?} User information
   */
  getUserInfo(userName) {
    return from(
      this.apiService.getInstance().core.peopleApi.getPerson(userName)
    ).pipe(
      map(
        /**
         * @param {?} personEntry
         * @return {?}
         */
        personEntry => {
          return new EcmUserModel(personEntry.entry);
        }
      ),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets information about the user who is currently logged-in.
   * @return {?} User information as for getUserInfo
   */
  getCurrentUserInfo() {
    return this.getUserInfo('-me-');
  }
  /**
   * Returns a profile image as a URL.
   * @param {?} avatarId Target avatar
   * @return {?} Image URL
   */
  getUserProfileImage(avatarId) {
    if (avatarId) {
      return this.contentService.getContentUrl(avatarId);
    }
    return null;
  }
  /**
   * Throw the error
   * @private
   * @param {?} error
   * @return {?}
   */
  handleError(error) {
    this.logService.error(error);
    return throwError(error || 'Server error');
  }
}
EcmUserService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */
EcmUserService.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: ContentService },
  { type: LogService }
];
/** @nocollapse */ EcmUserService.ngInjectableDef = i0.defineInjectable({
  factory: function EcmUserService_Factory() {
    return new EcmUserService(
      i0.inject(i1.AlfrescoApiService),
      i0.inject(i2.ContentService),
      i0.inject(i3.LogService)
    );
  },
  token: EcmUserService,
  providedIn: 'root'
});
if (false) {
  /**
   * @type {?}
   * @private
   */
  EcmUserService.prototype.apiService;
  /**
   * @type {?}
   * @private
   */
  EcmUserService.prototype.contentService;
  /**
   * @type {?}
   * @private
   */
  EcmUserService.prototype.logService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNtLXVzZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInNlcnZpY2VzL2VjbS11c2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwRCxPQUFPLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7QUFNeEQsTUFBTSxPQUFPLGNBQWM7Ozs7OztJQUV2QixZQUFvQixVQUE4QixFQUM5QixjQUE4QixFQUM5QixVQUFzQjtRQUZ0QixlQUFVLEdBQVYsVUFBVSxDQUFvQjtRQUM5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUMxQyxDQUFDOzs7Ozs7SUFPRCxXQUFXLENBQUMsUUFBZ0I7UUFDeEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN4RSxJQUFJLENBQ0QsR0FBRzs7OztRQUFDLENBQUMsV0FBd0IsRUFBRSxFQUFFO1lBQzdCLE9BQU8sSUFBSSxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLENBQUMsRUFBQyxFQUNGLFVBQVU7Ozs7UUFBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUM3QyxDQUFDO0lBQ1YsQ0FBQzs7Ozs7SUFNRCxrQkFBa0I7UUFDZCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQzs7Ozs7O0lBT0QsbUJBQW1CLENBQUMsUUFBZ0I7UUFDaEMsSUFBSSxRQUFRLEVBQUU7WUFDVixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7Ozs7OztJQU1PLFdBQVcsQ0FBQyxLQUFVO1FBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLE9BQU8sVUFBVSxDQUFDLEtBQUssSUFBSSxjQUFjLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7WUFwREosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7O1lBUFEsa0JBQWtCO1lBRGxCLGNBQWM7WUFFZCxVQUFVOzs7Ozs7OztJQVNILG9DQUFzQzs7Ozs7SUFDdEMsd0NBQXNDOzs7OztJQUN0QyxvQ0FBOEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBmcm9tLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIGNhdGNoRXJyb3IgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDb250ZW50U2VydmljZSB9IGZyb20gJy4vY29udGVudC5zZXJ2aWNlJztcbmltcG9ydCB7IEFsZnJlc2NvQXBpU2VydmljZSB9IGZyb20gJy4vYWxmcmVzY28tYXBpLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9nU2VydmljZSB9IGZyb20gJy4vbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWNtVXNlck1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2VjbS11c2VyLm1vZGVsJztcbmltcG9ydCB7IFBlcnNvbkVudHJ5IH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgRWNtVXNlclNlcnZpY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcGlTZXJ2aWNlOiBBbGZyZXNjb0FwaVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBjb250ZW50U2VydmljZTogQ29udGVudFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBsb2dTZXJ2aWNlOiBMb2dTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBpbmZvcm1hdGlvbiBhYm91dCBhIHVzZXIgaWRlbnRpZmllZCBieSB0aGVpciB1c2VybmFtZS5cbiAgICAgKiBAcGFyYW0gdXNlck5hbWUgVGFyZ2V0IHVzZXJuYW1lXG4gICAgICogQHJldHVybnMgVXNlciBpbmZvcm1hdGlvblxuICAgICAqL1xuICAgIGdldFVzZXJJbmZvKHVzZXJOYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPEVjbVVzZXJNb2RlbD4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5jb3JlLnBlb3BsZUFwaS5nZXRQZXJzb24odXNlck5hbWUpKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKChwZXJzb25FbnRyeTogUGVyc29uRW50cnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFY21Vc2VyTW9kZWwocGVyc29uRW50cnkuZW50cnkpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGluZm9ybWF0aW9uIGFib3V0IHRoZSB1c2VyIHdobyBpcyBjdXJyZW50bHkgbG9nZ2VkLWluLlxuICAgICAqIEByZXR1cm5zIFVzZXIgaW5mb3JtYXRpb24gYXMgZm9yIGdldFVzZXJJbmZvXG4gICAgICovXG4gICAgZ2V0Q3VycmVudFVzZXJJbmZvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRVc2VySW5mbygnLW1lLScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBwcm9maWxlIGltYWdlIGFzIGEgVVJMLlxuICAgICAqIEBwYXJhbSBhdmF0YXJJZCBUYXJnZXQgYXZhdGFyXG4gICAgICogQHJldHVybnMgSW1hZ2UgVVJMXG4gICAgICovXG4gICAgZ2V0VXNlclByb2ZpbGVJbWFnZShhdmF0YXJJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGF2YXRhcklkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50U2VydmljZS5nZXRDb250ZW50VXJsKGF2YXRhcklkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaHJvdyB0aGUgZXJyb3JcbiAgICAgKiBAcGFyYW0gZXJyb3JcbiAgICAgKi9cbiAgICBwcml2YXRlIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpIHtcbiAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmVycm9yKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IgfHwgJ1NlcnZlciBlcnJvcicpO1xuICAgIH1cblxufVxuIl19
