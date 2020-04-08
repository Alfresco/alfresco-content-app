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
import { MaterialModule } from '../material.module';
import { DataTableModule } from '../datatable/datatable.module';
import { AboutApplicationModulesComponent } from './about-application-modules/about-application-modules.component';
import { AboutProductVersionComponent } from './about-product-version/about-product-version.component';
import { AboutGithubLinkComponent } from './about-github-link/about-github-link.component';
export class AboutModule {}
AboutModule.decorators = [
  {
    type: NgModule,
    args: [
      {
        imports: [
          CommonModule,
          MaterialModule,
          TranslateModule,
          DataTableModule
        ],
        declarations: [
          AboutApplicationModulesComponent,
          AboutProductVersionComponent,
          AboutGithubLinkComponent
        ],
        exports: [
          AboutApplicationModulesComponent,
          AboutProductVersionComponent,
          AboutGithubLinkComponent
        ]
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJvdXQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiYWJvdXQvYWJvdXQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLGlFQUFpRSxDQUFDO0FBQ25ILE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBb0IzRixNQUFNLE9BQU8sV0FBVzs7O1lBbEJ2QixRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFO29CQUNMLFlBQVk7b0JBQ1osY0FBYztvQkFDZCxlQUFlO29CQUNmLGVBQWU7aUJBQ2xCO2dCQUNELFlBQVksRUFBRTtvQkFDVixnQ0FBZ0M7b0JBQ2hDLDRCQUE0QjtvQkFDNUIsd0JBQXdCO2lCQUMzQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsZ0NBQWdDO29CQUNoQyw0QkFBNEI7b0JBQzVCLHdCQUF3QjtpQkFDM0I7YUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XG5pbXBvcnQgeyBNYXRlcmlhbE1vZHVsZSB9IGZyb20gJy4uL21hdGVyaWFsLm1vZHVsZSc7XG5pbXBvcnQgeyBEYXRhVGFibGVNb2R1bGUgfSBmcm9tICcuLi9kYXRhdGFibGUvZGF0YXRhYmxlLm1vZHVsZSc7XG5pbXBvcnQgeyBBYm91dEFwcGxpY2F0aW9uTW9kdWxlc0NvbXBvbmVudCB9IGZyb20gJy4vYWJvdXQtYXBwbGljYXRpb24tbW9kdWxlcy9hYm91dC1hcHBsaWNhdGlvbi1tb2R1bGVzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBYm91dFByb2R1Y3RWZXJzaW9uQ29tcG9uZW50IH0gZnJvbSAnLi9hYm91dC1wcm9kdWN0LXZlcnNpb24vYWJvdXQtcHJvZHVjdC12ZXJzaW9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBYm91dEdpdGh1YkxpbmtDb21wb25lbnQgfSBmcm9tICcuL2Fib3V0LWdpdGh1Yi1saW5rL2Fib3V0LWdpdGh1Yi1saW5rLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIE1hdGVyaWFsTW9kdWxlLFxuICAgICAgICBUcmFuc2xhdGVNb2R1bGUsXG4gICAgICAgIERhdGFUYWJsZU1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIEFib3V0QXBwbGljYXRpb25Nb2R1bGVzQ29tcG9uZW50LFxuICAgICAgICBBYm91dFByb2R1Y3RWZXJzaW9uQ29tcG9uZW50LFxuICAgICAgICBBYm91dEdpdGh1YkxpbmtDb21wb25lbnRcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgQWJvdXRBcHBsaWNhdGlvbk1vZHVsZXNDb21wb25lbnQsXG4gICAgICAgIEFib3V0UHJvZHVjdFZlcnNpb25Db21wb25lbnQsXG4gICAgICAgIEFib3V0R2l0aHViTGlua0NvbXBvbmVudFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgQWJvdXRNb2R1bGUge31cbiJdfQ==
