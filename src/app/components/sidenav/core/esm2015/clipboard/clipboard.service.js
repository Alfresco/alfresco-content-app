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
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LogService } from '../services/log.service';
import { NotificationService } from '../notifications/services/notification.service';
export class ClipboardService {
  /**
   * @param {?} document
   * @param {?} logService
   * @param {?} notificationService
   */
  constructor(document, logService, notificationService) {
    this.document = document;
    this.logService = logService;
    this.notificationService = notificationService;
  }
  /**
   * Checks if the target element can have its text copied.
   * @param {?} target Target HTML element
   * @return {?} True if the text can be copied, false otherwise
   */
  isTargetValid(target) {
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      return !target.hasAttribute('disabled');
    }
    return false;
  }
  /**
   * Copies text from an HTML element to the clipboard.
   * @param {?} target HTML element to be copied
   * @param {?=} message Snackbar message to alert when copying happens
   * @return {?}
   */
  copyToClipboard(target, message) {
    if (this.isTargetValid(target)) {
      try {
        target.select();
        target.setSelectionRange(0, target.value.length);
        this.document.execCommand('copy');
        this.notify(message);
      } catch (error) {
        this.logService.error(error);
      }
    }
  }
  /**
   * Copies a text string to the clipboard.
   * @param {?} content Text to copy
   * @param {?} message Snackbar message to alert when copying happens
   * @return {?}
   */
  copyContentToClipboard(content, message) {
    try {
      document.addEventListener(
        'copy'
        /**
         * @param {?} e
         * @return {?}
         */,
        e => {
          e.clipboardData.setData('text/plain', content);
          e.preventDefault();
          document.removeEventListener('copy', null);
        }
      );
      document.execCommand('copy');
      this.notify(message);
    } catch (error) {
      this.logService.error(error);
    }
  }
  /**
   * @private
   * @param {?} message
   * @return {?}
   */
  notify(message) {
    if (message) {
      this.notificationService.openSnackMessage(message);
    }
  }
}
ClipboardService.decorators = [{ type: Injectable }];
/** @nocollapse */
ClipboardService.ctorParameters = () => [
  { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT] }] },
  { type: LogService },
  { type: NotificationService }
];
if (false) {
  /**
   * @type {?}
   * @private
   */
  ClipboardService.prototype.document;
  /**
   * @type {?}
   * @private
   */
  ClipboardService.prototype.logService;
  /**
   * @type {?}
   * @private
   */
  ClipboardService.prototype.notificationService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcGJvYXJkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJjbGlwYm9hcmQvY2xpcGJvYXJkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUdyRixNQUFNLE9BQU8sZ0JBQWdCOzs7Ozs7SUFFekIsWUFDOEIsUUFBYSxFQUMvQixVQUFzQixFQUN0QixtQkFBd0M7UUFGdEIsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQUMvQixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7SUFBRyxDQUFDOzs7Ozs7SUFPeEQsYUFBYSxDQUFDLE1BQThDO1FBQ3hELElBQUksTUFBTSxZQUFZLGdCQUFnQixJQUFJLE1BQU0sWUFBWSxtQkFBbUIsRUFBRTtZQUM3RSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMzQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Ozs7Ozs7SUFPRCxlQUFlLENBQUMsTUFBOEMsRUFBRSxPQUFnQjtRQUM1RSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDNUIsSUFBSTtnQkFDQSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDeEI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNoQztTQUNKO0lBQ0wsQ0FBQzs7Ozs7OztJQU9ELHNCQUFzQixDQUFDLE9BQWUsRUFBRSxPQUFlO1FBQ25ELElBQUk7WUFDQSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTTs7OztZQUFFLENBQUMsQ0FBaUIsRUFBRSxFQUFFO2dCQUNwRCxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ25CLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxFQUFDLENBQUM7WUFDTCxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDeEI7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQzs7Ozs7O0lBRU8sTUFBTSxDQUFDLE9BQU87UUFDbEIsSUFBSSxPQUFPLEVBQUU7WUFDVCxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdEQ7SUFDTCxDQUFDOzs7WUE3REosVUFBVTs7Ozs0Q0FJRixNQUFNLFNBQUMsUUFBUTtZQVBmLFVBQVU7WUFDVixtQkFBbUI7Ozs7Ozs7SUFNcEIsb0NBQXVDOzs7OztJQUN2QyxzQ0FBOEI7Ozs7O0lBQzlCLCtDQUFnRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTG9nU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2xvZy5zZXJ2aWNlJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9ub3RpZmljYXRpb25zL3NlcnZpY2VzL25vdGlmaWNhdGlvbi5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENsaXBib2FyZFNlcnZpY2Uge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgcHJpdmF0ZSBsb2dTZXJ2aWNlOiBMb2dTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIG5vdGlmaWNhdGlvblNlcnZpY2U6IE5vdGlmaWNhdGlvblNlcnZpY2UpIHt9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIHRhcmdldCBlbGVtZW50IGNhbiBoYXZlIGl0cyB0ZXh0IGNvcGllZC5cbiAgICAgKiBAcGFyYW0gdGFyZ2V0IFRhcmdldCBIVE1MIGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB0ZXh0IGNhbiBiZSBjb3BpZWQsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIGlzVGFyZ2V0VmFsaWQodGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCB8fCB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gIXRhcmdldC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvcGllcyB0ZXh0IGZyb20gYW4gSFRNTCBlbGVtZW50IHRvIHRoZSBjbGlwYm9hcmQuXG4gICAgICogQHBhcmFtIHRhcmdldCBIVE1MIGVsZW1lbnQgdG8gYmUgY29waWVkXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgU25hY2tiYXIgbWVzc2FnZSB0byBhbGVydCB3aGVuIGNvcHlpbmcgaGFwcGVuc1xuICAgICAqL1xuICAgIGNvcHlUb0NsaXBib2FyZCh0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50LCBtZXNzYWdlPzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVGFyZ2V0VmFsaWQodGFyZ2V0KSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNldFNlbGVjdGlvblJhbmdlKDAsIHRhcmdldC52YWx1ZS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5vdGlmeShtZXNzYWdlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvcGllcyBhIHRleHQgc3RyaW5nIHRvIHRoZSBjbGlwYm9hcmQuXG4gICAgICogQHBhcmFtIGNvbnRlbnQgVGV4dCB0byBjb3B5XG4gICAgICogQHBhcmFtIG1lc3NhZ2UgU25hY2tiYXIgbWVzc2FnZSB0byBhbGVydCB3aGVuIGNvcHlpbmcgaGFwcGVuc1xuICAgICAqL1xuICAgIGNvcHlDb250ZW50VG9DbGlwYm9hcmQoY29udGVudDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvcHknLCAoZTogQ2xpcGJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBlLmNsaXBib2FyZERhdGEuc2V0RGF0YSgndGV4dC9wbGFpbicsIChjb250ZW50KSk7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvcHknLCBudWxsKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgICAgICAgICAgdGhpcy5ub3RpZnkobWVzc2FnZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3RpZnkobWVzc2FnZSkge1xuICAgICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25TZXJ2aWNlLm9wZW5TbmFja01lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==
