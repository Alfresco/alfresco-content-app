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

import { TestBed } from '@angular/core/testing';
import { ToggleFavoriteComponent } from './toggle-favorite.component';
import { Store } from '@ngrx/store';
import { ExtensionService } from '@alfresco/adf-extensions';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { UnitTestingUtils } from '@alfresco/adf-core';

describe('ToggleFavoriteComponent', () => {
  let component: ToggleFavoriteComponent;
  let fixture;
  let router;
  let unitTestingUtils: UnitTestingUtils;

  const mockRouter = {
    url: 'some-url'
  };
  const mockStore: any = {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select').and.returnValue(
      of({
        nodes: []
      })
    )
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, ToggleFavoriteComponent],
      providers: [ExtensionService, { provide: Store, useValue: mockStore }, { provide: Router, useValue: mockRouter }]
    });

    fixture = TestBed.createComponent(ToggleFavoriteComponent);
    component = fixture.componentInstance;
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    mockStore.dispatch.calls.reset();
  });

  it('should get selection data on initialization', () => {
    expect(mockStore.select).toHaveBeenCalled();
  });

  it('should not dispatch reload if route is not specified', () => {
    component.data = { routes: ['/reload_on_this_route'] };
    router.url = '/somewhere_over_the_rainbow';

    fixture.detectChanges();
    component.onToggleEvent();

    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should dispatch reload if route is specified', () => {
    component.data = { routes: ['/reload_on_this_route'] };
    router.url = '/reload_on_this_route';

    fixture.detectChanges();
    component.onToggleEvent();

    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should focus element on toggle when focusAfterClosed is provided', () => {
    const mockElement = jasmine.createSpyObj<HTMLElement>('HTMLElement', ['focus']);
    spyOn(document, 'querySelector').and.returnValue(mockElement);

    component.data = { routes: [], focusAfterClosed: '.adf-context-menu-source' };
    const button = unitTestingUtils.getByCSS('button');
    button.triggerEventHandler('toggle', new CustomEvent('toggle'));

    expect(document.querySelector).toHaveBeenCalledWith('.adf-context-menu-source');
    expect(mockElement.focus).toHaveBeenCalled();
  });
});
