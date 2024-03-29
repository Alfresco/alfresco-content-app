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
import { ToolbarActionComponent } from './toolbar-action.component';
import { ToolbarButtonType } from '../toolbar-button/toolbar-button.component';
import { ChangeDetectorRef } from '@angular/core';
import { ContentActionType } from '@alfresco/adf-extensions';
import { LibTestingModule } from '@alfresco/aca-shared';

describe('ToolbarActionComponent', () => {
  let fixture: ComponentFixture<ToolbarActionComponent>;
  let component: ToolbarActionComponent;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule, ToolbarActionComponent],
      providers: [{ provide: ChangeDetectorRef, useValue: { markForCheck() {} } }]
    });

    fixture = TestBed.createComponent(ToolbarActionComponent);
    component = fixture.componentInstance;

    changeDetectorRef = TestBed.inject(ChangeDetectorRef);
  });

  it('should be icon button by default', () => {
    expect(component.type).toBe(ToolbarButtonType.ICON_BUTTON);
  });

  it('should force update UI on check for the viewer', () => {
    component = new ToolbarActionComponent(changeDetectorRef);
    const markForCheck = spyOn(changeDetectorRef, 'markForCheck');

    component.actionRef = {
      id: '-app.viewer',
      type: ContentActionType.button,
      actions: {
        click: 'ON_CLICK'
      }
    };

    component.ngDoCheck();
    expect(markForCheck).toHaveBeenCalled();
  });
});
