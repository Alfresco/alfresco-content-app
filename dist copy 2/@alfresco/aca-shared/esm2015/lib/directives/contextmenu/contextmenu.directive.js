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
export class ContextActionsDirective {
  /**
   * @param {?} store
   */
  constructor(store) {
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
  onContextMenuEvent(event) {
    if (event) {
      event.preventDefault();
      if (this.enabled) {
        /** @type {?} */
        const target = this.getTarget(event);
        if (target) {
          this.execute(event, target);
        }
      }
    }
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.execute$
      .pipe(
        debounceTime(300),
        takeUntil(this.onDestroy$)
      )
      .subscribe(event => {
        this.store.dispatch(new ContextMenu(event));
      });
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  /**
   * @param {?} event
   * @param {?} target
   * @return {?}
   */
  execute(event, target) {
    if (!this.isSelected(target)) {
      target.dispatchEvent(new MouseEvent('click'));
    }
    this.execute$.next(event);
  }
  /**
   * @private
   * @param {?} event
   * @return {?}
   */
  getTarget(event) {
    return this.findAncestor(
      /** @type {?} */ (event.target),
      'adf-datatable-cell'
    );
  }
  /**
   * @private
   * @param {?} target
   * @return {?}
   */
  isSelected(target) {
    if (!target) {
      return false;
    }
    return this.findAncestor(target, 'adf-datatable-row').classList.contains(
      'adf-is-selected'
    );
  }
  /**
   * @private
   * @param {?} el
   * @param {?} className
   * @return {?}
   */
  findAncestor(el, className) {
    if (el.classList.contains(className)) {
      return el;
    }
    // tslint:disable-next-line:curly
    while ((el = el.parentElement) && !el.classList.contains(className));
    return el;
  }
}
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
ContextActionsDirective.ctorParameters = () => [{ type: Store }];
ContextActionsDirective.propDecorators = {
  enabled: [{ type: Input, args: ['acaContextEnable'] }],
  onContextMenuEvent: [
    { type: HostListener, args: ['contextmenu', ['$event']] }
  ]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dG1lbnUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FjYS1zaGFyZWQvIiwic291cmNlcyI6WyJsaWIvZGlyZWN0aXZlcy9jb250ZXh0bWVudS9jb250ZXh0bWVudS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBR04sTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDcEMsT0FBTyxFQUFZLFdBQVcsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBTW5FLE1BQU0sT0FBTyx1QkFBdUI7Ozs7SUFzQmxDLFlBQW9CLEtBQXNCO1FBQXRCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBckJsQyxhQUFRLEdBQWlCLElBQUksT0FBTyxFQUFFLENBQUM7UUFDL0MsZUFBVSxHQUFxQixJQUFJLE9BQU8sRUFBVyxDQUFDOztRQUl0RCxZQUFPLEdBQUcsSUFBSSxDQUFDO0lBZ0I4QixDQUFDOzs7OztJQWI5QyxrQkFBa0IsQ0FBQyxLQUFpQjtRQUNsQyxJQUFJLEtBQUssRUFBRTtZQUNULEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUV2QixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7O3NCQUNWLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDcEMsSUFBSSxNQUFNLEVBQUU7b0JBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQzdCO2FBQ0Y7U0FDRjtJQUNILENBQUM7Ozs7SUFJRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFFBQVE7YUFDVixJQUFJLENBQ0gsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUNqQixTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUMzQjthQUNBLFNBQVMsQ0FBQyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdCLENBQUM7Ozs7OztJQUVELE9BQU8sQ0FBQyxLQUFpQixFQUFFLE1BQWU7UUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDNUIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQy9DO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7Ozs7O0lBRU8sU0FBUyxDQUFDLEtBQWlCO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBUyxLQUFLLENBQUMsTUFBTSxFQUFBLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUN4RSxDQUFDOzs7Ozs7SUFFTyxVQUFVLENBQUMsTUFBZTtRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUN0RSxpQkFBaUIsQ0FDbEIsQ0FBQztJQUNKLENBQUM7Ozs7Ozs7SUFFTyxZQUFZLENBQUMsRUFBVyxFQUFFLFNBQWlCO1FBQ2pELElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDcEMsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELGlDQUFpQztRQUNqQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztZQUFDLENBQUM7UUFDckUsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDOzs7WUF6RUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLFFBQVEsRUFBRSxtQkFBbUI7YUFDOUI7Ozs7WUFOUSxLQUFLOzs7c0JBWVgsS0FBSyxTQUFDLGtCQUFrQjtpQ0FHeEIsWUFBWSxTQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7Ozs7OztJQVB2QywyQ0FBK0M7O0lBQy9DLDZDQUFzRDs7SUFHdEQsMENBQ2U7Ozs7O0lBZ0JILHdDQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBBcHBTdG9yZSwgQ29udGV4dE1lbnUgfSBmcm9tICdAYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thY2FDb250ZXh0QWN0aW9uc10nLFxuICBleHBvcnRBczogJ2FjYUNvbnRleHRBY3Rpb25zJ1xufSlcbmV4cG9ydCBjbGFzcyBDb250ZXh0QWN0aW9uc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBleGVjdXRlJDogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTtcbiAgb25EZXN0cm95JDogU3ViamVjdDxib29sZWFuPiA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWlucHV0LXJlbmFtZVxuICBASW5wdXQoJ2FjYUNvbnRleHRFbmFibGUnKVxuICBlbmFibGVkID0gdHJ1ZTtcblxuICBASG9zdExpc3RlbmVyKCdjb250ZXh0bWVudScsIFsnJGV2ZW50J10pXG4gIG9uQ29udGV4dE1lbnVFdmVudChldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmdldFRhcmdldChldmVudCk7XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICB0aGlzLmV4ZWN1dGUoZXZlbnQsIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4pIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5leGVjdXRlJFxuICAgICAgLnBpcGUoXG4gICAgICAgIGRlYm91bmNlVGltZSgzMDApLFxuICAgICAgICB0YWtlVW50aWwodGhpcy5vbkRlc3Ryb3kkKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChuZXcgQ29udGV4dE1lbnUoZXZlbnQpKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5vbkRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgdGhpcy5vbkRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBleGVjdXRlKGV2ZW50OiBNb3VzZUV2ZW50LCB0YXJnZXQ6IEVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZCh0YXJnZXQpKSB7XG4gICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudCgnY2xpY2snKSk7XG4gICAgfVxuXG4gICAgdGhpcy5leGVjdXRlJC5uZXh0KGV2ZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VGFyZ2V0KGV2ZW50OiBNb3VzZUV2ZW50KTogRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuZmluZEFuY2VzdG9yKDxFbGVtZW50PmV2ZW50LnRhcmdldCwgJ2FkZi1kYXRhdGFibGUtY2VsbCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1NlbGVjdGVkKHRhcmdldDogRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZmluZEFuY2VzdG9yKHRhcmdldCwgJ2FkZi1kYXRhdGFibGUtcm93JykuY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgJ2FkZi1pcy1zZWxlY3RlZCdcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQW5jZXN0b3IoZWw6IEVsZW1lbnQsIGNsYXNzTmFtZTogc3RyaW5nKTogRWxlbWVudCB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjdXJseVxuICAgIHdoaWxlICgoZWwgPSBlbC5wYXJlbnRFbGVtZW50KSAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpO1xuICAgIHJldHVybiBlbDtcbiAgfVxufVxuIl19
