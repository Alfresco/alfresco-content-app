/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/* tslint:disable:adf-license-banner  */
/* Copyright 2012 Mozilla Foundation
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
import { Injectable } from '@angular/core';
/**
 *
 * RenderingQueueServices rendering of the views for pages and thumbnails.
 *
 */
export class RenderingQueueServices {
  constructor() {
    this.renderingStates = {
      INITIAL: 0,
      RUNNING: 1,
      PAUSED: 2,
      FINISHED: 3
    };
    this.CLEANUP_TIMEOUT = 30000;
    this.pdfViewer = null;
    this.pdfThumbnailViewer = null;
    this.onIdle = null;
    this.highestPriorityPage = null;
    this.idleTimeout = null;
    this.printing = false;
    this.isThumbnailViewEnabled = false;
  }
  /**
   * @param {?} pdfViewer
   * @return {?}
   */
  setViewer(pdfViewer) {
    this.pdfViewer = pdfViewer;
  }
  /**
   * @param {?} pdfThumbnailViewer
   * @return {?}
   */
  setThumbnailViewer(pdfThumbnailViewer) {
    this.pdfThumbnailViewer = pdfThumbnailViewer;
  }
  /**
   * @param {?} view
   * @return {?}
   */
  isHighestPriority(view) {
    return this.highestPriorityPage === view.renderingId;
  }
  /**
   * @param {?} currentlyVisiblePages
   * @return {?}
   */
  renderHighestPriority(currentlyVisiblePages) {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
    // Pages have a higher priority than thumbnails, so check them first.
    if (this.pdfViewer.forceRendering(currentlyVisiblePages)) {
      return;
    }
    // No pages needed rendering so check thumbnails.
    if (this.pdfThumbnailViewer && this.isThumbnailViewEnabled) {
      if (this.pdfThumbnailViewer.forceRendering()) {
        return;
      }
    }
    if (this.printing) {
      // If printing is currently ongoing do not reschedule cleanup.
      return;
    }
    if (this.onIdle) {
      this.idleTimeout = setTimeout(
        this.onIdle.bind(this),
        this.CLEANUP_TIMEOUT
      );
    }
  }
  /**
   * @param {?} visible
   * @param {?} views
   * @param {?} scrolledDown
   * @return {?}
   */
  getHighestPriority(visible, views, scrolledDown) {
    // The state has changed figure out which page has the highest priority to
    // render next (if any).
    // Priority:
    // 1 visible pages
    // 2 if last scrolled down page after the visible pages
    // 2 if last scrolled up page before the visible pages
    /** @type {?} */
    const visibleViews = visible.views;
    /** @type {?} */
    const numVisible = visibleViews.length;
    if (numVisible === 0) {
      return false;
    }
    for (let i = 0; i < numVisible; ++i) {
      /** @type {?} */
      const view = visibleViews[i].view;
      if (!this.isViewFinished(view)) {
        return view;
      }
    }
    // All the visible views have rendered, try to render next/previous pages.
    if (scrolledDown) {
      /** @type {?} */
      const nextPageIndex = visible.last.id;
      // ID's start at 1 so no need to add 1.
      if (views[nextPageIndex] && !this.isViewFinished(views[nextPageIndex])) {
        return views[nextPageIndex];
      }
    } else {
      /** @type {?} */
      const previousPageIndex = visible.first.id - 2;
      if (
        views[previousPageIndex] &&
        !this.isViewFinished(views[previousPageIndex])
      ) {
        return views[previousPageIndex];
      }
    }
    // Everything that needs to be rendered has been.
    return null;
  }
  /**
   * @param {?} view
   * @return {?}
   */
  isViewFinished(view) {
    return view.renderingState === this.renderingStates.FINISHED;
  }
  /**
   * Render a page or thumbnail view. This calls the appropriate function
   * based on the views state. If the view is already rendered it will return
   * false.
   * @param {?} view
   * @return {?}
   */
  renderView(view) {
    /** @type {?} */
    const state = view.renderingState;
    switch (state) {
      case this.renderingStates.FINISHED:
        return false;
      case this.renderingStates.PAUSED:
        this.highestPriorityPage = view.renderingId;
        view.resume();
        break;
      case this.renderingStates.RUNNING:
        this.highestPriorityPage = view.renderingId;
        break;
      case this.renderingStates.INITIAL:
        this.highestPriorityPage = view.renderingId;
        /** @type {?} */
        const continueRendering = /**
         * @return {?}
         */
        (function() {
          this.renderHighestPriority();
        }).bind(this);
        view.draw().then(continueRendering, continueRendering);
        break;
      default:
        break;
    }
    return true;
  }
}
RenderingQueueServices.decorators = [{ type: Injectable }];
if (false) {
  /** @type {?} */
  RenderingQueueServices.prototype.renderingStates;
  /** @type {?} */
  RenderingQueueServices.prototype.CLEANUP_TIMEOUT;
  /** @type {?} */
  RenderingQueueServices.prototype.pdfViewer;
  /** @type {?} */
  RenderingQueueServices.prototype.pdfThumbnailViewer;
  /** @type {?} */
  RenderingQueueServices.prototype.onIdle;
  /** @type {?} */
  RenderingQueueServices.prototype.highestPriorityPage;
  /** @type {?} */
  RenderingQueueServices.prototype.idleTimeout;
  /** @type {?} */
  RenderingQueueServices.prototype.printing;
  /** @type {?} */
  RenderingQueueServices.prototype.isThumbnailViewEnabled;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyaW5nLXF1ZXVlLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsidmlld2VyL3NlcnZpY2VzL3JlbmRlcmluZy1xdWV1ZS5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQVEzQyxNQUFNLE9BQU8sc0JBQXNCO0lBRG5DO1FBR0ksb0JBQWUsR0FBRztZQUNkLE9BQU8sRUFBRSxDQUFDO1lBQ1YsT0FBTyxFQUFFLENBQUM7WUFDVixNQUFNLEVBQUUsQ0FBQztZQUNULFFBQVEsRUFBRSxDQUFDO1NBQ2QsQ0FBQztRQUVGLG9CQUFlLEdBQVcsS0FBSyxDQUFDO1FBRWhDLGNBQVMsR0FBUSxJQUFJLENBQUM7UUFDdEIsdUJBQWtCLEdBQVEsSUFBSSxDQUFDO1FBQy9CLFdBQU0sR0FBUSxJQUFJLENBQUM7UUFFbkIsd0JBQW1CLEdBQVEsSUFBSSxDQUFDO1FBQ2hDLGdCQUFXLEdBQVEsSUFBSSxDQUFDO1FBQ3hCLGFBQVEsR0FBUSxLQUFLLENBQUM7UUFDdEIsMkJBQXNCLEdBQVEsS0FBSyxDQUFDO0lBNEh4QyxDQUFDOzs7OztJQXZIRyxTQUFTLENBQUMsU0FBUztRQUNmLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7Ozs7O0lBS0Qsa0JBQWtCLENBQUMsa0JBQWtCO1FBQ2pDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztJQUNqRCxDQUFDOzs7OztJQUtELGlCQUFpQixDQUFDLElBQVM7UUFDdkIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLEtBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUN6RCxDQUFDOzs7OztJQUVELHFCQUFxQixDQUFDLHFCQUFxQjtRQUN2QyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFD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VyxDQUFDO2dCQUM1QyxNQUFNO1lBQ1YsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU87Z0JBQzdCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDOztzQkFDdEMsaUJBQWlCLEdBQUc7OztnQkFBQTtvQkFDdEIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0JBQ2pDLENBQUMsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNaLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztnQkFDdkQsTUFBTTtZQUNWO2dCQUNJLE1BQU07U0FDYjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7OztZQTlJSixVQUFVOzs7O0lBR1AsaURBS0U7O0lBRUYsaURBQWdDOztJQUVoQywyQ0FBc0I7O0lBQ3RCLG9EQUErQjs7SUFDL0Isd0NBQW1COztJQUVuQixxREFBZ0M7O0lBQ2hDLDZDQUF3Qjs7SUFDeEIsMENBQXNCOztJQUN0Qix3REFBb0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTphZGYtbGljZW5zZS1iYW5uZXIgICovXG5cbi8qIENvcHlyaWdodCAyMDEyIE1vemlsbGEgRm91bmRhdGlvblxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICpcbiAqIFJlbmRlcmluZ1F1ZXVlU2VydmljZXMgcmVuZGVyaW5nIG9mIHRoZSB2aWV3cyBmb3IgcGFnZXMgYW5kIHRodW1ibmFpbHMuXG4gKlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVuZGVyaW5nUXVldWVTZXJ2aWNlcyB7XG5cbiAgICByZW5kZXJpbmdTdGF0ZXMgPSB7XG4gICAgICAgIElOSVRJQUw6IDAsXG4gICAgICAgIFJVTk5JTkc6IDEsXG4gICAgICAgIFBBVVNFRDogMixcbiAgICAgICAgRklOSVNIRUQ6IDNcbiAgICB9O1xuXG4gICAgQ0xFQU5VUF9USU1FT1VUOiBudW1iZXIgPSAzMDAwMDtcblxuICAgIHBkZlZpZXdlcjogYW55ID0gbnVsbDtcbiAgICBwZGZUaHVtYm5haWxWaWV3ZXI6IGFueSA9IG51bGw7XG4gICAgb25JZGxlOiBhbnkgPSBudWxsO1xuXG4gICAgaGlnaGVzdFByaW9yaXR5UGFnZTogYW55ID0gbnVsbDtcbiAgICBpZGxlVGltZW91dDogYW55ID0gbnVsbDtcbiAgICBwcmludGluZzogYW55ID0gZmFsc2U7XG4gICAgaXNUaHVtYm5haWxWaWV3RW5hYmxlZDogYW55ID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcGRmVmlld2VyXG4gICAgICovXG4gICAgc2V0Vmlld2VyKHBkZlZpZXdlcikge1xuICAgICAgICB0aGlzLnBkZlZpZXdlciA9IHBkZlZpZXdlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcGRmVGh1bWJuYWlsVmlld2VyXG4gICAgICovXG4gICAgc2V0VGh1bWJuYWlsVmlld2VyKHBkZlRodW1ibmFpbFZpZXdlcikge1xuICAgICAgICB0aGlzLnBkZlRodW1ibmFpbFZpZXdlciA9IHBkZlRodW1ibmFpbFZpZXdlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHZpZXdcbiAgICAgKi9cbiAgICBpc0hpZ2hlc3RQcmlvcml0eSh2aWV3OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlnaGVzdFByaW9yaXR5UGFnZSA9PT0gdmlldy5yZW5kZXJpbmdJZDtcbiAgICB9XG5cbiAgICByZW5kZXJIaWdoZXN0UHJpb3JpdHkoY3VycmVudGx5VmlzaWJsZVBhZ2VzKSB7XG4gICAgICAgIGlmICh0aGlzLmlkbGVUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5pZGxlVGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLmlkbGVUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBhZ2VzIGhhdmUgYSBoaWdoZXIgcHJpb3JpdHkgdGhhbiB0aHVtYm5haWxzLCBzbyBjaGVjayB0aGVtIGZpcnN0LlxuICAgICAgICBpZiAodGhpcy5wZGZWaWV3ZXIuZm9yY2VSZW5kZXJpbmcoY3VycmVudGx5VmlzaWJsZVBhZ2VzKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vIHBhZ2VzIG5lZWRlZCByZW5kZXJpbmcgc28gY2hlY2sgdGh1bWJuYWlscy5cbiAgICAgICAgaWYgKHRoaXMucGRmVGh1bWJuYWlsVmlld2VyICYmIHRoaXMuaXNUaHVtYm5haWxWaWV3RW5hYmxlZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGRmVGh1bWJuYWlsVmlld2VyLmZvcmNlUmVuZGVyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmludGluZykge1xuICAgICAgICAgICAgLy8gSWYgcHJpbnRpbmcgaXMgY3VycmVudGx5IG9uZ29pbmcgZG8gbm90IHJlc2NoZWR1bGUgY2xlYW51cC5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9uSWRsZSkge1xuICAgICAgICAgICAgdGhpcy5pZGxlVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy5vbklkbGUuYmluZCh0aGlzKSwgdGhpcy5DTEVBTlVQX1RJTUVPVVQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGlnaGVzdFByaW9yaXR5KHZpc2libGUsIHZpZXdzLCBzY3JvbGxlZERvd24pIHtcbiAgICAgICAgLy8gVGhlIHN0YXRlIGhhcyBjaGFuZ2VkIGZpZ3VyZSBvdXQgd2hpY2ggcGFnZSBoYXMgdGhlIGhpZ2hlc3QgcHJpb3JpdHkgdG9cbiAgICAgICAgLy8gcmVuZGVyIG5leHQgKGlmIGFueSkuXG4gICAgICAgIC8vIFByaW9yaXR5OlxuICAgICAgICAvLyAxIHZpc2libGUgcGFnZXNcbiAgICAgICAgLy8gMiBpZiBsYXN0IHNjcm9sbGVkIGRvd24gcGFnZSBhZnRlciB0aGUgdmlzaWJsZSBwYWdlc1xuICAgICAgICAvLyAyIGlmIGxhc3Qgc2Nyb2xsZWQgdXAgcGFnZSBiZWZvcmUgdGhlIHZpc2libGUgcGFnZXNcbiAgICAgICAgY29uc3QgdmlzaWJsZVZpZXdzID0gdmlzaWJsZS52aWV3cztcblxuICAgICAgICBjb25zdCBudW1WaXNpYmxlID0gdmlzaWJsZVZpZXdzLmxlbmd0aDtcbiAgICAgICAgaWYgKG51bVZpc2libGUgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVZpc2libGU7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdmlldyA9IHZpc2libGVWaWV3c1tpXS52aWV3O1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVmlld0ZpbmlzaGVkKHZpZXcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbGwgdGhlIHZpc2libGUgdmlld3MgaGF2ZSByZW5kZXJlZCwgdHJ5IHRvIHJlbmRlciBuZXh0L3ByZXZpb3VzIHBhZ2VzLlxuICAgICAgICBpZiAoc2Nyb2xsZWREb3duKSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0UGFnZUluZGV4ID0gdmlzaWJsZS5sYXN0LmlkO1xuICAgICAgICAgICAgLy8gSUQncyBzdGFydCBhdCAxIHNvIG5vIG5lZWQgdG8gYWRkIDEuXG4gICAgICAgICAgICBpZiAodmlld3NbbmV4dFBhZ2VJbmRleF0gJiYgIXRoaXMuaXNWaWV3RmluaXNoZWQodmlld3NbbmV4dFBhZ2VJbmRleF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpZXdzW25leHRQYWdlSW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB2aXNpYmxlLmZpcnN0LmlkIC0gMjtcbiAgICAgICAgICAgIGlmICh2aWV3c1twcmV2aW91c1BhZ2VJbmRleF0gJiYgIXRoaXMuaXNWaWV3RmluaXNoZWQodmlld3NbcHJldmlvdXNQYWdlSW5kZXhdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2aWV3c1twcmV2aW91c1BhZ2VJbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXZlcnl0aGluZyB0aGF0IG5lZWRzIHRvIGJlIHJlbmRlcmVkIGhhcyBiZWVuLlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gdmlld1xuICAgICAqL1xuICAgIGlzVmlld0ZpbmlzaGVkKHZpZXcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHZpZXcucmVuZGVyaW5nU3RhdGUgPT09IHRoaXMucmVuZGVyaW5nU3RhdGVzLkZJTklTSEVEO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbmRlciBhIHBhZ2Ugb3IgdGh1bWJuYWlsIHZpZXcuIFRoaXMgY2FsbHMgdGhlIGFwcHJvcHJpYXRlIGZ1bmN0aW9uXG4gICAgICogYmFzZWQgb24gdGhlIHZpZXdzIHN0YXRlLiBJZiB0aGUgdmlldyBpcyBhbHJlYWR5IHJlbmRlcmVkIGl0IHdpbGwgcmV0dXJuXG4gICAgICogZmFsc2UuXG4gICAgICogQHBhcmFtIHZpZXdcbiAgICAgKi9cbiAgICByZW5kZXJWaWV3KHZpZXc6IGFueSkge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IHZpZXcucmVuZGVyaW5nU3RhdGU7XG4gICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgdGhpcy5yZW5kZXJpbmdTdGF0ZXMuRklOSVNIRUQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnJlbmRlcmluZ1N0YXRlcy5QQVVTRUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5oaWdoZXN0UHJpb3JpdHlQYWdlID0gdmlldy5yZW5kZXJpbmdJZDtcbiAgICAgICAgICAgICAgICB2aWV3LnJlc3VtZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnJlbmRlcmluZ1N0YXRlcy5SVU5OSU5HOlxuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGVzdFByaW9yaXR5UGFnZSA9IHZpZXcucmVuZGVyaW5nSWQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHRoaXMucmVuZGVyaW5nU3RhdGVzLklOSVRJQUw6XG4gICAgICAgICAgICAgICAgdGhpcy5oaWdoZXN0UHJpb3JpdHlQYWdlID0gdmlldy5yZW5kZXJpbmdJZDtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250aW51ZVJlbmRlcmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJIaWdoZXN0UHJpb3JpdHkoKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgdmlldy5kcmF3KCkudGhlbihjb250aW51ZVJlbmRlcmluZywgY29udGludWVSZW5kZXJpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4iXX0=
