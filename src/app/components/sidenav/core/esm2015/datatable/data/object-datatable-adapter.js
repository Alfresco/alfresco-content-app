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
import { ObjectDataRow } from './object-datarow.model';
import { ObjectDataColumn } from './object-datacolumn.model';
import { DataSorting } from './data-sorting.model';
import { Subject } from 'rxjs';
// Simple implementation of the DataTableAdapter interface.
export class ObjectDataTableAdapter {
  /**
   * @param {?} data
   * @return {?}
   */
  static generateSchema(data) {
    /** @type {?} */
    const schema = [];
    if (data && data.length) {
      /** @type {?} */
      const rowToExaminate = data[0];
      if (typeof rowToExaminate === 'object') {
        for (const key in rowToExaminate) {
          if (rowToExaminate.hasOwnProperty(key)) {
            schema.push({
              type: 'text',
              key: key,
              title: key,
              sortable: false
            });
          }
        }
      }
    }
    return schema;
  }
  /**
   * @param {?=} data
   * @param {?=} schema
   */
  constructor(data = [], schema = []) {
    this._rows = [];
    this._columns = [];
    if (data && data.length > 0) {
      this._rows = data.map(
        /**
         * @param {?} item
         * @return {?}
         */
        item => {
          return new ObjectDataRow(item);
        }
      );
    }
    if (schema && schema.length > 0) {
      this._columns = schema.map(
        /**
         * @param {?} item
         * @return {?}
         */
        item => {
          return new ObjectDataColumn(item);
        }
      );
      // Sort by first sortable or just first column
      /** @type {?} */
      const sortable = this._columns.filter(
        /**
         * @param {?} column
         * @return {?}
         */
        (column => column.sortable)
      );
      if (sortable.length > 0) {
        this.sort(sortable[0].key, 'asc');
      }
    }
    this.rowsChanged = new Subject();
  }
  /**
   * @return {?}
   */
  getRows() {
    return this._rows;
  }
  /**
   * @param {?} rows
   * @return {?}
   */
  setRows(rows) {
    this._rows = rows || [];
    this.sort();
    this.rowsChanged.next(this._rows);
  }
  /**
   * @return {?}
   */
  getColumns() {
    return this._columns;
  }
  /**
   * @param {?} columns
   * @return {?}
   */
  setColumns(columns) {
    this._columns = columns || [];
  }
  /**
   * @param {?} row
   * @param {?} col
   * @param {?=} resolver
   * @return {?}
   */
  getValue(row, col, resolver) {
    if (!row) {
      throw new Error('Row not found');
    }
    if (!col) {
      throw new Error('Column not found');
    }
    if (resolver) {
      return resolver(row, col);
    }
    /** @type {?} */
    const value = row.getValue(col.key);
    if (col.type === 'icon') {
      /** @type {?} */
      const icon = row.getValue(col.key);
      return icon;
    }
    return value;
  }
  /**
   * @return {?}
   */
  getSorting() {
    return this._sorting;
  }
  /**
   * @param {?} sorting
   * @return {?}
   */
  setSorting(sorting) {
    this._sorting = sorting;
    if (sorting && sorting.key) {
      this._rows.sort(
        /**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => {
          /** @type {?} */
          let left = a.getValue(sorting.key);
          if (left) {
            left =
              left instanceof Date
                ? left.valueOf().toString()
                : left.toString();
          } else {
            left = '';
          }
          /** @type {?} */
          let right = b.getValue(sorting.key);
          if (right) {
            right =
              right instanceof Date
                ? right.valueOf().toString()
                : right.toString();
          } else {
            right = '';
          }
          return sorting.direction === 'asc'
            ? left.localeCompare(right)
            : right.localeCompare(left);
        }
      );
    }
  }
  /**
   * @param {?=} key
   * @param {?=} direction
   * @return {?}
   */
  sort(key, direction) {
    /** @type {?} */
    const sorting = this._sorting || new DataSorting();
    if (key) {
      sorting.key = key;
      sorting.direction = direction || 'asc';
    }
    this.setSorting(sorting);
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  ObjectDataTableAdapter.prototype._sorting;
  /**
   * @type {?}
   * @private
   */
  ObjectDataTableAdapter.prototype._rows;
  /**
   * @type {?}
   * @private
   */
  ObjectDataTableAdapter.prototype._columns;
  /** @type {?} */
  ObjectDataTableAdapter.prototype.selectedRow;
  /** @type {?} */
  ObjectDataTableAdapter.prototype.rowsChanged;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LWRhdGF0YWJsZS1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZGF0YXRhYmxlL2RhdGEvb2JqZWN0LWRhdGF0YWJsZS1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFbkQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFHL0IsTUFBTSxPQUFPLHNCQUFzQjs7Ozs7SUFTL0IsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFXOztjQUN2QixNQUFNLEdBQUcsRUFBRTtRQUVqQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFOztrQkFDZixjQUFjLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUU5QixJQUFJLE9BQU8sY0FBYyxLQUFLLFFBQVEsRUFBRTtnQkFDcEMsS0FBSyxNQUFNLEdBQUcsSUFBSSxjQUFjLEVBQUU7b0JBQzlCLElBQUksY0FBYyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQzs0QkFDUixJQUFJLEVBQUUsTUFBTTs0QkFDWixHQUFHLEVBQUUsR0FBRzs0QkFDUixLQUFLLEVBQUUsR0FBRzs0QkFDVixRQUFRLEVBQUUsS0FBSzt5QkFDbEIsQ0FBQyxDQUFDO3FCQUNOO2lCQUNKO2FBQ0o7U0FFSjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Ozs7O0lBRUQsWUFBWSxPQUFjLEVBQUUsRUFBRSxTQUF1QixFQUFFO1FBQ25ELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FB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OEI7Ozs7O0lBQzlCLHVDQUF5Qjs7Ozs7SUFDekIsMENBQStCOztJQUUvQiw2Q0FBcUI7O0lBQ3JCLDZDQUFxQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IERhdGFDb2x1bW4gfSBmcm9tICcuL2RhdGEtY29sdW1uLm1vZGVsJztcbmltcG9ydCB7IERhdGFSb3cgfSBmcm9tICcuL2RhdGEtcm93Lm1vZGVsJztcbmltcG9ydCB7IE9iamVjdERhdGFSb3cgfSBmcm9tICcuL29iamVjdC1kYXRhcm93Lm1vZGVsJztcbmltcG9ydCB7IE9iamVjdERhdGFDb2x1bW4gfSBmcm9tICcuL29iamVjdC1kYXRhY29sdW1uLm1vZGVsJztcbmltcG9ydCB7IERhdGFTb3J0aW5nIH0gZnJvbSAnLi9kYXRhLXNvcnRpbmcubW9kZWwnO1xuaW1wb3J0IHsgRGF0YVRhYmxlQWRhcHRlciB9IGZyb20gJy4vZGF0YXRhYmxlLWFkYXB0ZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG4vLyBTaW1wbGUgaW1wbGVtZW50YXRpb24gb2YgdGhlIERhdGFUYWJsZUFkYXB0ZXIgaW50ZXJmYWNlLlxuZXhwb3J0IGNsYXNzIE9iamVjdERhdGFUYWJsZUFkYXB0ZXIgaW1wbGVtZW50cyBEYXRhVGFibGVBZGFwdGVyIHtcblxuICAgIHByaXZhdGUgX3NvcnRpbmc6IERhdGFTb3J0aW5nO1xuICAgIHByaXZhdGUgX3Jvd3M6IERhdGFSb3dbXTtcbiAgICBwcml2YXRlIF9jb2x1bW5zOiBEYXRhQ29sdW1uW107XG5cbiAgICBzZWxlY3RlZFJvdzogRGF0YVJvdztcbiAgICByb3dzQ2hhbmdlZDogU3ViamVjdDxBcnJheTxEYXRhUm93Pj47XG5cbiAgICBzdGF0aWMgZ2VuZXJhdGVTY2hlbWEoZGF0YTogYW55W10pIHtcbiAgICAgICAgY29uc3Qgc2NoZW1hID0gW107XG5cbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd1RvRXhhbWluYXRlID0gZGF0YVswXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiByb3dUb0V4YW1pbmF0ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiByb3dUb0V4YW1pbmF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93VG9FeGFtaW5hdGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NoZW1hLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2NoZW1hO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGRhdGE6IGFueVtdID0gW10sIHNjaGVtYTogRGF0YUNvbHVtbltdID0gW10pIHtcbiAgICAgICAgdGhpcy5fcm93cyA9IFtdO1xuICAgICAgICB0aGlzLl9jb2x1bW5zID0gW107XG5cbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9yb3dzID0gZGF0YS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE9iamVjdERhdGFSb3coaXRlbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY2hlbWEgJiYgc2NoZW1hLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtbnMgPSBzY2hlbWEubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBPYmplY3REYXRhQ29sdW1uKGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFNvcnQgYnkgZmlyc3Qgc29ydGFibGUgb3IganVzdCBmaXJzdCBjb2x1bW5cbiAgICAgICAgICAgIGNvbnN0IHNvcnRhYmxlID0gdGhpcy5fY29sdW1ucy5maWx0ZXIoKGNvbHVtbikgPT4gY29sdW1uLnNvcnRhYmxlKTtcbiAgICAgICAgICAgIGlmIChzb3J0YWJsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3J0KHNvcnRhYmxlWzBdLmtleSwgJ2FzYycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yb3dzQ2hhbmdlZCA9IG5ldyBTdWJqZWN0PEFycmF5PERhdGFSb3c+PigpO1xuICAgIH1cblxuICAgIGdldFJvd3MoKTogQXJyYXk8RGF0YVJvdz4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcm93cztcbiAgICB9XG5cbiAgICBzZXRSb3dzKHJvd3M6IEFycmF5PERhdGFSb3c+KSB7XG4gICAgICAgIHRoaXMuX3Jvd3MgPSByb3dzIHx8IFtdO1xuICAgICAgICB0aGlzLnNvcnQoKTtcbiAgICAgICAgdGhpcy5yb3dzQ2hhbmdlZC5uZXh0KHRoaXMuX3Jvd3MpO1xuICAgIH1cblxuICAgIGdldENvbHVtbnMoKTogQXJyYXk8RGF0YUNvbHVtbj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgICB9XG5cbiAgICBzZXRDb2x1bW5zKGNvbHVtbnM6IEFycmF5PERhdGFDb2x1bW4+KSB7XG4gICAgICAgIHRoaXMuX2NvbHVtbnMgPSBjb2x1bW5zIHx8IFtdO1xuICAgIH1cblxuICAgIGdldFZhbHVlKHJvdzogRGF0YVJvdywgY29sOiBEYXRhQ29sdW1uLCByZXNvbHZlcj86IChyb3c6IERhdGFSb3csIGNvbDogRGF0YUNvbHVtbikgPT4gYW55ICk6IGFueSB7XG4gICAgICAgIGlmICghcm93KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JvdyBub3QgZm91bmQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNvbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb2x1bW4gbm90IGZvdW5kJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlcihyb3csIGNvbCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2YWx1ZSA9IHJvdy5nZXRWYWx1ZShjb2wua2V5KTtcblxuICAgICAgICBpZiAoY29sLnR5cGUgPT09ICdpY29uJykge1xuICAgICAgICAgICAgY29uc3QgaWNvbiA9IHJvdy5nZXRWYWx1ZShjb2wua2V5KTtcbiAgICAgICAgICAgIHJldHVybiBpY29uO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdldFNvcnRpbmcoKTogRGF0YVNvcnRpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fc29ydGluZztcbiAgICB9XG5cbiAgICBzZXRTb3J0aW5nKHNvcnRpbmc6IERhdGFTb3J0aW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3NvcnRpbmcgPSBzb3J0aW5nO1xuXG4gICAgICAgIGlmIChzb3J0aW5nICYmIHNvcnRpbmcua2V5KSB7XG4gICAgICAgICAgICB0aGlzLl9yb3dzLnNvcnQoKGE6IERhdGFSb3csIGI6IERhdGFSb3cpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbGVmdCA9IGEuZ2V0VmFsdWUoc29ydGluZy5rZXkpO1xuICAgICAgICAgICAgICAgIGlmIChsZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSAobGVmdCBpbnN0YW5jZW9mIERhdGUpID8gbGVmdC52YWx1ZU9mKCkudG9TdHJpbmcoKSA6IGxlZnQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHJpZ2h0ID0gYi5nZXRWYWx1ZShzb3J0aW5nLmtleSk7XG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gKHJpZ2h0IGluc3RhbmNlb2YgRGF0ZSkgPyByaWdodC52YWx1ZU9mKCkudG9TdHJpbmcoKSA6IHJpZ2h0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc29ydGluZy5kaXJlY3Rpb24gPT09ICdhc2MnXG4gICAgICAgICAgICAgICAgICAgID8gbGVmdC5sb2NhbGVDb21wYXJlKHJpZ2h0KVxuICAgICAgICAgICAgICAgICAgICA6IHJpZ2h0LmxvY2FsZUNvbXBhcmUobGVmdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvcnQoa2V5Pzogc3RyaW5nLCBkaXJlY3Rpb24/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc29ydGluZyA9IHRoaXMuX3NvcnRpbmcgfHwgbmV3IERhdGFTb3J0aW5nKCk7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIHNvcnRpbmcua2V5ID0ga2V5O1xuICAgICAgICAgICAgc29ydGluZy5kaXJlY3Rpb24gPSBkaXJlY3Rpb24gfHwgJ2FzYyc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTb3J0aW5nKHNvcnRpbmcpO1xuICAgIH1cbn1cbiJdfQ==
