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
export { CardViewBaseItemModel } from './card-view-baseitem.model';
export { CardViewBoolItemModel } from './card-view-boolitem.model';
export { CardViewDateItemModel } from './card-view-dateitem.model';
export { CardViewDatetimeItemModel } from './card-view-datetimeitem.model';
export { CardViewFloatItemModel } from './card-view-floatitem.model';
export { CardViewIntItemModel } from './card-view-intitem.model';
export { CardViewMapItemModel } from './card-view-mapitem.model';
export { CardViewTextItemModel } from './card-view-textitem.model';
export {
  CardViewKeyValuePairsItemModel
} from './card-view-keyvaluepairs.model';
export { CardViewSelectItemModel } from './card-view-selectitem.model';
export { CardViewArrayItemModel } from './card-view-arrayitem.model';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3Lm1vZGVscy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNhcmQtdmlldy9tb2RlbHMvY2FyZC12aWV3Lm1vZGVscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxzQ0FBYyw0QkFBNEIsQ0FBQztBQUMzQyxzQ0FBYyw0QkFBNEIsQ0FBQztBQUMzQyxzQ0FBYyw0QkFBNEIsQ0FBQztBQUMzQywwQ0FBYyxnQ0FBZ0MsQ0FBQztBQUMvQyx1Q0FBYyw2QkFBNkIsQ0FBQztBQUM1QyxxQ0FBYywyQkFBMkIsQ0FBQztBQUMxQyxxQ0FBYywyQkFBMkIsQ0FBQztBQUMxQyxzQ0FBYyw0QkFBNEIsQ0FBQztBQUMzQywrQ0FBYyxpQ0FBaUMsQ0FBQztBQUNoRCx3Q0FBYyw4QkFBOEIsQ0FBQztBQUM3Qyx1Q0FBYyw2QkFBNkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vY2FyZC12aWV3LWJhc2VpdGVtLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vY2FyZC12aWV3LWJvb2xpdGVtLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vY2FyZC12aWV3LWRhdGVpdGVtLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vY2FyZC12aWV3LWRhdGV0aW1laXRlbS5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL2NhcmQtdmlldy1mbG9hdGl0ZW0ubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9jYXJkLXZpZXctaW50aXRlbS5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL2NhcmQtdmlldy1tYXBpdGVtLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vY2FyZC12aWV3LXRleHRpdGVtLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vY2FyZC12aWV3LWtleXZhbHVlcGFpcnMubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9jYXJkLXZpZXctc2VsZWN0aXRlbS5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL2NhcmQtdmlldy1hcnJheWl0ZW0ubW9kZWwnO1xuIl19
