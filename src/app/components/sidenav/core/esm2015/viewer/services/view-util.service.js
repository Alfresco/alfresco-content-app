/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from 'tslib';
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
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import * as i0 from '@angular/core';
import * as i1 from '../../services/alfresco-api.service';
import * as i2 from '../../services/log.service';
export class ViewUtilService {
  /**
   * @param {?} apiService
   * @param {?} logService
   */
  constructor(apiService, logService) {
    this.apiService = apiService;
    this.logService = logService;
    /**
     * Based on ViewerComponent Implementation, this value is used to determine how many times we try
     * to get the rendition of a file for preview, or printing.
     */
    this.maxRetries = 5;
    /**
     * Mime-type grouping based on the ViewerComponent.
     */
    this.mimeTypes = {
      text: [
        'text/plain',
        'text/csv',
        'text/xml',
        'text/html',
        'application/x-javascript'
      ],
      pdf: ['application/pdf'],
      image: [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/bmp',
        'image/svg+xml'
      ],
      media: [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'audio/mpeg',
        'audio/ogg',
        'audio/wav'
      ]
    };
  }
  /**
   * This method takes a url to trigger the print dialog against, and the type of artifact that it
   * is.
   * This URL should be one that can be rendered in the browser, for example PDF, Image, or Text
   * @param {?} url
   * @param {?} type
   * @return {?}
   */
  printFile(url, type) {
    /** @type {?} */
    const pwa = window.open(url, ViewUtilService.TARGET);
    if (pwa) {
      // Because of the way chrome focus and close image window vs. pdf preview window
      if (type === ViewUtilService.ContentGroup.IMAGE) {
        pwa.onfocus
        /**
         * @return {?}
         */ = () => {
          setTimeout(
            /**
             * @return {?}
             */
            () => {
              pwa.close();
            },
            500
          );
        };
      }
      pwa.onload
      /**
       * @return {?}
       */ = () => {
        pwa.print();
      };
    }
  }
  /**
   * Launch the File Print dialog from anywhere other than the preview service, which resolves the
   * rendition of the object that can be printed from a web browser.
   * These are: images, PDF files, or PDF rendition of files.
   * We also force PDF rendition for TEXT type objects, otherwise the default URL is to download.
   * TODO there are different TEXT type objects, (HTML, plaintext, xml, etc. we should determine how these are handled)
   * @param {?} objectId
   * @param {?} mimeType
   * @return {?}
   */
  printFileGeneric(objectId, mimeType) {
    /** @type {?} */
    const nodeId = objectId;
    /** @type {?} */
    const type = this.getViewerTypeByMimeType(mimeType);
    this.getRendition(nodeId, ViewUtilService.ContentGroup.PDF)
      .then(
        /**
         * @param {?} value
         * @return {?}
         */
        value => {
          /** @type {?} */
          const url = this.getRenditionUrl(
            nodeId,
            type,
            (value ? true : false)
          );
          /** @type {?} */
          const printType =
            (type === ViewUtilService.ContentGroup.PDF ||
            type === ViewUtilService.ContentGroup.TEXT)
              ? ViewUtilService.ContentGroup.PDF
              : type;
          this.printFile(url, printType);
        }
      )
      .catch(
        /**
         * @param {?} err
         * @return {?}
         */
        err => {
          this.logService.error('Error with Printing');
          this.logService.error(err);
        }
      );
  }
  /**
   * @param {?} nodeId
   * @param {?} type
   * @param {?} renditionExists
   * @return {?}
   */
  getRenditionUrl(nodeId, type, renditionExists) {
    return renditionExists && type !== ViewUtilService.ContentGroup.IMAGE
      ? this.apiService.contentApi.getRenditionUrl(
          nodeId,
          ViewUtilService.ContentGroup.PDF
        )
      : this.apiService.contentApi.getContentUrl(nodeId, false);
  }
  /**
   * @private
   * @param {?} nodeId
   * @param {?} renditionId
   * @param {?} retries
   * @return {?}
   */
  waitRendition(nodeId, renditionId, retries) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      /** @type {?} */
      const rendition = yield this.apiService.renditionsApi.getRendition(
        nodeId,
        renditionId
      );
      if (this.maxRetries < retries) {
        /** @type {?} */
        const status = rendition.entry.status.toString();
        if (status === 'CREATED') {
          return rendition;
        } else {
          retries += 1;
          yield this.wait(1000);
          return this.waitRendition(nodeId, renditionId, retries);
        }
      }
      return Promise.resolve(null);
    });
  }
  /**
   * @param {?} mimeType
   * @return {?}
   */
  getViewerTypeByMimeType(mimeType) {
    if (mimeType) {
      mimeType = mimeType.toLowerCase();
      /** @type {?} */
      const editorTypes = Object.keys(this.mimeTypes);
      for (const type of editorTypes) {
        if (this.mimeTypes[type].indexOf(mimeType) >= 0) {
          return type;
        }
      }
    }
    return 'unknown';
  }
  /**
   * @param {?} ms
   * @return {?}
   */
  wait(ms) {
    return new Promise
    /**
     * @param {?} resolve
     * @return {?}
     */(resolve => setTimeout(resolve, ms));
  }
  /**
   * @param {?} nodeId
   * @param {?} renditionId
   * @return {?}
   */
  getRendition(nodeId, renditionId) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      /** @type {?} */
      const renditionPaging = yield this.apiService.renditionsApi.getRenditions(
        nodeId
      );
      /** @type {?} */
      let rendition = renditionPaging.list.entries.find(
        /**
         * @param {?} renditionEntry
         * @return {?}
         */
        (renditionEntry =>
          renditionEntry.entry.id.toLowerCase() === renditionId)
      );
      if (rendition) {
        /** @type {?} */
        const status = rendition.entry.status.toString();
        if (status === 'NOT_CREATED') {
          try {
            yield this.apiService.renditionsApi.createRendition(nodeId, {
              id: renditionId
            });
            rendition = yield this.waitRendition(nodeId, renditionId, 0);
          } catch (err) {
            this.logService.error(err);
          }
        }
      }
      return new Promise
      /**
       * @param {?} resolve
       * @return {?}
       */(resolve => resolve(rendition));
    });
  }
}
ViewUtilService.TARGET = '_new';
/**
 * Content groups based on categorization of files that can be viewed in the web browser. This
 * implementation or grouping is tied to the definition the ng component: ViewerComponent
 */
