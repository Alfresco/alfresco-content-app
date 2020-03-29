/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from 'tslib';
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
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AppActionTypes } from '../actions/app.actions';
var DialogEffects = /** @class */ (function() {
  function DialogEffects(actions$, matDialog) {
    var _this = this;
    this.actions$ = actions$;
    this.matDialog = matDialog;
    this.closeAll$ = this.actions$.pipe(
      ofType(AppActionTypes.CloseModalDialogs),
      map(function() {
        return _this.matDialog.closeAll();
      })
    );
  }
  DialogEffects.decorators = [{ type: Injectable }];
  /** @nocollapse */
  DialogEffects.ctorParameters = function() {
    return [{ type: Actions }, { type: MatDialog }];
  };
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    DialogEffects.prototype,
    'closeAll$',
    void 0
  );
  return DialogEffects;
})();
export { DialogEffects };
if (false) {
  /** @type {?} */
  DialogEffects.prototype.closeAll$;
  /**
   * @type {?}
   * @private
   */
  DialogEffects.prototype.actions$;
  /**
   * @type {?}
   * @private
   */
  DialogEffects.prototype.matDialog;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmVmZmVjdHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZS8iLCJzb3VyY2VzIjpbImVmZmVjdHMvZGlhbG9nLmVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNyRCxPQUFPLEVBRUwsY0FBYyxFQUNmLE1BQU0sd0JBQXdCLENBQUM7QUFFaEM7SUFFRSx1QkFBb0IsUUFBaUIsRUFBVSxTQUFvQjtRQUFuRSxpQkFBdUU7UUFBbkQsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUFVLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFHbkUsY0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUM1QixNQUFNLENBQTBCLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUNqRSxHQUFHLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQXpCLENBQXlCLENBQUMsQ0FDckMsQ0FBQztJQU5vRSxDQUFDOztnQkFGeEUsVUFBVTs7OztnQkFUTSxPQUFPO2dCQUdmLFNBQVM7O0lBV2hCO1FBREMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDOztvREFJMUI7SUFDSixvQkFBQztDQUFBLEFBVEQsSUFTQztTQVJZLGFBQWE7OztJQUd4QixrQ0FJRTs7Ozs7SUFOVSxpQ0FBeUI7Ozs7O0lBQUUsa0NBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBFZmZlY3QsIEFjdGlvbnMsIG9mVHlwZSB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgTWF0RGlhbG9nIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcbmltcG9ydCB7XG4gIENsb3NlTW9kYWxEaWFsb2dzQWN0aW9uLFxuICBBcHBBY3Rpb25UeXBlc1xufSBmcm9tICcuLi9hY3Rpb25zL2FwcC5hY3Rpb25zJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERpYWxvZ0VmZmVjdHMge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjdGlvbnMkOiBBY3Rpb25zLCBwcml2YXRlIG1hdERpYWxvZzogTWF0RGlhbG9nKSB7fVxuXG4gIEBFZmZlY3QoeyBkaXNwYXRjaDogZmFsc2UgfSlcbiAgY2xvc2VBbGwkID0gdGhpcy5hY3Rpb25zJC5waXBlKFxuICAgIG9mVHlwZTxDbG9zZU1vZGFsRGlhbG9nc0FjdGlvbj4oQXBwQWN0aW9uVHlwZXMuQ2xvc2VNb2RhbERpYWxvZ3MpLFxuICAgIG1hcCgoKSA9PiB0aGlzLm1hdERpYWxvZy5jbG9zZUFsbCgpKVxuICApO1xufVxuIl19
