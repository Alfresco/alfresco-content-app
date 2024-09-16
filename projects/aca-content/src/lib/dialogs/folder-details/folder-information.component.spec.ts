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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FolderInformationComponent } from './folder-information.component';
import { DIALOG_COMPONENT_DATA, RedirectAuthService } from '@alfresco/adf-core';
import { ContentService } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { EMPTY } from 'rxjs';
import { LibTestingModule } from '@alfresco/aca-shared';

describe('FolderInformationComponent', () => {
  let fixture: ComponentFixture<FolderInformationComponent>;

  const dialogData = {
    name: 'mock-folder',
    path: {
      name: 'mock-folder-path'
    },
    createdAt: new Date(2024, 1, 1, 11, 11),
    modifiedAt: new Date(2024, 2, 2, 22, 22)
  };

  const getValueFromElement = (id: string) => fixture.debugElement.query(By.css(`[data-automation-id="${id}"]`)).nativeElement.textContent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FolderInformationComponent, LibTestingModule],
      providers: [
        { provide: DIALOG_COMPONENT_DATA, useValue: dialogData },
        { provide: RedirectAuthService, useValue: { onLogin: EMPTY, onTokenReceived: EMPTY } }
      ]
    });

    fixture = TestBed.createComponent(FolderInformationComponent);
    spyOn(TestBed.inject(ContentService), 'getNodeIcon').and.returnValue('./assets/images/ft_ic_folder.svg');
    fixture.detectChanges();
  });

  it('should render all information in init', () => {
    expect(getValueFromElement('folder-info-name')).toBe('mock-folder');
    expect(getValueFromElement('folder-info-size')).toBe('APP.FOLDER_INFO.CALCULATING');
    expect(getValueFromElement('folder-info-location')).toBe('mock-folder-path');
    expect(getValueFromElement('folder-info-creation-date')).toBe('01/02/2024 11:11');
    expect(getValueFromElement('folder-info-modify-date')).toBe('02/03/2024 22:22');
  });
});
