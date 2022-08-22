/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppConfigModule } from '@alfresco/adf-core';
import { ViewProfileComponent } from './view-profile.component';
import { AppTestingModule } from '../../testing/app-testing.module';

describe('ViewProfileComponent', () => {
  let fixture: ComponentFixture<ViewProfileComponent>;
  let component: ViewProfileComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, AppConfigModule],
      declarations: [ViewProfileComponent]
    });

    fixture = TestBed.createComponent(ViewProfileComponent);
    component = fixture.componentInstance;
  });

  it('default login and company dropdown remains close', async () => {
    expect(component.loginSectionDropdown).toBe(false);
    expect(component.contactSectionDropdown).toBe(false);
  });
});
