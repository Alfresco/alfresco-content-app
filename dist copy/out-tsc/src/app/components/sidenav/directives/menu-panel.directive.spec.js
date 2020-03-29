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
var RouterStub = /** @class */ (function() {
  function RouterStub(url) {
    if (url === void 0) {
      url = 'some-url';
    }
    this.subject = new Subject();
    this.events = this.subject.asObservable();
    this.url = url;
  }
  RouterStub.prototype.parseUrl = function() {
    return {
      root: {
        children: []
      }
    };
  };
  RouterStub.prototype.navigate = function(nextUrl) {
    var navigationEnd = new NavigationEnd(0, this.url, nextUrl);
    this.subject.next(navigationEnd);
  };
  return RouterStub;
})();
describe('MenuPanelDirective', function() {
  var mockStore = {
    dispatch: jasmine.createSpy('dispatch')
  };
  var mockMatExpansionPanel = {
    expanded: false,
    children: []
  };
  describe('hasActiveLinks()', function() {
    it('should return true if child is active route', function() {
      var router = new RouterStub('dummy-route-2');
      var item = {
        children: [{ url: 'dummy-route-1' }, { url: 'dummy-route-2' }]
      };
      var directive = new MenuPanelDirective(mockStore, router);
      directive.acaMenuPanel = item;
      expect(directive.hasActiveLinks()).toBe(true);
    });
    it('should return false if no child is active route', function() {
      var router = new RouterStub('other');
      var item = {
        children: [{ url: 'dummy-route-1' }, { url: 'dummy-route-2' }]
      };
      var directive = new MenuPanelDirective(mockStore, router);
      directive.acaMenuPanel = item;
      expect(directive.hasActiveLinks()).toBe(false);
    });
  });
  describe('navigation', function() {
    it('should navigate to first child if none is active route', function() {
      var router = new RouterStub('other');
      spyOn(router, 'navigate').and.callThrough();
      var item = {
        children: [{ url: 'dummy-route-1' }, { url: 'dummy-route-2' }]
      };
      mockMatExpansionPanel.expanded = true;
      var directive = new MenuPanelDirective(mockStore, router);
      directive.acaMenuPanel = item;
      directive.menuOpened();
      expect(router.navigate).toHaveBeenCalledWith(['dummy-route-1']);
    });
    it('should not navigate to first child if one is active route', function() {
      var router = new RouterStub('dummy-route-2');
      spyOn(router, 'navigate').and.callThrough();
      var item = {
        children: [{ url: 'dummy-route-1' }, { url: 'dummy-route-2' }]
      };
      var directive = new MenuPanelDirective(mockStore, router);
      directive.acaMenuPanel = item;
      mockMatExpansionPanel.expanded = true;
      directive.menuOpened();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
//# sourceMappingURL=menu-panel.directive.spec.js.map
