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
export var SnackbarActionTypes;
(function(SnackbarActionTypes) {
  SnackbarActionTypes['Info'] = 'SNACKBAR_INFO';
  SnackbarActionTypes['Warning'] = 'SNACKBAR_WARNING';
  SnackbarActionTypes['Error'] = 'SNACKBAR_ERROR';
})(SnackbarActionTypes || (SnackbarActionTypes = {}));
var SnackbarUserAction = /** @class */ (function() {
  function SnackbarUserAction(title, action) {
    this.title = title;
    this.action = action;
  }
  return SnackbarUserAction;
})();
export { SnackbarUserAction };
var SnackbarInfoAction = /** @class */ (function() {
  function SnackbarInfoAction(payload, params) {
    this.payload = payload;
    this.params = params;
    this.type = SnackbarActionTypes.Info;
    this.duration = 4000;
  }
  return SnackbarInfoAction;
})();
export { SnackbarInfoAction };
var SnackbarWarningAction = /** @class */ (function() {
  function SnackbarWarningAction(payload, params) {
    this.payload = payload;
    this.params = params;
    this.type = SnackbarActionTypes.Warning;
    this.duration = 4000;
  }
  return SnackbarWarningAction;
})();
export { SnackbarWarningAction };
var SnackbarErrorAction = /** @class */ (function() {
  function SnackbarErrorAction(payload, params) {
    this.payload = payload;
    this.params = params;
    this.type = SnackbarActionTypes.Error;
    this.duration = 4000;
  }
  return SnackbarErrorAction;
})();
export { SnackbarErrorAction };
//# sourceMappingURL=snackbar.actions.js.map
