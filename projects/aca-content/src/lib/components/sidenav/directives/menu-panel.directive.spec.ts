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

import { NavigationEnd } from '@angular/router';
import { MenuPanelDirective } from './menu-panel.directive';
import { Subject } from 'rxjs';

class RouterStub {
  url;
  private subject = new Subject();
  events = this.subject.asObservable();

  constructor(url = 'some-url') {
    this.url = url;
  }

  parseUrl() {
    return {
      root: {
        children: []
      }
    };
  }

  navigate(nextUrl: string) {
    const navigationEnd = new NavigationEnd(0, this.url, nextUrl);
    this.subject.next(navigationEnd);
  }
}

describe('MenuPanelDirective', () => {
  const mockStore: any = {
    dispatch: jasmine.createSpy('dispatch')
  };
  const mockMatExpansionPanel: any = {
    expanded: false,
    children: []
  };

  describe('hasActiveLinks()', () => {
    it('should return true if child is active route', () => {
      const router: any = new RouterStub('dummy-route-2');
      const item = {
        children: [{ url: 'dummy-route-1' }, { url: 'dummy-route-2' }]
      };
      const directive = new MenuPanelDirective(mockStore, router);

      directive.acaMenuPanel = item;

      expect(directive.hasActiveLinks()).toBe(true);
    });
    it('should return false if no child is active route', () => {
      const router: any = new RouterStub('other');
      const item = {
        children: [{ url: 'dummy-route-1' }, { url: 'dummy-route-2' }]
      };
      const directive = new MenuPanelDirective(mockStore, router);

      directive.acaMenuPanel = item;

      expect(directive.hasActiveLinks()).toBe(false);
    });
  });

  describe('navigation', () => {
    it('should navigate to first child if none is active route', () => {
      const router: any = new RouterStub('other');
      spyOn(router, 'navigate').and.callThrough();
      const item = {
        children: [{ url: 'dummy-route-1' }, { url: 'dummy-route-2' }]
      };

      mockMatExpansionPanel.expanded = true;

      const directive = new MenuPanelDirective(mockStore, router);

      directive.acaMenuPanel = item;

      directive.menuOpened();

      expect(router.navigate).toHaveBeenCalledWith(['dummy-route-1']);
    });

    it('should not navigate to first child if one is active route', () => {
      const router: any = new RouterStub('dummy-route-2');
      spyOn(router, 'navigate').and.callThrough();
      const item = {
        children: [{ url: 'dummy-route-1' }, { url: 'dummy-route-2' }]
      };

      const directive = new MenuPanelDirective(mockStore, router);

      directive.acaMenuPanel = item;
      mockMatExpansionPanel.expanded = true;

      directive.menuOpened();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
