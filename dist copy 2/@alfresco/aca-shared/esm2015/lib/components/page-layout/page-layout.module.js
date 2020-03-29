/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
import { NgModule } from '@angular/core';
import { PageLayoutContentComponent } from './page-layout-content.component';
import { PageLayoutErrorComponent } from './page-layout-error.component';
import { PageLayoutHeaderComponent } from './page-layout-header.component';
import { PageLayoutComponent } from './page-layout.component';
import { CommonModule } from '@angular/common';
export class PageLayoutModule {}
PageLayoutModule.decorators = [
  {
    type: NgModule,
    args: [
      {
        imports: [CommonModule],
        declarations: [
          PageLayoutContentComponent,
          PageLayoutErrorComponent,
          PageLayoutHeaderComponent,
          PageLayoutComponent
        ],
        exports: [
          PageLayoutContentComponent,
          PageLayoutErrorComponent,
          PageLayoutHeaderComponent,
          PageLayoutComponent
        ]
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1sYXlvdXQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FjYS1zaGFyZWQvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9wYWdlLWxheW91dC9wYWdlLWxheW91dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQWlCL0MsTUFBTSxPQUFPLGdCQUFnQjs7O1lBZjVCLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLFlBQVksRUFBRTtvQkFDWiwwQkFBMEI7b0JBQzFCLHdCQUF3QjtvQkFDeEIseUJBQXlCO29CQUN6QixtQkFBbUI7aUJBQ3BCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCwwQkFBMEI7b0JBQzFCLHdCQUF3QjtvQkFDeEIseUJBQXlCO29CQUN6QixtQkFBbUI7aUJBQ3BCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQYWdlTGF5b3V0Q29udGVudENvbXBvbmVudCB9IGZyb20gJy4vcGFnZS1sYXlvdXQtY29udGVudC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGFnZUxheW91dEVycm9yQ29tcG9uZW50IH0gZnJvbSAnLi9wYWdlLWxheW91dC1lcnJvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGFnZUxheW91dEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vcGFnZS1sYXlvdXQtaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYWdlTGF5b3V0Q29tcG9uZW50IH0gZnJvbSAnLi9wYWdlLWxheW91dC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIFBhZ2VMYXlvdXRDb250ZW50Q29tcG9uZW50LFxuICAgIFBhZ2VMYXlvdXRFcnJvckNvbXBvbmVudCxcbiAgICBQYWdlTGF5b3V0SGVhZGVyQ29tcG9uZW50LFxuICAgIFBhZ2VMYXlvdXRDb21wb25lbnRcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIFBhZ2VMYXlvdXRDb250ZW50Q29tcG9uZW50LFxuICAgIFBhZ2VMYXlvdXRFcnJvckNvbXBvbmVudCxcbiAgICBQYWdlTGF5b3V0SGVhZGVyQ29tcG9uZW50LFxuICAgIFBhZ2VMYXlvdXRDb21wb25lbnRcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBQYWdlTGF5b3V0TW9kdWxlIHt9XG4iXX0=
