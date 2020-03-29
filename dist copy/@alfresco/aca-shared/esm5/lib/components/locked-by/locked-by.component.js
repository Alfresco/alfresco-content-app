/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
var LockedByComponent = /** @class */ (function() {
  function LockedByComponent() {}
  /**
   * @return {?}
   */
  LockedByComponent.prototype.ngOnInit
  /**
   * @return {?}
   */ = function() {
    this.node = this.context.row.node;
  };
  /**
   * @return {?}
   */
  LockedByComponent.prototype.writeLockedBy
  /**
   * @return {?}
   */ = function() {
    return (
      this.node &&
      this.node.entry.properties &&
      this.node.entry.properties['cm:lockOwner'] &&
      this.node.entry.properties['cm:lockOwner'].displayName
    );
  };
  LockedByComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'aca-locked-by',
          template:
            '\n    <mat-icon class="locked_by--icon">lock</mat-icon>\n    <span class="locked_by--name">{{ writeLockedBy() }}</span>\n  ',
          changeDetection: ChangeDetectionStrategy.OnPush,
          encapsulation: ViewEncapsulation.None,
          host: {
            class: 'aca-locked-by'
          },
          styles: [
            '.aca-locked-by{display:flex;align-items:center;padding:0 10px;color:var(--theme-text-color,rgba(0,0,0,.54))}.aca-locked-by .locked_by--icon{font-size:14px;width:14px;height:14px}.aca-locked-by .locked_by--name{font-size:12px;padding:0 2px}'
          ]
        }
      ]
    }
  ];
  /** @nocollapse */
  LockedByComponent.ctorParameters = function() {
    return [];
  };
  LockedByComponent.propDecorators = {
    context: [{ type: Input }]
  };
  return LockedByComponent;
})();
export { LockedByComponent };
if (false) {
  /** @type {?} */
  LockedByComponent.prototype.context;
  /** @type {?} */
  LockedByComponent.prototype.node;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ja2VkLWJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvbG9ja2VkLWJ5L2xvY2tlZC1ieS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBSXZCO0lBbUJFO0lBQWUsQ0FBQzs7OztJQUVoQixvQ0FBUTs7O0lBQVI7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztJQUNwQyxDQUFDOzs7O0lBRUQseUNBQWE7OztJQUFiO1FBQ0UsT0FBTyxDQUNMLElBQUksQ0FBQyxJQUFJO1lBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTtZQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1lBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQ3ZELENBQUM7SUFDSixDQUFDOztnQkFoQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsaUlBR1Q7b0JBRUQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLGVBQWU7cUJBQ3ZCOztpQkFDRjs7Ozs7MEJBRUUsS0FBSzs7SUFtQlIsd0JBQUM7Q0FBQSxBQWpDRCxJQWlDQztTQXBCWSxpQkFBaUI7OztJQUM1QixvQ0FDYTs7SUFFYixpQ0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE9uSW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBOb2RlRW50cnkgfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWNhLWxvY2tlZC1ieScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG1hdC1pY29uIGNsYXNzPVwibG9ja2VkX2J5LS1pY29uXCI+bG9jazwvbWF0LWljb24+XG4gICAgPHNwYW4gY2xhc3M9XCJsb2NrZWRfYnktLW5hbWVcIj57eyB3cml0ZUxvY2tlZEJ5KCkgfX08L3NwYW4+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuL2xvY2tlZC1ieS5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnYWNhLWxvY2tlZC1ieSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBMb2NrZWRCeUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpXG4gIGNvbnRleHQ6IGFueTtcblxuICBub2RlOiBOb2RlRW50cnk7XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubm9kZSA9IHRoaXMuY29udGV4dC5yb3cubm9kZTtcbiAgfVxuXG4gIHdyaXRlTG9ja2VkQnkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMubm9kZSAmJlxuICAgICAgdGhpcy5ub2RlLmVudHJ5LnByb3BlcnRpZXMgJiZcbiAgICAgIHRoaXMubm9kZS5lbnRyeS5wcm9wZXJ0aWVzWydjbTpsb2NrT3duZXInXSAmJlxuICAgICAgdGhpcy5ub2RlLmVudHJ5LnByb3BlcnRpZXNbJ2NtOmxvY2tPd25lciddLmRpc3BsYXlOYW1lXG4gICAgKTtcbiAgfVxufVxuIl19
