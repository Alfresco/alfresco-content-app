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
import { Directive } from '@angular/core';
/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0.
 * The empty-folder-content selector will be deprecated as it has been replace by
 * adf-custom-empty-content-template.
 */
export class CustomEmptyContentTemplateDirective {}
CustomEmptyContentTemplateDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: 'adf-custom-empty-content-template, empty-folder-content'
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLWVtcHR5LWNvbnRlbnQtdGVtcGxhdGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZGF0YXRhYmxlL2RpcmVjdGl2ZXMvY3VzdG9tLWVtcHR5LWNvbnRlbnQtdGVtcGxhdGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQVcxQyxNQUFNLE9BQU8sbUNBQW1DOzs7WUFKL0MsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx5REFBeUQ7YUFDdEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBEaXJlY3RpdmUgc2VsZWN0b3JzIHdpdGhvdXQgYWRmLSBwcmVmaXggd2lsbCBiZSBkZXByZWNhdGVkIG9uIDMuMC4wLlxuICogVGhlIGVtcHR5LWZvbGRlci1jb250ZW50IHNlbGVjdG9yIHdpbGwgYmUgZGVwcmVjYXRlZCBhcyBpdCBoYXMgYmVlbiByZXBsYWNlIGJ5XG4gKiBhZGYtY3VzdG9tLWVtcHR5LWNvbnRlbnQtdGVtcGxhdGUuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnYWRmLWN1c3RvbS1lbXB0eS1jb250ZW50LXRlbXBsYXRlLCBlbXB0eS1mb2xkZXItY29udGVudCdcbn0pXG5cbmV4cG9ydCBjbGFzcyBDdXN0b21FbXB0eUNvbnRlbnRUZW1wbGF0ZURpcmVjdGl2ZSB7fVxuIl19
