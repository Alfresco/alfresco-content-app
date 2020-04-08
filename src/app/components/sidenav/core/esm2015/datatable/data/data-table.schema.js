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
import { ContentChild, Input } from '@angular/core';
import { DataColumnListComponent } from '../../data-column/data-column-list.component';
import { ObjectDataColumn } from './object-datacolumn.model';
/**
 * @abstract
 */
export class DataTableSchema {
  /**
   * @param {?} appConfigService
   * @param {?} presetKey
   * @param {?} presetsModel
   */
  constructor(appConfigService, presetKey, presetsModel) {
    this.appConfigService = appConfigService;
    this.presetKey = presetKey;
    this.presetsModel = presetsModel;
    this.layoutPresets = {};
  }
  /**
   * @return {?}
   */
  createDatatableSchema() {
    this.loadLayoutPresets();
    if (!this.columns || this.columns.length === 0) {
      this.columns = this.mergeJsonAndHtmlSchema();
    }
  }
  /**
   * @return {?}
   */
  loadLayoutPresets() {
    /** @type {?} */
    const externalSettings = this.appConfigService.get(this.presetKey, null);
    if (externalSettings) {
      this.layoutPresets = Object.assign(
        {},
        this.presetsModel,
        externalSettings
      );
    } else {
      this.layoutPresets = this.presetsModel;
    }
  }
  /**
   * @return {?}
   */
  mergeJsonAndHtmlSchema() {
    /** @type {?} */
    let customSchemaColumns = this.getSchemaFromConfig(
      this.presetColumn
    ).concat(this.getSchemaFromHtml(this.columnList));
    if (customSchemaColumns.length === 0) {
      customSchemaColumns = this.getDefaultLayoutPreset();
    }
    return customSchemaColumns;
  }
  /**
   * @param {?} columnList
   * @return {?}
   */
  getSchemaFromHtml(columnList) {
    /** @type {?} */
    let schema = [];
    if (columnList && columnList.columns && columnList.columns.length > 0) {
      schema = columnList.columns.map(
        /**
         * @param {?} c
         * @return {?}
         */
        c => /** @type {?} */ (c)
      );
    }
    return schema;
  }
  /**
   * @param {?} presetColumn
   * @return {?}
   */
  getSchemaFromConfig(presetColumn) {
    return presetColumn
      ? this.layoutPresets[presetColumn].map(
          /**
           * @param {?} col
           * @return {?}
           */
          col => new ObjectDataColumn(col)
        )
      : [];
  }
  /**
   * @private
   * @return {?}
   */
  getDefaultLayoutPreset() {
    return this.layoutPresets['default'].map(
      /**
       * @param {?} col
       * @return {?}
       */
      col => new ObjectDataColumn(col)
    );
  }
}
DataTableSchema.propDecorators = {
  columnList: [{ type: ContentChild, args: [DataColumnListComponent] }],
  presetColumn: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  DataTableSchema.prototype.columnList;
  /**
   * Custom preset column schema in JSON format.
   * @type {?}
   */
  DataTableSchema.prototype.presetColumn;
  /** @type {?} */
  DataTableSchema.prototype.columns;
  /**
   * @type {?}
   * @private
   */
  DataTableSchema.prototype.layoutPresets;
  /**
   * @type {?}
   * @private
   */
  DataTableSchema.prototype.appConfigService;
  /**
   * @type {?}
   * @protected
   */
  DataTableSchema.prototype.presetKey;
  /**
   * @type {?}
   * @protected
   */
  DataTableSchema.prototype.presetsModel;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10YWJsZS5zY2hlbWEuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkYXRhdGFibGUvZGF0YS9kYXRhLXRhYmxlLnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVwRCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUV2RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7OztBQUU3RCxNQUFNLE9BQWdCLGVBQWU7Ozs7OztJQVlqQyxZQUFvQixnQkFBa0MsRUFDaEMsU0FBaUIsRUFDakIsWUFBaUI7UUFGbkIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNoQyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLGlCQUFZLEdBQVosWUFBWSxDQUFLO1FBSi9CLGtCQUFhLEdBQUcsRUFBRSxDQUFDO0lBSWdCLENBQUM7Ozs7SUFFckMscUJBQXFCO1FBQ3hCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1NBQ2hEO0lBQ0wsQ0FBQzs7OztJQUVNLGlCQUFpQjs7Y0FDZCxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO1FBQ3hFLElBQUksZ0JBQWdCLEVBQUU7WUFDbEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUM7U0FDL0U7YUFBTTtZQUNILElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUMxQztJQUNMLENBQUM7Ozs7SUFFTSxzQkFBc0I7O1lBQ3JCLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckgsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1NBQ3ZEO1FBQ0QsT0FBTyxtQkFBbUIsQ0FBQztJQUMvQixDQUFDOzs7OztJQUVNLGlCQUFpQixDQUFDLFVBQW1DOztZQUNwRCxNQUFNLEdBQUcsRUFBRTtRQUNmLElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxPQUFPLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25FLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUc7Ozs7WUFBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsbUJBQWEsQ0FBQyxFQUFBLEVBQUMsQ0FBQztTQUMxRDtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Ozs7O0lBRUssbUJBQW1CLENBQUMsWUFBb0I7UUFDMUMsT0FBTyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUc7Ozs7UUFBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDMUcsQ0FBQzs7Ozs7SUFFTyxzQkFBc0I7UUFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHOzs7O1FBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQztJQUNuRixDQUFDOzs7eUJBcERBLFlBQVksU0FBQyx1QkFBdUI7MkJBR3BDLEtBQUs7Ozs7SUFITixxQ0FBMkU7Ozs7O0lBRzNFLHVDQUNxQjs7SUFFckIsa0NBQWE7Ozs7O0lBRWIsd0NBQTJCOzs7OztJQUVmLDJDQUEwQzs7Ozs7SUFDMUMsb0NBQTJCOzs7OztJQUMzQix1Q0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb250ZW50Q2hpbGQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBcHBDb25maWdTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYXBwLWNvbmZpZy9hcHAtY29uZmlnLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0YUNvbHVtbkxpc3RDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kYXRhLWNvbHVtbi9kYXRhLWNvbHVtbi1saXN0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEYXRhQ29sdW1uIH0gZnJvbSAnLi9kYXRhLWNvbHVtbi5tb2RlbCc7XG5pbXBvcnQgeyBPYmplY3REYXRhQ29sdW1uIH0gZnJvbSAnLi9vYmplY3QtZGF0YWNvbHVtbi5tb2RlbCc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBEYXRhVGFibGVTY2hlbWEge1xuXG4gICAgQENvbnRlbnRDaGlsZChEYXRhQ29sdW1uTGlzdENvbXBvbmVudCkgY29sdW1uTGlzdDogRGF0YUNvbHVtbkxpc3RDb21wb25lbnQ7XG5cbiAgICAvKiogQ3VzdG9tIHByZXNldCBjb2x1bW4gc2NoZW1hIGluIEpTT04gZm9ybWF0LiAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHJlc2V0Q29sdW1uOiBzdHJpbmc7XG5cbiAgICBjb2x1bW5zOiBhbnk7XG5cbiAgICBwcml2YXRlIGxheW91dFByZXNldHMgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwQ29uZmlnU2VydmljZTogQXBwQ29uZmlnU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgcHJlc2V0S2V5OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgcHJvdGVjdGVkIHByZXNldHNNb2RlbDogYW55KSB7IH1cblxuICAgIHB1YmxpYyBjcmVhdGVEYXRhdGFibGVTY2hlbWEoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9hZExheW91dFByZXNldHMoKTtcbiAgICAgICAgaWYgKCF0aGlzLmNvbHVtbnMgfHwgdGhpcy5jb2x1bW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5zID0gdGhpcy5tZXJnZUpzb25BbmRIdG1sU2NoZW1hKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZExheW91dFByZXNldHMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGV4dGVybmFsU2V0dGluZ3MgPSB0aGlzLmFwcENvbmZpZ1NlcnZpY2UuZ2V0KHRoaXMucHJlc2V0S2V5LCBudWxsKTtcbiAgICAgICAgaWYgKGV4dGVybmFsU2V0dGluZ3MpIHtcbiAgICAgICAgICAgIHRoaXMubGF5b3V0UHJlc2V0cyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJlc2V0c01vZGVsLCBleHRlcm5hbFNldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubGF5b3V0UHJlc2V0cyA9IHRoaXMucHJlc2V0c01vZGVsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG1lcmdlSnNvbkFuZEh0bWxTY2hlbWEoKTogYW55IHtcbiAgICAgICAgbGV0IGN1c3RvbVNjaGVtYUNvbHVtbnMgPSB0aGlzLmdldFNjaGVtYUZyb21Db25maWcodGhpcy5wcmVzZXRDb2x1bW4pLmNvbmNhdCh0aGlzLmdldFNjaGVtYUZyb21IdG1sKHRoaXMuY29sdW1uTGlzdCkpO1xuICAgICAgICBpZiAoY3VzdG9tU2NoZW1hQ29sdW1ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGN1c3RvbVNjaGVtYUNvbHVtbnMgPSB0aGlzLmdldERlZmF1bHRMYXlvdXRQcmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VzdG9tU2NoZW1hQ29sdW1ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U2NoZW1hRnJvbUh0bWwoY29sdW1uTGlzdDogRGF0YUNvbHVtbkxpc3RDb21wb25lbnQpOiBhbnkge1xuICAgICAgICBsZXQgc2NoZW1hID0gW107XG4gICAgICAgIGlmIChjb2x1bW5MaXN0ICYmIGNvbHVtbkxpc3QuY29sdW1ucyAmJiBjb2x1bW5MaXN0LmNvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2NoZW1hID0gY29sdW1uTGlzdC5jb2x1bW5zLm1hcCgoYykgPT4gPERhdGFDb2x1bW4+IGMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2hlbWE7XG4gICAgfVxuXG4gICBwdWJsaWMgZ2V0U2NoZW1hRnJvbUNvbmZpZyhwcmVzZXRDb2x1bW46IHN0cmluZyk6IERhdGFDb2x1bW5bXSB7XG4gICAgICAgIHJldHVybiBwcmVzZXRDb2x1bW4gPyAodGhpcy5sYXlvdXRQcmVzZXRzW3ByZXNldENvbHVtbl0pLm1hcCgoY29sKSA9PiBuZXcgT2JqZWN0RGF0YUNvbHVtbihjb2wpKSA6IFtdO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RGVmYXVsdExheW91dFByZXNldCgpOiBEYXRhQ29sdW1uW10ge1xuICAgICAgICByZXR1cm4gKHRoaXMubGF5b3V0UHJlc2V0c1snZGVmYXVsdCddKS5tYXAoKGNvbCkgPT4gbmV3IE9iamVjdERhdGFDb2x1bW4oY29sKSk7XG4gICAgfVxufVxuIl19
