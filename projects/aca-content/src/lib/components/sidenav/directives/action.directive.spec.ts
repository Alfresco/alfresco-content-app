/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { ActionDirective } from './action.directive';

describe('ActionDirective', () => {
  let directive: ActionDirective;
  const routeMock: any = {
    navigate: jasmine.createSpy('navigate'),
    parseUrl: () => ({
      root: {
        children: []
      }
    })
  };
  const storeMock: any = {
    dispatch: jasmine.createSpy('dispatch')
  };

  beforeEach(() => {
    directive = new ActionDirective(routeMock, storeMock);
  });

  it('should navigate if action is route', () => {
    directive.action = { url: 'dummy' };
    directive.onClick();
    expect(routeMock.navigate).toHaveBeenCalled();
  });

  it('should navigate to external url', () => {
    const previewWindowMock = {
      document: {
        write() {},
        body: {
          setAttribute() {}
        }
      }
    } as unknown as Window;
    const windowSpy = spyOn(window, 'open').and.returnValue(previewWindowMock);

    directive.action = { externalUrl: 'google.com' };
    directive.onClick();
    expect(windowSpy).toHaveBeenCalled();
  });

  it('should dispatch store action', () => {
    directive.action = { click: {} };
    directive.onClick();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });
});
