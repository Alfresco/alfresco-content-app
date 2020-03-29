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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppConfigService, UserPreferencesService } from '@alfresco/adf-core';
import { AppLayoutComponent } from './app-layout.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Store } from '@ngrx/store';
import {
  SetSelectedNodesAction,
  ResetSelectionAction
} from '@alfresco/aca-shared/store';
import { Router, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
var MockRouter = /** @class */ (function() {
  function MockRouter() {
    this.url = 'some-url';
    this.subject = new Subject();
    this.events = this.subject.asObservable();
    this.routerState = { snapshot: { url: this.url } };
  }
  MockRouter.prototype.navigateByUrl = function(url) {
    var navigationStart = new NavigationStart(0, url);
    this.subject.next(navigationStart);
  };
  return MockRouter;
})();
describe('AppLayoutComponent', function() {
  var fixture;
  var component;
  var appConfig;
  var userPreference;
  var store;
  var router;
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [
        Store,
        {
          provide: Router,
          useClass: MockRouter
        }
      ],
      declarations: [AppLayoutComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AppLayoutComponent);
    component = fixture.componentInstance;
    appConfig = TestBed.get(AppConfigService);
    store = TestBed.get(Store);
    router = TestBed.get(Router);
    userPreference = TestBed.get(UserPreferencesService);
  });
  beforeEach(function() {
    appConfig.config.languages = [];
    appConfig.config.locale = 'en';
  });
  describe('sidenav state', function() {
    it('should get state from configuration', function() {
      appConfig.config.sideNav = {
        expandedSidenav: false,
        preserveState: false
      };
      fixture.detectChanges();
      expect(component.expandedSidenav).toBe(false);
    });
    it('should resolve state to true is no configuration', function() {
      appConfig.config.sidenav = {};
      fixture.detectChanges();
      expect(component.expandedSidenav).toBe(true);
    });
    it('should get state from user settings as true', function() {
      appConfig.config.sideNav = {
        expandedSidenav: false,
        preserveState: true
      };
      spyOn(userPreference, 'get').and.callFake(function(key) {
        if (key === 'expandedSidenav') {
          return 'true';
        }
        return 'false';
      });
      fixture.detectChanges();
      expect(component.expandedSidenav).toBe(true);
    });
    it('should get state from user settings as false', function() {
      appConfig.config.sidenav = {
        expandedSidenav: false,
        preserveState: true
      };
      spyOn(userPreference, 'get').and.callFake(function(key) {
        if (key === 'expandedSidenav') {
          return 'false';
        }
        return 'true';
      });
      fixture.detectChanges();
      expect(component.expandedSidenav).toBe(false);
    });
  });
  it('should reset selection before navigation', function() {
    var selection = [{ entry: { id: 'nodeId', name: 'name' } }];
    spyOn(store, 'dispatch').and.stub();
    fixture.detectChanges();
    store.dispatch(new SetSelectedNodesAction(selection));
    router.navigateByUrl('somewhere/over/the/rainbow');
    fixture.detectChanges();
    expect(store.dispatch['calls'].mostRecent().args).toEqual([
      new ResetSelectionAction()
    ]);
  });
  it('should close menu on mobile screen size', function() {
    component.minimizeSidenav = false;
    component.layout.container = {
      isMobileScreenSize: true,
      toggleMenu: function() {}
    };
    spyOn(component.layout.container, 'toggleMenu');
    fixture.detectChanges();
    component.hideMenu({ preventDefault: function() {} });
    expect(component.layout.container.toggleMenu).toHaveBeenCalled();
  });
  it('should close menu on mobile screen size also when minimizeSidenav true', function() {
    fixture.detectChanges();
    component.minimizeSidenav = true;
    component.layout.container = {
      isMobileScreenSize: true,
      toggleMenu: function() {}
    };
    spyOn(component.layout.container, 'toggleMenu');
    fixture.detectChanges();
    component.hideMenu({ preventDefault: function() {} });
    expect(component.layout.container.toggleMenu).toHaveBeenCalled();
  });
});
//# sourceMappingURL=app-layout.component.spec.js.map
