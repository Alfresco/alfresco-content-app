/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AssociationsTabComponent } from './associations-tab.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentApiService } from '@alfresco/aca-shared';
import { AssociationEntry, Node, NodeAssociationEntry, NodeAssociationPaging } from '@alfresco/js-api';
import { EMPTY, of, throwError } from 'rxjs';
import { NoopTranslateModule, NotificationService, provideCoreAuthTesting } from '@alfresco/adf-core';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';
import { MatDialog } from '@angular/material/dialog';
import { CreateAssociationDialogResult } from './create-association-dialog/create-association-dialog.component';

describe('AssociationsTabComponent', () => {
  let component: AssociationsTabComponent;
  let fixture: ComponentFixture<AssociationsTabComponent>;
  let contentApiService: ContentApiService;
  let notificationService: NotificationService;
  let matDialog: MatDialog;

  const mockPaging = {
    list: {
      entries: [
        {
          entry: {
            id: 'target-1',
            name: 'Associated file',
            nodeType: 'cm:content',
            isFile: true,
            isFolder: false,
            association: { assocType: 'cm:references' }
          }
        }
      ]
    }
  } as NodeAssociationPaging;

  const mockAssociation = {
    entry: {
      id: 'target-1',
      name: 'Associated file',
      association: { assocType: 'cm:references' }
    }
  } as NodeAssociationEntry;

  /** Makes MatDialog.open return a dialog ref whose afterClosed() emits the given value. */
  const stubDialog = (afterClosedValue: unknown) => {
    (matDialog.open as jasmine.Spy).and.returnValue({ afterClosed: () => of(afterClosedValue) } as any);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, AssociationsTabComponent],
      providers: [
        provideCoreAuthTesting(),
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: MatDialog, useValue: { open: jasmine.createSpy('open') } },
        {
          provide: NotificationService,
          useValue: { showInfo: jasmine.createSpy('showInfo'), showError: jasmine.createSpy('showError') }
        }
      ]
    });

    contentApiService = TestBed.inject(ContentApiService);
    notificationService = TestBed.inject(NotificationService);
    matDialog = TestBed.inject(MatDialog);

    fixture = TestBed.createComponent(AssociationsTabComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('loading associations', () => {
    it('should not load associations when no node is provided', () => {
      const spy = spyOn(contentApiService, 'getNodeTargetAssociations');
      fixture.componentRef.setInput('node', null);
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
      expect(component.associations).toEqual([]);
    });

    it('should load target associations for the selected node', () => {
      spyOn(contentApiService, 'getNodeTargetAssociations').and.returnValue(of(mockPaging));
      fixture.componentRef.setInput('node', { id: 'node-1', isFile: true } as Node);
      fixture.detectChanges();

      expect(contentApiService.getNodeTargetAssociations).toHaveBeenCalledWith('node-1');
      expect(component.associations.length).toBe(1);
      expect(component.associations[0].entry.name).toBe('Associated file');
      expect(component.loading).toBe(false);
    });

    it('should use nodeId over id for shared file types', () => {
      const spy = spyOn(contentApiService, 'getNodeTargetAssociations').and.returnValue(of(mockPaging));
      fixture.componentRef.setInput('node', { id: 'node-1', nodeId: 'shared-node-1', isFile: true } as any);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('shared-node-1');
    });

    it('should reload associations when the selected node changes', () => {
      const spy = spyOn(contentApiService, 'getNodeTargetAssociations').and.returnValue(of(mockPaging));
      fixture.componentRef.setInput('node', { id: 'node-1', isFile: true } as Node);
      fixture.detectChanges();

      fixture.componentRef.setInput('node', { id: 'node-2', isFile: true } as Node);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.calls.argsFor(0)).toEqual(['node-1']);
      expect(spy.calls.argsFor(1)).toEqual(['node-2']);
    });

    it('should reset associations and stop loading on error', () => {
      spyOn(contentApiService, 'getNodeTargetAssociations').and.returnValue(throwError(() => new Error('failure')));
      fixture.componentRef.setInput('node', { id: 'node-1', isFile: true } as Node);
      fixture.detectChanges();

      expect(component.associations).toEqual([]);
      expect(component.loading).toBe(false);
    });

    it('should handle an empty associations list', () => {
      spyOn(contentApiService, 'getNodeTargetAssociations').and.returnValue(of({ list: { entries: [] } } as NodeAssociationPaging));
      fixture.componentRef.setInput('node', { id: 'node-1', isFile: true } as Node);
      fixture.detectChanges();

      expect(component.associations).toEqual([]);
      expect(component.loading).toBe(false);
    });
  });

  describe('creating an association', () => {
    const dialogResult: CreateAssociationDialogResult = {
      associationType: 'cm:references',
      target: { id: 'target-1' } as Node
    };

    beforeEach(() => {
      component.node = { id: 'node-1' } as Node;
      spyOn(contentApiService, 'getNodeTargetAssociations').and.returnValue(of(mockPaging));
    });

    it('should not create an association when the dialog is dismissed', () => {
      stubDialog(undefined);
      const createSpy = spyOn(contentApiService, 'createNodeAssociation');
      component.openCreateAssociationDialog();
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should create the association using the selected node and type', () => {
      stubDialog(dialogResult);
      const createSpy = spyOn(contentApiService, 'createNodeAssociation').and.returnValue(of({} as AssociationEntry));
      component.openCreateAssociationDialog();

      expect(createSpy).toHaveBeenCalledWith('node-1', { targetId: 'target-1', assocType: 'cm:references' });
    });

    it('should notify and reload after a successful creation', () => {
      stubDialog(dialogResult);
      spyOn(contentApiService, 'createNodeAssociation').and.returnValue(of({} as AssociationEntry));
      component.openCreateAssociationDialog();

      expect(notificationService.showInfo).toHaveBeenCalledWith('APP.INFO_DRAWER.ASSOCIATIONS.CREATE_SUCCESS');
      expect(contentApiService.getNodeTargetAssociations).toHaveBeenCalled();
    });

    it('should surface the API error summary when creation fails', () => {
      stubDialog(dialogResult);
      const apiError = { message: JSON.stringify({ error: { briefSummary: 'Unknown assocType: test' } }) };
      spyOn(contentApiService, 'createNodeAssociation').and.returnValue(throwError(() => apiError));
      component.openCreateAssociationDialog();

      expect(notificationService.showError).toHaveBeenCalledWith('Unknown assocType: test');
    });

    it('should fall back to a generic error message when the error is not parseable', () => {
      stubDialog(dialogResult);
      spyOn(contentApiService, 'createNodeAssociation').and.returnValue(throwError(() => new Error('boom')));
      component.openCreateAssociationDialog();

      expect(notificationService.showError).toHaveBeenCalledWith('APP.INFO_DRAWER.ASSOCIATIONS.CREATE_ERROR');
    });
  });

  describe('deleting an association', () => {
    beforeEach(() => {
      component.node = { id: 'node-1' } as Node;
      spyOn(contentApiService, 'getNodeTargetAssociations').and.returnValue(of(mockPaging));
    });

    it('should not delete when the confirmation is declined', () => {
      stubDialog(false);
      const deleteSpy = spyOn(contentApiService, 'deleteNodeAssociation');
      component.deleteAssociation(mockAssociation);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('should delete the association when confirmed', () => {
      stubDialog(true);
      const deleteSpy = spyOn(contentApiService, 'deleteNodeAssociation').and.returnValue(of(undefined));
      component.deleteAssociation(mockAssociation);

      expect(deleteSpy).toHaveBeenCalledWith('node-1', 'target-1', 'cm:references');
      expect(notificationService.showInfo).toHaveBeenCalledWith('APP.INFO_DRAWER.ASSOCIATIONS.DELETE_SUCCESS');
      expect(contentApiService.getNodeTargetAssociations).toHaveBeenCalled();
    });

    it('should notify on deletion error', () => {
      stubDialog(true);
      spyOn(contentApiService, 'deleteNodeAssociation').and.returnValue(throwError(() => new Error('failure')));
      component.deleteAssociation(mockAssociation);

      expect(notificationService.showError).toHaveBeenCalledWith('APP.INFO_DRAWER.ASSOCIATIONS.DELETE_ERROR');
    });

    it('should not delete when the source node id is missing', () => {
      component.node = {} as Node;
      stubDialog(true);
      const deleteSpy = spyOn(contentApiService, 'deleteNodeAssociation').and.returnValue(EMPTY);
      component.deleteAssociation(mockAssociation);
      expect(deleteSpy).not.toHaveBeenCalled();
    });
  });
});
