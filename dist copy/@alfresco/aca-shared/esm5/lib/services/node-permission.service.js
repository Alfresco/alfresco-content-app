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
var NodePermissionService = /** @class */ (function() {
  function NodePermissionService() {
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
  NodePermissionService.prototype.check
  /**
   * @param {?} source
   * @param {?} permissions
   * @param {?=} options
   * @return {?}
   */ = function(source, permissions, options) {
    var _this = this;
    /** @type {?} */
    var opts = Object.assign({}, this.defaultOptions, options || {});
    if (!source) {
      return false;
    }
    if (Array.isArray(source)) {
      source = source.filter(function(item) {
        return item;
      });
      if (source.length > 0) {
        return source.every(function(node) {
          return _this.isOperationAllowed(node, permissions, opts);
        });
      }
      return false;
    } else {
      return this.isOperationAllowed(source, permissions, opts);
    }
  };
  /**
   * @private
   * @param {?} node
   * @param {?} permissions
   * @param {?} options
   * @return {?}
   */
  NodePermissionService.prototype.isOperationAllowed
  /**
   * @private
   * @param {?} node
   * @param {?} permissions
   * @param {?} options
   * @return {?}
   */ = function(node, permissions, options) {
    /** @type {?} */
    var allowableOperations = this.getAllowableOperations(node, options.target);
    if (allowableOperations.length) {
      if (options.operation === NodePermissionService.DEFAULT_OPERATION) {
        return permissions.some(function(permission) {
          return allowableOperations.includes(permission);
        });
      } else {
        return permissions.every(function(permission) {
          return allowableOperations.includes(permission);
        });
      }
    }
    return false;
  };
  /**
   * @private
   * @param {?} node
   * @param {?=} property
   * @return {?}
   */
  NodePermissionService.prototype.getAllowableOperations
  /**
   * @private
   * @param {?} node
   * @param {?=} property
   * @return {?}
   */ = function(node, property) {
    /** @type {?} */
    var entry;
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
  };
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
  /** @nocollapse */ NodePermissionService.ngInjectableDef = i0.defineInjectable(
    {
      factory: function NodePermissionService_Factory() {
        return new NodePermissionService();
      },
      token: NodePermissionService,
      providedIn: 'root'
    }
  );
  return NodePermissionService;
})();
export { NodePermissionService };
if (false) {
  /** @type {?} */
  NodePermissionService.DEFAULT_OPERATION;
  /**
   * @type {?}
   * @private
   */
  NodePermissionService.prototype.defaultOptions;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1wZXJtaXNzaW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9ub2RlLXBlcm1pc3Npb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7O0FBTTNDLHVDQUdDOzs7SUFGQyxtQ0FBZ0I7O0lBQ2hCLHNDQUFtQjs7QUFHckI7SUFBQTtRQU1VLG1CQUFjLEdBQXNCO1lBQzFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxpQkFBaUI7WUFDbEQsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDO0tBMEVIOzs7Ozs7O0lBeEVDLHFDQUFLOzs7Ozs7SUFBTCxVQUNFLE1BQTZDLEVBQzdDLFdBQXFCLEVBQ3JCLE9BQTJCO1FBSDdCLGlCQXVCQzs7WUFsQk8sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUVsRSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6QixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQztZQUVyQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNyQixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBQSxJQUFJO29CQUN0QixPQUFBLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQztnQkFBaEQsQ0FBZ0QsQ0FDakQsQ0FBQzthQUNIO1lBQ0QsT0FBTyxLQUFLLENBQUM7U0FDZDthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzRDtJQUNILENBQUM7Ozs7Ozs7O0lBRU8sa0RBQWtCOzs7Ozs7O0lBQTFCLFVBQ0UsSUFBc0IsRUFDdEIsV0FBcUIsRUFDckIsT0FBMEI7O1lBRXBCLG1CQUFtQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FDckQsSUFBSSxFQUNKLE9BQU8sQ0FBQyxNQUFNLENBQ2Y7UUFFRCxJQUFJLG1CQUFtQixDQUFDLE1BQU0sRUFBRTtZQUM5QixJQUFJLE9BQU8sQ0FBQyxTQUFTLEtBQUsscUJBQXFCLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ2pFLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFBLFVBQVU7b0JBQ2hDLE9BQUEsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztnQkFBeEMsQ0FBd0MsQ0FDekMsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFBLFVBQVU7b0JBQ2pDLE9BQUEsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztnQkFBeEMsQ0FBd0MsQ0FDekMsQ0FBQzthQUNIO1NBQ0Y7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7Ozs7SUFFTyxzREFBc0I7Ozs7OztJQUE5QixVQUNFLElBQXNCLEVBQ3RCLFFBQWlCOztZQUViLEtBQXdCO1FBRTVCLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUNuQixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNwQjthQUFNO1lBQ0wsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNkO1FBRUQsSUFBSSxRQUFRLEVBQUU7WUFDWixPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDOUI7UUFFRCxJQUFJLDZCQUE2QixJQUFJLEtBQUssRUFBRTtZQUMxQyxPQUFPLEtBQUssQ0FBQywyQkFBMkIsSUFBSSxFQUFFLENBQUM7U0FDaEQ7YUFBTTtZQUNMLE9BQU8sS0FBSyxDQUFDLG1CQUFtQixJQUFJLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUM7SUE5RU0sdUNBQWlCLEdBQUcsSUFBSSxDQUFDOztnQkFKakMsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7O2dDQXRDRDtDQXVIQyxBQW5GRCxJQW1GQztTQWhGWSxxQkFBcUI7OztJQUNoQyx3Q0FBZ0M7Ozs7O0lBRWhDLCtDQUdFIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOb2RlUGVybWlzc2lvbnMgfSBmcm9tICdAYWxmcmVzY28vYWRmLWV4dGVuc2lvbnMnO1xuaW1wb3J0IHsgTm9kZSwgU2hhcmVkTGluaywgU2hhcmVkTGlua0VudHJ5LCBOb2RlRW50cnkgfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcblxuZXhwb3J0IHR5cGUgUGVybWlzc2lvblNvdXJjZSA9IE5vZGVFbnRyeSB8IFNoYXJlZExpbmtFbnRyeSB8IE5vZGU7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGVybWlzc2lvbk9wdGlvbnMge1xuICB0YXJnZXQ/OiBzdHJpbmc7XG4gIG9wZXJhdGlvbj86IHN0cmluZztcbn1cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTm9kZVBlcm1pc3Npb25TZXJ2aWNlIGltcGxlbWVudHMgTm9kZVBlcm1pc3Npb25zIHtcbiAgc3RhdGljIERFRkFVTFRfT1BFUkFUSU9OID0gJ09SJztcblxuICBwcml2YXRlIGRlZmF1bHRPcHRpb25zOiBQZXJtaXNzaW9uT3B0aW9ucyA9IHtcbiAgICBvcGVyYXRpb246IE5vZGVQZXJtaXNzaW9uU2VydmljZS5ERUZBVUxUX09QRVJBVElPTixcbiAgICB0YXJnZXQ6IG51bGxcbiAgfTtcblxuICBjaGVjayhcbiAgICBzb3VyY2U6IFBlcm1pc3Npb25Tb3VyY2UgfCBQZXJtaXNzaW9uU291cmNlW10sXG4gICAgcGVybWlzc2lvbnM6IHN0cmluZ1tdLFxuICAgIG9wdGlvbnM/OiBQZXJtaXNzaW9uT3B0aW9uc1xuICApOiBib29sZWFuIHtcbiAgICBjb25zdCBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIHNvdXJjZSA9IHNvdXJjZS5maWx0ZXIoaXRlbSA9PiBpdGVtKTtcblxuICAgICAgaWYgKHNvdXJjZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2UuZXZlcnkobm9kZSA9PlxuICAgICAgICAgIHRoaXMuaXNPcGVyYXRpb25BbGxvd2VkKG5vZGUsIHBlcm1pc3Npb25zLCBvcHRzKVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pc09wZXJhdGlvbkFsbG93ZWQoc291cmNlLCBwZXJtaXNzaW9ucywgb3B0cyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpc09wZXJhdGlvbkFsbG93ZWQoXG4gICAgbm9kZTogUGVybWlzc2lvblNvdXJjZSxcbiAgICBwZXJtaXNzaW9uczogc3RyaW5nW10sXG4gICAgb3B0aW9uczogUGVybWlzc2lvbk9wdGlvbnNcbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYWxsb3dhYmxlT3BlcmF0aW9ucyA9IHRoaXMuZ2V0QWxsb3dhYmxlT3BlcmF0aW9ucyhcbiAgICAgIG5vZGUsXG4gICAgICBvcHRpb25zLnRhcmdldFxuICAgICk7XG5cbiAgICBpZiAoYWxsb3dhYmxlT3BlcmF0aW9ucy5sZW5ndGgpIHtcbiAgICAgIGlmIChvcHRpb25zLm9wZXJhdGlvbiA9PT0gTm9kZVBlcm1pc3Npb25TZXJ2aWNlLkRFRkFVTFRfT1BFUkFUSU9OKSB7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5zb21lKHBlcm1pc3Npb24gPT5cbiAgICAgICAgICBhbGxvd2FibGVPcGVyYXRpb25zLmluY2x1ZGVzKHBlcm1pc3Npb24pXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMuZXZlcnkocGVybWlzc2lvbiA9PlxuICAgICAgICAgIGFsbG93YWJsZU9wZXJhdGlvbnMuaW5jbHVkZXMocGVybWlzc2lvbilcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGdldEFsbG93YWJsZU9wZXJhdGlvbnMoXG4gICAgbm9kZTogUGVybWlzc2lvblNvdXJjZSxcbiAgICBwcm9wZXJ0eT86IHN0cmluZ1xuICApOiBzdHJpbmdbXSB7XG4gICAgbGV0IGVudHJ5OiBOb2RlIHwgU2hhcmVkTGluaztcblxuICAgIGlmICgnZW50cnknIGluIG5vZGUpIHtcbiAgICAgIGVudHJ5ID0gbm9kZS5lbnRyeTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50cnkgPSBub2RlO1xuICAgIH1cblxuICAgIGlmIChwcm9wZXJ0eSkge1xuICAgICAgcmV0dXJuIGVudHJ5W3Byb3BlcnR5XSB8fCBbXTtcbiAgICB9XG5cbiAgICBpZiAoJ2FsbG93YWJsZU9wZXJhdGlvbnNPblRhcmdldCcgaW4gZW50cnkpIHtcbiAgICAgIHJldHVybiBlbnRyeS5hbGxvd2FibGVPcGVyYXRpb25zT25UYXJnZXQgfHwgW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbnRyeS5hbGxvd2FibGVPcGVyYXRpb25zIHx8IFtdO1xuICAgIH1cbiAgfVxufVxuIl19
