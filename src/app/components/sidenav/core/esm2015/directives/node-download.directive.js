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
import { Directive, Input, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { DownloadZipDialogComponent } from '../dialogs/download-zip/download-zip.dialog';
import { DownloadService } from '../services/download.service';
/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
export class NodeDownloadDirective {
  /**
   * @param {?} apiService
   * @param {?} downloadService
   * @param {?} dialog
   */
  constructor(apiService, downloadService, dialog) {
    this.apiService = apiService;
    this.downloadService = downloadService;
    this.dialog = dialog;
  }
  /**
   * @return {?}
   */
  onClick() {
    this.downloadNodes(this.nodes);
  }
  /**
   * Downloads multiple selected nodes.
   * Packs result into a .ZIP archive if there is more than one node selected.
   * @param {?} selection Multiple selected nodes to download
   * @return {?}
   */
  downloadNodes(selection) {
    if (!this.isSelectionValid(selection)) {
      return;
    }
    if (selection instanceof Array) {
      if (selection.length === 1) {
        this.downloadNode(selection[0]);
      } else {
        this.downloadZip(selection);
      }
    } else {
      this.downloadNode(selection);
    }
  }
  /**
   * Downloads a single node.
   * Packs result into a .ZIP archive is the node is a Folder.
   * @param {?} node Node to download
   * @return {?}
   */
  downloadNode(node) {
    if (node && node.entry) {
      /** @type {?} */
      const entry = node.entry;
      if (entry.isFile) {
        this.downloadFile(node);
      }
      if (entry.isFolder) {
        this.downloadZip([node]);
      }
      // Check if there's nodeId for Shared Files
      if (!entry.isFile && !entry.isFolder && /** @type {?} */ (entry).nodeId) {
        this.downloadFile(node);
      }
    }
  }
  /**
   * @private
   * @param {?} selection
   * @return {?}
   */
  isSelectionValid(selection) {
    return selection || (selection instanceof Array && selection.length > 0);
  }
  /**
   * @private
   * @param {?} node
   * @return {?}
   */
  downloadFile(node) {
    if (node && node.entry) {
      /** @type {?} */
      const contentApi = this.apiService.getInstance().content;
      // nodeId for Shared node
      /** @type {?} */
      const id = /** @type {?} */ (node.entry).nodeId || node.entry.id;
      /** @type {?} */
      const url = contentApi.getContentUrl(id, true);
      /** @type {?} */
      const fileName = node.entry.name;
      this.downloadService.downloadUrl(url, fileName);
    }
  }
  /**
   * @private
   * @param {?} selection
   * @return {?}
   */
  downloadZip(selection) {
    if (selection && selection.length > 0) {
      // nodeId for Shared node
      /** @type {?} */
      const nodeIds = selection.map(
        /**
         * @param {?} node
         * @return {?}
         */
        (node => node.entry.nodeId || node.entry.id)
      );
      this.dialog.open(DownloadZipDialogComponent, {
        width: '600px',
        disableClose: true,
        data: {
          nodeIds
        }
      });
    }
  }
}
NodeDownloadDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        // tslint:disable-next-line: directive-selector
        selector: '[adfNodeDownload]'
      }
    ]
  }
];
/** @nocollapse */
NodeDownloadDirective.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: DownloadService },
  { type: MatDialog }
];
NodeDownloadDirective.propDecorators = {
  nodes: [{ type: Input, args: ['adfNodeDownload'] }],
  onClick: [{ type: HostListener, args: ['click'] }]
};
if (false) {
  /**
   * Nodes to download.
   * @type {?}
   */
  NodeDownloadDirective.prototype.nodes;
  /**
   * @type {?}
   * @private
   */
  NodeDownloadDirective.prototype.apiService;
  /**
   * @type {?}
   * @private
   */
  NodeDownloadDirective.prototype.downloadService;
  /**
   * @type {?}
   * @private
   */
  NodeDownloadDirective.prototype.dialog;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1kb3dubG9hZC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJkaXJlY3RpdmVzL25vZGUtZG93bmxvYWQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMvRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdEUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFFekYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDhCQUE4QixDQUFDOzs7O0FBUy9ELE1BQU0sT0FBTyxxQkFBcUI7Ozs7OztJQVc5QixZQUNZLFVBQThCLEVBQzlCLGVBQWdDLEVBQ2hDLE1BQWlCO1FBRmpCLGVBQVUsR0FBVixVQUFVLENBQW9CO1FBQzlCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxXQUFNLEdBQU4sTUFBTSxDQUFXO0lBQzdCLENBQUM7Ozs7SUFSRCxPQUFPO1FBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7Ozs7OztJQWFELGFBQWEsQ0FBQyxTQUF1QztRQUVqRCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ25DLE9BQU87U0FDVjtRQUNELElBQUksU0FBUyxZQUFZLEtBQUssRUFBRTtZQUM1QixJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25DO2lCQUFNO2dCQUNILElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDL0I7U0FDSjthQUFNO1lBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNoQztJQUNMLENBQUM7Ozs7Ozs7SUFPRCxZQUFZLENBQUMsSUFBZTtRQUN4QixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFOztrQkFDZCxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7WUFFeEIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDM0I7WUFFRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzVCO1lBRUQsMkNBQTJDO1lBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxDQUFDLG1CQUFNLEtBQUssRUFBQSxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUMxRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNCO1NBQ0o7SUFDTCxDQUFDOzs7Ozs7SUFFTyxnQkFBZ0IsQ0FBQyxTQUF1QztRQUM1RCxPQUFPLFNBQVMsSUFBSSxDQUFDLFNBQVMsWUFBWSxLQUFLLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDOzs7Ozs7SUFFTyxZQUFZLENBQUMsSUFBZTtRQUNoQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFOztrQkFDZCxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPOzs7a0JBRWxELEVBQUUsR0FBRyxDQUFDLG1CQUFNLElBQUksQ0FBQyxLQUFLLEVBQUEsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7O2tCQUUvQyxHQUFHLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDOztrQkFDeEMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUVoQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDbkQ7SUFDTCxDQUFDOzs7Ozs7SUFFTyxXQUFXLENBQUMsU0FBMkI7UUFDM0MsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7OztrQkFFN0IsT0FBTyxHQUFHLFNBQVMsQ0FBQyxHQUFHOzs7O1lBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBQztZQUVsRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRTtnQkFDekMsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLElBQUksRUFBRTtvQkFDRixPQUFPO2lCQUNWO2FBQ0osQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDOzs7WUFoR0osU0FBUyxTQUFDOztnQkFFUCxRQUFRLEVBQUUsbUJBQW1CO2FBQ2hDOzs7O1lBWFEsa0JBQWtCO1lBR2xCLGVBQWU7WUFKZixTQUFTOzs7b0JBZ0JiLEtBQUssU0FBQyxpQkFBaUI7c0JBR3ZCLFlBQVksU0FBQyxPQUFPOzs7Ozs7O0lBSHJCLHNDQUMrQjs7Ozs7SUFRM0IsMkNBQXNDOzs7OztJQUN0QyxnREFBd0M7Ozs7O0lBQ3hDLHVDQUF5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0RGlhbG9nIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgQWxmcmVzY29BcGlTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvYWxmcmVzY28tYXBpLnNlcnZpY2UnO1xuaW1wb3J0IHsgRG93bmxvYWRaaXBEaWFsb2dDb21wb25lbnQgfSBmcm9tICcuLi9kaWFsb2dzL2Rvd25sb2FkLXppcC9kb3dubG9hZC16aXAuZGlhbG9nJztcbmltcG9ydCB7IE5vZGVFbnRyeSB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuaW1wb3J0IHsgRG93bmxvYWRTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZG93bmxvYWQuc2VydmljZSc7XG5cbi8qKlxuICogRGlyZWN0aXZlIHNlbGVjdG9ycyB3aXRob3V0IGFkZi0gcHJlZml4IHdpbGwgYmUgZGVwcmVjYXRlZCBvbiAzLjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRpcmVjdGl2ZS1zZWxlY3RvclxuICAgIHNlbGVjdG9yOiAnW2FkZk5vZGVEb3dubG9hZF0nXG59KVxuZXhwb3J0IGNsYXNzIE5vZGVEb3dubG9hZERpcmVjdGl2ZSB7XG5cbiAgICAvKiogTm9kZXMgdG8gZG93bmxvYWQuICovXG4gICAgQElucHV0KCdhZGZOb2RlRG93bmxvYWQnKVxuICAgIG5vZGVzOiBOb2RlRW50cnkgfCBOb2RlRW50cnlbXTtcblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcbiAgICBvbkNsaWNrKCkge1xuICAgICAgICB0aGlzLmRvd25sb2FkTm9kZXModGhpcy5ub2Rlcyk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgYXBpU2VydmljZTogQWxmcmVzY29BcGlTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGRvd25sb2FkU2VydmljZTogRG93bmxvYWRTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGRpYWxvZzogTWF0RGlhbG9nKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG93bmxvYWRzIG11bHRpcGxlIHNlbGVjdGVkIG5vZGVzLlxuICAgICAqIFBhY2tzIHJlc3VsdCBpbnRvIGEgLlpJUCBhcmNoaXZlIGlmIHRoZXJlIGlzIG1vcmUgdGhhbiBvbmUgbm9kZSBzZWxlY3RlZC5cbiAgICAgKiBAcGFyYW0gc2VsZWN0aW9uIE11bHRpcGxlIHNlbGVjdGVkIG5vZGVzIHRvIGRvd25sb2FkXG4gICAgICovXG4gICAgZG93bmxvYWROb2RlcyhzZWxlY3Rpb246IE5vZGVFbnRyeSB8IEFycmF5PE5vZGVFbnRyeT4pIHtcblxuICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3Rpb25WYWxpZChzZWxlY3Rpb24pKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGlvbiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZG93bmxvYWROb2RlKHNlbGVjdGlvblswXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZG93bmxvYWRaaXAoc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZG93bmxvYWROb2RlKHNlbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb3dubG9hZHMgYSBzaW5nbGUgbm9kZS5cbiAgICAgKiBQYWNrcyByZXN1bHQgaW50byBhIC5aSVAgYXJjaGl2ZSBpcyB0aGUgbm9kZSBpcyBhIEZvbGRlci5cbiAgICAgKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGRvd25sb2FkXG4gICAgICovXG4gICAgZG93bmxvYWROb2RlKG5vZGU6IE5vZGVFbnRyeSkge1xuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmVudHJ5KSB7XG4gICAgICAgICAgICBjb25zdCBlbnRyeSA9IG5vZGUuZW50cnk7XG5cbiAgICAgICAgICAgIGlmIChlbnRyeS5pc0ZpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvd25sb2FkRmlsZShub2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVudHJ5LmlzRm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kb3dubG9hZFppcChbbm9kZV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGVyZSdzIG5vZGVJZCBmb3IgU2hhcmVkIEZpbGVzXG4gICAgICAgICAgICBpZiAoIWVudHJ5LmlzRmlsZSAmJiAhZW50cnkuaXNGb2xkZXIgJiYgKDxhbnk+IGVudHJ5KS5ub2RlSWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvd25sb2FkRmlsZShub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNTZWxlY3Rpb25WYWxpZChzZWxlY3Rpb246IE5vZGVFbnRyeSB8IEFycmF5PE5vZGVFbnRyeT4pIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbiB8fCAoc2VsZWN0aW9uIGluc3RhbmNlb2YgQXJyYXkgJiYgc2VsZWN0aW9uLmxlbmd0aCA+IDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZG93bmxvYWRGaWxlKG5vZGU6IE5vZGVFbnRyeSkge1xuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmVudHJ5KSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50QXBpID0gdGhpcy5hcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkuY29udGVudDtcbiAgICAgICAgICAgIC8vIG5vZGVJZCBmb3IgU2hhcmVkIG5vZGVcbiAgICAgICAgICAgIGNvbnN0IGlkID0gKDxhbnk+IG5vZGUuZW50cnkpLm5vZGVJZCB8fCBub2RlLmVudHJ5LmlkO1xuXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBjb250ZW50QXBpLmdldENvbnRlbnRVcmwoaWQsIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBub2RlLmVudHJ5Lm5hbWU7XG5cbiAgICAgICAgICAgIHRoaXMuZG93bmxvYWRTZXJ2aWNlLmRvd25sb2FkVXJsKHVybCwgZmlsZU5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb3dubG9hZFppcChzZWxlY3Rpb246IEFycmF5PE5vZGVFbnRyeT4pIHtcbiAgICAgICAgaWYgKHNlbGVjdGlvbiAmJiBzZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gbm9kZUlkIGZvciBTaGFyZWQgbm9kZVxuICAgICAgICAgICAgY29uc3Qgbm9kZUlkcyA9IHNlbGVjdGlvbi5tYXAoKG5vZGU6IGFueSkgPT4gKG5vZGUuZW50cnkubm9kZUlkIHx8IG5vZGUuZW50cnkuaWQpKTtcblxuICAgICAgICAgICAgdGhpcy5kaWFsb2cub3BlbihEb3dubG9hZFppcERpYWxvZ0NvbXBvbmVudCwge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAnNjAwcHgnLFxuICAgICAgICAgICAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVJZHNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
