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
export var TemplateActionTypes;
(function(TemplateActionTypes) {
  TemplateActionTypes['FileFromTemplate'] = 'FILE_FROM_TEMPLATE';
  TemplateActionTypes['FolderFromTemplate'] = 'FOLDER_FROM_TEMPLATE';
  TemplateActionTypes['CreateFromTemplate'] = 'CREATE_FROM_TEMPLATE';
  TemplateActionTypes['CreateFromTemplateSuccess'] =
    'CREATE_FROM_TEMPLATE_SUCCESS';
})(TemplateActionTypes || (TemplateActionTypes = {}));
var FileFromTemplate = /** @class */ (function() {
  function FileFromTemplate() {
    this.type = TemplateActionTypes.FileFromTemplate;
  }
  return FileFromTemplate;
})();
export { FileFromTemplate };
var FolderFromTemplate = /** @class */ (function() {
  function FolderFromTemplate() {
    this.type = TemplateActionTypes.FolderFromTemplate;
  }
  return FolderFromTemplate;
})();
export { FolderFromTemplate };
var CreateFromTemplate = /** @class */ (function() {
  function CreateFromTemplate(payload) {
    this.payload = payload;
    this.type = TemplateActionTypes.CreateFromTemplate;
  }
  return CreateFromTemplate;
})();
export { CreateFromTemplate };
var CreateFromTemplateSuccess = /** @class */ (function() {
  function CreateFromTemplateSuccess(node) {
    this.node = node;
    this.type = TemplateActionTypes.CreateFromTemplateSuccess;
  }
  return CreateFromTemplateSuccess;
})();
export { CreateFromTemplateSuccess };
//# sourceMappingURL=template.actions.js.map
