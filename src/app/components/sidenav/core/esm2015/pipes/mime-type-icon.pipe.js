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
import { ThumbnailService } from '../services/thumbnail.service';
export class MimeTypeIconPipe {
  /**
   * @param {?} thumbnailService
   */
  constructor(thumbnailService) {
    this.thumbnailService = thumbnailService;
  }
  /**
   * @param {?} text
   * @return {?}
   */
  transform(text) {
    return this.thumbnailService.getMimeTypeIcon(text);
  }
}
MimeTypeIconPipe.decorators = [
  {
    type: Pipe,
    args: [
      {
        name: 'adfMimeTypeIcon'
      }
    ]
  }
];
/** @nocollapse */
MimeTypeIconPipe.ctorParameters = () => [{ type: ThumbnailService }];
if (false) {
  /**
   * @type {?}
   * @private
   */
  MimeTypeIconPipe.prototype.thumbnailService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWltZS10eXBlLWljb24ucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInBpcGVzL21pbWUtdHlwZS1pY29uLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFLakUsTUFBTSxPQUFPLGdCQUFnQjs7OztJQUV6QixZQUFvQixnQkFBa0M7UUFBbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtJQUFJLENBQUM7Ozs7O0lBRTNELFNBQVMsQ0FBQyxJQUFZO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxDQUFDOzs7WUFUSixJQUFJLFNBQUM7Z0JBQ0YsSUFBSSxFQUFFLGlCQUFpQjthQUMxQjs7OztZQUpRLGdCQUFnQjs7Ozs7OztJQU9ULDRDQUEwQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRodW1ibmFpbFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy90aHVtYm5haWwuc2VydmljZSc7XG5cbkBQaXBlKHtcbiAgICBuYW1lOiAnYWRmTWltZVR5cGVJY29uJ1xufSlcbmV4cG9ydCBjbGFzcyBNaW1lVHlwZUljb25QaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRodW1ibmFpbFNlcnZpY2U6IFRodW1ibmFpbFNlcnZpY2UpIHsgfVxuXG4gICAgdHJhbnNmb3JtKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRodW1ibmFpbFNlcnZpY2UuZ2V0TWltZVR5cGVJY29uKHRleHQpO1xuICAgIH1cbn1cbiJdfQ==
