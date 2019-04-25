/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed, fakeAsync, async, tick } from '@angular/core/testing';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  setupTestBed,
  CoreModule,
  SharedLinksApiService,
  NodesApiService,
  NotificationService
} from '@alfresco/adf-core';
import { ContentNodeShareModule } from './content-node-share.module';
import { ShareDialogComponent } from './content-node-share.dialog';
import * as moment from 'moment';
import { Store } from '@ngrx/store';

describe('ShareDialogComponent', () => {
  let node;
  let matDialog: MatDialog;
  const notificationServiceMock = {
    openSnackMessage: jasmine.createSpy('openSnackMessage')
  };
  let sharedLinksApiService: SharedLinksApiService;
  let nodesApiService: NodesApiService;
  let fixture;
  let component;
  const storeMock = {
    dispatch: jasmine.createSpy('dispatch')
  };

  setupTestBed({
    imports: [
      NoopAnimationsModule,
      CoreModule.forRoot(),
      ContentNodeShareModule
    ],
    providers: [
      NodesApiService,
      SharedLinksApiService,
      { provide: Store, useValue: storeMock },
      { provide: NotificationService, useValue: notificationServiceMock },
      { provide: MatDialogRef, useValue: {} },
      { provide: MAT_DIALOG_DATA, useValue: {} }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDialogComponent);
    matDialog = TestBed.get(MatDialog);
    sharedLinksApiService = TestBed.get(SharedLinksApiService);
    nodesApiService = TestBed.get(NodesApiService);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    node = {
      entry: {
        id: 'nodeId',
        allowableOperations: ['update'],
        isFile: true,
        properties: {}
      }
    };
  });

  afterEach(() => {
    fixture.destroy();
  });

  it(`should toggle share action when property 'sharedId' does not exists`, fakeAsync(() => {
    spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(
      of({
        entry: { id: 'sharedId', sharedId: 'sharedId' }
      })
    );

    component.data = {
      node,
      permission: true,
      baseShareUrl: 'some-url/'
    };

    fixture.detectChanges();
    tick(500);

    expect(sharedLinksApiService.createSharedLinks).toHaveBeenCalled();
    expect(
      fixture.nativeElement.querySelector('input[formcontrolname="sharedUrl"]')
        .value
    ).toBe('some-url/sharedId');
    expect(
      fixture.nativeElement.querySelector(
        '.mat-slide-toggle[data-automation-id="adf-share-toggle"'
      ).classList
    ).toContain('mat-checked');
  }));

  it(`should not toggle share action when file has 'sharedId' property`, fakeAsync(() => {
    spyOn(sharedLinksApiService, 'createSharedLinks');
    node.entry.properties['qshare:sharedId'] = 'sharedId';

    component.data = {
      node,
      permission: true,
      baseShareUrl: 'some-url/'
    };

    fixture.detectChanges();
    tick(500);

    expect(sharedLinksApiService.createSharedLinks).not.toHaveBeenCalled();
    expect(
      fixture.nativeElement.querySelector('input[formcontrolname="sharedUrl"]')
        .value
    ).toBe('some-url/sharedId');
    expect(
      fixture.nativeElement.querySelector(
        '.mat-slide-toggle[data-automation-id="adf-share-toggle"'
      ).classList
    ).toContain('mat-checked');
  }));

  xit(`should copy shared link and notify on button event`, async(() => {
    node.entry.properties['qshare:sharedId'] = 'sharedId';
    spyOn(document, 'execCommand').and.callThrough();

    component.data = {
      node,
      permission: true,
      baseShareUrl: 'some-url/'
    };

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      fixture.nativeElement
        .querySelector('.adf-input-action')
        .dispatchEvent(new MouseEvent('click'));

      fixture.detectChanges();

      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(notificationServiceMock.openSnackMessage).toHaveBeenCalledWith(
        'SHARE.CLIPBOARD-MESSAGE'
      );
    });
  }));

  it('should open a confirmation dialog when unshare button is triggered', () => {
    spyOn(matDialog, 'open').and.returnValue({ beforeClose: () => of(false) });
    spyOn(sharedLinksApiService, 'deleteSharedLink');
    node.entry.properties['qshare:sharedId'] = 'sharedId';

    component.data = {
      node,
      permission: true,
      baseShareUrl: 'some-url/'
    };

    fixture.detectChanges();

    fixture.nativeElement
      .querySelector(
        '.mat-slide-toggle[data-automation-id="adf-share-toggle"] label'
      )
      .dispatchEvent(new MouseEvent('click'));

    fixture.detectChanges();

    expect(matDialog.open).toHaveBeenCalled();
  });

  it('should unshare file when confirmation dialog returns true', fakeAsync(() => {
    spyOn(matDialog, 'open').and.returnValue({ beforeClose: () => of(true) });
    spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(of(null));
    node.entry.properties['qshare:sharedId'] = 'sharedId';

    component.data = {
      node,
      permission: true,
      baseShareUrl: 'some-url/'
    };

    fixture.detectChanges();

    fixture.nativeElement
      .querySelector(
        '.mat-slide-toggle[data-automation-id="adf-share-toggle"] label'
      )
      .dispatchEvent(new MouseEvent('click'));

    fixture.detectChanges();

    expect(sharedLinksApiService.deleteSharedLink).toHaveBeenCalled();
  }));

  it('should not unshare file when confirmation dialog returns false', fakeAsync(() => {
    spyOn(matDialog, 'open').and.returnValue({ beforeClose: () => of(false) });
    spyOn(sharedLinksApiService, 'deleteSharedLink');
    node.entry.properties['qshare:sharedId'] = 'sharedId';

    component.data = {
      node,
      permission: true,
      baseShareUrl: 'some-url/'
    };

    fixture.detectChanges();

    fixture.nativeElement
      .querySelector(
        '.mat-slide-toggle[data-automation-id="adf-share-toggle"] label'
      )
      .dispatchEvent(new MouseEvent('click'));

    fixture.detectChanges();

    expect(sharedLinksApiService.deleteSharedLink).not.toHaveBeenCalled();
  }));

  it('should reset expiration date when toggle is unchecked', () => {
    spyOn(nodesApiService, 'updateNode').and.returnValue(of({}));
    node.entry.properties['qshare:sharedId'] = 'sharedId';
    node.entry.properties['qshare:sharedId'] = '2017-04-15T18:31:37+00:00';

    component.data = {
      node,
      permission: true,
      baseShareUrl: 'some-url/'
    };

    fixture.detectChanges();

    component.form.controls['time'].setValue(moment());

    fixture.detectChanges();

    fixture.nativeElement
      .querySelector(
        '.mat-slide-toggle[data-automation-id="adf-expire-toggle"] label'
      )
      .dispatchEvent(new MouseEvent('click'));

    fixture.detectChanges();

    expect(nodesApiService.updateNode).toHaveBeenCalledWith('nodeId', {
      properties: { 'qshare:expiryDate': null }
    });

    expect(
      fixture.nativeElement.querySelector('input[formcontrolname="time"]').value
    ).toBe('');
  });

  it('should not allow expiration date action when node has no update permission', () => {
    node.entry.properties['qshare:sharedId'] = 'sharedId';

    component.data = {
      node,
      permission: false,
      baseShareUrl: 'some-url/'
    };

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('input[formcontrolname="time"]')
        .disabled
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector(
        '.mat-slide-toggle[data-automation-id="adf-expire-toggle"]'
      ).classList
    ).toContain('mat-disabled');
  });

  it('should show permission error notification on un-share action', () => {
    node.entry.properties['qshare:sharedId'] = 'sharedId';
    spyOn(matDialog, 'open').and.returnValue({ beforeClose: () => of(true) });
    spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(
      of(new Error('{"error": { "statusCode": 403  } }'))
    );
    component.data = {
      node,
      permission: false,
      baseShareUrl: 'some-url/'
    };

    fixture.detectChanges();

    fixture.nativeElement
      .querySelector(
        '.mat-slide-toggle[data-automation-id="adf-share-toggle"] label'
      )
      .dispatchEvent(new MouseEvent('click'));

    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should update node expiration date with selected date and time', () => {
    const date = moment();
    node.entry.properties['qshare:sharedId'] = 'sharedId';
    spyOn(nodesApiService, 'updateNode').and.returnValue(of({}));
    fixture.componentInstance.form.controls['time'].setValue(null);

    component.data = {
      node,
      permission: true,
      baseShareUrl: 'some-url/'
    };

    fixture.detectChanges();

    fixture.nativeElement
      .querySelector(
        'mat-slide-toggle[data-automation-id="adf-expire-toggle"] label'
      )
      .dispatchEvent(new MouseEvent('click'));

    fixture.componentInstance.form.controls['time'].setValue(date);
    fixture.detectChanges();

    expect(nodesApiService.updateNode).toHaveBeenCalledWith('nodeId', {
      properties: { 'qshare:expiryDate': date }
    });
  });
});
