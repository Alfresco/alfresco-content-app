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
export class FileTypePipe {
  /**
   * @param {?} value
   * @return {?}
   */
  transform(value) {
    if (value == null || value === undefined) {
      return '';
    } else {
      /** @type {?} */
      const fileInfo = value
        .substring(value.lastIndexOf('/') + 1)
        .replace(/\.[a-z]+/, '');
      return fileInfo.split('_').pop();
    }
  }
}
FileTypePipe.decorators = [
  {
    type: Pipe,
    args: [
      {
        name: 'fileType',
        pure: true
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS10eXBlLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJwaXBlcy9maWxlLXR5cGUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQWlCLElBQUksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU1wRCxNQUFNLE9BQU8sWUFBWTs7Ozs7SUFFckIsU0FBUyxDQUFDLEtBQWE7UUFFbkIsSUFBSyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUc7WUFDeEMsT0FBTyxFQUFFLENBQUM7U0FDYjthQUFNOztrQkFDRyxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDO1lBQ3BGLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNwQztJQUNMLENBQUM7OztZQWRKLElBQUksU0FBQztnQkFDRixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsSUFBSSxFQUFFLElBQUk7YUFDYiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFBpcGVUcmFuc2Zvcm0sIFBpcGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoe1xuICAgIG5hbWU6ICdmaWxlVHlwZScsXG4gICAgcHVyZTogdHJ1ZVxufSlcbmV4cG9ydCBjbGFzcyBGaWxlVHlwZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICAgIHRyYW5zZm9ybSh2YWx1ZTogc3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKCB2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBmaWxlSW5mbyA9IHZhbHVlLnN1YnN0cmluZyh2YWx1ZS5sYXN0SW5kZXhPZignLycpICsgMSkucmVwbGFjZSgvXFwuW2Etel0rLywgJycpO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVJbmZvLnNwbGl0KCdfJykucG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==
