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
import {
  BpmProductVersionModel,
  EcmProductVersionModel
} from '../models/product-version.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { map, catchError } from 'rxjs/operators';
import * as i0 from '@angular/core';
import * as i1 from './alfresco-api.service';
export class DiscoveryApiService {
  /**
   * @param {?} apiService
   */
  constructor(apiService) {
    this.apiService = apiService;
  }
  /**
   * Gets product information for Content Services.
   * @return {?} ProductVersionModel containing product details
   */
  getEcmProductInfo() {
    return from(
      this.apiService
        .getInstance()
        .discovery.discoveryApi.getRepositoryInformation()
    ).pipe(
      map(
        /**
         * @param {?} res
         * @return {?}
         */
        res => new EcmProductVersionModel(res)
      ),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => throwError(err)
      )
    );
  }
  /**
   * Gets product information for Process Services.
   * @return {?} ProductVersionModel containing product details
   */
  getBpmProductInfo() {
    return from(
      this.apiService.getInstance().activiti.aboutApi.getAppVersion()
    ).pipe(
      map(
        /**
         * @param {?} res
         * @return {?}
         */
        res => new BpmProductVersionModel(res)
      ),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => throwError(err)
      )
    );
  }
}
DiscoveryApiService.decorators = [
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
DiscoveryApiService.ctorParameters = () => [{ type: AlfrescoApiService }];
/** @nocollapse */ DiscoveryApiService.ngInjectableDef = i0.defineInjectable({
  factory: function DiscoveryApiService_Factory() {
    return new DiscoveryApiService(i0.inject(i1.AlfrescoApiService));
  },
  token: DiscoveryApiService,
  providedIn: 'root'
});
if (false) {
  /**
   * @type {?}
   * @private
   */
  DiscoveryApiService.prototype.apiService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY292ZXJ5LWFwaS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsic2VydmljZXMvZGlzY292ZXJ5LWFwaS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDcEQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLHNCQUFzQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDakcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDNUQsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBS2pELE1BQU0sT0FBTyxtQkFBbUI7Ozs7SUFFNUIsWUFBb0IsVUFBOEI7UUFBOUIsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7SUFBSSxDQUFDOzs7OztJQU1oRCxpQkFBaUI7UUFDcEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLHdCQUF3QixFQUFFLENBQUM7YUFDdkYsSUFBSSxDQUNELEdBQUc7Ozs7UUFBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsRUFBQyxFQUM3QyxVQUFVOzs7O1FBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUN2QyxDQUFDO0lBQ1YsQ0FBQzs7Ozs7SUFNTSxpQkFBaUI7UUFDcEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQ3ZFLElBQUksQ0FDRCxHQUFHOzs7O1FBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksc0JBQXNCLENBQUMsR0FBRyxDQUFDLEVBQUMsRUFDN0MsVUFBVTs7OztRQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FDdkMsQ0FBQztJQUNWLENBQUM7OztZQTdCSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7Ozs7WUFMUSxrQkFBa0I7Ozs7Ozs7O0lBUVgseUNBQXNDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbSwgdGhyb3dFcnJvciwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQnBtUHJvZHVjdFZlcnNpb25Nb2RlbCwgRWNtUHJvZHVjdFZlcnNpb25Nb2RlbCB9IGZyb20gJy4uL21vZGVscy9wcm9kdWN0LXZlcnNpb24ubW9kZWwnO1xuaW1wb3J0IHsgQWxmcmVzY29BcGlTZXJ2aWNlIH0gZnJvbSAnLi9hbGZyZXNjby1hcGkuc2VydmljZSc7XG5pbXBvcnQgeyBtYXAsIGNhdGNoRXJyb3IgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgRGlzY292ZXJ5QXBpU2VydmljZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwaVNlcnZpY2U6IEFsZnJlc2NvQXBpU2VydmljZSkgeyB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHByb2R1Y3QgaW5mb3JtYXRpb24gZm9yIENvbnRlbnQgU2VydmljZXMuXG4gICAgICogQHJldHVybnMgUHJvZHVjdFZlcnNpb25Nb2RlbCBjb250YWluaW5nIHByb2R1Y3QgZGV0YWlsc1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRFY21Qcm9kdWN0SW5mbygpOiBPYnNlcnZhYmxlPEVjbVByb2R1Y3RWZXJzaW9uTW9kZWw+IHtcbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkuZGlzY292ZXJ5LmRpc2NvdmVyeUFwaS5nZXRSZXBvc2l0b3J5SW5mb3JtYXRpb24oKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgocmVzKSA9PiBuZXcgRWNtUHJvZHVjdFZlcnNpb25Nb2RlbChyZXMpKSxcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRocm93RXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBwcm9kdWN0IGluZm9ybWF0aW9uIGZvciBQcm9jZXNzIFNlcnZpY2VzLlxuICAgICAqIEByZXR1cm5zIFByb2R1Y3RWZXJzaW9uTW9kZWwgY29udGFpbmluZyBwcm9kdWN0IGRldGFpbHNcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QnBtUHJvZHVjdEluZm8oKTogT2JzZXJ2YWJsZTxCcG1Qcm9kdWN0VmVyc2lvbk1vZGVsPiB7XG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLmFjdGl2aXRpLmFib3V0QXBpLmdldEFwcFZlcnNpb24oKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgocmVzKSA9PiBuZXcgQnBtUHJvZHVjdFZlcnNpb25Nb2RlbChyZXMpKSxcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRocm93RXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxufVxuIl19
