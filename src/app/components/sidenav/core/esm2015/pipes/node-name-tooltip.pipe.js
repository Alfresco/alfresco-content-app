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
import { Pipe } from '@angular/core';
export class NodeNameTooltipPipe {
  /**
   * @param {?} node
   * @return {?}
   */
  transform(node) {
    if (node) {
      return this.getNodeTooltip(node);
    }
    return null;
  }
  /**
   * @private
   * @param {?} lines
   * @param {?} line
   * @return {?}
   */
  containsLine(lines, line) {
    return lines.some(
      /**
       * @param {?} item
       * @return {?}
       */
      item => {
        return item.toLowerCase() === line.toLowerCase();
      }
    );
  }
  /**
   * @private
   * @param {?} lines
   * @return {?}
   */
  removeDuplicateLines(lines) {
    /** @type {?} */
    const reducer
    /**
     * @param {?} acc
     * @param {?} line
     * @return {?}
     */ = ((acc, line) => {
      if (!this.containsLine(acc, line)) {
        acc.push(line);
      }
      return acc;
    });
    return lines.reduce(reducer, []);
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  getNodeTooltip(node) {
    if (!node || !node.entry) {
      return null;
    }
    const {
      entry: { properties, name }
    } = node;
    /** @type {?} */
    const lines = [name];
    if (properties) {
      const { 'cm:title': title, 'cm:description': description } = properties;
      if (title && description) {
        lines[0] = title;
        lines[1] = description;
      }
      if (title) {
        lines[1] = title;
      }
      if (description) {
        lines[1] = description;
      }
    }
    return this.removeDuplicateLines(lines).join(`\n`);
  }
}
NodeNameTooltipPipe.decorators = [
  {
    type: Pipe,
    args: [
      {
        name: 'adfNodeNameTooltip'
      }
    ]
  }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1uYW1lLXRvb2x0aXAucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInBpcGVzL25vZGUtbmFtZS10b29sdGlwLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFNcEQsTUFBTSxPQUFPLG1CQUFtQjs7Ozs7SUFFNUIsU0FBUyxDQUFDLElBQWU7UUFDckIsSUFBSSxJQUFJLEVBQUU7WUFDTixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOzs7Ozs7O0lBRU8sWUFBWSxDQUFDLEtBQWUsRUFBRSxJQUFZO1FBQzlDLE9BQU8sS0FBSyxDQUFDLElBQUk7Ozs7UUFBQyxDQUFDLElBQVksRUFBRSxFQUFFO1lBQy9CLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyRCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7OztJQUVPLG9CQUFvQixDQUFDLEtBQWU7O2NBQ2xDLE9BQU87Ozs7O1FBQUcsQ0FBQyxHQUFhLEVBQUUsSUFBWSxFQUFZLEVBQUU7WUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFBRTtZQUN0RCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQzs7Ozs7O0lBRU8sY0FBYyxDQUFDLElBQWU7UUFDbEMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDdEIsT0FBTyxJQUFJLENBQUM7U0FDZjtjQUVLLEVBQUUsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsSUFBSTs7Y0FDdEMsS0FBSyxHQUFHLENBQUUsSUFBSSxDQUFFO1FBRXRCLElBQUksVUFBVSxFQUFFO2tCQUNOLEVBQ0YsVUFBVSxFQUFFLEtBQUssRUFDakIsZ0JBQWdCLEVBQUUsV0FBVyxFQUNoQyxHQUFHLFVBQVU7WUFFZCxJQUFJLEtBQUssSUFBSSxXQUFXLEVBQUU7Z0JBQ3RCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ2pCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUM7YUFDMUI7WUFFRCxJQUFJLEtBQUssRUFBRTtnQkFDUCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO2FBQ3BCO1lBRUQsSUFBSSxXQUFXLEVBQUU7Z0JBQ2IsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQzthQUMxQjtTQUNKO1FBRUQsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7OztZQXhESixJQUFJLFNBQUM7Z0JBQ0YsSUFBSSxFQUFFLG9CQUFvQjthQUM3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5vZGVFbnRyeSB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuXG5AUGlwZSh7XG4gICAgbmFtZTogJ2FkZk5vZGVOYW1lVG9vbHRpcCdcbn0pXG5leHBvcnQgY2xhc3MgTm9kZU5hbWVUb29sdGlwUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gICAgdHJhbnNmb3JtKG5vZGU6IE5vZGVFbnRyeSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXROb2RlVG9vbHRpcChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbnRhaW5zTGluZShsaW5lczogc3RyaW5nW10sIGxpbmU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gbGluZXMuc29tZSgoaXRlbTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS50b0xvd2VyQ2FzZSgpID09PSBsaW5lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlRHVwbGljYXRlTGluZXMobGluZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICAgICAgICBjb25zdCByZWR1Y2VyID0gKGFjYzogc3RyaW5nW10sIGxpbmU6IHN0cmluZyk6IHN0cmluZ1tdID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jb250YWluc0xpbmUoYWNjLCBsaW5lKSkgeyBhY2MucHVzaChsaW5lKTsgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbGluZXMucmVkdWNlKHJlZHVjZXIsIFtdKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE5vZGVUb29sdGlwKG5vZGU6IE5vZGVFbnRyeSk6IHN0cmluZyB7XG4gICAgICAgIGlmICghbm9kZSB8fCAhbm9kZS5lbnRyeSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IGVudHJ5OiB7IHByb3BlcnRpZXMsIG5hbWUgfSB9ID0gbm9kZTtcbiAgICAgICAgY29uc3QgbGluZXMgPSBbIG5hbWUgXTtcblxuICAgICAgICBpZiAocHJvcGVydGllcykge1xuICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgICdjbTp0aXRsZSc6IHRpdGxlLFxuICAgICAgICAgICAgICAgICdjbTpkZXNjcmlwdGlvbic6IGRlc2NyaXB0aW9uXG4gICAgICAgICAgICB9ID0gcHJvcGVydGllcztcblxuICAgICAgICAgICAgaWYgKHRpdGxlICYmIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGluZXNbMF0gPSB0aXRsZTtcbiAgICAgICAgICAgICAgICBsaW5lc1sxXSA9IGRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgICAgICBsaW5lc1sxXSA9IHRpdGxlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICBsaW5lc1sxXSA9IGRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlRHVwbGljYXRlTGluZXMobGluZXMpLmpvaW4oYFxcbmApO1xuICAgIH1cbn1cbiJdfQ==
