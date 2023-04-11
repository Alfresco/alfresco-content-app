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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarButtonComponent, ToolbarButtonType } from './toolbar-button.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AppExtensionService } from '../../../services/app.extension.service';
import { ContentActionType } from '@alfresco/adf-extensions';
import { MatButtonModule } from '@angular/material/button';

describe('ToolbarButtonComponent', () => {
  let fixture: ComponentFixture<ToolbarButtonComponent>;
  let component: ToolbarButtonComponent;
  let appExtensionService: AppExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule, TranslateModule.forRoot(), IconModule, MatButtonModule],
      declarations: [ToolbarButtonComponent],
      providers: [
        { provide: TranslationService, useClass: TranslationMock },
        { provide: AppExtensionService, useValue: { runActionById() {} } },
        {
          provide: Store,
          useValue: {
            dispatch: () => {},
            select: () => of({ count: 1 })
          }
        }
      ]
    });

    fixture = TestBed.createComponent(ToolbarButtonComponent);
    component = fixture.componentInstance;
    appExtensionService = TestBed.inject(AppExtensionService);
  });

  it('should be icon button by default', () => {
    expect(component.type).toBe(ToolbarButtonType.ICON_BUTTON);
  });

  it('should run action on click', async () => {
    const runActionById = spyOn(appExtensionService, 'runActionById');

    component.actionRef = {
      id: 'button1',
      type: ContentActionType.button,
      actions: {
        click: 'ON_CLICK'
      }
    };

    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[id="button1"]');
    button.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(runActionById).toHaveBeenCalled();
  });
});
