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
import { ContentApiService } from './services/content-api.service';
import { NodePermissionService } from './services/node-permission.service';
import { AppService } from './services/app.service';
import { ContextActionsModule } from './directives/contextmenu/contextmenu.module';
var SharedModule = /** @class */ (function() {
  function SharedModule() {}
  /**
   * @return {?}
   */
  SharedModule.forRoot
  /**
   * @return {?}
   */ = function() {
    return {
      ngModule: SharedModule,
      providers: [ContentApiService, NodePermissionService, AppService]
    };
  };
  SharedModule.decorators = [
    {
      type: NgModule,
      args: [
        {
          imports: [ContextActionsModule],
          exports: [ContextActionsModule]
        }
      ]
    }
  ];
  return SharedModule;
})();
export { SharedModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkLyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNuRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDcEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDbkY7SUFBQTtJQVdBLENBQUM7Ozs7SUFOUSxvQkFBTzs7O0lBQWQ7UUFDRSxPQUFPO1lBQ0wsUUFBUSxFQUFFLFlBQVk7WUFDdEIsU0FBUyxFQUFFLENBQUMsaUJBQWlCLEVBQUUscUJBQXFCLEVBQUUsVUFBVSxDQUFDO1NBQ2xFLENBQUM7SUFDSixDQUFDOztnQkFWRixRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7b0JBQy9CLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixDQUFDO2lCQUNoQzs7SUFRRCxtQkFBQztDQUFBLEFBWEQsSUFXQztTQVBZLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250ZW50QXBpU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvY29udGVudC1hcGkuc2VydmljZSc7XG5pbXBvcnQgeyBOb2RlUGVybWlzc2lvblNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL25vZGUtcGVybWlzc2lvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEFwcFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2FwcC5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRleHRBY3Rpb25zTW9kdWxlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2NvbnRleHRtZW51L2NvbnRleHRtZW51Lm1vZHVsZSc7XG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29udGV4dEFjdGlvbnNNb2R1bGVdLFxuICBleHBvcnRzOiBbQ29udGV4dEFjdGlvbnNNb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIFNoYXJlZE1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogU2hhcmVkTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbQ29udGVudEFwaVNlcnZpY2UsIE5vZGVQZXJtaXNzaW9uU2VydmljZSwgQXBwU2VydmljZV1cbiAgICB9O1xuICB9XG59XG4iXX0=
