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
import * as tslib_1 from 'tslib';
import { TestBed } from '@angular/core/testing';
import { PageComponent } from './page.component';
import {
  ReloadDocumentListAction,
  SetSelectedNodesAction,
  SetInfoDrawerStateAction
} from '@alfresco/aca-shared/store';
import { ContentManagementService } from '../services/content-management.service';
import { EffectsModule } from '@ngrx/effects';
import { ViewerEffects } from '../store/effects';
import { Store } from '@ngrx/store';
import { AppExtensionService } from '../extensions/extension.service';
import { AppTestingModule } from '../testing/app-testing.module';
import { Component } from '@angular/core';
var TestComponent = /** @class */ (function(_super) {
  tslib_1.__extends(TestComponent, _super);
  function TestComponent(store, extensions, content) {
    return _super.call(this, store, extensions, content) || this;
  }
  TestComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-test',
        template: ''
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        AppExtensionService,
        ContentManagementService
      ])
    ],
    TestComponent
  );
  return TestComponent;
})(PageComponent);
describe('PageComponent', function() {
  var component;
  var store;
  var fixture;
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([ViewerEffects])],
      declarations: [TestComponent],
      providers: [ContentManagementService, AppExtensionService]
    });
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });
  describe('getParentNodeId()', function() {
    it('returns parent node id when node is set', function() {
      component.node = { id: 'node-id' };
      expect(component.getParentNodeId()).toBe('node-id');
    });
    it('returns null when node is not set', function() {
      component.node = null;
      expect(component.getParentNodeId()).toBe(null);
    });
  });
  describe('Info Drawer state', function() {
    var locationHref = location.href;
    afterEach(function() {
      window.history.pushState({}, null, locationHref);
    });
    it('should open info drawer on action event', function(done) {
      window.history.pushState({}, null, locationHref + '#test');
      fixture.detectChanges();
      fixture.whenStable().then(function() {
        component.infoDrawerOpened$.subscribe(function(state) {
          expect(state).toBe(true);
          done();
        });
      });
      store.dispatch(new SetInfoDrawerStateAction(true));
    });
    it('should not open info drawer if viewer outlet is active', function(done) {
      window.history.pushState({}, null, locationHref + '#test(viewer:view)');
      fixture.detectChanges();
      fixture.whenStable().then(function() {
        component.infoDrawerOpened$.subscribe(function(state) {
          expect(state).toBe(false);
          done();
        });
      });
      store.dispatch(new SetInfoDrawerStateAction(true));
    });
  });
  describe('Reload', function() {
    var locationHref = location.href;
    afterEach(function() {
      window.history.pushState({}, null, locationHref);
    });
    it('should not reload if url contains viewer outlet', function() {
      window.history.pushState({}, null, locationHref + '#test(viewer:view)');
      spyOn(store, 'dispatch');
      component.reload();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
    it('should reload if url does not contain viewer outlet', function() {
      spyOn(store, 'dispatch');
      component.reload();
      expect(store.dispatch).toHaveBeenCalledWith(
        new ReloadDocumentListAction()
      );
    });
    it('should set selection after reload if node is passed', function() {
      var node = {
        entry: {
          id: 'node-id'
        }
      };
      spyOn(store, 'dispatch');
      component.reload(node);
      expect(store.dispatch['calls'].mostRecent().args[0]).toEqual(
        new SetSelectedNodesAction([node])
      );
    });
  });
});
//# sourceMappingURL=page.component.spec.js.map
