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

import { ButtonMenuComponent } from './button-menu.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Router } from '@angular/router';

describe('ButtonMenuComponent', () => {
  let component: ButtonMenuComponent;
  let fixture: ComponentFixture<ButtonMenuComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, ButtonMenuComponent]
    });

    fixture = TestBed.createComponent(ButtonMenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  it('should render action item', () => {
    component.item = {
      id: 'test-action-button',
      url: 'dummy',
      icon: 'icon-name',
      title: null,
      route: null
    };

    fixture.detectChanges();

    const actionButton = document.body.querySelector('#test-action-button');
    expect(actionButton).not.toBeNull();
  });

  it('should render action item with children', () => {
    component.item = {
      id: 'test-action-button',
      icon: 'icon-name',
      title: null,
      route: null,
      children: [
        {
          id: 'child-1',
          title: 'child-1',
          url: 'dummy',
          icon: null,
          route: null
        },
        {
          id: 'child-2',
          title: 'child-2',
          url: 'dummy',
          icon: null,
          route: null
        }
      ]
    };

    fixture.detectChanges();

    const actionButton = document.body.querySelector('[id="test-action-button"]');
    actionButton.dispatchEvent(new Event('click'));

    expect(document.querySelector('[id="child-1"]')).not.toBeNull();
    expect(document.querySelector('[id="child-2"]')).not.toBeNull();
  });
});
