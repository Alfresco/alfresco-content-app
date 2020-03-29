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
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RouterActionTypes } from '../actions/router.actions';
import { SnackbarErrorAction } from '../actions/snackbar.actions';
var RouterEffects = /** @class */ (function() {
  function RouterEffects(store, actions$, router) {
    var _this = this;
    this.store = store;
    this.actions$ = actions$;
    this.router = router;
    this.navigateUrl$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateUrl),
      map(function(action) {
        if (action.payload) {
          _this.router.navigateByUrl(action.payload);
        }
      })
    );
    this.navigateRoute$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateRoute),
      map(function(action) {
        _this.router.navigate(action.payload);
      })
    );
    this.navigateToFolder$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateFolder),
      map(function(action) {
        if (action.payload && action.payload.entry) {
          _this.navigateToFolder(action.payload.entry);
        }
      })
    );
    this.navigateToParentFolder$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateParentFolder),
      map(function(action) {
        if (action.payload && action.payload.entry) {
          _this.navigateToParentFolder(action.payload.entry);
        }
      })
    );
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  RouterEffects.prototype.navigateToFolder
  /**
   * @private
   * @param {?} node
   * @return {?}
   */ = function(node) {
    var _this = this;
    /** @type {?} */
    var link = null;
    var path = node.path,
      id = node.id;
    if (path && path.name && path.elements) {
      /** @type {?} */
      var isLibraryPath = this.isLibraryContent(/** @type {?} */ (path));
      /** @type {?} */
      var parent_1 = path.elements[path.elements.length - 1];
      /** @type {?} */
      var area = isLibraryPath ? '/libraries' : '/personal-files';
      if (!isLibraryPath) {
        link = [area, id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent_1.name === 'Sites' ? {} : id];
      }
      setTimeout(function() {
        _this.router.navigate(link);
      }, 10);
    } else {
      this.router.navigate(['/personal-files', node.id]);
    }
  };
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  RouterEffects.prototype.navigateToParentFolder
  /**
   * @private
   * @param {?} node
   * @return {?}
   */ = function(node) {
    var _this = this;
    /** @type {?} */
    var link = null;
    var path = node.path;
    if (path && path.name && path.elements) {
      /** @type {?} */
      var isLibraryPath = this.isLibraryContent(/** @type {?} */ (path));
      /** @type {?} */
      var parent_2 = path.elements[path.elements.length - 1];
      /** @type {?} */
      var area = isLibraryPath ? '/libraries' : '/personal-files';
      if (!isLibraryPath) {
        link = [area, parent_2.id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent_2.name === 'Sites' ? {} : parent_2.id];
      }
      setTimeout(function() {
        _this.router.navigate(link);
      }, 10);
    } else {
      this.store.dispatch(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.CANNOT_NAVIGATE_LOCATION')
      );
    }
  };
  /**
   * @private
   * @param {?} path
   * @return {?}
   */
  RouterEffects.prototype.isLibraryContent
  /**
   * @private
   * @param {?} path
   * @return {?}
   */ = function(path) {
    if (
      path &&
      path.elements.length >= 2 &&
      path.elements[1].name === 'Sites'
    ) {
      return true;
    }
    return false;
  };
  RouterEffects.decorators = [{ type: Injectable }];
  /** @nocollapse */
  RouterEffects.ctorParameters = function() {
    return [{ type: Store }, { type: Actions }, { type: Router }];
  };
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    RouterEffects.prototype,
    'navigateUrl$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    RouterEffects.prototype,
    'navigateRoute$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    RouterEffects.prototype,
    'navigateToFolder$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    RouterEffects.prototype,
    'navigateToParentFolder$',
    void 0
  );
  return RouterEffects;
})();
export { RouterEffects };
if (false) {
  /** @type {?} */
  RouterEffects.prototype.navigateUrl$;
  /** @type {?} */
  RouterEffects.prototype.navigateRoute$;
  /** @type {?} */
  RouterEffects.prototype.navigateToFolder$;
  /** @type {?} */
  RouterEffects.prototype.navigateToParentFolder$;
  /**
   * @type {?}
   * @private
   */
  RouterEffects.prototype.store;
  /**
   * @type {?}
   * @private
   */
  RouterEffects.prototype.actions$;
  /**
   * @type {?}
   * @private
   */
  RouterEffects.prototype.router;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmVmZmVjdHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZS8iLCJzb3VyY2VzIjpbImVmZmVjdHMvcm91dGVyLmVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXhELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRXBDLE9BQU8sRUFFTCxpQkFBaUIsRUFJbEIsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUVsRTtJQUVFLHVCQUNVLEtBQXNCLEVBQ3RCLFFBQWlCLEVBQ2pCLE1BQWM7UUFIeEIsaUJBSUk7UUFITSxVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUN0QixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFJeEIsaUJBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FDL0IsTUFBTSxDQUFvQixpQkFBaUIsQ0FBQyxXQUFXLENBQUMsRUFDeEQsR0FBRyxDQUFDLFVBQUEsTUFBTTtZQUNSLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFDbEIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzNDO1FBQ0gsQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUdGLG1CQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FB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QUdGO1FBREMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDOztrRUFRMUI7SUFpRUosb0JBQUM7Q0FBQSxBQTdHRCxJQTZHQztTQTVHWSxhQUFhOzs7SUFPeEIscUNBUUU7O0lBRUYsdUNBTUU7O0lBRUYsMENBUUU7O0lBRUYsZ0RBUUU7Ozs7O0lBekNBLDhCQUE4Qjs7Ozs7SUFDOUIsaUNBQXlCOzs7OztJQUN6QiwrQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBBY3Rpb25zLCBFZmZlY3QsIG9mVHlwZSB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuaW1wb3J0IHsgTWluaW1hbE5vZGVFbnRyeUVudGl0eSwgUGF0aEluZm9FbnRpdHkgfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQXBwU3RvcmUgfSBmcm9tICcuLi9zdGF0ZXMvYXBwLnN0YXRlJztcbmltcG9ydCB7XG4gIE5hdmlnYXRlVXJsQWN0aW9uLFxuICBSb3V0ZXJBY3Rpb25UeXBlcyxcbiAgTmF2aWdhdGVSb3V0ZUFjdGlvbixcbiAgTmF2aWdhdGVUb0ZvbGRlcixcbiAgTmF2aWdhdGVUb1BhcmVudEZvbGRlclxufSBmcm9tICcuLi9hY3Rpb25zL3JvdXRlci5hY3Rpb25zJztcbmltcG9ydCB7IFNuYWNrYmFyRXJyb3JBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL3NuYWNrYmFyLmFjdGlvbnMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUm91dGVyRWZmZWN0cyB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcbiAgICBwcml2YXRlIGFjdGlvbnMkOiBBY3Rpb25zLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcbiAgKSB7fVxuXG4gIEBFZmZlY3QoeyBkaXNwYXRjaDogZmFsc2UgfSlcbiAgbmF2aWdhdGVVcmwkID0gdGhpcy5hY3Rpb25zJC5waXBlKFxuICAgIG9mVHlwZTxOYXZpZ2F0ZVVybEFjdGlvbj4oUm91dGVyQWN0aW9uVHlwZXMuTmF2aWdhdGVVcmwpLFxuICAgIG1hcChhY3Rpb24gPT4ge1xuICAgICAgaWYgKGFjdGlvbi5wYXlsb2FkKSB7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwoYWN0aW9uLnBheWxvYWQpO1xuICAgICAgfVxuICAgIH0pXG4gICk7XG5cbiAgQEVmZmVjdCh7IGRpc3BhdGNoOiBmYWxzZSB9KVxuICBuYXZpZ2F0ZVJvdXRlJCA9IHRoaXMuYWN0aW9ucyQucGlwZShcbiAgICBvZlR5cGU8TmF2aWdhdGVSb3V0ZUFjdGlvbj4oUm91dGVyQWN0aW9uVHlwZXMuTmF2aWdhdGVSb3V0ZSksXG4gICAgbWFwKGFjdGlvbiA9PiB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShhY3Rpb24ucGF5bG9hZCk7XG4gICAgfSlcbiAgKTtcblxuICBARWZmZWN0KHsgZGlzcGF0Y2g6IGZhbHNlIH0pXG4gIG5hdmlnYXRlVG9Gb2xkZXIkID0gdGhpcy5hY3Rpb25zJC5waXBlKFxuICAgIG9mVHlwZTxOYXZpZ2F0ZVRvRm9sZGVyPihSb3V0ZXJBY3Rpb25UeXBlcy5OYXZpZ2F0ZUZvbGRlciksXG4gICAgbWFwKGFjdGlvbiA9PiB7XG4gICAgICBpZiAoYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZW50cnkpIHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvRm9sZGVyKGFjdGlvbi5wYXlsb2FkLmVudHJ5KTtcbiAgICAgIH1cbiAgICB9KVxuICApO1xuXG4gIEBFZmZlY3QoeyBkaXNwYXRjaDogZmFsc2UgfSlcbiAgbmF2aWdhdGVUb1BhcmVudEZvbGRlciQgPSB0aGlzLmFjdGlvbnMkLnBpcGUoXG4gICAgb2ZUeXBlPE5hdmlnYXRlVG9QYXJlbnRGb2xkZXI+KFJvdXRlckFjdGlvblR5cGVzLk5hdmlnYXRlUGFyZW50Rm9sZGVyKSxcbiAgICBtYXAoYWN0aW9uID0+IHtcbiAgICAgIGlmIChhY3Rpb24ucGF5bG9hZCAmJiBhY3Rpb24ucGF5bG9hZC5lbnRyeSkge1xuICAgICAgICB0aGlzLm5hdmlnYXRlVG9QYXJlbnRGb2xkZXIoYWN0aW9uLnBheWxvYWQuZW50cnkpO1xuICAgICAgfVxuICAgIH0pXG4gICk7XG5cbiAgcHJpdmF0ZSBuYXZpZ2F0ZVRvRm9sZGVyKG5vZGU6IE1pbmltYWxOb2RlRW50cnlFbnRpdHkpIHtcbiAgICBsZXQgbGluazogYW55W10gPSBudWxsO1xuICAgIGNvbnN0IHsgcGF0aCwgaWQgfSA9IG5vZGU7XG5cbiAgICBpZiAocGF0aCAmJiBwYXRoLm5hbWUgJiYgcGF0aC5lbGVtZW50cykge1xuICAgICAgY29uc3QgaXNMaWJyYXJ5UGF0aCA9IHRoaXMuaXNMaWJyYXJ5Q29udGVudCg8UGF0aEluZm9FbnRpdHk+cGF0aCk7XG5cbiAgICAgIGNvbnN0IHBhcmVudCA9IHBhdGguZWxlbWVudHNbcGF0aC5lbGVtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgIGNvbnN0IGFyZWEgPSBpc0xpYnJhcnlQYXRoID8gJy9saWJyYXJpZXMnIDogJy9wZXJzb25hbC1maWxlcyc7XG5cbiAgICAgIGlmICghaXNMaWJyYXJ5UGF0aCkge1xuICAgICAgICBsaW5rID0gW2FyZWEsIGlkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHBhcmVudC5pZCBjb3VsZCBiZSAnU2l0ZScgZm9sZGVyIG9yIGNoaWxkIGFzICdkb2N1bWVudExpYnJhcnknXG4gICAgICAgIGxpbmsgPSBbYXJlYSwgcGFyZW50Lm5hbWUgPT09ICdTaXRlcycgPyB7fSA6IGlkXTtcbiAgICAgIH1cblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKGxpbmspO1xuICAgICAgfSwgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy9wZXJzb25hbC1maWxlcycsIG5vZGUuaWRdKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG5hdmlnYXRlVG9QYXJlbnRGb2xkZXIobm9kZTogTWluaW1hbE5vZGVFbnRyeUVudGl0eSkge1xuICAgIGxldCBsaW5rOiBhbnlbXSA9IG51bGw7XG4gICAgY29uc3QgeyBwYXRoIH0gPSBub2RlO1xuXG4gICAgaWYgKHBhdGggJiYgcGF0aC5uYW1lICYmIHBhdGguZWxlbWVudHMpIHtcbiAgICAgIGNvbnN0IGlzTGlicmFyeVBhdGggPSB0aGlzLmlzTGlicmFyeUNvbnRlbnQoPFBhdGhJbmZvRW50aXR5PnBhdGgpO1xuXG4gICAgICBjb25zdCBwYXJlbnQgPSBwYXRoLmVsZW1lbnRzW3BhdGguZWxlbWVudHMubGVuZ3RoIC0gMV07XG4gICAgICBjb25zdCBhcmVhID0gaXNMaWJyYXJ5UGF0aCA/ICcvbGlicmFyaWVzJyA6ICcvcGVyc29uYWwtZmlsZXMnO1xuXG4gICAgICBpZiAoIWlzTGlicmFyeVBhdGgpIHtcbiAgICAgICAgbGluayA9IFthcmVhLCBwYXJlbnQuaWRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcGFyZW50LmlkIGNvdWxkIGJlICdTaXRlJyBmb2xkZXIgb3IgY2hpbGQgYXMgJ2RvY3VtZW50TGlicmFyeSdcbiAgICAgICAgbGluayA9IFthcmVhLCBwYXJlbnQubmFtZSA9PT0gJ1NpdGVzJyA/IHt9IDogcGFyZW50LmlkXTtcbiAgICAgIH1cblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKGxpbmspO1xuICAgICAgfSwgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKFxuICAgICAgICBuZXcgU25hY2tiYXJFcnJvckFjdGlvbignQVBQLk1FU1NBR0VTLkVSUk9SUy5DQU5OT1RfTkFWSUdBVEVfTE9DQVRJT04nKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzTGlicmFyeUNvbnRlbnQocGF0aDogUGF0aEluZm9FbnRpdHkpOiBib29sZWFuIHtcbiAgICBpZiAoXG4gICAgICBwYXRoICYmXG4gICAgICBwYXRoLmVsZW1lbnRzLmxlbmd0aCA+PSAyICYmXG4gICAgICBwYXRoLmVsZW1lbnRzWzFdLm5hbWUgPT09ICdTaXRlcydcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19
