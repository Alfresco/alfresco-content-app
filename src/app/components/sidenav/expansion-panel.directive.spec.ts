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

import { NavigationEnd } from '@angular/router';
import { AcaExpansionPanelDirective } from './expansion-panel.directive';
import { Subject } from 'rxjs';

class RouterStub {
  url;
  private subject = new Subject();
  events = this.subject.asObservable();

  constructor(url = 'some-url') {
    this.url = url;
  }

  navigate(nextUrl: string) {
    const navigationEnd = new NavigationEnd(0, this.url, nextUrl);
    this.subject.next(navigationEnd);
  }
}

describe('AcaExpansionPanel', () => {
  const item = {
    children: [{ url: 'dummy-route-1' }, { url: 'dummy-route-2' }]
  };

  it('should set panel as selected on initialization if url contains child url', () => {
    const router: any = new RouterStub('dummy-route-2');
    const directive = new AcaExpansionPanelDirective(router, null);

    directive.acaExpansionPanel = item;
    directive.ngOnInit();

    expect(directive.selected).toBe(true);
  });

  it('should not set panel as selected on initialization if url does not contain child url', () => {
    const router: any = new RouterStub('dummy-route-other');
    const directive = new AcaExpansionPanelDirective(router, null);

    directive.acaExpansionPanel = item;
    directive.ngOnInit();

    expect(directive.selected).toBe(false);
  });

  it('should go on first child url when expended and url does not contain any child url', () => {
    const router: any = new RouterStub();
    spyOn(router, 'navigate');
    const expansionPanelInstance: any = { expanded: true };
    const directive = new AcaExpansionPanelDirective(
      router,
      expansionPanelInstance
    );
    directive.acaExpansionPanel = item;

    directive.ngOnInit();
    directive.onClick();

    expect(router.navigate).toHaveBeenCalledWith(['dummy-route-1']);
  });

  it('should not go on first child url when expended and url contains any child url', () => {
    const router: any = new RouterStub('dummy-route-2');
    spyOn(router, 'navigate');
    const expansionPanelInstance: any = { expanded: true };
    const directive = new AcaExpansionPanelDirective(
      router,
      expansionPanelInstance
    );
    directive.acaExpansionPanel = item;

    directive.ngOnInit();
    directive.onClick();

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should set panel selected on navigation change', done => {
    const router: any = new RouterStub();
    const directive = new AcaExpansionPanelDirective(router, null);
    directive.acaExpansionPanel = item;

    directive.ngOnInit();

    router.navigate('dummy-route-1');
    done();

    expect(directive.selected).toBe(true);

    router.navigate('some-url');
    done();

    expect(directive.selected).toBe(false);
  });
});
