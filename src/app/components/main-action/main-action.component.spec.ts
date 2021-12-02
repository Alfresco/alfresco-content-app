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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainActionComponent } from './main-action.component';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { AppExtensionService } from '@alfresco/aca-shared';
import { of } from 'rxjs';
import { ACTION_CLICK, ACTION_TITLE, getContentActionRef } from '../../testing/content-action-ref';
import { AppExtensionServiceMock } from '../../testing/app-extension-service-mock';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

describe('MainActionComponent', () => {
  let mainActionComponent: MainActionComponent;
  const buttonQuery = '[data-automation-id="app-main-action-button"]';
  const iconQuery = '[data-automation-id="app-main-action-icon"]';

  let fixture: ComponentFixture<MainActionComponent>;
  let appExtensionService: AppExtensionServiceMock;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CommonModule, MatButtonModule, TranslateModule.forRoot()],
      providers: [
        { provide: TranslationService, useClass: TranslationMock },
        { provide: AppExtensionService, useClass: AppExtensionServiceMock }
      ]
    }).compileComponents();

    appExtensionService = TestBed.inject(AppExtensionService);

    fixture = TestBed.createComponent(MainActionComponent);
    mainActionComponent = fixture.componentInstance;
  });

  describe('component is in expanded mode', () => {
    beforeEach(async () => {
      mainActionComponent.expanded = true;
      fixture.detectChanges();
    });

    it('should display button if main action is configured', () => {
      const buttonMainAction = fixture.debugElement.nativeElement.querySelector(buttonQuery);
      const iconMainAction = fixture.debugElement.nativeElement.querySelector(iconQuery);

      expect(iconMainAction).toBeFalsy();
      expect(buttonMainAction.textContent.trim()).toBe(ACTION_TITLE);
    });

    it('should not display button if main action is not configured', () => {
      spyOn(appExtensionService, 'getMainAction').and.returnValue(of(undefined));
      mainActionComponent.ngOnInit();
      fixture.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector(buttonQuery);
      expect(button).toBeFalsy();
    });

    it('should call extension action', () => {
      const runExtensionActionSpy = spyOn(appExtensionService, 'runActionById');

      const button = fixture.debugElement.nativeElement.querySelector(buttonQuery);
      button.click();

      expect(runExtensionActionSpy).toHaveBeenCalledWith(ACTION_CLICK);
    });

    it('should not call button if main action is disabled', () => {
      const disabledMainActionRef = getContentActionRef();
      disabledMainActionRef.disabled = true;

      spyOn(appExtensionService, 'getMainAction').and.returnValue(of(disabledMainActionRef));
      const runAction = spyOn(mainActionComponent, 'runAction');

      mainActionComponent.ngOnInit();
      fixture.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector(buttonQuery);
      button.click();

      expect(runAction).not.toHaveBeenCalled();
    });
  });

  describe('component is displayed as icon', () => {
    beforeEach(async () => {
      mainActionComponent.expanded = false;
      fixture.detectChanges();
    });

    it('should display icon if main action is configured', () => {
      const buttonMainAction = fixture.debugElement.nativeElement.querySelector(buttonQuery);
      const iconMainAction = fixture.debugElement.nativeElement.querySelector(iconQuery);

      expect(buttonMainAction).toBeFalsy();
      expect(iconMainAction).toBeTruthy();
    });

    it('should not display icon if main action is not configured', () => {
      spyOn(appExtensionService, 'getMainAction').and.returnValue(of(undefined));
      mainActionComponent.ngOnInit();
      fixture.detectChanges();

      const mainAction = fixture.debugElement.nativeElement.querySelector(iconQuery);
      expect(mainAction).toBeFalsy();
    });

    it('should call extension action', () => {
      const runExtensionActionSpy = spyOn(appExtensionService, 'runActionById');

      const mainAction = fixture.debugElement.nativeElement.querySelector(iconQuery);
      mainAction.click();

      expect(runExtensionActionSpy).toHaveBeenCalledWith(ACTION_CLICK);
    });

    it('should not call icon if main action is disabled', () => {
      const disabledMainActionRef = getContentActionRef();
      disabledMainActionRef.disabled = true;

      spyOn(appExtensionService, 'getMainAction').and.returnValue(of(disabledMainActionRef));
      const runAction = spyOn(mainActionComponent, 'runAction');

      mainActionComponent.ngOnInit();
      fixture.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector(iconQuery);
      button.click();

      expect(runAction).not.toHaveBeenCalled();
    });
  });
});
