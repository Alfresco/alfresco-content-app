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
/* tslint:disable:component-selector  */
import { ContainerModel } from './../core/container.model';
import { FormFieldTypes } from './../core/form-field-types';
export class ContainerWidgetComponentModel extends ContainerModel {
  /**
   * @param {?} field
   */
  constructor(field) {
    super(field);
    this.columns = [];
    this.isExpanded = true;
    this.rowspan = 1;
    this.colspan = 1;
    if (this.field) {
      this.columns = this.field.columns || [];
      this.isExpanded = !this.isCollapsedByDefault();
      this.colspan = field.colspan;
      this.rowspan = field.rowspan;
    }
  }
  /**
   * @return {?}
   */
  isGroup() {
    return this.type === FormFieldTypes.GROUP;
  }
  /**
   * @return {?}
   */
  isCollapsible() {
    /** @type {?} */
    let allowCollapse = false;
    if (this.isGroup() && this.field.params['allowCollapse']) {
      allowCollapse = /** @type {?} */ (this.field.params['allowCollapse']);
    }
    return allowCollapse;
  }
  /**
   * @return {?}
   */
  isCollapsedByDefault() {
    /** @type {?} */
    let collapseByDefault = false;
    if (this.isCollapsible() && this.field.params['collapseByDefault']) {
      collapseByDefault = /** @type {?} */ (this.field.params[
        'collapseByDefault'
      ]);
    }
    return collapseByDefault;
  }
}
if (false) {
  /** @type {?} */
  ContainerWidgetComponentModel.prototype.columns;
  /** @type {?} */
  ContainerWidgetComponentModel.prototype.isExpanded;
  /** @type {?} */
  ContainerWidgetComponentModel.prototype.rowspan;
  /** @type {?} */
  ContainerWidgetComponentModel.prototype.colspan;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLndpZGdldC5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImZvcm0vY29tcG9uZW50cy93aWRnZXRzL2NvbnRhaW5lci9jb250YWluZXIud2lkZ2V0Lm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRzVELE1BQU0sT0FBTyw2QkFBOEIsU0FBUSxjQUFjOzs7O0lBK0I3RCxZQUFZLEtBQXFCO1FBQzdCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQTlCakIsWUFBTyxHQUEyQixFQUFFLENBQUM7UUFDckMsZUFBVSxHQUFZLElBQUksQ0FBQztRQUMzQixZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCLFlBQU8sR0FBVyxDQUFDLENBQUM7UUE2QmhCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNaLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUMvQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQzs7OztJQWpDRCxPQUFPO1FBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLGNBQWMsQ0FBQyxLQUFLLENBQUM7SUFDOUMsQ0FBQzs7OztJQUVELGFBQWE7O1lBQ0wsYUFBYSxHQUFHLEtBQUs7UUFFekIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDdEQsYUFBYSxHQUFHLG1CQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxFQUFBLENBQUM7U0FDaEU7UUFFRCxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDOzs7O0lBRUQsb0JBQW9COztZQUNaLGlCQUFpQixHQUFHLEtBQUs7UUFFN0IsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsRUFBRTtZQUNoRSxpQkFBaUIsR0FBRyxtQkFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFBLENBQUM7U0FDeEU7UUFFRCxPQUFPLGlCQUFpQixDQUFDO0lBQzdCLENBQUM7Q0FZSjs7O0lBdkNHLGdEQUFxQzs7SUFDckMsbURBQTJCOztJQUMzQixnREFBb0I7O0lBQ3BCLGdEQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qIHRzbGludDpkaXNhYmxlOmNvbXBvbmVudC1zZWxlY3RvciAgKi9cblxuaW1wb3J0IHsgQ29udGFpbmVyQ29sdW1uTW9kZWwgfSBmcm9tICcuLy4uL2NvcmUvY29udGFpbmVyLWNvbHVtbi5tb2RlbCc7XG5pbXBvcnQgeyBDb250YWluZXJNb2RlbCB9IGZyb20gJy4vLi4vY29yZS9jb250YWluZXIubW9kZWwnO1xuaW1wb3J0IHsgRm9ybUZpZWxkVHlwZXMgfSBmcm9tICcuLy4uL2NvcmUvZm9ybS1maWVsZC10eXBlcyc7XG5pbXBvcnQgeyBGb3JtRmllbGRNb2RlbCB9IGZyb20gJy4vLi4vY29yZS9mb3JtLWZpZWxkLm1vZGVsJztcblxuZXhwb3J0IGNsYXNzIENvbnRhaW5lcldpZGdldENvbXBvbmVudE1vZGVsIGV4dGVuZHMgQ29udGFpbmVyTW9kZWwge1xuXG4gICAgY29sdW1uczogQ29udGFpbmVyQ29sdW1uTW9kZWxbXSA9IFtdO1xuICAgIGlzRXhwYW5kZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHJvd3NwYW46IG51bWJlciA9IDE7XG4gICAgY29sc3BhbjogbnVtYmVyID0gMTtcblxuICAgIGlzR3JvdXAoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09IEZvcm1GaWVsZFR5cGVzLkdST1VQO1xuICAgIH1cblxuICAgIGlzQ29sbGFwc2libGUoKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBhbGxvd0NvbGxhcHNlID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNHcm91cCgpICYmIHRoaXMuZmllbGQucGFyYW1zWydhbGxvd0NvbGxhcHNlJ10pIHtcbiAgICAgICAgICAgIGFsbG93Q29sbGFwc2UgPSA8Ym9vbGVhbj4gdGhpcy5maWVsZC5wYXJhbXNbJ2FsbG93Q29sbGFwc2UnXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGxvd0NvbGxhcHNlO1xuICAgIH1cblxuICAgIGlzQ29sbGFwc2VkQnlEZWZhdWx0KCk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgY29sbGFwc2VCeURlZmF1bHQgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5pc0NvbGxhcHNpYmxlKCkgJiYgdGhpcy5maWVsZC5wYXJhbXNbJ2NvbGxhcHNlQnlEZWZhdWx0J10pIHtcbiAgICAgICAgICAgIGNvbGxhcHNlQnlEZWZhdWx0ID0gPGJvb2xlYW4+IHRoaXMuZmllbGQucGFyYW1zWydjb2xsYXBzZUJ5RGVmYXVsdCddO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbGxhcHNlQnlEZWZhdWx0O1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGZpZWxkOiBGb3JtRmllbGRNb2RlbCkge1xuICAgICAgICBzdXBlcihmaWVsZCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHtcbiAgICAgICAgICAgIHRoaXMuY29sdW1ucyA9IHRoaXMuZmllbGQuY29sdW1ucyB8fCBbXTtcbiAgICAgICAgICAgIHRoaXMuaXNFeHBhbmRlZCA9ICF0aGlzLmlzQ29sbGFwc2VkQnlEZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmNvbHNwYW4gPSBmaWVsZC5jb2xzcGFuO1xuICAgICAgICAgICAgdGhpcy5yb3dzcGFuID0gZmllbGQucm93c3BhbjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
