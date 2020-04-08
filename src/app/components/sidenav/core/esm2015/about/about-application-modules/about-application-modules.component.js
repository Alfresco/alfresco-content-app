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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ObjectDataTableAdapter } from '../../datatable/data/object-datatable-adapter';
import { AppExtensionService } from '@alfresco/adf-extensions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export class AboutApplicationModulesComponent {
  /**
   * @param {?} appExtensions
   */
  constructor(appExtensions) {
    this.appExtensions = appExtensions;
    this.extensionColumns = [
      '$id',
      '$name',
      '$version',
      '$vendor',
      '$license',
      '$runtime',
      '$description'
    ];
    /**
     * Toggles showing/hiding of extensions block.
     */
    this.showExtensions = true;
    /**
     * Regular expression for filtering dependencies packages.
     */
    this.regexp = '^(@alfresco)';
    this.onDestroy$ = new Subject();
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    /** @type {?} */
    const alfrescoPackages = Object.keys(this.dependencies).filter(
      /**
       * @param {?} val
       * @return {?}
       */
      (val => {
        return new RegExp(this.regexp).test(val);
      })
    );
    /** @type {?} */
    const alfrescoPackagesTableRepresentation = [];
    alfrescoPackages.forEach(
      /**
       * @param {?} val
       * @return {?}
       */
      val => {
        alfrescoPackagesTableRepresentation.push({
          name: val,
          version: this.dependencies[val]
        });
      }
    );
    this.dependencyEntries = new ObjectDataTableAdapter(
      alfrescoPackagesTableRepresentation,
      [
        { type: 'text', key: 'name', title: 'Name', sortable: true },
        { type: 'text', key: 'version', title: 'Version', sortable: true }
      ]
    );
    this.appExtensions.references$.pipe(takeUntil(this.onDestroy$)).subscribe(
      /**
       * @param {?} extensions
       * @return {?}
       */
      extensions => (this.extensions = extensions)
    );
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
AboutApplicationModulesComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-about-application-modules',
        template:
          '<div class="adf-about-modules-container">\n    <h3 data-automation-id="adf-about-modules-title">{{ \'ABOUT.PACKAGES.TITLE\' | translate }}</h3>\n    <small>{{ \'ABOUT.PACKAGES.DESCRIPTION\' | translate }}</small>\n    <adf-datatable [data]="dependencyEntries"></adf-datatable>\n\n    <div class="adf-extension-details-container" *ngIf="showExtensions && extensions.length">\n        <h3>{{ \'ABOUT.EXTENSIONS.TITLE\' | translate }}</h3>\n        <mat-table [dataSource]="extensions">\n            <!-- $id Column -->\n            <ng-container matColumnDef="$id">\n                <mat-header-cell\n                    *matHeaderCellDef>{{ \'ABOUT.EXTENSIONS.TABLE_HEADERS.ID\' | translate }}</mat-header-cell>\n                <mat-cell *matCellDef="let element">{{element.$id}}</mat-cell>\n            </ng-container>\n\n            <!-- $name Column -->\n            <ng-container matColumnDef="$name">\n                <mat-header-cell\n                    *matHeaderCellDef>{{ \'ABOUT.EXTENSIONS.TABLE_HEADERS.NAME\' | translate }}</mat-header-cell>\n                <mat-cell *matCellDef="let element">{{element.$name}}</mat-cell>\n            </ng-container>\n\n            <!-- $version Column -->\n            <ng-container matColumnDef="$version">\n                <mat-header-cell\n                    *matHeaderCellDef>{{ \'ABOUT.EXTENSIONS.TABLE_HEADERS.VERSION\' | translate }}</mat-header-cell>\n                <mat-cell *matCellDef="let element">{{element.$version}}</mat-cell>\n            </ng-container>\n\n            <!-- $vendor Column -->\n            <ng-container matColumnDef="$vendor">\n                <mat-header-cell\n                    *matHeaderCellDef>{{ \'ABOUT.EXTENSIONS.TABLE_HEADERS.VENDOR\' | translate }}</mat-header-cell>\n                <mat-cell *matCellDef="let element">{{element.$vendor}}</mat-cell>\n            </ng-container>\n\n            <!-- $license Column -->\n            <ng-container matColumnDef="$license">\n                <mat-header-cell\n                    *matHeaderCellDef>{{ \'ABOUT.EXTENSIONS.TABLE_HEADERS.LICENSE\' | translate }}</mat-header-cell>\n                <mat-cell *matCellDef="let element">{{element.$license}}</mat-cell>\n            </ng-container>\n\n            <!-- $runtime Column -->\n            <ng-container matColumnDef="$runtime">\n                <mat-header-cell\n                    *matHeaderCellDef>{{ \'ABOUT.EXTENSIONS.TABLE_HEADERS.RUNTIME\' | translate }}</mat-header-cell>\n                <mat-cell *matCellDef="let element">{{element.$runtime}}</mat-cell>\n            </ng-container>\n\n            <!-- $description Column -->\n            <ng-container matColumnDef="$description">\n                <mat-header-cell\n                    *matHeaderCellDef>{{ \'ABOUT.EXTENSIONS.TABLE_HEADERS.DESCRIPTION\' | translate }}</mat-header-cell>\n                <mat-cell *matCellDef="let element">{{element.$description}}</mat-cell>\n            </ng-container>\n\n            <mat-header-row *matHeaderRowDef="extensionColumns"></mat-header-row>\n            <mat-row *matRowDef="let row; columns: extensionColumns;"></mat-row>\n        </mat-table>\n    </div>\n</div>\n',
        encapsulation: ViewEncapsulation.None
      }
    ]
  }
];
/** @nocollapse */
AboutApplicationModulesComponent.ctorParameters = () => [
  { type: AppExtensionService }
];
AboutApplicationModulesComponent.propDecorators = {
  showExtensions: [{ type: Input }],
  regexp: [{ type: Input }],
  dependencies: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  AboutApplicationModulesComponent.prototype.extensionColumns;
  /** @type {?} */
  AboutApplicationModulesComponent.prototype.dependencyEntries;
  /** @type {?} */
  AboutApplicationModulesComponent.prototype.extensions;
  /**
   * Toggles showing/hiding of extensions block.
   * @type {?}
   */
  AboutApplicationModulesComponent.prototype.showExtensions;
  /**
   * Regular expression for filtering dependencies packages.
   * @type {?}
   */
  AboutApplicationModulesComponent.prototype.regexp;
  /**
   * Current version of the app running
   * @type {?}
   */
  AboutApplicationModulesComponent.prototype.dependencies;
  /**
   * @type {?}
   * @private
   */
  AboutApplicationModulesComponent.prototype.onDestroy$;
  /**
   * @type {?}
   * @private
   */
  AboutApplicationModulesComponent.prototype.appExtensions;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJvdXQtYXBwbGljYXRpb24tbW9kdWxlcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJhYm91dC9hYm91dC1hcHBsaWNhdGlvbi1tb2R1bGVzL2Fib3V0LWFwcGxpY2F0aW9uLW1vZHVsZXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFxQixpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUN2RixPQUFPLEVBQUUsbUJBQW1CLEVBQWdCLE1BQU0sMEJBQTBCLENBQUM7QUFDN0UsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFPM0MsTUFBTSxPQUFPLGdDQUFnQzs7OztJQW1CekMsWUFBb0IsYUFBa0M7UUFBbEMsa0JBQWEsR0FBYixhQUFhLENBQXFCO1FBakJ0RCxxQkFBZ0IsR0FBYSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDOzs7O1FBTzdHLG1CQUFjLEdBQUcsSUFBSSxDQUFDOzs7O1FBR2IsV0FBTSxHQUFHLGNBQWMsQ0FBQztRQUt6QixlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztJQUc1QyxDQUFDOzs7O0lBRUQsUUFBUTs7Y0FDRSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNOzs7O1FBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNuRSxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxFQUFDOztjQUVJLG1DQUFtQyxHQUFHLEVBQUU7UUFDOUMsZ0JBQWdCLENBQUMsT0FBTzs7OztRQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDN0IsbUNBQW1DLENBQUMsSUFBSSxDQUFDO2dCQUNyQyxJQUFJLEVBQUUsR0FBRztnQkFDVCxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BDLENBQUMsQ0FBQztRQUNQLENBQUMsRUFBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksc0JBQXNCLENBQUMsbUNBQW1DLEVBQUU7WUFDckYsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzVELEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtTQUNyRSxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVc7YUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEMsU0FBUzs7OztRQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsRUFBQyxDQUFDO0lBQ2pFLENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMvQixDQUFDOzs7WUFyREosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSwrQkFBK0I7Z0JBQ3pDLDhvR0FBeUQ7Z0JBQ3pELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3hDOzs7O1lBUlEsbUJBQW1COzs7NkJBaUJ2QixLQUFLO3FCQUlMLEtBQUs7MkJBR0wsS0FBSzs7OztJQWJOLDREQUE2Rzs7SUFFN0csNkRBQTBDOztJQUMxQyxzREFBMkI7Ozs7O0lBRzNCLDBEQUNzQjs7Ozs7SUFHdEIsa0RBQWlDOzs7OztJQUdqQyx3REFBMkI7Ozs7O0lBRTNCLHNEQUE0Qzs7Ozs7SUFFaEMseURBQTBDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYmplY3REYXRhVGFibGVBZGFwdGVyIH0gZnJvbSAnLi4vLi4vZGF0YXRhYmxlL2RhdGEvb2JqZWN0LWRhdGF0YWJsZS1hZGFwdGVyJztcbmltcG9ydCB7IEFwcEV4dGVuc2lvblNlcnZpY2UsIEV4dGVuc2lvblJlZiB9IGZyb20gJ0BhbGZyZXNjby9hZGYtZXh0ZW5zaW9ucyc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLWFib3V0LWFwcGxpY2F0aW9uLW1vZHVsZXMnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9hYm91dC1hcHBsaWNhdGlvbi1tb2R1bGVzLmNvbXBvbmVudC5odG1sJyxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIEFib3V0QXBwbGljYXRpb25Nb2R1bGVzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgZXh0ZW5zaW9uQ29sdW1uczogc3RyaW5nW10gPSBbJyRpZCcsICckbmFtZScsICckdmVyc2lvbicsICckdmVuZG9yJywgJyRsaWNlbnNlJywgJyRydW50aW1lJywgJyRkZXNjcmlwdGlvbiddO1xuXG4gICAgZGVwZW5kZW5jeUVudHJpZXM6IE9iamVjdERhdGFUYWJsZUFkYXB0ZXI7XG4gICAgZXh0ZW5zaW9uczogRXh0ZW5zaW9uUmVmW107XG5cbiAgICAvKiogVG9nZ2xlcyBzaG93aW5nL2hpZGluZyBvZiBleHRlbnNpb25zIGJsb2NrLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgc2hvd0V4dGVuc2lvbnMgPSB0cnVlO1xuXG4gICAgLyoqIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgZmlsdGVyaW5nIGRlcGVuZGVuY2llcyBwYWNrYWdlcy4gKi9cbiAgICBASW5wdXQoKSByZWdleHAgPSAnXihAYWxmcmVzY28pJztcblxuICAgIC8qKiBDdXJyZW50IHZlcnNpb24gb2YgdGhlIGFwcCBydW5uaW5nICovXG4gICAgQElucHV0KCkgZGVwZW5kZW5jaWVzOiBhbnk7XG5cbiAgICBwcml2YXRlIG9uRGVzdHJveSQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHBFeHRlbnNpb25zOiBBcHBFeHRlbnNpb25TZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGNvbnN0IGFsZnJlc2NvUGFja2FnZXMgPSBPYmplY3Qua2V5cyh0aGlzLmRlcGVuZGVuY2llcykuZmlsdGVyKCh2YWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHRoaXMucmVnZXhwKS50ZXN0KHZhbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGFsZnJlc2NvUGFja2FnZXNUYWJsZVJlcHJlc2VudGF0aW9uID0gW107XG4gICAgICAgIGFsZnJlc2NvUGFja2FnZXMuZm9yRWFjaCgodmFsKSA9PiB7XG4gICAgICAgICAgICBhbGZyZXNjb1BhY2thZ2VzVGFibGVSZXByZXNlbnRhdGlvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiB2YWwsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogKHRoaXMuZGVwZW5kZW5jaWVzW3ZhbF0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kZXBlbmRlbmN5RW50cmllcyA9IG5ldyBPYmplY3REYXRhVGFibGVBZGFwdGVyKGFsZnJlc2NvUGFja2FnZXNUYWJsZVJlcHJlc2VudGF0aW9uLCBbXG4gICAgICAgICAgICB7IHR5cGU6ICd0ZXh0Jywga2V5OiAnbmFtZScsIHRpdGxlOiAnTmFtZScsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICAgICAgICB7IHR5cGU6ICd0ZXh0Jywga2V5OiAndmVyc2lvbicsIHRpdGxlOiAnVmVyc2lvbicsIHNvcnRhYmxlOiB0cnVlIH1cbiAgICAgICAgXSk7XG5cbiAgICAgICAgdGhpcy5hcHBFeHRlbnNpb25zLnJlZmVyZW5jZXMkXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5vbkRlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKGV4dGVuc2lvbnMpID0+IHRoaXMuZXh0ZW5zaW9ucyA9IGV4dGVuc2lvbnMpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLm9uRGVzdHJveSQubmV4dCh0cnVlKTtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxufVxuIl19
