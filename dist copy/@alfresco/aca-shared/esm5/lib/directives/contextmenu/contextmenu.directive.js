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
import { Directive, HostListener, Input } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ContextMenu } from '@alfresco/aca-shared/store';
var ContextActionsDirective = /** @class */ (function() {
  function ContextActionsDirective(store) {
    this.store = store;
    this.execute$ = new Subject();
    this.onDestroy$ = new Subject();
    // tslint:disable-next-line:no-input-rename
    this.enabled = true;
  }
  /**
   * @param {?} event
   * @return {?}
   */
  ContextActionsDirective.prototype.onContextMenuEvent
  /**
   * @param {?} event
   * @return {?}
   */ = function(event) {
    if (event) {
      event.preventDefault();
      if (this.enabled) {
        /** @type {?} */
        var target = this.getTarget(event);
        if (target) {
          this.execute(event, target);
        }
      }
    }
  };
  /**
   * @return {?}
   */
  ContextActionsDirective.prototype.ngOnInit
  /**
   * @return {?}
   */ = function() {
    var _this = this;
    this.execute$
      .pipe(
        debounceTime(300),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function(event) {
        _this.store.dispatch(new ContextMenu(event));
      });
  };
  /**
   * @return {?}
   */
  ContextActionsDirective.prototype.ngOnDestroy
  /**
   * @return {?}
   */ = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  /**
   * @param {?} event
   * @param {?} target
   * @return {?}
   */
  ContextActionsDirective.prototype.execute
  /**
   * @param {?} event
   * @param {?} target
   * @return {?}
   */ = function(event, target) {
    if (!this.isSelected(target)) {
      target.dispatchEvent(new MouseEvent('click'));
    }
    this.execute$.next(event);
  };
  /**
   * @private
   * @param {?} event
   * @return {?}
   */
  ContextActionsDirective.prototype.getTarget
  /**
   * @private
   * @param {?} event
   * @return {?}
   */ = function(event) {
    return this.findAncestor(
      /** @type {?} */ (event.target),
      'adf-datatable-cell'
    );
  };
  /**
   * @private
   * @param {?} target
   * @return {?}
   */
  ContextActionsDirective.prototype.isSelected
  /**
   * @private
   * @param {?} target
   * @return {?}
   */ = function(target) {
    if (!target) {
      return false;
    }
    return this.findAncestor(target, 'adf-datatable-row').classList.contains(
      'adf-is-selected'
    );
  };
  /**
   * @private
   * @param {?} el
   * @param {?} className
   * @return {?}
   */
  ContextActionsDirective.prototype.findAncestor
  /**
   * @private
   * @param {?} el
   * @param {?} className
   * @return {?}
   */ = function(el, className) {
    if (el.classList.contains(className)) {
      return el;
    }
    // tslint:disable-next-line:curly
    while ((el = el.parentElement) && !el.classList.contains(className));
    return el;
  };
  ContextActionsDirective.decorators = [
    {
      type: Directive,
      args: [
        {
          selector: '[acaContextActions]',
          exportAs: 'acaContextActions'
        }
      ]
    }
  ];
  /** @nocollapse */
  ContextActionsDirective.ctorParameters = function() {
    return [{ type: Store }];
  };
  ContextActionsDirective.propDecorators = {
    enabled: [{ type: Input, args: ['acaContextEnable'] }],
    onContextMenuEvent: [
      { type: HostListener, args: ['contextmenu', ['$event']] }
    ]
  };
  return ContextActionsDirective;
})();
export { ContextActionsDirective };
if (false) {
  /**
   * @type {?}
   * @private
   */
  ContextActionsDirective.prototype.execute$;
  /** @type {?} */
  ContextActionsDirective.prototype.onDestroy$;
  /** @type {?} */
  ContextActionsDirective.prototype.enabled;
  /**
   * @type {?}
   * @private
   */
  ContextActionsDirective.prototype.store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dG1lbnUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FjYS1zaGFyZWQvIiwic291cmNlcyI6WyJsaWIvZGlyZWN0aXZlcy9jb250ZXh0bWVudS9jb250ZXh0bWVudS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBR04sTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDcEMsT0FBTyxFQUFZLFdBQVcsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRW5FO0lBMEJFLGlDQUFvQixLQUFzQjtRQUF0QixVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQXJCbEMsYUFBUSxHQUFpQixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQy9DLGVBQVUsR0FBcUIsSUFBSSxPQUFPLEVBQVcsQ0FBQzs7UUFJdEQsWUFBTyxHQUFHLElBQUksQ0FBQztJQWdCOEIsQ0FBQzs7Ozs7SUFiOUMsb0RBQWtCOzs7O0lBRGxCLFVBQ21CLEtBQWlCO1FBQ2xDLElBQUksS0FBSyxFQUFFO1lBQ1QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBRXZCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTs7b0JBQ1YsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO2dCQUNwQyxJQUFJLE1BQU0sRUFBRTtvQkFDVixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDN0I7YUFDRjtTQUNGO0lBQ0gsQ0FBQzs7OztJQUlELDBDQUFROzs7SUFBUjtRQUFBLGlCQVNDO1FBUkMsSUFBSSxDQUFDLFFBQVE7YUFDVixJQUFJLENBQ0gsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUNqQixTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUMzQjthQUNBLFNBQVMsQ0FBQyxVQUFDLEtBQWlCO1lBQzNCLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOzs7O0lBRUQsNkNBQVc7OztJQUFYO1FBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDOzs7Ozs7SUFFRCx5Q0FBTzs7Ozs7SUFBUCxVQUFRLEtBQWlCLEVBQUUsTUFBZTtRQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM1QixNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDL0M7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDOzs7Ozs7SUFFTywyQ0FBUzs7Ozs7SUFBakIsVUFBa0IsS0FBaUI7UUFDakMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFTLEtBQUssQ0FBQyxNQUFNLEVBQUEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7Ozs7OztJQUVPLDRDQUFVOzs7OztJQUFsQixVQUFtQixNQUFlO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQ3RFLGlCQUFpQixDQUNsQixDQUFDO0lBQ0osQ0FBQzs7Ozs7OztJQUVPLDhDQUFZOzs7Ozs7SUFBcEIsVUFBcUIsRUFBVyxFQUFFLFNBQWlCO1FBQ2pELElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDcEMsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELGlDQUFpQztRQUNqQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztZQUFDLENBQUM7UUFDckUsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDOztnQkF6RUYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFFBQVEsRUFBRSxtQkFBbUI7aUJBQzlCOzs7O2dCQU5RLEtBQUs7OzswQkFZWCxLQUFLLFNBQUMsa0JBQWtCO3FDQUd4QixZQUFZLFNBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDOztJQThEekMsOEJBQUM7Q0FBQSxBQTFFRCxJQTBFQztTQXRFWSx1QkFBdUI7Ozs7OztJQUNsQywyQ0FBK0M7O0lBQy9DLDZDQUFzRDs7SUFHdEQsMENBQ2U7Ozs7O0lBZ0JILHdDQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBBcHBTdG9yZSwgQ29udGV4dE1lbnUgfSBmcm9tICdAYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thY2FDb250ZXh0QWN0aW9uc10nLFxuICBleHBvcnRBczogJ2FjYUNvbnRleHRBY3Rpb25zJ1xufSlcbmV4cG9ydCBjbGFzcyBDb250ZXh0QWN0aW9uc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBleGVjdXRlJDogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTtcbiAgb25EZXN0cm95JDogU3ViamVjdDxib29sZWFuPiA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWlucHV0LXJlbmFtZVxuICBASW5wdXQoJ2FjYUNvbnRleHRFbmFibGUnKVxuICBlbmFibGVkID0gdHJ1ZTtcblxuICBASG9zdExpc3RlbmVyKCdjb250ZXh0bWVudScsIFsnJGV2ZW50J10pXG4gIG9uQ29udGV4dE1lbnVFdmVudChldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmdldFRhcmdldChldmVudCk7XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICB0aGlzLmV4ZWN1dGUoZXZlbnQsIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4pIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5leGVjdXRlJFxuICAgICAgLnBpcGUoXG4gICAgICAgIGRlYm91bmNlVGltZSgzMDApLFxuICAgICAgICB0YWtlVW50aWwodGhpcy5vbkRlc3Ryb3kkKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChuZXcgQ29udGV4dE1lbnUoZXZlbnQpKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5vbkRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgdGhpcy5vbkRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBleGVjdXRlKGV2ZW50OiBNb3VzZUV2ZW50LCB0YXJnZXQ6IEVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZCh0YXJnZXQpKSB7XG4gICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudCgnY2xpY2snKSk7XG4gICAgfVxuXG4gICAgdGhpcy5leGVjdXRlJC5uZXh0KGV2ZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VGFyZ2V0KGV2ZW50OiBNb3VzZUV2ZW50KTogRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuZmluZEFuY2VzdG9yKDxFbGVtZW50PmV2ZW50LnRhcmdldCwgJ2FkZi1kYXRhdGFibGUtY2VsbCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1NlbGVjdGVkKHRhcmdldDogRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZmluZEFuY2VzdG9yKHRhcmdldCwgJ2FkZi1kYXRhdGFibGUtcm93JykuY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgJ2FkZi1pcy1zZWxlY3RlZCdcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQW5jZXN0b3IoZWw6IEVsZW1lbnQsIGNsYXNzTmFtZTogc3RyaW5nKTogRWxlbWVudCB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjdXJseVxuICAgIHdoaWxlICgoZWwgPSBlbC5wYXJlbnRFbGVtZW50KSAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpO1xuICAgIHJldHVybiBlbDtcbiAgfVxufVxuIl19
