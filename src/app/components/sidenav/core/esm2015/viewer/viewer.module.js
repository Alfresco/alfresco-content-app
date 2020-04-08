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
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { MaterialModule } from '../material.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { PipeModule } from '../pipes/pipe.module';
import { ImgViewerComponent } from './components/img-viewer.component';
import { MediaPlayerComponent } from './components/media-player.component';
import { PdfViewerComponent } from './components/pdf-viewer.component';
import { PdfPasswordDialogComponent } from './components/pdf-viewer-password-dialog';
import { PdfThumbComponent } from './components/pdf-viewer-thumb.component';
import { PdfThumbListComponent } from './components/pdf-viewer-thumbnails.component';
import { TxtViewerComponent } from './components/txt-viewer.component';
import { UnknownFormatComponent } from './components/unknown-format/unknown-format.component';
import { ViewerMoreActionsComponent } from './components/viewer-more-actions.component';
import { ViewerOpenWithComponent } from './components/viewer-open-with.component';
import { ViewerSidebarComponent } from './components/viewer-sidebar.component';
import { ViewerToolbarComponent } from './components/viewer-toolbar.component';
import { ViewerComponent } from './components/viewer.component';
import { ViewerExtensionDirective } from './directives/viewer-extension.directive';
import { ViewerToolbarActionsComponent } from './components/viewer-toolbar-actions.component';
import { DirectiveModule } from '../directives/directive.module';
import { A11yModule } from '@angular/cdk/a11y';
export class ViewerModule {}
ViewerModule.decorators = [
  {
    type: NgModule,
    args: [
      {
        imports: [
          ExtensionsModule,
          CommonModule,
          MaterialModule,
          TranslateModule.forChild(),
          FormsModule,
          ReactiveFormsModule,
          ToolbarModule,
          PipeModule,
          FlexLayoutModule,
          DirectiveModule,
          A11yModule
        ],
        declarations: [
          PdfPasswordDialogComponent,
          ViewerComponent,
          ImgViewerComponent,
          TxtViewerComponent,
          MediaPlayerComponent,
          PdfViewerComponent,
          PdfThumbComponent,
          PdfThumbListComponent,
          ViewerExtensionDirective,
          UnknownFormatComponent,
          ViewerToolbarComponent,
          ViewerSidebarComponent,
          ViewerOpenWithComponent,
          ViewerMoreActionsComponent,
          ViewerToolbarActionsComponent
        ],
        entryComponents: [PdfPasswordDialogComponent],
        exports: [
          ViewerComponent,
          ImgViewerComponent,
          TxtViewerComponent,
          MediaPlayerComponent,
          PdfViewerComponent,
          PdfPasswordDialogComponent,
          PdfThumbComponent,
          PdfThumbListComponent,
          ViewerExtensionDirective,
          UnknownFormatComponent,
          ViewerToolbarComponent,
          ViewerSidebarComponent,
          ViewerOpenWithComponent,
          ViewerMoreActionsComponent,
          ViewerToolbarActionsComponent
        ]
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInZpZXdlci92aWV3ZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFNUQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDckYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDNUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDckYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDOUYsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDeEYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDbEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDL0UsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDL0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ25GLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQzlGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFzRC9DLE1BQU0sT0FBTyxZQUFZOzs7WUFwRHhCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUU7b0JBQ0wsZ0JBQWdCO29CQUNoQixZQUFZO29CQUNaLGNBQWM7b0JBQ2QsZUFBZSxDQUFDLFFBQVEsRUFBRTtvQkFDMUIsV0FBVztvQkFDWCxtQkFBbUI7b0JBQ25CLGFBQWE7b0JBQ2IsVUFBVTtvQkFDVixnQkFBZ0I7b0JBQ2hCLGVBQWU7b0JBQ2YsVUFBVTtpQkFDYjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1YsMEJBQTBCO29CQUMxQixlQUFlO29CQUNmLGtCQUFrQjtvQkFDbEIsa0JBQWtCO29CQUNsQixvQkFBb0I7b0JBQ3BCLGtCQUFrQjtvQkFDbEIsaUJBQWlCO29CQUNqQixxQkFBcUI7b0JBQ3JCLHdCQUF3QjtvQkFDeEIsc0JBQXNCO29CQUN0QixzQkFBc0I7b0JBQ3RCLHNCQUFzQjtvQkFDdEIsdUJBQXVCO29CQUN2QiwwQkFBMEI7b0JBQzFCLDZCQUE2QjtpQkFDaEM7Z0JBQ0QsZUFBZSxFQUFFO29CQUNiLDBCQUEwQjtpQkFDN0I7Z0JBQ0QsT0FBTyxFQUFFO29CQUNMLGVBQWU7b0JBQ2Ysa0JBQWtCO29CQUNsQixrQkFBa0I7b0JBQ2xCLG9CQUFvQjtvQkFDcEIsa0JBQWtCO29CQUNsQiwwQkFBMEI7b0JBQzFCLGlCQUFpQjtvQkFDakIscUJBQXFCO29CQUNyQix3QkFBd0I7b0JBQ3hCLHNCQUFzQjtvQkFDdEIsc0JBQXNCO29CQUN0QixzQkFBc0I7b0JBQ3RCLHVCQUF1QjtvQkFDdkIsMEJBQTBCO29CQUMxQiw2QkFBNkI7aUJBQ2hDO2FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRyYW5zbGF0ZU1vZHVsZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHsgRmxleExheW91dE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0JztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBFeHRlbnNpb25zTW9kdWxlIH0gZnJvbSAnQGFsZnJlc2NvL2FkZi1leHRlbnNpb25zJztcblxuaW1wb3J0IHsgTWF0ZXJpYWxNb2R1bGUgfSBmcm9tICcuLi9tYXRlcmlhbC5tb2R1bGUnO1xuaW1wb3J0IHsgVG9vbGJhck1vZHVsZSB9IGZyb20gJy4uL3Rvb2xiYXIvdG9vbGJhci5tb2R1bGUnO1xuaW1wb3J0IHsgUGlwZU1vZHVsZSB9IGZyb20gJy4uL3BpcGVzL3BpcGUubW9kdWxlJztcbmltcG9ydCB7IEltZ1ZpZXdlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9pbWctdmlld2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNZWRpYVBsYXllckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9tZWRpYS1wbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IFBkZlZpZXdlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wZGYtdmlld2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZQYXNzd29yZERpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wZGYtdmlld2VyLXBhc3N3b3JkLWRpYWxvZyc7XG5pbXBvcnQgeyBQZGZUaHVtYkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wZGYtdmlld2VyLXRodW1iLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQZGZUaHVtYkxpc3RDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcGRmLXZpZXdlci10aHVtYm5haWxzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUeHRWaWV3ZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdHh0LXZpZXdlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgVW5rbm93bkZvcm1hdENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy91bmtub3duLWZvcm1hdC91bmtub3duLWZvcm1hdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgVmlld2VyTW9yZUFjdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdmlld2VyLW1vcmUtYWN0aW9ucy5jb21wb25lbnQnO1xuaW1wb3J0IHsgVmlld2VyT3BlbldpdGhDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdmlld2VyLW9wZW4td2l0aC5jb21wb25lbnQnO1xuaW1wb3J0IHsgVmlld2VyU2lkZWJhckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy92aWV3ZXItc2lkZWJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgVmlld2VyVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy92aWV3ZXItdG9vbGJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgVmlld2VyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ZpZXdlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgVmlld2VyRXh0ZW5zaW9uRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZpZXdlci1leHRlbnNpb24uZGlyZWN0aXZlJztcbmltcG9ydCB7IFZpZXdlclRvb2xiYXJBY3Rpb25zQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ZpZXdlci10b29sYmFyLWFjdGlvbnMuY29tcG9uZW50JztcbmltcG9ydCB7IERpcmVjdGl2ZU1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvZGlyZWN0aXZlLm1vZHVsZSc7XG5pbXBvcnQgeyBBMTF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgRXh0ZW5zaW9uc01vZHVsZSxcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBNYXRlcmlhbE1vZHVsZSxcbiAgICAgICAgVHJhbnNsYXRlTW9kdWxlLmZvckNoaWxkKCksXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgICAgICBUb29sYmFyTW9kdWxlLFxuICAgICAgICBQaXBlTW9kdWxlLFxuICAgICAgICBGbGV4TGF5b3V0TW9kdWxlLFxuICAgICAgICBEaXJlY3RpdmVNb2R1bGUsXG4gICAgICAgIEExMXlNb2R1bGVcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBQZGZQYXNzd29yZERpYWxvZ0NvbXBvbmVudCxcbiAgICAgICAgVmlld2VyQ29tcG9uZW50LFxuICAgICAgICBJbWdWaWV3ZXJDb21wb25lbnQsXG4gICAgICAgIFR4dFZpZXdlckNvbXBvbmVudCxcbiAgICAgICAgTWVkaWFQbGF5ZXJDb21wb25lbnQsXG4gICAgICAgIFBkZlZpZXdlckNvbXBvbmVudCxcbiAgICAgICAgUGRmVGh1bWJDb21wb25lbnQsXG4gICAgICAgIFBkZlRodW1iTGlzdENvbXBvbmVudCxcbiAgICAgICAgVmlld2VyRXh0ZW5zaW9uRGlyZWN0aXZlLFxuICAgICAgICBVbmtub3duRm9ybWF0Q29tcG9uZW50LFxuICAgICAgICBWaWV3ZXJUb29sYmFyQ29tcG9uZW50LFxuICAgICAgICBWaWV3ZXJTaWRlYmFyQ29tcG9uZW50LFxuICAgICAgICBWaWV3ZXJPcGVuV2l0aENvbXBvbmVudCxcbiAgICAgICAgVmlld2VyTW9yZUFjdGlvbnNDb21wb25lbnQsXG4gICAgICAgIFZpZXdlclRvb2xiYXJBY3Rpb25zQ29tcG9uZW50XG4gICAgXSxcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtcbiAgICAgICAgUGRmUGFzc3dvcmREaWFsb2dDb21wb25lbnRcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgVmlld2VyQ29tcG9uZW50LFxuICAgICAgICBJbWdWaWV3ZXJDb21wb25lbnQsXG4gICAgICAgIFR4dFZpZXdlckNvbXBvbmVudCxcbiAgICAgICAgTWVkaWFQbGF5ZXJDb21wb25lbnQsXG4gICAgICAgIFBkZlZpZXdlckNvbXBvbmVudCxcbiAgICAgICAgUGRmUGFzc3dvcmREaWFsb2dDb21wb25lbnQsXG4gICAgICAgIFBkZlRodW1iQ29tcG9uZW50LFxuICAgICAgICBQZGZUaHVtYkxpc3RDb21wb25lbnQsXG4gICAgICAgIFZpZXdlckV4dGVuc2lvbkRpcmVjdGl2ZSxcbiAgICAgICAgVW5rbm93bkZvcm1hdENvbXBvbmVudCxcbiAgICAgICAgVmlld2VyVG9vbGJhckNvbXBvbmVudCxcbiAgICAgICAgVmlld2VyU2lkZWJhckNvbXBvbmVudCxcbiAgICAgICAgVmlld2VyT3BlbldpdGhDb21wb25lbnQsXG4gICAgICAgIFZpZXdlck1vcmVBY3Rpb25zQ29tcG9uZW50LFxuICAgICAgICBWaWV3ZXJUb29sYmFyQWN0aW9uc0NvbXBvbmVudFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgVmlld2VyTW9kdWxlIHtcbn1cbiJdfQ==
