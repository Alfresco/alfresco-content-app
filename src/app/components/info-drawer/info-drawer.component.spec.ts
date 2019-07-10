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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { InfoDrawerComponent } from './info-drawer.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { SetInfoDrawerStateAction } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppExtensionService } from '../../extensions/extension.service';
import { ContentApiService } from '@alfresco/aca-shared';
import { of } from 'rxjs';

describe('InfoDrawerComponent', () => {
  let fixture: ComponentFixture<InfoDrawerComponent>;
  let component: InfoDrawerComponent;
  let contentApiService: ContentApiService;
  let tab;
  let appExtensionService: AppExtensionService;
  const storeMock = {
    dispatch: jasmine.createSpy('dispatch')
  };
  const extensionServiceMock = {
    getSidebarTabs: () => {}
  };

  beforeEach(() => {
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

    tab = <any>{ title: 'tab1' };
    spyOn(appExtensionService, 'getSidebarTabs').and.returnValue([tab]);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should get tabs configuration on initialization', () => {
    fixture.detectChanges();

    expect(component.tabs).toEqual([tab]);
  });

  it('should set state to false OnDestroy event', () => {
    fixture.detectChanges();
    component.ngOnDestroy();

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      new SetInfoDrawerStateAction(false)
    );
  });

  it('should set displayNode when node is from personal list', () => {
    spyOn(contentApiService, 'getNodeInfo');
    const nodeMock = <any>{ entry: { id: 'nodeId', aspectNames: [] } };
    component.node = nodeMock;

    fixture.detectChanges();
    component.ngOnChanges();

    expect(component.displayNode).toBe(nodeMock.entry);
    expect(contentApiService.getNodeInfo).not.toHaveBeenCalled();
  });

  it('should set displayNode when node is library', async(() => {
    spyOn(contentApiService, 'getNodeInfo');
    const nodeMock = <any>{
      entry: { id: 'nodeId' },
      isLibrary: true
    };
    component.node = nodeMock;

    fixture.detectChanges();
    component.ngOnChanges();

    expect(component.displayNode).toBe(nodeMock);
    expect(contentApiService.getNodeInfo).not.toHaveBeenCalled();
  }));

  it('should call getNodeInfo() when node is a shared file', async(() => {
    const response = <any>{ entry: { id: 'nodeId' } };
    spyOn(contentApiService, 'getNodeInfo').and.returnValue(of(response));
    const nodeMock = <any>{ entry: { nodeId: 'nodeId' }, isLibrary: false };
    component.node = nodeMock;

    fixture.detectChanges();
    component.ngOnChanges();

    expect(component.displayNode).toBe(response);
    expect(contentApiService.getNodeInfo).toHaveBeenCalled();
  }));

  it('should call getNodeInfo() when node is a favorite file', async(() => {
    const response = <any>{ entry: { id: 'nodeId' } };
    spyOn(contentApiService, 'getNodeInfo').and.returnValue(of(response));
    const nodeMock = <any>{
      entry: { id: 'nodeId', guid: 'guidId' },
      isLibrary: false
    };
    component.node = nodeMock;

    fixture.detectChanges();
    component.ngOnChanges();

    expect(component.displayNode).toBe(response);
    expect(contentApiService.getNodeInfo).toHaveBeenCalled();
  }));

  it('should call getNodeInfo() when node is a recent file', async(() => {
    const response = <any>{ entry: { id: 'nodeId' } };
    spyOn(contentApiService, 'getNodeInfo').and.returnValue(of(response));
    const nodeMock = <any>{
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
});
