/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

/*
import { SidenavViewsManagerDirective } from './sidenav-views-manager.directive';
import { NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

class RouterMock {
  private subject = new Subject();
  public events = this.subject.asObservable();

  navigate(url = '') {
    const navigationEnd = new NavigationEnd(0, '', url);
    this.subject.next(navigationEnd);
  }

  destroy() {
    this.subject.next(null);
    this.subject.complete();
    this.subject = null;
  }
}

describe('SidenavViewsManagerDirective', () => {
  let component;
  let router;

  beforeEach(() => {
    router = <any>new RouterMock();
    component = new SidenavViewsManagerDirective(router, null, null);
  });

  afterEach(() => {
    router.destroy();
  });

  describe('Router events', () => {
    it('should set minimizeSidenav to true when url is in minimizeConditions', () => {
      router.navigate('/search/');
      expect(component.minimizeSidenav).toBe(true);
    });

    it('should set minimizeSidenav to false when url is not in minimizeConditions', () => {
      router.navigate('/somewhere/');
      expect(component.minimizeSidenav).toBe(false);
    });

    it('should set hideSidenav property to true when url is in hideConditions', () => {
      router.navigate('/preview/');
      expect(component.hideSidenav).toBe(true);
    });

    it('should set hideSidenav property to false when url is not in hideConditions', () => {
      router.navigate('somewhere');
      expect(component.hideSidenav).toBe(false);
    });
  });
});
*/
