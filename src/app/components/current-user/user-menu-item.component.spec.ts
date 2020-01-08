/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppExtensionService } from '../../extensions/extension.service';
import { UserMenuItemComponent } from './user-menu-item.component';
import {
  TranslateModule,
  TranslateLoader,
  TranslateFakeLoader
} from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';

describe('UserMenuItemComponent', () => {
  let fixture: ComponentFixture<UserMenuItemComponent>;
  let component: UserMenuItemComponent;
  let appExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      declarations: [UserMenuItemComponent],
      providers: [AppExtensionService],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(UserMenuItemComponent);
    appExtensionService = TestBed.get(AppExtensionService);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should render button action', () => {
    component.actionRef = {
      id: 'action-button',
      title: 'Test Button',
      actions: {
        click: 'TEST_EVENT'
      }
    } as ContentActionRef;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('#action-button');
    expect(buttonElement).not.toBe(null);
  });

  it('should render menu action', () => {
    component.actionRef = {
      type: 'menu',
      id: 'action-menu',
      title: 'Test Button',
      actions: {
        click: 'TEST_EVENT'
      }
    } as ContentActionRef;
    fixture.detectChanges();

    const menuElement = fixture.nativeElement.querySelector('#action-menu');
    expect(menuElement).not.toBe(null);
  });

  it('should render custom action', () => {
    component.actionRef = {
      type: 'custom',
      id: 'action-custom',
      component: 'custom-component'
    } as ContentActionRef;
    fixture.detectChanges();

    const componentElement = fixture.nativeElement.querySelector(
      '#custom-component'
    );
    expect(componentElement).not.toBe(null);
  });

  it('should run defined action', () => {
    spyOn(appExtensionService, 'runActionById');

    component.actionRef = {
      id: 'action-button',
      title: 'Test Button',
      actions: {
        click: 'TEST_EVENT'
      }
    } as ContentActionRef;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('#action-button');
    buttonElement.dispatchEvent(new MouseEvent('click'));
    expect(appExtensionService.runActionById).toHaveBeenCalledWith(
      'TEST_EVENT'
    );
  });
});
