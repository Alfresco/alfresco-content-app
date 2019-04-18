/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppConfigService, UserPreferencesService } from '@alfresco/adf-core';
import { AppLayoutComponent } from './app-layout.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../store/states';
import { SetSelectedNodesAction } from '../../../store/actions';
import { Router, NavigationStart } from '@angular/router';
import { getAppSelection } from '../../../store/selectors/app.selectors';
import { Subject } from 'rxjs';

class MockRouter {
  private url = 'some-url';
  private subject = new Subject();
  events = this.subject.asObservable();
  routerState = { snapshot: { url: this.url } };

  navigateByUrl(url: string) {
    const navigationStart = new NavigationStart(0, url);
    this.subject.next(navigationStart);
  }
}

describe('AppLayoutComponent', () => {
  let fixture: ComponentFixture<AppLayoutComponent>;
  let component: AppLayoutComponent;
  let appConfig: AppConfigService;
  let userPreference: UserPreferencesService;
  let store: Store<AppStore>;
  let router: Router;

  beforeEach(() => {
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

  describe('sidenav state', () => {
    it('should get state from configuration', () => {
      appConfig.config = {
        sideNav: {
          expandedSidenav: false,
          preserveState: false
        }
      };

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(false);
    });

    it('should resolve state to true is no configuration', () => {
      appConfig.config = {};

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(true);
    });

    it('should get state from user settings as true', () => {
      appConfig.config = {
        sideNav: {
          expandedSidenav: false,
          preserveState: true
        }
      };

      spyOn(userPreference, 'get').and.callFake(key => {
        if (key === 'expandedSidenav') {
          return 'true';
        }
      });

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(true);
    });

    it('should get state from user settings as false', () => {
      appConfig.config = {
        sideNav: {
          expandedSidenav: false,
          preserveState: true
        }
      };

      spyOn(userPreference, 'get').and.callFake(key => {
        if (key === 'expandedSidenav') {
          return 'false';
        }
      });

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(false);
    });
  });

  it('should reset selection before navigation', done => {
    fixture.detectChanges();
    const selection = [<any>{ entry: { id: 'nodeId', name: 'name' } }];
    store.dispatch(new SetSelectedNodesAction(selection));

    router.navigateByUrl('somewhere/over/the/rainbow');
    fixture.detectChanges();
    store.select(getAppSelection).subscribe(state => {
      expect(state.isEmpty).toBe(true);
      done();
    });
  });

  it('should not reset selection if route is `/search`', done => {
    fixture.detectChanges();
    const selection = [<any>{ entry: { id: 'nodeId', name: 'name' } }];
    store.dispatch(new SetSelectedNodesAction(selection));

    router.navigateByUrl('/search;q=');
    fixture.detectChanges();
    store.select(getAppSelection).subscribe(state => {
      expect(state.isEmpty).toBe(false);
      done();
    });
  });

  it('should close menu on mobile screen size', () => {
    component.minimizeSidenav = false;
    component.layout.container = {
      isMobileScreenSize: true,
      toggleMenu: () => {}
    };

    spyOn(component.layout.container, 'toggleMenu');
    fixture.detectChanges();

    component.hideMenu(<any>{ preventDefault: () => {} });

    expect(component.layout.container.toggleMenu).toHaveBeenCalled();
  });

  it('should close menu on mobile screen size also when minimizeSidenav true', () => {
    fixture.detectChanges();
    component.minimizeSidenav = true;
    component.layout.container = {
      isMobileScreenSize: true,
      toggleMenu: () => {}
    };

    spyOn(component.layout.container, 'toggleMenu');
    fixture.detectChanges();

    component.hideMenu(<any>{ preventDefault: () => {} });

    expect(component.layout.container.toggleMenu).toHaveBeenCalled();
  });
});
