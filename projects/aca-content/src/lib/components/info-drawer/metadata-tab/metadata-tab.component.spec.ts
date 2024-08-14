/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { MetadataTabComponent } from './metadata-tab.component';
import { Node } from '@alfresco/js-api';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppConfigService, PipeModule } from '@alfresco/adf-core';
import { EditOfflineAction } from '@alfresco/aca-shared/store';
import { By } from '@angular/platform-browser';
import { AppExtensionService, NodePermissionService } from '@alfresco/aca-shared';
import { Actions } from '@ngrx/effects';
import { of, Subject } from 'rxjs';
import { ContentActionType } from '@alfresco/adf-extensions';
import { CategoryService, ContentMetadataComponent, ContentMetadataService, TagService } from '@alfresco/adf-content-services';

describe('MetadataTabComponent', () => {
  let fixture: ComponentFixture<MetadataTabComponent>;
  let component: MetadataTabComponent;
  let appConfig: AppConfigService;
  let extensions: AppExtensionService;
  let nodePermissionService: NodePermissionService;
  let actions$: Subject<EditOfflineAction>;
  let appExtensionService: AppExtensionService;
  let contentMetadataService: ContentMetadataService;

  const presets = {
    default: {
      includeAll: true
    },
    custom: []
  };
  beforeEach(() => {
    actions$ = new Subject<EditOfflineAction>();
    TestBed.configureTestingModule({
      imports: [AppTestingModule, MetadataTabComponent, PipeModule],
      providers: [
        {
          provide: Actions,
          useValue: actions$
        }
      ]
    });
    nodePermissionService = TestBed.inject(NodePermissionService);
    appExtensionService = TestBed.inject(AppExtensionService);
    contentMetadataService = TestBed.inject(ContentMetadataService);
    spyOn(nodePermissionService, 'check').and.callFake((source: Node, permissions: string[]) => {
      return permissions.some((permission) => source.allowableOperations.includes(permission));
    });
    spyOn(contentMetadataService, 'getGroupedProperties').and.returnValue(of());
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('content-metadata configuration', () => {
    beforeEach(() => {
      appConfig = TestBed.inject(AppConfigService);
      extensions = TestBed.inject(AppExtensionService);
      appConfig.config['content-metadata'] = { presets };
    });

    it('should remain unchanged when metadata extension is missing', () => {
      extensions.contentMetadata = null;

      fixture = TestBed.createComponent(MetadataTabComponent);

      expect(appConfig.config['content-metadata'].presets).toEqual(presets);
    });

    it('should be overwritten by the one from extension', () => {
      extensions.contentMetadata = { presets: [{ 'new config': true }] };

      fixture = TestBed.createComponent(MetadataTabComponent);

      expect(appConfig.config['content-metadata'].presets).not.toEqual(presets);
      expect(appConfig.config['content-metadata'].presets).toEqual(extensions.contentMetadata.presets);
    });
  });

  describe('readOnly', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MetadataTabComponent);
      component = fixture.componentInstance;
    });

    it('should return false if node is not locked and has update permission', async () => {
      component.node = {
        isLocked: false,
        allowableOperations: ['update']
      } as Node;
      component.ngOnInit();
      expect(component.readOnly).toBe(false);
    });

    it('should return true if node is locked', () => {
      component.node = {
        isLocked: true,
        allowableOperations: ['update']
      } as Node;
      component.ngOnInit();
      expect(component.readOnly).toBe(true);
    });

    it('should return true if node has no update permission', () => {
      component.node = {
        isLocked: false,
        allowableOperations: ['other']
      } as Node;
      component.ngOnInit();
      expect(component.readOnly).toBe(true);
    });

    it('should return true if node has read only property', () => {
      component.node = {
        isLocked: false,
        allowableOperations: ['update'],
        properties: {
          'cm:lockType': 'WRITE_LOCK'
        }
      } as Node;
      component.ngOnInit();
      expect(component.readOnly).toBe(true);
    });

    describe('set by triggering EditOfflineAction', () => {
      let editOfflineAction: EditOfflineAction;

      beforeEach(() => {
        component.node = {
          id: 'some id',
          allowableOperations: []
        } as Node;
        component.ngOnInit();
        editOfflineAction = new EditOfflineAction({
          entry: {
            isLocked: false,
            allowableOperations: ['update'],
            id: component.node.id
          } as Node
        });
        component.readOnly = true;
      });

      it('should have set false if node is not locked and has update permission', () => {
        component.readOnly = true;
        actions$.next(editOfflineAction);
        expect(component.readOnly).toBeFalse();
      });

      it('should not have set false if changed node has different id than original', () => {
        editOfflineAction.payload.entry.id = 'some other id';
        editOfflineAction.payload.entry.isLocked = true;
        actions$.next(editOfflineAction);
        expect(component.readOnly).toBeTrue();
      });

      it('should have set true if node is locked', () => {
        editOfflineAction.payload.entry.isLocked = true;
        actions$.next(editOfflineAction);
        expect(component.readOnly).toBeTrue();
      });

      it('should have set true if node has no update permission', () => {
        editOfflineAction.payload.entry.allowableOperations = ['other'];
        actions$.next(editOfflineAction);
        expect(component.readOnly).toBeTrue();
      });

      it('should have set true if node has read only property', () => {
        editOfflineAction.payload.entry.properties = {
          'cm:lockType': 'WRITE_LOCK'
        };
        actions$.next(editOfflineAction);
        expect(component.readOnly).toBeTrue();
      });
    });
  });

  describe('ContentMetadataComponent', () => {
    const getContentMetadata = (): ContentMetadataComponent => fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

    beforeEach(() => {
      fixture = TestBed.createComponent(MetadataTabComponent);
      component = fixture.componentInstance;
    });

    describe('Tags and categories', () => {
      it('should have assigned displayCategories to true if categoryService.areCategoriesEnabled returns true', () => {
        const categoryService = TestBed.inject(CategoryService);
        spyOn(categoryService, 'areCategoriesEnabled').and.returnValue(true);

        fixture.detectChanges();
        expect(categoryService.areCategoriesEnabled).toHaveBeenCalled();
        expect(getContentMetadata().displayCategories).toBeTrue();
      });

      it('should have assigned displayCategories to false if categoryService.areCategoriesEnabled returns false', () => {
        const categoryService = TestBed.inject(CategoryService);
        spyOn(categoryService, 'areCategoriesEnabled').and.returnValue(false);

        fixture.detectChanges();
        expect(categoryService.areCategoriesEnabled).toHaveBeenCalled();
        expect(getContentMetadata().displayCategories).toBeFalse();
      });

      it('should have assigned displayTags to true if tagService.areTagsEnabled returns true', () => {
        const tagService = TestBed.inject(TagService);
        spyOn(tagService, 'areTagsEnabled').and.returnValue(true);

        fixture.detectChanges();
        expect(tagService.areTagsEnabled).toHaveBeenCalled();
        expect(getContentMetadata().displayTags).toBeTrue();
      });

      it('should have assigned displayTags to false if tagService.areTagsEnabled returns false', () => {
        const tagService = TestBed.inject(TagService);
        spyOn(tagService, 'areTagsEnabled').and.returnValue(false);

        fixture.detectChanges();
        expect(tagService.areTagsEnabled).toHaveBeenCalled();
        expect(getContentMetadata().displayTags).toBeFalse();
      });
    });
  });

  describe('Custom metadata panels', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MetadataTabComponent);
      component = fixture.componentInstance;
    });

    it('should get custom metadata panels', (done) => {
      spyOn(appExtensionService, 'getCustomMetadataPanels').and.returnValue(
        of([{ id: 'test', type: ContentActionType.custom, title: 'testTitle', component: 'test-id' }])
      );
      component.ngOnInit();
      component.customPanels.subscribe((panels) => {
        expect(panels.length).toBe(1);
        expect(panels[0].panelTitle).toEqual('testTitle');
        expect(panels[0].component).toEqual('test-id');
        done();
      });
    });
  });
});
