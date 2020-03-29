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
import { CurrentUserComponent } from './current-user.component';
import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppExtensionService } from '../../extensions/extension.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  SetUserProfileAction,
  SetLanguagePickerAction
} from '@alfresco/aca-shared/store';
describe('CurrentUserComponent', function() {
  var fixture;
  var component;
  var appExtensionService;
  var store;
  var person = {
    entry: {
      id: 'user-id',
      firstName: 'Test',
      lastName: 'User',
      email: 'user@email.com',
      enabled: true,
      isAdmin: false,
      userName: 'user-name'
    }
  };
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [CurrentUserComponent],
      providers: [AppExtensionService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CurrentUserComponent);
    appExtensionService = TestBed.get(AppExtensionService);
    store = TestBed.get(Store);
    component = fixture.componentInstance;
  });
  it('should get profile data', function(done) {
    var expectedProfile = {
      firstName: 'Test',
      lastName: 'User',
      userName: 'Test User',
      isAdmin: true,
      id: 'user-id',
      groups: []
    };
    fixture.detectChanges();
    store.dispatch(
      new SetUserProfileAction({ person: person.entry, groups: [] })
    );
    component.profile$.subscribe(function(profile) {
      expect(profile).toEqual(jasmine.objectContaining(expectedProfile));
      done();
    });
  });
  it('should set language picker state', function(done) {
    fixture.detectChanges();
    store.dispatch(new SetLanguagePickerAction(true));
    component.languagePicker$.subscribe(function(languagePicker) {
      expect(languagePicker).toBe(true);
      done();
    });
  });
  it('should set menu actions', function() {
    var actions = [
      {
        id: 'action-id'
      }
    ];
    spyOn(appExtensionService, 'getUserActions').and.returnValue(actions);
    fixture.detectChanges();
    expect(component.actions).toBe(actions);
  });
});
//# sourceMappingURL=current-user.component.spec.js.map
