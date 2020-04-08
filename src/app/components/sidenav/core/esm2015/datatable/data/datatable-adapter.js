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
/**
 * @record
 */
export function DataTableAdapter() {}
if (false) {
  /** @type {?|undefined} */
  DataTableAdapter.prototype.rowsChanged;
  /** @type {?} */
  DataTableAdapter.prototype.selectedRow;
  /**
   * @return {?}
   */
  DataTableAdapter.prototype.getRows = function() {};
  /**
   * @param {?} rows
   * @return {?}
   */
  DataTableAdapter.prototype.setRows = function(rows) {};
  /**
   * @return {?}
   */
  DataTableAdapter.prototype.getColumns = function() {};
  /**
   * @param {?} columns
   * @return {?}
   */
  DataTableAdapter.prototype.setColumns = function(columns) {};
  /**
   * @param {?} row
   * @param {?} col
   * @param {?=} resolverFn
   * @return {?}
   */
  DataTableAdapter.prototype.getValue = function(row, col, resolverFn) {};
  /**
   * @return {?}
   */
  DataTableAdapter.prototype.getSorting = function() {};
  /**
   * @param {?} sorting
   * @return {?}
   */
  DataTableAdapter.prototype.setSorting = function(sorting) {};
  /**
   * @param {?=} key
   * @param {?=} direction
   * @return {?}
   */
  DataTableAdapter.prototype.sort = function(key, direction) {};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXRhYmxlLWFkYXB0ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkYXRhdGFibGUvZGF0YS9kYXRhdGFibGUtYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQSxzQ0FZQzs7O0lBWEcsdUNBQXNDOztJQUV0Qyx1Q0FBcUI7Ozs7SUFDckIscURBQTBCOzs7OztJQUMxQix5REFBb0M7Ozs7SUFDcEMsd0RBQWdDOzs7OztJQUNoQywrREFBNkM7Ozs7Ozs7SUFDN0MsMEVBQWtHOzs7O0lBQ2xHLHdEQUEwQjs7Ozs7SUFDMUIsK0RBQXVDOzs7Ozs7SUFDdkMsZ0VBQTZDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgRGF0YUNvbHVtbiB9IGZyb20gJy4vZGF0YS1jb2x1bW4ubW9kZWwnO1xuaW1wb3J0IHsgRGF0YVJvdyB9IGZyb20gJy4vZGF0YS1yb3cubW9kZWwnO1xuaW1wb3J0IHsgRGF0YVNvcnRpbmcgfSBmcm9tICcuL2RhdGEtc29ydGluZy5tb2RlbCc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGF0YVRhYmxlQWRhcHRlciB7XG4gICAgcm93c0NoYW5nZWQ/OiBTdWJqZWN0PEFycmF5PERhdGFSb3c+PjtcblxuICAgIHNlbGVjdGVkUm93OiBEYXRhUm93O1xuICAgIGdldFJvd3MoKTogQXJyYXk8RGF0YVJvdz47XG4gICAgc2V0Um93cyhyb3dzOiBBcnJheTxEYXRhUm93Pik6IHZvaWQ7XG4gICAgZ2V0Q29sdW1ucygpOiBBcnJheTxEYXRhQ29sdW1uPjtcbiAgICBzZXRDb2x1bW5zKGNvbHVtbnM6IEFycmF5PERhdGFDb2x1bW4+KTogdm9pZDtcbiAgICBnZXRWYWx1ZShyb3c6IERhdGFSb3csIGNvbDogRGF0YUNvbHVtbiwgcmVzb2x2ZXJGbj86IChyb3c6IERhdGFSb3csIGNvbDogRGF0YUNvbHVtbikgPT4gYW55KTogYW55O1xuICAgIGdldFNvcnRpbmcoKTogRGF0YVNvcnRpbmc7XG4gICAgc2V0U29ydGluZyhzb3J0aW5nOiBEYXRhU29ydGluZyk6IHZvaWQ7XG4gICAgc29ydChrZXk/OiBzdHJpbmcsIGRpcmVjdGlvbj86IHN0cmluZyk6IHZvaWQ7XG59XG4iXX0=
