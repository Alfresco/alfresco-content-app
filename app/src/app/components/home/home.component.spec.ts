import { HomeComponent } from './home.component';
import { AppConfigService, AppConfigServiceMock, setupTestBed } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let appConfig: AppConfigService;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  setupTestBed({
    imports: [HttpClientModule, RouterTestingModule],
    providers: [{ provide: AppConfigService, useClass: AppConfigServiceMock }]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    appConfig = TestBed.inject(AppConfigService);
    appConfig.config = Object.assign(appConfig.config, {
      landingPage: '/my-mock-landing-page'
    });
  });

  it('should navigate to the landing page from the app config', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    fixture.detectChanges();

    expect(component.landingPage).toEqual('/my-mock-landing-page');
    expect(navigateSpy).toHaveBeenCalledWith('/my-mock-landing-page');
  });
});
