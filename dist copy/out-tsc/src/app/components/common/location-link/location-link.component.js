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
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  HostListener
} from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { NavigateToParentFolder } from '@alfresco/aca-shared/store';
import { ContentApiService } from '@alfresco/aca-shared';
import { TranslationService } from '@alfresco/adf-core';
var LocationLinkComponent = /** @class */ (function() {
  function LocationLinkComponent(store, contentApi, translationService) {
    this.store = store;
    this.contentApi = contentApi;
    this.translationService = translationService;
    this.nodeLocation$ = new BehaviorSubject('');
  }
  LocationLinkComponent.prototype.onMouseEnter = function() {
    this.getTooltip(this._path);
  };
  LocationLinkComponent.prototype.goToLocation = function() {
    if (this.context) {
      var node = this.context.row.node;
      this.store.dispatch(new NavigateToParentFolder(node));
    }
  };
  LocationLinkComponent.prototype.ngOnInit = function() {
    if (this.context) {
      var node = this.context.row.node;
      if (node && node.entry && node.entry.path) {
        var path = node.entry.path;
        if (path && path.name && path.elements) {
          this.displayText = this.getDisplayText(path);
          this._path = path;
        } else {
          this.displayText = of('APP.BROWSE.SEARCH.UNKNOWN_LOCATION');
        }
      }
    }
  };
  // todo: review once 5.2.3 is out
  LocationLinkComponent.prototype.getDisplayText = function(path) {
    var _this = this;
    var elements = path.elements.map(function(e) {
      return e.name;
    });
    // for admin users
    if (elements.length === 1 && elements[0] === 'Company Home') {
      return of('APP.BROWSE.PERSONAL.TITLE');
    }
    // for non-admin users
    if (
      elements.length === 3 &&
      elements[0] === 'Company Home' &&
      elements[1] === 'User Homes'
    ) {
      return of('APP.BROWSE.PERSONAL.TITLE');
    }
    var result = elements[elements.length - 1];
    if (result === 'documentLibrary') {
      var fragment_1 = path.elements[path.elements.length - 2];
      return new Observable(function(observer) {
        _this.contentApi.getNodeInfo(fragment_1.id).subscribe(
          function(node) {
            observer.next(
              node.properties['cm:title'] || node.name || fragment_1.name
            );
            observer.complete();
          },
          function() {
            observer.next(fragment_1.name);
            observer.complete();
          }
        );
      });
    }
    return of(result);
  };
  // todo: review once 5.2.3 is out
  LocationLinkComponent.prototype.getTooltip = function(path) {
    var _this = this;
    if (!path) {
      return;
    }
    var result = null;
    var elements = path.elements.map(function(e) {
      return Object.assign({}, e);
    });
    var personalFiles = this.translationService.instant(
      'APP.BROWSE.PERSONAL.TITLE'
    );
    var fileLibraries = this.translationService.instant(
      'APP.BROWSE.LIBRARIES.TITLE'
    );
    if (elements[0].name === 'Company Home') {
      elements[0].name = personalFiles;
      if (elements.length > 2) {
        if (elements[1].name === 'Sites') {
          var fragment_2 = elements[2];
          this.contentApi.getNodeInfo(fragment_2.id).subscribe(
            function(node) {
              elements.splice(0, 2);
              elements[0].name =
                node.properties['cm:title'] || node.name || fragment_2.name;
              elements.splice(1, 1);
              elements.unshift({ id: null, name: fileLibraries });
              result = elements
                .map(function(e) {
                  return e.name;
                })
                .join('/');
              _this.nodeLocation$.next(result);
            },
            function() {
              elements.splice(0, 2);
              elements.unshift({ id: null, name: fileLibraries });
              elements.splice(2, 1);
              result = elements
                .map(function(e) {
                  return e.name;
                })
                .join('/');
              _this.nodeLocation$.next(result);
            }
          );
        }
        if (elements[1].name === 'User Homes') {
          elements.splice(0, 3);
          elements.unshift({ id: null, name: personalFiles });
        }
      }
    }
    result = elements
      .map(function(e) {
        return e.name;
      })
      .join('/');
    this.nodeLocation$.next(result);
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    LocationLinkComponent.prototype,
    'context',
    void 0
  );
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Array)],
    LocationLinkComponent.prototype,
    'link',
    void 0
  );
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Observable)],
    LocationLinkComponent.prototype,
    'displayText',
    void 0
  );
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Observable)],
    LocationLinkComponent.prototype,
    'tooltip',
    void 0
  );
  tslib_1.__decorate(
    [
      HostListener('mouseenter'),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', []),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    LocationLinkComponent.prototype,
    'onMouseEnter',
    null
  );
  LocationLinkComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-location-link',
        template:
          '\n    <a\n      href=""\n      [title]="nodeLocation$ | async"\n      (click)="goToLocation()"\n      class="adf-datatable-cell-value"\n    >\n      {{ displayText | async | translate }}\n    </a>\n  ',
        changeDetection: ChangeDetectionStrategy.OnPush,
        encapsulation: ViewEncapsulation.None,
        host: {
          class:
            'aca-location-link adf-location-cell adf-datatable-content-cell'
        }
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        ContentApiService,
        TranslationService
      ])
    ],
    LocationLinkComponent
  );
  return LocationLinkComponent;
})();
export { LocationLinkComponent };
//# sourceMappingURL=location-link.component.js.map
