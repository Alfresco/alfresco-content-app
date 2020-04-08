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
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { DataTableCellComponent } from './datatable-cell.component';
import { AlfrescoApiService } from '../../../services/alfresco-api.service';
export class LocationCellComponent extends DataTableCellComponent {
  /**
   * @param {?} alfrescoApiService
   */
  constructor(alfrescoApiService) {
    super(alfrescoApiService);
  }
  /**
   * @override
   * @return {?}
   */
  ngOnInit() {
    if (this.column && this.column.key && this.row && this.data) {
      /** @type {?} */
      const path = this.data.getValue(this.row, this.column, this.resolverFn);
      if (path && path.name && path.elements) {
        this.value$.next(path.name.split('/').pop());
        if (!this.tooltip) {
          this.tooltip = path.name;
        }
        /** @type {?} */
        const parent = path.elements[path.elements.length - 1];
        this.link = [this.column.format, parent.id];
      }
    }
  }
}
LocationCellComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-location-cell',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `
        <ng-container>
            <a href="" [title]="tooltip" [routerLink]="link">
                {{ value$ | async }}
            </a>
        </ng-container>
    `,
        encapsulation: ViewEncapsulation.None,
        host: { class: 'adf-location-cell adf-datatable-content-cell' }
      }
    ]
  }
];
/** @nocollapse */
LocationCellComponent.ctorParameters = () => [{ type: AlfrescoApiService }];
LocationCellComponent.propDecorators = {
  link: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  LocationCellComponent.prototype.link;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb24tY2VsbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkYXRhdGFibGUvY29tcG9uZW50cy9kYXRhdGFibGUvbG9jYXRpb24tY2VsbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUNILHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUVMLGlCQUFpQixFQUNwQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQWU1RSxNQUFNLE9BQU8scUJBQXNCLFNBQVEsc0JBQXNCOzs7O0lBSTdELFlBQVksa0JBQXNDO1FBQzlDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzlCLENBQUM7Ozs7O0lBR0QsUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7O2tCQUNuRCxJQUFJLEdBQW1CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUMzQyxJQUFJLENBQUMsR0FBRyxFQUNSLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLFVBQVUsQ0FDbEI7WUFFRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBRTdDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztpQkFDNUI7O3NCQUVLLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUMvQztTQUNKO0lBQ0wsQ0FBQzs7O1lBekNKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsUUFBUSxFQUFFOzs7Ozs7S0FNVDtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLDhDQUE4QyxFQUFFO2FBQ2xFOzs7O1lBZFEsa0JBQWtCOzs7bUJBZ0J0QixLQUFLOzs7O0lBQU4scUNBQ1kiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENvbXBvbmVudCxcbiAgICBJbnB1dCxcbiAgICBPbkluaXQsXG4gICAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQYXRoSW5mb0VudGl0eSB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuaW1wb3J0IHsgRGF0YVRhYmxlQ2VsbENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXRhYmxlLWNlbGwuY29tcG9uZW50JztcbmltcG9ydCB7IEFsZnJlc2NvQXBpU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2FsZnJlc2NvLWFwaS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtbG9jYXRpb24tY2VsbCcsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPG5nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDxhIGhyZWY9XCJcIiBbdGl0bGVdPVwidG9vbHRpcFwiIFtyb3V0ZXJMaW5rXT1cImxpbmtcIj5cbiAgICAgICAgICAgICAgICB7eyB2YWx1ZSQgfCBhc3luYyB9fVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICBgLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgaG9zdDogeyBjbGFzczogJ2FkZi1sb2NhdGlvbi1jZWxsIGFkZi1kYXRhdGFibGUtY29udGVudC1jZWxsJyB9XG59KVxuZXhwb3J0IGNsYXNzIExvY2F0aW9uQ2VsbENvbXBvbmVudCBleHRlbmRzIERhdGFUYWJsZUNlbGxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBJbnB1dCgpXG4gICAgbGluazogYW55W107XG5cbiAgICBjb25zdHJ1Y3RvcihhbGZyZXNjb0FwaVNlcnZpY2U6IEFsZnJlc2NvQXBpU2VydmljZSkge1xuICAgICAgICBzdXBlcihhbGZyZXNjb0FwaVNlcnZpY2UpO1xuICAgIH1cblxuICAgIC8qKiBAb3ZlcnJpZGUgKi9cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29sdW1uICYmIHRoaXMuY29sdW1uLmtleSAmJiB0aGlzLnJvdyAmJiB0aGlzLmRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGg6IFBhdGhJbmZvRW50aXR5ID0gdGhpcy5kYXRhLmdldFZhbHVlKFxuICAgICAgICAgICAgICAgIHRoaXMucm93LFxuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uLFxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZXJGblxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKHBhdGggJiYgcGF0aC5uYW1lICYmIHBhdGguZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlJC5uZXh0KHBhdGgubmFtZS5zcGxpdCgnLycpLnBvcCgpKTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50b29sdGlwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9vbHRpcCA9IHBhdGgubmFtZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBwYXRoLmVsZW1lbnRzW3BhdGguZWxlbWVudHMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgdGhpcy5saW5rID0gW3RoaXMuY29sdW1uLmZvcm1hdCwgcGFyZW50LmlkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
