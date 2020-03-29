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
import { Component, ViewEncapsulation } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppExtensionService } from '../../extensions/extension.service';
import { ContentApiService } from '@alfresco/aca-shared';
import { dependencies } from '../../../../package.json';
var AboutComponent = /** @class */ (function() {
  function AboutComponent(contentApi, appExtensions) {
    this.contentApi = contentApi;
    this.extensions$ = appExtensions.references$;
  }
  AboutComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.dependencyEntries = Object.keys(dependencies).map(function(key) {
      return {
        name: key,
        version: dependencies[key]
      };
    });
    this.contentApi
      .getRepositoryInformation()
      .pipe(
        map(function(node) {
          return node.entry.repository;
        })
      )
      .subscribe(function(repository) {
        _this.repository = repository;
        _this.statusEntries = Object.keys(repository.status).map(function(key) {
          return {
            property: key,
            value: repository.status[key]
          };
        });
        if (repository.license) {
          _this.licenseEntries = Object.keys(repository.license).map(function(
            key
          ) {
            return {
              property: key,
              value: repository.license[key]
            };
          });
        }
      });
  };
  AboutComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-about',
        templateUrl: './about.component.html',
        styleUrls: ['about.component.scss'],
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-about' }
      }),
      tslib_1.__metadata('design:paramtypes', [
        ContentApiService,
        AppExtensionService
      ])
    ],
    AboutComponent
  );
  return AboutComponent;
})();
export { AboutComponent };
//# sourceMappingURL=about.component.js.map
