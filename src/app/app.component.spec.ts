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

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component;
  const storeMock = <any>{
    dispatch: jasmine.createSpy('dispatch')
  };

  beforeAll(() => {
    component = new AppComponent(
      null,
      null,
      null,
      storeMock,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  });

  describe('onFileUploadedError', () => {
    afterEach(() => {
      storeMock.dispatch['calls'].reset();
    });

    it('should dispatch 403 error message', () => {
      component.onFileUploadedError({ error: { status: 403 } });
      expect(storeMock.dispatch['calls'].argsFor(0)[0].payload).toBe(
        'APP.MESSAGES.UPLOAD.ERROR.403'
      );
    });

    it('should dispatch 404 error message', () => {
      component.onFileUploadedError({ error: { status: 404 } });
      expect(storeMock.dispatch['calls'].argsFor(0)[0].payload).toBe(
        'APP.MESSAGES.UPLOAD.ERROR.404'
      );
    });

    it('should dispatch 409 error message', () => {
      component.onFileUploadedError({ error: { status: 409 } });
      expect(storeMock.dispatch['calls'].argsFor(0)[0].payload).toBe(
        'APP.MESSAGES.UPLOAD.ERROR.CONFLICT'
      );
    });

    it('should dispatch 500 error message', () => {
      component.onFileUploadedError({ error: { status: 500 } });
      expect(storeMock.dispatch['calls'].argsFor(0)[0].payload).toBe(
        'APP.MESSAGES.UPLOAD.ERROR.500'
      );
    });

    it('should dispatch 504 error message', () => {
      component.onFileUploadedError({ error: { status: 504 } });
      expect(storeMock.dispatch['calls'].argsFor(0)[0].payload).toBe(
        'APP.MESSAGES.UPLOAD.ERROR.504'
      );
    });

    it('should dispatch generic error message', () => {
      component.onFileUploadedError({ error: { status: 999 } });
      expect(storeMock.dispatch['calls'].argsFor(0)[0].payload).toBe(
        'APP.MESSAGES.UPLOAD.ERROR.GENERIC'
      );
    });
  });
});
