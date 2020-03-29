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
export class RouterEffects {
  /**
   * @param {?} store
   * @param {?} actions$
   * @param {?} router
   */
  constructor(store, actions$, router) {
    this.store = store;
    this.actions$ = actions$;
    this.router = router;
    this.navigateUrl$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateUrl),
      map(action => {
        if (action.payload) {
          this.router.navigateByUrl(action.payload);
        }
      })
    );
    this.navigateRoute$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateRoute),
      map(action => {
        this.router.navigate(action.payload);
      })
    );
    this.navigateToFolder$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateFolder),
      map(action => {
        if (action.payload && action.payload.entry) {
          this.navigateToFolder(action.payload.entry);
        }
      })
    );
    this.navigateToParentFolder$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateParentFolder),
      map(action => {
        if (action.payload && action.payload.entry) {
          this.navigateToParentFolder(action.payload.entry);
        }
      })
    );
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  navigateToFolder(node) {
    /** @type {?} */
    let link = null;
    const { path, id } = node;
    if (path && path.name && path.elements) {
      /** @type {?} */
      const isLibraryPath = this.isLibraryContent(/** @type {?} */ (path));
      /** @type {?} */
      const parent = path.elements[path.elements.length - 1];
      /** @type {?} */
      const area = isLibraryPath ? '/libraries' : '/personal-files';
      if (!isLibraryPath) {
        link = [area, id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent.name === 'Sites' ? {} : id];
      }
      setTimeout(() => {
        this.router.navigate(link);
      }, 10);
    } else {
      this.router.navigate(['/personal-files', node.id]);
    }
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  navigateToParentFolder(node) {
    /** @type {?} */
    let link = null;
    const { path } = node;
    if (path && path.name && path.elements) {
      /** @type {?} */
      const isLibraryPath = this.isLibraryContent(/** @type {?} */ (path));
      /** @type {?} */
      const parent = path.elements[path.elements.length - 1];
      /** @type {?} */
      const area = isLibraryPath ? '/libraries' : '/personal-files';
      if (!isLibraryPath) {
        link = [area, parent.id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent.name === 'Sites' ? {} : parent.id];
      }
      setTimeout(() => {
        this.router.navigate(link);
      }, 10);
    } else {
      this.store.dispatch(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.CANNOT_NAVIGATE_LOCATION')
      );
    }
  }
  /**
   * @private
   * @param {?} path
   * @return {?}
   */
  isLibraryContent(path) {
    if (
      path &&
      path.elements.length >= 2 &&
      path.elements[1].name === 'Sites'
    ) {
      return true;
    }
    return false;
  }
}
RouterEffects.decorators = [{ type: Injectable }];
/** @nocollapse */
RouterEffects.ctorParameters = () => [
  { type: Store },
  { type: Actions },
  { type: Router }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmVmZmVjdHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZS8iLCJzb3VyY2VzIjpbImVmZmVjdHMvcm91dGVyLmVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXhELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRXBDLE9BQU8sRUFFTCxpQkFBaUIsRUFJbEIsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUdsRSxNQUFNLE9BQU8sYUFBYTs7Ozs7O0lBQ3hCLFlBQ1UsS0FBc0IsRUFDdEIsUUFBaUIsRUFDakIsTUFBYztRQUZkLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBQ3RCLGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUl4QixpQkFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUMvQixNQUFNLENBQW9CLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUN4RCxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDWCxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMzQztRQUNILENBQUMsQ0FBQyxDQUNILENBQUM7UUFHRixtQkFBYyxHQUFHLElBQUks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QUUsQ0FBQzs7d0RBUTFCO0FBR0Y7SUFEQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7OzhEQVExQjs7O0lBcENGLHFDQVFFOztJQUVGLHVDQU1FOztJQUVGLDBDQVFFOztJQUVGLGdEQVFFOzs7OztJQXpDQSw4QkFBOEI7Ozs7O0lBQzlCLGlDQUF5Qjs7Ozs7SUFDekIsK0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQWN0aW9ucywgRWZmZWN0LCBvZlR5cGUgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcbmltcG9ydCB7IE1pbmltYWxOb2RlRW50cnlFbnRpdHksIFBhdGhJbmZvRW50aXR5IH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEFwcFN0b3JlIH0gZnJvbSAnLi4vc3RhdGVzL2FwcC5zdGF0ZSc7XG5pbXBvcnQge1xuICBOYXZpZ2F0ZVVybEFjdGlvbixcbiAgUm91dGVyQWN0aW9uVHlwZXMsXG4gIE5hdmlnYXRlUm91dGVBY3Rpb24sXG4gIE5hdmlnYXRlVG9Gb2xkZXIsXG4gIE5hdmlnYXRlVG9QYXJlbnRGb2xkZXJcbn0gZnJvbSAnLi4vYWN0aW9ucy9yb3V0ZXIuYWN0aW9ucyc7XG5pbXBvcnQgeyBTbmFja2JhckVycm9yQWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9zbmFja2Jhci5hY3Rpb25zJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJvdXRlckVmZmVjdHMge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXG4gICAgcHJpdmF0ZSBhY3Rpb25zJDogQWN0aW9ucyxcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyXG4gICkge31cblxuICBARWZmZWN0KHsgZGlzcGF0Y2g6IGZhbHNlIH0pXG4gIG5hdmlnYXRlVXJsJCA9IHRoaXMuYWN0aW9ucyQucGlwZShcbiAgICBvZlR5cGU8TmF2aWdhdGVVcmxBY3Rpb24+KFJvdXRlckFjdGlvblR5cGVzLk5hdmlnYXRlVXJsKSxcbiAgICBtYXAoYWN0aW9uID0+IHtcbiAgICAgIGlmIChhY3Rpb24ucGF5bG9hZCkge1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKGFjdGlvbi5wYXlsb2FkKTtcbiAgICAgIH1cbiAgICB9KVxuICApO1xuXG4gIEBFZmZlY3QoeyBkaXNwYXRjaDogZmFsc2UgfSlcbiAgbmF2aWdhdGVSb3V0ZSQgPSB0aGlzLmFjdGlvbnMkLnBpcGUoXG4gICAgb2ZUeXBlPE5hdmlnYXRlUm91dGVBY3Rpb24+KFJvdXRlckFjdGlvblR5cGVzLk5hdmlnYXRlUm91dGUpLFxuICAgIG1hcChhY3Rpb24gPT4ge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoYWN0aW9uLnBheWxvYWQpO1xuICAgIH0pXG4gICk7XG5cbiAgQEVmZmVjdCh7IGRpc3BhdGNoOiBmYWxzZSB9KVxuICBuYXZpZ2F0ZVRvRm9sZGVyJCA9IHRoaXMuYWN0aW9ucyQucGlwZShcbiAgICBvZlR5cGU8TmF2aWdhdGVUb0ZvbGRlcj4oUm91dGVyQWN0aW9uVHlwZXMuTmF2aWdhdGVGb2xkZXIpLFxuICAgIG1hcChhY3Rpb24gPT4ge1xuICAgICAgaWYgKGFjdGlvbi5wYXlsb2FkICYmIGFjdGlvbi5wYXlsb2FkLmVudHJ5KSB7XG4gICAgICAgIHRoaXMubmF2aWdhdGVUb0ZvbGRlcihhY3Rpb24ucGF5bG9hZC5lbnRyeSk7XG4gICAgICB9XG4gICAgfSlcbiAgKTtcblxuICBARWZmZWN0KHsgZGlzcGF0Y2g6IGZhbHNlIH0pXG4gIG5hdmlnYXRlVG9QYXJlbnRGb2xkZXIkID0gdGhpcy5hY3Rpb25zJC5waXBlKFxuICAgIG9mVHlwZTxOYXZpZ2F0ZVRvUGFyZW50Rm9sZGVyPihSb3V0ZXJBY3Rpb25UeXBlcy5OYXZpZ2F0ZVBhcmVudEZvbGRlciksXG4gICAgbWFwKGFjdGlvbiA9PiB7XG4gICAgICBpZiAoYWN0aW9uLnBheWxvYWQgJiYgYWN0aW9uLnBheWxvYWQuZW50cnkpIHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvUGFyZW50Rm9sZGVyKGFjdGlvbi5wYXlsb2FkLmVudHJ5KTtcbiAgICAgIH1cbiAgICB9KVxuICApO1xuXG4gIHByaXZhdGUgbmF2aWdhdGVUb0ZvbGRlcihub2RlOiBNaW5pbWFsTm9kZUVudHJ5RW50aXR5KSB7XG4gICAgbGV0IGxpbms6IGFueVtdID0gbnVsbDtcbiAgICBjb25zdCB7IHBhdGgsIGlkIH0gPSBub2RlO1xuXG4gICAgaWYgKHBhdGggJiYgcGF0aC5uYW1lICYmIHBhdGguZWxlbWVudHMpIHtcbiAgICAgIGNvbnN0IGlzTGlicmFyeVBhdGggPSB0aGlzLmlzTGlicmFyeUNvbnRlbnQoPFBhdGhJbmZvRW50aXR5PnBhdGgpO1xuXG4gICAgICBjb25zdCBwYXJlbnQgPSBwYXRoLmVsZW1lbnRzW3BhdGguZWxlbWVudHMubGVuZ3RoIC0gMV07XG4gICAgICBjb25zdCBhcmVhID0gaXNMaWJyYXJ5UGF0aCA/ICcvbGlicmFyaWVzJyA6ICcvcGVyc29uYWwtZmlsZXMnO1xuXG4gICAgICBpZiAoIWlzTGlicmFyeVBhdGgpIHtcbiAgICAgICAgbGluayA9IFthcmVhLCBpZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBwYXJlbnQuaWQgY291bGQgYmUgJ1NpdGUnIGZvbGRlciBvciBjaGlsZCBhcyAnZG9jdW1lbnRMaWJyYXJ5J1xuICAgICAgICBsaW5rID0gW2FyZWEsIHBhcmVudC5uYW1lID09PSAnU2l0ZXMnID8ge30gOiBpZF07XG4gICAgICB9XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShsaW5rKTtcbiAgICAgIH0sIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvcGVyc29uYWwtZmlsZXMnLCBub2RlLmlkXSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBuYXZpZ2F0ZVRvUGFyZW50Rm9sZGVyKG5vZGU6IE1pbmltYWxOb2RlRW50cnlFbnRpdHkpIHtcbiAgICBsZXQgbGluazogYW55W10gPSBudWxsO1xuICAgIGNvbnN0IHsgcGF0aCB9ID0gbm9kZTtcblxuICAgIGlmIChwYXRoICYmIHBhdGgubmFtZSAmJiBwYXRoLmVsZW1lbnRzKSB7XG4gICAgICBjb25zdCBpc0xpYnJhcnlQYXRoID0gdGhpcy5pc0xpYnJhcnlDb250ZW50KDxQYXRoSW5mb0VudGl0eT5wYXRoKTtcblxuICAgICAgY29uc3QgcGFyZW50ID0gcGF0aC5lbGVtZW50c1twYXRoLmVsZW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgY29uc3QgYXJlYSA9IGlzTGlicmFyeVBhdGggPyAnL2xpYnJhcmllcycgOiAnL3BlcnNvbmFsLWZpbGVzJztcblxuICAgICAgaWYgKCFpc0xpYnJhcnlQYXRoKSB7XG4gICAgICAgIGxpbmsgPSBbYXJlYSwgcGFyZW50LmlkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHBhcmVudC5pZCBjb3VsZCBiZSAnU2l0ZScgZm9sZGVyIG9yIGNoaWxkIGFzICdkb2N1bWVudExpYnJhcnknXG4gICAgICAgIGxpbmsgPSBbYXJlYSwgcGFyZW50Lm5hbWUgPT09ICdTaXRlcycgPyB7fSA6IHBhcmVudC5pZF07XG4gICAgICB9XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShsaW5rKTtcbiAgICAgIH0sIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChcbiAgICAgICAgbmV3IFNuYWNrYmFyRXJyb3JBY3Rpb24oJ0FQUC5NRVNTQUdFUy5FUlJPUlMuQ0FOTk9UX05BVklHQVRFX0xPQ0FUSU9OJylcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpc0xpYnJhcnlDb250ZW50KHBhdGg6IFBhdGhJbmZvRW50aXR5KTogYm9vbGVhbiB7XG4gICAgaWYgKFxuICAgICAgcGF0aCAmJlxuICAgICAgcGF0aC5lbGVtZW50cy5sZW5ndGggPj0gMiAmJlxuICAgICAgcGF0aC5lbGVtZW50c1sxXS5uYW1lID09PSAnU2l0ZXMnXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==
