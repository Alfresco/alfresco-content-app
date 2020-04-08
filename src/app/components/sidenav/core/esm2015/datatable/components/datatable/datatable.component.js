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
import {
  ViewChildren,
  QueryList,
  HostListener,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  IterableDiffers,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Observable } from 'rxjs';
import { DataColumnListComponent } from '../../../data-column/data-column-list.component';
import { DataRowEvent } from '../../data/data-row-event.model';
import { DataSorting } from '../../data/data-sorting.model';
import { DataTableRowComponent } from './datatable-row.component';
import { ObjectDataRow } from '../../data/object-datarow.model';
import { ObjectDataTableAdapter } from '../../data/object-datatable-adapter';
import { DataCellEvent } from './data-cell.event';
import { DataRowActionEvent } from './data-row-action.event';
import { share, buffer, map, filter, debounceTime } from 'rxjs/operators';
/** @enum {string} */
const DisplayMode = {
  List: 'list',
  Gallery: 'gallery'
};
export { DisplayMode };
export class DataTableComponent {
  /**
   * @param {?} elementRef
   * @param {?} differs
   */
  constructor(elementRef, differs) {
    this.elementRef = elementRef;
    /**
     * Selects the display mode of the table. Can be "list" or "gallery".
     */
    this.display = DisplayMode.List;
    /**
     * The rows that the datatable will show.
     */
    this.rows = [];
    /**
     * Define the sort order of the datatable. Possible values are :
     * [`created`, `desc`], [`created`, `asc`], [`due`, `desc`], [`due`, `asc`]
     */
    this.sorting = [];
    /**
     * The columns that the datatable will show.
     */
    this.columns = [];
    /**
     * Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
     * you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows.
     */
    this.selectionMode = 'single'; // none|single|multiple
    // none|single|multiple
    /**
     * Toggles multiple row selection, which renders checkboxes at the beginning of each row.
     */
    this.multiselect = false;
    /**
     * Toggles the data actions column.
     */
    this.actions = false;
    /**
     * Position of the actions dropdown menu. Can be "left" or "right".
     */
    this.actionsPosition = 'right'; // left|right
    /**
     * Toggles custom context menu for the component.
     */
    this.contextMenu = false;
    /**
     * Toggles file drop support for rows (see
     * [Upload directive](upload.directive.md) for further details).
     */
    this.allowDropFiles = false;
    /**
     * The CSS class to apply to every row.
     */
    this.rowStyleClass = '';
    /**
     * Toggles the header.
     */
    this.showHeader = true;
    /**
     * Toggles the sticky header mode.
     */
    this.stickyHeader = false;
    /**
     * Emitted when the user clicks a row.
     */
    this.rowClick = new EventEmitter();
    /**
     * Emitted when the user double-clicks a row.
     */
    this.rowDblClick = new EventEmitter();
    /**
     * Emitted before the context menu is displayed for a row.
     */
    this.showRowContextMenu = new EventEmitter();
    /**
     * Emitted before the actions menu is displayed for a row.
     */
    this.showRowActionsMenu = new EventEmitter();
    /**
     * Emitted when the user executes a row action.
     */
    this.executeRowAction = new EventEmitter();
    /**
     * Flag that indicates if the datatable is in loading state and needs to show the
     * loading template (see the docs to learn how to configure a loading template).
     */
    this.loading = false;
    /**
     * Flag that indicates if the datatable should show the "no permission" template.
     */
    this.noPermission = false;
    /**
     * Should the items for the row actions menu be cached for reuse after they are loaded
     * the first time?
     */
    this.rowMenuCacheEnabled = true;
    /**
     * Custom resolver function which is used to parse dynamic column objects
     * see the docs to learn how to configure a resolverFn.
     */
    this.resolverFn = null;
    this.isSelectAllChecked = false;
    this.selection = new Array();
    /**
     * This array of fake rows fix the flex layout for the gallery view
     */
    this.fakeRows = [];
    this.rowMenuCache = {};
    this.subscriptions = [];
    if (differs) {
      this.differ = differs.find([]).create(null);
    }
    this.click$ = new Observable
    /**
     * @param {?} observer
     * @return {?}
     */(observer => (this.clickObserver = observer)).pipe(share());
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onKeydown(event) {
    this.keyManager.onKeydown(event);
  }
  /**
   * @return {?}
   */
  ngAfterContentInit() {
    if (this.columnList) {
      this.subscriptions.push(
        this.columnList.columns.changes.subscribe(
          /**
           * @return {?}
           */
          () => {
            this.setTableSchema();
          }
        )
      );
    }
    this.datatableLayoutFix();
    this.setTableSchema();
  }
  /**
   * @return {?}
   */
  ngAfterViewInit() {
    this.keyManager = new FocusKeyManager(this.rowsList)
      .withWrap()
      .skipPredicate(
        /**
         * @param {?} item
         * @return {?}
         */
        item => item.disabled
      );
  }
  /**
   * @param {?} changes
   * @return {?}
   */
  ngOnChanges(changes) {
    this.initAndSubscribeClickStream();
    if (this.isPropertyChanged(changes['data'])) {
      if (this.isTableEmpty()) {
        this.initTable();
      } else {
        this.data = changes['data'].currentValue;
        this.resetSelection();
      }
      return;
    }
    if (this.isPropertyChanged(changes['rows'])) {
      if (this.isTableEmpty()) {
        this.initTable();
      } else {
        this.setTableRows(changes['rows'].currentValue);
      }
      return;
    }
    if (changes.selectionMode && !changes.selectionMode.isFirstChange()) {
      this.resetSelection();
      this.emitRowSelectionEvent('row-unselect', null);
    }
    if (this.isPropertyChanged(changes['sorting'])) {
      this.setTableSorting(changes['sorting'].currentValue);
    }
    if (this.isPropertyChanged(changes['display'])) {
      this.datatableLayoutFix();
    }
  }
  /**
   * @param {?} column
   * @return {?}
   */
  isColumnSortActive(column) {
    if (!column || !this.data.getSorting()) {
      return false;
    }
    return column.key === this.data.getSorting().key;
  }
  /**
   * @return {?}
   */
  ngDoCheck() {
    /** @type {?} */
    const changes = this.differ.diff(this.rows);
    if (changes) {
      this.setTableRows(this.rows);
    }
  }
  /**
   * @param {?} property
   * @return {?}
   */
  isPropertyChanged(property) {
    return property && property.currentValue ? true : false;
  }
  /**
   * @param {?} rows
   * @return {?}
   */
  convertToRowsData(rows) {
    return rows.map(
      /**
       * @param {?} row
       * @return {?}
       */
      row => new ObjectDataRow(row, row.isSelected)
    );
  }
  /**
   * @param {?} sorting
   * @return {?}
   */
  convertToDataSorting(sorting) {
    if (sorting && sorting.length > 0) {
      return new DataSorting(sorting[0], sorting[1]);
    }
    return null;
  }
  /**
   * @private
   * @return {?}
   */
  initAndSubscribeClickStream() {
    this.unsubscribeClickStream();
    /** @type {?} */
    const singleClickStream = this.click$.pipe(
      buffer(this.click$.pipe(debounceTime(250))),
      map(
        /**
         * @param {?} list
         * @return {?}
         */
        (list => list)
      ),
      filter(
        /**
         * @param {?} x
         * @return {?}
         */
        (x => x.length === 1)
      )
    );
    this.singleClickStreamSub = singleClickStream.subscribe(
      /**
       * @param {?} dataRowEvents
       * @return {?}
       */
      dataRowEvents => {
        /** @type {?} */
        const event = dataRowEvents[0];
        this.handleRowSelection(event.value, /** @type {?} */ (event.event));
        this.rowClick.emit(event);
        if (!event.defaultPrevented) {
          this.elementRef.nativeElement.dispatchEvent(
            new CustomEvent('row-click', {
              detail: event,
              bubbles: true
            })
          );
        }
      }
    );
    /** @type {?} */
    const multiClickStream = this.click$.pipe(
      buffer(this.click$.pipe(debounceTime(250))),
      map(
        /**
         * @param {?} list
         * @return {?}
         */
        (list => list)
      ),
      filter(
        /**
         * @param {?} x
         * @return {?}
         */
        (x => x.length >= 2)
      )
    );
    this.multiClickStreamSub = multiClickStream.subscribe(
      /**
       * @param {?} dataRowEvents
       * @return {?}
       */
      dataRowEvents => {
        /** @type {?} */
        const event = dataRowEvents[0];
        this.rowDblClick.emit(event);
        if (!event.defaultPrevented) {
          this.elementRef.nativeElement.dispatchEvent(
            new CustomEvent('row-dblclick', {
              detail: event,
              bubbles: true
            })
          );
        }
      }
    );
  }
  /**
   * @private
   * @return {?}
   */
  unsubscribeClickStream() {
    if (this.singleClickStreamSub) {
      this.singleClickStreamSub.unsubscribe();
      this.singleClickStreamSub = null;
    }
    if (this.multiClickStreamSub) {
      this.multiClickStreamSub.unsubscribe();
      this.multiClickStreamSub = null;
    }
  }
  /**
   * @private
   * @return {?}
   */
  initTable() {
    /** @type {?} */
    const runtimeColumns = this.getRuntimeColumns();
    this.data = new ObjectDataTableAdapter(this.rows, runtimeColumns);
    this.setTableSorting(this.sorting);
    this.resetSelection();
    this.rowMenuCache = {};
  }
  /**
   * @return {?}
   */
  isTableEmpty() {
    return this.data === undefined || this.data === null;
  }
  /**
   * @private
   * @param {?} rows
   * @return {?}
   */
  setTableRows(rows) {
    if (this.data) {
      this.resetSelection();
      this.data.setRows(this.convertToRowsData(rows));
    }
  }
  /**
   * @private
   * @return {?}
   */
  getRuntimeColumns() {
    return [...(this.columns || []), ...this.getSchemaFromHtml()];
  }
  /**
   * @private
   * @return {?}
   */
  setTableSchema() {
    /** @type {?} */
    const columns = this.getRuntimeColumns();
    if (this.data && columns.length > 0) {
      this.data.setColumns(columns);
    }
  }
  /**
   * @private
   * @param {?} sorting
   * @return {?}
   */
  setTableSorting(sorting) {
    if (this.data) {
      this.data.setSorting(this.convertToDataSorting(sorting));
    }
  }
  /**
   * @return {?}
   */
  getSchemaFromHtml() {
    /** @type {?} */
    let schema = [];
    if (
      this.columnList &&
      this.columnList.columns &&
      this.columnList.columns.length > 0
    ) {
      schema = this.columnList.columns.map(
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
   * @param {?} row
   * @param {?} mouseEvent
   * @return {?}
   */
  onRowClick(row, mouseEvent) {
    if (mouseEvent) {
      mouseEvent.preventDefault();
    }
    if (row) {
      /** @type {?} */
      const rowIndex =
        this.data.getRows().indexOf(row) + (this.isHeaderListVisible() ? 1 : 0);
      this.keyManager.setActiveItem(rowIndex);
      /** @type {?} */
      const dataRowEvent = new DataRowEvent(row, mouseEvent, this);
      this.clickObserver.next(dataRowEvent);
    }
  }
  /**
   * @param {?} row
   * @param {?} e
   * @return {?}
   */
  onEnterKeyPressed(row, e) {
    if (row) {
      this.handleRowSelection(row, e);
    }
  }
  /**
   * @private
   * @return {?}
   */
  isHeaderListVisible() {
    return this.isHeaderVisible() && this.display === DisplayMode.List;
  }
  /**
   * @private
   * @param {?} row
   * @param {?} e
   * @return {?}
   */
  handleRowSelection(row, e) {
    if (this.data) {
      if (this.isSingleSelectionMode()) {
        this.resetSelection();
        this.selectRow(row, true);
        this.emitRowSelectionEvent('row-select', row);
      }
      if (this.isMultiSelectionMode()) {
        /** @type {?} */
        const modifier = e && (e.metaKey || e.ctrlKey);
        /** @type {?} */
        let newValue;
        if (this.selection.length === 1) {
          newValue = !row.isSelected;
        } else {
          newValue = modifier ? !row.isSelected : true;
        }
        /** @type {?} */
        const domEventName = newValue ? 'row-select' : 'row-unselect';
        if (!modifier) {
          this.resetSelection();
        }
        this.selectRow(row, newValue);
        this.emitRowSelectionEvent(domEventName, row);
      }
    }
  }
  /**
   * @return {?}
   */
  resetSelection() {
    if (this.data) {
      /** @type {?} */
      const rows = this.data.getRows();
      if (rows && rows.length > 0) {
        rows.forEach(
          /**
           * @param {?} r
           * @return {?}
           */
          r => (r.isSelected = false)
        );
      }
      this.selection = [];
    }
    this.isSelectAllChecked = false;
  }
  /**
   * @param {?} row
   * @param {?=} event
   * @return {?}
   */
  onRowDblClick(row, event) {
    if (event) {
      event.preventDefault();
    }
    /** @type {?} */
    const dataRowEvent = new DataRowEvent(row, event, this);
    this.clickObserver.next(dataRowEvent);
  }
  /**
   * @param {?} row
   * @param {?} e
   * @return {?}
   */
  onRowKeyUp(row, e) {
    /** @type {?} */
    const event = new CustomEvent('row-keyup', {
      detail: {
        row: row,
        keyboardEvent: e,
        sender: this
      },
      bubbles: true
    });
    this.elementRef.nativeElement.dispatchEvent(event);
    if (event.defaultPrevented) {
      e.preventDefault();
    } else {
      if (e.key === 'Enter') {
        this.onKeyboardNavigate(row, e);
      }
    }
  }
  /**
   * @private
   * @param {?} row
   * @param {?} keyboardEvent
   * @return {?}
   */
  onKeyboardNavigate(row, keyboardEvent) {
    if (keyboardEvent) {
      keyboardEvent.preventDefault();
    }
    /** @type {?} */
    const event = new DataRowEvent(row, keyboardEvent, this);
    this.rowDblClick.emit(event);
    this.elementRef.nativeElement.dispatchEvent(
      new CustomEvent('row-dblclick', {
        detail: event,
        bubbles: true
      })
    );
  }
  /**
   * @param {?} column
   * @return {?}
   */
  onColumnHeaderClick(column) {
    if (column && column.sortable) {
      /** @type {?} */
      const current = this.data.getSorting();
      /** @type {?} */
      let newDirection = 'asc';
      if (current && column.key === current.key) {
        newDirection = current.direction === 'asc' ? 'desc' : 'asc';
      }
      this.data.setSorting(new DataSorting(column.key, newDirection));
      this.emitSortingChangedEvent(column.key, newDirection);
    }
    this.keyManager.updateActiveItemIndex(0);
  }
  /**
   * @param {?} matCheckboxChange
   * @return {?}
   */
  onSelectAllClick(matCheckboxChange) {
    this.isSelectAllChecked = matCheckboxChange.checked;
    if (this.multiselect) {
      /** @type {?} */
      const rows = this.data.getRows();
      if (rows && rows.length > 0) {
        for (let i = 0; i < rows.length; i++) {
          this.selectRow(rows[i], matCheckboxChange.checked);
        }
      }
      /** @type {?} */
      const domEventName = matCheckboxChange.checked
        ? 'row-select'
        : 'row-unselect';
      /** @type {?} */
      const row = this.selection.length > 0 ? this.selection[0] : null;
      this.emitRowSelectionEvent(domEventName, row);
    }
  }
  /**
   * @param {?} row
   * @param {?} event
   * @return {?}
   */
  onCheckboxChange(row, event) {
    /** @type {?} */
    const newValue = event.checked;
    this.selectRow(row, newValue);
    /** @type {?} */
    const domEventName = newValue ? 'row-select' : 'row-unselect';
    this.emitRowSelectionEvent(domEventName, row);
  }
  /**
   * @param {?} event
   * @param {?} row
   * @return {?}
   */
  onImageLoadingError(event, row) {
    if (event) {
      /** @type {?} */
      const element = /** @type {?} */ (event.target);
      if (this.fallbackThumbnail) {
        element.src = this.fallbackThumbnail;
      } else {
        element.src = row.imageErrorResolver(event);
      }
    }
  }
  /**
   * @param {?} row
   * @param {?} col
   * @return {?}
   */
  isIconValue(row, col) {
    if (row && col) {
      /** @type {?} */
      const value = row.getValue(col.key);
      return value && value.startsWith('material-icons://');
    }
    return false;
  }
  /**
   * @param {?} row
   * @param {?} col
   * @return {?}
   */
  asIconValue(row, col) {
    if (this.isIconValue(row, col)) {
      /** @type {?} */
      const value = row.getValue(col.key) || '';
      return value.replace('material-icons://', '');
    }
    return null;
  }
  /**
   * @param {?} value
   * @return {?}
   */
  iconAltTextKey(value) {
    return value
      ? 'ICONS.' +
          value.substring(value.lastIndexOf('/') + 1).replace(/\.[a-z]+/, '')
      : '';
  }
  /**
   * @param {?} col
   * @param {?} direction
   * @return {?}
   */
  isColumnSorted(col, direction) {
    if (col && direction) {
      /** @type {?} */
      const sorting = this.data.getSorting();
      return (
        sorting && sorting.key === col.key && sorting.direction === direction
      );
    }
    return false;
  }
  /**
   * @param {?} row
   * @param {?} col
   * @return {?}
   */
  getContextMenuActions(row, col) {
    /** @type {?} */
    const event = new DataCellEvent(row, col, []);
    this.showRowContextMenu.emit(event);
    return event.value.actions;
  }
  /**
   * @param {?} row
   * @param {?=} col
   * @return {?}
   */
  getRowActions(row, col) {
    /** @type {?} */
    const id = row.getValue('id');
    if (!this.rowMenuCache[id]) {
      /** @type {?} */
      const event = new DataCellEvent(row, col, []);
      this.showRowActionsMenu.emit(event);
      if (!this.rowMenuCacheEnabled) {
        return this.getVisibleActions(event.value.actions);
      }
      this.rowMenuCache[id] = event.value.actions;
    }
    return this.getVisibleActions(this.rowMenuCache[id]);
  }
  /**
   * @param {?} actions
   * @return {?}
   */
  getVisibleActions(actions) {
    return actions.filter(
      /**
       * @param {?} action
       * @return {?}
       */
      action => action.visible || action.visible === undefined
    );
  }
  /**
   * @param {?} row
   * @param {?} action
   * @return {?}
   */
  onExecuteRowAction(row, action) {
    if (action.disabled || action.disabled) {
      event.stopPropagation();
    } else {
      this.executeRowAction.emit(new DataRowActionEvent(row, action));
    }
  }
  /**
   * @param {?} row
   * @return {?}
   */
  rowAllowsDrop(row) {
    return row.isDropTarget === true;
  }
  /**
   * @return {?}
   */
  hasSelectionMode() {
    return this.isSingleSelectionMode() || this.isMultiSelectionMode();
  }
  /**
   * @return {?}
   */
  isSingleSelectionMode() {
    return this.selectionMode && this.selectionMode.toLowerCase() === 'single';
  }
  /**
   * @return {?}
   */
  isMultiSelectionMode() {
    return (
      this.selectionMode && this.selectionMode.toLowerCase() === 'multiple'
    );
  }
  /**
   * @param {?} row
   * @return {?}
   */
  getRowStyle(row) {
    row.cssClass = row.cssClass ? row.cssClass : '';
    this.rowStyleClass = this.rowStyleClass ? this.rowStyleClass : '';
    return `${row.cssClass} ${this.rowStyleClass}`;
  }
  /**
   * @return {?}
   */
  getSortingKey() {
    if (this.data.getSorting()) {
      return this.data.getSorting().key;
    }
    return null;
  }
  /**
   * @param {?} row
   * @param {?} value
   * @return {?}
   */
  selectRow(row, value) {
    if (row) {
      row.isSelected = value;
      /** @type {?} */
      const idx = this.selection.indexOf(row);
      if (value) {
        if (idx < 0) {
          this.selection.push(row);
        }
      } else {
        if (idx > -1) {
          this.selection.splice(idx, 1);
        }
      }
    }
  }
  /**
   * @param {?} row
   * @param {?} col
   * @return {?}
   */
  getCellTooltip(row, col) {
    if (row && col && col.formatTooltip) {
      /** @type {?} */
      const result = col.formatTooltip(row, col);
      if (result) {
        return result;
      }
    }
    return null;
  }
  /**
   * @return {?}
   */
  getSortableColumns() {
    return this.data.getColumns().filter(
      /**
       * @param {?} column
       * @return {?}
       */
      column => {
        return column.sortable === true;
      }
    );
  }
  /**
   * @return {?}
   */
  isEmpty() {
    return this.data.getRows().length === 0;
  }
  /**
   * @return {?}
   */
  isHeaderVisible() {
    return !this.loading && !this.isEmpty() && !this.noPermission;
  }
  /**
   * @return {?}
   */
  isStickyHeaderEnabled() {
    return this.stickyHeader && this.isHeaderVisible();
  }
  /**
   * @private
   * @param {?} name
   * @param {?} row
   * @return {?}
   */
  emitRowSelectionEvent(name, row) {
    /** @type {?} */
    const domEvent = new CustomEvent(name, {
      detail: {
        row: row,
        selection: this.selection
      },
      bubbles: true
    });
    this.elementRef.nativeElement.dispatchEvent(domEvent);
  }
  /**
   * @private
   * @param {?} key
   * @param {?} direction
   * @return {?}
   */
  emitSortingChangedEvent(key, direction) {
    /** @type {?} */
    const domEvent = new CustomEvent('sorting-changed', {
      detail: {
        key,
        direction
      },
      bubbles: true
    });
    this.elementRef.nativeElement.dispatchEvent(domEvent);
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.unsubscribeClickStream();
    this.subscriptions.forEach(
      /**
       * @param {?} s
       * @return {?}
       */
      s => s.unsubscribe()
    );
    this.subscriptions = [];
    if (this.dataRowsChanged) {
      this.dataRowsChanged.unsubscribe();
      this.dataRowsChanged = null;
    }
  }
  /**
   * @return {?}
   */
  datatableLayoutFix() {
    /** @type {?} */
    const maxGalleryRows = 25;
    if (this.display === 'gallery') {
      for (let i = 0; i < maxGalleryRows; i++) {
        this.fakeRows.push('');
      }
    } else {
      this.fakeRows = [];
    }
  }
  /**
   * @return {?}
   */
  getNameColumnValue() {
    return this.data.getColumns().find(
      /**
       * @param {?} el
       * @return {?}
       */
      el => {
        return el.key.includes('name');
      }
    );
  }
  /**
   * @param {?} row
   * @return {?}
   */
  getAutomationValue(row) {
    /** @type {?} */
    const name = this.getNameColumnValue();
    return name ? row.getValue(name.key) : '';
  }
  /**
   * @param {?} column
   * @return {?}
   */
  getAriaSort(column) {
    if (!this.isColumnSortActive(column)) {
      return 'ADF-DATATABLE.ACCESSIBILITY.SORT_NONE';
    }
    return this.isColumnSorted(column, 'asc')
      ? 'ADF-DATATABLE.ACCESSIBILITY.SORT_ASCENDING'
      : 'ADF-DATATABLE.ACCESSIBILITY.SORT_DESCENDING';
  }
  /**
   * @param {?} column
   * @return {?}
   */
  getSortLiveAnnouncement(column) {
    if (!this.isColumnSortActive(column)) {
      return 'ADF-DATATABLE.ACCESSIBILITY.SORT_DEFAULT';
    }
    return this.isColumnSorted(column, 'asc')
      ? 'ADF-DATATABLE.ACCESSIBILITY.SORT_ASCENDING_BY'
      : 'ADF-DATATABLE.ACCESSIBILITY.SORT_DESCENDING_BY';
  }
}
DataTableComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-datatable',
        template:
          '<div\n    role="grid"\n    *ngIf="data" class="adf-full-width"\n    [class.adf-datatable-card]="display === \'gallery\'"\n    [class.adf-datatable-list]="display === \'list\'"\n    [class.adf-sticky-header]="isStickyHeaderEnabled()"\n    [class.adf-datatable--empty]="!isHeaderVisible()">\n    <div *ngIf="isHeaderVisible()" class="adf-datatable-header" role="rowgroup" [ngClass]="{ \'adf-sr-only\': !showHeader }">\n        <adf-datatable-row\n            data-automation-id="datatable-row-header"\n            [disabled]="!showHeader"\n            class="adf-datatable-row"\n            *ngIf="display === \'list\'"\n            role="row">\n            <!-- Actions (left) -->\n            <div *ngIf="actions && actionsPosition === \'left\'" class="adf-actions-column adf-datatable-cell-header">\n                <span class="adf-sr-only">Actions</span>\n            </div>\n            <!-- Columns -->\n            <div *ngIf="multiselect" class="adf-datatable-cell-header adf-datatable-checkbox">\n                <mat-checkbox [checked]="isSelectAllChecked" (change)="onSelectAllClick($event)" class="adf-checkbox-sr-only">{{ \'ADF-DATATABLE.ACCESSIBILITY.SELECT_ALL\' | translate }}</mat-checkbox>\n            </div>\n            <div class="adf-datatable-cell--{{col.type || \'text\'}} {{col.cssClass}} adf-datatable-cell-header"\n                 *ngFor="let col of data.getColumns()"\n                 [class.adf-sortable]="col.sortable"\n                 [attr.data-automation-id]="\'auto_id_\' + col.key"\n                 [class.adf-datatable__header--sorted-asc]="isColumnSorted(col, \'asc\')"\n                 [class.adf-datatable__header--sorted-desc]="isColumnSorted(col, \'desc\')"\n                 (click)="onColumnHeaderClick(col)"\n                 (keyup.enter)="onColumnHeaderClick(col)"\n                 role="columnheader"\n                 [attr.tabindex]="showHeader ? 0 : null"\n                 [attr.aria-sort]="col.sortable ? (getAriaSort(col) | translate) : null"\n                 adf-drop-zone dropTarget="header" [dropColumn]="col">\n                <span *ngIf="col.title" class="adf-datatable-cell-value">{{ col.title | translate}}</span>\n                <span class="adf-sr-only" aria-live="polite">{{ getSortLiveAnnouncement(col) | translate: { string: col.title | translate } }}</span>\n            </div>\n            <!-- Actions (right) -->\n            <div *ngIf="actions && actionsPosition === \'right\'" class="adf-actions-column adf-datatable-cell-header adf-datatable__actions-cell">\n                <span class="adf-sr-only">Actions</span>\n            </div>\n        </adf-datatable-row>\n        <mat-form-field *ngIf="display === \'gallery\' && showHeader">\n            <mat-select [value]="getSortingKey()" [attr.data-automation-id]="\'grid-view-sorting\'">\n                <mat-option *ngFor="let col of getSortableColumns()"\n                            [value]="col.key"\n                            [attr.data-automation-id]="\'grid-view-sorting-\'+col.title"\n                            (click)="onColumnHeaderClick(col)"\n                            (keyup.enter)="onColumnHeaderClick(col)">\n                    {{ col.title | translate}}\n                </mat-option>\n            </mat-select>\n        </mat-form-field>\n    </div>\n\n    <div class="adf-datatable-body" role="rowgroup">\n        <ng-container *ngIf="!loading && !noPermission">\n            <adf-datatable-row *ngFor="let row of data.getRows(); let idx = index"\n                [row]="row"\n                (select)="onEnterKeyPressed(row, $event)"\n                (keyup)="onRowKeyUp(row, $event)"\n                [adf-upload]="allowDropFiles && rowAllowsDrop(row)"\n                [adf-upload-data]="row"\n                [ngStyle]="rowStyle"\n                [ngClass]="getRowStyle(row)"\n                [attr.data-automation-id]="\'datatable-row-\' + idx">\n                <!-- Actions (left) -->\n                <div *ngIf="actions && actionsPosition === \'left\'" role="gridcell" class="adf-datatable-cell">\n                    <button mat-icon-button [matMenuTriggerFor]="menu"\n                            [title]="\'ADF-DATATABLE.CONTENT-ACTIONS.TOOLTIP\' | translate"\n                            [attr.id]="\'action_menu_left_\' + idx"\n                            [attr.data-automation-id]="\'action_menu_\' + idx">\n                        <mat-icon>more_vert</mat-icon>\n                    </button>\n                    <mat-menu #menu="matMenu">\n                        <button mat-menu-item *ngFor="let action of getRowActions(row)"\n                                [attr.data-automation-id]="action.title"\n                                [disabled]="action.disabled"\n                                (click)="onExecuteRowAction(row, action)">\n                            <mat-icon *ngIf="action.icon">{{ action.icon }}</mat-icon>\n                            <span>{{ action.title | translate }}</span>\n                        </button>\n                    </mat-menu>\n                </div>\n\n                <div *ngIf="multiselect" class="adf-datatable-cell adf-datatable-checkbox">\n                    <mat-checkbox\n                        [checked]="row.isSelected"\n                        [attr.aria-checked]="row.isSelected"\n                        role="checkbox"\n                        (change)="onCheckboxChange(row, $event)"\n                        class="adf-checkbox-sr-only">\n                        {{ \'ADF-DATATABLE.ACCESSIBILITY.SELECT_FILE\' | translate }}\n                    </mat-checkbox>\n                </div>\n                <div *ngFor="let col of data.getColumns()"\n                     role="gridcell"\n                     class="adf-datatable-cell adf-datatable-cell--{{col.type || \'text\'}} {{col.cssClass}}"\n                     [attr.title]="col.title | translate"\n                     [attr.data-automation-id]="getAutomationValue(row)"\n                     [attr.aria-selected]="row.isSelected ? true : false"\n                     [attr.aria-label]="col.title ? (col.title | translate) : null"\n                     (click)="onRowClick(row, $event)"\n                     (keydown.enter)="onEnterKeyPressed(row, $event)"\n                     [adf-context-menu]="getContextMenuActions(row, col)"\n                     [adf-context-menu-enabled]="contextMenu"\n                     adf-drop-zone dropTarget="cell" [dropColumn]="col" [dropRow]="row">\n                    <div *ngIf="!col.template" class="adf-datatable-cell-container">\n                        <ng-container [ngSwitch]="col.type">\n                            <div *ngSwitchCase="\'image\'" class="adf-cell-value">\n                                <mat-icon *ngIf="isIconValue(row, col); else no_iconvalue">{{ asIconValue(row, col) }}\n                                </mat-icon>\n                                <ng-template #no_iconvalue>\n                                    <mat-icon class="adf-datatable-selected"\n                                              *ngIf="row.isSelected && !multiselect; else no_selected_row" svgIcon="selected">\n                                    </mat-icon>\n                                    <ng-template #no_selected_row>\n                                        <img class="adf-datatable-center-img-ie"\n                                            [attr.aria-label]=" (data.getValue(row, col) | fileType) === \'disable\' ?\n                                                (\'ADF-DATATABLE.ACCESSIBILITY.ICON_DISABLED\' | translate) :\n                                                \'ADF-DATATABLE.ACCESSIBILITY.ICON_TEXT\' | translate:{\n                                                    type: \'ADF-DATATABLE.FILE_TYPE.\' + (data.getValue(row, col) | fileType | uppercase) | translate\n                                                }"\n                                            [attr.alt]=" (data.getValue(row, col) | fileType) === \'disable\' ?\n                                                (\'ADF-DATATABLE.ACCESSIBILITY.ICON_DISABLED\' | translate) :\n                                                \'ADF-DATATABLE.ACCESSIBILITY.ICON_TEXT\' | translate:{\n                                                        type: \'ADF-DATATABLE.FILE_TYPE.\' + (data.getValue(row, col) | fileType | uppercase) | translate\n                                                }"\n                                            src="{{ data.getValue(row, col) }}"\n                                            (error)="onImageLoadingError($event, row)">\n                                    </ng-template>\n                                </ng-template>\n                            </div>\n                            <div *ngSwitchCase="\'icon\'" class="adf-cell-value">\n                                <mat-icon>{{ data.getValue(row, col) }}</mat-icon>\n                            </div>\n                            <div *ngSwitchCase="\'date\'" class="adf-cell-value" [attr.tabindex]="data.getValue(row, col)? 0 : -1"\n                                 [attr.data-automation-id]="\'date_\' + (data.getValue(row, col) | adfLocalizedDate: \'medium\') ">\n                                <adf-date-cell class="adf-datatable-center-date-column-ie"\n                                    [data]="data"\n                                    [column]="col"\n                                    [row]="row"\n                                    [resolverFn]="resolverFn"\n                                    [tooltip]="getCellTooltip(row, col)">\n                                </adf-date-cell>\n                            </div>\n                            <div *ngSwitchCase="\'location\'" [attr.tabindex]="data.getValue(row, col)? 0 : -1"  class="adf-cell-value"\n                                 [attr.data-automation-id]="\'location\' + data.getValue(row, col)">\n                                <adf-location-cell\n                                    [data]="data"\n                                    [column]="col"\n                                    [row]="row"\n                                    [resolverFn]="resolverFn"\n                                    [tooltip]="getCellTooltip(row, col)">\n                                </adf-location-cell>\n                            </div>\n                            <div *ngSwitchCase="\'fileSize\'" [attr.tabindex]="data.getValue(row, col)? 0 : -1" class="adf-cell-value"\n                                 [attr.data-automation-id]="\'fileSize_\' + data.getValue(row, col)">\n                                <adf-filesize-cell class="adf-datatable-center-size-column-ie"\n                                    [data]="data"\n                                    [column]="col"\n                                    [row]="row"\n                                    [resolverFn]="resolverFn"\n                                    [tooltip]="getCellTooltip(row, col)">\n                                </adf-filesize-cell>\n                            </div>\n                            <div *ngSwitchCase="\'text\'" [attr.tabindex]="data.getValue(row, col)? 0 : -1"  class="adf-cell-value"\n                                 [attr.data-automation-id]="\'text_\' + data.getValue(row, col)">\n                                <adf-datatable-cell\n                                    [copyContent]="col.copyContent"\n                                    [data]="data"\n                                    [column]="col"\n                                    [row]="row"\n                                    [resolverFn]="resolverFn"\n                                    [tooltip]="getCellTooltip(row, col)">\n                                </adf-datatable-cell>\n                            </div>\n                            <div *ngSwitchCase="\'json\'" [attr.tabindex]="data.getValue(row, col)? 0 : -1" class="adf-cell-value">\n                                <adf-json-cell\n                                    [editable]="col.editable"\n                                    [data]="data"\n                                    [column]="col"\n                                    [resolverFn]="resolverFn"\n                                    [row]="row">\n                                </adf-json-cell>\n                            </div>\n                            <span *ngSwitchDefault class="adf-cell-value">\n                    <!-- empty cell for unknown column type -->\n                    </span>\n                        </ng-container>\n                    </div>\n                    <div *ngIf="col.template" class="adf-datatable-cell-container">\n                        <div class="adf-cell-value" [attr.tabindex]="col.focus ? 0 : null">\n                            <ng-container\n                                [ngTemplateOutlet]="col.template"\n                                [ngTemplateOutletContext]="{ $implicit: { data: data, row: row, col: col }, value: data.getValue(row, col, resolverFn) }">\n                            </ng-container>\n                        </div>\n                    </div>\n                </div>\n\n                <!-- Actions (right) -->\n                <div *ngIf="actions && actionsPosition === \'right\'"\n                     role="gridcell"\n                     class="adf-datatable-cell adf-datatable__actions-cell adf-datatable-center-actions-column-ie">\n                    <button mat-icon-button [matMenuTriggerFor]="menu"\n                            [attr.aria-label]="\'ADF-DATATABLE.ACCESSIBILITY.ROW_OPTION_BUTTON\' | translate"\n                            [title]="\'ADF-DATATABLE.CONTENT-ACTIONS.TOOLTIP\' | translate"\n                            [attr.id]="\'action_menu_right_\' + idx"\n                            [attr.data-automation-id]="\'action_menu_\' + idx">\n                        <mat-icon>more_vert</mat-icon>\n                    </button>\n                    <mat-menu #menu="matMenu">\n                        <button mat-menu-item *ngFor="let action of getRowActions(row)"\n                                [attr.data-automation-id]="action.title"\n                                [attr.aria-label]="action.title | translate"\n                                [disabled]="action.disabled"\n                                (click)="onExecuteRowAction(row, action)">\n                            <mat-icon *ngIf="action.icon">{{ action.icon }}</mat-icon>\n                            <span>{{ action.title | translate }}</span>\n                        </button>\n                    </mat-menu>\n                </div>\n            </adf-datatable-row>\n            <div *ngIf="isEmpty()"\n                 role="row"\n                 [class.adf-datatable-row]="display === \'list\'"\n                 [class.adf-datatable-card-empty]="display === \'gallery\'">\n                <div class="adf-no-content-container adf-datatable-cell" role="gridcell">\n                    <ng-template *ngIf="noContentTemplate"\n                                 ngFor [ngForOf]="[data]"\n                                 [ngForTemplate]="noContentTemplate">\n                    </ng-template>\n                    <ng-content select="adf-empty-list"></ng-content>\n                </div>\n            </div>\n            <div *ngFor="let row of fakeRows"\n                 class="adf-datatable-row adf-datatable-row-empty-card">\n            </div>\n        </ng-container>\n        <div *ngIf="!loading && noPermission"\n             role="row"\n             [class.adf-datatable-row]="display === \'list\'"\n             [class.adf-datatable-card-permissions]="display === \'gallery\'"\n             class="adf-no-permission__row">\n            <div class="adf-no-permission__cell adf-no-content-container adf-datatable-cell">\n                <ng-template *ngIf="noPermissionTemplate"\n                             ngFor [ngForOf]="[data]"\n                             [ngForTemplate]="noPermissionTemplate">\n                </ng-template>\n            </div>\n        </div>\n        <div *ngIf="loading"\n             [class.adf-datatable-row]="display === \'list\'"\n             [class.adf-datatable-card-loading]="display === \'gallery\'">\n            <div class="adf-no-content-container adf-datatable-cell">\n                <ng-template *ngIf="loadingTemplate"\n                             ngFor [ngForOf]="[data]"\n                             [ngForTemplate]="loadingTemplate">\n                </ng-template>\n            </div>\n        </div>\n    </div>\n</div>\n',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'adf-datatable' },
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
DataTableComponent.ctorParameters = () => [
  { type: ElementRef },
  { type: IterableDiffers }
];
DataTableComponent.propDecorators = {
  rowsList: [{ type: ViewChildren, args: [DataTableRowComponent] }],
  columnList: [{ type: ContentChild, args: [DataColumnListComponent] }],
  data: [{ type: Input }],
  display: [{ type: Input }],
  rows: [{ type: Input }],
  sorting: [{ type: Input }],
  columns: [{ type: Input }],
  selectionMode: [{ type: Input }],
  multiselect: [{ type: Input }],
  actions: [{ type: Input }],
  actionsPosition: [{ type: Input }],
  fallbackThumbnail: [{ type: Input }],
  contextMenu: [{ type: Input }],
  allowDropFiles: [{ type: Input }],
  rowStyle: [{ type: Input }],
  rowStyleClass: [{ type: Input }],
  showHeader: [{ type: Input }],
  stickyHeader: [{ type: Input }],
  rowClick: [{ type: Output }],
  rowDblClick: [{ type: Output }],
  showRowContextMenu: [{ type: Output }],
  showRowActionsMenu: [{ type: Output }],
  executeRowAction: [{ type: Output }],
  loading: [{ type: Input }],
  noPermission: [{ type: Input }],
  rowMenuCacheEnabled: [{ type: Input }],
  resolverFn: [{ type: Input }],
  onKeydown: [{ type: HostListener, args: ['keyup', ['$event']] }]
};
if (false) {
  /** @type {?} */
  DataTableComponent.prototype.rowsList;
  /** @type {?} */
  DataTableComponent.prototype.columnList;
  /**
   * Data source for the table
   * @type {?}
   */
  DataTableComponent.prototype.data;
  /**
   * Selects the display mode of the table. Can be "list" or "gallery".
   * @type {?}
   */
  DataTableComponent.prototype.display;
  /**
   * The rows that the datatable will show.
   * @type {?}
   */
  DataTableComponent.prototype.rows;
  /**
   * Define the sort order of the datatable. Possible values are :
   * [`created`, `desc`], [`created`, `asc`], [`due`, `desc`], [`due`, `asc`]
   * @type {?}
   */
  DataTableComponent.prototype.sorting;
  /**
   * The columns that the datatable will show.
   * @type {?}
   */
  DataTableComponent.prototype.columns;
  /**
   * Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
   * you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows.
   * @type {?}
   */
  DataTableComponent.prototype.selectionMode;
  /**
   * Toggles multiple row selection, which renders checkboxes at the beginning of each row.
   * @type {?}
   */
  DataTableComponent.prototype.multiselect;
  /**
   * Toggles the data actions column.
   * @type {?}
   */
  DataTableComponent.prototype.actions;
  /**
   * Position of the actions dropdown menu. Can be "left" or "right".
   * @type {?}
   */
  DataTableComponent.prototype.actionsPosition;
  /**
   * Fallback image for rows where the thumbnail is missing.
   * @type {?}
   */
  DataTableComponent.prototype.fallbackThumbnail;
  /**
   * Toggles custom context menu for the component.
   * @type {?}
   */
  DataTableComponent.prototype.contextMenu;
  /**
   * Toggles file drop support for rows (see
   * [Upload directive](upload.directive.md) for further details).
   * @type {?}
   */
  DataTableComponent.prototype.allowDropFiles;
  /**
   * The inline style to apply to every row. See
   * [NgStyle](https://angular.io/docs/ts/latest/api/common/index/NgStyle-directive.html)
   * docs for more details and usage examples.
   * @type {?}
   */
  DataTableComponent.prototype.rowStyle;
  /**
   * The CSS class to apply to every row.
   * @type {?}
   */
  DataTableComponent.prototype.rowStyleClass;
  /**
   * Toggles the header.
   * @type {?}
   */
  DataTableComponent.prototype.showHeader;
  /**
   * Toggles the sticky header mode.
   * @type {?}
   */
  DataTableComponent.prototype.stickyHeader;
  /**
   * Emitted when the user clicks a row.
   * @type {?}
   */
  DataTableComponent.prototype.rowClick;
  /**
   * Emitted when the user double-clicks a row.
   * @type {?}
   */
  DataTableComponent.prototype.rowDblClick;
  /**
   * Emitted before the context menu is displayed for a row.
   * @type {?}
   */
  DataTableComponent.prototype.showRowContextMenu;
  /**
   * Emitted before the actions menu is displayed for a row.
   * @type {?}
   */
  DataTableComponent.prototype.showRowActionsMenu;
  /**
   * Emitted when the user executes a row action.
   * @type {?}
   */
  DataTableComponent.prototype.executeRowAction;
  /**
   * Flag that indicates if the datatable is in loading state and needs to show the
   * loading template (see the docs to learn how to configure a loading template).
   * @type {?}
   */
  DataTableComponent.prototype.loading;
  /**
   * Flag that indicates if the datatable should show the "no permission" template.
   * @type {?}
   */
  DataTableComponent.prototype.noPermission;
  /**
   * Should the items for the row actions menu be cached for reuse after they are loaded
   * the first time?
   * @type {?}
   */
  DataTableComponent.prototype.rowMenuCacheEnabled;
  /**
   * Custom resolver function which is used to parse dynamic column objects
   * see the docs to learn how to configure a resolverFn.
   * @type {?}
   */
  DataTableComponent.prototype.resolverFn;
  /** @type {?} */
  DataTableComponent.prototype.noContentTemplate;
  /** @type {?} */
  DataTableComponent.prototype.noPermissionTemplate;
  /** @type {?} */
  DataTableComponent.prototype.loadingTemplate;
  /** @type {?} */
  DataTableComponent.prototype.isSelectAllChecked;
  /** @type {?} */
  DataTableComponent.prototype.selection;
  /**
   * This array of fake rows fix the flex layout for the gallery view
   * @type {?}
   */
  DataTableComponent.prototype.fakeRows;
  /**
   * @type {?}
   * @private
   */
  DataTableComponent.prototype.keyManager;
  /**
   * @type {?}
   * @private
   */
  DataTableComponent.prototype.clickObserver;
  /**
   * @type {?}
   * @private
   */
  DataTableComponent.prototype.click$;
  /**
   * @type {?}
   * @private
   */
  DataTableComponent.prototype.differ;
  /**
   * @type {?}
   * @private
   */
  DataTableComponent.prototype.rowMenuCache;
  /**
   * @type {?}
   * @private
   */
  DataTableComponent.prototype.subscriptions;
  /**
   * @type {?}
   * @private
   */
  DataTableComponent.prototype.singleClickStreamSub;
  /**
   * @type {?}
   * @private
   */
  DataTableComponent.prototype.multiClickStreamSub;
  /**
   * @type {?}
   * @private
   */
  DataTableComponent.prototype.dataRowsChanged;
  /**
   * @type {?}
   * @private
   */
  DataTableComponent.prototype.elementRef;
}
/**
 * @record
 */
export function DataTableDropEvent() {}
if (false) {
  /** @type {?} */
  DataTableDropEvent.prototype.detail;
  /**
   * @return {?}
   */
  DataTableDropEvent.prototype.preventDefault = function() {};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXRhYmxlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImRhdGF0YWJsZS9jb21wb25lbnRzL2RhdGF0YWJsZS9kYXRhdGFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFDSCxZQUFZLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFDbkIsU0FBUyxFQUFFLFlBQVksRUFBVyxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFDbkYsZUFBZSxFQUFhLE1BQU0sRUFBNEMsaUJBQWlCLEVBQ2xHLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxPQUFPLEVBQWdCLFVBQVUsRUFBWSxNQUFNLE1BQU0sQ0FBQztBQUMxRCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUUxRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFL0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRTVELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRWxFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNoRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDN0QsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0lBR3RFLE1BQU8sTUFBTTtJQUNiLFNBQVUsU0FBUzs7O0FB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akI5Qyx3Q0FTQzs7O0lBUkcsb0NBS0U7Ozs7SUFFRiw4REFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICAgIFZpZXdDaGlsZHJlbiwgUXVlcnlMaXN0LCBIb3N0TGlzdGVuZXIsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIERvQ2hlY2ssIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsXG4gICAgSXRlcmFibGVEaWZmZXJzLCBPbkNoYW5nZXMsIE91dHB1dCwgU2ltcGxlQ2hhbmdlLCBTaW1wbGVDaGFuZ2VzLCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb24sIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvY3VzS2V5TWFuYWdlciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IE1hdENoZWNrYm94Q2hhbmdlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uLCBPYnNlcnZhYmxlLCBPYnNlcnZlciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRGF0YUNvbHVtbkxpc3RDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9kYXRhLWNvbHVtbi9kYXRhLWNvbHVtbi1saXN0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEYXRhQ29sdW1uIH0gZnJvbSAnLi4vLi4vZGF0YS9kYXRhLWNvbHVtbi5tb2RlbCc7XG5pbXBvcnQgeyBEYXRhUm93RXZlbnQgfSBmcm9tICcuLi8uLi9kYXRhL2RhdGEtcm93LWV2ZW50Lm1vZGVsJztcbmltcG9ydCB7IERhdGFSb3cgfSBmcm9tICcuLi8uLi9kYXRhL2RhdGEtcm93Lm1vZGVsJztcbmltcG9ydCB7IERhdGFTb3J0aW5nIH0gZnJvbSAnLi4vLi4vZGF0YS9kYXRhLXNvcnRpbmcubW9kZWwnO1xuaW1wb3J0IHsgRGF0YVRhYmxlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGEvZGF0YXRhYmxlLWFkYXB0ZXInO1xuaW1wb3J0IHsgRGF0YVRhYmxlUm93Q29tcG9uZW50IH0gZnJvbSAnLi9kYXRhdGFibGUtcm93LmNvbXBvbmVudCc7XG5cbmltcG9ydCB7IE9iamVjdERhdGFSb3cgfSBmcm9tICcuLi8uLi9kYXRhL29iamVjdC1kYXRhcm93Lm1vZGVsJztcbmltcG9ydCB7IE9iamVjdERhdGFUYWJsZUFkYXB0ZXIgfSBmcm9tICcuLi8uLi9kYXRhL29iamVjdC1kYXRhdGFibGUtYWRhcHRlcic7XG5pbXBvcnQgeyBEYXRhQ2VsbEV2ZW50IH0gZnJvbSAnLi9kYXRhLWNlbGwuZXZlbnQnO1xuaW1wb3J0IHsgRGF0YVJvd0FjdGlvbkV2ZW50IH0gZnJvbSAnLi9kYXRhLXJvdy1hY3Rpb24uZXZlbnQnO1xuaW1wb3J0IHsgc2hhcmUsIGJ1ZmZlciwgbWFwLCBmaWx0ZXIsIGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZXhwb3J0IGVudW0gRGlzcGxheU1vZGUge1xuICAgIExpc3QgPSAnbGlzdCcsXG4gICAgR2FsbGVyeSA9ICdnYWxsZXJ5J1xufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FkZi1kYXRhdGFibGUnLFxuICAgIHN0eWxlVXJsczogWycuL2RhdGF0YWJsZS5jb21wb25lbnQuc2NzcyddLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9kYXRhdGFibGUuY29tcG9uZW50Lmh0bWwnLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgaG9zdDogeyBjbGFzczogJ2FkZi1kYXRhdGFibGUnIH1cbn0pXG5leHBvcnQgY2xhc3MgRGF0YVRhYmxlQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBEb0NoZWNrLCBPbkRlc3Ryb3kge1xuXG4gICAgQFZpZXdDaGlsZHJlbihEYXRhVGFibGVSb3dDb21wb25lbnQpXG4gICAgcm93c0xpc3Q6IFF1ZXJ5TGlzdDxEYXRhVGFibGVSb3dDb21wb25lbnQ+O1xuXG4gICAgQENvbnRlbnRDaGlsZChEYXRhQ29sdW1uTGlzdENvbXBvbmVudClcbiAgICBjb2x1bW5MaXN0OiBEYXRhQ29sdW1uTGlzdENvbXBvbmVudDtcblxuICAgIC8qKiBEYXRhIHNvdXJjZSBmb3IgdGhlIHRhYmxlICovXG4gICAgQElucHV0KClcbiAgICBkYXRhOiBEYXRhVGFibGVBZGFwdGVyO1xuXG4gICAgLyoqIFNlbGVjdHMgdGhlIGRpc3BsYXkgbW9kZSBvZiB0aGUgdGFibGUuIENhbiBiZSBcImxpc3RcIiBvciBcImdhbGxlcnlcIi4gKi9cbiAgICBASW5wdXQoKVxuICAgIGRpc3BsYXk6IHN0cmluZyA9IERpc3BsYXlNb2RlLkxpc3Q7XG5cbiAgICAvKiogVGhlIHJvd3MgdGhhdCB0aGUgZGF0YXRhYmxlIHdpbGwgc2hvdy4gKi9cbiAgICBASW5wdXQoKVxuICAgIHJvd3M6IGFueVtdID0gW107XG5cbiAgICAvKiogRGVmaW5lIHRoZSBzb3J0IG9yZGVyIG9mIHRoZSBkYXRhdGFibGUuIFBvc3NpYmxlIHZhbHVlcyBhcmUgOlxuICAgICAqIFtgY3JlYXRlZGAsIGBkZXNjYF0sIFtgY3JlYXRlZGAsIGBhc2NgXSwgW2BkdWVgLCBgZGVzY2BdLCBbYGR1ZWAsIGBhc2NgXVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgc29ydGluZzogYW55W10gPSBbXTtcblxuICAgIC8qKiBUaGUgY29sdW1ucyB0aGF0IHRoZSBkYXRhdGFibGUgd2lsbCBzaG93LiAqL1xuICAgIEBJbnB1dCgpXG4gICAgY29sdW1uczogYW55W10gPSBbXTtcblxuICAgIC8qKiBSb3cgc2VsZWN0aW9uIG1vZGUuIENhbiBiZSBub25lLCBgc2luZ2xlYCBvciBgbXVsdGlwbGVgLiBGb3IgYG11bHRpcGxlYCBtb2RlLFxuICAgICAqIHlvdSBjYW4gdXNlIENtZCAobWFjT1MpIG9yIEN0cmwgKFdpbikgbW9kaWZpZXIga2V5IHRvIHRvZ2dsZSBzZWxlY3Rpb24gZm9yIG11bHRpcGxlIHJvd3MuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBzZWxlY3Rpb25Nb2RlOiBzdHJpbmcgPSAnc2luZ2xlJzsgLy8gbm9uZXxzaW5nbGV8bXVsdGlwbGVcblxuICAgIC8qKiBUb2dnbGVzIG11bHRpcGxlIHJvdyBzZWxlY3Rpb24sIHdoaWNoIHJlbmRlcnMgY2hlY2tib3hlcyBhdCB0aGUgYmVnaW5uaW5nIG9mIGVhY2ggcm93LiAqL1xuICAgIEBJbnB1dCgpXG4gICAgbXVsdGlzZWxlY3Q6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBUb2dnbGVzIHRoZSBkYXRhIGFjdGlvbnMgY29sdW1uLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgYWN0aW9uczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLyoqIFBvc2l0aW9uIG9mIHRoZSBhY3Rpb25zIGRyb3Bkb3duIG1lbnUuIENhbiBiZSBcImxlZnRcIiBvciBcInJpZ2h0XCIuICovXG4gICAgQElucHV0KClcbiAgICBhY3Rpb25zUG9zaXRpb246IHN0cmluZyA9ICdyaWdodCc7IC8vIGxlZnR8cmlnaHRcblxuICAgIC8qKiBGYWxsYmFjayBpbWFnZSBmb3Igcm93cyB3aGVyZSB0aGUgdGh1bWJuYWlsIGlzIG1pc3NpbmcuICovXG4gICAgQElucHV0KClcbiAgICBmYWxsYmFja1RodW1ibmFpbDogc3RyaW5nO1xuXG4gICAgLyoqIFRvZ2dsZXMgY3VzdG9tIGNvbnRleHQgbWVudSBmb3IgdGhlIGNvbXBvbmVudC4gKi9cbiAgICBASW5wdXQoKVxuICAgIGNvbnRleHRNZW51OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogVG9nZ2xlcyBmaWxlIGRyb3Agc3VwcG9ydCBmb3Igcm93cyAoc2VlXG4gICAgICogW1VwbG9hZCBkaXJlY3RpdmVdKHVwbG9hZC5kaXJlY3RpdmUubWQpIGZvciBmdXJ0aGVyIGRldGFpbHMpLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgYWxsb3dEcm9wRmlsZXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBUaGUgaW5saW5lIHN0eWxlIHRvIGFwcGx5IHRvIGV2ZXJ5IHJvdy4gU2VlXG4gICAgICogW05nU3R5bGVdKGh0dHBzOi8vYW5ndWxhci5pby9kb2NzL3RzL2xhdGVzdC9hcGkvY29tbW9uL2luZGV4L05nU3R5bGUtZGlyZWN0aXZlLmh0bWwpXG4gICAgICogZG9jcyBmb3IgbW9yZSBkZXRhaWxzIGFuZCB1c2FnZSBleGFtcGxlcy5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHJvd1N0eWxlOiBzdHJpbmc7XG5cbiAgICAvKiogVGhlIENTUyBjbGFzcyB0byBhcHBseSB0byBldmVyeSByb3cuICovXG4gICAgQElucHV0KClcbiAgICByb3dTdHlsZUNsYXNzOiBzdHJpbmcgPSAnJztcblxuICAgIC8qKiBUb2dnbGVzIHRoZSBoZWFkZXIuICovXG4gICAgQElucHV0KClcbiAgICBzaG93SGVhZGVyOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIC8qKiBUb2dnbGVzIHRoZSBzdGlja3kgaGVhZGVyIG1vZGUuICovXG4gICAgQElucHV0KClcbiAgICBzdGlja3lIZWFkZXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBFbWl0dGVkIHdoZW4gdGhlIHVzZXIgY2xpY2tzIGEgcm93LiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHJvd0NsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxEYXRhUm93RXZlbnQ+KCk7XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIHRoZSB1c2VyIGRvdWJsZS1jbGlja3MgYSByb3cuICovXG4gICAgQE91dHB1dCgpXG4gICAgcm93RGJsQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPERhdGFSb3dFdmVudD4oKTtcblxuICAgIC8qKiBFbWl0dGVkIGJlZm9yZSB0aGUgY29udGV4dCBtZW51IGlzIGRpc3BsYXllZCBmb3IgYSByb3cuICovXG4gICAgQE91dHB1dCgpXG4gICAgc2hvd1Jvd0NvbnRleHRNZW51ID0gbmV3IEV2ZW50RW1pdHRlcjxEYXRhQ2VsbEV2ZW50PigpO1xuXG4gICAgLyoqIEVtaXR0ZWQgYmVmb3JlIHRoZSBhY3Rpb25zIG1lbnUgaXMgZGlzcGxheWVkIGZvciBhIHJvdy4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBzaG93Um93QWN0aW9uc01lbnUgPSBuZXcgRXZlbnRFbWl0dGVyPERhdGFDZWxsRXZlbnQ+KCk7XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIHRoZSB1c2VyIGV4ZWN1dGVzIGEgcm93IGFjdGlvbi4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBleGVjdXRlUm93QWN0aW9uID0gbmV3IEV2ZW50RW1pdHRlcjxEYXRhUm93QWN0aW9uRXZlbnQ+KCk7XG5cbiAgICAvKiogRmxhZyB0aGF0IGluZGljYXRlcyBpZiB0aGUgZGF0YXRhYmxlIGlzIGluIGxvYWRpbmcgc3RhdGUgYW5kIG5lZWRzIHRvIHNob3cgdGhlXG4gICAgICogbG9hZGluZyB0ZW1wbGF0ZSAoc2VlIHRoZSBkb2NzIHRvIGxlYXJuIGhvdyB0byBjb25maWd1cmUgYSBsb2FkaW5nIHRlbXBsYXRlKS5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIGxvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBGbGFnIHRoYXQgaW5kaWNhdGVzIGlmIHRoZSBkYXRhdGFibGUgc2hvdWxkIHNob3cgdGhlIFwibm8gcGVybWlzc2lvblwiIHRlbXBsYXRlLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgbm9QZXJtaXNzaW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBTaG91bGQgdGhlIGl0ZW1zIGZvciB0aGUgcm93IGFjdGlvbnMgbWVudSBiZSBjYWNoZWQgZm9yIHJldXNlIGFmdGVyIHRoZXkgYXJlIGxvYWRlZFxuICAgICAqIHRoZSBmaXJzdCB0aW1lP1xuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcm93TWVudUNhY2hlRW5hYmxlZCA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBDdXN0b20gcmVzb2x2ZXIgZnVuY3Rpb24gd2hpY2ggaXMgdXNlZCB0byBwYXJzZSBkeW5hbWljIGNvbHVtbiBvYmplY3RzXG4gICAgICogc2VlIHRoZSBkb2NzIHRvIGxlYXJuIGhvdyB0byBjb25maWd1cmUgYSByZXNvbHZlckZuLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcmVzb2x2ZXJGbjogKHJvdzogRGF0YVJvdywgY29sOiBEYXRhQ29sdW1uKSA9PiBhbnkgPSBudWxsO1xuXG4gICAgbm9Db250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgbm9QZXJtaXNzaW9uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgbG9hZGluZ1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgaXNTZWxlY3RBbGxDaGVja2VkOiBib29sZWFuID0gZmFsc2U7XG4gICAgc2VsZWN0aW9uID0gbmV3IEFycmF5PERhdGFSb3c+KCk7XG5cbiAgICAvKiogVGhpcyBhcnJheSBvZiBmYWtlIHJvd3MgZml4IHRoZSBmbGV4IGxheW91dCBmb3IgdGhlIGdhbGxlcnkgdmlldyAqL1xuICAgIGZha2VSb3dzID0gW107XG5cbiAgICBwcml2YXRlIGtleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxEYXRhVGFibGVSb3dDb21wb25lbnQ+O1xuICAgIHByaXZhdGUgY2xpY2tPYnNlcnZlcjogT2JzZXJ2ZXI8RGF0YVJvd0V2ZW50PjtcbiAgICBwcml2YXRlIGNsaWNrJDogT2JzZXJ2YWJsZTxEYXRhUm93RXZlbnQ+O1xuXG4gICAgcHJpdmF0ZSBkaWZmZXI6IGFueTtcbiAgICBwcml2YXRlIHJvd01lbnVDYWNoZTogb2JqZWN0ID0ge307XG5cbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gICAgcHJpdmF0ZSBzaW5nbGVDbGlja1N0cmVhbVN1YjogU3Vic2NyaXB0aW9uO1xuICAgIHByaXZhdGUgbXVsdGlDbGlja1N0cmVhbVN1YjogU3Vic2NyaXB0aW9uO1xuICAgIHByaXZhdGUgZGF0YVJvd3NDaGFuZ2VkOiBTdWJzY3JpcHRpb247XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXl1cCcsIFsnJGV2ZW50J10pXG4gICAgb25LZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMua2V5TWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBkaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMpIHtcbiAgICAgICAgaWYgKGRpZmZlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuZGlmZmVyID0gZGlmZmVycy5maW5kKFtdKS5jcmVhdGUobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGljayQgPSBuZXcgT2JzZXJ2YWJsZTxEYXRhUm93RXZlbnQ+KChvYnNlcnZlcikgPT4gdGhpcy5jbGlja09ic2VydmVyID0gb2JzZXJ2ZXIpXG4gICAgICAgICAgICAucGlwZShzaGFyZSgpKTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbkxpc3QpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uTGlzdC5jb2x1bW5zLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRUYWJsZVNjaGVtYSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YXRhYmxlTGF5b3V0Rml4KCk7XG4gICAgICAgIHRoaXMuc2V0VGFibGVTY2hlbWEoKTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMua2V5TWFuYWdlciA9IG5ldyBGb2N1c0tleU1hbmFnZXIodGhpcy5yb3dzTGlzdClcbiAgICAgICAgICAgIC53aXRoV3JhcCgpXG4gICAgICAgICAgICAuc2tpcFByZWRpY2F0ZShpdGVtID0+IGl0ZW0uZGlzYWJsZWQpO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5pbml0QW5kU3Vic2NyaWJlQ2xpY2tTdHJlYW0oKTtcbiAgICAgICAgaWYgKHRoaXMuaXNQcm9wZXJ0eUNoYW5nZWQoY2hhbmdlc1snZGF0YSddKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNUYWJsZUVtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRUYWJsZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBjaGFuZ2VzWydkYXRhJ10uY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzUHJvcGVydHlDaGFuZ2VkKGNoYW5nZXNbJ3Jvd3MnXSkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVGFibGVFbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0VGFibGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUYWJsZVJvd3MoY2hhbmdlc1sncm93cyddLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hhbmdlcy5zZWxlY3Rpb25Nb2RlICYmICFjaGFuZ2VzLnNlbGVjdGlvbk1vZGUuaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmVtaXRSb3dTZWxlY3Rpb25FdmVudCgncm93LXVuc2VsZWN0JywgbnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1Byb3BlcnR5Q2hhbmdlZChjaGFuZ2VzWydzb3J0aW5nJ10pKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRhYmxlU29ydGluZyhjaGFuZ2VzWydzb3J0aW5nJ10uY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzUHJvcGVydHlDaGFuZ2VkKGNoYW5nZXNbJ2Rpc3BsYXknXSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YXRhYmxlTGF5b3V0Rml4KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0NvbHVtblNvcnRBY3RpdmUoY29sdW1uOiBEYXRhQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghY29sdW1uIHx8ICF0aGlzLmRhdGEuZ2V0U29ydGluZygpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbHVtbi5rZXkgPT09IHRoaXMuZGF0YS5nZXRTb3J0aW5nKCkua2V5O1xuICAgIH1cblxuICAgIG5nRG9DaGVjaygpIHtcbiAgICAgICAgY29uc3QgY2hhbmdlcyA9IHRoaXMuZGlmZmVyLmRpZmYodGhpcy5yb3dzKTtcbiAgICAgICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGFibGVSb3dzKHRoaXMucm93cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc1Byb3BlcnR5Q2hhbmdlZChwcm9wZXJ0eTogU2ltcGxlQ2hhbmdlKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBwcm9wZXJ0eSAmJiBwcm9wZXJ0eS5jdXJyZW50VmFsdWUgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgY29udmVydFRvUm93c0RhdGEocm93czogYW55IFtdKTogT2JqZWN0RGF0YVJvd1tdIHtcbiAgICAgICAgcmV0dXJuIHJvd3MubWFwKChyb3cpID0+IG5ldyBPYmplY3REYXRhUm93KHJvdywgcm93LmlzU2VsZWN0ZWQpKTtcbiAgICB9XG5cbiAgICBjb252ZXJ0VG9EYXRhU29ydGluZyhzb3J0aW5nOiBhbnlbXSk6IERhdGFTb3J0aW5nIHwgbnVsbCB7XG4gICAgICAgIGlmIChzb3J0aW5nICYmIHNvcnRpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRhU29ydGluZyhzb3J0aW5nWzBdLCBzb3J0aW5nWzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRBbmRTdWJzY3JpYmVDbGlja1N0cmVhbSgpIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZUNsaWNrU3RyZWFtKCk7XG4gICAgICAgIGNvbnN0IHNpbmdsZUNsaWNrU3RyZWFtID0gdGhpcy5jbGljayRcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIGJ1ZmZlcihcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGljayQucGlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYm91bmNlVGltZSgyNTApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIG1hcCgobGlzdCkgPT4gbGlzdCksXG4gICAgICAgICAgICAgICAgZmlsdGVyKCh4KSA9PiB4Lmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5zaW5nbGVDbGlja1N0cmVhbVN1YiA9IHNpbmdsZUNsaWNrU3RyZWFtLnN1YnNjcmliZSgoZGF0YVJvd0V2ZW50czogRGF0YVJvd0V2ZW50W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50OiBEYXRhUm93RXZlbnQgPSBkYXRhUm93RXZlbnRzWzBdO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVSb3dTZWxlY3Rpb24oZXZlbnQudmFsdWUsIDxNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudD4gZXZlbnQuZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5yb3dDbGljay5lbWl0KGV2ZW50KTtcbiAgICAgICAgICAgIGlmICghZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudCgncm93LWNsaWNrJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBtdWx0aUNsaWNrU3RyZWFtID0gdGhpcy5jbGljayRcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIGJ1ZmZlcihcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGljayQucGlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYm91bmNlVGltZSgyNTApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIG1hcCgobGlzdCkgPT4gbGlzdCksXG4gICAgICAgICAgICAgICAgZmlsdGVyKCh4KSA9PiB4Lmxlbmd0aCA+PSAyKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB0aGlzLm11bHRpQ2xpY2tTdHJlYW1TdWIgPSBtdWx0aUNsaWNrU3RyZWFtLnN1YnNjcmliZSgoZGF0YVJvd0V2ZW50czogRGF0YVJvd0V2ZW50W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50OiBEYXRhUm93RXZlbnQgPSBkYXRhUm93RXZlbnRzWzBdO1xuICAgICAgICAgICAgdGhpcy5yb3dEYmxDbGljay5lbWl0KGV2ZW50KTtcbiAgICAgICAgICAgIGlmICghZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudCgncm93LWRibGNsaWNrJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVuc3Vic2NyaWJlQ2xpY2tTdHJlYW0oKSB7XG4gICAgICAgIGlmICh0aGlzLnNpbmdsZUNsaWNrU3RyZWFtU3ViKSB7XG4gICAgICAgICAgICB0aGlzLnNpbmdsZUNsaWNrU3RyZWFtU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLnNpbmdsZUNsaWNrU3RyZWFtU3ViID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tdWx0aUNsaWNrU3RyZWFtU3ViKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpQ2xpY2tTdHJlYW1TdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHRoaXMubXVsdGlDbGlja1N0cmVhbVN1YiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRUYWJsZSgpIHtcbiAgICAgICAgY29uc3QgcnVudGltZUNvbHVtbnMgPSB0aGlzLmdldFJ1bnRpbWVDb2x1bW5zKCk7XG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBPYmplY3REYXRhVGFibGVBZGFwdGVyKHRoaXMucm93cywgcnVudGltZUNvbHVtbnMpO1xuXG4gICAgICAgIHRoaXMuc2V0VGFibGVTb3J0aW5nKHRoaXMuc29ydGluZyk7XG4gICAgICAgIHRoaXMucmVzZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgdGhpcy5yb3dNZW51Q2FjaGUgPSB7fTtcbiAgICB9XG5cbiAgICBpc1RhYmxlRW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmRhdGEgPT09IG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRUYWJsZVJvd3Mocm93czogYW55W10pIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5kYXRhLnNldFJvd3ModGhpcy5jb252ZXJ0VG9Sb3dzRGF0YShyb3dzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJ1bnRpbWVDb2x1bW5zKCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIC4uLih0aGlzLmNvbHVtbnMgfHwgW10pLFxuICAgICAgICAgICAgLi4udGhpcy5nZXRTY2hlbWFGcm9tSHRtbCgpXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRUYWJsZVNjaGVtYSgpIHtcbiAgICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMuZ2V0UnVudGltZUNvbHVtbnMoKTtcblxuICAgICAgICBpZiAodGhpcy5kYXRhICYmIGNvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhLnNldENvbHVtbnMoY29sdW1ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFRhYmxlU29ydGluZyhzb3J0aW5nOiBhbnlbXSkge1xuICAgICAgICBpZiAodGhpcy5kYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEuc2V0U29ydGluZyh0aGlzLmNvbnZlcnRUb0RhdGFTb3J0aW5nKHNvcnRpbmcpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTY2hlbWFGcm9tSHRtbCgpOiBhbnkge1xuICAgICAgICBsZXQgc2NoZW1hID0gW107XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbkxpc3QgJiYgdGhpcy5jb2x1bW5MaXN0LmNvbHVtbnMgJiYgdGhpcy5jb2x1bW5MaXN0LmNvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2NoZW1hID0gdGhpcy5jb2x1bW5MaXN0LmNvbHVtbnMubWFwKChjKSA9PiA8RGF0YUNvbHVtbj4gYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjaGVtYTtcbiAgICB9XG5cbiAgICBvblJvd0NsaWNrKHJvdzogRGF0YVJvdywgbW91c2VFdmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAobW91c2VFdmVudCkge1xuICAgICAgICAgICAgbW91c2VFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJvdykge1xuICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLmRhdGEuZ2V0Um93cygpLmluZGV4T2Yocm93KSArICh0aGlzLmlzSGVhZGVyTGlzdFZpc2libGUoKSA/IDEgOiAwKTtcbiAgICAgICAgICAgIHRoaXMua2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKHJvd0luZGV4KTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YVJvd0V2ZW50ID0gbmV3IERhdGFSb3dFdmVudChyb3csIG1vdXNlRXZlbnQsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5jbGlja09ic2VydmVyLm5leHQoZGF0YVJvd0V2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRW50ZXJLZXlQcmVzc2VkKHJvdzogRGF0YVJvdywgZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAocm93KSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVJvd1NlbGVjdGlvbihyb3csIGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0hlYWRlckxpc3RWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0hlYWRlclZpc2libGUoKSAmJiB0aGlzLmRpc3BsYXkgPT09IERpc3BsYXlNb2RlLkxpc3Q7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVSb3dTZWxlY3Rpb24ocm93OiBEYXRhUm93LCBlOiBLZXlib2FyZEV2ZW50IHwgTW91c2VFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1NpbmdsZVNlbGVjdGlvbk1vZGUoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdFJvdyhyb3csIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdFJvd1NlbGVjdGlvbkV2ZW50KCdyb3ctc2VsZWN0Jywgcm93KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNNdWx0aVNlbGVjdGlvbk1vZGUoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vZGlmaWVyID0gZSAmJiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSk7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1ZhbHVlOiBib29sZWFuO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbi5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSAhcm93LmlzU2VsZWN0ZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSBtb2RpZmllciA/ICFyb3cuaXNTZWxlY3RlZCA6IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGRvbUV2ZW50TmFtZSA9IG5ld1ZhbHVlID8gJ3Jvdy1zZWxlY3QnIDogJ3Jvdy11bnNlbGVjdCc7XG5cbiAgICAgICAgICAgICAgICBpZiAoIW1vZGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RSb3cocm93LCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0Um93U2VsZWN0aW9uRXZlbnQoZG9tRXZlbnROYW1lLCByb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXRTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd3MgPSB0aGlzLmRhdGEuZ2V0Um93cygpO1xuICAgICAgICAgICAgaWYgKHJvd3MgJiYgcm93cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcm93cy5mb3JFYWNoKChyKSA9PiByLmlzU2VsZWN0ZWQgPSBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbiA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNTZWxlY3RBbGxDaGVja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb25Sb3dEYmxDbGljayhyb3c6IERhdGFSb3csIGV2ZW50PzogRXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGFSb3dFdmVudCA9IG5ldyBEYXRhUm93RXZlbnQocm93LCBldmVudCwgdGhpcyk7XG4gICAgICAgIHRoaXMuY2xpY2tPYnNlcnZlci5uZXh0KGRhdGFSb3dFdmVudCk7XG4gICAgfVxuXG4gICAgb25Sb3dLZXlVcChyb3c6IERhdGFSb3csIGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3Jvdy1rZXl1cCcsIHtcbiAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgIHJvdzogcm93LFxuICAgICAgICAgICAgICAgIGtleWJvYXJkRXZlbnQ6IGUsXG4gICAgICAgICAgICAgICAgc2VuZGVyOiB0aGlzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYnViYmxlczogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuICAgICAgICBpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbktleWJvYXJkTmF2aWdhdGUocm93LCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25LZXlib2FyZE5hdmlnYXRlKHJvdzogRGF0YVJvdywga2V5Ym9hcmRFdmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAoa2V5Ym9hcmRFdmVudCkge1xuICAgICAgICAgICAga2V5Ym9hcmRFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgRGF0YVJvd0V2ZW50KHJvdywga2V5Ym9hcmRFdmVudCwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5yb3dEYmxDbGljay5lbWl0KGV2ZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudCgncm93LWRibGNsaWNrJywge1xuICAgICAgICAgICAgICAgIGRldGFpbDogZXZlbnQsXG4gICAgICAgICAgICAgICAgYnViYmxlczogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBvbkNvbHVtbkhlYWRlckNsaWNrKGNvbHVtbjogRGF0YUNvbHVtbikge1xuICAgICAgICBpZiAoY29sdW1uICYmIGNvbHVtbi5zb3J0YWJsZSkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuZGF0YS5nZXRTb3J0aW5nKCk7XG4gICAgICAgICAgICBsZXQgbmV3RGlyZWN0aW9uID0gJ2FzYyc7XG4gICAgICAgICAgICBpZiAoY3VycmVudCAmJiBjb2x1bW4ua2V5ID09PSBjdXJyZW50LmtleSkge1xuICAgICAgICAgICAgICAgIG5ld0RpcmVjdGlvbiA9IGN1cnJlbnQuZGlyZWN0aW9uID09PSAnYXNjJyA/ICdkZXNjJyA6ICdhc2MnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kYXRhLnNldFNvcnRpbmcobmV3IERhdGFTb3J0aW5nKGNvbHVtbi5rZXksIG5ld0RpcmVjdGlvbikpO1xuICAgICAgICAgICAgdGhpcy5lbWl0U29ydGluZ0NoYW5nZWRFdmVudChjb2x1bW4ua2V5LCBuZXdEaXJlY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW1JbmRleCgwKTtcbiAgICB9XG5cbiAgICBvblNlbGVjdEFsbENsaWNrKG1hdENoZWNrYm94Q2hhbmdlOiBNYXRDaGVja2JveENoYW5nZSkge1xuICAgICAgICB0aGlzLmlzU2VsZWN0QWxsQ2hlY2tlZCA9IG1hdENoZWNrYm94Q2hhbmdlLmNoZWNrZWQ7XG5cbiAgICAgICAgaWYgKHRoaXMubXVsdGlzZWxlY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd3MgPSB0aGlzLmRhdGEuZ2V0Um93cygpO1xuICAgICAgICAgICAgaWYgKHJvd3MgJiYgcm93cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0Um93KHJvd3NbaV0sIG1hdENoZWNrYm94Q2hhbmdlLmNoZWNrZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZG9tRXZlbnROYW1lID0gbWF0Q2hlY2tib3hDaGFuZ2UuY2hlY2tlZCA/ICdyb3ctc2VsZWN0JyA6ICdyb3ctdW5zZWxlY3QnO1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5zZWxlY3Rpb24ubGVuZ3RoID4gMCA/IHRoaXMuc2VsZWN0aW9uWzBdIDogbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5lbWl0Um93U2VsZWN0aW9uRXZlbnQoZG9tRXZlbnROYW1lLCByb3cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DaGVja2JveENoYW5nZShyb3c6IERhdGFSb3csIGV2ZW50OiBNYXRDaGVja2JveENoYW5nZSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGV2ZW50LmNoZWNrZWQ7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RSb3cocm93LCBuZXdWYWx1ZSk7XG5cbiAgICAgICAgY29uc3QgZG9tRXZlbnROYW1lID0gbmV3VmFsdWUgPyAncm93LXNlbGVjdCcgOiAncm93LXVuc2VsZWN0JztcbiAgICAgICAgdGhpcy5lbWl0Um93U2VsZWN0aW9uRXZlbnQoZG9tRXZlbnROYW1lLCByb3cpO1xuICAgIH1cblxuICAgIG9uSW1hZ2VMb2FkaW5nRXJyb3IoZXZlbnQ6IEV2ZW50LCByb3c6IERhdGFSb3cpIHtcbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gPGFueT4gZXZlbnQudGFyZ2V0O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5mYWxsYmFja1RodW1ibmFpbCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3JjID0gdGhpcy5mYWxsYmFja1RodW1ibmFpbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zcmMgPSByb3cuaW1hZ2VFcnJvclJlc29sdmVyKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzSWNvblZhbHVlKHJvdzogRGF0YVJvdywgY29sOiBEYXRhQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChyb3cgJiYgY29sKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHJvdy5nZXRWYWx1ZShjb2wua2V5KTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS5zdGFydHNXaXRoKCdtYXRlcmlhbC1pY29uczovLycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBhc0ljb25WYWx1ZShyb3c6IERhdGFSb3csIGNvbDogRGF0YUNvbHVtbik6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmlzSWNvblZhbHVlKHJvdywgY29sKSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSByb3cuZ2V0VmFsdWUoY29sLmtleSkgfHwgJyc7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgnbWF0ZXJpYWwtaWNvbnM6Ly8nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWNvbkFsdFRleHRLZXkodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA/ICdJQ09OUy4nICsgdmFsdWUuc3Vic3RyaW5nKHZhbHVlLmxhc3RJbmRleE9mKCcvJykgKyAxKS5yZXBsYWNlKC9cXC5bYS16XSsvLCAnJykgOiAnJztcbiAgICB9XG5cbiAgICBpc0NvbHVtblNvcnRlZChjb2w6IERhdGFDb2x1bW4sIGRpcmVjdGlvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChjb2wgJiYgZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBzb3J0aW5nID0gdGhpcy5kYXRhLmdldFNvcnRpbmcoKTtcbiAgICAgICAgICAgIHJldHVybiBzb3J0aW5nICYmIHNvcnRpbmcua2V5ID09PSBjb2wua2V5ICYmIHNvcnRpbmcuZGlyZWN0aW9uID09PSBkaXJlY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldENvbnRleHRNZW51QWN0aW9ucyhyb3c6IERhdGFSb3csIGNvbDogRGF0YUNvbHVtbik6IGFueVtdIHtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgRGF0YUNlbGxFdmVudChyb3csIGNvbCwgW10pO1xuICAgICAgICB0aGlzLnNob3dSb3dDb250ZXh0TWVudS5lbWl0KGV2ZW50KTtcbiAgICAgICAgcmV0dXJuIGV2ZW50LnZhbHVlLmFjdGlvbnM7XG4gICAgfVxuXG4gICAgZ2V0Um93QWN0aW9ucyhyb3c6IERhdGFSb3csIGNvbD86IERhdGFDb2x1bW4pOiBhbnlbXSB7XG4gICAgICAgIGNvbnN0IGlkID0gcm93LmdldFZhbHVlKCdpZCcpO1xuXG4gICAgICAgIGlmICghdGhpcy5yb3dNZW51Q2FjaGVbaWRdKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IG5ldyBEYXRhQ2VsbEV2ZW50KHJvdywgY29sLCBbXSk7XG4gICAgICAgICAgICB0aGlzLnNob3dSb3dBY3Rpb25zTWVudS5lbWl0KGV2ZW50KTtcbiAgICAgICAgICAgIGlmICghdGhpcy5yb3dNZW51Q2FjaGVFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmlzaWJsZUFjdGlvbnMoZXZlbnQudmFsdWUuYWN0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJvd01lbnVDYWNoZVtpZF0gPSBldmVudC52YWx1ZS5hY3Rpb25zO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmlzaWJsZUFjdGlvbnModGhpcy5yb3dNZW51Q2FjaGVbaWRdKTtcbiAgICB9XG5cbiAgICBnZXRWaXNpYmxlQWN0aW9ucyhhY3Rpb25zOiBhbnlbXSk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbnMuZmlsdGVyKChhY3Rpb24pID0+IGFjdGlvbi52aXNpYmxlIHx8IGFjdGlvbi52aXNpYmxlID09PSB1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIG9uRXhlY3V0ZVJvd0FjdGlvbihyb3c6IERhdGFSb3csIGFjdGlvbjogYW55KSB7XG4gICAgICAgIGlmIChhY3Rpb24uZGlzYWJsZWQgfHwgYWN0aW9uLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZVJvd0FjdGlvbi5lbWl0KG5ldyBEYXRhUm93QWN0aW9uRXZlbnQocm93LCBhY3Rpb24pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJvd0FsbG93c0Ryb3Aocm93OiBEYXRhUm93KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiByb3cuaXNEcm9wVGFyZ2V0ID09PSB0cnVlO1xuICAgIH1cblxuICAgIGhhc1NlbGVjdGlvbk1vZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzU2luZ2xlU2VsZWN0aW9uTW9kZSgpIHx8IHRoaXMuaXNNdWx0aVNlbGVjdGlvbk1vZGUoKTtcbiAgICB9XG5cbiAgICBpc1NpbmdsZVNlbGVjdGlvbk1vZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbk1vZGUgJiYgdGhpcy5zZWxlY3Rpb25Nb2RlLnRvTG93ZXJDYXNlKCkgPT09ICdzaW5nbGUnO1xuICAgIH1cblxuICAgIGlzTXVsdGlTZWxlY3Rpb25Nb2RlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25Nb2RlICYmIHRoaXMuc2VsZWN0aW9uTW9kZS50b0xvd2VyQ2FzZSgpID09PSAnbXVsdGlwbGUnO1xuICAgIH1cblxuICAgIGdldFJvd1N0eWxlKHJvdzogRGF0YVJvdyk6IHN0cmluZyB7XG4gICAgICAgIHJvdy5jc3NDbGFzcyA9IHJvdy5jc3NDbGFzcyA/IHJvdy5jc3NDbGFzcyA6ICcnO1xuICAgICAgICB0aGlzLnJvd1N0eWxlQ2xhc3MgPSB0aGlzLnJvd1N0eWxlQ2xhc3MgPyB0aGlzLnJvd1N0eWxlQ2xhc3MgOiAnJztcbiAgICAgICAgcmV0dXJuIGAke3Jvdy5jc3NDbGFzc30gJHt0aGlzLnJvd1N0eWxlQ2xhc3N9YDtcbiAgICB9XG5cbiAgICBnZXRTb3J0aW5nS2V5KCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgICBpZiAodGhpcy5kYXRhLmdldFNvcnRpbmcoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5nZXRTb3J0aW5nKCkua2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc2VsZWN0Um93KHJvdzogRGF0YVJvdywgdmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHJvdykge1xuICAgICAgICAgICAgcm93LmlzU2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuc2VsZWN0aW9uLmluZGV4T2Yocm93KTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChpZHggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uLnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbi5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDZWxsVG9vbHRpcChyb3c6IERhdGFSb3csIGNvbDogRGF0YUNvbHVtbik6IHN0cmluZyB7XG4gICAgICAgIGlmIChyb3cgJiYgY29sICYmIGNvbC5mb3JtYXRUb29sdGlwKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQ6IHN0cmluZyA9IGNvbC5mb3JtYXRUb29sdGlwKHJvdywgY29sKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldFNvcnRhYmxlQ29sdW1ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5nZXRDb2x1bW5zKCkuZmlsdGVyKChjb2x1bW4pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW4uc29ydGFibGUgPT09IHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlzRW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuZ2V0Um93cygpLmxlbmd0aCA9PT0gMDtcbiAgICB9XG5cbiAgICBpc0hlYWRlclZpc2libGUoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5sb2FkaW5nICYmICF0aGlzLmlzRW1wdHkoKSAmJiAhdGhpcy5ub1Blcm1pc3Npb247XG4gICAgfVxuXG4gICAgaXNTdGlja3lIZWFkZXJFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGlja3lIZWFkZXIgJiYgdGhpcy5pc0hlYWRlclZpc2libGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGVtaXRSb3dTZWxlY3Rpb25FdmVudChuYW1lOiBzdHJpbmcsIHJvdzogRGF0YVJvdykge1xuICAgICAgICBjb25zdCBkb21FdmVudCA9IG5ldyBDdXN0b21FdmVudChuYW1lLCB7XG4gICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICByb3c6IHJvdyxcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb246IHRoaXMuc2VsZWN0aW9uXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYnViYmxlczogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChkb21FdmVudCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbWl0U29ydGluZ0NoYW5nZWRFdmVudChrZXk6IHN0cmluZywgZGlyZWN0aW9uOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZG9tRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3NvcnRpbmctY2hhbmdlZCcsIHtcbiAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb25cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBidWJibGVzOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KGRvbUV2ZW50KTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZUNsaWNrU3RyZWFtKCk7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goKHMpID0+IHMudW5zdWJzY3JpYmUoKSk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IFtdO1xuXG4gICAgICAgIGlmICh0aGlzLmRhdGFSb3dzQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhUm93c0NoYW5nZWQudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVJvd3NDaGFuZ2VkID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRhdGF0YWJsZUxheW91dEZpeCgpIHtcbiAgICAgICAgY29uc3QgbWF4R2FsbGVyeVJvd3MgPSAyNTtcblxuICAgICAgICBpZiAodGhpcy5kaXNwbGF5ID09PSAnZ2FsbGVyeScpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4R2FsbGVyeVJvd3M7IGkrKykge1xuICAgICAgICAgICAgICAgdGhpcy5mYWtlUm93cy5wdXNoKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmFrZVJvd3MgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE5hbWVDb2x1bW5WYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5nZXRDb2x1bW5zKCkuZmluZCggKGVsOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbC5rZXkuaW5jbHVkZXMoJ25hbWUnKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0QXV0b21hdGlvblZhbHVlKHJvdzogRGF0YVJvdyk6IGFueSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmdldE5hbWVDb2x1bW5WYWx1ZSgpO1xuICAgICAgICByZXR1cm4gbmFtZSA/IHJvdy5nZXRWYWx1ZShuYW1lLmtleSkgOiAnJztcbiAgICB9XG5cbiAgICBnZXRBcmlhU29ydChjb2x1bW46IERhdGFDb2x1bW4pOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMuaXNDb2x1bW5Tb3J0QWN0aXZlKGNvbHVtbikpIHtcbiAgICAgICAgICAgIHJldHVybiAnQURGLURBVEFUQUJMRS5BQ0NFU1NJQklMSVRZLlNPUlRfTk9ORSc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5pc0NvbHVtblNvcnRlZChjb2x1bW4sICdhc2MnKSA/XG4gICAgICAgICAgICAnQURGLURBVEFUQUJMRS5BQ0NFU1NJQklMSVRZLlNPUlRfQVNDRU5ESU5HJyA6XG4gICAgICAgICAgICAnQURGLURBVEFUQUJMRS5BQ0NFU1NJQklMSVRZLlNPUlRfREVTQ0VORElORyc7XG4gICAgfVxuXG4gICAgZ2V0U29ydExpdmVBbm5vdW5jZW1lbnQoY29sdW1uOiBEYXRhQ29sdW1uKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQ29sdW1uU29ydEFjdGl2ZShjb2x1bW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gJ0FERi1EQVRBVEFCTEUuQUNDRVNTSUJJTElUWS5TT1JUX0RFRkFVTFQnIDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5pc0NvbHVtblNvcnRlZChjb2x1bW4sICdhc2MnKSA/XG4gICAgICAgICAgICAnQURGLURBVEFUQUJMRS5BQ0NFU1NJQklMSVRZLlNPUlRfQVNDRU5ESU5HX0JZJyA6XG4gICAgICAgICAgICAnQURGLURBVEFUQUJMRS5BQ0NFU1NJQklMSVRZLlNPUlRfREVTQ0VORElOR19CWSc7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIERhdGFUYWJsZURyb3BFdmVudCB7XG4gICAgZGV0YWlsOiB7XG4gICAgICAgIHRhcmdldDogJ2NlbGwnIHwgJ2hlYWRlcic7XG4gICAgICAgIGV2ZW50OiBFdmVudDtcbiAgICAgICAgY29sdW1uOiBEYXRhQ29sdW1uO1xuICAgICAgICByb3c/OiBEYXRhUm93XG4gICAgfTtcblxuICAgIHByZXZlbnREZWZhdWx0KCk6IHZvaWQ7XG59XG4iXX0=
