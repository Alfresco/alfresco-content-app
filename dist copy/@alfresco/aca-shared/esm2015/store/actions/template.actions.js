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
/** @enum {string} */
const TemplateActionTypes = {
  FileFromTemplate: 'FILE_FROM_TEMPLATE',
  FolderFromTemplate: 'FOLDER_FROM_TEMPLATE',
  CreateFromTemplate: 'CREATE_FROM_TEMPLATE',
  CreateFromTemplateSuccess: 'CREATE_FROM_TEMPLATE_SUCCESS'
};
export { TemplateActionTypes };
export class FileFromTemplate {
  constructor() {
    this.type = TemplateActionTypes.FileFromTemplate;
  }
}
if (false) {
  /** @type {?} */
  FileFromTemplate.prototype.type;
}
export class FolderFromTemplate {
  constructor() {
    this.type = TemplateActionTypes.FolderFromTemplate;
  }
}
if (false) {
  /** @type {?} */
  FolderFromTemplate.prototype.type;
}
export class CreateFromTemplate {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = TemplateActionTypes.CreateFromTemplate;
  }
}
if (false) {
  /** @type {?} */
  CreateFromTemplate.prototype.type;
  /** @type {?} */
  CreateFromTemplate.prototype.payload;
}
export class CreateFromTemplateSuccess {
  /**
   * @param {?} node
   */
  constructor(node) {
    this.node = node;
    this.type = TemplateActionTypes.CreateFromTemplateSuccess;
  }
}
if (false) {
  /** @type {?} */
  CreateFromTemplateSuccess.prototype.type;
  /** @type {?} */
  CreateFromTemplateSuccess.prototype.node;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkL3N0b3JlLyIsInNvdXJjZXMiOlsiYWN0aW9ucy90ZW1wbGF0ZS5hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTZCRSxrQkFBbUIsb0JBQW9CO0lBQ3ZDLG9CQUFxQixzQkFBc0I7SUFDM0Msb0JBQXFCLHNCQUFzQjtJQUMzQywyQkFBNEIsOEJBQThCOzs7QUFHNUQsTUFBTSxPQUFPLGdCQUFnQjtJQUczQjtRQUZTLFNBQUksR0FBRyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQztJQUV0QyxDQUFDO0NBQ2pCOzs7SUFIQyxnQ0FBcUQ7O0FBS3ZELE1BQU0sT0FBTyxrQkFBa0I7SUFHN0I7UUFGUyxTQUFJLEdBQUcsbUJBQW1CLENBQUMsa0JBQWtCLENBQUM7SUFFeEMsQ0FBQztDQUNqQjs7O0lBSEMsa0NBQXVEOztBQUt6RCxNQUFNLE9BQU8sa0JBQWtCOzs7O0lBRzdCLFlBQW1CLE9BQWE7UUFBYixZQUFPLEdBQVAsT0FBTyxDQUFNO1FBRnZCLFNBQUksR0FBRyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQztJQUVwQixDQUFDO0NBQ3JDOzs7SUFIQyxrQ0FBdUQ7O0lBRTNDLHFDQUFvQjs7QUFHbEMsTUFBTSxPQUFPLHlCQUF5Qjs7OztJQUdwQyxZQUFtQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUZwQixTQUFJLEdBQUcsbUJBQW1CLENBQUMseUJBQXlCLENBQUM7SUFFOUIsQ0FBQztDQUNsQzs7O0lBSEMseUNBQThEOztJQUVsRCx5Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE5vZGUgfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcblxuZXhwb3J0IGVudW0gVGVtcGxhdGVBY3Rpb25UeXBlcyB7XG4gIEZpbGVGcm9tVGVtcGxhdGUgPSAnRklMRV9GUk9NX1RFTVBMQVRFJyxcbiAgRm9sZGVyRnJvbVRlbXBsYXRlID0gJ0ZPTERFUl9GUk9NX1RFTVBMQVRFJyxcbiAgQ3JlYXRlRnJvbVRlbXBsYXRlID0gJ0NSRUFURV9GUk9NX1RFTVBMQVRFJyxcbiAgQ3JlYXRlRnJvbVRlbXBsYXRlU3VjY2VzcyA9ICdDUkVBVEVfRlJPTV9URU1QTEFURV9TVUNDRVNTJ1xufVxuXG5leHBvcnQgY2xhc3MgRmlsZUZyb21UZW1wbGF0ZSBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBUZW1wbGF0ZUFjdGlvblR5cGVzLkZpbGVGcm9tVGVtcGxhdGU7XG5cbiAgY29uc3RydWN0b3IoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgRm9sZGVyRnJvbVRlbXBsYXRlIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFRlbXBsYXRlQWN0aW9uVHlwZXMuRm9sZGVyRnJvbVRlbXBsYXRlO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cbn1cblxuZXhwb3J0IGNsYXNzIENyZWF0ZUZyb21UZW1wbGF0ZSBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBUZW1wbGF0ZUFjdGlvblR5cGVzLkNyZWF0ZUZyb21UZW1wbGF0ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogTm9kZSkge31cbn1cblxuZXhwb3J0IGNsYXNzIENyZWF0ZUZyb21UZW1wbGF0ZVN1Y2Nlc3MgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gVGVtcGxhdGVBY3Rpb25UeXBlcy5DcmVhdGVGcm9tVGVtcGxhdGVTdWNjZXNzO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBub2RlOiBOb2RlKSB7fVxufVxuIl19
