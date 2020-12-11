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

import { ExpandMenuComponent } from './expand-menu.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Router } from '@angular/router';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { AppSidenavModule } from '../sidenav.module';

describe('ExpandMenuComponent', () => {
  let component: ExpandMenuComponent;
  let fixture: ComponentFixture<ExpandMenuComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppTestingModule,
        AppSidenavModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ]
    });

    fixture = TestBed.createComponent(ExpandMenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  it('should render action item', () => {
    component.item = {
      id: 'test-action-button',
      url: 'dummy',
      title: null,
      icon: null,
      route: null
    };

    fixture.detectChanges();

    const actionButton = document.body.querySelector('#test-action-button');
    expect(actionButton).not.toBeNull();
  });

  it('should render action item with children', () => {
    component.item = {
      id: 'test-action-button',
      icon: null,
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
