import { HomeComponent } from './home.component';
import { AppConfigService, AppConfigServiceMock, setupTestBed } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let appConfig: AppConfigService;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  setupTestBed({
    imports: [HttpClientModule, RouterTestingModule],
    providers: [{ provide: AppConfigService, useClass: AppConfigServiceMock }]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    router = TestBed.inject(Router);
    appConfig = TestBed.inject(AppConfigService);
    appConfig.config = Object.assign(appConfig.config, {
      landingPage: '/my-mock-landing-page'
    });
  });

  it('should navigate to the landing page from the app config', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith('/my-mock-landing-page');
  });

  it('should navigate to personal files by default when there is no landingPage defined', () => {
    appConfig.config = {};
    const navigateSpy = spyOn(router, 'navigateByUrl');
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith('/personal-files');
  });
});
