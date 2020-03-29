/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
import { Injectable } from '@angular/core';
import * as i0 from '@angular/core';
/**
 * @record
 */
export function PermissionOptions() {}
if (false) {
  /** @type {?|undefined} */
  PermissionOptions.prototype.target;
  /** @type {?|undefined} */
  PermissionOptions.prototype.operation;
}
export class NodePermissionService {
  constructor() {
    this.defaultOptions = {
      operation: NodePermissionService.DEFAULT_OPERATION,
      target: null
    };
  }
  /**
   * @param {?} source
   * @param {?} permissions
   * @param {?=} options
   * @return {?}
   */
  check(source, permissions, options) {
    /** @type {?} */
    const opts = Object.assign({}, this.defaultOptions, options || {});
    if (!source) {
      return false;
    }
    if (Array.isArray(source)) {
      source = source.filter(item => item);
      if (source.length > 0) {
        return source.every(node =>
          this.isOperationAllowed(node, permissions, opts)
        );
      }
      return false;
    } else {
      return this.isOperationAllowed(source, permissions, opts);
    }
  }
  /**
   * @private
   * @param {?} node
   * @param {?} permissions
   * @param {?} options
   * @return {?}
   */
  isOperationAllowed(node, permissions, options) {
    /** @type {?} */
    const allowableOperations = this.getAllowableOperations(
      node,
      options.target
    );
    if (allowableOperations.length) {
      if (options.operation === NodePermissionService.DEFAULT_OPERATION) {
        return permissions.some(permission =>
          allowableOperations.includes(permission)
        );
      } else {
        return permissions.every(permission =>
          allowableOperations.includes(permission)
        );
      }
    }
    return false;
  }
  /**
   * @private
   * @param {?} node
   * @param {?=} property
   * @return {?}
   */
  getAllowableOperations(node, property) {
    /** @type {?} */
    let entry;
    if ('entry' in node) {
      entry = node.entry;
    } else {
      entry = node;
    }
    if (property) {
      return entry[property] || [];
    }
    if ('allowableOperationsOnTarget' in entry) {
      return entry.allowableOperationsOnTarget || [];
    } else {
      return entry.allowableOperations || [];
    }
  }
}
NodePermissionService.DEFAULT_OPERATION = 'OR';
NodePermissionService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */ NodePermissionService.ngInjectableDef = i0.defineInjectable({
  factory: function NodePermissionService_Factory() {
    return new NodePermissionService();
  },
  token: NodePermissionService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  NodePermissionService.DEFAULT_OPERATION;
  /**
   * @type {?}
   * @private
   */
  NodePermissionService.prototype.defaultOptions;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1wZXJtaXNzaW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9ub2RlLXBlcm1pc3Npb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7O0FBTTNDLHVDQUdDOzs7SUFGQyxtQ0FBZ0I7O0lBQ2hCLHNDQUFtQjs7QUFNckIsTUFBTSxPQUFPLHFCQUFxQjtJQUhsQztRQU1VLG1CQUFjLEdBQXNCO1lBQzFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxpQkFBaUI7WUFDbEQsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDO0tBMEVIOzs7Ozs7O0lBeEVDLEtBQUssQ0FDSCxNQUE2QyxFQUM3QyxXQUFxQixFQUNyQixPQUEyQjs7Y0FFckIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUVsRSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6QixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXJDLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3JCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUN6QixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FDakQsQ0FBQzthQUNIO1lBQ0QsT0FBTyxLQUFLLENBQUM7U0FDZDthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzRDtJQUNILENBQUM7Ozs7Ozs7O0lBRU8sa0JBQWtCLENBQ3hCLElBQXNCLEVBQ3RCLFdBQXFCLEVBQ3JCLE9BQTBCOztjQUVwQixtQkFBbUIsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQ3JELElBQUksRUFDSixPQUFPLENBQUMsTUFBTSxDQUNmO1FBRUQsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEVBQUU7WUFDOUIsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO2dCQUNqRSxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FDbkMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUN6QyxDQUFDO2FBQ0g7aUJBQU07Z0JBQ0wsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQ3BDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FDekMsQ0FBQzthQUNIO1NBQ0Y7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7Ozs7SUFFTyxzQkFBc0IsQ0FDNUIsSUFBc0IsRUFDdEIsUUFBaUI7O1lBRWIsS0FBd0I7UUFFNUIsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO1lBQ25CLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3BCO2FBQU07WUFDTCxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ2Q7UUFFRCxJQUFJLFFBQVEsRUFBRTtZQUNaLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM5QjtRQUVELElBQUksNkJBQTZCLElBQUksS0FBSyxFQUFFO1lBQzFDLE9BQU8sS0FBSyxDQUFDLDJCQUEyQixJQUFJLEVBQUUsQ0FBQztTQUNoRDthQUFNO1lBQ0wsT0FBTyxLQUFLLENBQUMsbUJBQW1CLElBQUksRUFBRSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQzs7QUE5RU0sdUNBQWlCLEdBQUcsSUFBSSxDQUFDOztZQUpqQyxVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7O0lBRUMsd0NBQWdDOzs7OztJQUVoQywrQ0FHRSIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTm9kZVBlcm1pc3Npb25zIH0gZnJvbSAnQGFsZnJlc2NvL2FkZi1leHRlbnNpb25zJztcbmltcG9ydCB7IE5vZGUsIFNoYXJlZExpbmssIFNoYXJlZExpbmtFbnRyeSwgTm9kZUVudHJ5IH0gZnJvbSAnQGFsZnJlc2NvL2pzLWFwaSc7XG5cbmV4cG9ydCB0eXBlIFBlcm1pc3Npb25Tb3VyY2UgPSBOb2RlRW50cnkgfCBTaGFyZWRMaW5rRW50cnkgfCBOb2RlO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBlcm1pc3Npb25PcHRpb25zIHtcbiAgdGFyZ2V0Pzogc3RyaW5nO1xuICBvcGVyYXRpb24/OiBzdHJpbmc7XG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5vZGVQZXJtaXNzaW9uU2VydmljZSBpbXBsZW1lbnRzIE5vZGVQZXJtaXNzaW9ucyB7XG4gIHN0YXRpYyBERUZBVUxUX09QRVJBVElPTiA9ICdPUic7XG5cbiAgcHJpdmF0ZSBkZWZhdWx0T3B0aW9uczogUGVybWlzc2lvbk9wdGlvbnMgPSB7XG4gICAgb3BlcmF0aW9uOiBOb2RlUGVybWlzc2lvblNlcnZpY2UuREVGQVVMVF9PUEVSQVRJT04sXG4gICAgdGFyZ2V0OiBudWxsXG4gIH07XG5cbiAgY2hlY2soXG4gICAgc291cmNlOiBQZXJtaXNzaW9uU291cmNlIHwgUGVybWlzc2lvblNvdXJjZVtdLFxuICAgIHBlcm1pc3Npb25zOiBzdHJpbmdbXSxcbiAgICBvcHRpb25zPzogUGVybWlzc2lvbk9wdGlvbnNcbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMgfHwge30pO1xuXG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICBzb3VyY2UgPSBzb3VyY2UuZmlsdGVyKGl0ZW0gPT4gaXRlbSk7XG5cbiAgICAgIGlmIChzb3VyY2UubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gc291cmNlLmV2ZXJ5KG5vZGUgPT5cbiAgICAgICAgICB0aGlzLmlzT3BlcmF0aW9uQWxsb3dlZChub2RlLCBwZXJtaXNzaW9ucywgb3B0cylcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaXNPcGVyYXRpb25BbGxvd2VkKHNvdXJjZSwgcGVybWlzc2lvbnMsIG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNPcGVyYXRpb25BbGxvd2VkKFxuICAgIG5vZGU6IFBlcm1pc3Npb25Tb3VyY2UsXG4gICAgcGVybWlzc2lvbnM6IHN0cmluZ1tdLFxuICAgIG9wdGlvbnM6IFBlcm1pc3Npb25PcHRpb25zXG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGFsbG93YWJsZU9wZXJhdGlvbnMgPSB0aGlzLmdldEFsbG93YWJsZU9wZXJhdGlvbnMoXG4gICAgICBub2RlLFxuICAgICAgb3B0aW9ucy50YXJnZXRcbiAgICApO1xuXG4gICAgaWYgKGFsbG93YWJsZU9wZXJhdGlvbnMubGVuZ3RoKSB7XG4gICAgICBpZiAob3B0aW9ucy5vcGVyYXRpb24gPT09IE5vZGVQZXJtaXNzaW9uU2VydmljZS5ERUZBVUxUX09QRVJBVElPTikge1xuICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMuc29tZShwZXJtaXNzaW9uID0+XG4gICAgICAgICAgYWxsb3dhYmxlT3BlcmF0aW9ucy5pbmNsdWRlcyhwZXJtaXNzaW9uKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLmV2ZXJ5KHBlcm1pc3Npb24gPT5cbiAgICAgICAgICBhbGxvd2FibGVPcGVyYXRpb25zLmluY2x1ZGVzKHBlcm1pc3Npb24pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRBbGxvd2FibGVPcGVyYXRpb25zKFxuICAgIG5vZGU6IFBlcm1pc3Npb25Tb3VyY2UsXG4gICAgcHJvcGVydHk/OiBzdHJpbmdcbiAgKTogc3RyaW5nW10ge1xuICAgIGxldCBlbnRyeTogTm9kZSB8IFNoYXJlZExpbms7XG5cbiAgICBpZiAoJ2VudHJ5JyBpbiBub2RlKSB7XG4gICAgICBlbnRyeSA9IG5vZGUuZW50cnk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudHJ5ID0gbm9kZTtcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydHkpIHtcbiAgICAgIHJldHVybiBlbnRyeVtwcm9wZXJ0eV0gfHwgW107XG4gICAgfVxuXG4gICAgaWYgKCdhbGxvd2FibGVPcGVyYXRpb25zT25UYXJnZXQnIGluIGVudHJ5KSB7XG4gICAgICByZXR1cm4gZW50cnkuYWxsb3dhYmxlT3BlcmF0aW9uc09uVGFyZ2V0IHx8IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZW50cnkuYWxsb3dhYmxlT3BlcmF0aW9ucyB8fCBbXTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
