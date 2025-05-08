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

import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { NavigationHistoryService } from './navigation-history.service';
import { Subject } from 'rxjs';

describe('NavigationHistoryService', () => {
  let service: NavigationHistoryService;
  let routerEvents$: Subject<NavigationEnd | NavigationStart>;

  const triggerNavigationEnd = (id: number, url: string) => {
    routerEvents$.next(new NavigationEnd(id, url, url));
  };

  beforeEach(() => {
    routerEvents$ = new Subject();
    TestBed.configureTestingModule({
      providers: [NavigationHistoryService, { provide: Router, useValue: { events: routerEvents$.asObservable(), url: '/initial' } }]
    });

    service = TestBed.inject(NavigationHistoryService);
    TestBed.inject(Router);
  });

  it('should store route changes in history', () => {
    service.listenToRouteChanges().subscribe((event) => service.setHistory(event));
    triggerNavigationEnd(1, '/page1');
    triggerNavigationEnd(2, '/page2');

    expect(service.history).toEqual(['/initial', '/page1', '/page2']);
  });

  it('should return true for a valid last selection', () => {
    service.history = ['/page1', '/page2', '/page1'];

    expect(service.shouldReturnLastSelection('/page2')).toBeTrue();
  });

  it('should return false for an invalid last selection', () => {
    service.history = ['/page1', '/page3', '/page1'];

    expect(service.shouldReturnLastSelection('/page2')).toBeFalse();
  });

  it('should return true for a valid last selection when before first relevant url and before last url there are multiple urls', () => {
    service.history = ['/page1', '/page2', '/page3', '/page4', '/page4', '/page3'];

    expect(service.shouldReturnLastSelection('/page4')).toBeTrue();
  });

  it('should return false for an invalid last selection when before first relevant url and before last url there are multiple urls', () => {
    service.history = ['/page1', '/page2', '/page3', '/page4', '/page4', '/page3'];

    expect(service.shouldReturnLastSelection('/page5')).toBeFalse();
  });

  it('should return false for an invalid last url when before first relevant url and before last url there are multiple urls', () => {
    service.history = ['/page1', '/page2', '/page3', '/page4', '/page4', '/page5'];

    expect(service.shouldReturnLastSelection('/page4')).toBeFalse();
  });

  it('should initialize history with the current route', () => {
    service.listenToRouteChanges().subscribe((event) => service.setHistory(event));
    expect(service.history).toEqual(['/initial']);
  });

  it('should only store NavigationEnd events in history', () => {
    service.listenToRouteChanges().subscribe((event) => service.setHistory(event));
    routerEvents$.next(new NavigationStart(1, '/page-start'));
    routerEvents$.next(new NavigationEnd(1, '/page1', '/page1'));

    expect(service.history).toEqual(['/initial', '/page1']);
  });

  it('should return false if second-to-last URL does not match in shouldReturnLastSelection', () => {
    service.history = ['/page1', '/page2', '/page3'];
    expect(service.shouldReturnLastSelection('/page1')).toBeFalse();
  });

  it('should return false if first and third URL are not equal', () => {
    service.history = ['/page1', '/page2', '/page3'];
    expect(service.shouldReturnLastSelection('/page2')).toBeFalse();
  });

  it('should return false if the current URL does not match the last two URLs', () => {
    service.history = ['/page1', '/page4', '/page1'];
    expect(service.shouldReturnLastSelection('/page3')).toBeFalse();
  });
});
