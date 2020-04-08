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
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, from, throwError } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { AuthenticationService } from './authentication.service';
import { LogService } from './log.service';
import { catchError } from 'rxjs/operators';
import { PermissionsEnum } from '../models/permissions.enum';
import { AllowableOperationsEnum } from '../models/allowable-operations.enum';
import { DownloadService } from './download.service';
import { ThumbnailService } from './thumbnail.service';
import * as i0 from '@angular/core';
import * as i1 from './authentication.service';
import * as i2 from './alfresco-api.service';
import * as i3 from './log.service';
import * as i4 from '@angular/platform-browser';
import * as i5 from './download.service';
import * as i6 from './thumbnail.service';
export class ContentService {
  /**
   * @param {?} authService
   * @param {?} apiService
   * @param {?} logService
   * @param {?} sanitizer
   * @param {?} downloadService
   * @param {?} thumbnailService
   */
  constructor(
    authService,
    apiService,
    logService,
    sanitizer,
    downloadService,
    thumbnailService
  ) {
    this.authService = authService;
    this.apiService = apiService;
    this.logService = logService;
    this.sanitizer = sanitizer;
    this.downloadService = downloadService;
    this.thumbnailService = thumbnailService;
    this.folderCreated = new Subject();
    this.folderCreate = new Subject();
    this.folderEdit = new Subject();
  }
  /**
   * @deprecated in 3.2.0, use DownloadService instead.
   * Invokes content download for a Blob with a file name.
   * @param {?} blob Content to download.
   * @param {?} fileName Name of the resulting file.
   * @return {?}
   */
  downloadBlob(blob, fileName) {
    this.downloadService.downloadBlob(blob, fileName);
  }
  /**
   * @deprecated in 3.2.0, use DownloadService instead.
   * Invokes content download for a data array with a file name.
   * @param {?} data Data to download.
   * @param {?} fileName Name of the resulting file.
   * @return {?}
   */
  downloadData(data, fileName) {
    this.downloadService.downloadData(data, fileName);
  }
  /**
   * @deprecated in 3.2.0, use DownloadService instead.
   * Invokes content download for a JSON object with a file name.
   * @param {?} json JSON object to download.
   * @param {?} fileName Name of the resulting file.
   * @return {?}
   */
  downloadJSON(json, fileName) {
    this.downloadService.downloadJSON(json, fileName);
  }
  /**
   * Creates a trusted object URL from the Blob.
   * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
   * @param {?} blob Data to wrap into object URL
   * @return {?} URL string
   */
  createTrustedUrl(blob) {
    /** @type {?} */
    const url = window.URL.createObjectURL(blob);
    return /** @type {?} */ (this.sanitizer.bypassSecurityTrustUrl(url));
  }
  /**
   * @private
   * @return {?}
   */
  get contentApi() {
    return this.apiService.getInstance().content;
  }
  /**
   * @deprecated in 3.2.0, use ThumbnailService instead.
   * Gets a thumbnail URL for the given document node.
   * @param {?} node Node or Node ID to get URL for.
   * @param {?=} attachment Toggles whether to retrieve content as an attachment for download
   * @param {?=} ticket Custom ticket to use for authentication
   * @return {?} URL string
   */
  getDocumentThumbnailUrl(node, attachment, ticket) {
    return this.thumbnailService.getDocumentThumbnailUrl(
      node,
      attachment,
      ticket
    );
  }
  /**
   * Gets a content URL for the given node.
   * @param {?} node Node or Node ID to get URL for.
   * @param {?=} attachment Toggles whether to retrieve content as an attachment for download
   * @param {?=} ticket Custom ticket to use for authentication
   * @return {?} URL string or `null`
   */
  getContentUrl(node, attachment, ticket) {
    if (node) {
      /** @type {?} */
      let nodeId;
      if (typeof node === 'string') {
        nodeId = node;
      } else if (node.entry) {
        nodeId = node.entry.id;
      }
      return this.contentApi.getContentUrl(nodeId, attachment, ticket);
    }
    return null;
  }
  /**
   * Gets content for the given node.
   * @param {?} nodeId ID of the target node
   * @return {?} Content data
   */
  getNodeContent(nodeId) {
    return from(
      this.apiService.getInstance().core.nodesApi.getFileContent(nodeId)
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
   * Gets a Node via its node ID.
   * @param {?} nodeId ID of the target node
   * @param {?=} opts Options supported by JS-API
   * @return {?} Details of the folder
   */
  getNode(nodeId, opts) {
    return from(this.apiService.getInstance().nodes.getNode(nodeId, opts));
  }
  /**
   * Checks if the user has permission on that node
   * @param {?} node Node to check permissions
   * @param {?} permission Required permission type
   * @return {?} True if the user has the required permissions, false otherwise
   */
  hasPermissions(node, permission) {
    /** @type {?} */
    let hasPermissions = false;
    if (node && node.permissions && node.permissions.locallySet) {
      if (permission && permission.startsWith('!')) {
        hasPermissions = node.permissions.locallySet.find(
          /**
           * @param {?} currentPermission
           * @return {?}
           */
          currentPermission =>
            currentPermission.name === permission.replace('!', '')
        )
          ? false
          : true;
      } else {
        hasPermissions = node.permissions.locallySet.find(
          /**
           * @param {?} currentPermission
           * @return {?}
           */
          currentPermission => currentPermission.name === permission
        )
          ? true
          : false;
      }
    } else {
      if (permission === PermissionsEnum.CONSUMER) {
        hasPermissions = true;
      } else if (permission === PermissionsEnum.NOT_CONSUMER) {
        hasPermissions = false;
      } else if (permission && permission.startsWith('!')) {
        hasPermissions = true;
      }
    }
    return hasPermissions;
  }
  /**
   * Checks if the user has permissions on that node
   * @param {?} node Node to check allowableOperations
   * @param {?} allowableOperation Create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions
   * @return {?} True if the user has the required permissions, false otherwise
   */
  hasAllowableOperations(node, allowableOperation) {
    /** @type {?} */
    let hasAllowableOperations = false;
    if (node && node.allowableOperations) {
      if (allowableOperation && allowableOperation.startsWith('!')) {
        hasAllowableOperations = node.allowableOperations.find(
          /**
           * @param {?} currentOperation
           * @return {?}
           */
          currentOperation =>
            currentOperation === allowableOperation.replace('!', '')
        )
          ? false
          : true;
      } else {
        hasAllowableOperations = node.allowableOperations.find(
          /**
           * @param {?} currentOperation
           * @return {?}
           */
          currentOperation => currentOperation === allowableOperation
        )
          ? true
          : false;
      }
    } else {
      if (allowableOperation && allowableOperation.startsWith('!')) {
        hasAllowableOperations = true;
      }
    }
    if (allowableOperation === AllowableOperationsEnum.COPY) {
      hasAllowableOperations = true;
    }
    if (allowableOperation === AllowableOperationsEnum.LOCK) {
      hasAllowableOperations = node.isFile;
      if (node.isLocked && node.allowableOperations) {
        hasAllowableOperations = !!~node.allowableOperations.indexOf(
          'updatePermissions'
        );
      }
    }
    return hasAllowableOperations;
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
ContentService.decorators = [
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
ContentService.ctorParameters = () => [
  { type: AuthenticationService },
  { type: AlfrescoApiService },
  { type: LogService },
  { type: DomSanitizer },
  { type: DownloadService },
  { type: ThumbnailService }
];
/** @nocollapse */ ContentService.ngInjectableDef = i0.defineInjectable({
  factory: function ContentService_Factory() {
    return new ContentService(
      i0.inject(i1.AuthenticationService),
      i0.inject(i2.AlfrescoApiService),
      i0.inject(i3.LogService),
      i0.inject(i4.DomSanitizer),
      i0.inject(i5.DownloadService),
      i0.inject(i6.ThumbnailService)
    );
  },
  token: ContentService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  ContentService.prototype.folderCreated;
  /** @type {?} */
  ContentService.prototype.folderCreate;
  /** @type {?} */
  ContentService.prototype.folderEdit;
  /** @type {?} */
  ContentService.prototype.authService;
  /** @type {?} */
  ContentService.prototype.apiService;
  /**
   * @type {?}
   * @private
   */
  ContentService.prototype.logService;
  /**
   * @type {?}
   * @private
   */
  ContentService.prototype.sanitizer;
  /**
   * @type {?}
   * @private
   */
  ContentService.prototype.downloadService;
  /**
   * @type {?}
   * @private
   */
  ContentService.prototype.thumbnailService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsic2VydmljZXMvY29udGVudC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXpELE9BQU8sRUFBYyxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUU3RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDN0QsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDOUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDOzs7Ozs7OztBQUt2RCxNQUFNLE9BQU8sY0FBYzs7Ozs7Ozs7O0lBTXZCLFlBQW1CLFdBQWtDLEVBQ2xDLFVBQThCLEVBQzdCLFVBQXNCLEVBQ3RCLFNBQXVCLEVBQ3ZCLGVBQWdDLEVBQ2hDLGdCQUFrQztRQUxuQyxnQkFBVyxHQUFYLFdBQVcsQ0FBdUI7UUFDbEMsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUFDN0IsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixjQUFTLEdBQVQsU0FBUyxDQUFjO1FBQ3ZCLG9CQUFlLEdBQWYs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QkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7OztZQVZRLHFCQUFxQjtZQURyQixrQkFBa0I7WUFFbEIsVUFBVTtZQU5WLFlBQVk7WUFVWixlQUFlO1lBQ2YsZ0JBQWdCOzs7OztJQU9yQix1Q0FBK0U7O0lBQy9FLHNDQUFnRTs7SUFDaEUsb0NBQThEOztJQUVsRCxxQ0FBeUM7O0lBQ3pDLG9DQUFxQzs7Ozs7SUFDckMsb0NBQThCOzs7OztJQUM5QixtQ0FBK0I7Ozs7O0lBQy9CLHlDQUF3Qzs7Ozs7SUFDeEMsMENBQTBDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBDb250ZW50QXBpLCBNaW5pbWFsTm9kZSwgTm9kZSwgTm9kZUVudHJ5IH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBmcm9tLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBGb2xkZXJDcmVhdGVkRXZlbnQgfSBmcm9tICcuLi9ldmVudHMvZm9sZGVyLWNyZWF0ZWQuZXZlbnQnO1xuaW1wb3J0IHsgQWxmcmVzY29BcGlTZXJ2aWNlIH0gZnJvbSAnLi9hbGZyZXNjby1hcGkuc2VydmljZSc7XG5pbXBvcnQgeyBBdXRoZW50aWNhdGlvblNlcnZpY2UgfSBmcm9tICcuL2F1dGhlbnRpY2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9nU2VydmljZSB9IGZyb20gJy4vbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFBlcm1pc3Npb25zRW51bSB9IGZyb20gJy4uL21vZGVscy9wZXJtaXNzaW9ucy5lbnVtJztcbmltcG9ydCB7IEFsbG93YWJsZU9wZXJhdGlvbnNFbnVtIH0gZnJvbSAnLi4vbW9kZWxzL2FsbG93YWJsZS1vcGVyYXRpb25zLmVudW0nO1xuaW1wb3J0IHsgRG93bmxvYWRTZXJ2aWNlIH0gZnJvbSAnLi9kb3dubG9hZC5zZXJ2aWNlJztcbmltcG9ydCB7IFRodW1ibmFpbFNlcnZpY2UgfSBmcm9tICcuL3RodW1ibmFpbC5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBDb250ZW50U2VydmljZSB7XG5cbiAgICBmb2xkZXJDcmVhdGVkOiBTdWJqZWN0PEZvbGRlckNyZWF0ZWRFdmVudD4gPSBuZXcgU3ViamVjdDxGb2xkZXJDcmVhdGVkRXZlbnQ+KCk7XG4gICAgZm9sZGVyQ3JlYXRlOiBTdWJqZWN0PE1pbmltYWxOb2RlPiA9IG5ldyBTdWJqZWN0PE1pbmltYWxOb2RlPigpO1xuICAgIGZvbGRlckVkaXQ6IFN1YmplY3Q8TWluaW1hbE5vZGU+ID0gbmV3IFN1YmplY3Q8TWluaW1hbE5vZGU+KCk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYXV0aFNlcnZpY2U6IEF1dGhlbnRpY2F0aW9uU2VydmljZSxcbiAgICAgICAgICAgICAgICBwdWJsaWMgYXBpU2VydmljZTogQWxmcmVzY29BcGlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgbG9nU2VydmljZTogTG9nU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgZG93bmxvYWRTZXJ2aWNlOiBEb3dubG9hZFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSB0aHVtYm5haWxTZXJ2aWNlOiBUaHVtYm5haWxTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gMy4yLjAsIHVzZSBEb3dubG9hZFNlcnZpY2UgaW5zdGVhZC5cbiAgICAgKiBJbnZva2VzIGNvbnRlbnQgZG93bmxvYWQgZm9yIGEgQmxvYiB3aXRoIGEgZmlsZSBuYW1lLlxuICAgICAqIEBwYXJhbSBibG9iIENvbnRlbnQgdG8gZG93bmxvYWQuXG4gICAgICogQHBhcmFtIGZpbGVOYW1lIE5hbWUgb2YgdGhlIHJlc3VsdGluZyBmaWxlLlxuICAgICAqL1xuICAgIGRvd25sb2FkQmxvYihibG9iOiBCbG9iLCBmaWxlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZG93bmxvYWRTZXJ2aWNlLmRvd25sb2FkQmxvYihibG9iLCBmaWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gMy4yLjAsIHVzZSBEb3dubG9hZFNlcnZpY2UgaW5zdGVhZC5cbiAgICAgKiBJbnZva2VzIGNvbnRlbnQgZG93bmxvYWQgZm9yIGEgZGF0YSBhcnJheSB3aXRoIGEgZmlsZSBuYW1lLlxuICAgICAqIEBwYXJhbSBkYXRhIERhdGEgdG8gZG93bmxvYWQuXG4gICAgICogQHBhcmFtIGZpbGVOYW1lIE5hbWUgb2YgdGhlIHJlc3VsdGluZyBmaWxlLlxuICAgICAqL1xuICAgIGRvd25sb2FkRGF0YShkYXRhOiBhbnksIGZpbGVOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kb3dubG9hZFNlcnZpY2UuZG93bmxvYWREYXRhKGRhdGEsIGZpbGVOYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBpbiAzLjIuMCwgdXNlIERvd25sb2FkU2VydmljZSBpbnN0ZWFkLlxuICAgICAqIEludm9rZXMgY29udGVudCBkb3dubG9hZCBmb3IgYSBKU09OIG9iamVjdCB3aXRoIGEgZmlsZSBuYW1lLlxuICAgICAqIEBwYXJhbSBqc29uIEpTT04gb2JqZWN0IHRvIGRvd25sb2FkLlxuICAgICAqIEBwYXJhbSBmaWxlTmFtZSBOYW1lIG9mIHRoZSByZXN1bHRpbmcgZmlsZS5cbiAgICAgKi9cbiAgICBkb3dubG9hZEpTT04oanNvbjogYW55LCBmaWxlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZG93bmxvYWRTZXJ2aWNlLmRvd25sb2FkSlNPTihqc29uLCBmaWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHRydXN0ZWQgb2JqZWN0IFVSTCBmcm9tIHRoZSBCbG9iLlxuICAgICAqIFdBUk5JTkc6IGNhbGxpbmcgdGhpcyBtZXRob2Qgd2l0aCB1bnRydXN0ZWQgdXNlciBkYXRhIGV4cG9zZXMgeW91ciBhcHBsaWNhdGlvbiB0byBYU1Mgc2VjdXJpdHkgcmlza3MhXG4gICAgICogQHBhcmFtICBibG9iIERhdGEgdG8gd3JhcCBpbnRvIG9iamVjdCBVUkxcbiAgICAgKiBAcmV0dXJucyBVUkwgc3RyaW5nXG4gICAgICovXG4gICAgY3JlYXRlVHJ1c3RlZFVybChibG9iOiBCbG9iKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgdXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICAgIHJldHVybiA8c3RyaW5nPiB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0VXJsKHVybCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgY29udGVudEFwaSgpOiBDb250ZW50QXBpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLmNvbnRlbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gMy4yLjAsIHVzZSBUaHVtYm5haWxTZXJ2aWNlIGluc3RlYWQuXG4gICAgICogR2V0cyBhIHRodW1ibmFpbCBVUkwgZm9yIHRoZSBnaXZlbiBkb2N1bWVudCBub2RlLlxuICAgICAqIEBwYXJhbSBub2RlIE5vZGUgb3IgTm9kZSBJRCB0byBnZXQgVVJMIGZvci5cbiAgICAgKiBAcGFyYW0gYXR0YWNobWVudCBUb2dnbGVzIHdoZXRoZXIgdG8gcmV0cmlldmUgY29udGVudCBhcyBhbiBhdHRhY2htZW50IGZvciBkb3dubG9hZFxuICAgICAqIEBwYXJhbSB0aWNrZXQgQ3VzdG9tIHRpY2tldCB0byB1c2UgZm9yIGF1dGhlbnRpY2F0aW9uXG4gICAgICogQHJldHVybnMgVVJMIHN0cmluZ1xuICAgICAqL1xuICAgIGdldERvY3VtZW50VGh1bWJuYWlsVXJsKG5vZGU6IE5vZGVFbnRyeSB8IHN0cmluZywgYXR0YWNobWVudD86IGJvb2xlYW4sIHRpY2tldD86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRodW1ibmFpbFNlcnZpY2UuZ2V0RG9jdW1lbnRUaHVtYm5haWxVcmwobm9kZSwgYXR0YWNobWVudCwgdGlja2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgY29udGVudCBVUkwgZm9yIHRoZSBnaXZlbiBub2RlLlxuICAgICAqIEBwYXJhbSBub2RlIE5vZGUgb3IgTm9kZSBJRCB0byBnZXQgVVJMIGZvci5cbiAgICAgKiBAcGFyYW0gYXR0YWNobWVudCBUb2dnbGVzIHdoZXRoZXIgdG8gcmV0cmlldmUgY29udGVudCBhcyBhbiBhdHRhY2htZW50IGZvciBkb3dubG9hZFxuICAgICAqIEBwYXJhbSB0aWNrZXQgQ3VzdG9tIHRpY2tldCB0byB1c2UgZm9yIGF1dGhlbnRpY2F0aW9uXG4gICAgICogQHJldHVybnMgVVJMIHN0cmluZyBvciBgbnVsbGBcbiAgICAgKi9cbiAgICBnZXRDb250ZW50VXJsKG5vZGU6IE5vZGVFbnRyeSB8IHN0cmluZywgYXR0YWNobWVudD86IGJvb2xlYW4sIHRpY2tldD86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmc7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBub2RlSWQgPSBub2RlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlLmVudHJ5KSB7XG4gICAgICAgICAgICAgICAgbm9kZUlkID0gbm9kZS5lbnRyeS5pZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudEFwaS5nZXRDb250ZW50VXJsKG5vZGVJZCwgYXR0YWNobWVudCwgdGlja2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgY29udGVudCBmb3IgdGhlIGdpdmVuIG5vZGUuXG4gICAgICogQHBhcmFtIG5vZGVJZCBJRCBvZiB0aGUgdGFyZ2V0IG5vZGVcbiAgICAgKiBAcmV0dXJucyBDb250ZW50IGRhdGFcbiAgICAgKi9cbiAgICBnZXROb2RlQ29udGVudChub2RlSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLmNvcmUubm9kZXNBcGkuZ2V0RmlsZUNvbnRlbnQobm9kZUlkKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycjogYW55KSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBOb2RlIHZpYSBpdHMgbm9kZSBJRC5cbiAgICAgKiBAcGFyYW0gbm9kZUlkIElEIG9mIHRoZSB0YXJnZXQgbm9kZVxuICAgICAqIEBwYXJhbSBvcHRzIE9wdGlvbnMgc3VwcG9ydGVkIGJ5IEpTLUFQSVxuICAgICAqIEByZXR1cm5zIERldGFpbHMgb2YgdGhlIGZvbGRlclxuICAgICAqL1xuICAgIGdldE5vZGUobm9kZUlkOiBzdHJpbmcsIG9wdHM/OiBhbnkpOiBPYnNlcnZhYmxlPE5vZGVFbnRyeT4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5ub2Rlcy5nZXROb2RlKG5vZGVJZCwgb3B0cykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgdXNlciBoYXMgcGVybWlzc2lvbiBvbiB0aGF0IG5vZGVcbiAgICAgKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGNoZWNrIHBlcm1pc3Npb25zXG4gICAgICogQHBhcmFtIHBlcm1pc3Npb24gUmVxdWlyZWQgcGVybWlzc2lvbiB0eXBlXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdXNlciBoYXMgdGhlIHJlcXVpcmVkIHBlcm1pc3Npb25zLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBoYXNQZXJtaXNzaW9ucyhub2RlOiBOb2RlLCBwZXJtaXNzaW9uOiBQZXJtaXNzaW9uc0VudW0gfCBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGhhc1Blcm1pc3Npb25zID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5wZXJtaXNzaW9ucyAmJiBub2RlLnBlcm1pc3Npb25zLmxvY2FsbHlTZXQpIHtcbiAgICAgICAgICAgIGlmIChwZXJtaXNzaW9uICYmIHBlcm1pc3Npb24uc3RhcnRzV2l0aCgnIScpKSB7XG4gICAgICAgICAgICAgICAgaGFzUGVybWlzc2lvbnMgPSBub2RlLnBlcm1pc3Npb25zLmxvY2FsbHlTZXQuZmluZCgoY3VycmVudFBlcm1pc3Npb24pID0+IGN1cnJlbnRQZXJtaXNzaW9uLm5hbWUgPT09IHBlcm1pc3Npb24ucmVwbGFjZSgnIScsICcnKSkgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhhc1Blcm1pc3Npb25zID0gbm9kZS5wZXJtaXNzaW9ucy5sb2NhbGx5U2V0LmZpbmQoKGN1cnJlbnRQZXJtaXNzaW9uKSA9PiBjdXJyZW50UGVybWlzc2lvbi5uYW1lID09PSBwZXJtaXNzaW9uKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBpZiAocGVybWlzc2lvbiA9PT0gUGVybWlzc2lvbnNFbnVtLkNPTlNVTUVSKSB7XG4gICAgICAgICAgICAgICAgaGFzUGVybWlzc2lvbnMgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwZXJtaXNzaW9uID09PSBQZXJtaXNzaW9uc0VudW0uTk9UX0NPTlNVTUVSKSB7XG4gICAgICAgICAgICAgICAgaGFzUGVybWlzc2lvbnMgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGVybWlzc2lvbiAmJiBwZXJtaXNzaW9uLnN0YXJ0c1dpdGgoJyEnKSkge1xuICAgICAgICAgICAgICAgIGhhc1Blcm1pc3Npb25zID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoYXNQZXJtaXNzaW9ucztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIHVzZXIgaGFzIHBlcm1pc3Npb25zIG9uIHRoYXQgbm9kZVxuICAgICAqIEBwYXJhbSBub2RlIE5vZGUgdG8gY2hlY2sgYWxsb3dhYmxlT3BlcmF0aW9uc1xuICAgICAqIEBwYXJhbSBhbGxvd2FibGVPcGVyYXRpb24gQ3JlYXRlLCBkZWxldGUsIHVwZGF0ZSwgdXBkYXRlUGVybWlzc2lvbnMsICFjcmVhdGUsICFkZWxldGUsICF1cGRhdGUsICF1cGRhdGVQZXJtaXNzaW9uc1xuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHVzZXIgaGFzIHRoZSByZXF1aXJlZCBwZXJtaXNzaW9ucywgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgaGFzQWxsb3dhYmxlT3BlcmF0aW9ucyhub2RlOiBOb2RlLCBhbGxvd2FibGVPcGVyYXRpb246IEFsbG93YWJsZU9wZXJhdGlvbnNFbnVtIHwgc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBoYXNBbGxvd2FibGVPcGVyYXRpb25zID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5hbGxvd2FibGVPcGVyYXRpb25zKSB7XG4gICAgICAgICAgICBpZiAoYWxsb3dhYmxlT3BlcmF0aW9uICYmIGFsbG93YWJsZU9wZXJhdGlvbi5zdGFydHNXaXRoKCchJykpIHtcbiAgICAgICAgICAgICAgICBoYXNBbGxvd2FibGVPcGVyYXRpb25zID0gbm9kZS5hbGxvd2FibGVPcGVyYXRpb25zLmZpbmQoKGN1cnJlbnRPcGVyYXRpb24pID0+IGN1cnJlbnRPcGVyYXRpb24gPT09IGFsbG93YWJsZU9wZXJhdGlvbi5yZXBsYWNlKCchJywgJycpKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFzQWxsb3dhYmxlT3BlcmF0aW9ucyA9IG5vZGUuYWxsb3dhYmxlT3BlcmF0aW9ucy5maW5kKChjdXJyZW50T3BlcmF0aW9uKSA9PiBjdXJyZW50T3BlcmF0aW9uID09PSBhbGxvd2FibGVPcGVyYXRpb24pID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYWxsb3dhYmxlT3BlcmF0aW9uICYmIGFsbG93YWJsZU9wZXJhdGlvbi5zdGFydHNXaXRoKCchJykpIHtcbiAgICAgICAgICAgICAgICBoYXNBbGxvd2FibGVPcGVyYXRpb25zID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhbGxvd2FibGVPcGVyYXRpb24gPT09IEFsbG93YWJsZU9wZXJhdGlvbnNFbnVtLkNPUFkpIHtcbiAgICAgICAgICAgIGhhc0FsbG93YWJsZU9wZXJhdGlvbnMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFsbG93YWJsZU9wZXJhdGlvbiA9PT0gQWxsb3dhYmxlT3BlcmF0aW9uc0VudW0uTE9DSykge1xuICAgICAgICAgICAgaGFzQWxsb3dhYmxlT3BlcmF0aW9ucyA9IG5vZGUuaXNGaWxlO1xuXG4gICAgICAgICAgICBpZiAobm9kZS5pc0xvY2tlZCAmJiBub2RlLmFsbG93YWJsZU9wZXJhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBoYXNBbGxvd2FibGVPcGVyYXRpb25zID0gISF+bm9kZS5hbGxvd2FibGVPcGVyYXRpb25zLmluZGV4T2YoJ3VwZGF0ZVBlcm1pc3Npb25zJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGFzQWxsb3dhYmxlT3BlcmF0aW9ucztcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpIHtcbiAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmVycm9yKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IgfHwgJ1NlcnZlciBlcnJvcicpO1xuICAgIH1cbn1cbiJdfQ==
