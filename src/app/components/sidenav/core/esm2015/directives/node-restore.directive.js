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
/* tslint:disable:component-selector no-input-rename */
import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { forkJoin, from, of } from 'rxjs';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { TranslationService } from '../services/translation.service';
import { tap, mergeMap, map, catchError } from 'rxjs/operators';
export class RestoreMessageModel {}
if (false) {
  /** @type {?} */
  RestoreMessageModel.prototype.message;
  /** @type {?} */
  RestoreMessageModel.prototype.path;
  /** @type {?} */
  RestoreMessageModel.prototype.action;
}
export class NodeRestoreDirective {
  /**
   * @param {?} alfrescoApiService
   * @param {?} translation
   */
  constructor(alfrescoApiService, translation) {
    this.alfrescoApiService = alfrescoApiService;
    this.translation = translation;
    /**
     * Emitted when restoration is complete.
     */
    this.restore = new EventEmitter();
    this.restoreProcessStatus = this.processStatus();
  }
  /**
   * @return {?}
   */
  onClick() {
    this.recover(this.selection);
  }
  /**
   * @private
   * @param {?} selection
   * @return {?}
   */
  recover(selection) {
    if (!selection.length) {
      return;
    }
    /** @type {?} */
    const nodesWithPath = this.getNodesWithPath(selection);
    if (selection.length && nodesWithPath.length) {
      this.restoreNodesBatch(nodesWithPath)
        .pipe(
          tap(
            /**
             * @param {?} restoredNodes
             * @return {?}
             */
            restoredNodes => {
              /** @type {?} */
              const status = this.processStatus(restoredNodes);
              this.restoreProcessStatus.fail.push(...status.fail);
              this.restoreProcessStatus.success.push(...status.success);
            }
          ),
          mergeMap(
            /**
             * @return {?}
             */
            () => this.getDeletedNodes()
          )
        )
        .subscribe(
          /**
           * @param {?} deletedNodesList
           * @return {?}
           */
          deletedNodesList => {
            const { entries: nodeList } = deletedNodesList.list;
            const { fail: restoreErrorNodes } = this.restoreProcessStatus;
            /** @type {?} */
            const selectedNodes = this.diff(
              restoreErrorNodes,
              selection,
              false
            );
            /** @type {?} */
            const remainingNodes = this.diff(selectedNodes, nodeList);
            if (!remainingNodes.length) {
              this.notification();
            } else {
              this.recover(remainingNodes);
            }
          }
        );
    } else {
      this.restoreProcessStatus.fail.push(...selection);
      this.notification();
      return;
    }
  }
  /**
   * @private
   * @param {?} batch
   * @return {?}
   */
  restoreNodesBatch(batch) {
    return forkJoin(
      batch.map(
        /**
         * @param {?} node
         * @return {?}
         */
        node => this.restoreNode(node)
      )
    );
  }
  /**
   * @private
   * @param {?} selection
   * @return {?}
   */
  getNodesWithPath(selection) {
    return selection.filter(
      /**
       * @param {?} node
       * @return {?}
       */
      node => node.entry.path
    );
  }
  /**
   * @private
   * @return {?}
   */
  getDeletedNodes() {
    /** @type {?} */
    const promise = this.alfrescoApiService
      .getInstance()
      .core.nodesApi.getDeletedNodes({ include: ['path'] });
    return from(promise);
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  restoreNode(node) {
    const { entry } = node;
    /** @type {?} */
    const promise = this.alfrescoApiService
      .getInstance()
      .nodes.restoreNode(entry.id);
    return from(promise).pipe(
      map(
        /**
         * @return {?}
         */
        () => ({
          status: 1,
          entry
        })
      ),
      catchError(
        /**
         * @param {?} error
         * @return {?}
         */
        error => {
          const { statusCode } = JSON.parse(error.message).error;
          return of({
            status: 0,
            statusCode,
            entry
          });
        }
      )
    );
  }
  /**
   * @private
   * @param {?} selection
   * @param {?} list
   * @param {?=} fromList
   * @return {?}
   */
  diff(selection, list, fromList = true) {
    /** @type {?} */
    const ids = selection.map(
      /**
       * @param {?} item
       * @return {?}
       */
      (item => item.entry.id)
    );
    return list.filter(
      /**
       * @param {?} item
       * @return {?}
       */
      item => {
        if (fromList) {
          return ids.includes(item.entry.id) ? item : null;
        } else {
          return !ids.includes(item.entry.id) ? item : null;
        }
      }
    );
  }
  /**
   * @private
   * @param {?=} data
   * @return {?}
   */
  processStatus(data = []) {
    /** @type {?} */
    const status = {
      fail: [],
      success: [],
      /**
       * @return {?}
       */
      get someFailed() {
        return !!(this.fail.length);
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
        return this.fail.length === 1;
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
      },
      /**
       * @return {?}
       */
      reset() {
        this.fail = [];
        this.success = [];
      }
    };
    return data.reduce(
      /**
       * @param {?} acc
       * @param {?} node
       * @return {?}
       */
      (acc, node) => {
        if (node.status) {
          acc.success.push(node);
        } else {
          acc.fail.push(node);
        }
        return acc;
      },
      status
    );
  }
  /**
   * @private
   * @return {?}
   */
  getRestoreMessage() {
    const { restoreProcessStatus: status } = this;
    if (status.someFailed && !status.oneFailed) {
      return this.translation.instant('CORE.RESTORE_NODE.PARTIAL_PLURAL', {
        number: status.fail.length
      });
    }
    if (status.oneFailed && status.fail[0].statusCode) {
      if (status.fail[0].statusCode === 409) {
        return this.translation.instant('CORE.RESTORE_NODE.NODE_EXISTS', {
          name: status.fail[0].entry.name
        });
      } else {
        return this.translation.instant('CORE.RESTORE_NODE.GENERIC', {
          name: status.fail[0].entry.name
        });
      }
    }
    if (status.oneFailed && !status.fail[0].statusCode) {
      return this.translation.instant('CORE.RESTORE_NODE.LOCATION_MISSING', {
        name: status.fail[0].entry.name
      });
    }
    if (status.allSucceeded && !status.oneSucceeded) {
      return this.translation.instant('CORE.RESTORE_NODE.PLURAL');
    }
    if (status.allSucceeded && status.oneSucceeded) {
      return this.translation.instant('CORE.RESTORE_NODE.SINGULAR', {
        name: status.success[0].entry.name
      });
    }
    return null;
  }
  /**
   * @private
   * @return {?}
   */
  notification() {
    /** @type {?} */
    const status = Object.assign({}, this.restoreProcessStatus);
    /** @type {?} */
    const message = this.getRestoreMessage();
    this.reset();
    /** @type {?} */
    const action =
      (status.oneSucceeded && !status.someFailed)
        ? this.translation.instant('CORE.RESTORE_NODE.VIEW')
        : '';
    /** @type {?} */
    let path;
    if (status.success && status.success.length > 0) {
      path = status.success[0].entry.path;
    }
    this.restore.emit({
      message: message,
      action: action,
      path: path
    });
  }
  /**
   * @private
   * @return {?}
   */
  reset() {
    this.restoreProcessStatus.reset();
    this.selection = [];
  }
}
NodeRestoreDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: '[adf-restore]'
      }
    ]
  }
];
/** @nocollapse */
NodeRestoreDirective.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: TranslationService }
];
NodeRestoreDirective.propDecorators = {
  selection: [{ type: Input, args: ['adf-restore'] }],
  restore: [{ type: Output }],
  onClick: [{ type: HostListener, args: ['click'] }]
};
if (false) {
  /**
   * @type {?}
   * @private
   */
  NodeRestoreDirective.prototype.restoreProcessStatus;
  /**
   * Array of deleted nodes to restore.
   * @type {?}
   */
  NodeRestoreDirective.prototype.selection;
  /**
   * Emitted when restoration is complete.
   * @type {?}
   */
  NodeRestoreDirective.prototype.restore;
  /**
   * @type {?}
   * @private
   */
  NodeRestoreDirective.prototype.alfrescoApiService;
  /**
   * @type {?}
   * @private
   */
  NodeRestoreDirective.prototype.translation;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1yZXN0b3JlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvbm9kZS1yZXN0b3JlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckYsT0FBTyxFQUFjLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVoRSxNQUFNLE9BQU8sbUJBQW1CO0NBSS9COzs7SUFIRyxzQ0FBZ0I7O0lBQ2hCLG1DQUFxQjs7SUFDckIscUNBQWU7O0FBTW5CLE1BQU0sT0FBTyxvQkFBb0I7Ozs7O0lBZ0I3QixZQUFvQixrQkFBc0MsRUFDdEMsV0FBK0I7UUFEL0IsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7Ozs7UUFSbkQsWUFBTyxHQUFzQyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBUzVELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDckQsQ0FBQzs7OztJQVBELE9BQU87UUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqQyxDQUFDOzs7Ozs7SUFPTyxPQUFPLENBQUMsU0FBYztRQUMxQixJQUFJLENBQUMsU0FB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UyxHQUFHLEVBQUUsQ0FBQztJQUN4QixDQUFDOzs7WUFyT0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxlQUFlO2FBQzVCOzs7O1lBWlEsa0JBQWtCO1lBQ2xCLGtCQUFrQjs7O3dCQWdCdEIsS0FBSyxTQUFDLGFBQWE7c0JBSW5CLE1BQU07c0JBR04sWUFBWSxTQUFDLE9BQU87Ozs7Ozs7SUFWckIsb0RBQXNDOzs7OztJQUd0Qyx5Q0FDOEI7Ozs7O0lBRzlCLHVDQUNnRTs7Ozs7SUFPcEQsa0RBQThDOzs7OztJQUM5QywyQ0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTpjb21wb25lbnQtc2VsZWN0b3Igbm8taW5wdXQtcmVuYW1lICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERlbGV0ZWROb2RlRW50cnksIERlbGV0ZWROb2Rlc1BhZ2luZywgUGF0aEluZm9FbnRpdHkgfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcbmltcG9ydCB7IE9ic2VydmFibGUsIGZvcmtKb2luLCBmcm9tLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQWxmcmVzY29BcGlTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvYWxmcmVzY28tYXBpLnNlcnZpY2UnO1xuaW1wb3J0IHsgVHJhbnNsYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvdHJhbnNsYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyB0YXAsIG1lcmdlTWFwLCBtYXAsIGNhdGNoRXJyb3IgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBjbGFzcyBSZXN0b3JlTWVzc2FnZU1vZGVsIHtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgcGF0aDogUGF0aEluZm9FbnRpdHk7XG4gICAgYWN0aW9uOiBzdHJpbmc7XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2FkZi1yZXN0b3JlXSdcbn0pXG5leHBvcnQgY2xhc3MgTm9kZVJlc3RvcmVEaXJlY3RpdmUge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVzdG9yZVByb2Nlc3NTdGF0dXM7XG5cbiAgICAvKiogQXJyYXkgb2YgZGVsZXRlZCBub2RlcyB0byByZXN0b3JlLiAqL1xuICAgIEBJbnB1dCgnYWRmLXJlc3RvcmUnKVxuICAgIHNlbGVjdGlvbjogRGVsZXRlZE5vZGVFbnRyeVtdO1xuXG4gICAgLyoqIEVtaXR0ZWQgd2hlbiByZXN0b3JhdGlvbiBpcyBjb21wbGV0ZS4gKi9cbiAgICBAT3V0cHV0KClcbiAgICByZXN0b3JlOiBFdmVudEVtaXR0ZXI8UmVzdG9yZU1lc3NhZ2VNb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gICAgb25DbGljaygpIHtcbiAgICAgICAgdGhpcy5yZWNvdmVyKHRoaXMuc2VsZWN0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFsZnJlc2NvQXBpU2VydmljZTogQWxmcmVzY29BcGlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgdHJhbnNsYXRpb246IFRyYW5zbGF0aW9uU2VydmljZSkge1xuICAgICAgICB0aGlzLnJlc3RvcmVQcm9jZXNzU3RhdHVzID0gdGhpcy5wcm9jZXNzU3RhdHVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWNvdmVyKHNlbGVjdGlvbjogYW55KSB7XG4gICAgICAgIGlmICghc2VsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgbm9kZXNXaXRoUGF0aCA9IHRoaXMuZ2V0Tm9kZXNXaXRoUGF0aChzZWxlY3Rpb24pO1xuXG4gICAgICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoICYmIG5vZGVzV2l0aFBhdGgubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIHRoaXMucmVzdG9yZU5vZGVzQmF0Y2gobm9kZXNXaXRoUGF0aCkucGlwZShcbiAgICAgICAgICAgICAgICB0YXAoKHJlc3RvcmVkTm9kZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzID0gdGhpcy5wcm9jZXNzU3RhdHVzKHJlc3RvcmVkTm9kZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZVByb2Nlc3NTdGF0dXMuZmFpbC5wdXNoKC4uLnN0YXR1cy5mYWlsKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlUHJvY2Vzc1N0YXR1cy5zdWNjZXNzLnB1c2goLi4uc3RhdHVzLnN1Y2Nlc3MpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lcmdlTWFwKCgpID0+IHRoaXMuZ2V0RGVsZXRlZE5vZGVzKCkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChkZWxldGVkTm9kZXNMaXN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBlbnRyaWVzOiBub2RlTGlzdCB9ID0gZGVsZXRlZE5vZGVzTGlzdC5saXN0O1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZmFpbDogcmVzdG9yZUVycm9yTm9kZXMgfSA9IHRoaXMucmVzdG9yZVByb2Nlc3NTdGF0dXM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZGlmZihyZXN0b3JlRXJyb3JOb2Rlcywgc2VsZWN0aW9uLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVtYWluaW5nTm9kZXMgPSB0aGlzLmRpZmYoc2VsZWN0ZWROb2Rlcywgbm9kZUxpc3QpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFyZW1haW5pbmdOb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb24oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY292ZXIocmVtYWluaW5nTm9kZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlUHJvY2Vzc1N0YXR1cy5mYWlsLnB1c2goLi4uc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9uKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc3RvcmVOb2Rlc0JhdGNoKGJhdGNoOiBEZWxldGVkTm9kZUVudHJ5W10pOiBPYnNlcnZhYmxlPERlbGV0ZWROb2RlRW50cnlbXT4ge1xuICAgICAgICByZXR1cm4gZm9ya0pvaW4oYmF0Y2gubWFwKChub2RlKSA9PiB0aGlzLnJlc3RvcmVOb2RlKG5vZGUpKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROb2Rlc1dpdGhQYXRoKHNlbGVjdGlvbik6IERlbGV0ZWROb2RlRW50cnlbXSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rpb24uZmlsdGVyKChub2RlKSA9PiBub2RlLmVudHJ5LnBhdGgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RGVsZXRlZE5vZGVzKCk6IE9ic2VydmFibGU8RGVsZXRlZE5vZGVzUGFnaW5nPiB7XG4gICAgICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLmFsZnJlc2NvQXBpU2VydmljZS5nZXRJbnN0YW5jZSgpXG4gICAgICAgICAgICAuY29yZS5ub2Rlc0FwaS5nZXREZWxldGVkTm9kZXMoeyBpbmNsdWRlOiBbJ3BhdGgnXSB9KTtcblxuICAgICAgICByZXR1cm4gZnJvbShwcm9taXNlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc3RvcmVOb2RlKG5vZGUpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICBjb25zdCB7IGVudHJ5IH0gPSBub2RlO1xuXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLmFsZnJlc2NvQXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLm5vZGVzLnJlc3RvcmVOb2RlKGVudHJ5LmlkKTtcblxuICAgICAgICByZXR1cm4gZnJvbShwcm9taXNlKS5waXBlKFxuICAgICAgICAgICAgbWFwKCgpID0+ICh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAxLFxuICAgICAgICAgICAgICAgIGVudHJ5XG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzQ29kZSB9ID0gKEpTT04ucGFyc2UoZXJyb3IubWVzc2FnZSkpLmVycm9yO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAwLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNDb2RlLFxuICAgICAgICAgICAgICAgICAgICBlbnRyeVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRpZmYoc2VsZWN0aW9uLCBsaXN0LCBmcm9tTGlzdCA9IHRydWUpOiBhbnkge1xuICAgICAgICBjb25zdCBpZHMgPSBzZWxlY3Rpb24ubWFwKChpdGVtKSA9PiBpdGVtLmVudHJ5LmlkKTtcblxuICAgICAgICByZXR1cm4gbGlzdC5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChmcm9tTGlzdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpZHMuaW5jbHVkZXMoaXRlbS5lbnRyeS5pZCkgPyBpdGVtIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFpZHMuaW5jbHVkZXMoaXRlbS5lbnRyeS5pZCkgPyBpdGVtIDogbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcm9jZXNzU3RhdHVzKGRhdGEgPSBbXSk6IGFueSB7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHtcbiAgICAgICAgICAgIGZhaWw6IFtdLFxuICAgICAgICAgICAgc3VjY2VzczogW10sXG4gICAgICAgICAgICBnZXQgc29tZUZhaWxlZCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISEodGhpcy5mYWlsLmxlbmd0aCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0IHNvbWVTdWNjZWVkZWQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKHRoaXMuc3VjY2Vzcy5sZW5ndGgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldCBvbmVGYWlsZWQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmFpbC5sZW5ndGggPT09IDE7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0IG9uZVN1Y2NlZWRlZCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdWNjZXNzLmxlbmd0aCA9PT0gMTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQgYWxsU3VjY2VlZGVkKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNvbWVTdWNjZWVkZWQgJiYgIXRoaXMuc29tZUZhaWxlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQgYWxsRmFpbGVkKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNvbWVGYWlsZWQgJiYgIXRoaXMuc29tZVN1Y2NlZWRlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNldCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZhaWwgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLnN1Y2Nlc3MgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXG4gICAgICAgICAgICAoYWNjLCBub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjYy5zdWNjZXNzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjLmZhaWwucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0YXR1c1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UmVzdG9yZU1lc3NhZ2UoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHsgcmVzdG9yZVByb2Nlc3NTdGF0dXM6IHN0YXR1cyB9ID0gdGhpcztcblxuICAgICAgICBpZiAoc3RhdHVzLnNvbWVGYWlsZWQgJiYgIXN0YXR1cy5vbmVGYWlsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0aW9uLmluc3RhbnQoXG4gICAgICAgICAgICAgICAgJ0NPUkUuUkVTVE9SRV9OT0RFLlBBUlRJQUxfUExVUkFMJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlcjogc3RhdHVzLmZhaWwubGVuZ3RoXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0dXMub25lRmFpbGVkICYmIHN0YXR1cy5mYWlsWzBdLnN0YXR1c0NvZGUpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMuZmFpbFswXS5zdGF0dXNDb2RlID09PSA0MDkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvbi5pbnN0YW50KFxuICAgICAgICAgICAgICAgICAgICAnQ09SRS5SRVNUT1JFX05PREUuTk9ERV9FWElTVFMnLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdGF0dXMuZmFpbFswXS5lbnRyeS5uYW1lXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvbi5pbnN0YW50KFxuICAgICAgICAgICAgICAgICAgICAnQ09SRS5SRVNUT1JFX05PREUuR0VORVJJQycsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHN0YXR1cy5mYWlsWzBdLmVudHJ5Lm5hbWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdHVzLm9uZUZhaWxlZCAmJiAhc3RhdHVzLmZhaWxbMF0uc3RhdHVzQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRpb24uaW5zdGFudChcbiAgICAgICAgICAgICAgICAnQ09SRS5SRVNUT1JFX05PREUuTE9DQVRJT05fTUlTU0lORycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdGF0dXMuZmFpbFswXS5lbnRyeS5uYW1lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0dXMuYWxsU3VjY2VlZGVkICYmICFzdGF0dXMub25lU3VjY2VlZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvbi5pbnN0YW50KCdDT1JFLlJFU1RPUkVfTk9ERS5QTFVSQUwnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0dXMuYWxsU3VjY2VlZGVkICYmIHN0YXR1cy5vbmVTdWNjZWVkZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0aW9uLmluc3RhbnQoXG4gICAgICAgICAgICAgICAgJ0NPUkUuUkVTVE9SRV9OT0RFLlNJTkdVTEFSJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHN0YXR1cy5zdWNjZXNzWzBdLmVudHJ5Lm5hbWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3RpZmljYXRpb24oKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucmVzdG9yZVByb2Nlc3NTdGF0dXMpO1xuXG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLmdldFJlc3RvcmVNZXNzYWdlKCk7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcblxuICAgICAgICBjb25zdCBhY3Rpb24gPSAoc3RhdHVzLm9uZVN1Y2NlZWRlZCAmJiAhc3RhdHVzLnNvbWVGYWlsZWQpID8gdGhpcy50cmFuc2xhdGlvbi5pbnN0YW50KCdDT1JFLlJFU1RPUkVfTk9ERS5WSUVXJykgOiAnJztcblxuICAgICAgICBsZXQgcGF0aDtcbiAgICAgICAgaWYgKHN0YXR1cy5zdWNjZXNzICYmIHN0YXR1cy5zdWNjZXNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBhdGggPSBzdGF0dXMuc3VjY2Vzc1swXS5lbnRyeS5wYXRoO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzdG9yZS5lbWl0KHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICAgIHBhdGg6IHBhdGhcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZXN0b3JlUHJvY2Vzc1N0YXR1cy5yZXNldCgpO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbiA9IFtdO1xuICAgIH1cbn1cbiJdfQ==
