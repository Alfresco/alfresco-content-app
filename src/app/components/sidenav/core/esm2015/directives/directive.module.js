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
import { MaterialModule } from '../material.module';
import { HighlightDirective } from './highlight.directive';
import { LogoutDirective } from './logout.directive';
import { NodeDeleteDirective } from './node-delete.directive';
import { NodeFavoriteDirective } from './node-favorite.directive';
import { CheckAllowableOperationDirective } from './check-allowable-operation.directive';
import { NodeRestoreDirective } from './node-restore.directive';
import { UploadDirective } from './upload.directive';
import { NodeDownloadDirective } from './node-download.directive';
export class DirectiveModule {}
DirectiveModule.decorators = [
  {
    type: NgModule,
    args: [
      {
        imports: [CommonModule, MaterialModule],
        declarations: [
          HighlightDirective,
          LogoutDirective,
          NodeDeleteDirective,
          NodeFavoriteDirective,
          CheckAllowableOperationDirective,
          NodeRestoreDirective,
          NodeDownloadDirective,
          UploadDirective
        ],
        exports: [
          HighlightDirective,
          LogoutDirective,
          NodeDeleteDirective,
          NodeFavoriteDirective,
          CheckAllowableOperationDirective,
          NodeRestoreDirective,
          NodeDownloadDirective,
          UploadDirective
        ]
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGlyZWN0aXZlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQTRCbEUsTUFBTSxPQUFPLGVBQWU7OztZQTFCM0IsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRTtvQkFDTCxZQUFZO29CQUNaLGNBQWM7aUJBQ2pCO2dCQUNELFlBQVksRUFBRTtvQkFDVixrQkFBa0I7b0JBQ2xCLGVBQWU7b0JBQ2YsbUJBQW1CO29CQUNuQixxQkFBcUI7b0JBQ3JCLGdDQUFnQztvQkFDaEMsb0JBQW9CO29CQUNwQixxQkFBcUI7b0JBQ3JCLGVBQWU7aUJBQ2xCO2dCQUNELE9BQU8sRUFBRTtvQkFDTCxrQkFBa0I7b0JBQ2xCLGVBQWU7b0JBQ2YsbUJBQW1CO29CQUNuQixxQkFBcUI7b0JBQ3JCLGdDQUFnQztvQkFDaEMsb0JBQW9CO29CQUNwQixxQkFBcUI7b0JBQ3JCLGVBQWU7aUJBQ2xCO2FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdGVyaWFsTW9kdWxlIH0gZnJvbSAnLi4vbWF0ZXJpYWwubW9kdWxlJztcblxuaW1wb3J0IHsgSGlnaGxpZ2h0RGlyZWN0aXZlIH0gZnJvbSAnLi9oaWdobGlnaHQuZGlyZWN0aXZlJztcbmltcG9ydCB7IExvZ291dERpcmVjdGl2ZSB9IGZyb20gJy4vbG9nb3V0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBOb2RlRGVsZXRlRGlyZWN0aXZlIH0gZnJvbSAnLi9ub2RlLWRlbGV0ZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTm9kZUZhdm9yaXRlRGlyZWN0aXZlIH0gZnJvbSAnLi9ub2RlLWZhdm9yaXRlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDaGVja0FsbG93YWJsZU9wZXJhdGlvbkRpcmVjdGl2ZSB9IGZyb20gJy4vY2hlY2stYWxsb3dhYmxlLW9wZXJhdGlvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTm9kZVJlc3RvcmVEaXJlY3RpdmUgfSBmcm9tICcuL25vZGUtcmVzdG9yZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgVXBsb2FkRGlyZWN0aXZlIH0gZnJvbSAnLi91cGxvYWQuZGlyZWN0aXZlJztcbmltcG9ydCB7IE5vZGVEb3dubG9hZERpcmVjdGl2ZSB9IGZyb20gJy4vbm9kZS1kb3dubG9hZC5kaXJlY3RpdmUnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBNYXRlcmlhbE1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIEhpZ2hsaWdodERpcmVjdGl2ZSxcbiAgICAgICAgTG9nb3V0RGlyZWN0aXZlLFxuICAgICAgICBOb2RlRGVsZXRlRGlyZWN0aXZlLFxuICAgICAgICBOb2RlRmF2b3JpdGVEaXJlY3RpdmUsXG4gICAgICAgIENoZWNrQWxsb3dhYmxlT3BlcmF0aW9uRGlyZWN0aXZlLFxuICAgICAgICBOb2RlUmVzdG9yZURpcmVjdGl2ZSxcbiAgICAgICAgTm9kZURvd25sb2FkRGlyZWN0aXZlLFxuICAgICAgICBVcGxvYWREaXJlY3RpdmVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgSGlnaGxpZ2h0RGlyZWN0aXZlLFxuICAgICAgICBMb2dvdXREaXJlY3RpdmUsXG4gICAgICAgIE5vZGVEZWxldGVEaXJlY3RpdmUsXG4gICAgICAgIE5vZGVGYXZvcml0ZURpcmVjdGl2ZSxcbiAgICAgICAgQ2hlY2tBbGxvd2FibGVPcGVyYXRpb25EaXJlY3RpdmUsXG4gICAgICAgIE5vZGVSZXN0b3JlRGlyZWN0aXZlLFxuICAgICAgICBOb2RlRG93bmxvYWREaXJlY3RpdmUsXG4gICAgICAgIFVwbG9hZERpcmVjdGl2ZVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgRGlyZWN0aXZlTW9kdWxlIHt9XG4iXX0=
