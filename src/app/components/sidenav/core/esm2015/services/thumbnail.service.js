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
/* spellchecker: disable */
import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AlfrescoApiService } from './alfresco-api.service';
import * as i0 from '@angular/core';
import * as i1 from './alfresco-api.service';
import * as i2 from '@angular/material/icon';
import * as i3 from '@angular/platform-browser';
export class ThumbnailService {
  /**
   * @param {?} apiService
   * @param {?} matIconRegistry
   * @param {?} sanitizer
   */
  constructor(apiService, matIconRegistry, sanitizer) {
    this.apiService = apiService;
    this.DEFAULT_ICON = './assets/images/ft_ic_miscellaneous.svg';
    this.mimeTypeIcons = {
      'image/png': './assets/images/ft_ic_raster_image.svg',
      'image/jpeg': './assets/images/ft_ic_raster_image.svg',
      'image/gif': './assets/images/ft_ic_raster_image.svg',
      'image/bmp': './assets/images/ft_ic_raster_image.svg',
      'image/cgm': './assets/images/ft_ic_raster_image.svg',
      'image/ief': './assets/images/ft_ic_raster_image.svg',
      'image/jp2': './assets/images/ft_ic_raster_image.svg',
      'image/tiff': './assets/images/ft_ic_raster_image.svg',
      'image/vnd.adobe.photoshop': './assets/images/ft_ic_raster_image.svg',
      'image/vnd.adobe.premiere': './assets/images/ft_ic_raster_image.svg',
      'image/x-cmu-raster': './assets/images/ft_ic_raster_image.svg',
      'image/x-dwt': './assets/images/ft_ic_raster_image.svg',
      'image/x-portable-anymap': './assets/images/ft_ic_raster_image.svg',
      'image/x-portable-bitmap': './assets/images/ft_ic_raster_image.svg',
      'image/x-portable-graymap': './assets/images/ft_ic_raster_image.svg',
      'image/x-portable-pixmap': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-adobe': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-canon': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-fuji': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-hasselblad': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-kodak': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-leica': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-minolta': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-nikon': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-olympus': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-panasonic': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-pentax': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-red': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-sigma': './assets/images/ft_ic_raster_image.svg',
      'image/x-raw-sony': './assets/images/ft_ic_raster_image.svg',
      'image/x-xbitmap': './assets/images/ft_ic_raster_image.svg',
      'image/x-xpixmap': './assets/images/ft_ic_raster_image.svg',
      'image/x-xwindowdump': './assets/images/ft_ic_raster_image.svg',
      'image/svg+xml': './assets/images/ft_ic_vector_image.svg',
      'application/eps': './assets/images/ft_ic_raster_image.svg',
      'application/illustrator': './assets/images/ft_ic_raster_image.svg',
      'application/pdf': './assets/images/ft_ic_pdf.svg',
      'application/vnd.ms-excel': './assets/images/ft_ic_ms_excel.svg',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        './assets/images/ft_ic_ms_excel.svg',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
        './assets/images/ft_ic_ms_excel.svg',
      'application/vnd.ms-excel.addin.macroenabled.12':
        './assets/images/ft_ic_ms_excel.svg',
      'application/vnd.ms-excel.sheet.binary.macroenabled.12':
        './assets/images/ft_ic_ms_excel.svg',
      'application/vnd.ms-excel.sheet.macroenabled.12':
        './assets/images/ft_ic_ms_excel.svg',
      'application/vnd.ms-excel.template.macroenabled.12':
        './assets/images/ft_ic_ms_excel.svg',
      'application/vnd.sun.xml.calc': './assets/images/ft_ic_ms_excel.svg',
      'application/vnd.sun.xml.calc.template':
        './assets/images/ft_ic_ms_excel.svg',
      'application/vnd.ms-outlook': './assets/images/ft_ic_document.svg',
      'application/msword': './assets/images/ft_ic_ms_word.svg',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        './assets/images/ft_ic_ms_word.svg',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
        './assets/images/ft_ic_ms_word.svg',
      'application/vnd.ms-word.document.macroenabled.12':
        './assets/images/ft_ic_ms_word.svg',
      'application/vnd.ms-word.template.macroenabled.12':
        './assets/images/ft_ic_ms_word.svg',
      'application/vnd.sun.xml.writer': './assets/images/ft_ic_ms_word.svg',
      'application/vnd.sun.xml.writer.template':
        './assets/images/ft_ic_ms_word.svg',
      'application/rtf': './assets/images/ft_ic_ms_word.svg',
      'text/rtf': './assets/images/ft_ic_ms_word.svg',
      'application/vnd.ms-powerpoint':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.openxmlformats-officedocument.presentationml.template':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.oasis.opendocument.presentation':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.oasis.opendocument.presentation-template':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.openxmlformats-officedocument.presentationml.slide':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.sun.xml.impress':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.sun.xml.impress.template':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.oasis.opendocument.spreadsheet':
        './assets/images/ft_ic_ms_excel.svg',
      'application/vnd.oasis.opendocument.spreadsheet-template':
        './assets/images/ft_ic_ms_excel.svg',
      'application/vnd.ms-powerpoint.addin.macroenabled.12':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.ms-powerpoint.presentation.macroenabled.12':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.ms-powerpoint.slide.macroenabled.12':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.ms-powerpoint.slideshow.macroenabled.12':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'application/vnd.ms-powerpoint.template.macroenabled.12':
        './assets/images/ft_ic_ms_powerpoint.svg',
      'video/mp4': './assets/images/ft_ic_video.svg',
      'video/3gpp': './assets/images/ft_ic_video.svg',
      'video/3gpp2': './assets/images/ft_ic_video.svg',
      'video/mp2t': './assets/images/ft_ic_video.svg',
      'video/mpeg': './assets/images/ft_ic_video.svg',
      'video/mpeg2': './assets/images/ft_ic_video.svg',
      'video/ogg': './assets/images/ft_ic_video.svg',
      'video/quicktime': './assets/images/ft_ic_video.svg',
      'video/webm': './assets/images/ft_ic_video.svg',
      'video/x-flv': './assets/images/ft_ic_video.svg',
      'video/x-m4v': './assets/images/ft_ic_video.svg',
      'video/x-ms-asf': './assets/images/ft_ic_video.svg',
      'video/x-ms-wmv': './assets/images/ft_ic_video.svg',
      'video/x-msvideo': './assets/images/ft_ic_video.svg',
      'video/x-rad-screenplay': './assets/images/ft_ic_video.svg',
      'video/x-sgi-movie': './assets/images/ft_ic_video.svg',
      'video/x-matroska': './assets/images/ft_ic_video.svg',
      'audio/mpeg': './assets/images/ft_ic_audio.svg',
      'audio/ogg': './assets/images/ft_ic_audio.svg',
      'audio/wav': './assets/images/ft_ic_audio.svg',
      'audio/basic': './assets/images/ft_ic_audio.svg',
      'audio/mp3': './assets/images/ft_ic_audio.svg',
      'audio/mp4': './assets/images/ft_ic_audio.svg',
      'audio/vnd.adobe.soundbooth': './assets/images/ft_ic_audio.svg',
      'audio/vorbis': './assets/images/ft_ic_audio.svg',
      'audio/x-aiff': './assets/images/ft_ic_audio.svg',
      'audio/x-flac': './assets/images/ft_ic_audio.svg',
      'audio/x-ms-wma': './assets/images/ft_ic_audio.svg',
      'audio/x-wav': './assets/images/ft_ic_audio.svg',
      'x-world/x-vrml': './assets/images/ft_ic_video.svg',
      'text/plain': './assets/images/ft_ic_document.svg',
      'application/vnd.oasis.opendocument.text':
        './assets/images/ft_ic_document.svg',
      'application/vnd.oasis.opendocument.text-template':
        './assets/images/ft_ic_document.svg',
      'application/x-javascript': './assets/images/ft_ic_document.svg',
      'application/json': './assets/images/ft_ic_document.svg',
      'text/csv': './assets/images/ft_ic_document.svg',
      'text/xml': './assets/images/ft_ic_document.svg',
      'text/html': './assets/images/ft_ic_website.svg',
      'application/x-compressed': './assets/images/ft_ic_archive.svg',
      'application/x-zip-compressed': './assets/images/ft_ic_archive.svg',
      'application/zip': './assets/images/ft_ic_archive.svg',
      'application/x-tar': './assets/images/ft_ic_archive.svg',
      'application/vnd.apple.keynote': './assets/images/ft_ic_presentation.svg',
      'application/vnd.apple.pages': './assets/images/ft_ic_document.svg',
      'application/vnd.apple.numbers': './assets/images/ft_ic_spreadsheet.svg',
      'application/vnd.visio': './assets/images/ft_ic_document.svg',
      'application/wordperfect': './assets/images/ft_ic_document.svg',
      'application/x-cpio': './assets/images/ft_ic_document.svg',
      folder: './assets/images/ft_ic_folder.svg',
      smartFolder: './assets/images/ft_ic_smart_folder.svg',
      ruleFolder: './assets/images/ft_ic_folder_rule.svg',
      linkFolder: './assets/images/ft_ic_folder_shortcut_link.svg',
      'disable/folder': './assets/images/ft_ic_folder_disable.svg',
      selected: './assets/images/ft_ic_selected.svg'
    };
    Object.keys(this.mimeTypeIcons).forEach(
      /**
       * @param {?} key
       * @return {?}
       */
      key => {
        /** @type {?} */
        const url = sanitizer.bypassSecurityTrustResourceUrl(
          this.mimeTypeIcons[key]
        );
        matIconRegistry.addSvgIcon(key, url);
        matIconRegistry.addSvgIconInNamespace('adf', key, url);
      }
    );
  }
  /**
   * Gets a thumbnail URL for the given document node.
   * @param {?} node Node or Node ID to get URL for.
   * @param {?=} attachment Toggles whether to retrieve content as an attachment for download
   * @param {?=} ticket Custom ticket to use for authentication
   * @return {?} URL string
   */
  getDocumentThumbnailUrl(node, attachment, ticket) {
    /** @type {?} */
    let resultUrl;
    if (node) {
      /** @type {?} */
      let nodeId;
      if (typeof node === 'string') {
        nodeId = node;
      } else if (node.entry) {
        nodeId = node.entry.id;
      }
      resultUrl = this.apiService.contentApi.getDocumentThumbnailUrl(
        nodeId,
        attachment,
        ticket
      );
    }
    return resultUrl || this.DEFAULT_ICON;
  }
  /**
   * Gets a thumbnail URL for a MIME type.
   * @param {?} mimeType MIME type for the thumbnail
   * @return {?} URL string
   */
  getMimeTypeIcon(mimeType) {
    /** @type {?} */
    const icon = this.mimeTypeIcons[mimeType];
    return icon || this.DEFAULT_ICON;
  }
  /**
   * Gets a "miscellaneous" thumbnail URL for types with no other icon defined.
   * @return {?} URL string
   */
  getDefaultMimeTypeIcon() {
    return this.DEFAULT_ICON;
  }
}
ThumbnailService.decorators = [
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
ThumbnailService.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: MatIconRegistry },
  { type: DomSanitizer }
];
/** @nocollapse */ ThumbnailService.ngInjectableDef = i0.defineInjectable({
  factory: function ThumbnailService_Factory() {
    return new ThumbnailService(
      i0.inject(i1.AlfrescoApiService),
      i0.inject(i2.MatIconRegistry),
      i0.inject(i3.DomSanitizer)
    );
  },
  token: ThumbnailService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  ThumbnailService.prototype.DEFAULT_ICON;
  /** @type {?} */
  ThumbnailService.prototype.mimeTypeIcons;
  /**
   * @type {?}
   * @protected
   */
  ThumbnailService.prototype.apiService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGh1bWJuYWlsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJzZXJ2aWNlcy90aHVtYm5haWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDOzs7OztBQU01RCxNQUFNLE9BQU8sZ0JBQWdCOzs7Ozs7SUFxSXpCLFlBQXNCLFVBQThCLEVBQUUsZUFBZ0MsRUFBRSxTQUF1QjtRQUF6RixlQUFVLEdBQVYsVUFBVSxDQUFvQjtRQW5JcEQsaUJBQVksR0FBVyx5Q0FBeUMsQ0FBQztRQUVqRSxrQkFBYSxHQUFRO1lBQ2pCLFdBQVcsRUFBRSx3Q0FBd0M7WUFDckQsWUFBWSxFQUFFLHdDQUF3QztZQUN0RCxXQUFXLEVBQUUsd0NBQXdDO1lBQ3JELFdBQVcsRUFBRSx3Q0FBd0M7WUFDckQsV0FBVyxFQUFFLHdDQUF3QztZQUNyRCxXQUFXLEVBQUUsd0NBQXdDO1lBQ3JELFdBQVcsRUFBRSx3Q0FBd0M7WUFDckQsWUFBWSxFQUFFLHdDQUF3QztZQUN0RCwyQkFBMkIsRUFBRSx3Q0FBd0M7WUFDckUsMEJBQTBCLEVBQUUsd0NBQXdDO1lBQ3BFLG9CQUFvQixFQUFFLHdDQUF3QztZQUM5RCxhQUFhLEVBQUUsd0NBQXdDO1lBQ3ZELHlCQUF5QixFQUFFLHdDQUF3QztZQUNuRSx5QkFBeUIsRUFBRSx3Q0FBd0M7WUFDbkUsMEJBQTBCLEVBQUUsd0NBQXdDO1lBQ3BFLHlCQUF5QixFQUFFLHdDQUF3QztZQUNuRSxtQkFBbUIsRUFBRSx3Q0FBd0M7WUFD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TUFBTTthQUNyQjs7OztZQUxRLGtCQUFrQjtZQUZsQixlQUFlO1lBQ2YsWUFBWTs7Ozs7SUFTakIsd0NBQWlFOztJQUVqRSx5Q0ErSEU7Ozs7O0lBRVUsc0NBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyogc3BlbGxjaGVja2VyOiBkaXNhYmxlICovXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRJY29uUmVnaXN0cnkgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IEFsZnJlc2NvQXBpU2VydmljZSB9IGZyb20gJy4vYWxmcmVzY28tYXBpLnNlcnZpY2UnO1xuaW1wb3J0IHsgTm9kZUVudHJ5IH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgVGh1bWJuYWlsU2VydmljZSB7XG5cbiAgICBERUZBVUxUX0lDT046IHN0cmluZyA9ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfbWlzY2VsbGFuZW91cy5zdmcnO1xuXG4gICAgbWltZVR5cGVJY29uczogYW55ID0ge1xuICAgICAgICAnaW1hZ2UvcG5nJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19yYXN0ZXJfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL2pwZWcnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3Jhc3Rlcl9pbWFnZS5zdmcnLFxuICAgICAgICAnaW1hZ2UvZ2lmJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19yYXN0ZXJfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL2JtcCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS9jZ20nOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3Jhc3Rlcl9pbWFnZS5zdmcnLFxuICAgICAgICAnaW1hZ2UvaWVmJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19yYXN0ZXJfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL2pwMic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS90aWZmJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19yYXN0ZXJfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL3ZuZC5hZG9iZS5waG90b3Nob3AnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3Jhc3Rlcl9pbWFnZS5zdmcnLFxuICAgICAgICAnaW1hZ2Uvdm5kLmFkb2JlLnByZW1pZXJlJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19yYXN0ZXJfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL3gtY211LXJhc3Rlcic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS94LWR3dCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS94LXBvcnRhYmxlLWFueW1hcCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS94LXBvcnRhYmxlLWJpdG1hcCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS94LXBvcnRhYmxlLWdyYXltYXAnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3Jhc3Rlcl9pbWFnZS5zdmcnLFxuICAgICAgICAnaW1hZ2UveC1wb3J0YWJsZS1waXhtYXAnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3Jhc3Rlcl9pbWFnZS5zdmcnLFxuICAgICAgICAnaW1hZ2UveC1yYXctYWRvYmUnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3Jhc3Rlcl9pbWFnZS5zdmcnLFxuICAgICAgICAnaW1hZ2UveC1yYXctY2Fub24nOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3Jhc3Rlcl9pbWFnZS5zdmcnLFxuICAgICAgICAnaW1hZ2UveC1yYXctZnVqaSc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS94LXJhdy1oYXNzZWxibGFkJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19yYXN0ZXJfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL3gtcmF3LWtvZGFrJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19yYXN0ZXJfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL3gtcmF3LWxlaWNhJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19yYXN0ZXJfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL3gtcmF3LW1pbm9sdGEnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3Jhc3Rlcl9pbWFnZS5zdmcnLFxuICAgICAgICAnaW1hZ2UveC1yYXctbmlrb24nOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3Jhc3Rlcl9pbWFnZS5zdmcnLFxuICAgICAgICAnaW1hZ2UveC1yYXctb2x5bXB1cyc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS94LXJhdy1wYW5hc29uaWMnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3Jhc3Rlcl9pbWFnZS5zdmcnLFxuICAgICAgICAnaW1hZ2UveC1yYXctcGVudGF4JzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19yYXN0ZXJfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL3gtcmF3LXJlZCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS94LXJhdy1zaWdtYSc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS94LXJhdy1zb255JzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19yYXN0ZXJfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2ltYWdlL3gteGJpdG1hcCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS94LXhwaXhtYXAnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3Jhc3Rlcl9pbWFnZS5zdmcnLFxuICAgICAgICAnaW1hZ2UveC14d2luZG93ZHVtcCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdpbWFnZS9zdmcreG1sJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY192ZWN0b3JfaW1hZ2Uuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL2Vwcyc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi9pbGx1c3RyYXRvcic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfcmFzdGVyX2ltYWdlLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi9wZGYnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3BkZi5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc19leGNlbC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX21zX2V4Y2VsLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC50ZW1wbGF0ZSc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfbXNfZXhjZWwuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5hZGRpbi5tYWNyb2VuYWJsZWQuMTInOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX21zX2V4Y2VsLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuc2hlZXQuYmluYXJ5Lm1hY3JvZW5hYmxlZC4xMic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfbXNfZXhjZWwuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5tYWNyb2VuYWJsZWQuMTInOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX21zX2V4Y2VsLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwudGVtcGxhdGUubWFjcm9lbmFibGVkLjEyJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc19leGNlbC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwuY2FsYyc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfbXNfZXhjZWwuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmNhbGMudGVtcGxhdGUnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX21zX2V4Y2VsLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQubXMtb3V0bG9vayc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfZG9jdW1lbnQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL21zd29yZCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfbXNfd29yZC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX21zX3dvcmQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLnRlbXBsYXRlJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc193b3JkLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQubXMtd29yZC5kb2N1bWVudC5tYWNyb2VuYWJsZWQuMTInOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX21zX3dvcmQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLnRlbXBsYXRlLm1hY3JvZW5hYmxlZC4xMic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfbXNfd29yZC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLnN1bi54bWwud3JpdGVyJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc193b3JkLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC53cml0ZXIudGVtcGxhdGUnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX21zX3dvcmQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3J0Zic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfbXNfd29yZC5zdmcnLFxuICAgICAgICAndGV4dC9ydGYnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX21zX3dvcmQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc19wb3dlcnBvaW50LnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwucHJlc2VudGF0aW9uJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc19wb3dlcnBvaW50LnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwudGVtcGxhdGUnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX21zX3Bvd2VycG9pbnQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5zbGlkZXNob3cnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX21zX3Bvd2VycG9pbnQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQucHJlc2VudGF0aW9uJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc19wb3dlcnBvaW50LnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvbi10ZW1wbGF0ZSc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfbXNfcG93ZXJwb2ludC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnNsaWRlJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc19wb3dlcnBvaW50LnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5pbXByZXNzJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc19wb3dlcnBvaW50LnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5pbXByZXNzLnRlbXBsYXRlJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc19wb3dlcnBvaW50LnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnNwcmVhZHNoZWV0JzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc19leGNlbC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5zcHJlYWRzaGVldC10ZW1wbGF0ZSc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfbXNfZXhjZWwuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LmFkZGluLm1hY3JvZW5hYmxlZC4xMic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfbXNfcG93ZXJwb2ludC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQucHJlc2VudGF0aW9uLm1hY3JvZW5hYmxlZC4xMic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfbXNfcG93ZXJwb2ludC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQuc2xpZGUubWFjcm9lbmFibGVkLjEyJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc19wb3dlcnBvaW50LnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5zbGlkZXNob3cubWFjcm9lbmFibGVkLjEyJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19tc19wb3dlcnBvaW50LnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC50ZW1wbGF0ZS5tYWNyb2VuYWJsZWQuMTInOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX21zX3Bvd2VycG9pbnQuc3ZnJyxcbiAgICAgICAgJ3ZpZGVvL21wNCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfdmlkZW8uc3ZnJyxcbiAgICAgICAgJ3ZpZGVvLzNncHAnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3ZpZGVvLnN2ZycsXG4gICAgICAgICd2aWRlby8zZ3BwMic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfdmlkZW8uc3ZnJyxcbiAgICAgICAgJ3ZpZGVvL21wMnQnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3ZpZGVvLnN2ZycsXG4gICAgICAgICd2aWRlby9tcGVnJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY192aWRlby5zdmcnLFxuICAgICAgICAndmlkZW8vbXBlZzInOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3ZpZGVvLnN2ZycsXG4gICAgICAgICd2aWRlby9vZ2cnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3ZpZGVvLnN2ZycsXG4gICAgICAgICd2aWRlby9xdWlja3RpbWUnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3ZpZGVvLnN2ZycsXG4gICAgICAgICd2aWRlby93ZWJtJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY192aWRlby5zdmcnLFxuICAgICAgICAndmlkZW8veC1mbHYnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3ZpZGVvLnN2ZycsXG4gICAgICAgICd2aWRlby94LW00dic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfdmlkZW8uc3ZnJyxcbiAgICAgICAgJ3ZpZGVvL3gtbXMtYXNmJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY192aWRlby5zdmcnLFxuICAgICAgICAndmlkZW8veC1tcy13bXYnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3ZpZGVvLnN2ZycsXG4gICAgICAgICd2aWRlby94LW1zdmlkZW8nOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3ZpZGVvLnN2ZycsXG4gICAgICAgICd2aWRlby94LXJhZC1zY3JlZW5wbGF5JzogICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfdmlkZW8uc3ZnJyxcbiAgICAgICAgJ3ZpZGVvL3gtc2dpLW1vdmllJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY192aWRlby5zdmcnLFxuICAgICAgICAndmlkZW8veC1tYXRyb3NrYSc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfdmlkZW8uc3ZnJyxcbiAgICAgICAgJ2F1ZGlvL21wZWcnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2F1ZGlvLnN2ZycsXG4gICAgICAgICdhdWRpby9vZ2cnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2F1ZGlvLnN2ZycsXG4gICAgICAgICdhdWRpby93YXYnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2F1ZGlvLnN2ZycsXG4gICAgICAgICdhdWRpby9iYXNpYyc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfYXVkaW8uc3ZnJyxcbiAgICAgICAgJ2F1ZGlvL21wMyc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfYXVkaW8uc3ZnJyxcbiAgICAgICAgJ2F1ZGlvL21wNCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfYXVkaW8uc3ZnJyxcbiAgICAgICAgJ2F1ZGlvL3ZuZC5hZG9iZS5zb3VuZGJvb3RoJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19hdWRpby5zdmcnLFxuICAgICAgICAnYXVkaW8vdm9yYmlzJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19hdWRpby5zdmcnLFxuICAgICAgICAnYXVkaW8veC1haWZmJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19hdWRpby5zdmcnLFxuICAgICAgICAnYXVkaW8veC1mbGFjJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19hdWRpby5zdmcnLFxuICAgICAgICAnYXVkaW8veC1tcy13bWEnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2F1ZGlvLnN2ZycsXG4gICAgICAgICdhdWRpby94LXdhdic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfYXVkaW8uc3ZnJyxcbiAgICAgICAgJ3gtd29ybGQveC12cm1sJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY192aWRlby5zdmcnLFxuICAgICAgICAndGV4dC9wbGFpbic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfZG9jdW1lbnQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfZG9jdW1lbnQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dC10ZW1wbGF0ZSc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfZG9jdW1lbnQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfZG9jdW1lbnQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2RvY3VtZW50LnN2ZycsXG4gICAgICAgICd0ZXh0L2Nzdic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfZG9jdW1lbnQuc3ZnJyxcbiAgICAgICAgJ3RleHQveG1sJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19kb2N1bWVudC5zdmcnLFxuICAgICAgICAndGV4dC9odG1sJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY193ZWJzaXRlLnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi94LWNvbXByZXNzZWQnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2FyY2hpdmUuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3gtemlwLWNvbXByZXNzZWQnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2FyY2hpdmUuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ppcCc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfYXJjaGl2ZS5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24veC10YXInOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2FyY2hpdmUuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5hcHBsZS5rZXlub3RlJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19wcmVzZW50YXRpb24uc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5hcHBsZS5wYWdlcyc6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfZG9jdW1lbnQuc3ZnJyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uL3ZuZC5hcHBsZS5udW1iZXJzJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19zcHJlYWRzaGVldC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vdm5kLnZpc2lvJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19kb2N1bWVudC5zdmcnLFxuICAgICAgICAnYXBwbGljYXRpb24vd29yZHBlcmZlY3QnOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2RvY3VtZW50LnN2ZycsXG4gICAgICAgICdhcHBsaWNhdGlvbi94LWNwaW8nOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2RvY3VtZW50LnN2ZycsXG4gICAgICAgICdmb2xkZXInOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2ZvbGRlci5zdmcnLFxuICAgICAgICAnc21hcnRGb2xkZXInOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX3NtYXJ0X2ZvbGRlci5zdmcnLFxuICAgICAgICAncnVsZUZvbGRlcic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfZm9sZGVyX3J1bGUuc3ZnJyxcbiAgICAgICAgJ2xpbmtGb2xkZXInOiAnLi9hc3NldHMvaW1hZ2VzL2Z0X2ljX2ZvbGRlcl9zaG9ydGN1dF9saW5rLnN2ZycsXG4gICAgICAgICdkaXNhYmxlL2ZvbGRlcic6ICcuL2Fzc2V0cy9pbWFnZXMvZnRfaWNfZm9sZGVyX2Rpc2FibGUuc3ZnJyxcbiAgICAgICAgJ3NlbGVjdGVkJzogJy4vYXNzZXRzL2ltYWdlcy9mdF9pY19zZWxlY3RlZC5zdmcnXG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhcGlTZXJ2aWNlOiBBbGZyZXNjb0FwaVNlcnZpY2UsIG1hdEljb25SZWdpc3RyeTogTWF0SWNvblJlZ2lzdHJ5LCBzYW5pdGl6ZXI6IERvbVNhbml0aXplcikge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLm1pbWVUeXBlSWNvbnMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCh0aGlzLm1pbWVUeXBlSWNvbnNba2V5XSk7XG5cbiAgICAgICAgICAgIG1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKGtleSwgdXJsKTtcbiAgICAgICAgICAgIG1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uSW5OYW1lc3BhY2UoJ2FkZicsIGtleSwgdXJsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIHRodW1ibmFpbCBVUkwgZm9yIHRoZSBnaXZlbiBkb2N1bWVudCBub2RlLlxuICAgICAqIEBwYXJhbSBub2RlIE5vZGUgb3IgTm9kZSBJRCB0byBnZXQgVVJMIGZvci5cbiAgICAgKiBAcGFyYW0gYXR0YWNobWVudCBUb2dnbGVzIHdoZXRoZXIgdG8gcmV0cmlldmUgY29udGVudCBhcyBhbiBhdHRhY2htZW50IGZvciBkb3dubG9hZFxuICAgICAqIEBwYXJhbSB0aWNrZXQgQ3VzdG9tIHRpY2tldCB0byB1c2UgZm9yIGF1dGhlbnRpY2F0aW9uXG4gICAgICogQHJldHVybnMgVVJMIHN0cmluZ1xuICAgICAqL1xuICAgIGdldERvY3VtZW50VGh1bWJuYWlsVXJsKG5vZGU6IE5vZGVFbnRyeSB8IHN0cmluZywgYXR0YWNobWVudD86IGJvb2xlYW4sIHRpY2tldD86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCByZXN1bHRVcmw6IHN0cmluZztcblxuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgbGV0IG5vZGVJZDogc3RyaW5nO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbm9kZUlkID0gbm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZS5lbnRyeSkge1xuICAgICAgICAgICAgICAgIG5vZGVJZCA9IG5vZGUuZW50cnkuaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdFVybCA9IHRoaXMuYXBpU2VydmljZS5jb250ZW50QXBpLmdldERvY3VtZW50VGh1bWJuYWlsVXJsKG5vZGVJZCwgYXR0YWNobWVudCwgdGlja2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRVcmwgfHwgdGhpcy5ERUZBVUxUX0lDT047XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIHRodW1ibmFpbCBVUkwgZm9yIGEgTUlNRSB0eXBlLlxuICAgICAqIEBwYXJhbSBtaW1lVHlwZSBNSU1FIHR5cGUgZm9yIHRoZSB0aHVtYm5haWxcbiAgICAgKiBAcmV0dXJucyBVUkwgc3RyaW5nXG4gICAgICovXG4gICAgcHVibGljIGdldE1pbWVUeXBlSWNvbihtaW1lVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgaWNvbiA9IHRoaXMubWltZVR5cGVJY29uc1ttaW1lVHlwZV07XG4gICAgICAgIHJldHVybiAoaWNvbiB8fCB0aGlzLkRFRkFVTFRfSUNPTik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIFwibWlzY2VsbGFuZW91c1wiIHRodW1ibmFpbCBVUkwgZm9yIHR5cGVzIHdpdGggbm8gb3RoZXIgaWNvbiBkZWZpbmVkLlxuICAgICAqIEByZXR1cm5zIFVSTCBzdHJpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0RGVmYXVsdE1pbWVUeXBlSWNvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5ERUZBVUxUX0lDT047XG4gICAgfVxufVxuIl19
