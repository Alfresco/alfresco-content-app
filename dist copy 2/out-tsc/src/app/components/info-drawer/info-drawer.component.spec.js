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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { InfoDrawerComponent } from './info-drawer.component';
import { TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  SetInfoDrawerStateAction,
  ToggleInfoDrawerAction
} from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppExtensionService } from '../../extensions/extension.service';
import { ContentApiService } from '@alfresco/aca-shared';
import { of } from 'rxjs';
describe('InfoDrawerComponent', function() {
  var fixture;
  var component;
  var contentApiService;
  var tab;
  var appExtensionService;
  var storeMock = {
    dispatch: jasmine.createSpy('dispatch')
  };
  var extensionServiceMock = {
    getSidebarTabs: function() {}
  };
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [InfoDrawerComponent],
      providers: [
        ContentApiService,
        { provide: AppExtensionService, useValue: extensionServiceMock },
        { provide: Store, useValue: storeMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(InfoDrawerComponent);
    component = fixture.componentInstance;
    appExtensionService = TestBed.get(AppExtensionService);
    contentApiService = TestBed.get(ContentApiService);
    tab = { title: 'tab1' };
    spyOn(appExtensionService, 'getSidebarTabs').and.returnValue([tab]);
  });
  afterEach(function() {
    fixture.destroy();
  });
  it('should get tabs configuration on initialization', function() {
    fixture.detectChanges();
    expect(component.tabs).toEqual([tab]);
  });
  it('should set state to false OnDestroy event', function() {
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      new SetInfoDrawerStateAction(false)
    );
  });
  it('should set displayNode when node is library', async(function() {
    spyOn(contentApiService, 'getNodeInfo');
    var nodeMock = {
      entry: { id: 'nodeId' },
      isLibrary: true
    };
    component.node = nodeMock;
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.displayNode).toBe(nodeMock);
    expect(contentApiService.getNodeInfo).not.toHaveBeenCalled();
  }));
  it('should call getNodeInfo() when node is a shared file', async(function() {
    var response = { entry: { id: 'nodeId' } };
    spyOn(contentApiService, 'getNodeInfo').and.returnValue(of(response));
    var nodeMock = { entry: { nodeId: 'nodeId' }, isLibrary: false };
    component.node = nodeMock;
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.displayNode).toBe(response);
    expect(contentApiService.getNodeInfo).toHaveBeenCalled();
  }));
  it('should call getNodeInfo() when node is a favorite file', async(function() {
    var response = { entry: { id: 'nodeId' } };
    spyOn(contentApiService, 'getNodeInfo').and.returnValue(of(response));
    var nodeMock = {
      entry: { id: 'nodeId', guid: 'guidId' },
      isLibrary: false
    };
    component.node = nodeMock;
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.displayNode).toBe(response);
    expect(contentApiService.getNodeInfo).toHaveBeenCalled();
  }));
  it('should call getNodeInfo() when node is a recent file', async(function() {
    var response = { entry: { id: 'nodeId' } };
    spyOn(contentApiService, 'getNodeInfo').and.returnValue(of(response));
    var nodeMock = {
      entry: {
        id: 'nodeId',
        content: { mimeType: 'image/jpeg' }
      },
      isLibrary: false
    };
    component.node = nodeMock;
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.displayNode).toBe(response);
    expect(contentApiService.getNodeInfo).toHaveBeenCalled();
  }));
  it('should dispatch close panel on Esc keyboard event', function() {
    var event = new KeyboardEvent('keydown', {
      code: 'Escape',
      key: 'Escape',
      keyCode: 27
    });
    fixture.detectChanges();
    fixture.debugElement.nativeElement.dispatchEvent(event);
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      new ToggleInfoDrawerAction()
    );
  });
});
//# sourceMappingURL=info-drawer.component.spec.js.map
