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

import { ExtensionsDataLoaderGuard } from './extensions-data-loader.guard';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Subject, throwError } from 'rxjs';

describe('ExtensionsDataLoaderGuard', () => {
  let route: ActivatedRouteSnapshot;
  let emittedSpy;
  let completedSpy;
  let erroredSpy;

  describe('canActivate', () => {
    beforeEach(() => {
      route = {} as ActivatedRouteSnapshot;
      emittedSpy = jasmine.createSpy('emitted');
      completedSpy = jasmine.createSpy('completed');
      erroredSpy = jasmine.createSpy('errored');
    });

    it('should emit true and complete if no callback are present', () => {
      const guard = new ExtensionsDataLoaderGuard([]);

      guard.canActivate(route).subscribe(emittedSpy, erroredSpy, completedSpy);
      expect(emittedSpy).toHaveBeenCalledWith(true);
      expect(erroredSpy).not.toHaveBeenCalled();
      expect(completedSpy).toHaveBeenCalled();
    });

    it('should emit true and complete in case of only one callback is present, completed', () => {
      const subject = new Subject<true>();
      const guard = new ExtensionsDataLoaderGuard([() => subject.asObservable()]);

      guard.canActivate(route).subscribe(emittedSpy, erroredSpy, completedSpy);

      subject.next(true);
      expect(emittedSpy).not.toHaveBeenCalled();
      expect(erroredSpy).not.toHaveBeenCalled();
      expect(completedSpy).not.toHaveBeenCalled();

      subject.complete();
      expect(emittedSpy).toHaveBeenCalledWith(true);
      expect(erroredSpy).not.toHaveBeenCalled();
      expect(completedSpy).toHaveBeenCalled();
    });

    it('should emit true and complete in case of only one callback is present, errored', () => {
      const guard = new ExtensionsDataLoaderGuard([() => throwError(new Error())]);

      guard.canActivate(route).subscribe(emittedSpy, erroredSpy, completedSpy);
      expect(emittedSpy).toHaveBeenCalledWith(true);
      expect(erroredSpy).not.toHaveBeenCalled();
      expect(completedSpy).toHaveBeenCalled();
    });

    it('should NOT complete in case of multiple callbacks are present and not all of them have been completed', () => {
      const subject1 = new Subject<true>();
      const subject2 = new Subject<true>();
      const guard = new ExtensionsDataLoaderGuard([() => subject1.asObservable(), () => subject2.asObservable()]);

      guard.canActivate(route).subscribe(emittedSpy, erroredSpy, completedSpy);

      subject1.next();
      subject2.next();
      subject1.complete();
      expect(emittedSpy).not.toHaveBeenCalled();
      expect(erroredSpy).not.toHaveBeenCalled();
      expect(completedSpy).not.toHaveBeenCalled();
    });

    it('should emit true and complete in case of multiple callbacks are present and all of them have been completed', () => {
      const subject1 = new Subject<true>();
      const subject2 = new Subject<true>();
      const guard = new ExtensionsDataLoaderGuard([() => subject1.asObservable(), () => subject2.asObservable()]);

      guard.canActivate(route).subscribe(emittedSpy, erroredSpy, completedSpy);

      subject1.next();
      subject2.next();
      subject1.complete();
      subject2.complete();
      expect(emittedSpy).toHaveBeenCalledWith(true);
      expect(erroredSpy).not.toHaveBeenCalled();
      expect(completedSpy).toHaveBeenCalled();
    });

    it('should emit true and complete even if one of the observables are errored, to not block the application loading', () => {
      const subject1 = new Subject<true>();
      const guard = new ExtensionsDataLoaderGuard([() => subject1.asObservable(), () => throwError(new Error())]);

      guard.canActivate(route).subscribe(emittedSpy, erroredSpy, completedSpy);

      subject1.next();
      expect(emittedSpy).toHaveBeenCalledWith(true);
      expect(erroredSpy).not.toHaveBeenCalled();
      expect(completedSpy).toHaveBeenCalled();
    });

    it('should call canActivate only once', () => {
      const subject1 = new Subject<true>();
      const extensionLoaders = {
        fct1: () => subject1.asObservable()
      };
      const extensionLoaderSpy = spyOn(extensionLoaders, 'fct1').and.callThrough();
      const guard = new ExtensionsDataLoaderGuard([extensionLoaders.fct1]);

      guard.canActivate(route).subscribe(emittedSpy, erroredSpy, completedSpy);
      expect(extensionLoaderSpy).toHaveBeenCalled();

      extensionLoaderSpy.calls.reset();
      subject1.next(true);
      subject1.complete();
      guard.canActivate(route).subscribe(emittedSpy, erroredSpy, completedSpy);
      expect(extensionLoaderSpy).not.toHaveBeenCalled();
    });
  });
});
