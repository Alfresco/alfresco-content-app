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
/* tslint:disable:no-console  */
import { Injectable } from '@angular/core';
import {
  AppConfigService,
  AppConfigValues
} from '../app-config/app-config.service';
import { logLevels, LogLevelsEnum } from '../models/log-levels.model';
import { Subject } from 'rxjs';
import * as i0 from '@angular/core';
import * as i1 from '../app-config/app-config.service';
export class LogService {
  /**
   * @param {?} appConfig
   */
  constructor(appConfig) {
    this.appConfig = appConfig;
    this.onMessage = new Subject();
  }
  /**
   * @return {?}
   */
  get currentLogLevel() {
    /** @type {?} */
    const configLevel = this.appConfig.get(AppConfigValues.LOG_LEVEL);
    if (configLevel) {
      return this.getLogLevel(configLevel);
    }
    return LogLevelsEnum.TRACE;
  }
  /**
   * Logs a message at the "ERROR" level.
   * @param {?=} message Message to log
   * @param {...?} optionalParams Interpolation values for the message in "printf" format
   * @return {?}
   */
  error(message, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.ERROR) {
      this.messageBus(message, 'ERROR');
      console.error(message, ...optionalParams);
    }
  }
  /**
   * Logs a message at the "DEBUG" level.
   * @param {?=} message Message to log
   * @param {...?} optionalParams Interpolation values for the message in "printf" format
   * @return {?}
   */
  debug(message, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.DEBUG) {
      this.messageBus(message, 'DEBUG');
      console.debug(message, ...optionalParams);
    }
  }
  /**
   * Logs a message at the "INFO" level.
   * @param {?=} message Message to log
   * @param {...?} optionalParams Interpolation values for the message in "printf" format
   * @return {?}
   */
  info(message, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.INFO) {
      this.messageBus(message, 'INFO');
      console.info(message, ...optionalParams);
    }
  }
  /**
   * Logs a message at any level from "TRACE" upwards.
   * @param {?=} message Message to log
   * @param {...?} optionalParams Interpolation values for the message in "printf" format
   * @return {?}
   */
  log(message, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.TRACE) {
      this.messageBus(message, 'LOG');
      console.log(message, ...optionalParams);
    }
  }
  /**
   * Logs a message at the "TRACE" level.
   * @param {?=} message Message to log
   * @param {...?} optionalParams Interpolation values for the message in "printf" format
   * @return {?}
   */
  trace(message, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.TRACE) {
      this.messageBus(message, 'TRACE');
      console.trace(message, ...optionalParams);
    }
  }
  /**
   * Logs a message at the "WARN" level.
   * @param {?=} message Message to log
   * @param {...?} optionalParams Interpolation values for the message in "printf" format
   * @return {?}
   */
  warn(message, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.WARN) {
      this.messageBus(message, 'WARN');
      console.warn(message, ...optionalParams);
    }
  }
  /**
   * Logs a message if a boolean test fails.
   * @param {?=} test Test value (typically a boolean expression)
   * @param {?=} message Message to show if test is false
   * @param {...?} optionalParams Interpolation values for the message in "printf" format
   * @return {?}
   */
  assert(test, message, ...optionalParams) {
    if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
      this.messageBus(message, 'ASSERT');
      console.assert(test, message, ...optionalParams);
    }
  }
  /**
   * Starts an indented group of log messages.
   * @param {?=} groupTitle Title shown at the start of the group
   * @param {...?} optionalParams Interpolation values for the title in "printf" format
   * @return {?}
   */
  group(groupTitle, ...optionalParams) {
    if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
      console.group(groupTitle, ...optionalParams);
    }
  }
  /**
   * Ends a indented group of log messages.
   * @return {?}
   */
  groupEnd() {
    if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
      console.groupEnd();
    }
  }
  /**
   * Converts a log level name string into its numeric equivalent.
   * @param {?} level Level name
   * @return {?} Numeric log level
   */
  getLogLevel(level) {
    /** @type {?} */
    const referencedLevel = logLevels.find(
      /**
       * @param {?} currentLevel
       * @return {?}
       */
      (currentLevel => {
        return (
          currentLevel.name.toLocaleLowerCase() === level.toLocaleLowerCase()
        );
      })
    );
    return referencedLevel ? referencedLevel.level : 5;
  }
  /**
   * Triggers notification callback for log messages.
   * @param {?} text Message text
   * @param {?} logLevel Log level for the message
   * @return {?}
   */
  messageBus(text, logLevel) {
    this.onMessage.next({ text: text, type: logLevel });
  }
}
LogService.decorators = [
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
LogService.ctorParameters = () => [{ type: AppConfigService }];
/** @nocollapse */ LogService.ngInjectableDef = i0.defineInjectable({
  factory: function LogService_Factory() {
    return new LogService(i0.inject(i1.AppConfigService));
  },
  token: LogService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  LogService.prototype.onMessage;
  /**
   * @type {?}
   * @private
   */
  LogService.prototype.appConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9sb2cuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckYsT0FBTyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7QUFLL0IsTUFBTSxPQUFPLFVBQVU7Ozs7SUFjbkIsWUFBb0IsU0FBMkI7UUFBM0IsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDM0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQ25DLENBQUM7Ozs7SUFkRCxJQUFJLGVBQWU7O2NBQ1QsV0FBVyxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFTLGVBQWUsQ0FBQyxTQUFTLENBQUM7UUFFakYsSUFBSSxXQUFXLEVBQUU7WUFDYixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDeEM7UUFFRCxPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDL0IsQ0FBQzs7Ozs7OztJQWFELEtBQUssQ0FBQyxPQUFhLEVBQUUsR0FBRyxjQUFxQjtRQUN6QyxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRTtZQUU3QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUVsQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLGNBQWMsQ0FBQyxDQUFDO1NBQzdDO0lBQ0wsQ0FBQzs7Ozs7OztJQU9E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LEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7Ozs7Ozs7SUFPRCxVQUFVLENBQUMsSUFBWSxFQUFFLFFBQWdCO1FBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUN4RCxDQUFDOzs7WUFoS0osVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7O1lBTlEsZ0JBQWdCOzs7OztJQW1CckIsK0JBQXdCOzs7OztJQUVaLCtCQUFtQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qIHRzbGludDpkaXNhYmxlOm5vLWNvbnNvbGUgICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFwcENvbmZpZ1NlcnZpY2UsIEFwcENvbmZpZ1ZhbHVlcyB9IGZyb20gJy4uL2FwcC1jb25maWcvYXBwLWNvbmZpZy5zZXJ2aWNlJztcbmltcG9ydCB7IGxvZ0xldmVscywgTG9nTGV2ZWxzRW51bSB9IGZyb20gJy4uL21vZGVscy9sb2ctbGV2ZWxzLm1vZGVsJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBMb2dTZXJ2aWNlIHtcblxuICAgIGdldCBjdXJyZW50TG9nTGV2ZWwoKSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZ0xldmVsOiBzdHJpbmcgPSB0aGlzLmFwcENvbmZpZy5nZXQ8c3RyaW5nPihBcHBDb25maWdWYWx1ZXMuTE9HX0xFVkVMKTtcblxuICAgICAgICBpZiAoY29uZmlnTGV2ZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldExvZ0xldmVsKGNvbmZpZ0xldmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBMb2dMZXZlbHNFbnVtLlRSQUNFO1xuICAgIH1cblxuICAgIG9uTWVzc2FnZTogU3ViamVjdDxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHBDb25maWc6IEFwcENvbmZpZ1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2UgPSBuZXcgU3ViamVjdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBcIkVSUk9SXCIgbGV2ZWwuXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0byBsb2dcbiAgICAgKiBAcGFyYW0gb3B0aW9uYWxQYXJhbXMgSW50ZXJwb2xhdGlvbiB2YWx1ZXMgZm9yIHRoZSBtZXNzYWdlIGluIFwicHJpbnRmXCIgZm9ybWF0XG4gICAgICovXG4gICAgZXJyb3IobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRMb2dMZXZlbCA+PSBMb2dMZXZlbHNFbnVtLkVSUk9SKSB7XG5cbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUJ1cyhtZXNzYWdlLCAnRVJST1InKTtcblxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2dzIGEgbWVzc2FnZSBhdCB0aGUgXCJERUJVR1wiIGxldmVsLlxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdG8gbG9nXG4gICAgICogQHBhcmFtIG9wdGlvbmFsUGFyYW1zIEludGVycG9sYXRpb24gdmFsdWVzIGZvciB0aGUgbWVzc2FnZSBpbiBcInByaW50ZlwiIGZvcm1hdFxuICAgICAqL1xuICAgIGRlYnVnKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50TG9nTGV2ZWwgPj0gTG9nTGV2ZWxzRW51bS5ERUJVRykge1xuXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VCdXMobWVzc2FnZSwgJ0RFQlVHJyk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcobWVzc2FnZSwgLi4ub3B0aW9uYWxQYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIFwiSU5GT1wiIGxldmVsLlxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE1lc3NhZ2UgdG8gbG9nXG4gICAgICogQHBhcmFtIG9wdGlvbmFsUGFyYW1zIEludGVycG9sYXRpb24gdmFsdWVzIGZvciB0aGUgbWVzc2FnZSBpbiBcInByaW50ZlwiIGZvcm1hdFxuICAgICAqL1xuICAgIGluZm8obWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRMb2dMZXZlbCA+PSBMb2dMZXZlbHNFbnVtLklORk8pIHtcblxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlQnVzKG1lc3NhZ2UsICdJTkZPJyk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2dzIGEgbWVzc2FnZSBhdCBhbnkgbGV2ZWwgZnJvbSBcIlRSQUNFXCIgdXB3YXJkcy5cbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBNZXNzYWdlIHRvIGxvZ1xuICAgICAqIEBwYXJhbSBvcHRpb25hbFBhcmFtcyBJbnRlcnBvbGF0aW9uIHZhbHVlcyBmb3IgdGhlIG1lc3NhZ2UgaW4gXCJwcmludGZcIiBmb3JtYXRcbiAgICAgKi9cbiAgICBsb2cobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRMb2dMZXZlbCA+PSBMb2dMZXZlbHNFbnVtLlRSQUNFKSB7XG5cbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUJ1cyhtZXNzYWdlLCAnTE9HJyk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UsIC4uLm9wdGlvbmFsUGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBcIlRSQUNFXCIgbGV2ZWwuXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0byBsb2dcbiAgICAgKiBAcGFyYW0gb3B0aW9uYWxQYXJhbXMgSW50ZXJwb2xhdGlvbiB2YWx1ZXMgZm9yIHRoZSBtZXNzYWdlIGluIFwicHJpbnRmXCIgZm9ybWF0XG4gICAgICovXG4gICAgdHJhY2UobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRMb2dMZXZlbCA+PSBMb2dMZXZlbHNFbnVtLlRSQUNFKSB7XG5cbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUJ1cyhtZXNzYWdlLCAnVFJBQ0UnKTtcblxuICAgICAgICAgICAgY29uc29sZS50cmFjZShtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2dzIGEgbWVzc2FnZSBhdCB0aGUgXCJXQVJOXCIgbGV2ZWwuXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0byBsb2dcbiAgICAgKiBAcGFyYW0gb3B0aW9uYWxQYXJhbXMgSW50ZXJwb2xhdGlvbiB2YWx1ZXMgZm9yIHRoZSBtZXNzYWdlIGluIFwicHJpbnRmXCIgZm9ybWF0XG4gICAgICovXG4gICAgd2FybihtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudExvZ0xldmVsID49IExvZ0xldmVsc0VudW0uV0FSTikge1xuXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VCdXMobWVzc2FnZSwgJ1dBUk4nKTtcblxuICAgICAgICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UsIC4uLm9wdGlvbmFsUGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvZ3MgYSBtZXNzYWdlIGlmIGEgYm9vbGVhbiB0ZXN0IGZhaWxzLlxuICAgICAqIEBwYXJhbSB0ZXN0IFRlc3QgdmFsdWUgKHR5cGljYWxseSBhIGJvb2xlYW4gZXhwcmVzc2lvbilcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBNZXNzYWdlIHRvIHNob3cgaWYgdGVzdCBpcyBmYWxzZVxuICAgICAqIEBwYXJhbSBvcHRpb25hbFBhcmFtcyBJbnRlcnBvbGF0aW9uIHZhbHVlcyBmb3IgdGhlIG1lc3NhZ2UgaW4gXCJwcmludGZcIiBmb3JtYXRcbiAgICAgKi9cbiAgICBhc3NlcnQodGVzdD86IGJvb2xlYW4sIG1lc3NhZ2U/OiBzdHJpbmcsIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50TG9nTGV2ZWwgIT09IExvZ0xldmVsc0VudW0uU0lMRU5UKSB7XG5cbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUJ1cyhtZXNzYWdlLCAnQVNTRVJUJyk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KHRlc3QsIG1lc3NhZ2UsIC4uLm9wdGlvbmFsUGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0cyBhbiBpbmRlbnRlZCBncm91cCBvZiBsb2cgbWVzc2FnZXMuXG4gICAgICogQHBhcmFtIGdyb3VwVGl0bGUgVGl0bGUgc2hvd24gYXQgdGhlIHN0YXJ0IG9mIHRoZSBncm91cFxuICAgICAqIEBwYXJhbSBvcHRpb25hbFBhcmFtcyBJbnRlcnBvbGF0aW9uIHZhbHVlcyBmb3IgdGhlIHRpdGxlIGluIFwicHJpbnRmXCIgZm9ybWF0XG4gICAgICovXG4gICAgZ3JvdXAoZ3JvdXBUaXRsZT86IHN0cmluZywgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRMb2dMZXZlbCAhPT0gTG9nTGV2ZWxzRW51bS5TSUxFTlQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXAoZ3JvdXBUaXRsZSwgLi4ub3B0aW9uYWxQYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5kcyBhIGluZGVudGVkIGdyb3VwIG9mIGxvZyBtZXNzYWdlcy5cbiAgICAgKi9cbiAgICBncm91cEVuZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudExvZ0xldmVsICE9PSBMb2dMZXZlbHNFbnVtLlNJTEVOVCkge1xuICAgICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYSBsb2cgbGV2ZWwgbmFtZSBzdHJpbmcgaW50byBpdHMgbnVtZXJpYyBlcXVpdmFsZW50LlxuICAgICAqIEBwYXJhbSBsZXZlbCBMZXZlbCBuYW1lXG4gICAgICogQHJldHVybnMgTnVtZXJpYyBsb2cgbGV2ZWxcbiAgICAgKi9cbiAgICBnZXRMb2dMZXZlbChsZXZlbDogc3RyaW5nKTogTG9nTGV2ZWxzRW51bSB7XG4gICAgICAgIGNvbnN0IHJlZmVyZW5jZWRMZXZlbCA9IGxvZ0xldmVscy5maW5kKChjdXJyZW50TGV2ZWw6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRMZXZlbC5uYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT09IGxldmVsLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZWZlcmVuY2VkTGV2ZWwgPyByZWZlcmVuY2VkTGV2ZWwubGV2ZWwgOiA1O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXJzIG5vdGlmaWNhdGlvbiBjYWxsYmFjayBmb3IgbG9nIG1lc3NhZ2VzLlxuICAgICAqIEBwYXJhbSB0ZXh0IE1lc3NhZ2UgdGV4dFxuICAgICAqIEBwYXJhbSBsb2dMZXZlbCBMb2cgbGV2ZWwgZm9yIHRoZSBtZXNzYWdlXG4gICAgICovXG4gICAgbWVzc2FnZUJ1cyh0ZXh0OiBzdHJpbmcsIGxvZ0xldmVsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2UubmV4dCh7IHRleHQ6IHRleHQsIHR5cGU6IGxvZ0xldmVsIH0pO1xuICAgIH1cbn1cbiJdfQ==
