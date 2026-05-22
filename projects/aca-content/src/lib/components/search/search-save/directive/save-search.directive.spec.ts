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
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';
import { SaveSearchDirective } from './save-search.directive';
import { SaveSearchDialogComponent } from '../dialog/save-search-dialog.component';
import { SaveSearchDirectiveDialogData } from '../dialog/save-search-directive-dialog-data';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-test-component',
  template: '<div acaSaveSearch="searchQuery" (searchSaved)="onSaveSearchSuccess($event)" acaSaveSearchQuery="encodedQuery"></div>',
  imports: [SaveSearchDirective]
})
class TestComponent {
  searchQuery = 'encodedQuery';
  isSavedWithSuccess = false;

  onSaveSearchSuccess(value: boolean): void {
    this.isSavedWithSuccess = value;
  }
}

describe('SaveSearchDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;
  let dialog: MatDialog;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [SaveSearchDirective, TestComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => ({
              afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(true))
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

  describe('Click on save search directive', () => {
    it('should prevent the default click action', () => {
      const event = new MouseEvent('click');
      spyOn(event, 'preventDefault');

      element.nativeElement.dispatchEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should open the dialog with the correct configuration', () => {
      spyOn(dialog, 'open');
      element.nativeElement.click();

      const expectedConfig: MatDialogConfig<SaveSearchDirectiveDialogData> = {
        data: { searchUrl: 'encodedQuery' },
        restoreFocus: true,
        ariaLabelledBy: 'aca-save-search-dialog-title'
      };

      expect(dialog.open).toHaveBeenCalledWith(SaveSearchDialogComponent, expectedConfig);
    });

    it('should call setAttribute on container element', () => {
      const overlayContainer = TestBed.inject(OverlayContainer);
      const containerElement = document.createElement('div');
      spyOn(containerElement, 'setAttribute');
      spyOn(overlayContainer, 'getContainerElement').and.returnValue(containerElement);

      element.nativeElement.click();
      expect(containerElement.setAttribute).toHaveBeenCalledWith('role', 'dialog');
    });

    it('should open the dialog with the correct configuration', () => {
      spyOn(dialog, 'open');
      element.nativeElement.click();

      const expectedConfig: MatDialogConfig<SaveSearchDirectiveDialogData> = {
        data: { searchUrl: 'encodedQuery' },
        restoreFocus: true,
        ariaLabelledBy: 'aca-save-search-dialog-title'
      };

      expect(dialog.open).toHaveBeenCalledWith(SaveSearchDialogComponent, expectedConfig);
    });

    it('should emit event on save search success', () => {
      const afterClosed$ = new Subject<boolean>();

      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => afterClosed$.asObservable()
      } as MatDialogRef<SaveSearchDialogComponent>);

      element.nativeElement.click();

      afterClosed$.next(true);
      afterClosed$.complete();
      fixture.detectChanges();

      expect(fixture.componentInstance.isSavedWithSuccess).toBe(true);
    });
  });
});
