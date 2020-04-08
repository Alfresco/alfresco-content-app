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
import { DomSanitizer } from '@angular/platform-browser';
export class InitialUsernamePipe {
  /**
   * @param {?} sanitized
   */
  constructor(sanitized) {
    this.sanitized = sanitized;
  }
  /**
   * @param {?} user
   * @param {?=} className
   * @param {?=} delimiter
   * @return {?}
   */
  transform(user, className = '', delimiter = '') {
    /** @type {?} */
    let safeHtml = '';
    if (user) {
      /** @type {?} */
      const initialResult = this.getInitialUserName(
        user.firstName,
        user.lastName,
        delimiter
      );
      safeHtml = this.sanitized.bypassSecurityTrustHtml(
        `<div id="user-initials-image" class="${className}">${initialResult}</div>`
      );
    }
    return safeHtml;
  }
  /**
   * @param {?} firstName
   * @param {?} lastName
   * @param {?} delimiter
   * @return {?}
   */
  getInitialUserName(firstName, lastName, delimiter) {
    firstName = firstName ? firstName[0] : '';
    lastName = lastName ? lastName[0] : '';
    return firstName + delimiter + lastName;
  }
}
InitialUsernamePipe.decorators = [
  {
    type: Pipe,
    args: [
      {
        name: 'usernameInitials'
      }
    ]
  }
];
/** @nocollapse */
InitialUsernamePipe.ctorParameters = () => [{ type: DomSanitizer }];
if (false) {
  /**
   * @type {?}
   * @private
   */
  InitialUsernamePipe.prototype.sanitized;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbml0aWFsLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJwaXBlcy91c2VyLWluaXRpYWwucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUUsWUFBWSxFQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFRbkUsTUFBTSxPQUFPLG1CQUFtQjs7OztJQUU1QixZQUFvQixTQUF1QjtRQUF2QixjQUFTLEdBQVQsU0FBUyxDQUFjO0lBQzNDLENBQUM7Ozs7Ozs7SUFFRCxTQUFTLENBQUMsSUFBeUQsRUFBRSxZQUFvQixFQUFFLEVBQUUsWUFBb0IsRUFBRTs7WUFDM0csUUFBUSxHQUFhLEVBQUU7UUFDM0IsSUFBSSxJQUFJLEVBQUU7O2tCQUNBLGFBQWEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQztZQUN2RixRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyx3Q0FBd0MsU0FBUyxLQUFLLGFBQWEsUUFBUSxDQUFDLENBQUM7U0FDbEk7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDOzs7Ozs7O0lBRUQsa0JBQWtCLENBQUMsU0FBaUIsRUFBRSxRQUFnQixFQUFFLFNBQWlCO1FBQ3JFLFNBQVMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QyxRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekMsT0FBTyxTQUFTLEdBQUcsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QyxDQUFDOzs7WUFyQkosSUFBSSxTQUFDO2dCQUNGLElBQUksRUFBRSxrQkFBa0I7YUFDM0I7Ozs7WUFQUSxZQUFZOzs7Ozs7O0lBVUwsd0NBQStCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgVXNlclByb2Nlc3NNb2RlbCB9IGZyb20gJy4uL21vZGVscy91c2VyLXByb2Nlc3MubW9kZWwnO1xuaW1wb3J0IHsgRWNtVXNlck1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2VjbS11c2VyLm1vZGVsJztcbmltcG9ydCB7IElkZW50aXR5VXNlck1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2lkZW50aXR5LXVzZXIubW9kZWwnO1xuXG5AUGlwZSh7XG4gICAgbmFtZTogJ3VzZXJuYW1lSW5pdGlhbHMnXG59KVxuZXhwb3J0IGNsYXNzIEluaXRpYWxVc2VybmFtZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc2FuaXRpemVkOiBEb21TYW5pdGl6ZXIpIHtcbiAgICB9XG5cbiAgICB0cmFuc2Zvcm0odXNlcjogVXNlclByb2Nlc3NNb2RlbCB8IEVjbVVzZXJNb2RlbCB8IElkZW50aXR5VXNlck1vZGVsLCBjbGFzc05hbWU6IHN0cmluZyA9ICcnLCBkZWxpbWl0ZXI6IHN0cmluZyA9ICcnKTogU2FmZUh0bWwge1xuICAgICAgICBsZXQgc2FmZUh0bWw6IFNhZmVIdG1sID0gJyc7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICBjb25zdCBpbml0aWFsUmVzdWx0ID0gdGhpcy5nZXRJbml0aWFsVXNlck5hbWUodXNlci5maXJzdE5hbWUsIHVzZXIubGFzdE5hbWUsIGRlbGltaXRlcik7XG4gICAgICAgICAgICBzYWZlSHRtbCA9IHRoaXMuc2FuaXRpemVkLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKGA8ZGl2IGlkPVwidXNlci1pbml0aWFscy1pbWFnZVwiIGNsYXNzPVwiJHtjbGFzc05hbWV9XCI+JHtpbml0aWFsUmVzdWx0fTwvZGl2PmApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzYWZlSHRtbDtcbiAgICB9XG5cbiAgICBnZXRJbml0aWFsVXNlck5hbWUoZmlyc3ROYW1lOiBzdHJpbmcsIGxhc3ROYW1lOiBzdHJpbmcsIGRlbGltaXRlcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgZmlyc3ROYW1lID0gKGZpcnN0TmFtZSA/IGZpcnN0TmFtZVswXSA6ICcnKTtcbiAgICAgICAgbGFzdE5hbWUgPSAobGFzdE5hbWUgPyBsYXN0TmFtZVswXSA6ICcnKTtcbiAgICAgICAgcmV0dXJuIGZpcnN0TmFtZSArIGRlbGltaXRlciArIGxhc3ROYW1lO1xuICAgIH1cbn1cbiJdfQ==
