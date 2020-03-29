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
import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { CollapsedTemplateDirective } from './directives/collapsed-template.directive';
import { ExpandedTemplateDirective } from './directives/expanded-template.directive';
import { AppExtensionService } from '../../extensions/extension.service';
import { Store } from '@ngrx/store';
import { getSideNavState } from '@alfresco/aca-shared/store';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
var SidenavComponent = /** @class */ (function() {
  function SidenavComponent(store, extensions) {
    this.store = store;
    this.extensions = extensions;
    this.mode = 'expanded';
    this.groups = [];
    this.onDestroy$ = new Subject();
  }
  SidenavComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.store
      .select(getSideNavState)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function() {
        _this.groups = _this.extensions.getApplicationNavigation(
          _this.extensions.navbar
        );
      });
  };
  SidenavComponent.prototype.trackById = function(_, obj) {
    return obj.id;
  };
  SidenavComponent.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', String)],
    SidenavComponent.prototype,
    'mode',
    void 0
  );
  tslib_1.__decorate(
    [
      ContentChild(ExpandedTemplateDirective, { read: TemplateRef }),
      tslib_1.__metadata('design:type', Object)
    ],
    SidenavComponent.prototype,
    'expandedTemplate',
    void 0
  );
  tslib_1.__decorate(
    [
      ContentChild(CollapsedTemplateDirective, { read: TemplateRef }),
      tslib_1.__metadata('design:type', Object)
    ],
    SidenavComponent.prototype,
    'collapsedTemplate',
    void 0
  );
  SidenavComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-sidenav',
        templateUrl: './sidenav.component.html',
        styleUrls: ['./sidenav.component.scss'],
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-sidenav' }
      }),
      tslib_1.__metadata('design:paramtypes', [Store, AppExtensionService])
    ],
    SidenavComponent
  );
  return SidenavComponent;
})();
export { SidenavComponent };
//# sourceMappingURL=sidenav.component.js.map
