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
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { forkJoin, from, of } from 'rxjs';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { TranslationService } from '../services/translation.service';
import { map, catchError } from 'rxjs/operators';
/**
 * @record
 */
function ProcessedNodeData() {}
if (false) {
  /** @type {?} */
  ProcessedNodeData.prototype.entry;
  /** @type {?} */
  ProcessedNodeData.prototype.status;
}
/**
 * @record
 */
function ProcessStatus() {}
if (false) {
  /** @type {?} */
  ProcessStatus.prototype.success;
  /** @type {?} */
  ProcessStatus.prototype.failed;
  /**
   * @return {?}
   */
  ProcessStatus.prototype.someFailed = function() {};
  /**
   * @return {?}
   */
  ProcessStatus.prototype.someSucceeded = function() {};
  /**
   * @return {?}
   */
  ProcessStatus.prototype.oneFailed = function() {};
  /**
   * @return {?}
   */
  ProcessStatus.prototype.oneSucceeded = function() {};
  /**
   * @return {?}
   */
  ProcessStatus.prototype.allSucceeded = function() {};
  /**
   * @return {?}
   */
  ProcessStatus.prototype.allFailed = function() {};
}
export class NodeDeleteDirective {
  /**
   * @param {?} alfrescoApiService
   * @param {?} translation
   * @param {?} elementRef
   */
  constructor(alfrescoApiService, translation, elementRef) {
    this.alfrescoApiService = alfrescoApiService;
    this.translation = translation;
    this.elementRef = elementRef;
    /**
     * If true then the nodes are deleted immediately rather than being put in the trash
     */
    this.permanent = false;
    /**
     * Emitted when the nodes have been deleted.
     */
    this.delete = new EventEmitter();
  }
  /**
   * @return {?}
   */
  onClick() {
    this.process(this.selection);
  }
  /**
   * @return {?}
   */
  ngOnChanges() {
    if (!this.selection || (this.selection && this.selection.length === 0)) {
      this.setDisableAttribute(true);
    } else {
      if (
        !this.elementRef.nativeElement.hasAttribute(
          'adf-check-allowable-operation'
        )
      ) {
        this.setDisableAttribute(false);
      }
    }
  }
  /**
   * @private
   * @param {?} disable
   * @return {?}
   */
  setDisableAttribute(disable) {
    this.elementRef.nativeElement.disabled = disable;
  }
  /**
   * @private
   * @param {?} selection
   * @return {?}
   */
  process(selection) {
    if (selection && selection.length) {
      /** @type {?} */
      const batch = this.getDeleteNodesBatch(selection);
      forkJoin(...batch).subscribe(
        /**
         * @param {?} data
         * @return {?}
         */
        data => {
          /** @type {?} */
          const processedItems = this.processStatus(data);
          /** @type {?} */
          const message = this.getMessage(processedItems);
          if (message) {
            this.delete.emit(message);
          }
        }
      );
    }
  }
  /**
   * @private
   * @param {?} selection
   * @return {?}
   */
  getDeleteNodesBatch(selection) {
    return selection.map(
      /**
       * @param {?} node
       * @return {?}
       */
      node => this.deleteNode(node)
    );
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  deleteNode(node) {
    /** @type {?} */
    const id = /** @type {?} */ (node.entry).nodeId || node.entry.id;
    /** @type {?} */
    let promise;
    if (node.entry.hasOwnProperty('archivedAt') && node.entry['archivedAt']) {
      promise = this.alfrescoApiService.nodesApi.purgeDeletedNode(id);
    } else {
      promise = this.alfrescoApiService.nodesApi.deleteNode(id, {
        permanent: this.permanent
      });
    }
    return from(promise).pipe(
      map(
        /**
         * @return {?}
         */
        () => ({
          entry: node.entry,
          status: 1
        })
      ),
      catchError(
        /**
         * @return {?}
         */
        () =>
          of({
            entry: node.entry,
            status: 0
          })
      )
    );
  }
  /**
   * @private
   * @param {?} data
   * @return {?}
   */
  processStatus(data) {
    /** @type {?} */
    const deleteStatus = {
      success: [],
      failed: [],
      /**
       * @return {?}
       */
      get someFailed() {
        return !!(this.failed.length);
      },
      /**
       * @return {?}
       */
      get someSucceeded() {
        return !!(this.success.length);
      },
      /**
       * @return {?}
       */
      get oneFailed() {
        return this.failed.length === 1;
      },
      /**
       * @return {?}
       */
      get oneSucceeded() {
        return this.success.length === 1;
      },
      /**
       * @return {?}
       */
      get allSucceeded() {
        return this.someSucceeded && !this.someFailed;
      },
      /**
       * @return {?}
       */
      get allFailed() {
        return this.someFailed && !this.someSucceeded;
      }
    };
    return data.reduce(
      /**
       * @param {?} acc
       * @param {?} next
       * @return {?}
       */
      (acc, next) => {
        if (next.status === 1) {
          acc.success.push(next);
        } else {
          acc.failed.push(next);
        }
        return acc;
      },
      deleteStatus
    );
  }
  /**
   * @private
   * @param {?} status
   * @return {?}
   */
  getMessage(status) {
    if (status.allFailed && !status.oneFailed) {
      return this.translation.instant('CORE.DELETE_NODE.ERROR_PLURAL', {
        number: status.failed.length
      });
    }
    if (status.allSucceeded && !status.oneSucceeded) {
      return this.translation.instant('CORE.DELETE_NODE.PLURAL', {
        number: status.success.length
      });
    }
    if (status.someFailed && status.someSucceeded && !status.oneSucceeded) {
      return this.translation.instant('CORE.DELETE_NODE.PARTIAL_PLURAL', {
        success: status.success.length,
        failed: status.failed.length
      });
    }
    if (status.someFailed && status.oneSucceeded) {
      return this.translation.instant('CORE.DELETE_NODE.PARTIAL_SINGULAR', {
        success: status.success.length,
        failed: status.failed.length
      });
    }
    if (status.oneFailed && !status.someSucceeded) {
      return this.translation.instant('CORE.DELETE_NODE.ERROR_SINGULAR', {
        name: status.failed[0].entry.name
      });
    }
    if (status.oneSucceeded && !status.someFailed) {
      return this.translation.instant('CORE.DELETE_NODE.SINGULAR', {
        name: status.success[0].entry.name
      });
    }
    return null;
  }
}
NodeDeleteDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: '[adf-delete]'
      }
    ]
  }
];
/** @nocollapse */
NodeDeleteDirective.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: TranslationService },
  { type: ElementRef }
];
NodeDeleteDirective.propDecorators = {
  selection: [{ type: Input, args: ['adf-delete'] }],
  permanent: [{ type: Input }],
  delete: [{ type: Output }],
  onClick: [{ type: HostListener, args: ['click'] }]
};
if (false) {
  /**
   * Array of nodes to delete.
   * @type {?}
   */
  NodeDeleteDirective.prototype.selection;
  /**
   * If true then the nodes are deleted immediately rather than being put in the trash
   * @type {?}
   */
  NodeDeleteDirective.prototype.permanent;
  /**
   * Emitted when the nodes have been deleted.
   * @type {?}
   */
  NodeDeleteDirective.prototype.delete;
  /**
   * @type {?}
   * @private
   */
  NodeDeleteDirective.prototype.alfrescoApiService;
  /**
   * @type {?}
   * @private
   */
  NodeDeleteDirective.prototype.translation;
  /**
   * @type {?}
   * @private
   */
  NodeDeleteDirective.prototype.elementRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1kZWxldGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZGlyZWN0aXZlcy9ub2RlLWRlbGV0ZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1RyxPQUFPLEVBQWMsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDckUsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUVqRCxnQ0FHQzs7O0lBRkcsa0NBQTBCOztJQUMxQixtQ0FBZTs7Ozs7QUFHbkIsNEJBZUM7OztJQWRHLGdDQUE2Qjs7SUFDN0IsK0JBQTRCOzs7O0lBRTVCLHFEQUFhOzs7O0lBRWIsd0RBQWdCOzs7O0lBRWhCLG9EQUFZOzs7O0lBRVosdURBQWU7Ozs7SUFFZix1REFBZTs7OztJQUVmLG9EQUFZOztBQU1oQixNQUFNLE9BQU8sbUJBQW1COzs7Ozs7SUFrQjVCLFlBQW9CLGtCQUFzQyxFQUN0QyxXQUErQixFQUMvQixVQUFzQjtRQUZ0Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUMvQixlQUFVLEdBQVYsVUFBVSxDQUFZOzs7O1FBYjFDLGNBQVMsR0FBWSxLQUFLLENBQUM7Ozs7UUFJM0IsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBVS9DLENBQUM7Ozs7SUFQRCxPQUFP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QUFJLE1BQU0sQ0FBQyxZQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO1lBQzNDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQzNCLDJCQUEyQixFQUMzQixFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FDekMsQ0FBQztTQUNMO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7O1lBNUtKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsY0FBYzthQUMzQjs7OztZQTVCUSxrQkFBa0I7WUFDbEIsa0JBQWtCO1lBSlAsVUFBVTs7O3dCQWtDekIsS0FBSyxTQUFDLFlBQVk7d0JBSWxCLEtBQUs7cUJBSUwsTUFBTTtzQkFHTixZQUFZLFNBQUMsT0FBTzs7Ozs7OztJQVhyQix3Q0FDNkM7Ozs7O0lBRzdDLHdDQUMyQjs7Ozs7SUFHM0IscUNBQytDOzs7OztJQU9uQyxpREFBOEM7Ozs7O0lBQzlDLDBDQUF1Qzs7Ozs7SUFDdkMseUNBQThCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyogdHNsaW50OmRpc2FibGU6bm8taW5wdXQtcmVuYW1lICAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5vZGVFbnRyeSwgTm9kZSwgRGVsZXRlZE5vZGVFbnRpdHksIERlbGV0ZWROb2RlIH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBmb3JrSm9pbiwgZnJvbSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEFsZnJlc2NvQXBpU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2FsZnJlc2NvLWFwaS5zZXJ2aWNlJztcbmltcG9ydCB7IFRyYW5zbGF0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3RyYW5zbGF0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgbWFwLCBjYXRjaEVycm9yIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbnRlcmZhY2UgUHJvY2Vzc2VkTm9kZURhdGEge1xuICAgIGVudHJ5OiBOb2RlIHwgRGVsZXRlZE5vZGU7XG4gICAgc3RhdHVzOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBQcm9jZXNzU3RhdHVzIHtcbiAgICBzdWNjZXNzOiBQcm9jZXNzZWROb2RlRGF0YVtdO1xuICAgIGZhaWxlZDogUHJvY2Vzc2VkTm9kZURhdGFbXTtcblxuICAgIHNvbWVGYWlsZWQoKTtcblxuICAgIHNvbWVTdWNjZWVkZWQoKTtcblxuICAgIG9uZUZhaWxlZCgpO1xuXG4gICAgb25lU3VjY2VlZGVkKCk7XG5cbiAgICBhbGxTdWNjZWVkZWQoKTtcblxuICAgIGFsbEZhaWxlZCgpO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1thZGYtZGVsZXRlXSdcbn0pXG5leHBvcnQgY2xhc3MgTm9kZURlbGV0ZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gICAgLyoqIEFycmF5IG9mIG5vZGVzIHRvIGRlbGV0ZS4gKi9cbiAgICBASW5wdXQoJ2FkZi1kZWxldGUnKVxuICAgIHNlbGVjdGlvbjogTm9kZUVudHJ5W10gfCBEZWxldGVkTm9kZUVudGl0eVtdO1xuXG4gICAgLyoqIElmIHRydWUgdGhlbiB0aGUgbm9kZXMgYXJlIGRlbGV0ZWQgaW1tZWRpYXRlbHkgcmF0aGVyIHRoYW4gYmVpbmcgcHV0IGluIHRoZSB0cmFzaCAqL1xuICAgIEBJbnB1dCgpXG4gICAgcGVybWFuZW50OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIHRoZSBub2RlcyBoYXZlIGJlZW4gZGVsZXRlZC4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBkZWxldGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxuICAgIG9uQ2xpY2soKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzcyh0aGlzLnNlbGVjdGlvbik7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhbGZyZXNjb0FwaVNlcnZpY2U6IEFsZnJlc2NvQXBpU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHRyYW5zbGF0aW9uOiBUcmFuc2xhdGlvblNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoKSB7XG4gICAgICAgIGlmICghdGhpcy5zZWxlY3Rpb24gfHwgKHRoaXMuc2VsZWN0aW9uICYmIHRoaXMuc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGlzYWJsZUF0dHJpYnV0ZSh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuaGFzQXR0cmlidXRlKCdhZGYtY2hlY2stYWxsb3dhYmxlLW9wZXJhdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREaXNhYmxlQXR0cmlidXRlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0RGlzYWJsZUF0dHJpYnV0ZShkaXNhYmxlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRpc2FibGVkID0gZGlzYWJsZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3Moc2VsZWN0aW9uOiBOb2RlRW50cnlbXSB8IERlbGV0ZWROb2RlRW50aXR5W10pIHtcbiAgICAgICAgaWYgKHNlbGVjdGlvbiAmJiBzZWxlY3Rpb24ubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGJhdGNoID0gdGhpcy5nZXREZWxldGVOb2Rlc0JhdGNoKHNlbGVjdGlvbik7XG5cbiAgICAgICAgICAgIGZvcmtKb2luKC4uLmJhdGNoKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGE6IFByb2Nlc3NlZE5vZGVEYXRhW10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvY2Vzc2VkSXRlbXM6IFByb2Nlc3NTdGF0dXMgPSB0aGlzLnByb2Nlc3NTdGF0dXMoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLmdldE1lc3NhZ2UocHJvY2Vzc2VkSXRlbXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZS5lbWl0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldERlbGV0ZU5vZGVzQmF0Y2goc2VsZWN0aW9uOiBhbnkpOiBPYnNlcnZhYmxlPFByb2Nlc3NlZE5vZGVEYXRhPltdIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbi5tYXAoKG5vZGUpID0+IHRoaXMuZGVsZXRlTm9kZShub2RlKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWxldGVOb2RlKG5vZGU6IE5vZGVFbnRyeSB8IERlbGV0ZWROb2RlRW50aXR5KTogT2JzZXJ2YWJsZTxQcm9jZXNzZWROb2RlRGF0YT4ge1xuICAgICAgICBjb25zdCBpZCA9ICg8YW55PiBub2RlLmVudHJ5KS5ub2RlSWQgfHwgbm9kZS5lbnRyeS5pZDtcblxuICAgICAgICBsZXQgcHJvbWlzZTogUHJvbWlzZTxhbnk+O1xuXG4gICAgICAgIGlmIChub2RlLmVudHJ5Lmhhc093blByb3BlcnR5KCdhcmNoaXZlZEF0JykgJiYgbm9kZS5lbnRyeVsnYXJjaGl2ZWRBdCddKSB7XG4gICAgICAgICAgICBwcm9taXNlID0gdGhpcy5hbGZyZXNjb0FwaVNlcnZpY2Uubm9kZXNBcGkucHVyZ2VEZWxldGVkTm9kZShpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9taXNlID0gdGhpcy5hbGZyZXNjb0FwaVNlcnZpY2Uubm9kZXNBcGkuZGVsZXRlTm9kZShpZCwgeyBwZXJtYW5lbnQ6IHRoaXMucGVybWFuZW50IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZyb20ocHJvbWlzZSkucGlwZShcbiAgICAgICAgICAgIG1hcCgoKSA9PiAoe1xuICAgICAgICAgICAgICAgIGVudHJ5OiBub2RlLmVudHJ5LFxuICAgICAgICAgICAgICAgIHN0YXR1czogMVxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoKSA9PiBvZih7XG4gICAgICAgICAgICAgICAgZW50cnk6IG5vZGUuZW50cnksXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAwXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3NTdGF0dXMoZGF0YSk6IFByb2Nlc3NTdGF0dXMge1xuICAgICAgICBjb25zdCBkZWxldGVTdGF0dXMgPSB7XG4gICAgICAgICAgICBzdWNjZXNzOiBbXSxcbiAgICAgICAgICAgIGZhaWxlZDogW10sXG4gICAgICAgICAgICBnZXQgc29tZUZhaWxlZCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISEodGhpcy5mYWlsZWQubGVuZ3RoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQgc29tZVN1Y2NlZWRlZCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISEodGhpcy5zdWNjZXNzLmxlbmd0aCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0IG9uZUZhaWxlZCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mYWlsZWQubGVuZ3RoID09PSAxO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldCBvbmVTdWNjZWVkZWQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3VjY2Vzcy5sZW5ndGggPT09IDE7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0IGFsbFN1Y2NlZWRlZCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zb21lU3VjY2VlZGVkICYmICF0aGlzLnNvbWVGYWlsZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0IGFsbEZhaWxlZCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zb21lRmFpbGVkICYmICF0aGlzLnNvbWVTdWNjZWVkZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKFxuICAgICAgICAgICAgKGFjYywgbmV4dCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0LnN0YXR1cyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBhY2Muc3VjY2Vzcy5wdXNoKG5leHQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFjYy5mYWlsZWQucHVzaChuZXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlbGV0ZVN0YXR1c1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TWVzc2FnZShzdGF0dXM6IFByb2Nlc3NTdGF0dXMpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgICAgaWYgKHN0YXR1cy5hbGxGYWlsZWQgJiYgIXN0YXR1cy5vbmVGYWlsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0aW9uLmluc3RhbnQoXG4gICAgICAgICAgICAgICAgJ0NPUkUuREVMRVRFX05PREUuRVJST1JfUExVUkFMJyxcbiAgICAgICAgICAgICAgICB7IG51bWJlcjogc3RhdHVzLmZhaWxlZC5sZW5ndGggfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0dXMuYWxsU3VjY2VlZGVkICYmICFzdGF0dXMub25lU3VjY2VlZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvbi5pbnN0YW50KFxuICAgICAgICAgICAgICAgICdDT1JFLkRFTEVURV9OT0RFLlBMVVJBTCcsXG4gICAgICAgICAgICAgICAgeyBudW1iZXI6IHN0YXR1cy5zdWNjZXNzLmxlbmd0aCB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXR1cy5zb21lRmFpbGVkICYmIHN0YXR1cy5zb21lU3VjY2VlZGVkICYmICFzdGF0dXMub25lU3VjY2VlZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvbi5pbnN0YW50KFxuICAgICAgICAgICAgICAgICdDT1JFLkRFTEVURV9OT0RFLlBBUlRJQUxfUExVUkFMJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHN0YXR1cy5zdWNjZXNzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgZmFpbGVkOiBzdGF0dXMuZmFpbGVkLmxlbmd0aFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdHVzLnNvbWVGYWlsZWQgJiYgc3RhdHVzLm9uZVN1Y2NlZWRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRpb24uaW5zdGFudChcbiAgICAgICAgICAgICAgICAnQ09SRS5ERUxFVEVfTk9ERS5QQVJUSUFMX1NJTkdVTEFSJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHN0YXR1cy5zdWNjZXNzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgZmFpbGVkOiBzdGF0dXMuZmFpbGVkLmxlbmd0aFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdHVzLm9uZUZhaWxlZCAmJiAhc3RhdHVzLnNvbWVTdWNjZWVkZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0aW9uLmluc3RhbnQoXG4gICAgICAgICAgICAgICAgJ0NPUkUuREVMRVRFX05PREUuRVJST1JfU0lOR1VMQVInLFxuICAgICAgICAgICAgICAgIHsgbmFtZTogc3RhdHVzLmZhaWxlZFswXS5lbnRyeS5uYW1lIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdHVzLm9uZVN1Y2NlZWRlZCAmJiAhc3RhdHVzLnNvbWVGYWlsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0aW9uLmluc3RhbnQoXG4gICAgICAgICAgICAgICAgJ0NPUkUuREVMRVRFX05PREUuU0lOR1VMQVInLFxuICAgICAgICAgICAgICAgIHsgbmFtZTogc3RhdHVzLnN1Y2Nlc3NbMF0uZW50cnkubmFtZSB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuIl19
