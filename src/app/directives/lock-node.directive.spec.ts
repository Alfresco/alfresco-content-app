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

import { Component, ViewChild } from '@angular/core';
import { LockNodeDirective } from './lock-node.directive';
import {
  AlfrescoApiService,
  AlfrescoApiServiceMock,
  setupTestBed,
  CoreModule
} from '@alfresco/adf-core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

@Component({
  selector: 'app-test-component',
  template: `
    <button #lock="lockNode" [acaLockNode]="selection"></button>
  `
})
class TestComponent {
  @ViewChild('lock')
  directive: LockNodeDirective;

  selection = null;
}

describe('LockNodeDirective', () => {
  let fixture;
  let api;
  let component;

  setupTestBed({
    imports: [CoreModule.forRoot()],
    declarations: [TestComponent, LockNodeDirective],
    providers: [
      {
        provide: AlfrescoApiService,
        useClass: AlfrescoApiServiceMock
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.selection = null;
    api = TestBed.get(AlfrescoApiService);
  });

  it('should return false if selection is null', () => {
    component.selection = null;
    fixture.detectChanges();
    expect(component.directive.isNodeLocked()).toBe(false);
  });

  it('should return false if selection is not locked', () => {
    component.selection = { entry: { name: 'test-name', properties: {} } };
    fixture.detectChanges();
    expect(component.directive.isNodeLocked()).toBe(false);
  });

  it('should return true if selection is locked', () => {
    component.selection = {
      entry: {
        name: 'test-name',
        properties: { 'cm:lockType': 'WRITE_LOCK' }
      }
    };

    fixture.detectChanges();
    expect(component.directive.isNodeLocked()).toBe(true);
  });

  it('should lock selection', fakeAsync(() => {
    component.selection = {
      entry: {
        id: 'id',
        name: 'test-name',
        properties: {}
      }
    };

    spyOn(api.nodesApi, 'lockNode').and.returnValue(
      Promise.resolve({
        entry: { properties: { 'cm:lockType': 'WRITE_LOCK' } }
      })
    );

    fixture.detectChanges();

    component.directive.onClick();
    tick();
    fixture.detectChanges();

    expect(component.selection.entry.properties['cm:lockType']).toBe(
      'WRITE_LOCK'
    );
  }));

  it('should unlock selection', fakeAsync(() => {
    component.selection = {
      entry: {
        id: 'id',
        name: 'test-name',
        properties: {
          'cm:lockType': 'WRITE_LOCK'
        }
      }
    };

    spyOn(api.nodesApi, 'unlockNode').and.returnValue(
      Promise.resolve({
        entry: { properties: {} }
      })
    );

    fixture.detectChanges();
    component.directive.onClick();

    tick();
    fixture.detectChanges();

    expect(component.selection.entry.properties['cm:lockType']).toBe(undefined);
  }));
});
