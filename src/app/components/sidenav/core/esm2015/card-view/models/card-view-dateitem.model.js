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
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
export class CardViewDateItemModel extends CardViewBaseItemModel {
  /**
   * @param {?} cardViewDateItemProperties
   */
  constructor(cardViewDateItemProperties) {
    super(cardViewDateItemProperties);
    this.type = 'date';
    if (cardViewDateItemProperties.format) {
      this.format = cardViewDateItemProperties.format;
    }
    if (cardViewDateItemProperties.locale) {
      this.locale = cardViewDateItemProperties.locale;
    }
  }
  /**
   * @return {?}
   */
  get displayValue() {
    if (!this.value) {
      return this.default;
    } else {
      this.localizedDatePipe = new LocalizedDatePipe();
      return this.localizedDatePipe.transform(
        this.value,
        this.format,
        this.locale
      );
    }
  }
}
if (false) {
  /** @type {?} */
  CardViewDateItemModel.prototype.type;
  /** @type {?} */
  CardViewDateItemModel.prototype.format;
  /** @type {?} */
  CardViewDateItemModel.prototype.locale;
  /** @type {?} */
  CardViewDateItemModel.prototype.localizedDatePipe;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWRhdGVpdGVtLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiY2FyZC12aWV3L21vZGVscy9jYXJkLXZpZXctZGF0ZWl0ZW0ubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFbkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFcEUsTUFBTSxPQUFPLHFCQUFzQixTQUFRLHFCQUFxQjs7OztJQU81RCxZQUFZLDBCQUFzRDtRQUM5RCxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQVB0QyxTQUFJLEdBQVcsTUFBTSxDQUFDO1FBU2xCLElBQUksMEJBQTBCLENBQUMsTUFBTSxFQUFFO1lBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsMEJBQTBCLENBQUMsTUFBTSxDQUFDO1NBQ25EO1FBRUQsSUFBSSwwQkFBMEIsQ0FBQyxNQUFNLEVBQUU7WUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRywwQkFBMEIsQ0FBQyxNQUFNLENBQUM7U0FDbkQ7SUFFTCxDQUFDOzs7O0lBRUQsSUFBSSxZQUFZO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDdkI7YUFBTTtZQUNILElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7WUFDakQsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakY7SUFDTCxDQUFDO0NBQ0o7OztJQTNCRyxxQ0FBc0I7O0lBQ3RCLHVDQUFlOztJQUNmLHVDQUFlOztJQUVmLGtEQUFxQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENhcmRWaWV3SXRlbSB9IGZyb20gJy4uL2ludGVyZmFjZXMvY2FyZC12aWV3LWl0ZW0uaW50ZXJmYWNlJztcbmltcG9ydCB7IER5bmFtaWNDb21wb25lbnRNb2RlbCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2R5bmFtaWMtY29tcG9uZW50LW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IENhcmRWaWV3QmFzZUl0ZW1Nb2RlbCB9IGZyb20gJy4vY2FyZC12aWV3LWJhc2VpdGVtLm1vZGVsJztcbmltcG9ydCB7IENhcmRWaWV3RGF0ZUl0ZW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jYXJkLXZpZXcuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBMb2NhbGl6ZWREYXRlUGlwZSB9IGZyb20gJy4uLy4uL3BpcGVzL2xvY2FsaXplZC1kYXRlLnBpcGUnO1xuXG5leHBvcnQgY2xhc3MgQ2FyZFZpZXdEYXRlSXRlbU1vZGVsIGV4dGVuZHMgQ2FyZFZpZXdCYXNlSXRlbU1vZGVsIGltcGxlbWVudHMgQ2FyZFZpZXdJdGVtLCBEeW5hbWljQ29tcG9uZW50TW9kZWwge1xuICAgIHR5cGU6IHN0cmluZyA9ICdkYXRlJztcbiAgICBmb3JtYXQ6IHN0cmluZztcbiAgICBsb2NhbGU6IHN0cmluZztcblxuICAgIGxvY2FsaXplZERhdGVQaXBlOiBMb2NhbGl6ZWREYXRlUGlwZTtcblxuICAgIGNvbnN0cnVjdG9yKGNhcmRWaWV3RGF0ZUl0ZW1Qcm9wZXJ0aWVzOiBDYXJkVmlld0RhdGVJdGVtUHJvcGVydGllcykge1xuICAgICAgICBzdXBlcihjYXJkVmlld0RhdGVJdGVtUHJvcGVydGllcyk7XG5cbiAgICAgICAgaWYgKGNhcmRWaWV3RGF0ZUl0ZW1Qcm9wZXJ0aWVzLmZvcm1hdCkge1xuICAgICAgICAgICAgdGhpcy5mb3JtYXQgPSBjYXJkVmlld0RhdGVJdGVtUHJvcGVydGllcy5mb3JtYXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2FyZFZpZXdEYXRlSXRlbVByb3BlcnRpZXMubG9jYWxlKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsZSA9IGNhcmRWaWV3RGF0ZUl0ZW1Qcm9wZXJ0aWVzLmxvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZ2V0IGRpc3BsYXlWYWx1ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2NhbGl6ZWREYXRlUGlwZSA9IG5ldyBMb2NhbGl6ZWREYXRlUGlwZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxpemVkRGF0ZVBpcGUudHJhbnNmb3JtKHRoaXMudmFsdWUsIHRoaXMuZm9ybWF0LCB0aGlzLmxvY2FsZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
