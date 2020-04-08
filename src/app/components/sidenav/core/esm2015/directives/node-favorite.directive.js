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
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { from, forkJoin, of } from 'rxjs';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { catchError, map } from 'rxjs/operators';
export class NodeFavoriteDirective {
  /**
   * @param {?} alfrescoApiService
   */
  constructor(alfrescoApiService) {
    this.alfrescoApiService = alfrescoApiService;
    this.favorites = [];
    /**
     * Array of nodes to toggle as favorites.
     */
    this.selection = [];
    /**
     * Emitted when the favorite setting is complete.
     */
    this.toggle = new EventEmitter();
    /**
     * Emitted when the favorite setting fails.
     */
    this.error = new EventEmitter();
  }
  /**
   * @return {?}
   */
  onClick() {
    this.toggleFavorite();
  }
  /**
   * @param {?} changes
   * @return {?}
   */
  ngOnChanges(changes) {
    if (!changes.selection.currentValue.length) {
      this.favorites = [];
      return;
    }
    this.markFavoritesNodes(changes.selection.currentValue);
  }
  /**
   * @return {?}
   */
  toggleFavorite() {
    if (!this.favorites.length) {
      return;
    }
    /** @type {?} */
    const every = this.favorites.every(
      /**
       * @param {?} selected
       * @return {?}
       */
      (selected => selected.entry.isFavorite)
    );
    if (every) {
      /** @type {?} */
      const batch = this.favorites.map(
        /**
         * @param {?} selected
         * @return {?}
         */
        (selected => {
          // shared files have nodeId
          /** @type {?} */
          const id =
            /** @type {?} */ (selected).entry.nodeId || selected.entry.id;
          return from(
            this.alfrescoApiService.favoritesApi.removeFavoriteSite('-me-', id)
          );
        })
      );
      forkJoin(batch).subscribe(
        /**
         * @return {?}
         */
        () => {
          this.favorites.map(
            /**
             * @param {?} selected
             * @return {?}
             */
            selected => (selected.entry.isFavorite = false)
          );
          this.toggle.emit();
        }
        /**
         * @param {?} error
         * @return {?}
         */,
        error => this.error.emit(error)
      );
    }
    if (!every) {
      /** @type {?} */
      const notFavorite = this.favorites.filter(
        /**
         * @param {?} node
         * @return {?}
         */
        (node => !node.entry.isFavorite)
      );
      /** @type {?} */
      const body = notFavorite.map(
        /**
         * @param {?} node
         * @return {?}
         */
        (node => this.createFavoriteBody(node))
      );
      from(
        this.alfrescoApiService.favoritesApi.addFavorite(
          '-me-',
          /** @type {?} */ (body)
        )
      ).subscribe(
        /**
         * @return {?}
         */
        () => {
          notFavorite.map(
            /**
             * @param {?} selected
             * @return {?}
             */
            selected => (selected.entry.isFavorite = true)
          );
          this.toggle.emit();
        }
        /**
         * @param {?} error
         * @return {?}
         */,
        error => this.error.emit(error)
      );
    }
  }
  /**
   * @param {?} selection
   * @return {?}
   */
  markFavoritesNodes(selection) {
    if (selection.length <= this.favorites.length) {
      /** @type {?} */
      const newFavorites = this.reduce(this.favorites, selection);
      this.favorites = newFavorites;
    }
    /** @type {?} */
    const result = this.diff(selection, this.favorites);
    /** @type {?} */
    const batch = this.getProcessBatch(result);
    forkJoin(batch).subscribe(
      /**
       * @param {?} data
       * @return {?}
       */
      data => {
        this.favorites.push(...data);
      }
    );
  }
  /**
   * @return {?}
   */
  hasFavorites() {
    if (this.favorites && !this.favorites.length) {
      return false;
    }
    return this.favorites.every(
      /**
       * @param {?} selected
       * @return {?}
       */
      selected => selected.entry.isFavorite
    );
  }
  /**
   * @private
   * @param {?} selection
   * @return {?}
   */
  getProcessBatch(selection) {
    return selection.map(
      /**
       * @param {?} selected
       * @return {?}
       */
      selected => this.getFavorite(selected)
    );
  }
  /**
   * @private
   * @param {?} selected
   * @return {?}
   */
  getFavorite(selected) {
    /** @type {?} */
    const node = selected.entry;
    // ACS 6.x with 'isFavorite' include
    if (node && node.hasOwnProperty('isFavorite')) {
      return of(selected);
    }
    // ACS 5.x and 6.x without 'isFavorite' include
    const { name, isFile, isFolder } = /** @type {?} */ (node);
    /** @type {?} */
    const id = /** @type {?} */ (node).nodeId || node.id;
    /** @type {?} */
    const promise = this.alfrescoApiService.favoritesApi.getFavorite(
      '-me-',
      id
    );
    return from(promise).pipe(
      map(
        /**
         * @return {?}
         */
        () => ({
          entry: {
            id,
            isFolder,
            isFile,
            name,
            isFavorite: true
          }
        })
      ),
      catchError(
        /**
         * @return {?}
         */
        () => {
          return of({
            entry: {
              id,
              isFolder,
              isFile,
              name,
              isFavorite: false
            }
          });
        }
      )
    );
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  createFavoriteBody(node) {
    /** @type {?} */
    const type = this.getNodeType(node);
    // shared files have nodeId
    /** @type {?} */
    const id = node.entry.nodeId || node.entry.id;
    return {
      target: {
        [type]: {
          guid: id
        }
      }
    };
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  getNodeType(node) {
    // shared could only be files
    if (!node.entry.isFile && !node.entry.isFolder) {
      return 'file';
    }
    return node.entry.isFile ? 'file' : 'folder';
  }
  /**
   * @private
   * @param {?} list
   * @param {?} patch
   * @return {?}
   */
  diff(list, patch) {
    /** @type {?} */
    const ids = patch.map(
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
      item => (ids.includes(item.entry.id) ? null : item)
    );
  }
  /**
   * @private
   * @param {?} patch
   * @param {?} comparator
   * @return {?}
   */
  reduce(patch, comparator) {
    /** @type {?} */
    const ids = comparator.map(
      /**
       * @param {?} item
       * @return {?}
       */
      (item => item.entry.id)
    );
    return patch.filter(
      /**
       * @param {?} item
       * @return {?}
       */
      item => (ids.includes(item.entry.id) ? item : null)
    );
  }
}
NodeFavoriteDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: '[adf-node-favorite]',
        exportAs: 'adfFavorite'
      }
    ]
  }
];
/** @nocollapse */
NodeFavoriteDirective.ctorParameters = () => [{ type: AlfrescoApiService }];
NodeFavoriteDirective.propDecorators = {
  selection: [{ type: Input, args: ['adf-node-favorite'] }],
  toggle: [{ type: Output }],
  error: [{ type: Output }],
  onClick: [{ type: HostListener, args: ['click'] }]
};
if (false) {
  /** @type {?} */
  NodeFavoriteDirective.prototype.favorites;
  /**
   * Array of nodes to toggle as favorites.
   * @type {?}
   */
  NodeFavoriteDirective.prototype.selection;
  /**
   * Emitted when the favorite setting is complete.
   * @type {?}
   */
  NodeFavoriteDirective.prototype.toggle;
  /**
   * Emitted when the favorite setting fails.
   * @type {?}
   */
  NodeFavoriteDirective.prototype.error;
  /**
   * @type {?}
   * @private
   */
  NodeFavoriteDirective.prototype.alfrescoApiService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1mYXZvcml0ZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkaXJlY3RpdmVzL25vZGUtZmF2b3JpdGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVoRyxPQUFPLEVBQWMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQU1qRCxNQUFNLE9BQU8scUJBQXFCOzs7O0lBa0I5QixZQUFvQixrQkFBc0M7UUFBdEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQWpCMUQsY0FBUyxHQUFVLEVBQUUsQ0FBQzs7OztRQUl0QixjQUFTLEdBQWdCLEVBQUUsQ0FBQzs7OztRQUdsQixXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7Ozs7UUFHL0MsVUFBSyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBUXhELENBQUM7Ozs7SUFMRCxPQUFPO1FBQ0gsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBS0QsV0FBVyxDQUFDLE9BQU87UUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBRXBCLE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lB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LElBQUksQ0FBQyxNQUFNOzs7O1FBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBQztJQUM1RSxDQUFDOzs7Ozs7O0lBRU8sTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVOztjQUN0QixHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUc7Ozs7UUFBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUM7UUFFbkQsT0FBTyxLQUFLLENBQUMsTUFBTTs7OztRQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDLENBQUM7SUFDN0UsQ0FBQzs7O1lBM0tKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUscUJBQXFCO2dCQUMvQixRQUFRLEVBQUUsYUFBYTthQUMxQjs7OztZQU5RLGtCQUFrQjs7O3dCQVd0QixLQUFLLFNBQUMsbUJBQW1CO3FCQUl6QixNQUFNO29CQUdOLE1BQU07c0JBRU4sWUFBWSxTQUFDLE9BQU87Ozs7SUFackIsMENBQXNCOzs7OztJQUd0QiwwQ0FDNEI7Ozs7O0lBRzVCLHVDQUF5RDs7Ozs7SUFHekQsc0NBQXdEOzs7OztJQU81QyxtREFBOEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1pbnB1dC1yZW5hbWUgICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkNoYW5nZXMsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRmF2b3JpdGVCb2R5LCBOb2RlRW50cnksIFNoYXJlZExpbmtFbnRyeSwgTm9kZSwgU2hhcmVkTGluayB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZnJvbSwgZm9ya0pvaW4sIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBBbGZyZXNjb0FwaVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9hbGZyZXNjby1hcGkuc2VydmljZSc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2FkZi1ub2RlLWZhdm9yaXRlXScsXG4gICAgZXhwb3J0QXM6ICdhZGZGYXZvcml0ZSdcbn0pXG5leHBvcnQgY2xhc3MgTm9kZUZhdm9yaXRlRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgICBmYXZvcml0ZXM6IGFueVtdID0gW107XG5cbiAgICAvKiogQXJyYXkgb2Ygbm9kZXMgdG8gdG9nZ2xlIGFzIGZhdm9yaXRlcy4gKi9cbiAgICBASW5wdXQoJ2FkZi1ub2RlLWZhdm9yaXRlJylcbiAgICBzZWxlY3Rpb246IE5vZGVFbnRyeVtdID0gW107XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIHRoZSBmYXZvcml0ZSBzZXR0aW5nIGlzIGNvbXBsZXRlLiAqL1xuICAgIEBPdXRwdXQoKSB0b2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgZmF2b3JpdGUgc2V0dGluZyBmYWlscy4gKi9cbiAgICBAT3V0cHV0KCkgZXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxuICAgIG9uQ2xpY2soKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlRmF2b3JpdGUoKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFsZnJlc2NvQXBpU2VydmljZTogQWxmcmVzY29BcGlTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xuICAgICAgICBpZiAoIWNoYW5nZXMuc2VsZWN0aW9uLmN1cnJlbnRWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuZmF2b3JpdGVzID0gW107XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWFya0Zhdm9yaXRlc05vZGVzKGNoYW5nZXMuc2VsZWN0aW9uLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlRmF2b3JpdGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5mYXZvcml0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBldmVyeSA9IHRoaXMuZmF2b3JpdGVzLmV2ZXJ5KChzZWxlY3RlZCkgPT4gc2VsZWN0ZWQuZW50cnkuaXNGYXZvcml0ZSk7XG5cbiAgICAgICAgaWYgKGV2ZXJ5KSB7XG4gICAgICAgICAgICBjb25zdCBiYXRjaCA9IHRoaXMuZmF2b3JpdGVzLm1hcCgoc2VsZWN0ZWQ6IE5vZGVFbnRyeSB8IFNoYXJlZExpbmtFbnRyeSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHNoYXJlZCBmaWxlcyBoYXZlIG5vZGVJZFxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gKDxTaGFyZWRMaW5rRW50cnk+IHNlbGVjdGVkKS5lbnRyeS5ub2RlSWQgfHwgc2VsZWN0ZWQuZW50cnkuaWQ7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFsZnJlc2NvQXBpU2VydmljZS5mYXZvcml0ZXNBcGkucmVtb3ZlRmF2b3JpdGVTaXRlKCctbWUtJywgaWQpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3JrSm9pbihiYXRjaCkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYXZvcml0ZXMubWFwKChzZWxlY3RlZCkgPT4gc2VsZWN0ZWQuZW50cnkuaXNGYXZvcml0ZSA9IGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGUuZW1pdCgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKGVycm9yKSA9PiB0aGlzLmVycm9yLmVtaXQoZXJyb3IpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFldmVyeSkge1xuICAgICAgICAgICAgY29uc3Qgbm90RmF2b3JpdGUgPSB0aGlzLmZhdm9yaXRlcy5maWx0ZXIoKG5vZGUpID0+ICFub2RlLmVudHJ5LmlzRmF2b3JpdGUpO1xuICAgICAgICAgICAgY29uc3QgYm9keTogRmF2b3JpdGVCb2R5W10gPSBub3RGYXZvcml0ZS5tYXAoKG5vZGUpID0+IHRoaXMuY3JlYXRlRmF2b3JpdGVCb2R5KG5vZGUpKTtcblxuICAgICAgICAgICAgZnJvbSh0aGlzLmFsZnJlc2NvQXBpU2VydmljZS5mYXZvcml0ZXNBcGkuYWRkRmF2b3JpdGUoJy1tZS0nLCA8YW55PiBib2R5KSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3RGYXZvcml0ZS5tYXAoKHNlbGVjdGVkKSA9PiBzZWxlY3RlZC5lbnRyeS5pc0Zhdm9yaXRlID0gdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZS5lbWl0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4gdGhpcy5lcnJvci5lbWl0KGVycm9yKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXJrRmF2b3JpdGVzTm9kZXMoc2VsZWN0aW9uOiBOb2RlRW50cnlbXSkge1xuICAgICAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA8PSB0aGlzLmZhdm9yaXRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0Zhdm9yaXRlcyA9IHRoaXMucmVkdWNlKHRoaXMuZmF2b3JpdGVzLCBzZWxlY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5mYXZvcml0ZXMgPSBuZXdGYXZvcml0ZXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmRpZmYoc2VsZWN0aW9uLCB0aGlzLmZhdm9yaXRlcyk7XG4gICAgICAgIGNvbnN0IGJhdGNoID0gdGhpcy5nZXRQcm9jZXNzQmF0Y2gocmVzdWx0KTtcblxuICAgICAgICBmb3JrSm9pbihiYXRjaCkuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZhdm9yaXRlcy5wdXNoKC4uLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBoYXNGYXZvcml0ZXMoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmZhdm9yaXRlcyAmJiAhdGhpcy5mYXZvcml0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5mYXZvcml0ZXMuZXZlcnkoKHNlbGVjdGVkKSA9PiBzZWxlY3RlZC5lbnRyeS5pc0Zhdm9yaXRlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFByb2Nlc3NCYXRjaChzZWxlY3Rpb24pOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rpb24ubWFwKChzZWxlY3RlZDogTm9kZUVudHJ5KSA9PiB0aGlzLmdldEZhdm9yaXRlKHNlbGVjdGVkKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGYXZvcml0ZShzZWxlY3RlZDogTm9kZUVudHJ5IHwgU2hhcmVkTGlua0VudHJ5KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgbm9kZTogTm9kZSB8IFNoYXJlZExpbmsgPSBzZWxlY3RlZC5lbnRyeTtcblxuICAgICAgICAvLyBBQ1MgNi54IHdpdGggJ2lzRmF2b3JpdGUnIGluY2x1ZGVcbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5oYXNPd25Qcm9wZXJ0eSgnaXNGYXZvcml0ZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gb2Yoc2VsZWN0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQUNTIDUueCBhbmQgNi54IHdpdGhvdXQgJ2lzRmF2b3JpdGUnIGluY2x1ZGVcbiAgICAgICAgY29uc3QgeyBuYW1lLCBpc0ZpbGUsIGlzRm9sZGVyIH0gPSA8Tm9kZT4gbm9kZTtcbiAgICAgICAgY29uc3QgaWQgPSAgKDxTaGFyZWRMaW5rPiBub2RlKS5ub2RlSWQgfHwgbm9kZS5pZDtcblxuICAgICAgICBjb25zdCBwcm9taXNlID0gdGhpcy5hbGZyZXNjb0FwaVNlcnZpY2UuZmF2b3JpdGVzQXBpLmdldEZhdm9yaXRlKCctbWUtJywgaWQpO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHByb21pc2UpLnBpcGUoXG4gICAgICAgICAgICBtYXAoKCkgPT4gKHtcbiAgICAgICAgICAgICAgICBlbnRyeToge1xuICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgICAgaXNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgIGlzRmlsZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgaXNGYXZvcml0ZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBvZih7XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNGaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRmF2b3JpdGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVGYXZvcml0ZUJvZHkobm9kZSk6IEZhdm9yaXRlQm9keSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmdldE5vZGVUeXBlKG5vZGUpO1xuICAgICAgICAvLyBzaGFyZWQgZmlsZXMgaGF2ZSBub2RlSWRcbiAgICAgICAgY29uc3QgaWQgPSBub2RlLmVudHJ5Lm5vZGVJZCB8fCBub2RlLmVudHJ5LmlkO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgICAgICBbdHlwZV06IHtcbiAgICAgICAgICAgICAgICAgICAgZ3VpZDogaWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROb2RlVHlwZShub2RlKTogc3RyaW5nIHtcbiAgICAgICAgLy8gc2hhcmVkIGNvdWxkIG9ubHkgYmUgZmlsZXNcbiAgICAgICAgaWYgKCFub2RlLmVudHJ5LmlzRmlsZSAmJiAhbm9kZS5lbnRyeS5pc0ZvbGRlcikge1xuICAgICAgICAgICAgcmV0dXJuICdmaWxlJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlLmVudHJ5LmlzRmlsZSA/ICdmaWxlJyA6ICdmb2xkZXInO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGlmZihsaXN0LCBwYXRjaCk6IGFueVtdIHtcbiAgICAgICAgY29uc3QgaWRzID0gcGF0Y2gubWFwKChpdGVtKSA9PiBpdGVtLmVudHJ5LmlkKTtcblxuICAgICAgICByZXR1cm4gbGlzdC5maWx0ZXIoKGl0ZW0pID0+IGlkcy5pbmNsdWRlcyhpdGVtLmVudHJ5LmlkKSA/IG51bGwgOiBpdGVtKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZHVjZShwYXRjaCwgY29tcGFyYXRvcik6IGFueVtdIHtcbiAgICAgICAgY29uc3QgaWRzID0gY29tcGFyYXRvci5tYXAoKGl0ZW0pID0+IGl0ZW0uZW50cnkuaWQpO1xuXG4gICAgICAgIHJldHVybiBwYXRjaC5maWx0ZXIoKGl0ZW0pID0+IGlkcy5pbmNsdWRlcyhpdGVtLmVudHJ5LmlkKSA/IGl0ZW0gOiBudWxsKTtcbiAgICB9XG59XG4iXX0=
