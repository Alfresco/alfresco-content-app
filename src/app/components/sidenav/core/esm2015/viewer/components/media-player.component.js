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
import { ContentService } from '../../services/content.service';
export class MediaPlayerComponent {
  /**
   * @param {?} contentService
   */
  constructor(contentService) {
    this.contentService = contentService;
  }
  /**
   * @param {?} changes
   * @return {?}
   */
  ngOnChanges(changes) {
    /** @type {?} */
    const blobFile = changes['blobFile'];
    if (blobFile && blobFile.currentValue) {
      this.urlFile = this.contentService.createTrustedUrl(this.blobFile);
      return;
    }
    if (!this.urlFile && !this.blobFile) {
      throw new Error('Attribute urlFile or blobFile is required');
    }
  }
}
MediaPlayerComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-media-player',
        template:
          '<video controls>\n    <source [src]="urlFile" [type]="mimeType" />\n</video>\n',
        host: { class: 'adf-media-player' },
        encapsulation: ViewEncapsulation.None,
        styles: [
          '.adf-media-player{display:flex}.adf-media-player video{display:flex;flex:1;max-height:90vh;max-width:100%}'
        ]
      }
    ]
  }
];
/** @nocollapse */
MediaPlayerComponent.ctorParameters = () => [{ type: ContentService }];
MediaPlayerComponent.propDecorators = {
  urlFile: [{ type: Input }],
  blobFile: [{ type: Input }],
  mimeType: [{ type: Input }],
  nameFile: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  MediaPlayerComponent.prototype.urlFile;
  /** @type {?} */
  MediaPlayerComponent.prototype.blobFile;
  /** @type {?} */
  MediaPlayerComponent.prototype.mimeType;
  /** @type {?} */
  MediaPlayerComponent.prototype.nameFile;
  /**
   * @type {?}
   * @private
   */
  MediaPlayerComponent.prototype.contentService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtcGxheWVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInZpZXdlci9jb21wb25lbnRzL21lZGlhLXBsYXllci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQTRCLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQVNoRSxNQUFNLE9BQU8sb0JBQW9COzs7O0lBYzdCLFlBQW9CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtJQUFJLENBQUM7Ozs7O0lBRXZELFdBQVcsQ0FBQyxPQUFzQjs7Y0FDeEIsUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDcEMsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLFlBQVksRUFBRTtZQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25FLE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7U0FDaEU7SUFDTCxDQUFDOzs7WUFqQ0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLDhGQUE0QztnQkFFNUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFO2dCQUNyQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDeEM7Ozs7WUFSUSxjQUFjOzs7c0JBV2xCLEtBQUs7dUJBR0wsS0FBSzt1QkFHTCxLQUFLO3VCQUdMLEtBQUs7Ozs7SUFUTix1Q0FDZ0I7O0lBRWhCLHdDQUNlOztJQUVmLHdDQUNpQjs7SUFFakIsd0NBQ2lCOzs7OztJQUVMLDhDQUFzQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRlbnRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29udGVudC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtbWVkaWEtcGxheWVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vbWVkaWEtcGxheWVyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9tZWRpYS1wbGF5ZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgICBob3N0OiB7ICdjbGFzcyc6ICdhZGYtbWVkaWEtcGxheWVyJyB9LFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgTWVkaWFQbGF5ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gICAgQElucHV0KClcbiAgICB1cmxGaWxlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIGJsb2JGaWxlOiBCbG9iO1xuXG4gICAgQElucHV0KClcbiAgICBtaW1lVHlwZTogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBuYW1lRmlsZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb250ZW50U2VydmljZTogQ29udGVudFNlcnZpY2UgKSB7fVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBjb25zdCBibG9iRmlsZSA9IGNoYW5nZXNbJ2Jsb2JGaWxlJ107XG4gICAgICAgIGlmIChibG9iRmlsZSAmJiBibG9iRmlsZS5jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudXJsRmlsZSA9IHRoaXMuY29udGVudFNlcnZpY2UuY3JlYXRlVHJ1c3RlZFVybCh0aGlzLmJsb2JGaWxlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy51cmxGaWxlICYmICF0aGlzLmJsb2JGaWxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dHJpYnV0ZSB1cmxGaWxlIG9yIGJsb2JGaWxlIGlzIHJlcXVpcmVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
