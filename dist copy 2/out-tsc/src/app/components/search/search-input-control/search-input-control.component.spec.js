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
var _this = this;
import * as tslib_1 from 'tslib';
import { SearchInputControlComponent } from './search-input-control.component';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('SearchInputControlComponent', function() {
  var fixture;
  var component;
  beforeEach(async(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [SearchInputControlComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(function() {
        fixture = TestBed.createComponent(SearchInputControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));
  it('should emit submit event on searchSubmit', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var keyboardEvent, eventArgs;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            keyboardEvent = { target: { value: 'a' } };
            eventArgs = null;
            component.submit.subscribe(function(args) {
              return (eventArgs = args);
            });
            return [4 /*yield*/, component.searchSubmit(keyboardEvent)];
          case 1:
            _a.sent();
            expect(eventArgs).toBe(keyboardEvent);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should emit searchChange event on inputChange', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var searchTerm, eventArgs;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            searchTerm = 'b';
            eventArgs = null;
            component.searchChange.subscribe(function(args) {
              return (eventArgs = args);
            });
            return [4 /*yield*/, component.inputChange(searchTerm)];
          case 1:
            _a.sent();
            expect(eventArgs).toBe(searchTerm);
            return [2 /*return*/];
        }
      });
    });
  });
  it('should emit searchChange event on clear', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      var eventArgs;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            eventArgs = null;
            component.searchChange.subscribe(function(args) {
              return (eventArgs = args);
            });
            return [4 /*yield*/, component.clear()];
          case 1:
            _a.sent();
            expect(eventArgs).toBe('');
            return [2 /*return*/];
        }
      });
    });
  });
  it('should clear searchTerm', function() {
    return tslib_1.__awaiter(_this, void 0, void 0, function() {
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            component.searchTerm = 'c';
            fixture.detectChanges();
            return [4 /*yield*/, component.clear()];
          case 1:
            _a.sent();
            expect(component.searchTerm).toBe('');
            return [2 /*return*/];
        }
      });
    });
  });
  it('should check if searchTerm has a length less than 2', function() {
    expect(component.isTermTooShort()).toBe(false);
    component.searchTerm = 'd';
    fixture.detectChanges();
    expect(component.isTermTooShort()).toBe(true);
    component.searchTerm = 'dd';
    fixture.detectChanges();
    expect(component.isTermTooShort()).toBe(false);
  });
});
//# sourceMappingURL=search-input-control.component.spec.js.map
