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

import { FileUploadCompleteEvent, FileUploadDeleteEvent, UploadService } from '@alfresco/adf-content-services';
import { Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PageComponent } from '@alfresco/aca-shared';

export const testHeader = <T extends PageComponent>(component: Type<T>) => {
  describe('Header', () => {
    let fixture: ComponentFixture<T>;
    const getHeaderElement = () => fixture.debugElement.query(By.css('.aca-header-container'));

    beforeEach(() => {
      fixture = TestBed.createComponent(component);
      fixture.detectChanges();
    });

    it('should display header by default', () => {
      expect(getHeaderElement()).not.toBeNull();
    });
  });
};

export const testUploadEvents = <T extends PageComponent>(getComponent: () => T, getFixture: () => ComponentFixture<T>) => {
  describe('upload events', () => {
    beforeEach(() => {
      const component: PageComponent = getComponent();
      spyOn(component, 'reload');
      spyOn(component, 'reloadWithoutResettingSelection');
      getFixture().detectChanges();
    });

    it('should call reloadWithoutResettingSelection and not reload on fileUploadComplete', fakeAsync(() => {
      TestBed.inject(UploadService).fileUploadComplete.next({} as FileUploadCompleteEvent);
      tick(300);
      const component = getComponent();
      expect(component.reloadWithoutResettingSelection).toHaveBeenCalled();
      expect(component.reload).not.toHaveBeenCalled();
    }));

    it('should call reloadWithoutResettingSelection and not reload on fileUploadDeleted', fakeAsync(() => {
      TestBed.inject(UploadService).fileUploadDeleted.next({} as FileUploadDeleteEvent);
      tick(300);
      const component = getComponent();
      expect(component.reloadWithoutResettingSelection).toHaveBeenCalled();
      expect(component.reload).not.toHaveBeenCalled();
    }));
  });
};
