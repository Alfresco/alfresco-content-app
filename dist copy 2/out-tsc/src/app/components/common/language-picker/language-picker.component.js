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
import * as tslib_1 from 'tslib';
import { Component } from '@angular/core';
var LanguagePickerComponent = /** @class */ (function() {
  function LanguagePickerComponent() {}
  LanguagePickerComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-language-picker',
        template:
          '\n    <button mat-menu-item [matMenuTriggerFor]="langMenu">\n      {{ \'APP.LANGUAGE\' | translate }}\n    </button>\n    <mat-menu #langMenu="matMenu">\n      <adf-language-menu></adf-language-menu>\n    </mat-menu>\n  '
      })
    ],
    LanguagePickerComponent
  );
  return LanguagePickerComponent;
})();
export { LanguagePickerComponent };
//# sourceMappingURL=language-picker.component.js.map
