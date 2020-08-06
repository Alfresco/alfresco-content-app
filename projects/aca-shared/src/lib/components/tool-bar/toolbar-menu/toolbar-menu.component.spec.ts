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

import { ToolbarMenuComponent } from './toolbar-menu.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@alfresco/adf-core';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { ContentActionRef } from '@alfresco/adf-extensions';

describe('ToolbarMenuComponent', () => {
  let fixture: ComponentFixture<ToolbarMenuComponent>;
  let component: ToolbarMenuComponent;

  const actions = { id: 'action-1', type: 'button' } as ContentActionRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        OverlayModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ]
    });
    fixture = TestBed.createComponent(ToolbarMenuComponent);
    component = fixture.componentInstance;
    component.matTrigger = jasmine.createSpyObj('MatMenuTrigger', ['closeMenu']);
    component.actionRef = actions;
    fixture.detectChanges();
  });

  it('should close toolbar context menu', () => {
    spyOn(component.matTrigger, 'closeMenu');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(component.matTrigger.closeMenu).toHaveBeenCalled();
  });
});
