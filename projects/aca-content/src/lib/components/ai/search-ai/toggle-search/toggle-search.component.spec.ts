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

import { HarnessLoader } from '@angular/cdk/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, NavigationStart, Router, RouterEvent } from '@angular/router';
import { SearchNavigationService } from '../search-navigation.service';
import { ToggleSearchComponent } from './toggle-search.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of, ReplaySubject, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

describe('ToggleSearchComponent', () => {
  let fixture: ComponentFixture<ToggleSearchComponent>;
  let component: ToggleSearchComponent;
  let searchNavigationService: SearchNavigationService;
  let loader: HarnessLoader;
  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: eventSubject.asObservable(),
    url: '/test/search-ai'
  };
  const mockRouterParams = new Subject();
  const mockDialogRef = {
    open: jasmine.createSpy('open')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSlideToggleModule, ToggleSearchComponent, RouterTestingModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { queryParams: mockRouterParams } },
        { provide: MatDialog, useValue: mockDialogRef }
      ]
    });

    fixture = TestBed.createComponent(ToggleSearchComponent);
    component = fixture.componentInstance;
    searchNavigationService = TestBed.inject(SearchNavigationService);
    loader = TestbedHarnessEnvironment.loader(fixture);

    mockRouterParams.next({ hideAiToggle: false });
    fixture.detectChanges();
  });

  it('should be checked when url contains search-ai', () => {
    expect(component.checked).toBeTrue();
  });

  it('should change checked when navigation occurs', () => {
    eventSubject.next(new NavigationStart(1, '/test/search-ai'));
    expect(component.checked).toBeTrue();
  });

  it('should toggle to ai search when unchecked', async () => {
    spyOn(searchNavigationService, 'navigateToSearchAi');
    eventSubject.next(new NavigationStart(1, '/test/search'));
    const [toggle] = await loader.getAllHarnesses(MatSlideToggleHarness);
    await toggle.toggle();
    expect(searchNavigationService.navigateToSearchAi).toHaveBeenCalled();
  });

  it('should toggle to regular search when checked', async () => {
    spyOn(searchNavigationService, 'navigateToSearch');
    const [toggle] = await loader.getAllHarnesses(MatSlideToggleHarness);
    await toggle.check();
    await toggle.toggle();
    expect(searchNavigationService.navigateToSearch).toHaveBeenCalled();
  });

  it('should not show toggle if hideAiToggle parameter is passed in url', async () => {
    mockRouterParams.next({ hideAiToggle: true });
    fixture.detectChanges();
    const [toggle] = await loader.getAllHarnesses(MatSlideToggleHarness);
    expect(toggle).toBeUndefined();
  });

  it('should ask for confirmation if ai search results are being shown and toggle is clicked', async () => {
    searchNavigationService.hasAiSearchResults = true;
    spyOn(searchNavigationService, 'openConfirmDialog').and.returnValue(of(true));
    fixture.detectChanges();
    const [toggle] = await loader.getAllHarnesses(MatSlideToggleHarness);
    await toggle.toggle();
    expect(searchNavigationService.openConfirmDialog).toHaveBeenCalled();
  });
});
