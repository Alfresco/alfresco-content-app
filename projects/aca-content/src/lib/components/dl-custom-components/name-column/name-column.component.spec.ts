/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CustomNameColumnComponent } from './name-column.component';
import { provideStore } from '@ngrx/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopTranslateModule, provideCoreAuth } from '@alfresco/adf-core';

describe('CustomNameColumnComponent', () => {
  let fixture: ComponentFixture<CustomNameColumnComponent>;
  let component: CustomNameColumnComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, CustomNameColumnComponent],
      providers: [
        provideCoreAuth(),
        provideStore(
          { app: (state) => state },
          {
            initialState: {
              app: {
                selection: {
                  nodes: [],
                  libraries: [],
                  isEmpty: true,
                  count: 0
                }
              }
            }
          }
        )
      ]
    });

    fixture = TestBed.createComponent(CustomNameColumnComponent);
    component = fixture.componentInstance;
  });

  it('should not render lock element if file is not locked', () => {
    component.context = {
      row: {
        node: {
          entry: {
            isFile: true,
            id: 'nodeId',
            name: 'test-file.txt'
          }
        },
        getValue: (key: string) => key
      }
    };

    component.ngOnInit();
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('aca-locked-by')).toBe(null);
  });

  it('should not render lock element if node is not a file', () => {
    component.context = {
      row: {
        node: {
          entry: {
            isFile: false,
            id: 'nodeId',
            name: 'test-folder'
          }
        },
        getValue: (key: string) => key
      }
    };

    component.ngOnInit();
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('aca-locked-by')).toBe(null);
  });

  it('should render lock element if file is locked', () => {
    component.context = {
      row: {
        node: {
          entry: {
            isFile: true,
            id: 'nodeId',
            name: 'locked-file.txt',
            properties: { 'cm:lockType': 'WRITE_LOCK' }
          }
        },
        getValue: (key: string) => key
      }
    };

    component.ngOnInit();
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('aca-locked-by')).not.toBe(null);
  });

  it('should call parent component onClick method', () => {
    const event = new MouseEvent('click');
    spyOn(component, 'onClick');

    component.onLinkClick(event);

    expect(component.onClick).toHaveBeenCalled();
  });

  it('should prevent event propagation', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.onLinkClick(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should pass node to badge component', () => {
    const badgeElement = fixture.debugElement.query(By.css('aca-datatable-cell-badges'));
    expect(badgeElement).not.toBe(null);
    expect(badgeElement.componentInstance.node).toBe(component.node);
  });
});
