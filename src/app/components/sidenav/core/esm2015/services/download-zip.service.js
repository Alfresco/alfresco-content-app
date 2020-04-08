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
import { LogService } from './log.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { catchError } from 'rxjs/operators';
import * as i0 from '@angular/core';
import * as i1 from './alfresco-api.service';
import * as i2 from './log.service';
export class DownloadZipService {
  /**
   * @param {?} apiService
   * @param {?} logService
   */
  constructor(apiService, logService) {
    this.apiService = apiService;
    this.logService = logService;
  }
  /**
   * Creates a new download.
   * @param {?} payload Object containing the node IDs of the items to add to the ZIP file
   * @return {?} Status object for the download
   */
  createDownload(payload) {
    return from(
      this.apiService.getInstance().core.downloadsApi.createDownload(payload)
    ).pipe(
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
   * Gets a content URL for the given node.
   * @param {?} nodeId Node to get URL for.
   * @param {?=} attachment Toggles whether to retrieve content as an attachment for download
   * @return {?} URL string
   */
  getContentUrl(nodeId, attachment) {
    return this.apiService
      .getInstance()
      .content.getContentUrl(nodeId, attachment);
  }
  /**
   * Gets a Node via its node ID.
   * @param {?} nodeId ID of the target node
   * @return {?} Details of the node
   */
  getNode(nodeId) {
    return from(this.apiService.getInstance().core.nodesApi.getNode(nodeId));
  }
  /**
   * Gets status information for a download node.
   * @param {?} downloadId ID of the download node
   * @return {?} Status object for the download
   */
  getDownload(downloadId) {
    return from(
      this.apiService.getInstance().core.downloadsApi.getDownload(downloadId)
    );
  }
  /**
   * Cancels a download.
   * @param {?} downloadId ID of the target download node
   * @return {?}
   */
  cancelDownload(downloadId) {
    this.apiService.getInstance().core.downloadsApi.cancelDownload(downloadId);
  }
  /**
   * @private
   * @param {?} error
   * @return {?}
   */
  handleError(error) {
    this.logService.error(error);
    return throwError(error || 'Server error');
  }
}
DownloadZipService.decorators = [
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
DownloadZipService.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: LogService }
];
/** @nocollapse */ DownloadZipService.ngInjectableDef = i0.defineInjectable({
  factory: function DownloadZipService_Factory() {
    return new DownloadZipService(
      i0.inject(i1.AlfrescoApiService),
      i0.inject(i2.LogService)
    );
  },
  token: DownloadZipService,
  providedIn: 'root'
});
if (false) {
  /**
   * @type {?}
   * @private
   */
  DownloadZipService.prototype.apiService;
  /**
   * @type {?}
   * @private
   */
  DownloadZipService.prototype.logService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQtemlwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9kb3dubG9hZC16aXAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0FBSzVDLE1BQU0sT0FBTyxrQkFBa0I7Ozs7O0lBRTNCLFlBQW9CLFVBQThCLEVBQzlCLFVBQXNCO1FBRHRCLGVBQVUsR0FBVixVQUFVLENBQW9CO1FBQzlCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFDMUMsQ0FBQzs7Ozs7O0lBT0QsY0FBYyxDQUFDLE9BQTJCO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3JGLFVBQVU7Ozs7UUFBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUM3QyxDQUFDO0lBQ04sQ0FBQzs7Ozs7OztJQVFELGFBQWEsQ0FBQyxNQUFjLEVBQUUsVUFBb0I7UUFDOUMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ25GLENBQUM7Ozs7OztJQU9ELE9BQU8sQ0FBQyxNQUFjO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDOzs7Ozs7SUFPRCxXQUFXLENBQUMsVUFBa0I7UUFDMUIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7Ozs7OztJQU1ELGNBQWMsQ0FBQyxVQUFrQjtRQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9FLENBQUM7Ozs7OztJQUVPLFdBQVcsQ0FBQyxLQUFVO1FBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLE9BQU8sVUFBVSxDQUFDLEtBQUssSUFBSSxjQUFjLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7WUEzREosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7O1lBTFEsa0JBQWtCO1lBRGxCLFVBQVU7Ozs7Ozs7O0lBU0gsd0NBQXNDOzs7OztJQUN0Qyx3Q0FBOEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBOb2RlRW50cnksIERvd25sb2FkRW50cnksIERvd25sb2FkQm9keUNyZWF0ZSB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZnJvbSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTG9nU2VydmljZSB9IGZyb20gJy4vbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWxmcmVzY29BcGlTZXJ2aWNlIH0gZnJvbSAnLi9hbGZyZXNjby1hcGkuc2VydmljZSc7XG5pbXBvcnQgeyBjYXRjaEVycm9yIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIERvd25sb2FkWmlwU2VydmljZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwaVNlcnZpY2U6IEFsZnJlc2NvQXBpU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGxvZ1NlcnZpY2U6IExvZ1NlcnZpY2UpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGRvd25sb2FkLlxuICAgICAqIEBwYXJhbSBwYXlsb2FkIE9iamVjdCBjb250YWluaW5nIHRoZSBub2RlIElEcyBvZiB0aGUgaXRlbXMgdG8gYWRkIHRvIHRoZSBaSVAgZmlsZVxuICAgICAqIEByZXR1cm5zIFN0YXR1cyBvYmplY3QgZm9yIHRoZSBkb3dubG9hZFxuICAgICAqL1xuICAgIGNyZWF0ZURvd25sb2FkKHBheWxvYWQ6IERvd25sb2FkQm9keUNyZWF0ZSk6IE9ic2VydmFibGU8RG93bmxvYWRFbnRyeT4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5jb3JlLmRvd25sb2Fkc0FwaS5jcmVhdGVEb3dubG9hZChwYXlsb2FkKSkucGlwZShcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBjb250ZW50IFVSTCBmb3IgdGhlIGdpdmVuIG5vZGUuXG4gICAgICogQHBhcmFtIG5vZGVJZCBOb2RlIHRvIGdldCBVUkwgZm9yLlxuICAgICAqIEBwYXJhbSBhdHRhY2htZW50IFRvZ2dsZXMgd2hldGhlciB0byByZXRyaWV2ZSBjb250ZW50IGFzIGFuIGF0dGFjaG1lbnQgZm9yIGRvd25sb2FkXG4gICAgICogQHJldHVybnMgVVJMIHN0cmluZ1xuICAgICAqL1xuICAgIGdldENvbnRlbnRVcmwobm9kZUlkOiBzdHJpbmcsIGF0dGFjaG1lbnQ/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLmNvbnRlbnQuZ2V0Q29udGVudFVybChub2RlSWQsIGF0dGFjaG1lbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBOb2RlIHZpYSBpdHMgbm9kZSBJRC5cbiAgICAgKiBAcGFyYW0gbm9kZUlkIElEIG9mIHRoZSB0YXJnZXQgbm9kZVxuICAgICAqIEByZXR1cm5zIERldGFpbHMgb2YgdGhlIG5vZGVcbiAgICAgKi9cbiAgICBnZXROb2RlKG5vZGVJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxOb2RlRW50cnk+IHtcbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkuY29yZS5ub2Rlc0FwaS5nZXROb2RlKG5vZGVJZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgc3RhdHVzIGluZm9ybWF0aW9uIGZvciBhIGRvd25sb2FkIG5vZGUuXG4gICAgICogQHBhcmFtIGRvd25sb2FkSWQgSUQgb2YgdGhlIGRvd25sb2FkIG5vZGVcbiAgICAgKiBAcmV0dXJucyBTdGF0dXMgb2JqZWN0IGZvciB0aGUgZG93bmxvYWRcbiAgICAgKi9cbiAgICBnZXREb3dubG9hZChkb3dubG9hZElkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPERvd25sb2FkRW50cnk+IHtcbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkuY29yZS5kb3dubG9hZHNBcGkuZ2V0RG93bmxvYWQoZG93bmxvYWRJZCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbmNlbHMgYSBkb3dubG9hZC5cbiAgICAgKiBAcGFyYW0gZG93bmxvYWRJZCBJRCBvZiB0aGUgdGFyZ2V0IGRvd25sb2FkIG5vZGVcbiAgICAgKi9cbiAgICBjYW5jZWxEb3dubG9hZChkb3dubG9hZElkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkuY29yZS5kb3dubG9hZHNBcGkuY2FuY2VsRG93bmxvYWQoZG93bmxvYWRJZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVFcnJvcihlcnJvcjogYW55KSB7XG4gICAgICAgIHRoaXMubG9nU2VydmljZS5lcnJvcihlcnJvcik7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yIHx8ICdTZXJ2ZXIgZXJyb3InKTtcbiAgICB9XG59XG4iXX0=
