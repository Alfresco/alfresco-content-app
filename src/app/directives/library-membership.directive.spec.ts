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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  AlfrescoApiService,
  AlfrescoApiServiceMock,
  AppConfigService,
  CoreModule,
  StorageService
} from '@alfresco/adf-core';
import { AppTestingModule } from '../testing/app-testing.module';
import { DirectivesModule } from './directives.module';
import { LibraryMembershipDirective } from './library-membership.directive';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { throwError } from 'rxjs';

describe('LibraryMembershipDirective', () => {
  let alfrescoApiService: AlfrescoApiService;
  let directive: LibraryMembershipDirective;
  let peopleApi;
  let addMembershipSpy;
  let getMembershipSpy;
  let deleteMembershipSpy;

  const testSiteEntry = {
    id: 'id-1',
    guid: 'site-1',
    title: 'aa t m',
    visibility: 'MODERATED'
  };
  const requestedMembershipResponse = {
    id: testSiteEntry.id,
    createdAt: '2018-11-14',
    site: testSiteEntry
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, DirectivesModule, CoreModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    });
    alfrescoApiService = new AlfrescoApiServiceMock(
      new AppConfigService(null),
      new StorageService()
    );
    peopleApi = alfrescoApiService.getInstance().core.peopleApi;
    directive = new LibraryMembershipDirective(alfrescoApiService);
  });

  describe('markMembershipRequest', () => {
    beforeEach(() => {
      getMembershipSpy = spyOn(
        peopleApi,
        'getSiteMembershipRequest'
      ).and.returnValue(
        Promise.resolve({ entry: requestedMembershipResponse })
      );
    });

    it('should not check membership requests if no entry is selected', fakeAsync(() => {
      const selection = {};
      const change = new SimpleChange(null, selection, true);
      directive.ngOnChanges({ selection: change });
      tick();
      expect(getMembershipSpy).not.toHaveBeenCalled();
    }));

    it('should check if a membership request exists for the selected library', fakeAsync(() => {
      const selection = { entry: {} };
      const change = new SimpleChange(null, selection, true);
      directive.ngOnChanges({ selection: change });
      tick();
      expect(getMembershipSpy.calls.count()).toBe(1);
    }));

    it('should remember when a membership request exists for selected library', fakeAsync(() => {
      const selection = { entry: testSiteEntry };
      const change = new SimpleChange(null, selection, true);
      directive.ngOnChanges({ selection: change });
      tick();
      expect(directive.targetSite.joinRequested).toBe(true);
    }));

    it('should remember when a membership request is not found for selected library', fakeAsync(() => {
      getMembershipSpy.and.returnValue(Promise.reject());

      const selection = { entry: testSiteEntry };
      const change = new SimpleChange(null, selection, true);
      directive.ngOnChanges({ selection: change });
      tick();
      expect(directive.targetSite.joinRequested).toBe(false);
    }));
  });

  describe('toggleMembershipRequest', () => {
    beforeEach(() => {
      getMembershipSpy = spyOn(
        peopleApi,
        'getSiteMembershipRequest'
      ).and.returnValue(
        Promise.resolve({ entry: requestedMembershipResponse })
      );
      addMembershipSpy = spyOn(
        peopleApi,
        'addSiteMembershipRequest'
      ).and.returnValue(
        Promise.resolve({ entry: requestedMembershipResponse })
      );
      deleteMembershipSpy = spyOn(
        peopleApi,
        'removeSiteMembershipRequest'
      ).and.returnValue(Promise.resolve({}));
    });

    it('should do nothing if there is no selected library ', fakeAsync(() => {
      const selection = {};
      const change = new SimpleChange(null, selection, true);
      directive.ngOnChanges({ selection: change });
      tick();
      directive.toggleMembershipRequest();
      tick();
      expect(addMembershipSpy).not.toHaveBeenCalled();
      expect(deleteMembershipSpy).not.toHaveBeenCalled();
    }));

    it('should delete membership request if there is one', fakeAsync(() => {
      const selection = { entry: testSiteEntry };
      const change = new SimpleChange(null, selection, true);
      directive.ngOnChanges({ selection: change });
      tick();
      directive.toggleMembershipRequest();
      tick();
      expect(deleteMembershipSpy).toHaveBeenCalled();
    }));

    it('should call API to make a membership request if there is none', fakeAsync(() => {
      const selection = { entry: { id: 'no-membership-requested' } };
      const change = new SimpleChange(null, selection, true);
      directive.ngOnChanges({ selection: change });
      tick();
      directive.toggleMembershipRequest();
      tick();
      expect(addMembershipSpy).toHaveBeenCalled();
      expect(deleteMembershipSpy).not.toHaveBeenCalled();
    }));

    it('should emit error when the request to join a library fails', fakeAsync(() => {
      spyOn(directive.error, 'emit');
      addMembershipSpy.and.returnValue(throwError('err'));

      const selection = { entry: { id: 'no-membership-requested' } };
      const change = new SimpleChange(null, selection, true);
      directive.ngOnChanges({ selection: change });
      tick();
      directive.toggleMembershipRequest();
      tick();
      expect(directive.error.emit).toHaveBeenCalled();
    }));

    it('should emit specific error message on invalid email address server error', fakeAsync(() => {
      const emitErrorSpy = spyOn(directive.error, 'emit');
      const selection = { entry: { id: 'no-membership-requested' } };
      const change = new SimpleChange(null, selection, true);
      directive.ngOnChanges({ selection: change });
      tick();

      const testData = [
        {
          fixture: 'Failed to resolve sender mail address',
          expected: 'APP.MESSAGES.ERRORS.INVALID_SENDER_EMAIL'
        },
        {
          fixture: 'All recipients for the mail action were invalid',
          expected: 'APP.MESSAGES.ERRORS.INVALID_RECEIVER_EMAIL'
        }
      ];

      testData.forEach(data => {
        addMembershipSpy.and.returnValue(throwError({ message: data.fixture }));
        emitErrorSpy.calls.reset();
        directive.toggleMembershipRequest();
        tick();
        expect(emitErrorSpy).toHaveBeenCalledWith({
          error: { message: data.fixture },
          i18nKey: data.expected
        });
      });
    }));
  });
});
