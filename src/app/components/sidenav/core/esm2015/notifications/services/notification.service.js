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
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslationService } from '../../services/translation.service';
import {
  AppConfigService,
  AppConfigValues
} from '../../app-config/app-config.service';
import { Subject } from 'rxjs';
import { info, warning, error } from '../helpers/notification.factory';
import * as i0 from '@angular/core';
import * as i1 from '@angular/material/snack-bar';
import * as i2 from '../../services/translation.service';
import * as i3 from '../../app-config/app-config.service';
/** @type {?} */
const INFO_SNACK_CLASS = 'adf-info-snackbar';
/** @type {?} */
const WARN_SNACK_CLASS = 'adf-warning-snackbar';
/** @type {?} */
const ERROR_SNACK_CLASS = 'adf-error-snackbar';
export class NotificationService {
  /**
   * @param {?} snackBar
   * @param {?} translationService
   * @param {?} appConfigService
   */
  constructor(snackBar, translationService, appConfigService) {
    this.snackBar = snackBar;
    this.translationService = translationService;
    this.appConfigService = appConfigService;
    this.DEFAULT_DURATION_MESSAGE = 5000;
    this.notifications$ = new Subject();
    this.DEFAULT_DURATION_MESSAGE =
      this.appConfigService.get(AppConfigValues.NOTIFY_DURATION) ||
      this.DEFAULT_DURATION_MESSAGE;
  }
  /**
   * Opens a SnackBar notification to show a message.
   * @param {?} message The message (or resource key) to show.
   * @param {?=} config Time before notification disappears after being shown or MatSnackBarConfig object
   * @param {?=} interpolateArgs The interpolation parameters to add for the translation
   * @return {?} Information/control object for the SnackBar
   */
  openSnackMessage(message, config, interpolateArgs) {
    return this.dispatchNotification(message, null, config, interpolateArgs);
  }
  /**
   * Opens a SnackBar notification with a message and a response button.
   * @param {?} message The message (or resource key) to show.
   * @param {?} action Caption for the response button
   * @param {?=} config Time before notification disappears after being shown or MatSnackBarConfig object
   * @param {?=} interpolateArgs The interpolation parameters to add for the translation
   * @return {?} Information/control object for the SnackBar
   */
  openSnackMessageAction(message, action, config, interpolateArgs) {
    return this.dispatchNotification(message, action, config, interpolateArgs);
  }
  /**
   * Rase error message
   * @param {?} message Text message or translation key for the message.
   * @param {?=} action Action name
   * @param {?=} interpolateArgs The interpolation parameters to add for the translation
   * @return {?}
   */
  showError(message, action, interpolateArgs) {
    return this.dispatchNotification(
      message,
      action,
      { panelClass: ERROR_SNACK_CLASS },
      interpolateArgs
    );
  }
  /**
   * Rase info message
   * @param {?} message Text message or translation key for the message.
   * @param {?=} action Action name
   * @param {?=} interpolateArgs The interpolation parameters to add for the translation
   * @return {?}
   */
  showInfo(message, action, interpolateArgs) {
    return this.dispatchNotification(
      message,
      action,
      { panelClass: INFO_SNACK_CLASS },
      interpolateArgs
    );
  }
  /**
   * Rase warning message
   * @param {?} message Text message or translation key for the message.
   * @param {?=} action Action name
   * @param {?=} interpolateArgs The interpolation parameters to add for the translation
   * @return {?}
   */
  showWarning(message, action, interpolateArgs) {
    return this.dispatchNotification(
      message,
      action,
      { panelClass: WARN_SNACK_CLASS },
      interpolateArgs
    );
  }
  /**
   *  dismiss the notification snackbar
   * @return {?}
   */
  dismissSnackMessageAction() {
    return this.snackBar.dismiss();
  }
  /**
   * @private
   * @param {?} message
   * @param {?=} action
   * @param {?=} config
   * @param {?=} interpolateArgs
   * @return {?}
   */
  dispatchNotification(message, action, config, interpolateArgs) {
    /** @type {?} */
    const translatedMessage = this.translationService.instant(
      message,
      interpolateArgs
    );
    /** @type {?} */
    const createNotification = this.getNotificationCreator(config);
    this.notifications$.next(createNotification(translatedMessage));
    return this.snackBar.open(
      translatedMessage,
      action,
      Object.assign(
        {
          duration:
            typeof config === 'number' ? config : this.DEFAULT_DURATION_MESSAGE,
          panelClass: INFO_SNACK_CLASS
        },
        typeof config === 'object' ? config : {}
      )
    );
  }
  /**
   * @private
   * @param {?=} config
   * @return {?}
   */
  getNotificationCreator(config) {
    /** @type {?} */
    let panelClass = null;
    if (typeof config === 'object') {
      panelClass = Array.isArray(config.panelClass)
        ? config.panelClass[0]
        : config.panelClass;
    }
    switch (panelClass) {
      case ERROR_SNACK_CLASS:
        return error;
      case WARN_SNACK_CLASS:
        return warning;
      default:
        return info;
    }
  }
}
NotificationService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */
NotificationService.ctorParameters = () => [
  { type: MatSnackBar },
  { type: TranslationService },
  { type: AppConfigService }
];
/** @nocollapse */ NotificationService.ngInjectableDef = i0.defineInjectable({
  factory: function NotificationService_Factory() {
    return new NotificationService(
      i0.inject(i1.MatSnackBar),
      i0.inject(i2.TranslationService),
      i0.inject(i3.AppConfigService)
    );
  },
  token: NotificationService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  NotificationService.prototype.DEFAULT_DURATION_MESSAGE;
  /** @type {?} */
  NotificationService.prototype.notifications$;
  /**
   * @type {?}
   * @private
   */
  NotificationService.prototype.snackBar;
  /**
   * @type {?}
   * @private
   */
  NotificationService.prototype.translationService;
  /**
   * @type {?}
   * @private
   */
  NotificationService.prototype.appConfigService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJub3RpZmljYXRpb25zL3NlcnZpY2VzL25vdGlmaWNhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBcUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDeEYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQzs7Ozs7O01BRWpFLGdCQUFnQixHQUFHLG1CQUFtQjs7TUFDdEMsZ0JBQWdCLEdBQUcsc0JBQXNCOztNQUN6QyxpQkFBaUIsR0FBRyxvQkFBb0I7QUFLOUMsTUFBTSxPQUFPLG1CQUFtQjs7Ozs7O0lBTTVCLFlBQW9CLFFBQXFCLEVBQ3JCLGtCQUFzQyxFQUN0QyxnQkFBa0M7UUFGbEMsYUFBUSxHQUFSLFFBQVEsQ0FBYTtRQUNyQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFOdEQsNkJBQXdCLEdBQVcsSUFBSSxDQUFDO1FBRXhDLG1CQUFjLEdBQStCLElBQUksT0FBTyxFQUFFLENBQUM7UUFLdkQsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQVMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxJQUFJLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztJQUN4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QUNyQjs7OztZQWJRLFdBQVc7WUFDWCxrQkFBa0I7WUFDbEIsZ0JBQWdCOzs7OztJQWNyQix1REFBd0M7O0lBRXhDLDZDQUEyRDs7Ozs7SUFFL0MsdUNBQTZCOzs7OztJQUM3QixpREFBOEM7Ozs7O0lBQzlDLCtDQUEwQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdFNuYWNrQmFyLCBNYXRTbmFja0JhclJlZiwgTWF0U25hY2tCYXJDb25maWcgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBUcmFuc2xhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEFwcENvbmZpZ1NlcnZpY2UsIEFwcENvbmZpZ1ZhbHVlcyB9IGZyb20gJy4uLy4uL2FwcC1jb25maWcvYXBwLWNvbmZpZy5zZXJ2aWNlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbk1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL25vdGlmaWNhdGlvbi5tb2RlbCc7XG5pbXBvcnQgeyBpbmZvLCB3YXJuaW5nLCBlcnJvciB9IGZyb20gJy4uL2hlbHBlcnMvbm90aWZpY2F0aW9uLmZhY3RvcnknO1xuXG5jb25zdCBJTkZPX1NOQUNLX0NMQVNTID0gJ2FkZi1pbmZvLXNuYWNrYmFyJztcbmNvbnN0IFdBUk5fU05BQ0tfQ0xBU1MgPSAnYWRmLXdhcm5pbmctc25hY2tiYXInO1xuY29uc3QgRVJST1JfU05BQ0tfQ0xBU1MgPSAnYWRmLWVycm9yLXNuYWNrYmFyJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb25TZXJ2aWNlIHtcblxuICAgIERFRkFVTFRfRFVSQVRJT05fTUVTU0FHRTogbnVtYmVyID0gNTAwMDtcblxuICAgIG5vdGlmaWNhdGlvbnMkOiBTdWJqZWN0PE5vdGlmaWNhdGlvbk1vZGVsPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNuYWNrQmFyOiBNYXRTbmFja0JhcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHRyYW5zbGF0aW9uU2VydmljZTogVHJhbnNsYXRpb25TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgYXBwQ29uZmlnU2VydmljZTogQXBwQ29uZmlnU2VydmljZSkge1xuICAgICAgICB0aGlzLkRFRkFVTFRfRFVSQVRJT05fTUVTU0FHRSA9IHRoaXMuYXBwQ29uZmlnU2VydmljZS5nZXQ8bnVtYmVyPihBcHBDb25maWdWYWx1ZXMuTk9USUZZX0RVUkFUSU9OKSB8fCB0aGlzLkRFRkFVTFRfRFVSQVRJT05fTUVTU0FHRTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcGVucyBhIFNuYWNrQmFyIG5vdGlmaWNhdGlvbiB0byBzaG93IGEgbWVzc2FnZS5cbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBUaGUgbWVzc2FnZSAob3IgcmVzb3VyY2Uga2V5KSB0byBzaG93LlxuICAgICAqIEBwYXJhbSBjb25maWcgVGltZSBiZWZvcmUgbm90aWZpY2F0aW9uIGRpc2FwcGVhcnMgYWZ0ZXIgYmVpbmcgc2hvd24gb3IgTWF0U25hY2tCYXJDb25maWcgb2JqZWN0XG4gICAgICogQHBhcmFtIGludGVycG9sYXRlQXJncyBUaGUgaW50ZXJwb2xhdGlvbiBwYXJhbWV0ZXJzIHRvIGFkZCBmb3IgdGhlIHRyYW5zbGF0aW9uXG4gICAgICogQHJldHVybnMgSW5mb3JtYXRpb24vY29udHJvbCBvYmplY3QgZm9yIHRoZSBTbmFja0JhclxuICAgICAqL1xuICAgIG9wZW5TbmFja01lc3NhZ2UobWVzc2FnZTogc3RyaW5nLCBjb25maWc/OiBudW1iZXIgfCBNYXRTbmFja0JhckNvbmZpZywgaW50ZXJwb2xhdGVBcmdzPzogYW55KTogTWF0U25hY2tCYXJSZWY8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoTm90aWZpY2F0aW9uKG1lc3NhZ2UsIG51bGwsIGNvbmZpZywgaW50ZXJwb2xhdGVBcmdzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcGVucyBhIFNuYWNrQmFyIG5vdGlmaWNhdGlvbiB3aXRoIGEgbWVzc2FnZSBhbmQgYSByZXNwb25zZSBidXR0b24uXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgVGhlIG1lc3NhZ2UgKG9yIHJlc291cmNlIGtleSkgdG8gc2hvdy5cbiAgICAgKiBAcGFyYW0gYWN0aW9uIENhcHRpb24gZm9yIHRoZSByZXNwb25zZSBidXR0b25cbiAgICAgKiBAcGFyYW0gY29uZmlnIFRpbWUgYmVmb3JlIG5vdGlmaWNhdGlvbiBkaXNhcHBlYXJzIGFmdGVyIGJlaW5nIHNob3duIG9yIE1hdFNuYWNrQmFyQ29uZmlnIG9iamVjdFxuICAgICAqIEBwYXJhbSBpbnRlcnBvbGF0ZUFyZ3MgVGhlIGludGVycG9sYXRpb24gcGFyYW1ldGVycyB0byBhZGQgZm9yIHRoZSB0cmFuc2xhdGlvblxuICAgICAqIEByZXR1cm5zIEluZm9ybWF0aW9uL2NvbnRyb2wgb2JqZWN0IGZvciB0aGUgU25hY2tCYXJcbiAgICAgKi9cbiAgICBvcGVuU25hY2tNZXNzYWdlQWN0aW9uKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcsIGNvbmZpZz86IG51bWJlciB8IE1hdFNuYWNrQmFyQ29uZmlnLCBpbnRlcnBvbGF0ZUFyZ3M/OiBhbnkpOiBNYXRTbmFja0JhclJlZjxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hOb3RpZmljYXRpb24obWVzc2FnZSwgYWN0aW9uLCBjb25maWcsIGludGVycG9sYXRlQXJncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmFzZSBlcnJvciBtZXNzYWdlXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgVGV4dCBtZXNzYWdlIG9yIHRyYW5zbGF0aW9uIGtleSBmb3IgdGhlIG1lc3NhZ2UuXG4gICAgICogQHBhcmFtIGFjdGlvbiBBY3Rpb24gbmFtZVxuICAgICAqIEBwYXJhbSBpbnRlcnBvbGF0ZUFyZ3MgVGhlIGludGVycG9sYXRpb24gcGFyYW1ldGVycyB0byBhZGQgZm9yIHRoZSB0cmFuc2xhdGlvblxuICAgICAqL1xuICAgIHNob3dFcnJvcihtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbj86IHN0cmluZywgaW50ZXJwb2xhdGVBcmdzPzogYW55KTogTWF0U25hY2tCYXJSZWY8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoTm90aWZpY2F0aW9uKG1lc3NhZ2UsIGFjdGlvbiwgeyBwYW5lbENsYXNzOiBFUlJPUl9TTkFDS19DTEFTUyB9LCBpbnRlcnBvbGF0ZUFyZ3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJhc2UgaW5mbyBtZXNzYWdlXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgVGV4dCBtZXNzYWdlIG9yIHRyYW5zbGF0aW9uIGtleSBmb3IgdGhlIG1lc3NhZ2UuXG4gICAgICogQHBhcmFtIGFjdGlvbiBBY3Rpb24gbmFtZVxuICAgICAqIEBwYXJhbSBpbnRlcnBvbGF0ZUFyZ3MgVGhlIGludGVycG9sYXRpb24gcGFyYW1ldGVycyB0byBhZGQgZm9yIHRoZSB0cmFuc2xhdGlvblxuICAgICAqL1xuICAgIHNob3dJbmZvKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uPzogc3RyaW5nLCBpbnRlcnBvbGF0ZUFyZ3M/OiBhbnkpOiBNYXRTbmFja0JhclJlZjxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hOb3RpZmljYXRpb24obWVzc2FnZSwgYWN0aW9uLCB7IHBhbmVsQ2xhc3M6IElORk9fU05BQ0tfQ0xBU1MgfSwgaW50ZXJwb2xhdGVBcmdzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSYXNlIHdhcm5pbmcgbWVzc2FnZVxuICAgICAqIEBwYXJhbSBtZXNzYWdlIFRleHQgbWVzc2FnZSBvciB0cmFuc2xhdGlvbiBrZXkgZm9yIHRoZSBtZXNzYWdlLlxuICAgICAqIEBwYXJhbSBhY3Rpb24gQWN0aW9uIG5hbWVcbiAgICAgKiBAcGFyYW0gaW50ZXJwb2xhdGVBcmdzIFRoZSBpbnRlcnBvbGF0aW9uIHBhcmFtZXRlcnMgdG8gYWRkIGZvciB0aGUgdHJhbnNsYXRpb25cbiAgICAgKi9cbiAgICBzaG93V2FybmluZyhtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbj86IHN0cmluZywgaW50ZXJwb2xhdGVBcmdzPzogYW55KTogTWF0U25hY2tCYXJSZWY8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoTm90aWZpY2F0aW9uKG1lc3NhZ2UsIGFjdGlvbiwgeyBwYW5lbENsYXNzOiBXQVJOX1NOQUNLX0NMQVNTIH0sIGludGVycG9sYXRlQXJncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIGRpc21pc3MgdGhlIG5vdGlmaWNhdGlvbiBzbmFja2JhclxuICAgICAqL1xuICAgIGRpc21pc3NTbmFja01lc3NhZ2VBY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNuYWNrQmFyLmRpc21pc3MoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRpc3BhdGNoTm90aWZpY2F0aW9uKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uPzogc3RyaW5nLCBjb25maWc/OiBudW1iZXIgfCBNYXRTbmFja0JhckNvbmZpZywgaW50ZXJwb2xhdGVBcmdzPzogYW55KTogIE1hdFNuYWNrQmFyUmVmPGFueT4ge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRlZE1lc3NhZ2U6IHN0cmluZyA9IHRoaXMudHJhbnNsYXRpb25TZXJ2aWNlLmluc3RhbnQobWVzc2FnZSwgaW50ZXJwb2xhdGVBcmdzKTtcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZU5vdGlmaWNhdGlvbiA9IHRoaXMuZ2V0Tm90aWZpY2F0aW9uQ3JlYXRvcihjb25maWcpO1xuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zJC5uZXh0KGNyZWF0ZU5vdGlmaWNhdGlvbih0cmFuc2xhdGVkTWVzc2FnZSkpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zbmFja0Jhci5vcGVuKHRyYW5zbGF0ZWRNZXNzYWdlLCBhY3Rpb24sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogKHR5cGVvZiBjb25maWcgPT09ICdudW1iZXInKSA/IGNvbmZpZyA6IHRoaXMuREVGQVVMVF9EVVJBVElPTl9NRVNTQUdFLFxuICAgICAgICAgICAgICAgIHBhbmVsQ2xhc3M6IElORk9fU05BQ0tfQ0xBU1MsXG4gICAgICAgICAgICAgICAgLi4uKCAodHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcpID8gY29uZmlnIDoge30gKVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROb3RpZmljYXRpb25DcmVhdG9yKGNvbmZpZz86IG51bWJlciB8IE1hdFNuYWNrQmFyQ29uZmlnKSB7XG4gICAgICAgIGxldCBwYW5lbENsYXNzOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHBhbmVsQ2xhc3MgPSBBcnJheS5pc0FycmF5KGNvbmZpZy5wYW5lbENsYXNzKSA/IGNvbmZpZy5wYW5lbENsYXNzWzBdIDogY29uZmlnLnBhbmVsQ2xhc3M7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHBhbmVsQ2xhc3MpIHtcbiAgICAgICAgICAgIGNhc2UgRVJST1JfU05BQ0tfQ0xBU1M6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgICAgY2FzZSBXQVJOX1NOQUNLX0NMQVNTOlxuICAgICAgICAgICAgICAgIHJldHVybiB3YXJuaW5nO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
