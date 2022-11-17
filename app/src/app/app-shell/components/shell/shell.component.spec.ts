/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppConfigService, SidenavLayoutModule } from '@alfresco/adf-core';
import { ShellLayoutComponent } from './shell.component';
import { Store } from '@ngrx/store';
import { Router, NavigationStart, RouterModule } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { ShellAppService, SHELL_APP_SERVICE } from '../../services/shell-app.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@alfresco/aca-shared';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockRouter {
  private url = 'some-url';
  private subject = new Subject();
  events = this.subject.asObservable();
  routerState = { snapshot: { url: this.url } };

  navigateByUrl(url: string) {
    const navigationStart = new NavigationStart(0, url);
    this.subject.next(navigationStart);
  }
}

describe('AppLayoutComponent', () => {
  let fixture: ComponentFixture<ShellLayoutComponent>;
  let component: ShellLayoutComponent;
  let appConfig: AppConfigService;
  let shellAppService: ShellAppService;

  beforeEach(() => {
    const shellService: ShellAppService = {
      init: () => {},
      pageHeading$: of('Title'),
      hideSidenavConditions: [],
      minimizeSidenavConditions: [],
      preferencesService: {
        get: (_key: string) => 'true',
        set: (_key: string, _value: any) => {}
      }
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, NoopAnimationsModule, HttpClientModule, SidenavLayoutModule, ExtensionsModule, RouterModule.forChild([])],
      providers: [
        Store,
        {
          provide: Router,
          useClass: MockRouter
        },
        {
          provide: SHELL_APP_SERVICE,
          useValue: shellService
        },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ],
      declarations: [ShellLayoutComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ShellLayoutComponent);
    component = fixture.componentInstance;
    appConfig = TestBed.inject(AppConfigService);
    shellAppService = TestBed.inject(SHELL_APP_SERVICE);
  });

  beforeEach(() => {
    appConfig.config.languages = [];
    appConfig.config.locale = 'en';
  });

  describe('sidenav state', () => {
    it('should get state from configuration', () => {
      appConfig.config.sideNav = {
        expandedSidenav: false,
        preserveState: false
      };

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(false);
    });

    it('should resolve state to true is no configuration', () => {
      appConfig.config.sidenav = {};

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(true);
    });

    it('should get state from user settings as true', () => {
      appConfig.config.sideNav = {
        expandedSidenav: false,
        preserveState: true
      };

      spyOn(shellAppService.preferencesService, 'get').and.callFake((key) => {
        if (key === 'expandedSidenav') {
          return 'true';
        }
        return 'false';
      });

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(true);
    });

    it('should get state from user settings as false', () => {
      appConfig.config.sidenav = {
        expandedSidenav: false,
        preserveState: true
      };

      spyOn(shellAppService.preferencesService, 'get').and.callFake((key) => {
        if (key === 'expandedSidenav') {
          return 'false';
        }
        return 'true';
      });

      fixture.detectChanges();

      expect(component.expandedSidenav).toBe(false);
    });
  });

  it('should close menu on mobile screen size', () => {
    component.minimizeSidenav = false;
    component.layout.container = {
      isMobileScreenSize: true,
      toggleMenu: () => {}
    };

    spyOn(component.layout.container, 'toggleMenu');
    fixture.detectChanges();

    component.hideMenu({ preventDefault: () => {} } as any);

    expect(component.layout.container.toggleMenu).toHaveBeenCalled();
  });

  it('should close menu on mobile screen size also when minimizeSidenav true', () => {
    fixture.detectChanges();
    component.minimizeSidenav = true;
    component.layout.container = {
      isMobileScreenSize: true,
      toggleMenu: () => {}
    };

    spyOn(component.layout.container, 'toggleMenu');
    fixture.detectChanges();

    component.hideMenu({ preventDefault: () => {} } as any);

    expect(component.layout.container.toggleMenu).toHaveBeenCalled();
  });
});
