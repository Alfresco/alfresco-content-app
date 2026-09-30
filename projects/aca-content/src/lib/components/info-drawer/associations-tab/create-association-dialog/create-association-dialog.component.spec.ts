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

import { CreateAssociationDialogComponent } from './create-association-dialog.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Node } from '@alfresco/js-api';
import { NoopTranslateModule, provideCoreAuthTesting } from '@alfresco/adf-core';
import { AlfrescoApiService, AlfrescoApiServiceMock, ContentNodeSelectorPanelComponent } from '@alfresco/adf-content-services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'adf-content-node-selector-panel',
  template: '<div data-automation-id="mock-content-node-selector"></div>',
  standalone: true
})
class MockContentNodeSelectorPanelComponent {
  @Input() currentFolderId: string;
  @Input() selectionMode: string;
  @Input() showDropdownSiteList: boolean;
  @Input() showFilesInResult: boolean;
  @Input() isSelectionValid: (node: Node) => boolean;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() select = new EventEmitter<Node[]>();
}

describe('CreateAssociationDialogComponent', () => {
  let component: CreateAssociationDialogComponent;
  let fixture: ComponentFixture<CreateAssociationDialogComponent>;
  let dialogRef: MatDialogRef<CreateAssociationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, CreateAssociationDialogComponent],
      providers: [
        provideCoreAuthTesting(),
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { node: { id: 'source-1' } as Node } }
      ]
    }).overrideComponent(CreateAssociationDialogComponent, {
      remove: { imports: [ContentNodeSelectorPanelComponent] },
      add: { imports: [MockContentNodeSelectorPanelComponent] }
    });

    dialogRef = TestBed.inject(MatDialogRef);
    fixture = TestBed.createComponent(CreateAssociationDialogComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should start with an invalid form and no selected target', () => {
    expect(component.form.invalid).toBe(true);
    expect(component.selectedTarget).toBeNull();
  });

  describe('association type validation', () => {
    it('should be invalid for an empty association type', () => {
      component.form.controls.associationType.setValue('');
      expect(component.form.controls.associationType.valid).toBe(false);
    });

    it('should be invalid for a whitespace-only association type', () => {
      component.form.controls.associationType.setValue('   ');
      expect(component.form.controls.associationType.valid).toBe(false);
    });

    it('should be valid for a non-empty association type', () => {
      component.form.controls.associationType.setValue('cm:references');
      expect(component.form.controls.associationType.valid).toBe(true);
    });
  });

  describe('validateSelection', () => {
    it('should allow JSON files by mime type', () => {
      const node = { isFile: true, content: { mimeType: 'application/json' } } as Node;
      expect(component.validateSelection(node)).toBe(true);
    });

    it('should allow JSON files by extension', () => {
      const node = { isFile: true, name: 'data.JSON', content: { mimeType: 'text/plain' } } as unknown as Node;
      expect(component.validateSelection(node)).toBe(true);
    });

    it('should reject non-JSON files', () => {
      const node = { isFile: true, name: 'report.pdf', content: { mimeType: 'application/pdf' } } as unknown as Node;
      expect(component.validateSelection(node)).toBe(false);
    });

    it('should reject folders', () => {
      const node = { isFile: false, isFolder: true, name: 'folder' } as Node;
      expect(component.validateSelection(node)).toBe(false);
    });
  });

  describe('onNodeSelect', () => {
    it('should store the first selected node', () => {
      const node = { id: 'target-1' } as Node;
      component.onNodeSelect([node]);
      expect(component.selectedTarget).toBe(node);
    });

    it('should clear the selection when nothing is selected', () => {
      component.onNodeSelect([]);
      expect(component.selectedTarget).toBeNull();
    });
  });

  describe('submit', () => {
    it('should not close the dialog when the form is invalid', () => {
      component.selectedTarget = { id: 'target-1' } as Node;
      component.submit();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should not close the dialog when no target is selected', () => {
      component.form.controls.associationType.setValue('cm:references');
      component.submit();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should close the dialog with the association type and selected target', () => {
      const target = { id: 'target-1' } as Node;
      component.form.controls.associationType.setValue('cm:references');
      component.selectedTarget = target;
      component.submit();

      expect(dialogRef.close).toHaveBeenCalledWith({ associationType: 'cm:references', target });
    });
  });
});
