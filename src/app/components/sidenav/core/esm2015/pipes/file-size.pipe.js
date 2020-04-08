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
import { Pipe } from '@angular/core';
import { TranslationService } from '../services/translation.service';
export class FileSizePipe {
  /**
   * @param {?} translation
   */
  constructor(translation) {
    this.translation = translation;
  }
  /**
   * @param {?} bytes
   * @param {?=} decimals
   * @return {?}
   */
  transform(bytes, decimals = 2) {
    if (bytes == null || bytes === undefined) {
      return '';
    }
    if (bytes === 0) {
      return '0 ' + this.translation.instant('CORE.FILE_SIZE.BYTES');
    }
    /** @type {?} */
    const k = 1024;
    /** @type {?} */
    const dm = decimals || 2;
    /** @type {?} */
    const sizes = ['BYTES', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    /** @type {?} */
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    /** @type {?} */
    const i18nSize = this.translation.instant(`CORE.FILE_SIZE.${sizes[i]}`);
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + i18nSize;
  }
}
FileSizePipe.decorators = [
  {
    type: Pipe,
    args: [
      {
        name: 'adfFileSize',
        pure: false
      }
    ]
  }
];
/** @nocollapse */
FileSizePipe.ctorParameters = () => [{ type: TranslationService }];
if (false) {
  /**
   * @type {?}
   * @private
   */
  FileSizePipe.prototype.translation;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1zaXplLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJwaXBlcy9maWxlLXNpemUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQU1yRSxNQUFNLE9BQU8sWUFBWTs7OztJQUVyQixZQUFvQixXQUErQjtRQUEvQixnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7SUFDbkQsQ0FBQzs7Ozs7O0lBRUQsU0FBUyxDQUFDLEtBQWEsRUFBRSxXQUFtQixDQUFDO1FBQ3pDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3RDLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFFRCxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDYixPQUFPLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ2xFOztjQUVLLENBQUMsR0FBRyxJQUFJOztjQUNWLEVBQUUsR0FBRyxRQUFRLElBQUksQ0FBQzs7Y0FDbEIsS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7O2NBQ2pFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Y0FFM0MsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGtCQUFrQixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUV2RSxPQUFPLFVBQVUsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUM7SUFDN0UsQ0FBQzs7O1lBMUJKLElBQUksU0FBQztnQkFDRixJQUFJLEVBQUUsYUFBYTtnQkFDbkIsSUFBSSxFQUFFLEtBQUs7YUFDZDs7OztZQUxRLGtCQUFrQjs7Ozs7OztJQVFYLG1DQUF1QyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRyYW5zbGF0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3RyYW5zbGF0aW9uLnNlcnZpY2UnO1xuXG5AUGlwZSh7XG4gICAgbmFtZTogJ2FkZkZpbGVTaXplJyxcbiAgICBwdXJlOiBmYWxzZVxufSlcbmV4cG9ydCBjbGFzcyBGaWxlU2l6ZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdHJhbnNsYXRpb246IFRyYW5zbGF0aW9uU2VydmljZSkge1xuICAgIH1cblxuICAgIHRyYW5zZm9ybShieXRlczogbnVtYmVyLCBkZWNpbWFsczogbnVtYmVyID0gMik6IHN0cmluZyB7XG4gICAgICAgIGlmIChieXRlcyA9PSBudWxsIHx8IGJ5dGVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChieXRlcyA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuICcwICcgKyB0aGlzLnRyYW5zbGF0aW9uLmluc3RhbnQoJ0NPUkUuRklMRV9TSVpFLkJZVEVTJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBrID0gMTAyNCxcbiAgICAgICAgICAgIGRtID0gZGVjaW1hbHMgfHwgMixcbiAgICAgICAgICAgIHNpemVzID0gWydCWVRFUycsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddLFxuICAgICAgICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5sb2coYnl0ZXMpIC8gTWF0aC5sb2coaykpO1xuXG4gICAgICAgIGNvbnN0IGkxOG5TaXplID0gdGhpcy50cmFuc2xhdGlvbi5pbnN0YW50KGBDT1JFLkZJTEVfU0laRS4ke3NpemVzW2ldfWApO1xuXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KChieXRlcyAvIE1hdGgucG93KGssIGkpKS50b0ZpeGVkKGRtKSkgKyAnICcgKyBpMThuU2l6ZTtcbiAgICB9XG5cbn1cbiJdfQ==
