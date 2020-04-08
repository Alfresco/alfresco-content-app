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
import { AppConfigService } from './app-config.service';
export class AppConfigPipe {
  /**
   * @param {?} config
   */
  constructor(config) {
    this.config = config;
  }
  /**
   * @param {?} value
   * @param {?} fallback
   * @return {?}
   */
  transform(value, fallback) {
    return this.config.get(value, fallback);
  }
}
AppConfigPipe.decorators = [
  {
    type: Pipe,
    args: [
      {
        name: 'adfAppConfig'
      }
    ]
  }
];
/** @nocollapse */
AppConfigPipe.ctorParameters = () => [{ type: AppConfigService }];
if (false) {
  /**
   * @type {?}
   * @private
   */
  AppConfigPipe.prototype.config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNvbmZpZy5waXBlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiYXBwLWNvbmZpZy9hcHAtY29uZmlnLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFLeEQsTUFBTSxPQUFPLGFBQWE7Ozs7SUFDdEIsWUFBb0IsTUFBd0I7UUFBeEIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7SUFBRyxDQUFDOzs7Ozs7SUFFaEQsU0FBUyxDQUFDLEtBQWEsRUFBRSxRQUFhO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7OztZQVJKLElBQUksU0FBQztnQkFDRixJQUFJLEVBQUUsY0FBYzthQUN2Qjs7OztZQUpRLGdCQUFnQjs7Ozs7OztJQU1ULCtCQUFnQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFwcENvbmZpZ1NlcnZpY2UgfSBmcm9tICcuL2FwcC1jb25maWcuc2VydmljZSc7XG5cbkBQaXBlKHtcbiAgICBuYW1lOiAnYWRmQXBwQ29uZmlnJ1xufSlcbmV4cG9ydCBjbGFzcyBBcHBDb25maWdQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IEFwcENvbmZpZ1NlcnZpY2UpIHt9XG5cbiAgICB0cmFuc2Zvcm0odmFsdWU6IHN0cmluZywgZmFsbGJhY2s6IGFueSk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5nZXQodmFsdWUsIGZhbGxiYWNrKTtcbiAgICB9XG59XG4iXX0=
