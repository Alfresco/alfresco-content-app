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
import { FileSizePipe } from './file-size.pipe';
import { MimeTypeIconPipe } from './mime-type-icon.pipe';
import { NodeNameTooltipPipe } from './node-name-tooltip.pipe';
import { HighlightPipe } from './text-highlight.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { InitialUsernamePipe } from './user-initial.pipe';
import { FullNamePipe } from './full-name.pipe';
import { FormatSpacePipe } from './format-space.pipe';
import { FileTypePipe } from './file-type.pipe';
import { MultiValuePipe } from './multi-value.pipe';
import { LocalizedDatePipe } from './localized-date.pipe';
import { DecimalNumberPipe } from './decimal-number.pipe';
export class PipeModule {}
PipeModule.decorators = [
  {
    type: NgModule,
    args: [
      {
        imports: [CommonModule],
        declarations: [
          FileSizePipe,
          HighlightPipe,
          TimeAgoPipe,
          MimeTypeIconPipe,
          InitialUsernamePipe,
          FullNamePipe,
          NodeNameTooltipPipe,
          FormatSpacePipe,
          FileTypePipe,
          MultiValuePipe,
          LocalizedDatePipe,
          DecimalNumberPipe
        ],
        providers: [
          FileSizePipe,
          HighlightPipe,
          TimeAgoPipe,
          MimeTypeIconPipe,
          InitialUsernamePipe,
          NodeNameTooltipPipe,
          FormatSpacePipe,
          FileTypePipe,
          MultiValuePipe,
          LocalizedDatePipe,
          DecimalNumberPipe
        ],
        exports: [
          FileSizePipe,
          HighlightPipe,
          TimeAgoPipe,
          MimeTypeIconPipe,
          InitialUsernamePipe,
          FullNamePipe,
          NodeNameTooltipPipe,
          FormatSpacePipe,
          FileTypePipe,
          MultiValuePipe,
          LocalizedDatePipe,
          DecimalNumberPipe
        ]
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJwaXBlcy9waXBlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDekQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFnRDFELE1BQU0sT0FBTyxVQUFVOzs7WUE5Q3RCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUU7b0JBQ0wsWUFBWTtpQkFDZjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1YsWUFBWTtvQkFDWixhQUFhO29CQUNiLFdBQVc7b0JBQ1gsZ0JBQWdCO29CQUNoQixtQkFBbUI7b0JBQ25CLFlBQVk7b0JBQ1osbUJBQW1CO29CQUNuQixlQUFlO29CQUNmLFlBQVk7b0JBQ1osY0FBYztvQkFDZCxpQkFBaUI7b0JBQ2pCLGlCQUFpQjtpQkFDcEI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osYUFBYTtvQkFDYixXQUFXO29CQUNYLGdCQUFnQjtvQkFDaEIsbUJBQW1CO29CQUNuQixtQkFBbUI7b0JBQ25CLGVBQWU7b0JBQ2YsWUFBWTtvQkFDWixjQUFjO29CQUNkLGlCQUFpQjtvQkFDakIsaUJBQWlCO2lCQUNwQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsWUFBWTtvQkFDWixhQUFhO29CQUNiLFdBQVc7b0JBQ1gsZ0JBQWdCO29CQUNoQixtQkFBbUI7b0JBQ25CLFlBQVk7b0JBQ1osbUJBQW1CO29CQUNuQixlQUFlO29CQUNmLFlBQVk7b0JBQ1osY0FBYztvQkFDZCxpQkFBaUI7b0JBQ2pCLGlCQUFpQjtpQkFDcEI7YUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBGaWxlU2l6ZVBpcGUgfSBmcm9tICcuL2ZpbGUtc2l6ZS5waXBlJztcbmltcG9ydCB7IE1pbWVUeXBlSWNvblBpcGUgfSBmcm9tICcuL21pbWUtdHlwZS1pY29uLnBpcGUnO1xuaW1wb3J0IHsgTm9kZU5hbWVUb29sdGlwUGlwZSB9IGZyb20gJy4vbm9kZS1uYW1lLXRvb2x0aXAucGlwZSc7XG5pbXBvcnQgeyBIaWdobGlnaHRQaXBlIH0gZnJvbSAnLi90ZXh0LWhpZ2hsaWdodC5waXBlJztcbmltcG9ydCB7IFRpbWVBZ29QaXBlIH0gZnJvbSAnLi90aW1lLWFnby5waXBlJztcbmltcG9ydCB7IEluaXRpYWxVc2VybmFtZVBpcGUgfSBmcm9tICcuL3VzZXItaW5pdGlhbC5waXBlJztcbmltcG9ydCB7IEZ1bGxOYW1lUGlwZSB9IGZyb20gJy4vZnVsbC1uYW1lLnBpcGUnO1xuaW1wb3J0IHsgRm9ybWF0U3BhY2VQaXBlIH0gZnJvbSAnLi9mb3JtYXQtc3BhY2UucGlwZSc7XG5pbXBvcnQgeyBGaWxlVHlwZVBpcGUgfSBmcm9tICcuL2ZpbGUtdHlwZS5waXBlJztcbmltcG9ydCB7IE11bHRpVmFsdWVQaXBlIH0gZnJvbSAnLi9tdWx0aS12YWx1ZS5waXBlJztcbmltcG9ydCB7IExvY2FsaXplZERhdGVQaXBlIH0gZnJvbSAnLi9sb2NhbGl6ZWQtZGF0ZS5waXBlJztcbmltcG9ydCB7IERlY2ltYWxOdW1iZXJQaXBlIH0gZnJvbSAnLi9kZWNpbWFsLW51bWJlci5waXBlJztcblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIEZpbGVTaXplUGlwZSxcbiAgICAgICAgSGlnaGxpZ2h0UGlwZSxcbiAgICAgICAgVGltZUFnb1BpcGUsXG4gICAgICAgIE1pbWVUeXBlSWNvblBpcGUsXG4gICAgICAgIEluaXRpYWxVc2VybmFtZVBpcGUsXG4gICAgICAgIEZ1bGxOYW1lUGlwZSxcbiAgICAgICAgTm9kZU5hbWVUb29sdGlwUGlwZSxcbiAgICAgICAgRm9ybWF0U3BhY2VQaXBlLFxuICAgICAgICBGaWxlVHlwZVBpcGUsXG4gICAgICAgIE11bHRpVmFsdWVQaXBlLFxuICAgICAgICBMb2NhbGl6ZWREYXRlUGlwZSxcbiAgICAgICAgRGVjaW1hbE51bWJlclBpcGVcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBGaWxlU2l6ZVBpcGUsXG4gICAgICAgIEhpZ2hsaWdodFBpcGUsXG4gICAgICAgIFRpbWVBZ29QaXBlLFxuICAgICAgICBNaW1lVHlwZUljb25QaXBlLFxuICAgICAgICBJbml0aWFsVXNlcm5hbWVQaXBlLFxuICAgICAgICBOb2RlTmFtZVRvb2x0aXBQaXBlLFxuICAgICAgICBGb3JtYXRTcGFjZVBpcGUsXG4gICAgICAgIEZpbGVUeXBlUGlwZSxcbiAgICAgICAgTXVsdGlWYWx1ZVBpcGUsXG4gICAgICAgIExvY2FsaXplZERhdGVQaXBlLFxuICAgICAgICBEZWNpbWFsTnVtYmVyUGlwZVxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBGaWxlU2l6ZVBpcGUsXG4gICAgICAgIEhpZ2hsaWdodFBpcGUsXG4gICAgICAgIFRpbWVBZ29QaXBlLFxuICAgICAgICBNaW1lVHlwZUljb25QaXBlLFxuICAgICAgICBJbml0aWFsVXNlcm5hbWVQaXBlLFxuICAgICAgICBGdWxsTmFtZVBpcGUsXG4gICAgICAgIE5vZGVOYW1lVG9vbHRpcFBpcGUsXG4gICAgICAgIEZvcm1hdFNwYWNlUGlwZSxcbiAgICAgICAgRmlsZVR5cGVQaXBlLFxuICAgICAgICBNdWx0aVZhbHVlUGlwZSxcbiAgICAgICAgTG9jYWxpemVkRGF0ZVBpcGUsXG4gICAgICAgIERlY2ltYWxOdW1iZXJQaXBlXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBQaXBlTW9kdWxlIHtcbn1cbiJdfQ==
