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

import { TestBed } from '@angular/core/testing';
import { ViewNodeComponent } from './view-node.component';
import { Store } from '@ngrx/store';
import { CoreModule } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ViewNodeAction } from '@alfresco/aca-shared/store';

describe('ViewNodeComponent', () => {
  let component: ViewNodeComponent;
  let fixture;
  const mockRouter = {
    url: 'some-url'
  };
  const mockStore: any = {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select').and.returnValue(
      of({
        file: {
          entry: {
            id: 'nodeId'
          }
        }
      })
    )
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CoreModule.forRoot()],
      declarations: [ViewNodeComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter }
      ]
    });

    fixture = TestBed.createComponent(ViewNodeComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    mockStore.dispatch.calls.reset();
  });

  it('should render as a menu button', () => {
    component.data = {
      menuButton: true
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.mat-menu-item')).not.toBe(null);
  });

  it('should render as a icon button', () => {
    component.data = {
      iconButton: true
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.mat-icon-button')).not.toBe(null);
  });

  it('should call ViewNodeAction onClick event', () => {
    component.data = {
      iconButton: true
    };

    fixture.detectChanges();

    component.onClick();

    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should call ViewNodeAction for `app:filelink` node type', () => {
    const linkNode = {
      file: {
        entry: {
          id: 'nodeId',
          nodeType: 'app:filelink',
          properties: {
            'cm:destination': 'original-node-id'
          }
        }
      }
    };
    component.data = {
      iconButton: true
    };
    mockStore.select.and.returnValue(of(linkNode));

    fixture.detectChanges();

    component.onClick();

    const id = linkNode.file.entry.properties['cm:destination'];
    expect(mockStore.dispatch).toHaveBeenCalledWith(new ViewNodeAction(id, { location: mockRouter.url }));
  });
});
