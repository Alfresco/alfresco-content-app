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
export class FullNamePipe {
  /**
   * @param {?} user
   * @return {?}
   */
  transform(user) {
    /** @type {?} */
    let fullName = '';
    if (user) {
      if (user.firstName) {
        fullName += user.firstName;
      }
      if (user.lastName) {
        fullName += fullName.length > 0 ? ' ' : '';
        fullName += user.lastName;
      }
      if (!fullName) {
        fullName += user.username
          ? user.username
          : user.email
          ? user.email
          : '';
      }
    }
    return fullName;
  }
}
FullNamePipe.decorators = [{ type: Pipe, args: [{ name: 'fullName' }] }];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsbC1uYW1lLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJwaXBlcy9mdWxsLW5hbWUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUdwRCxNQUFNLE9BQU8sWUFBWTs7Ozs7SUFDckIsU0FBUyxDQUFDLElBQVM7O1lBQ1gsUUFBUSxHQUFHLEVBQUU7UUFDakIsSUFBSSxJQUFJLEVBQUU7WUFDTixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2hCLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO2FBQzlCO1lBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNmLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQzNDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQzdCO1lBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDWCxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQzVFO1NBQ0o7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDOzs7WUFqQkosSUFBSSxTQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoeyBuYW1lOiAnZnVsbE5hbWUnIH0pXG5leHBvcnQgY2xhc3MgRnVsbE5hbWVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gICAgdHJhbnNmb3JtKHVzZXI6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGxldCBmdWxsTmFtZSA9ICcnO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgaWYgKHVzZXIuZmlyc3ROYW1lKSB7XG4gICAgICAgICAgICAgICAgZnVsbE5hbWUgKz0gdXNlci5maXJzdE5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXNlci5sYXN0TmFtZSkge1xuICAgICAgICAgICAgICAgIGZ1bGxOYW1lICs9IGZ1bGxOYW1lLmxlbmd0aCA+IDAgPyAnICcgOiAnJztcbiAgICAgICAgICAgICAgICBmdWxsTmFtZSArPSB1c2VyLmxhc3ROYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFmdWxsTmFtZSkge1xuICAgICAgICAgICAgICAgIGZ1bGxOYW1lICs9IHVzZXIudXNlcm5hbWUgPyB1c2VyLnVzZXJuYW1lIDogdXNlci5lbWFpbCA/IHVzZXIuZW1haWwgOiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVsbE5hbWU7XG4gICAgfVxufVxuIl19
