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

import { DocumentDisplayModeComponent } from './document-display-mode.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { of } from 'rxjs';

describe('DocumentDisplayModeComponent', () => {
  let component: DocumentDisplayModeComponent;
  let fixture: ComponentFixture<DocumentDisplayModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CoreModule, AppTestingModule]
    });

    fixture = TestBed.createComponent(DocumentDisplayModeComponent);
    component = fixture.componentInstance;
  });

  it('should show the list button when list', async () => {
    component.displayMode$ = of('list');
    fixture.detectChanges();
    await fixture.whenStable();

    const displayButton: HTMLButtonElement = fixture.nativeElement.querySelector('#app-document-display-mode-button');
    expect(displayButton.title).toBe('APP.ACTIONS.LIST_MODE');
  });

  it('should show the gallery button when list', async () => {
    component.displayMode$ = of('gallery');
    fixture.detectChanges();
    await fixture.whenStable();

    const displayButton: HTMLButtonElement = fixture.nativeElement.querySelector('#app-document-display-mode-button');
    expect(displayButton.title).toBe('APP.ACTIONS.GALLERY_MODE');
  });
});
