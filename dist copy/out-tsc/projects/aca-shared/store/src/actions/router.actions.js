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
export var RouterActionTypes;
(function(RouterActionTypes) {
  RouterActionTypes['NavigateUrl'] = 'NAVIGATE_URL';
  RouterActionTypes['NavigateRoute'] = 'NAVIGATE_ROUTE';
  RouterActionTypes['NavigateFolder'] = 'NAVIGATE_FOLDER';
  RouterActionTypes['NavigateParentFolder'] = 'NAVIGATE_PARENT_FOLDER';
})(RouterActionTypes || (RouterActionTypes = {}));
var NavigateUrlAction = /** @class */ (function() {
  function NavigateUrlAction(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateUrl;
  }
  return NavigateUrlAction;
})();
export { NavigateUrlAction };
var NavigateRouteAction = /** @class */ (function() {
  function NavigateRouteAction(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateRoute;
  }
  return NavigateRouteAction;
})();
export { NavigateRouteAction };
var NavigateToFolder = /** @class */ (function() {
  function NavigateToFolder(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateFolder;
  }
  return NavigateToFolder;
})();
export { NavigateToFolder };
var NavigateToParentFolder = /** @class */ (function() {
  function NavigateToParentFolder(payload) {
    this.payload = payload;
    this.type = RouterActionTypes.NavigateParentFolder;
  }
  return NavigateToParentFolder;
})();
export { NavigateToParentFolder };
//# sourceMappingURL=router.actions.js.map
