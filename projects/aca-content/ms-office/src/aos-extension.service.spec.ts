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

import { TestBed } from '@angular/core/testing';
import { AosEditOnlineService } from './aos-extension.service';
import { AppConfigService, AuthenticationService, AuthModule, NotificationService } from '@alfresco/adf-core';
import { LibTestingModule } from '@alfresco/aca-shared';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AosEditOnlineService', () => {
  let aosEditOnlineService: AosEditOnlineService;
  let notificationService: NotificationService;
  let authenticationService: AuthenticationService;
  let appConfigService: AppConfigService;
  let userAgent: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule, MatSnackBarModule, AuthModule.forRoot()]
    });

    aosEditOnlineService = TestBed.inject(AosEditOnlineService);
    notificationService = TestBed.inject(NotificationService);
    authenticationService = TestBed.inject(AuthenticationService);
    appConfigService = TestBed.inject(AppConfigService);

    spyOn(authenticationService, 'getEcmUsername').and.returnValue('user1');
    spyOn(appConfigService, 'get').and.returnValue('http://localhost:3000');
    userAgent = spyOnProperty(navigator, 'userAgent').and.returnValue('mac');
  });

  it('should raise error if file is already locked by another user', () => {
    const showError = spyOn(notificationService, 'showError').and.stub();
    const node: any = {
      id: 'node1',
      isFile: true,
      isLocked: true,
      properties: {
        'cm:lockType': 'WRITE_LOCK',
        'cm:lockOwner': { id: 'user2' }
      }
    };

    aosEditOnlineService.onActionEditOnlineAos(node);
    expect(showError).toHaveBeenCalledWith(`AOS.ERRORS.ALREADY_LOCKED`, null, { nodeId: 'node1', lockOwner: 'user2' });
  });

  it('should open document if locked by the owner', () => {
    const openByUrl = spyOn(aosEditOnlineService, 'openByUrl').and.stub();

    const node: any = {
      id: 'node1',
      name: 'file.docx',
      isFile: true,
      isLocked: true,
      properties: {
        'cm:lockType': 'READ_ONLY_LOCK',
        'cm:lockOwner': { id: 'user1' }
      }
    };

    aosEditOnlineService.onActionEditOnlineAos(node);
    // eslint-disable-next-line @cspell/spellchecker
    expect(openByUrl).toHaveBeenCalledWith('ms-word', 'http://localhost:3000/Company Home/_aos_nodeid/node1/file.docx');
  });

  it('should open document for node with 1 path segment', () => {
    const openByUrl = spyOn(aosEditOnlineService, 'openByUrl').and.stub();

    const node: any = {
      id: 'node1',
      name: 'file.docx',
      isFile: true,
      isLocked: false,
      path: {
        elements: [{ name: 'folder1' }]
      },
      properties: {}
    };

    aosEditOnlineService.onActionEditOnlineAos(node);
    expect(openByUrl).toHaveBeenCalledWith('ms-word', 'http://localhost:3000/file.docx');
  });

  it('should open document for node with multiple path segments', () => {
    const openByUrl = spyOn(aosEditOnlineService, 'openByUrl').and.stub();

    const node: any = {
      id: 'node1',
      name: 'file.docx',
      isFile: true,
      isLocked: false,
      path: {
        elements: [{ name: 'parent' }, { name: 'child' }]
      },
      properties: {}
    };

    aosEditOnlineService.onActionEditOnlineAos(node);
    expect(openByUrl).toHaveBeenCalledWith('ms-word', 'http://localhost:3000/child/_aos_nodeid/node1/file.docx');
  });

  it('should raise error when protocol handler is not supported', () => {
    const showError = spyOn(notificationService, 'showError').and.stub();

    const node: any = {
      id: 'node1',
      name: 'file.txt',
      isFile: true,
      isLocked: false,
      properties: {}
    };

    aosEditOnlineService.onActionEditOnlineAos(node);
    expect(showError).toHaveBeenCalledWith('AOS.ERRORS.MISSING_PROTOCOL_HANDLER', null, { nodeName: 'file.txt' });
  });

  it('should raise error for unsupported platform', () => {
    const showError = spyOn(notificationService, 'showError').and.stub();
    userAgent.and.returnValue('unknown');

    const node: any = {
      id: 'node1',
      name: 'file.docx',
      isFile: true,
      isLocked: false,
      properties: {}
    };

    aosEditOnlineService.onActionEditOnlineAos(node);
    expect(showError).toHaveBeenCalledWith('AOS.ERRORS.UNSUPPORTED_PLATFORM');
  });
});
