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
import { TranslationService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { SnackbarActionTypes } from '../actions/snackbar.actions';
var SnackbarEffects = /** @class */ (function() {
  function SnackbarEffects(store, actions$, snackBar, translationService) {
    var _this = this;
    this.store = store;
    this.actions$ = actions$;
    this.snackBar = snackBar;
    this.translationService = translationService;
    this.infoEffect = this.actions$.pipe(
      ofType(SnackbarActionTypes.Info),
      map(function(action) {
        _this.showSnackBar(action, 'info-snackbar');
      })
    );
    this.warningEffect = this.actions$.pipe(
      ofType(SnackbarActionTypes.Warning),
      map(function(action) {
        _this.showSnackBar(action, 'warning-snackbar');
      })
    );
    this.errorEffect = this.actions$.pipe(
      ofType(SnackbarActionTypes.Error),
      map(function(action) {
        _this.showSnackBar(action, 'error-snackbar');
      })
    );
  }
  /**
   * @private
   * @param {?} action
   * @param {?} panelClass
   * @return {?}
   */
  SnackbarEffects.prototype.showSnackBar
  /**
   * @private
   * @param {?} action
   * @param {?} panelClass
   * @return {?}
   */ = function(action, panelClass) {
    var _this = this;
    /** @type {?} */
    var message = this.translate(action.payload, action.params);
    /** @type {?} */
    var actionName = null;
    if (action.userAction) {
      actionName = this.translate(action.userAction.title);
    }
    /** @type {?} */
    var snackBarRef = this.snackBar.open(message, actionName, {
      duration: action.duration || 4000,
      panelClass: panelClass
    });
    if (action.userAction) {
      snackBarRef.onAction().subscribe(function() {
        _this.store.dispatch(action.userAction.action);
      });
    }
  };
  /**
   * @private
   * @param {?} message
   * @param {?=} params
   * @return {?}
   */
  SnackbarEffects.prototype.translate
  /**
   * @private
   * @param {?} message
   * @param {?=} params
   * @return {?}
   */ = function(message, params) {
    return this.translationService.instant(message, params);
  };
  SnackbarEffects.decorators = [{ type: Injectable }];
  /** @nocollapse */
  SnackbarEffects.ctorParameters = function() {
    return [
      { type: Store },
      { type: Actions },
      { type: MatSnackBar },
      { type: TranslationService }
    ];
  };
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    SnackbarEffects.prototype,
    'infoEffect',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    SnackbarEffects.prototype,
    'warningEffect',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    SnackbarEffects.prototype,
    'errorEffect',
    void 0
  );
  return SnackbarEffects;
})();
export { SnackbarEffects };
if (false) {
  /** @type {?} */
  SnackbarEffects.prototype.infoEffect;
  /** @type {?} */
  SnackbarEffects.prototype.warningEffect;
  /** @type {?} */
  SnackbarEffects.prototype.errorEffect;
  /**
   * @type {?}
   * @private
   */
  SnackbarEffects.prototype.store;
  /**
   * @type {?}
   * @private
   */
  SnackbarEffects.prototype.actions$;
  /**
   * @type {?}
   * @private
   */
  SnackbarEffects.prototype.snackBar;
  /**
   * @type {?}
   * @private
   */
  SnackbarEffects.prototype.translationService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2tiYXIuZWZmZWN0cy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkL3N0b3JlLyIsInNvdXJjZXMiOlsiZWZmZWN0cy9zbmFja2Jhci5lZmZlY3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzFELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBRUwsbUJBQW1CLEVBSXBCLE1BQU0sNkJBQTZCLENBQUM7QUFFckM7SUFFRSx5QkFDVSxLQUFzQixFQUN0QixRQUFpQixFQUNqQixRQUFxQixFQUNyQixrQkFBc0M7UUFKaEQsaUJBS0k7UUFKTSxVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUN0QixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLGFBQVEsR0FBUixRQUFRLENBQWE7UUFDckIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUloRCxlQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQzdCLE1BQU0sQ0FBcUIsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQ3BELEdBQUcsQ0FBQyxVQUFDLE1BQTBCO1lBQzdCLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUNILENBQUM7UUFHRixrQkFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUNoQyxNQUFNLENBQXdCLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxFQUMxRCxHQUFHLENBQUMsVUFBQyxNQUE2QjtZQUNoQyxLQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUNILENBQUM7UUFHRixnQkFBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUM5QixNQUFNLENBQXNCLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxFQUN0RCxHQUFHLENBQUMsVUFBQyxNQUEyQjtZQUM5QixLQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUNILENBQUM7SUF4QkMsQ0FBQzs7Ozs7OztJQTBCSSxzQ0FBWTs7Ozs7O0lBQXBCLFVBQXFCLE1BQXNCLEVBQUUsVUFBa0I7UUFBL0QsaUJBa0JDOztZQWpCTyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUM7O1lBRXpELFVBQVUsR0FBVyxJQUFJO1FBQzdCLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUNyQixVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3REOztZQUVLLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFO1lBQzFELFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxJQUFJLElBQUk7WUFDakMsVUFBVSxFQUFFLFVBQVU7U0FDdkIsQ0FBQztRQUVGLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUNyQixXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUMvQixLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOzs7Ozs7O0lBRU8sbUNBQVM7Ozs7OztJQUFqQixVQUFrQixPQUFlLEVBQUUsTUFBZTtRQUNoRCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFELENBQUM7O2dCQXZERixVQUFVOzs7O2dCQVhGLEtBQUs7Z0JBREwsT0FBTztnQkFEUCxXQUFXO2dCQUZYLGtCQUFrQjs7SUF5QnpCO1FBREMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDOzt1REFNMUI7SUFHRjtRQURDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQzs7MERBTTFCO0lBR0Y7UUFEQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7O3dEQU0xQjtJQXlCSixzQkFBQztDQUFBLEFBeERELElBd0RDO1NBdkRZLGVBQWU7OztJQVExQixxQ0FNRTs7SUFFRix3Q0FNRTs7SUFFRixzQ0FNRTs7Ozs7SUE1QkEsZ0NBQThCOzs7OztJQUM5QixtQ0FBeUI7Ozs7O0lBQ3pCLG1DQUE2Qjs7Ozs7SUFDN0IsNkNBQThDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBUcmFuc2xhdGlvblNlcnZpY2UgfSBmcm9tICdAYWxmcmVzY28vYWRmLWNvcmUnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0U25hY2tCYXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbmFjay1iYXInO1xuaW1wb3J0IHsgQWN0aW9ucywgRWZmZWN0LCBvZlR5cGUgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcbmltcG9ydCB7IFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQXBwU3RvcmUgfSBmcm9tICcuLi9zdGF0ZXMvYXBwLnN0YXRlJztcbmltcG9ydCB7XG4gIFNuYWNrYmFySW5mb0FjdGlvbixcbiAgU25hY2tiYXJBY3Rpb25UeXBlcyxcbiAgU25hY2tiYXJXYXJuaW5nQWN0aW9uLFxuICBTbmFja2JhckVycm9yQWN0aW9uLFxuICBTbmFja2JhckFjdGlvblxufSBmcm9tICcuLi9hY3Rpb25zL3NuYWNrYmFyLmFjdGlvbnMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU25hY2tiYXJFZmZlY3RzIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxuICAgIHByaXZhdGUgYWN0aW9ucyQ6IEFjdGlvbnMsXG4gICAgcHJpdmF0ZSBzbmFja0JhcjogTWF0U25hY2tCYXIsXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGlvblNlcnZpY2U6IFRyYW5zbGF0aW9uU2VydmljZVxuICApIHt9XG5cbiAgQEVmZmVjdCh7IGRpc3BhdGNoOiBmYWxzZSB9KVxuICBpbmZvRWZmZWN0ID0gdGhpcy5hY3Rpb25zJC5waXBlKFxuICAgIG9mVHlwZTxTbmFja2JhckluZm9BY3Rpb24+KFNuYWNrYmFyQWN0aW9uVHlwZXMuSW5mbyksXG4gICAgbWFwKChhY3Rpb246IFNuYWNrYmFySW5mb0FjdGlvbikgPT4ge1xuICAgICAgdGhpcy5zaG93U25hY2tCYXIoYWN0aW9uLCAnaW5mby1zbmFja2JhcicpO1xuICAgIH0pXG4gICk7XG5cbiAgQEVmZmVjdCh7IGRpc3BhdGNoOiBmYWxzZSB9KVxuICB3YXJuaW5nRWZmZWN0ID0gdGhpcy5hY3Rpb25zJC5waXBlKFxuICAgIG9mVHlwZTxTbmFja2Jhcldhcm5pbmdBY3Rpb24+KFNuYWNrYmFyQWN0aW9uVHlwZXMuV2FybmluZyksXG4gICAgbWFwKChhY3Rpb246IFNuYWNrYmFyV2FybmluZ0FjdGlvbikgPT4ge1xuICAgICAgdGhpcy5zaG93U25hY2tCYXIoYWN0aW9uLCAnd2FybmluZy1zbmFja2JhcicpO1xuICAgIH0pXG4gICk7XG5cbiAgQEVmZmVjdCh7IGRpc3BhdGNoOiBmYWxzZSB9KVxuICBlcnJvckVmZmVjdCA9IHRoaXMuYWN0aW9ucyQucGlwZShcbiAgICBvZlR5cGU8U25hY2tiYXJFcnJvckFjdGlvbj4oU25hY2tiYXJBY3Rpb25UeXBlcy5FcnJvciksXG4gICAgbWFwKChhY3Rpb246IFNuYWNrYmFyRXJyb3JBY3Rpb24pID0+IHtcbiAgICAgIHRoaXMuc2hvd1NuYWNrQmFyKGFjdGlvbiwgJ2Vycm9yLXNuYWNrYmFyJyk7XG4gICAgfSlcbiAgKTtcblxuICBwcml2YXRlIHNob3dTbmFja0JhcihhY3Rpb246IFNuYWNrYmFyQWN0aW9uLCBwYW5lbENsYXNzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy50cmFuc2xhdGUoYWN0aW9uLnBheWxvYWQsIGFjdGlvbi5wYXJhbXMpO1xuXG4gICAgbGV0IGFjdGlvbk5hbWU6IHN0cmluZyA9IG51bGw7XG4gICAgaWYgKGFjdGlvbi51c2VyQWN0aW9uKSB7XG4gICAgICBhY3Rpb25OYW1lID0gdGhpcy50cmFuc2xhdGUoYWN0aW9uLnVzZXJBY3Rpb24udGl0bGUpO1xuICAgIH1cblxuICAgIGNvbnN0IHNuYWNrQmFyUmVmID0gdGhpcy5zbmFja0Jhci5vcGVuKG1lc3NhZ2UsIGFjdGlvbk5hbWUsIHtcbiAgICAgIGR1cmF0aW9uOiBhY3Rpb24uZHVyYXRpb24gfHwgNDAwMCxcbiAgICAgIHBhbmVsQ2xhc3M6IHBhbmVsQ2xhc3NcbiAgICB9KTtcblxuICAgIGlmIChhY3Rpb24udXNlckFjdGlvbikge1xuICAgICAgc25hY2tCYXJSZWYub25BY3Rpb24oKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbi51c2VyQWN0aW9uLmFjdGlvbik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYW5zbGF0ZShtZXNzYWdlOiBzdHJpbmcsIHBhcmFtcz86IE9iamVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRpb25TZXJ2aWNlLmluc3RhbnQobWVzc2FnZSwgcGFyYW1zKTtcbiAgfVxufVxuIl19