// tslint:disable-next-line:variable-name
ViewUtilService.ContentGroup = {
  IMAGE: 'image',
  MEDIA: 'media',
  PDF: 'pdf',
  TEXT: 'text'
};
ViewUtilService.decorators = [
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
ViewUtilService.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: LogService }
];
/** @nocollapse */ ViewUtilService.ngInjectableDef = i0.defineInjectable({
  factory: function ViewUtilService_Factory() {
    return new ViewUtilService(
      i0.inject(i1.AlfrescoApiService),
      i0.inject(i2.LogService)
    );
  },
  token: ViewUtilService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  ViewUtilService.TARGET;
  /**
   * Content groups based on categorization of files that can be viewed in the web browser. This
   * implementation or grouping is tied to the definition the ng component: ViewerComponent
   * @type {?}
   */
  ViewUtilService.ContentGroup;
  /**
   * Based on ViewerComponent Implementation, this value is used to determine how many times we try
   * to get the rendition of a file for preview, or printing.
   * @type {?}
   */
  ViewUtilService.prototype.maxRetries;
  /**
   * Mime-type grouping based on the ViewerComponent.
   * @type {?}
   * @private
   */
  ViewUtilService.prototype.mimeTypes;
  /**
   * @type {?}
   * @private
   */
  ViewUtilService.prototype.apiService;
  /**
   * @type {?}
   * @private
   */
  ViewUtilService.prototype.logService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy11dGlsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJ2aWV3ZXIvc2VydmljZXMvdmlldy11dGlsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDekUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDRCQUE0QixDQUFDOzs7O0FBS3hELE1BQU0sT0FBTyxlQUFlOzs7OztJQStCeEIsWUFBb0IsVUFBOEIsRUFDOUIsVUFBc0I7UUFEdEIsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUFDOUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTs7Ozs7UUFiMUMsZUFBVSxHQUFHLENBQUMsQ0FBQzs7OztRQUtQLGNBQVMsR0FBRztZQUNoQixJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsMEJBQTBCLENBQUM7WUFDckYsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUM7WUFDeEIsS0FBSyxFQUFFLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQztZQUM3RSxLQUFLLEVBQUUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQztTQUMxRixDQUFDO0lBSUYsQ0FBQzs7Ozs7Ozs7O0lBT0QsU0FBUyxDQUFDLEdBQVcsRUFBRSxJQUFZOztjQUN6QixHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLE1BQU0sQ0FBQztRQUNwRCxJQUFJLEdBQUcsRUFBRTtZQUNMLGdGQUFnRjtZQUNoRixJQUFJLElBQUks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QUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7d0JBQ2pGLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDaEU7b0JBQUMsT0FBTyxHQUFHLEVBQUU7d0JBQ1YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzlCO2lCQUNKO2FBQ0o7WUFDRCxPQUFPLElBQUksT0FBTzs7OztZQUFpQixDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFDLENBQUM7UUFDeEUsQ0FBQztLQUFBOztBQTdJTSxzQkFBTSxHQUFHLE1BQU0sQ0FBQzs7Ozs7O0FBT2hCLDRCQUFZLEdBQUc7SUFDbEIsS0FBSyxFQUFFLE9BQU87SUFDZCxLQUFLLEVBQUUsT0FBTztJQUNkLEdBQUcsRUFBRSxLQUFLO0lBQ1YsSUFBSSxFQUFFLE1BQU07Q0FDZixDQUFDOztZQWhCTCxVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7Ozs7WUFMUSxrQkFBa0I7WUFDbEIsVUFBVTs7Ozs7SUFNZix1QkFBdUI7Ozs7OztJQU92Qiw2QkFLRTs7Ozs7O0lBTUYscUNBQWU7Ozs7OztJQUtmLG9DQUtFOzs7OztJQUVVLHFDQUFzQzs7Ozs7SUFDdEMscUNBQThCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUmVuZGl0aW9uRW50cnksIFJlbmRpdGlvblBhZ2luZyB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuaW1wb3J0IHsgQWxmcmVzY29BcGlTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYWxmcmVzY28tYXBpLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9nU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xvZy5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBWaWV3VXRpbFNlcnZpY2Uge1xuICAgIHN0YXRpYyBUQVJHRVQgPSAnX25ldyc7XG5cbiAgICAvKipcbiAgICAgKiBDb250ZW50IGdyb3VwcyBiYXNlZCBvbiBjYXRlZ29yaXphdGlvbiBvZiBmaWxlcyB0aGF0IGNhbiBiZSB2aWV3ZWQgaW4gdGhlIHdlYiBicm93c2VyLiBUaGlzXG4gICAgICogaW1wbGVtZW50YXRpb24gb3IgZ3JvdXBpbmcgaXMgdGllZCB0byB0aGUgZGVmaW5pdGlvbiB0aGUgbmcgY29tcG9uZW50OiBWaWV3ZXJDb21wb25lbnRcbiAgICAgKi9cbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgICBzdGF0aWMgQ29udGVudEdyb3VwID0ge1xuICAgICAgICBJTUFHRTogJ2ltYWdlJyxcbiAgICAgICAgTUVESUE6ICdtZWRpYScsXG4gICAgICAgIFBERjogJ3BkZicsXG4gICAgICAgIFRFWFQ6ICd0ZXh0J1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBCYXNlZCBvbiBWaWV3ZXJDb21wb25lbnQgSW1wbGVtZW50YXRpb24sIHRoaXMgdmFsdWUgaXMgdXNlZCB0byBkZXRlcm1pbmUgaG93IG1hbnkgdGltZXMgd2UgdHJ5XG4gICAgICogdG8gZ2V0IHRoZSByZW5kaXRpb24gb2YgYSBmaWxlIGZvciBwcmV2aWV3LCBvciBwcmludGluZy5cbiAgICAgKi9cbiAgICBtYXhSZXRyaWVzID0gNTtcblxuICAgIC8qKlxuICAgICAqIE1pbWUtdHlwZSBncm91cGluZyBiYXNlZCBvbiB0aGUgVmlld2VyQ29tcG9uZW50LlxuICAgICAqL1xuICAgIHByaXZhdGUgbWltZVR5cGVzID0ge1xuICAgICAgICB0ZXh0OiBbJ3RleHQvcGxhaW4nLCAndGV4dC9jc3YnLCAndGV4dC94bWwnLCAndGV4dC9odG1sJywgJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCddLFxuICAgICAgICBwZGY6IFsnYXBwbGljYXRpb24vcGRmJ10sXG4gICAgICAgIGltYWdlOiBbJ2ltYWdlL3BuZycsICdpbWFnZS9qcGVnJywgJ2ltYWdlL2dpZicsICdpbWFnZS9ibXAnLCAnaW1hZ2Uvc3ZnK3htbCddLFxuICAgICAgICBtZWRpYTogWyd2aWRlby9tcDQnLCAndmlkZW8vd2VibScsICd2aWRlby9vZ2cnLCAnYXVkaW8vbXBlZycsICdhdWRpby9vZ2cnLCAnYXVkaW8vd2F2J11cbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcGlTZXJ2aWNlOiBBbGZyZXNjb0FwaVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBsb2dTZXJ2aWNlOiBMb2dTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgdGFrZXMgYSB1cmwgdG8gdHJpZ2dlciB0aGUgcHJpbnQgZGlhbG9nIGFnYWluc3QsIGFuZCB0aGUgdHlwZSBvZiBhcnRpZmFjdCB0aGF0IGl0XG4gICAgICogaXMuXG4gICAgICogVGhpcyBVUkwgc2hvdWxkIGJlIG9uZSB0aGF0IGNhbiBiZSByZW5kZXJlZCBpbiB0aGUgYnJvd3NlciwgZm9yIGV4YW1wbGUgUERGLCBJbWFnZSwgb3IgVGV4dFxuICAgICAqL1xuICAgIHByaW50RmlsZSh1cmw6IHN0cmluZywgdHlwZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHB3YSA9IHdpbmRvdy5vcGVuKHVybCwgVmlld1V0aWxTZXJ2aWNlLlRBUkdFVCk7XG4gICAgICAgIGlmIChwd2EpIHtcbiAgICAgICAgICAgIC8vIEJlY2F1c2Ugb2YgdGhlIHdheSBjaHJvbWUgZm9jdXMgYW5kIGNsb3NlIGltYWdlIHdpbmRvdyB2cy4gcGRmIHByZXZpZXcgd2luZG93XG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gVmlld1V0aWxTZXJ2aWNlLkNvbnRlbnRHcm91cC5JTUFHRSkge1xuICAgICAgICAgICAgICAgIHB3YS5vbmZvY3VzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB3YS5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHB3YS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcHdhLnByaW50KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGF1bmNoIHRoZSBGaWxlIFByaW50IGRpYWxvZyBmcm9tIGFueXdoZXJlIG90aGVyIHRoYW4gdGhlIHByZXZpZXcgc2VydmljZSwgd2hpY2ggcmVzb2x2ZXMgdGhlXG4gICAgICogcmVuZGl0aW9uIG9mIHRoZSBvYmplY3QgdGhhdCBjYW4gYmUgcHJpbnRlZCBmcm9tIGEgd2ViIGJyb3dzZXIuXG4gICAgICogVGhlc2UgYXJlOiBpbWFnZXMsIFBERiBmaWxlcywgb3IgUERGIHJlbmRpdGlvbiBvZiBmaWxlcy5cbiAgICAgKiBXZSBhbHNvIGZvcmNlIFBERiByZW5kaXRpb24gZm9yIFRFWFQgdHlwZSBvYmplY3RzLCBvdGhlcndpc2UgdGhlIGRlZmF1bHQgVVJMIGlzIHRvIGRvd25sb2FkLlxuICAgICAqIFRPRE8gdGhlcmUgYXJlIGRpZmZlcmVudCBURVhUIHR5cGUgb2JqZWN0cywgKEhUTUwsIHBsYWludGV4dCwgeG1sLCBldGMuIHdlIHNob3VsZCBkZXRlcm1pbmUgaG93IHRoZXNlIGFyZSBoYW5kbGVkKVxuICAgICAqL1xuICAgIHByaW50RmlsZUdlbmVyaWMob2JqZWN0SWQ6IHN0cmluZywgbWltZVR5cGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBub2RlSWQgPSBvYmplY3RJZDtcbiAgICAgICAgY29uc3QgdHlwZTogc3RyaW5nID0gdGhpcy5nZXRWaWV3ZXJUeXBlQnlNaW1lVHlwZShtaW1lVHlwZSk7XG5cbiAgICAgICAgdGhpcy5nZXRSZW5kaXRpb24obm9kZUlkLCBWaWV3VXRpbFNlcnZpY2UuQ29udGVudEdyb3VwLlBERilcbiAgICAgICAgICAgIC50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybDogc3RyaW5nID0gdGhpcy5nZXRSZW5kaXRpb25Vcmwobm9kZUlkLCB0eXBlLCAodmFsdWUgPyB0cnVlIDogZmFsc2UpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmludFR5cGUgPSAodHlwZSA9PT0gVmlld1V0aWxTZXJ2aWNlLkNvbnRlbnRHcm91cC5QREZcbiAgICAgICAgICAgICAgICAgICAgfHwgdHlwZSA9PT0gVmlld1V0aWxTZXJ2aWNlLkNvbnRlbnRHcm91cC5URVhUKVxuICAgICAgICAgICAgICAgICAgICA/IFZpZXdVdGlsU2VydmljZS5Db250ZW50R3JvdXAuUERGIDogdHlwZTtcbiAgICAgICAgICAgICAgICB0aGlzLnByaW50RmlsZSh1cmwsIHByaW50VHlwZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoJ0Vycm9yIHdpdGggUHJpbnRpbmcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFJlbmRpdGlvblVybChub2RlSWQ6IHN0cmluZywgdHlwZTogc3RyaW5nLCByZW5kaXRpb25FeGlzdHM6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKHJlbmRpdGlvbkV4aXN0cyAmJiB0eXBlICE9PSBWaWV3VXRpbFNlcnZpY2UuQ29udGVudEdyb3VwLklNQUdFKSA/XG4gICAgICAgICAgICB0aGlzLmFwaVNlcnZpY2UuY29udGVudEFwaS5nZXRSZW5kaXRpb25Vcmwobm9kZUlkLCBWaWV3VXRpbFNlcnZpY2UuQ29udGVudEdyb3VwLlBERikgOlxuICAgICAgICAgICAgdGhpcy5hcGlTZXJ2aWNlLmNvbnRlbnRBcGkuZ2V0Q29udGVudFVybChub2RlSWQsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHdhaXRSZW5kaXRpb24obm9kZUlkOiBzdHJpbmcsIHJlbmRpdGlvbklkOiBzdHJpbmcsIHJldHJpZXM6IG51bWJlcik6IFByb21pc2U8UmVuZGl0aW9uRW50cnk+IHtcbiAgICAgICAgY29uc3QgcmVuZGl0aW9uID0gYXdhaXQgdGhpcy5hcGlTZXJ2aWNlLnJlbmRpdGlvbnNBcGkuZ2V0UmVuZGl0aW9uKG5vZGVJZCwgcmVuZGl0aW9uSWQpO1xuXG4gICAgICAgIGlmICh0aGlzLm1heFJldHJpZXMgPCByZXRyaWVzKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0dXMgPSByZW5kaXRpb24uZW50cnkuc3RhdHVzLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdDUkVBVEVEJykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW5kaXRpb247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHJpZXMgKz0gMTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLndhaXQoMTAwMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud2FpdFJlbmRpdGlvbihub2RlSWQsIHJlbmRpdGlvbklkLCByZXRyaWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgfVxuXG4gICAgZ2V0Vmlld2VyVHlwZUJ5TWltZVR5cGUobWltZVR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChtaW1lVHlwZSkge1xuICAgICAgICAgICAgbWltZVR5cGUgPSBtaW1lVHlwZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBjb25zdCBlZGl0b3JUeXBlcyA9IE9iamVjdC5rZXlzKHRoaXMubWltZVR5cGVzKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdHlwZSBvZiBlZGl0b3JUeXBlcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pbWVUeXBlc1t0eXBlXS5pbmRleE9mKG1pbWVUeXBlKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ3Vua25vd24nO1xuICAgIH1cblxuICAgIHdhaXQobXM6IG51bWJlcik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFJlbmRpdGlvbihub2RlSWQ6IHN0cmluZywgcmVuZGl0aW9uSWQ6IHN0cmluZyk6IFByb21pc2U8UmVuZGl0aW9uRW50cnk+IHtcbiAgICAgICAgY29uc3QgcmVuZGl0aW9uUGFnaW5nOiBSZW5kaXRpb25QYWdpbmcgPSBhd2FpdCB0aGlzLmFwaVNlcnZpY2UucmVuZGl0aW9uc0FwaS5nZXRSZW5kaXRpb25zKG5vZGVJZCk7XG4gICAgICAgIGxldCByZW5kaXRpb246IFJlbmRpdGlvbkVudHJ5ID0gcmVuZGl0aW9uUGFnaW5nLmxpc3QuZW50cmllcy5maW5kKChyZW5kaXRpb25FbnRyeTogUmVuZGl0aW9uRW50cnkpID0+IHJlbmRpdGlvbkVudHJ5LmVudHJ5LmlkLnRvTG93ZXJDYXNlKCkgPT09IHJlbmRpdGlvbklkKTtcblxuICAgICAgICBpZiAocmVuZGl0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0dXMgPSByZW5kaXRpb24uZW50cnkuc3RhdHVzLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdOT1RfQ1JFQVRFRCcpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFwaVNlcnZpY2UucmVuZGl0aW9uc0FwaS5jcmVhdGVSZW5kaXRpb24obm9kZUlkLCB7IGlkOiByZW5kaXRpb25JZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGl0aW9uID0gYXdhaXQgdGhpcy53YWl0UmVuZGl0aW9uKG5vZGVJZCwgcmVuZGl0aW9uSWQsIDApO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFJlbmRpdGlvbkVudHJ5PigocmVzb2x2ZSkgPT4gcmVzb2x2ZShyZW5kaXRpb24pKTtcbiAgICB9XG5cbn1cbiJdfQ==
