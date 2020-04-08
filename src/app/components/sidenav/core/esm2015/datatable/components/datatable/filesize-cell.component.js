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
import { Component, ViewEncapsulation } from '@angular/core';
import { DataTableCellComponent } from './datatable-cell.component';
import { AlfrescoApiService } from '../../../services/alfresco-api.service';
export class FileSizeCellComponent extends DataTableCellComponent {
  /**
   * @param {?} alfrescoApiService
   */
  constructor(alfrescoApiService) {
    super(alfrescoApiService);
  }
}
FileSizeCellComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-filesize-cell',
        template: `
        <ng-container *ngIf="(value$ | async | adfFileSize) as fileSize">
            <span
                [title]="tooltip"
                [attr.aria-label]="fileSize"
                >{{ fileSize }}</span
            >
        </ng-container>
    `,
        encapsulation: ViewEncapsulation.None,
        host: { class: 'adf-filesize-cell' }
      }
    ]
  }
];
/** @nocollapse */
FileSizeCellComponent.ctorParameters = () => [{ type: AlfrescoApiService }];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNpemUtY2VsbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkYXRhdGFibGUvY29tcG9uZW50cy9kYXRhdGFibGUvZmlsZXNpemUtY2VsbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQWdCNUUsTUFBTSxPQUFPLHFCQUFzQixTQUFRLHNCQUFzQjs7OztJQUM3RCxZQUFZLGtCQUFzQztRQUM5QyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUM5QixDQUFDOzs7WUFqQkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLFFBQVEsRUFBRTs7Ozs7Ozs7S0FRVDtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLG1CQUFtQixFQUFFO2FBQ3ZDOzs7O1lBZlEsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0YVRhYmxlQ2VsbENvbXBvbmVudCB9IGZyb20gJy4vZGF0YXRhYmxlLWNlbGwuY29tcG9uZW50JztcbmltcG9ydCB7IEFsZnJlc2NvQXBpU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2FsZnJlc2NvLWFwaS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtZmlsZXNpemUtY2VsbCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIih2YWx1ZSQgfCBhc3luYyB8IGFkZkZpbGVTaXplKSBhcyBmaWxlU2l6ZVwiPlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICBbdGl0bGVdPVwidG9vbHRpcFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJmaWxlU2l6ZVwiXG4gICAgICAgICAgICAgICAgPnt7IGZpbGVTaXplIH19PC9zcGFuXG4gICAgICAgICAgICA+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIGAsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7IGNsYXNzOiAnYWRmLWZpbGVzaXplLWNlbGwnIH1cbn0pXG5leHBvcnQgY2xhc3MgRmlsZVNpemVDZWxsQ29tcG9uZW50IGV4dGVuZHMgRGF0YVRhYmxlQ2VsbENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoYWxmcmVzY29BcGlTZXJ2aWNlOiBBbGZyZXNjb0FwaVNlcnZpY2UpIHtcbiAgICAgICAgc3VwZXIoYWxmcmVzY29BcGlTZXJ2aWNlKTtcbiAgICB9XG59XG4iXX0=
