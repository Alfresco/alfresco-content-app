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
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import {
  AppConfigService,
  AppConfigValues
} from '../app-config/app-config.service';
export class DebugAppConfigService extends AppConfigService {
  /**
   * @param {?} storage
   * @param {?} http
   */
  constructor(storage, http) {
    super(http);
    this.storage = storage;
  }
  /**
   * @override
   * @template T
   * @param {?} key
   * @param {?=} defaultValue
   * @return {?}
   */
  get(key, defaultValue) {
    if (key === AppConfigValues.OAUTHCONFIG) {
      return (
        /** @type {?} */ (JSON.parse(this.storage.getItem(key)) ||
        super.get(key, defaultValue))
      );
    } else if (key === AppConfigValues.APPLICATION) {
      return undefined;
    } else {
      return (
        /** @type {?} */ (/** @type {?} */ (this.storage.getItem(key)) ||
        super.get(key, defaultValue))
      );
    }
  }
}
DebugAppConfigService.decorators = [{ type: Injectable }];
/** @nocollapse */
DebugAppConfigService.ctorParameters = () => [
  { type: StorageService },
  { type: HttpClient }
];
if (false) {
  /**
   * @type {?}
   * @private
   */
  DebugAppConfigService.prototype.storage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWctYXBwLWNvbmZpZy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiYXBwLWNvbmZpZy9kZWJ1Zy1hcHAtY29uZmlnLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUdyRixNQUFNLE9BQU8scUJBQXNCLFNBQVEsZ0JBQWdCOzs7OztJQUN2RCxZQUFvQixPQUF1QixFQUFFLElBQWdCO1FBQ3pELEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQURJLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBRTNDLENBQUM7Ozs7Ozs7O0lBR0QsR0FBRyxDQUFJLEdBQVcsRUFBRSxZQUFnQjtRQUNoQyxJQUFJLEdBQUcsS0FBSyxlQUFlLENBQUMsV0FBVyxFQUFFO1lBQ3JDLE9BQU8sbUJBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBSSxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUMsRUFBQSxDQUFDO1NBQ3pGO2FBQU0sSUFBSSxHQUFHLEtBQUssZUFBZSxDQUFDLFdBQVcsRUFBRTtZQUM1QyxPQUFPLFNBQVMsQ0FBQztTQUNwQjthQUFNO1lBQ0gsT0FBTyxtQkFBSSxDQUFDLG1CQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFBLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBSSxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUMsRUFBQSxDQUFDO1NBQ25GO0lBQ0wsQ0FBQzs7O1lBZkosVUFBVTs7OztZQUhGLGNBQWM7WUFEZCxVQUFVOzs7Ozs7O0lBTUgsd0NBQStCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IFN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlJztcbmltcG9ydCB7IEFwcENvbmZpZ1NlcnZpY2UsIEFwcENvbmZpZ1ZhbHVlcyB9IGZyb20gJy4uL2FwcC1jb25maWcvYXBwLWNvbmZpZy5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlYnVnQXBwQ29uZmlnU2VydmljZSBleHRlbmRzIEFwcENvbmZpZ1NlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc3RvcmFnZTogU3RvcmFnZVNlcnZpY2UsIGh0dHA6IEh0dHBDbGllbnQpIHtcbiAgICAgICAgc3VwZXIoaHR0cCk7XG4gICAgfVxuXG4gICAgLyoqIEBvdmVycmlkZSAqL1xuICAgIGdldDxUPihrZXk6IHN0cmluZywgZGVmYXVsdFZhbHVlPzogVCk6IFQge1xuICAgICAgICBpZiAoa2V5ID09PSBBcHBDb25maWdWYWx1ZXMuT0FVVEhDT05GSUcpIHtcbiAgICAgICAgICAgIHJldHVybiA8VD4gKEpTT04ucGFyc2UodGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KSkgfHwgc3VwZXIuZ2V0PFQ+KGtleSwgZGVmYXVsdFZhbHVlKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBBcHBDb25maWdWYWx1ZXMuQVBQTElDQVRJT04pIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gPFQ+ICg8YW55PiB0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpIHx8IHN1cGVyLmdldDxUPihrZXksIGRlZmF1bHRWYWx1ZSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
