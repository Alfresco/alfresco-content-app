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
import { AlfrescoApiService } from './alfresco-api.service';
import { LogService } from './log.service';
import { BpmUserModel } from '../models/bpm-user.model';
import { map, catchError } from 'rxjs/operators';
import * as i0 from '@angular/core';
import * as i1 from './alfresco-api.service';
import * as i2 from './log.service';
/**
 *
 * BPMUserService retrieve all the information of an Ecm user.
 *
 */
export class BpmUserService {
  /**
   * @param {?} apiService
   * @param {?} logService
   */
  constructor(apiService, logService) {
    this.apiService = apiService;
    this.logService = logService;
  }
  /**
   * Gets information about the current user.
   * @return {?} User information object
   */
  getCurrentUserInfo() {
    return from(
      this.apiService.getInstance().activiti.profileApi.getProfile()
    ).pipe(
      map(
        /**
         * @param {?} userRepresentation
         * @return {?}
         */
        userRepresentation => {
          return new BpmUserModel(userRepresentation);
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
   * Gets the current user's profile image as a URL.
   * @return {?} URL string
   */
  getCurrentUserProfileImage() {
    return this.apiService
      .getInstance()
      .activiti.profileApi.getProfilePictureUrl();
  }
  /**
   * Throw the error
   * @private
   * @param {?} error
   * @return {?}
   */
  handleError(error) {
    // in a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
    this.logService.error(error);
    return throwError(error || 'Server error');
  }
}
BpmUserService.decorators = [
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
BpmUserService.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: LogService }
];
/** @nocollapse */ BpmUserService.ngInjectableDef = i0.defineInjectable({
  factory: function BpmUserService_Factory() {
    return new BpmUserService(
      i0.inject(i1.AlfrescoApiService),
      i0.inject(i2.LogService)
    );
  },
  token: BpmUserService,
  providedIn: 'root'
});
if (false) {
  /**
   * @type {?}
   * @private
   */
  BpmUserService.prototype.apiService;
  /**
   * @type {?}
   * @private
   */
  BpmUserService.prototype.logService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnBtLXVzZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInNlcnZpY2VzL2JwbS11c2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7QUFXakQsTUFBTSxPQUFPLGNBQWM7Ozs7O0lBRXZCLFlBQW9CLFVBQThCLEVBQzlCLFVBQXNCO1FBRHRCLGVBQVUsR0FBVixVQUFVLENBQW9CO1FBQzlCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFDMUMsQ0FBQzs7Ozs7SUFNRCxrQkFBa0I7UUFDZCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDdEUsSUFBSSxDQUNELEdBQUc7Ozs7UUFBQyxDQUFDLGtCQUFzQyxFQUFFLEVBQUU7WUFDM0MsT0FBTyxJQUFJLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hELENBQUMsRUFBQyxFQUNGLFVBQVU7Ozs7UUFBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUM3QyxDQUFDO0lBQ1YsQ0FBQzs7Ozs7SUFNRCwwQkFBMEI7UUFDdEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNwRixDQUFDOzs7Ozs7O0lBTU8sV0FBVyxDQUFDLEtBQVU7UUFDMUIsbUZBQW1GO1FBQ25GLDRDQUE0QztRQUM1QyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QixPQUFPLFVBQVUsQ0FBQyxLQUFLLElBQUksY0FBYyxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7O1lBeENKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7OztZQWJRLGtCQUFrQjtZQUNsQixVQUFVOzs7Ozs7OztJQWVILG9DQUFzQzs7Ozs7SUFDdEMsb0NBQThCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZnJvbSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQWxmcmVzY29BcGlTZXJ2aWNlIH0gZnJvbSAnLi9hbGZyZXNjby1hcGkuc2VydmljZSc7XG5pbXBvcnQgeyBMb2dTZXJ2aWNlIH0gZnJvbSAnLi9sb2cuc2VydmljZSc7XG5pbXBvcnQgeyBCcG1Vc2VyTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvYnBtLXVzZXIubW9kZWwnO1xuaW1wb3J0IHsgbWFwLCBjYXRjaEVycm9yIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVXNlclJlcHJlc2VudGF0aW9uIH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5cbi8qKlxuICpcbiAqIEJQTVVzZXJTZXJ2aWNlIHJldHJpZXZlIGFsbCB0aGUgaW5mb3JtYXRpb24gb2YgYW4gRWNtIHVzZXIuXG4gKlxuICovXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEJwbVVzZXJTZXJ2aWNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBpU2VydmljZTogQWxmcmVzY29BcGlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgbG9nU2VydmljZTogTG9nU2VydmljZSkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgdXNlci5cbiAgICAgKiBAcmV0dXJucyBVc2VyIGluZm9ybWF0aW9uIG9iamVjdFxuICAgICAqL1xuICAgIGdldEN1cnJlbnRVc2VySW5mbygpOiBPYnNlcnZhYmxlPEJwbVVzZXJNb2RlbD4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5hY3Rpdml0aS5wcm9maWxlQXBpLmdldFByb2ZpbGUoKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgodXNlclJlcHJlc2VudGF0aW9uOiBVc2VyUmVwcmVzZW50YXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBCcG1Vc2VyTW9kZWwodXNlclJlcHJlc2VudGF0aW9uKTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY3VycmVudCB1c2VyJ3MgcHJvZmlsZSBpbWFnZSBhcyBhIFVSTC5cbiAgICAgKiBAcmV0dXJucyBVUkwgc3RyaW5nXG4gICAgICovXG4gICAgZ2V0Q3VycmVudFVzZXJQcm9maWxlSW1hZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLmFjdGl2aXRpLnByb2ZpbGVBcGkuZ2V0UHJvZmlsZVBpY3R1cmVVcmwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaHJvdyB0aGUgZXJyb3JcbiAgICAgKiBAcGFyYW0gZXJyb3JcbiAgICAgKi9cbiAgICBwcml2YXRlIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpIHtcbiAgICAgICAgLy8gaW4gYSByZWFsIHdvcmxkIGFwcCwgd2UgbWF5IHNlbmQgdGhlIGVycm9yIHRvIHNvbWUgcmVtb3RlIGxvZ2dpbmcgaW5mcmFzdHJ1Y3R1cmVcbiAgICAgICAgLy8gaW5zdGVhZCBvZiBqdXN0IGxvZ2dpbmcgaXQgdG8gdGhlIGNvbnNvbGVcbiAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmVycm9yKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IgfHwgJ1NlcnZlciBlcnJvcicpO1xuICAgIH1cblxufVxuIl19
