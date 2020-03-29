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
export var LibraryActionTypes;
(function(LibraryActionTypes) {
  LibraryActionTypes['Delete'] = 'DELETE_LIBRARY';
  LibraryActionTypes['Create'] = 'CREATE_LIBRARY';
  LibraryActionTypes['Navigate'] = 'NAVIGATE_LIBRARY';
  LibraryActionTypes['Update'] = 'UPDATE_LIBRARY';
  LibraryActionTypes['Leave'] = 'LEAVE_LIBRARY';
})(LibraryActionTypes || (LibraryActionTypes = {}));
var DeleteLibraryAction = /** @class */ (function() {
  function DeleteLibraryAction(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Delete;
  }
  return DeleteLibraryAction;
})();
export { DeleteLibraryAction };
var CreateLibraryAction = /** @class */ (function() {
  function CreateLibraryAction() {
    this.type = LibraryActionTypes.Create;
  }
  return CreateLibraryAction;
})();
export { CreateLibraryAction };
var NavigateLibraryAction = /** @class */ (function() {
  function NavigateLibraryAction(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Navigate;
  }
  return NavigateLibraryAction;
})();
export { NavigateLibraryAction };
var UpdateLibraryAction = /** @class */ (function() {
  function UpdateLibraryAction(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Update;
  }
  return UpdateLibraryAction;
})();
export { UpdateLibraryAction };
var LeaveLibraryAction = /** @class */ (function() {
  function LeaveLibraryAction(payload) {
    this.payload = payload;
    this.type = LibraryActionTypes.Leave;
  }
  return LeaveLibraryAction;
})();
export { LeaveLibraryAction };
//# sourceMappingURL=library.actions.js.map
