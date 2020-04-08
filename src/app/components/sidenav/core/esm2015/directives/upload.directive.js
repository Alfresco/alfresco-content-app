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
/* tslint:disable:no-input-rename  */
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  Renderer2
} from '@angular/core';
import { FileUtils } from '../utils/file-utils';
export class UploadDirective {
  /**
   * @param {?} el
   * @param {?} renderer
   * @param {?} ngZone
   */
  constructor(el, renderer, ngZone) {
    this.el = el;
    this.renderer = renderer;
    this.ngZone = ngZone;
    /**
     * Enables/disables uploading.
     */
    this.enabled = true;
    /**
     * Upload mode. Can be "drop" (receives dropped files) or "click"
     * (clicking opens a file dialog). Both modes can be active at once.
     */
    this.mode = ['drop']; // click|drop
    this.isDragging = false;
    this.cssClassName = 'adf-upload__dragging';
    this.element = el.nativeElement;
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    if (this.isClickMode() && this.renderer) {
      /** @type {?} */
      const inputUpload = this.renderer.createElement('input');
      this.upload = this.el.nativeElement.parentElement.appendChild(
        inputUpload
      );
      this.upload.type = 'file';
      this.upload.style.display = 'none';
      this.upload.addEventListener(
        'change'
        /**
         * @param {?} event
         * @return {?}
         */,
        event => this.onSelectFiles(event)
      );
      if (this.multiple) {
        this.upload.setAttribute('multiple', '');
      }
      if (this.accept) {
        this.upload.setAttribute('accept', this.accept);
      }
      if (this.directory) {
        this.upload.setAttribute('webkitdirectory', '');
      }
    }
    if (this.isDropMode()) {
      this.ngZone.runOutsideAngular(
        /**
         * @return {?}
         */
        () => {
          this.element.addEventListener(
            'dragenter',
            this.onDragEnter.bind(this)
          );
          this.element.addEventListener('dragover', this.onDragOver.bind(this));
          this.element.addEventListener(
            'dragleave',
            this.onDragLeave.bind(this)
          );
          this.element.addEventListener('drop', this.onDrop.bind(this));
        }
      );
    }
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.element.removeEventListener('dragenter', this.onDragEnter);
    this.element.removeEventListener('dragover', this.onDragOver);
    this.element.removeEventListener('dragleave', this.onDragLeave);
    this.element.removeEventListener('drop', this.onDrop);
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onClick(event) {
    if (this.isClickMode() && this.upload) {
      event.preventDefault();
      this.upload.click();
    }
  }
  /**
   * @return {?}
   */
  onDragEnter() {
    if (this.isDropMode()) {
      this.element.classList.add(this.cssClassName);
      this.isDragging = true;
    }
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onDragOver(event) {
    event.preventDefault();
    if (this.isDropMode()) {
      this.element.classList.add(this.cssClassName);
      this.isDragging = true;
    }
    return false;
  }
  /**
   * @return {?}
   */
  onDragLeave() {
    if (this.isDropMode()) {
      this.element.classList.remove(this.cssClassName);
      this.isDragging = false;
    }
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onDrop(event) {
    if (this.isDropMode()) {
      event.stopPropagation();
      event.preventDefault();
      this.element.classList.remove(this.cssClassName);
      this.isDragging = false;
      /** @type {?} */
      const dataTransfer = this.getDataTransfer(event);
      if (dataTransfer) {
        this.getFilesDropped(dataTransfer).then(
          /**
           * @param {?} files
           * @return {?}
           */
          files => {
            this.onUploadFiles(files);
          }
        );
      }
    }
    return false;
  }
  /**
   * @param {?} files
   * @return {?}
   */
  onUploadFiles(files) {
    if (this.enabled && files.length > 0) {
      /** @type {?} */
      const customEvent = new CustomEvent('upload-files', {
        detail: {
          sender: this,
          data: this.data,
          files: files
        },
        bubbles: true
      });
      this.el.nativeElement.dispatchEvent(customEvent);
    }
  }
  /**
   * @protected
   * @param {?} mode
   * @return {?}
   */
  hasMode(mode) {
    return this.enabled && mode && this.mode && this.mode.indexOf(mode) > -1;
  }
  /**
   * @protected
   * @return {?}
   */
  isDropMode() {
    return this.hasMode('drop');
  }
  /**
   * @protected
   * @return {?}
   */
  isClickMode() {
    return this.hasMode('click');
  }
  /**
   * @param {?} event
   * @return {?}
   */
  getDataTransfer(event) {
    if (event && event.dataTransfer) {
      return event.dataTransfer;
    }
    if (event && event.originalEvent && event.originalEvent.dataTransfer) {
      return event.originalEvent.dataTransfer;
    }
    return null;
  }
  /**
   * Extract files from the DataTransfer object used to hold the data that is being dragged during a drag and drop operation.
   * @param {?} dataTransfer DataTransfer object
   * @return {?}
   */
  getFilesDropped(dataTransfer) {
    return new Promise
    /**
     * @param {?} resolve
     * @return {?}
     */(resolve => {
      /** @type {?} */
      const iterations = [];
      if (dataTransfer) {
        /** @type {?} */
        const items = dataTransfer.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (typeof items[i].webkitGetAsEntry !== 'undefined') {
              /** @type {?} */
              const item = items[i].webkitGetAsEntry();
              if (item) {
                if (item.isFile) {
                  iterations.push(
                    Promise.resolve(
                      /** @type {?} */ ({
                        entry: item,
                        file: items[i].getAsFile(),
                        relativeFolder: '/'
                      })
                    )
                  );
                } else if (item.isDirectory) {
                  iterations.push(
                    new Promise
                    /**
                     * @param {?} resolveFolder
                     * @return {?}
                     */(resolveFolder => {
                      FileUtils.flatten(item).then(
                        /**
                         * @param {?} files
                         * @return {?}
                         */
                        files => resolveFolder(files)
                      );
                    })
                  );
                }
              }
            } else {
              iterations.push(
                Promise.resolve(
                  /** @type {?} */ ({
                    entry: null,
                    file: items[i].getAsFile(),
                    relativeFolder: '/'
                  })
                )
              );
            }
          }
        } else {
          // safari or FF
          /** @type {?} */
          const files = FileUtils.toFileArray(dataTransfer.files).map(
            /**
             * @param {?} file
             * @return {?}
             */
            (file => /** @type {?} */ ({
              entry: null,
              file: file,
              relativeFolder: '/'
            }))
          );
          iterations.push(Promise.resolve(files));
        }
      }
      Promise.all(iterations).then(
        /**
         * @param {?} result
         * @return {?}
         */
        result => {
          resolve(
            result.reduce(
              /**
               * @param {?} a
               * @param {?} b
               * @return {?}
               */
              (a, b) => a.concat(b),
              []
            )
          );
        }
      );
    });
  }
  /**
   * Invoked when user selects files or folders by means of File Dialog
   * @param {?} event DOM event
   * @return {?}
   */
  onSelectFiles(event) {
    if (this.isClickMode()) {
      /** @type {?} */
      const input = /** @type {?} */ (event.currentTarget);
      /** @type {?} */
      const files = FileUtils.toFileArray(input.files);
      this.onUploadFiles(
        files.map(
          /**
           * @param {?} file
           * @return {?}
           */
          file => /** @type {?} */ ({
            entry: null,
            file: file,
            relativeFolder: '/'
          })
        )
      );
      event.target.value = '';
    }
  }
}
UploadDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: '[adf-upload]'
      }
    ]
  }
];
/** @nocollapse */
UploadDirective.ctorParameters = () => [
  { type: ElementRef },
  { type: Renderer2 },
  { type: NgZone }
];
UploadDirective.propDecorators = {
  enabled: [{ type: Input, args: ['adf-upload'] }],
  data: [{ type: Input, args: ['adf-upload-data'] }],
  mode: [{ type: Input }],
  multiple: [{ type: Input }],
  accept: [{ type: Input }],
  directory: [{ type: Input }],
  onClick: [{ type: HostListener, args: ['click', ['$event']] }]
};
if (false) {
  /**
   * Enables/disables uploading.
   * @type {?}
   */
  UploadDirective.prototype.enabled;
  /**
   * Data to upload.
   * @type {?}
   */
  UploadDirective.prototype.data;
  /**
   * Upload mode. Can be "drop" (receives dropped files) or "click"
   * (clicking opens a file dialog). Both modes can be active at once.
   * @type {?}
   */
  UploadDirective.prototype.mode;
  /**
   * Toggles multiple file uploads.
   * @type {?}
   */
  UploadDirective.prototype.multiple;
  /**
   * (Click mode only) MIME type filter for files to accept.
   * @type {?}
   */
  UploadDirective.prototype.accept;
  /**
   * (Click mode only) Toggles uploading of directories.
   * @type {?}
   */
  UploadDirective.prototype.directory;
  /** @type {?} */
  UploadDirective.prototype.isDragging;
  /**
   * @type {?}
   * @private
   */
  UploadDirective.prototype.cssClassName;
  /**
   * @type {?}
   * @private
   */
  UploadDirective.prototype.upload;
  /**
   * @type {?}
   * @private
   */
  UploadDirective.prototype.element;
  /**
   * @type {?}
   * @private
   */
  UploadDirective.prototype.el;
  /**
   * @type {?}
   * @private
   */
  UploadDirective.prototype.renderer;
  /**
   * @type {?}
   * @private
   */
  UploadDirective.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvdXBsb2FkLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQXFCLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqSCxPQUFPLEVBQVksU0FBUyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFLMUQsTUFBTSxPQUFPLGVBQWU7Ozs7OztJQWtDeEIsWUFBb0IsRUFBYyxFQUFVLFFBQW1CLEVBQVUsTUFBYztRQUFuRSxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7Ozs7UUE5QnZGLFlBQU8sR0FBWSxJQUFJLENBQUM7Ozs7O1FBVXhCLFNBQUksR0FBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYTtRQWN4QyxlQUFVLEdBQVksS0FBSyxDQUFDO1FBRXBCLGlCQUFZLEdBQVcsc0JBQXNCLENBQUM7UUFLbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQ3BDLENBQUM7Ozs7SUFFRCxRQUFRO1FBQ0osSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTs7a0JBQy9CLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7WUFDeEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTNFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUTs7OztZQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUM7WUFFN0UsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUM1QztZQUVELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDYixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ25EO1lBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNuRDtTQUNKO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUI7OztZQUFDLEdBQUcsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDeEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDdEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDeEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNsRSxDQUFDLEVBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQzs7OztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUQsQ0FBQzs7Ozs7SUFHRCxPQUFPLENBQUMsS0FBWTtRQUNoQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ25DLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3ZCO0lBQ0wsQ0FBQzs7OztJQUVELFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNuQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQzFCO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxVQUFVLENBQUMsS0FBWTtRQUNuQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUMxQjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztTQUMzQjtJQUNMLENBQUM7Ozs7O0lBRUQsTUFBTSxDQUFDLEtBQVk7UUFDZixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUVuQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBRXZCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7O2tCQUVsQixZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUM7WUFDaEQsSUFBSSxZQUFZLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJOzs7O2dCQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQzlDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzlCLENBQUMsRUFBQyxDQUFDO2FBRU47U0FDSjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Ozs7O0lBRUQsYUFBYSxDQUFDLEtBQWlCO1FBQzNCLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7a0JBQzVCLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxjQUFjLEVBQUU7Z0JBQ2hELE1BQU0sRUFBRTtvQkFDSixNQUFNLEVBQUUsSUFBSTtvQkFDWixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ2YsS0FBSyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsT0FBTyxFQUFFLElBQUk7YUFDaEIsQ0FBQztZQUVGLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNwRDtJQUNMLENBQUM7Ozs7OztJQUVTLE9BQU8sQ0FBQyxJQUFZO1FBQzFCLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDOzs7OztJQUVTLFVBQVU7UUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Ozs7O0lBRVMsV0FBVztRQUNqQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQzs7Ozs7SUFFRCxlQUFlLENBQUMsS0FBa0I7UUFDOUIsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRTtZQUM3QixPQUFPLEtBQUssQ0FBQyxZQUFZLENBQUM7U0FDN0I7UUFDRCxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFO1lBQ2xFLE9BQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7U0FDM0M7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOzs7Ozs7SUFNRCxlQUFlLENBQUMsWUFBMEI7UUFDdEMsT0FBTyxJQUFJLE9BQU87Ozs7UUFBQyxDQUFDLE9BQU8sRUFBRSxFQUFFOztrQkFDckIsVUFBVSxHQUFHLEVBQUU7WUFFckIsSUFBSSxZQUFZLEVBQUU7O3NCQUNSLEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSztnQkFDaEMsSUFBSSxLQUFLLEVBQUU7b0JBQ1AsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ25DLElBQUksT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEtBQUssV0FBVyxFQUFFOztrQ0FDNUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRTs0QkFDeEMsSUFBSSxJQUFJLEVBQUU7Z0NBQ04sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO29DQUNiLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxtQkFBVzt3Q0FDdkMsS0FBSyxFQUFFLElBQUk7d0NBQ1gsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7d0NBQzFCLGNBQWMsRUFBRSxHQUFHO3FDQUN0QixFQUFBLENBQUMsQ0FBQyxDQUFDO2lDQUNQO3FDQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtvQ0FDekIsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU87Ozs7b0NBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTt3Q0FDMUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJOzs7O3dDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQztvQ0FDbEUsQ0FBQyxFQUFDLENBQUMsQ0FBQztpQ0FDUDs2QkFDSjt5QkFDSjs2QkFBTTs0QkFDSCxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsbUJBQVc7Z0NBQ3ZDLEtBQUssRUFBRSxJQUFJO2dDQUNYLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFO2dDQUMxQixjQUFjLEVBQUUsR0FBRzs2QkFDdEIsRUFBQSxDQUFDLENBQUMsQ0FBQzt5QkFDUDtxQkFDSjtpQkFDSjtxQkFBTTs7OzBCQUVHLEtBQUssR0FBRyxTQUFTO3lCQUNsQixXQUFXLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQzt5QkFDL0IsR0FBRzs7OztvQkFBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsbUJBQVc7d0JBQ3RCLEtBQUssRUFBRSxJQUFJO3dCQUNYLElBQUksRUFBRSxJQUFJO3dCQUNWLGNBQWMsRUFBRSxHQUFHO3FCQUN0QixFQUFBLEVBQUM7b0JBRU4sVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7aUJBQzNDO2FBQ0o7WUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUk7Ozs7WUFBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNwQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU07Ozs7O2dCQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RELENBQUMsRUFBQyxDQUFDO1FBQ1AsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7Ozs7SUFNRCxhQUFhLENBQUMsS0FBVTtRQUNwQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTs7a0JBQ2QsS0FBSyxHQUFHLENBQUMsbUJBQW1CLEtBQUssQ0FBQyxhQUFhLEVBQUEsQ0FBQzs7a0JBQ2hELEtBQUssR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRzs7OztZQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxtQkFBVztnQkFDOUMsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsY0FBYyxFQUFFLEdBQUc7YUFDdEIsRUFBQSxFQUFDLENBQUMsQ0FBQztZQUNKLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7OztZQTlPSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGNBQWM7YUFDM0I7Ozs7WUFMbUIsVUFBVTtZQUFrRCxTQUFTO1lBQXBDLE1BQU07OztzQkFTdEQsS0FBSyxTQUFDLFlBQVk7bUJBSWxCLEtBQUssU0FBQyxpQkFBaUI7bUJBTXZCLEtBQUs7dUJBSUwsS0FBSztxQkFJTCxLQUFLO3dCQUlMLEtBQUs7c0JBb0RMLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7Ozs7Ozs7SUExRWpDLGtDQUN3Qjs7Ozs7SUFHeEIsK0JBQ1U7Ozs7OztJQUtWLCtCQUMwQjs7Ozs7SUFHMUIsbUNBQ2tCOzs7OztJQUdsQixpQ0FDZTs7Ozs7SUFHZixvQ0FDbUI7O0lBRW5CLHFDQUE0Qjs7Ozs7SUFFNUIsdUNBQXNEOzs7OztJQUN0RCxpQ0FBaUM7Ozs7O0lBQ2pDLGtDQUE2Qjs7Ozs7SUFFakIsNkJBQXNCOzs7OztJQUFFLG1DQUEyQjs7Ozs7SUFBRSxpQ0FBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1pbnB1dC1yZW5hbWUgICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCwgTmdab25lLCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGaWxlSW5mbywgRmlsZVV0aWxzIH0gZnJvbSAnLi4vdXRpbHMvZmlsZS11dGlscyc7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2FkZi11cGxvYWRdJ1xufSlcbmV4cG9ydCBjbGFzcyBVcGxvYWREaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICAvKiogRW5hYmxlcy9kaXNhYmxlcyB1cGxvYWRpbmcuICovXG4gICAgQElucHV0KCdhZGYtdXBsb2FkJylcbiAgICBlbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIC8qKiBEYXRhIHRvIHVwbG9hZC4gKi9cbiAgICBASW5wdXQoJ2FkZi11cGxvYWQtZGF0YScpXG4gICAgZGF0YTogYW55O1xuXG4gICAgLyoqIFVwbG9hZCBtb2RlLiBDYW4gYmUgXCJkcm9wXCIgKHJlY2VpdmVzIGRyb3BwZWQgZmlsZXMpIG9yIFwiY2xpY2tcIlxuICAgICAqIChjbGlja2luZyBvcGVucyBhIGZpbGUgZGlhbG9nKS4gQm90aCBtb2RlcyBjYW4gYmUgYWN0aXZlIGF0IG9uY2UuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBtb2RlOiBzdHJpbmdbXSA9IFsnZHJvcCddOyAvLyBjbGlja3xkcm9wXG5cbiAgICAvKiogVG9nZ2xlcyBtdWx0aXBsZSBmaWxlIHVwbG9hZHMuICovXG4gICAgQElucHV0KClcbiAgICBtdWx0aXBsZTogYm9vbGVhbjtcblxuICAgIC8qKiAoQ2xpY2sgbW9kZSBvbmx5KSBNSU1FIHR5cGUgZmlsdGVyIGZvciBmaWxlcyB0byBhY2NlcHQuICovXG4gICAgQElucHV0KClcbiAgICBhY2NlcHQ6IHN0cmluZztcblxuICAgIC8qKiAoQ2xpY2sgbW9kZSBvbmx5KSBUb2dnbGVzIHVwbG9hZGluZyBvZiBkaXJlY3Rvcmllcy4gKi9cbiAgICBASW5wdXQoKVxuICAgIGRpcmVjdG9yeTogYm9vbGVhbjtcblxuICAgIGlzRHJhZ2dpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByaXZhdGUgY3NzQ2xhc3NOYW1lOiBzdHJpbmcgPSAnYWRmLXVwbG9hZF9fZHJhZ2dpbmcnO1xuICAgIHByaXZhdGUgdXBsb2FkOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgbmdab25lOiBOZ1pvbmUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWwubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNDbGlja01vZGUoKSAmJiB0aGlzLnJlbmRlcmVyKSB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dFVwbG9hZCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgIHRoaXMudXBsb2FkID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXRVcGxvYWQpO1xuXG4gICAgICAgICAgICB0aGlzLnVwbG9hZC50eXBlID0gJ2ZpbGUnO1xuICAgICAgICAgICAgdGhpcy51cGxvYWQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHRoaXMudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4gdGhpcy5vblNlbGVjdEZpbGVzKGV2ZW50KSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGxvYWQuc2V0QXR0cmlidXRlKCdtdWx0aXBsZScsICcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuYWNjZXB0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGxvYWQuc2V0QXR0cmlidXRlKCdhY2NlcHQnLCB0aGlzLmFjY2VwdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdG9yeSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkLnNldEF0dHJpYnV0ZSgnd2Via2l0ZGlyZWN0b3J5JywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNEcm9wTW9kZSgpKSB7XG4gICAgICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIHRoaXMub25EcmFnRW50ZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgdGhpcy5vbkRyYWdPdmVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCB0aGlzLm9uRHJhZ0xlYXZlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgdGhpcy5vbkRyb3AuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgdGhpcy5vbkRyYWdFbnRlcik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMub25EcmFnT3Zlcik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCB0aGlzLm9uRHJhZ0xlYXZlKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCB0aGlzLm9uRHJvcCk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKVxuICAgIG9uQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ2xpY2tNb2RlKCkgJiYgdGhpcy51cGxvYWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnVwbG9hZC5jbGljaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25EcmFnRW50ZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRHJvcE1vZGUoKSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc05hbWUpO1xuICAgICAgICAgICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRHJhZ092ZXIoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLmlzRHJvcE1vZGUoKSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5jc3NDbGFzc05hbWUpO1xuICAgICAgICAgICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb25EcmFnTGVhdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRHJvcE1vZGUoKSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jc3NDbGFzc05hbWUpO1xuICAgICAgICAgICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRyb3AoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRHJvcE1vZGUoKSkge1xuXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY3NzQ2xhc3NOYW1lKTtcbiAgICAgICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhVHJhbnNmZXIgPSB0aGlzLmdldERhdGFUcmFuc2ZlcihldmVudCk7XG4gICAgICAgICAgICBpZiAoZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRGaWxlc0Ryb3BwZWQoZGF0YVRyYW5zZmVyKS50aGVuKChmaWxlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uVXBsb2FkRmlsZXMoZmlsZXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uVXBsb2FkRmlsZXMoZmlsZXM6IEZpbGVJbmZvW10pIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCAmJiBmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBjdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudCgndXBsb2FkLWZpbGVzJywge1xuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZXM6IGZpbGVzXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tRXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGhhc01vZGUobW9kZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuYWJsZWQgJiYgbW9kZSAmJiB0aGlzLm1vZGUgJiYgdGhpcy5tb2RlLmluZGV4T2YobW9kZSkgPiAtMTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNEcm9wTW9kZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzTW9kZSgnZHJvcCcpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0NsaWNrTW9kZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzTW9kZSgnY2xpY2snKTtcbiAgICB9XG5cbiAgICBnZXREYXRhVHJhbnNmZXIoZXZlbnQ6IEV2ZW50IHwgYW55KTogRGF0YVRyYW5zZmVyIHtcbiAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LmRhdGFUcmFuc2Zlcikge1xuICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmRhdGFUcmFuc2ZlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQub3JpZ2luYWxFdmVudCAmJiBldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlcikge1xuICAgICAgICAgICAgcmV0dXJuIGV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgZmlsZXMgZnJvbSB0aGUgRGF0YVRyYW5zZmVyIG9iamVjdCB1c2VkIHRvIGhvbGQgdGhlIGRhdGEgdGhhdCBpcyBiZWluZyBkcmFnZ2VkIGR1cmluZyBhIGRyYWcgYW5kIGRyb3Agb3BlcmF0aW9uLlxuICAgICAqIEBwYXJhbSBkYXRhVHJhbnNmZXIgRGF0YVRyYW5zZmVyIG9iamVjdFxuICAgICAqL1xuICAgIGdldEZpbGVzRHJvcHBlZChkYXRhVHJhbnNmZXI6IERhdGFUcmFuc2Zlcik6IFByb21pc2U8RmlsZUluZm9bXT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZXJhdGlvbnMgPSBbXTtcblxuICAgICAgICAgICAgaWYgKGRhdGFUcmFuc2Zlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gZGF0YVRyYW5zZmVyLml0ZW1zO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW1zW2ldLndlYmtpdEdldEFzRW50cnkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zW2ldLndlYmtpdEdldEFzRW50cnkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pc0ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdGlvbnMucHVzaChQcm9taXNlLnJlc29sdmUoPEZpbGVJbmZvPiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnk6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogaXRlbXNbaV0uZ2V0QXNGaWxlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmVGb2xkZXI6ICcvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdGlvbnMucHVzaChuZXcgUHJvbWlzZSgocmVzb2x2ZUZvbGRlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVVdGlscy5mbGF0dGVuKGl0ZW0pLnRoZW4oKGZpbGVzKSA9PiByZXNvbHZlRm9sZGVyKGZpbGVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdGlvbnMucHVzaChQcm9taXNlLnJlc29sdmUoPEZpbGVJbmZvPiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBpdGVtc1tpXS5nZXRBc0ZpbGUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmVGb2xkZXI6ICcvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNhZmFyaSBvciBGRlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlcyA9IEZpbGVVdGlsc1xuICAgICAgICAgICAgICAgICAgICAgICAgLnRvRmlsZUFycmF5KGRhdGFUcmFuc2Zlci5maWxlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGZpbGUpID0+IDxGaWxlSW5mbz4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmVGb2xkZXI6ICcvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaXRlcmF0aW9ucy5wdXNoKFByb21pc2UucmVzb2x2ZShmaWxlcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoaXRlcmF0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiKSwgW10pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VkIHdoZW4gdXNlciBzZWxlY3RzIGZpbGVzIG9yIGZvbGRlcnMgYnkgbWVhbnMgb2YgRmlsZSBEaWFsb2dcbiAgICAgKiBAcGFyYW0gZXZlbnQgRE9NIGV2ZW50XG4gICAgICovXG4gICAgb25TZWxlY3RGaWxlcyhldmVudDogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzQ2xpY2tNb2RlKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gKDxIVE1MSW5wdXRFbGVtZW50PiBldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gRmlsZVV0aWxzLnRvRmlsZUFycmF5KGlucHV0LmZpbGVzKTtcbiAgICAgICAgICAgIHRoaXMub25VcGxvYWRGaWxlcyhmaWxlcy5tYXAoKGZpbGUpID0+IDxGaWxlSW5mbz4ge1xuICAgICAgICAgICAgICAgIGVudHJ5OiBudWxsLFxuICAgICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgICAgcmVsYXRpdmVGb2xkZXI6ICcvJ1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
