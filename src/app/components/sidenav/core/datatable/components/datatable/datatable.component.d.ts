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
  QueryList,
  AfterContentInit,
  DoCheck,
  ElementRef,
  EventEmitter,
  IterableDiffers,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { DataColumnListComponent } from '../../../data-column/data-column-list.component';
import { DataColumn } from '../../data/data-column.model';
import { DataRowEvent } from '../../data/data-row-event.model';
import { DataRow } from '../../data/data-row.model';
import { DataSorting } from '../../data/data-sorting.model';
import { DataTableAdapter } from '../../data/datatable-adapter';
import { DataTableRowComponent } from './datatable-row.component';
import { ObjectDataRow } from '../../data/object-datarow.model';
import { DataCellEvent } from './data-cell.event';
import { DataRowActionEvent } from './data-row-action.event';
export declare enum DisplayMode {
  List = 'list',
  Gallery = 'gallery'
}
export declare class DataTableComponent
  implements AfterContentInit, OnChanges, DoCheck, OnDestroy {
  private elementRef;
  rowsList: QueryList<DataTableRowComponent>;
  columnList: DataColumnListComponent;
  /** Data source for the table */
  data: DataTableAdapter;
  /** Selects the display mode of the table. Can be "list" or "gallery". */
  display: string;
  /** The rows that the datatable will show. */
  rows: any[];
  /** Define the sort order of the datatable. Possible values are :
   * [`created`, `desc`], [`created`, `asc`], [`due`, `desc`], [`due`, `asc`]
   */
  sorting: any[];
  /** The columns that the datatable will show. */
  columns: any[];
  /** Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
   * you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows.
   */
  selectionMode: string;
  /** Toggles multiple row selection, which renders checkboxes at the beginning of each row. */
  multiselect: boolean;
  /** Toggles the data actions column. */
  actions: boolean;
  /** Position of the actions dropdown menu. Can be "left" or "right". */
  actionsPosition: string;
  /** Fallback image for rows where the thumbnail is missing. */
  fallbackThumbnail: string;
  /** Toggles custom context menu for the component. */
  contextMenu: boolean;
  /** Toggles file drop support for rows (see
   * [Upload directive](upload.directive.md) for further details).
   */
  allowDropFiles: boolean;
  /** The inline style to apply to every row. See
   * [NgStyle](https://angular.io/docs/ts/latest/api/common/index/NgStyle-directive.html)
   * docs for more details and usage examples.
   */
  rowStyle: string;
  /** The CSS class to apply to every row. */
  rowStyleClass: string;
  /** Toggles the header. */
  showHeader: boolean;
  /** Toggles the sticky header mode. */
  stickyHeader: boolean;
  /** Emitted when the user clicks a row. */
  rowClick: EventEmitter<DataRowEvent>;
  /** Emitted when the user double-clicks a row. */
  rowDblClick: EventEmitter<DataRowEvent>;
  /** Emitted before the context menu is displayed for a row. */
  showRowContextMenu: EventEmitter<DataCellEvent>;
  /** Emitted before the actions menu is displayed for a row. */
  showRowActionsMenu: EventEmitter<DataCellEvent>;
  /** Emitted when the user executes a row action. */
  executeRowAction: EventEmitter<DataRowActionEvent>;
  /** Flag that indicates if the datatable is in loading state and needs to show the
   * loading template (see the docs to learn how to configure a loading template).
   */
  loading: boolean;
  /** Flag that indicates if the datatable should show the "no permission" template. */
  noPermission: boolean;
  /**
   * Should the items for the row actions menu be cached for reuse after they are loaded
   * the first time?
   */
  rowMenuCacheEnabled: boolean;
  /**
   * Custom resolver function which is used to parse dynamic column objects
   * see the docs to learn how to configure a resolverFn.
   */
  resolverFn: (row: DataRow, col: DataColumn) => any;
  noContentTemplate: TemplateRef<any>;
  noPermissionTemplate: TemplateRef<any>;
  loadingTemplate: TemplateRef<any>;
  isSelectAllChecked: boolean;
  selection: DataRow[];
  /** This array of fake rows fix the flex layout for the gallery view */
  fakeRows: any[];
  private keyManager;
  private clickObserver;
  private click$;
  private differ;
  private rowMenuCache;
  private subscriptions;
  private singleClickStreamSub;
  private multiClickStreamSub;
  private dataRowsChanged;
  onKeydown(event: KeyboardEvent): void;
  constructor(elementRef: ElementRef, differs: IterableDiffers);
  ngAfterContentInit(): void;
  ngAfterViewInit(): void;
  ngOnChanges(changes: SimpleChanges): void;
  isColumnSortActive(column: DataColumn): boolean;
  ngDoCheck(): void;
  isPropertyChanged(property: SimpleChange): boolean;
  convertToRowsData(rows: any[]): ObjectDataRow[];
  convertToDataSorting(sorting: any[]): DataSorting | null;
  private initAndSubscribeClickStream;
  private unsubscribeClickStream;
  private initTable;
  isTableEmpty(): boolean;
  private setTableRows;
  private getRuntimeColumns;
  private setTableSchema;
  private setTableSorting;
  getSchemaFromHtml(): any;
  onRowClick(row: DataRow, mouseEvent: MouseEvent): void;
  onEnterKeyPressed(row: DataRow, e: KeyboardEvent): void;
  private isHeaderListVisible;
  private handleRowSelection;
  resetSelection(): void;
  onRowDblClick(row: DataRow, event?: Event): void;
  onRowKeyUp(row: DataRow, e: KeyboardEvent): void;
  private onKeyboardNavigate;
  onColumnHeaderClick(column: DataColumn): void;
  onSelectAllClick(matCheckboxChange: MatCheckboxChange): void;
  onCheckboxChange(row: DataRow, event: MatCheckboxChange): void;
  onImageLoadingError(event: Event, row: DataRow): void;
  isIconValue(row: DataRow, col: DataColumn): boolean;
  asIconValue(row: DataRow, col: DataColumn): string;
  iconAltTextKey(value: string): string;
  isColumnSorted(col: DataColumn, direction: string): boolean;
  getContextMenuActions(row: DataRow, col: DataColumn): any[];
  getRowActions(row: DataRow, col?: DataColumn): any[];
  getVisibleActions(actions: any[]): any[];
  onExecuteRowAction(row: DataRow, action: any): void;
  rowAllowsDrop(row: DataRow): boolean;
  hasSelectionMode(): boolean;
  isSingleSelectionMode(): boolean;
  isMultiSelectionMode(): boolean;
  getRowStyle(row: DataRow): string;
  getSortingKey(): string | null;
  selectRow(row: DataRow, value: boolean): void;
  getCellTooltip(row: DataRow, col: DataColumn): string;
  getSortableColumns(): DataColumn[];
  isEmpty(): boolean;
  isHeaderVisible(): boolean;
  isStickyHeaderEnabled(): boolean;
  private emitRowSelectionEvent;
  private emitSortingChangedEvent;
  ngOnDestroy(): void;
  datatableLayoutFix(): void;
  getNameColumnValue(): DataColumn;
  getAutomationValue(row: DataRow): any;
  getAriaSort(column: DataColumn): string;
  getSortLiveAnnouncement(column: DataColumn): string;
}
export interface DataTableDropEvent {
  detail: {
    target: 'cell' | 'header';
    event: Event;
    column: DataColumn;
    row?: DataRow;
  };
  preventDefault(): void;
}
