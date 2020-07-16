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

import { Component } from '@angular/core';
import { AppSidenavModule } from '../sidenav.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-test-component',
  template: ` <span id="test-element" acaActiveLink="active-link-class" [action]="item"></span> `
})
class TestComponent {
  item = {
    route: 'dummy'
  };
}

class MockRouter {
  private subject = new Subject();
  events = this.subject.asObservable();
  url = '';

  navigateByUrl(url: string) {
    const navigationEnd = new NavigationEnd(0, '', url);
    this.subject.next(navigationEnd);
  }
}

describe('ActionDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, AppSidenavModule],
      declarations: [TestComponent],
      providers: [
        {
          provide: Router,
          useClass: MockRouter
        }
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    router = TestBed.inject(Router);
  });

  it('should add active route class name', () => {
    fixture.detectChanges();
    router.navigateByUrl('/dummy');
    // fixture.detectChanges();
    expect(document.body.querySelector('#test-element').className.includes('active-link-class')).toBe(true);
  });

  it('should remove class name if route not active', () => {
    fixture.detectChanges();
    router.navigateByUrl('/dummy');

    expect(document.body.querySelector('#test-element').className.includes('active-link-class')).toBe(true);

    router.navigateByUrl('/other');

    expect(document.body.querySelector('#test-element').className.includes('active-link-class')).not.toBe(true);
  });
});
