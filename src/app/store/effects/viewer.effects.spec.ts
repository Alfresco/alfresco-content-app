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

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ViewerEffects } from './viewer.effects';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ViewFileAction, ViewNodeAction, SetSelectedNodesAction, SetCurrentFolderAction } from '@alfresco/aca-shared/store';

describe('ViewerEffects', () => {
  let store: Store<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([ViewerEffects])]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    spyOn(router, 'navigateByUrl').and.stub();
  });

  describe('ViewFile', () => {
    it('should preview file from store selection', fakeAsync(() => {
      const node: any = { entry: { isFile: true, id: 'someId' } };
      const folder: any = { isFolder: true, id: 'folder1' };
      store.dispatch(new SetCurrentFolderAction(folder));
      store.dispatch(new SetSelectedNodesAction([node]));
      tick(100);

      store.dispatch(new ViewFileAction());
      tick(100);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/folder1/preview/someId');
    }));
    it('should preview file from payload', fakeAsync(() => {
      const node: any = { entry: { isFile: true, id: 'someId' } };
      store.dispatch(new ViewFileAction(node));
      tick(100);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/preview/someId');
    }));
  });

  describe('ViewNode', () => {
    it('should open viewer from file location if', fakeAsync(() => {
      store.dispatch(new ViewNodeAction('nodeId', { location: 'some-location' }));
      tick(100);

      expect(router.navigateByUrl['calls'].argsFor(0)[0].toString()).toEqual('/some-location/(viewer:view/nodeId)?location=some-location');
    }));

    it('should navigate to viewer route if no location is passed', fakeAsync(() => {
      store.dispatch(new ViewNodeAction('nodeId'));
      tick(100);

      expect(router.navigateByUrl['calls'].argsFor(0)[0].toString()).toEqual('/view/(viewer:nodeId)');
    }));

    it('should navigate to viewer route with query param if path is passed', fakeAsync(() => {
      store.dispatch(new ViewNodeAction('nodeId', { path: 'absolute-path' }));
      tick(100);

      expect(router.navigateByUrl['calls'].argsFor(0)[0].toString()).toEqual('/view/(viewer:nodeId)?path=absolute-path');
    }));
  });
});
