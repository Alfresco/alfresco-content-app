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
import { MetadataTabComponent } from './metadata-tab.component';
import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppConfigService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { ContentMetadataModule } from '@alfresco/adf-content-services';
import { Store } from '@ngrx/store';
import { SetInfoDrawerMetadataAspectAction } from '@alfresco/aca-shared/store';
import { By } from '@angular/platform-browser';
import { AppExtensionService } from '../../../extensions/extension.service';
describe('MetadataTabComponent', function() {
  var fixture;
  var component;
  var store;
  var appConfig;
  var extensions;
  setupTestBed({
    imports: [CoreModule, AppTestingModule, ContentMetadataModule],
    declarations: [MetadataTabComponent]
  });
  afterEach(function() {
    fixture.destroy();
  });
  describe('content-metadata configuration', function() {
    beforeEach(function() {
      appConfig = TestBed.get(AppConfigService);
      extensions = TestBed.get(AppExtensionService);
    });
    it('should remain unchanged when metadata extension is missing', function() {
      appConfig.config['content-metadata'] = 'initial config';
      extensions.contentMetadata = null;
      fixture = TestBed.createComponent(MetadataTabComponent);
      expect(appConfig.config['content-metadata']).toEqual('initial config');
    });
    it('should be overwritten by the one from extension', function() {
      appConfig.config['content-metadata'] = 'initial config';
      extensions.contentMetadata = [{ 'new config': true }];
      fixture = TestBed.createComponent(MetadataTabComponent);
      expect(appConfig.config['content-metadata']).not.toEqual(
        'initial config'
      );
      expect(appConfig.config['content-metadata']).toEqual(
        extensions.contentMetadata
      );
    });
  });
  describe('canUpdateNode()', function() {
    beforeEach(function() {
      fixture = TestBed.createComponent(MetadataTabComponent);
      component = fixture.componentInstance;
    });
    it('should return true if node is not locked and has update permission', function() {
      var node = {
        isLocked: false,
        allowableOperations: ['update']
      };
      component.node = node;
      expect(component.canUpdateNode).toBe(true);
    });
    it('should return false if node is locked', function() {
      var node = {
        isLocked: true,
        allowableOperations: ['update']
      };
      component.node = node;
      expect(component.canUpdateNode).toBe(false);
    });
    it('should return false if node has no update permission', function() {
      var node = {
        isLocked: false,
        allowableOperations: ['other']
      };
      component.node = node;
      expect(component.canUpdateNode).toBe(false);
    });
    it('should return false if node has read only property', function() {
      var node = {
        isLocked: false,
        allowableOperations: ['update'],
        properties: {
          'cm:lockType': 'WRITE_LOCK'
        }
      };
      component.node = node;
      expect(component.canUpdateNode).toBe(false);
    });
  });
  describe('displayAspect', function() {
    beforeEach(function() {
      fixture = TestBed.createComponent(MetadataTabComponent);
      store = TestBed.get(Store);
      component = fixture.componentInstance;
    });
    it('show pass empty when store is in initial state', function() {
      var initialState = fixture.debugElement.query(
        By.css('adf-content-metadata-card')
      );
      expect(initialState.componentInstance.displayAspect).toBeFalsy();
    });
    it('should update the exif if store got updated', function() {
      store.dispatch(new SetInfoDrawerMetadataAspectAction('EXIF'));
      component.displayAspect$.subscribe(function(aspect) {
        expect(aspect).toBe('EXIF');
      });
      fixture.detectChanges();
      var initialState = fixture.debugElement.query(
        By.css('adf-content-metadata-card')
      );
      expect(initialState.componentInstance.displayAspect).toBe('EXIF');
    });
  });
});
//# sourceMappingURL=metadata-tab.component.spec.js.map
