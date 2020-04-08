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
export class LogLevelsEnum extends Number {}
LogLevelsEnum.TRACE = 5;
LogLevelsEnum.DEBUG = 4;
LogLevelsEnum.INFO = 3;
LogLevelsEnum.WARN = 2;
LogLevelsEnum.ERROR = 1;
LogLevelsEnum.SILENT = 0;
if (false) {
  /** @type {?} */
  LogLevelsEnum.TRACE;
  /** @type {?} */
  LogLevelsEnum.DEBUG;
  /** @type {?} */
  LogLevelsEnum.INFO;
  /** @type {?} */
  LogLevelsEnum.WARN;
  /** @type {?} */
  LogLevelsEnum.ERROR;
  /** @type {?} */
  LogLevelsEnum.SILENT;
}
/** @type {?} */
export let logLevels = [
  { level: LogLevelsEnum.TRACE, name: 'TRACE' },
  { level: LogLevelsEnum.DEBUG, name: 'DEBUG' },
  { level: LogLevelsEnum.INFO, name: 'INFO' },
  { level: LogLevelsEnum.WARN, name: 'WARN' },
  { level: LogLevelsEnum.ERROR, name: 'ERROR' },
  { level: LogLevelsEnum.SILENT, name: 'SILENT' }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWxldmVscy5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbIm1vZGVscy9sb2ctbGV2ZWxzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE1BQU0sT0FBTyxhQUFjLFNBQVEsTUFBTTs7QUFDOUIsbUJBQUssR0FBVyxDQUFDLENBQUM7QUFDbEIsbUJBQUssR0FBVyxDQUFDLENBQUM7QUFDbEIsa0JBQUksR0FBVyxDQUFDLENBQUM7QUFDakIsa0JBQUksR0FBVyxDQUFDLENBQUM7QUFDakIsbUJBQUssR0FBVyxDQUFDLENBQUM7QUFDbEIsb0JBQU0sR0FBVyxDQUFDLENBQUM7OztJQUwxQixvQkFBeUI7O0lBQ3pCLG9CQUF5Qjs7SUFDekIsbUJBQXdCOztJQUN4QixtQkFBd0I7O0lBQ3hCLG9CQUF5Qjs7SUFDekIscUJBQTBCOzs7QUFHOUIsTUFBTSxLQUFLLFNBQVMsR0FBVTtJQUMxQixFQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUM7SUFDM0MsRUFBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFDO0lBQzNDLEVBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBQztJQUN6QyxFQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUM7SUFDekMsRUFBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFDO0lBQzNDLEVBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBQztDQUNoRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCBjbGFzcyBMb2dMZXZlbHNFbnVtIGV4dGVuZHMgTnVtYmVyIHtcbiAgICBzdGF0aWMgVFJBQ0U6IG51bWJlciA9IDU7XG4gICAgc3RhdGljIERFQlVHOiBudW1iZXIgPSA0O1xuICAgIHN0YXRpYyBJTkZPOiBudW1iZXIgPSAzO1xuICAgIHN0YXRpYyBXQVJOOiBudW1iZXIgPSAyO1xuICAgIHN0YXRpYyBFUlJPUjogbnVtYmVyID0gMTtcbiAgICBzdGF0aWMgU0lMRU5UOiBudW1iZXIgPSAwO1xufVxuXG5leHBvcnQgbGV0IGxvZ0xldmVsczogYW55W10gPSBbXG4gICAge2xldmVsOiBMb2dMZXZlbHNFbnVtLlRSQUNFLCBuYW1lOiAnVFJBQ0UnfSxcbiAgICB7bGV2ZWw6IExvZ0xldmVsc0VudW0uREVCVUcsIG5hbWU6ICdERUJVRyd9LFxuICAgIHtsZXZlbDogTG9nTGV2ZWxzRW51bS5JTkZPLCBuYW1lOiAnSU5GTyd9LFxuICAgIHtsZXZlbDogTG9nTGV2ZWxzRW51bS5XQVJOLCBuYW1lOiAnV0FSTid9LFxuICAgIHtsZXZlbDogTG9nTGV2ZWxzRW51bS5FUlJPUiwgbmFtZTogJ0VSUk9SJ30sXG4gICAge2xldmVsOiBMb2dMZXZlbHNFbnVtLlNJTEVOVCwgbmFtZTogJ1NJTEVOVCd9XG5dO1xuIl19
