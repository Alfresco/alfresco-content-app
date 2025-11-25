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

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SaveSearchDirective } from './save-search.directive';
import { SaveSearchDialogComponent } from '../dialog/save-search-dialog.component';

@Component({
  selector: 'app-test-component',
  template: '<div acaSaveSearch="searchQuery" acaSaveSearchQuery="encodedQuery"></div>',
  imports: [SaveSearchDirective]
})
class TestComponent {
  searchQuery = 'encodedQuery';
}

describe('SaveSearchDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;
  let dialog: MatDialog;

  const event = {
    type: 'click',
    preventDefault: jasmine.createSpy('preventDefault')
  };

  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [SaveSearchDirective, TestComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => ({
              afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.query(By.directive(SaveSearchDirective));
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should prevent the default click action', () => {
    element.triggerEventHandler('click', event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should open the dialog with the correct configuration', () => {
    spyOn(dialog, 'open');
    element.triggerEventHandler('click', event);

    const expectedConfig = {
      data: { searchUrl: 'encodedQuery' },
      restoreFocus: true
    };

    expect(dialog.open).toHaveBeenCalledWith(SaveSearchDialogComponent, expectedConfig);
  });
});
