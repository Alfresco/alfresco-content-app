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
  state,
  style,
  animate,
  transition,
  query,
  group,
  sequence
} from '@angular/animations';
/** @type {?} */
export const contextMenuAnimation = [
  state(
    'void',
    style({
      opacity: 0,
      transform: 'scale(0.01, 0.01)'
    })
  ),
  transition(
    'void => *',
    sequence([
      query('.mat-menu-content', style({ opacity: 0 })),
      animate(
        '100ms linear',
        style({ opacity: 1, transform: 'scale(1, 0.5)' })
      ),
      group([
        query(
          '.mat-menu-content',
          animate(
            '400ms cubic-bezier(0.55, 0, 0.55, 0.2)',
            style({ opacity: 1 })
          )
        ),
        animate(
          '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ transform: 'scale(1, 1)' })
        )
      ])
    ])
  ),
  transition('* => void', animate('150ms 50ms linear', style({ opacity: 0 })))
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNvbnRleHQtbWVudS9hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFDSCxLQUFLLEVBQ0wsS0FBSyxFQUNMLE9BQU8sRUFDUCxVQUFVLEVBQ1YsS0FBSyxFQUNMLEtBQUssRUFDTCxRQUFRLEVBR1gsTUFBTSxxQkFBcUIsQ0FBQzs7QUFFN0IsTUFBTSxPQUFPLG9CQUFvQixHQUE4RDtJQUMzRixLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztRQUNoQixPQUFPLEVBQUUsQ0FBQztRQUNWLFNBQVMsRUFBRSxtQkFBbUI7S0FDakMsQ0FBQyxDQUFDO0lBQ0gsVUFBVSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUM7UUFDN0IsS0FBSyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUMxRSxLQUFLLENBQUM7WUFDRixLQUFLLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLHdDQUF3QyxFQUN2RSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FDeEIsQ0FBQztZQUNGLE9BQU8sQ0FBQyx3Q0FBd0MsRUFBRSxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztTQUN6RixDQUFDO0tBQ0wsQ0FBQyxDQUFDO0lBQ0gsVUFBVSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztDQUMvRSIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7XG4gICAgc3RhdGUsXG4gICAgc3R5bGUsXG4gICAgYW5pbWF0ZSxcbiAgICB0cmFuc2l0aW9uLFxuICAgIHF1ZXJ5LFxuICAgIGdyb3VwLFxuICAgIHNlcXVlbmNlLFxuICAgIEFuaW1hdGlvblN0YXRlTWV0YWRhdGEsXG4gICAgQW5pbWF0aW9uVHJhbnNpdGlvbk1ldGFkYXRhXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5leHBvcnQgY29uc3QgY29udGV4dE1lbnVBbmltYXRpb246ICggQW5pbWF0aW9uU3RhdGVNZXRhZGF0YSB8IEFuaW1hdGlvblRyYW5zaXRpb25NZXRhZGF0YSlbXSA9IFtcbiAgICBzdGF0ZSgndm9pZCcsIHN0eWxlKHtcbiAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC4wMSwgMC4wMSknXG4gICAgfSkpLFxuICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gKicsIHNlcXVlbmNlKFtcbiAgICAgICAgcXVlcnkoJy5tYXQtbWVudS1jb250ZW50Jywgc3R5bGUoeyBvcGFjaXR5OiAwIH0pKSxcbiAgICAgICAgYW5pbWF0ZSgnMTAwbXMgbGluZWFyJywgc3R5bGUoeyBvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdzY2FsZSgxLCAwLjUpJyB9KSksXG4gICAgICAgIGdyb3VwKFtcbiAgICAgICAgICAgIHF1ZXJ5KCcubWF0LW1lbnUtY29udGVudCcsIGFuaW1hdGUoJzQwMG1zIGN1YmljLWJlemllcigwLjU1LCAwLCAwLjU1LCAwLjIpJyxcbiAgICAgICAgICAgICAgICBzdHlsZSh7IG9wYWNpdHk6IDEgfSlcbiAgICAgICAgICAgICkpLFxuICAgICAgICAgICAgYW5pbWF0ZSgnMzAwbXMgY3ViaWMtYmV6aWVyKDAuMjUsIDAuOCwgMC4yNSwgMSknLCBzdHlsZSh7IHRyYW5zZm9ybTogJ3NjYWxlKDEsIDEpJyB9KSlcbiAgICAgICAgXSlcbiAgICBdKSksXG4gICAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgYW5pbWF0ZSgnMTUwbXMgNTBtcyBsaW5lYXInLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpKVxuXTtcbiJdfQ==
