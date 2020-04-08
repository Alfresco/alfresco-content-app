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
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuHolderComponent } from './context-menu-holder.component';
import { ContextMenuDirective } from './context-menu.directive';
import { ContextMenuListComponent } from './context-menu-list.component';
export class ContextMenuModule {}
ContextMenuModule.decorators = [
  {
    type: NgModule,
    args: [
      {
        imports: [CommonModule, MaterialModule, TranslateModule.forChild()],
        declarations: [
          ContextMenuHolderComponent,
          ContextMenuDirective,
          ContextMenuListComponent
        ],
        exports: [ContextMenuHolderComponent, ContextMenuDirective],
        entryComponents: [ContextMenuListComponent]
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNvbnRleHQtbWVudS9jb250ZXh0LW1lbnUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFdEQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDN0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFxQnpFLE1BQU0sT0FBTyxpQkFBaUI7OztZQW5CN0IsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRTtvQkFDTCxZQUFZO29CQUNaLGNBQWM7b0JBQ2QsZUFBZSxDQUFDLFFBQVEsRUFBRTtpQkFDN0I7Z0JBQ0QsWUFBWSxFQUFFO29CQUNWLDBCQUEwQjtvQkFDMUIsb0JBQW9CO29CQUNwQix3QkFBd0I7aUJBQzNCO2dCQUNELE9BQU8sRUFBRTtvQkFDTCwwQkFBMEI7b0JBQzFCLG9CQUFvQjtpQkFDdkI7Z0JBQ0QsZUFBZSxFQUFFO29CQUNiLHdCQUF3QjtpQkFDM0I7YUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0ZXJpYWxNb2R1bGUgfSBmcm9tICcuLi9tYXRlcmlhbC5tb2R1bGUnO1xuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XG5cbmltcG9ydCB7IENvbnRleHRNZW51SG9sZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb250ZXh0LW1lbnUtaG9sZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb250ZXh0TWVudURpcmVjdGl2ZSB9IGZyb20gJy4vY29udGV4dC1tZW51LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDb250ZXh0TWVudUxpc3RDb21wb25lbnQgfSBmcm9tICcuL2NvbnRleHQtbWVudS1saXN0LmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIE1hdGVyaWFsTW9kdWxlLFxuICAgICAgICBUcmFuc2xhdGVNb2R1bGUuZm9yQ2hpbGQoKVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIENvbnRleHRNZW51SG9sZGVyQ29tcG9uZW50LFxuICAgICAgICBDb250ZXh0TWVudURpcmVjdGl2ZSxcbiAgICAgICAgQ29udGV4dE1lbnVMaXN0Q29tcG9uZW50XG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIENvbnRleHRNZW51SG9sZGVyQ29tcG9uZW50LFxuICAgICAgICBDb250ZXh0TWVudURpcmVjdGl2ZVxuICAgIF0sXG4gICAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgICAgIENvbnRleHRNZW51TGlzdENvbXBvbmVudFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVNb2R1bGUge31cbiJdfQ==
