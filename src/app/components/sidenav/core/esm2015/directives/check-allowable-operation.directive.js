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
/* tslint:disable:no-input-rename  */
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Host,
  Inject,
  Input,
  Optional,
  Renderer2
} from '@angular/core';
import { ContentService } from './../services/content.service';
import { EXTENDIBLE_COMPONENT } from './../interface/injection.tokens';
/**
 * @record
 */
export function NodeAllowableOperationSubject() {}
if (false) {
  /** @type {?} */
  NodeAllowableOperationSubject.prototype.disabled;
}
export class CheckAllowableOperationDirective {
  /**
   * @param {?} elementRef
   * @param {?} renderer
   * @param {?} contentService
   * @param {?} changeDetector
   * @param {?=} parentComponent
   */
  constructor(
    elementRef,
    renderer,
    contentService,
    changeDetector,
    parentComponent
  ) {
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.contentService = contentService;
    this.changeDetector = changeDetector;
    this.parentComponent = parentComponent;
    /**
     * Node permission to check (create, delete, update, updatePermissions,
     * !create, !delete, !update, !updatePermissions).
     */
    this.permission = null;
    /**
     * Nodes to check permission for.
     */
    this.nodes = [];
  }
  /**
   * @param {?} changes
   * @return {?}
   */
  ngOnChanges(changes) {
    if (changes.nodes && !changes.nodes.firstChange) {
      this.updateElement();
    }
  }
  /**
   * Updates disabled state for the decorated element
   *
   * \@memberof CheckAllowableOperationDirective
   * @return {?}
   */
  updateElement() {
    /** @type {?} */
    const enable = this.hasAllowableOperations(this.nodes, this.permission);
    if (enable) {
      this.enable();
    } else {
      this.disable();
    }
    return enable;
  }
  /**
   * @private
   * @return {?}
   */
  enable() {
    if (this.parentComponent) {
      this.parentComponent.disabled = false;
      this.changeDetector.detectChanges();
    } else {
      this.enableElement();
    }
  }
  /**
   * @private
   * @return {?}
   */
  disable() {
    if (this.parentComponent) {
      this.parentComponent.disabled = true;
      this.changeDetector.detectChanges();
    } else {
      this.disableElement();
    }
  }
  /**
   * Enables decorated element
   *
   * \@memberof CheckAllowableOperationDirective
   * @return {?}
   */
  enableElement() {
    this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
  }
  /**
   * Disables decorated element
   *
   * \@memberof CheckAllowableOperationDirective
   * @return {?}
   */
  disableElement() {
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'disabled',
      'true'
    );
  }
  /**
   * Checks whether all nodes have a particular permission
   *
   * \@memberof CheckAllowableOperationDirective
   * @param {?} nodes Node collection to check
   * @param {?} permission Permission to check for each node
   * @return {?}
   */
  hasAllowableOperations(nodes, permission) {
    if (nodes && nodes.length > 0) {
      return nodes.every(
        /**
         * @param {?} node
         * @return {?}
         */
        node =>
          this.contentService.hasAllowableOperations(node.entry, permission)
      );
    }
    return false;
  }
}
CheckAllowableOperationDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: '[adf-check-allowable-operation]'
      }
    ]
  }
];
/** @nocollapse */
CheckAllowableOperationDirective.ctorParameters = () => [
  { type: ElementRef },
  { type: Renderer2 },
  { type: ContentService },
  { type: ChangeDetectorRef },
  {
    type: undefined,
    decorators: [
      { type: Host },
      { type: Optional },
      { type: Inject, args: [EXTENDIBLE_COMPONENT] }
    ]
  }
];
CheckAllowableOperationDirective.propDecorators = {
  permission: [{ type: Input, args: ['adf-check-allowable-operation'] }],
  nodes: [{ type: Input, args: ['adf-nodes'] }]
};
if (false) {
  /**
   * Node permission to check (create, delete, update, updatePermissions,
   * !create, !delete, !update, !updatePermissions).
   * @type {?}
   */
  CheckAllowableOperationDirective.prototype.permission;
  /**
   * Nodes to check permission for.
   * @type {?}
   */
  CheckAllowableOperationDirective.prototype.nodes;
  /**
   * @type {?}
   * @private
   */
  CheckAllowableOperationDirective.prototype.elementRef;
  /**
   * @type {?}
   * @private
   */
  CheckAllowableOperationDirective.prototype.renderer;
  /**
   * @type {?}
   * @private
   */
  CheckAllowableOperationDirective.prototype.contentService;
  /**
   * @type {?}
   * @private
   */
  CheckAllowableOperationDirective.prototype.changeDetector;
  /**
   * @type {?}
   * @private
   */
  CheckAllowableOperationDirective.prototype.parentComponent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stYWxsb3dhYmxlLW9wZXJhdGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkaXJlY3RpdmVzL2NoZWNrLWFsbG93YWJsZS1vcGVyYXRpb24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBYSxRQUFRLEVBQUUsU0FBUyxFQUFrQixNQUFNLGVBQWUsQ0FBQztBQUU5SSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDL0QsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7Ozs7QUFFdkUsbURBRUM7OztJQURHLGlEQUFrQjs7QUFNdEIsTUFBTSxPQUFPLGdDQUFnQzs7Ozs7Ozs7SUFZekMsWUFBb0IsVUFBc0IsRUFDdEIsUUFBbUIsRUFDbkIsY0FBOEIsRUFDOUIsY0FBaUMsRUFJSCxlQUErQztRQVA3RSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLG1CQUFjLEdBQWQsY0FBYyxDQUFtQjtRQUlILG9CQUFlLEdBQWYsZUFBZSxDQUFnQzs7Ozs7UUFiakcsZUFBVSxHQUFZLElBQUksQ0FBQzs7OztRQUkzQixVQUFLLEdBQWdCLEVBQUUsQ0FBQztJQVV4QixDQUFDOzs7OztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUM3QyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEI7SUFDTCxDQUFDOzs7Ozs7O0lBT0QsYUFBYTs7Y0FDSCxNQUFNLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUV2RSxJQUFJLE1BQU0sRUFBRTtZQUNSLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNqQjthQUFNO1lBQ0gsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2xCO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7Ozs7SUFFTyxNQUFNO1FBQ1YsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3ZDO2FBQU07WUFDSCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEI7SUFDTCxDQUFDOzs7OztJQUVPLE9BQU87UUFDWCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdkM7YUFBTTtZQUNILElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUN6QjtJQUNMLENBQUM7Ozs7Ozs7SUFPRCxhQUFhO1FBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDN0UsQ0FBQzs7Ozs7OztJQU9ELGNBQWM7UUFDVixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEYsQ0FBQzs7Ozs7Ozs7O0lBU0Qsc0JBQXNCLENBQUMsS0FBa0IsRUFBRSxVQUFrQjtRQUN6RCxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMzQixPQUFPLEtBQUssQ0FBQyxLQUFLOzs7O1lBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBQyxDQUFDO1NBQ3BHO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7O1lBakdKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsaUNBQWlDO2FBQzlDOzs7O1lBWHNDLFVBQVU7WUFBNEMsU0FBUztZQUU3RixjQUFjO1lBRmQsaUJBQWlCOzRDQTZCVCxJQUFJLFlBQ0osUUFBUSxZQUNSLE1BQU0sU0FBQyxvQkFBb0I7Ozt5QkFkdkMsS0FBSyxTQUFDLCtCQUErQjtvQkFJckMsS0FBSyxTQUFDLFdBQVc7Ozs7Ozs7O0lBSmxCLHNEQUMyQjs7Ozs7SUFHM0IsaURBQ3dCOzs7OztJQUVaLHNEQUE4Qjs7Ozs7SUFDOUIsb0RBQTJCOzs7OztJQUMzQiwwREFBc0M7Ozs7O0lBQ3RDLDBEQUF5Qzs7Ozs7SUFFekMsMkRBRXFGIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyogdHNsaW50OmRpc2FibGU6bm8taW5wdXQtcmVuYW1lICAqL1xuXG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0LCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9wdGlvbmFsLCBSZW5kZXJlcjIsICBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOb2RlRW50cnkgfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcbmltcG9ydCB7IENvbnRlbnRTZXJ2aWNlIH0gZnJvbSAnLi8uLi9zZXJ2aWNlcy9jb250ZW50LnNlcnZpY2UnO1xuaW1wb3J0IHsgRVhURU5ESUJMRV9DT01QT05FTlQgfSBmcm9tICcuLy4uL2ludGVyZmFjZS9pbmplY3Rpb24udG9rZW5zJztcblxuZXhwb3J0IGludGVyZmFjZSBOb2RlQWxsb3dhYmxlT3BlcmF0aW9uU3ViamVjdCB7XG4gICAgZGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2FkZi1jaGVjay1hbGxvd2FibGUtb3BlcmF0aW9uXSdcbn0pXG5leHBvcnQgY2xhc3MgQ2hlY2tBbGxvd2FibGVPcGVyYXRpb25EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gICAgLyoqIE5vZGUgcGVybWlzc2lvbiB0byBjaGVjayAoY3JlYXRlLCBkZWxldGUsIHVwZGF0ZSwgdXBkYXRlUGVybWlzc2lvbnMsXG4gICAgICogIWNyZWF0ZSwgIWRlbGV0ZSwgIXVwZGF0ZSwgIXVwZGF0ZVBlcm1pc3Npb25zKS5cbiAgICAgKi9cbiAgICBASW5wdXQoJ2FkZi1jaGVjay1hbGxvd2FibGUtb3BlcmF0aW9uJylcbiAgICBwZXJtaXNzaW9uOiBzdHJpbmcgID0gbnVsbDtcblxuICAgIC8qKiBOb2RlcyB0byBjaGVjayBwZXJtaXNzaW9uIGZvci4gKi9cbiAgICBASW5wdXQoJ2FkZi1ub2RlcycpXG4gICAgbm9kZXM6IE5vZGVFbnRyeVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgY29udGVudFNlcnZpY2U6IENvbnRlbnRTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuXG4gICAgICAgICAgICAgICAgQEhvc3QoKVxuICAgICAgICAgICAgICAgIEBPcHRpb25hbCgpXG4gICAgICAgICAgICAgICAgQEluamVjdChFWFRFTkRJQkxFX0NPTVBPTkVOVCkgcHJpdmF0ZSBwYXJlbnRDb21wb25lbnQ/OiBOb2RlQWxsb3dhYmxlT3BlcmF0aW9uU3ViamVjdCkge1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKGNoYW5nZXMubm9kZXMgJiYgIWNoYW5nZXMubm9kZXMuZmlyc3RDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBkaXNhYmxlZCBzdGF0ZSBmb3IgdGhlIGRlY29yYXRlZCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgQ2hlY2tBbGxvd2FibGVPcGVyYXRpb25EaXJlY3RpdmVcbiAgICAgKi9cbiAgICB1cGRhdGVFbGVtZW50KCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBlbmFibGUgPSB0aGlzLmhhc0FsbG93YWJsZU9wZXJhdGlvbnModGhpcy5ub2RlcywgdGhpcy5wZXJtaXNzaW9uKTtcblxuICAgICAgICBpZiAoZW5hYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmVuYWJsZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZW5hYmxlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZW5hYmxlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50Q29tcG9uZW50LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlRWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkaXNhYmxlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50Q29tcG9uZW50LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlRWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5hYmxlcyBkZWNvcmF0ZWQgZWxlbWVudFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIENoZWNrQWxsb3dhYmxlT3BlcmF0aW9uRGlyZWN0aXZlXG4gICAgICovXG4gICAgZW5hYmxlRWxlbWVudCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpc2FibGVzIGRlY29yYXRlZCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgQ2hlY2tBbGxvd2FibGVPcGVyYXRpb25EaXJlY3RpdmVcbiAgICAgKi9cbiAgICBkaXNhYmxlRWxlbWVudCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsICd0cnVlJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgYWxsIG5vZGVzIGhhdmUgYSBwYXJ0aWN1bGFyIHBlcm1pc3Npb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSAgbm9kZXMgTm9kZSBjb2xsZWN0aW9uIHRvIGNoZWNrXG4gICAgICogQHBhcmFtICBwZXJtaXNzaW9uIFBlcm1pc3Npb24gdG8gY2hlY2sgZm9yIGVhY2ggbm9kZVxuICAgICAqIEBtZW1iZXJvZiBDaGVja0FsbG93YWJsZU9wZXJhdGlvbkRpcmVjdGl2ZVxuICAgICAqL1xuICAgIGhhc0FsbG93YWJsZU9wZXJhdGlvbnMobm9kZXM6IE5vZGVFbnRyeVtdLCBwZXJtaXNzaW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKG5vZGVzICYmIG5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBub2Rlcy5ldmVyeSgobm9kZSkgPT4gdGhpcy5jb250ZW50U2VydmljZS5oYXNBbGxvd2FibGVPcGVyYXRpb25zKG5vZGUuZW50cnksIHBlcm1pc3Npb24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG4iXX0=
