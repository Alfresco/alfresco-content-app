/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DocumentDisplayModeComponent } from './document-display-mode.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@alfresco/adf-core';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

describe('DocumentDisplayModeComponent', () => {
  let fixture: ComponentFixture<DocumentDisplayModeComponent>;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, AppTestingModule],
      providers: [provideMockStore()]
    });

    fixture = TestBed.createComponent(DocumentDisplayModeComponent);
    store = TestBed.inject(Store);
  });

  it('should show the list button when list', async () => {
    spyOn(store, 'select').and.returnValue(of('list'));
    fixture.detectChanges();
    await fixture.whenStable();

    const displayButton: HTMLButtonElement = fixture.nativeElement.querySelector('#app-document-display-mode-button');
    expect(displayButton.title).toBe('APP.ACTIONS.LIST_MODE');
  });

  it('should show the gallery button when gallery', async () => {
    spyOn(store, 'select').and.returnValue(of('gallery'));
    fixture.detectChanges();
    await fixture.whenStable();
    const displayButton: HTMLButtonElement = fixture.nativeElement.querySelector('#app-document-display-mode-button');
    expect(displayButton.title).toBe('APP.ACTIONS.GALLERY_MODE');
  });
});
