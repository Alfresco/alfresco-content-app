/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent, DialogSize, UnitTestingUtils } from '@alfresco/adf-core';
import { LocationLinkComponent } from './location-link.component';
import { ContentApiService, LibTestingModule } from '@alfresco/aca-shared';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { NavigateToParentFolder } from '@alfresco/aca-shared/store';
import { of, skip, take, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NodeLocationReferencesComponent } from '../../../dialogs/node-location-references/node-location-references.component';
import { Node } from '@alfresco/js-api';
import { DebugElement } from '@angular/core';

describe('LocationLinkComponent', () => {
  let fixture: ComponentFixture<LocationLinkComponent>;
  let contentApi: ContentApiService;
  let unitTestingUtils: UnitTestingUtils;
  let store: Store;
  let dialog: MatDialog;

  const getCell = (): DebugElement => unitTestingUtils.getByCSS('.adf-datatable-cell-value');

  const getCellText = (): string => unitTestingUtils.getInnerTextByCSS('.adf-datatable-cell-value');

  const testTooltipValue = (value: string, done: DoneFn): void => {
    fixture.detectChanges();
    fixture.componentInstance.nodeLocation$.pipe(skip(1), take(1)).subscribe(() => {
      fixture.detectChanges();
      expect(getCell().nativeElement.title).toBe(value);
      done();
    });
    const hostElement = fixture.nativeElement;
    const mouseenter = new MouseEvent('mouseenter', { bubbles: true });
    hostElement.dispatchEvent(mouseenter);
    fixture.detectChanges();
  };

  const clickLink = (): void => {
    fixture.detectChanges();
    unitTestingUtils.clickByCSS('.adf-datatable-cell-value');
    fixture.detectChanges();
  };

  const clickInfoButton = (): void => {
    fixture.detectChanges();
    unitTestingUtils.clickByCSS('.aca-location-link-info-btn');
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LocationLinkComponent, LibTestingModule],
      providers: [provideMockStore({})]
    });

    fixture = TestBed.createComponent(LocationLinkComponent);
    contentApi = TestBed.inject(ContentApiService);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
    store = TestBed.inject(Store);
    dialog = TestBed.inject(MatDialog);
    fixture.componentInstance.context = null;
  });

  it('should not allow the navigation when there is no context', () => {
    spyOn(store, 'dispatch');
    fixture.componentInstance.hasPrimaryParentPath = true;
    clickLink();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should not open additional locations dialog when there is no context', () => {
    spyOn(dialog, 'open');
    clickInfoButton();
    expect(dialog.open).not.toHaveBeenCalled();
  });

  describe('when node has primary parent path', () => {
    beforeEach(() => {
      fixture.componentInstance.context = {
        row: {
          node: {
            entry: {
              path: {
                name: 'Test',
                elements: [{ name: 'Company Home' }]
              }
            }
          }
        }
      };
    });

    it('should display primary path', () => {
      fixture.detectChanges();
      expect(getCellText()).toBe('APP.BROWSE.PERSONAL.TITLE');
    });

    it('should display path name when showLocation is true', () => {
      fixture.componentInstance.showLocation = true;
      fixture.componentInstance.context.row.node.entry.path.name = '/Company Home';
      fixture.detectChanges();
      expect(getCellText()).toBe('Company Home');
    });

    it('should display APP.BROWSE.PERSONAL.TITLE for single Company Home element', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [{ id: '1', name: 'Company Home' }]
      };
      fixture.detectChanges();
      expect(getCellText()).toBe('APP.BROWSE.PERSONAL.TITLE');
    });

    it('should not display APP.BROWSE.PERSONAL.TITLE when single element is not Company Home', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [{ id: '1', name: 'Other Root' }]
      };
      fixture.detectChanges();
      expect(getCellText()).toBe('Other Root');
    });

    it('should not display APP.BROWSE.PERSONAL.TITLE when path has multiple elements even if first is Company Home', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Folder1' }
        ]
      };
      fixture.detectChanges();
      expect(getCellText()).toBe('Folder1');
    });

    it('should display APP.BROWSE.PERSONAL.TITLE for path with Company Home, User Homes, and third element', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'User Homes' },
          { id: '3', name: 'user123' }
        ]
      };
      fixture.detectChanges();
      expect(getCellText()).toBe('APP.BROWSE.PERSONAL.TITLE');
    });

    it('should not display APP.BROWSE.PERSONAL.TITLE when path has 3 elements but second is not User Homes', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Sites' },
          { id: '3', name: 'site1' }
        ]
      };
      fixture.detectChanges();
      expect(getCellText()).toBe('site1');
    });

    it('should not display APP.BROWSE.PERSONAL.TITLE when path has 3 elements but first is not Company Home', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Root' },
          { id: '2', name: 'User Homes' },
          { id: '3', name: 'user123' }
        ]
      };
      fixture.detectChanges();
      expect(getCellText()).toBe('user123');
    });

    it('should not display APP.BROWSE.PERSONAL.TITLE when path has Company Home and User Homes but more than 3 elements', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'User Homes' },
          { id: '3', name: 'user123' },
          { id: '4', name: 'Documents' }
        ]
      };
      fixture.detectChanges();
      expect(getCellText()).toBe('Documents');
    });

    it('should use cm:title from node info response when available', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Sites' },
          { id: 'site-id', name: 'site-name' },
          { id: '4', name: 'documentLibrary' }
        ]
      };

      const mockNode = {
        id: 'site-id',
        name: 'site-name',
        properties: { 'cm:title': 'My Site Title' }
      } as Node;

      spyOn(contentApi, 'getNodeInfo').and.returnValue(of(mockNode));
      fixture.detectChanges();

      expect(getCellText()).toBe('My Site Title');
    });

    it('should use node name when cm:title is not available', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Sites' },
          { id: 'site-id', name: 'site-name' },
          { id: '4', name: 'documentLibrary' }
        ]
      };

      const mockNode = {
        id: 'site-id',
        name: 'Actual Site Name',
        properties: {}
      } as Node;

      spyOn(contentApi, 'getNodeInfo').and.returnValue(of(mockNode));
      fixture.detectChanges();
      expect(getCellText()).toBe('Actual Site Name');
    });

    it('should display fragment name as fallback when node has no cm:title or name', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Sites' },
          { id: 'site-id', name: 'fallback-fragment-name' },
          { id: '4', name: 'documentLibrary' }
        ]
      };

      const mockNode = {
        id: 'site-id',
        name: '',
        properties: {}
      } as Node;

      spyOn(contentApi, 'getNodeInfo').and.returnValue(of(mockNode));

      fixture.detectChanges();
      expect(getCellText()).toBe('fallback-fragment-name');
    });

    it('should handle API error gracefully and display fragment name', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Sites' },
          { id: 'site-id', name: 'error-fallback-name' },
          { id: '4', name: 'documentLibrary' }
        ]
      };

      spyOn(contentApi, 'getNodeInfo').and.returnValue(throwError(() => new Error('API Error')));

      fixture.detectChanges();
      expect(getCellText()).toBe('error-fallback-name');
    });

    it('should display last element name for simple path', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Folder1' },
          { id: '2', name: 'Folder2' },
          { id: '3', name: 'Folder3' }
        ]
      };

      fixture.detectChanges();
      expect(getCellText()).toBe('Folder3');
    });

    it('should display last element name when path contains documentLibrary but not as last element', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Sites' },
          { id: '3', name: 'documentLibrary' },
          { id: '4', name: 'SubFolder' }
        ]
      };

      fixture.detectChanges();
      expect(getCellText()).toBe('SubFolder');
    });

    it('should display last element name for path with Company Home and multiple folders', () => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Folder1' },
          { id: '3', name: 'Folder2' },
          { id: '4', name: 'FinalFolder' }
        ]
      };

      fixture.detectChanges();
      expect(getCellText()).toBe('FinalFolder');
    });

    it('should navigate to parent folder on click', () => {
      spyOn(store, 'dispatch');
      clickLink();
      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          ...new NavigateToParentFolder(fixture.componentInstance.context.row.node)
        })
      );
    });

    it('should display tooltip on mouse enter', (done) => {
      testTooltipValue('APP.BROWSE.PERSONAL.TITLE', done);
    });

    it('should join elements with slash for the tooltip when first element is not Company Home', (done) => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Root' },
          { id: '2', name: 'Folder1' },
          { id: '3', name: 'Folder2' }
        ]
      };

      testTooltipValue('Root/Folder1/Folder2', done);
    });

    it('should replace Company Home with Personal Files', (done) => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Folder1' }
        ]
      };

      testTooltipValue('APP.BROWSE.PERSONAL.TITLE/Folder1', done);
    });

    it('should handle User Homes path correctly', (done) => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'User Homes' },
          { id: '3', name: 'user123' },
          { id: '4', name: 'Documents' }
        ]
      };

      testTooltipValue('APP.BROWSE.PERSONAL.TITLE/Documents', done);
    });

    it('should handle path with Company Home and other second element (not Sites or User Homes)', (done) => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'OtherFolder' },
          { id: '3', name: 'SubFolder' }
        ]
      };

      testTooltipValue('APP.BROWSE.PERSONAL.TITLE/OtherFolder/SubFolder', done);
    });

    it('should use cm:title from node info response when available', (done) => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Sites' },
          { id: 'site-id', name: 'site-name' },
          { id: '4', name: 'documentLibrary' }
        ]
      };

      const mockNode = {
        id: 'site-id',
        name: 'site-name',
        properties: { 'cm:title': 'My Site Title' }
      } as Node;

      spyOn(contentApi, 'getNodeInfo').and.returnValue(of(mockNode));

      testTooltipValue('APP.BROWSE.LIBRARIES.TITLE/My Site Title', done);
    });

    it('should use node name when cm:title is not available', (done) => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Sites' },
          { id: 'site-id', name: 'site-name' },
          { id: '4', name: 'documentLibrary' }
        ]
      };

      const mockNode = {
        id: 'site-id',
        name: 'Actual Site Name',
        properties: {}
      } as Node;

      spyOn(contentApi, 'getNodeInfo').and.returnValue(of(mockNode));

      testTooltipValue('APP.BROWSE.LIBRARIES.TITLE/Actual Site Name', done);
    });

    it('should use fragment name as fallback when node has no cm:title or name', (done) => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Sites' },
          { id: 'site-id', name: 'fallback-name' },
          { id: '4', name: 'documentLibrary' }
        ]
      };

      const mockNode = {
        id: 'site-id',
        name: '',
        properties: {}
      } as Node;

      spyOn(contentApi, 'getNodeInfo').and.returnValue(of(mockNode));

      testTooltipValue('APP.BROWSE.LIBRARIES.TITLE/fallback-name', done);
    });

    it('should handle API error and use fragment name', (done) => {
      fixture.componentInstance.context.row.node.entry.path = {
        name: 'Test',
        elements: [
          { id: '1', name: 'Company Home' },
          { id: '2', name: 'Sites' },
          { id: 'site-id', name: 'error-fallback-name' },
          { id: '4', name: 'documentLibrary' }
        ]
      };

      spyOn(contentApi, 'getNodeInfo').and.returnValue(throwError(() => new Error('API Error')));

      testTooltipValue('APP.BROWSE.LIBRARIES.TITLE/error-fallback-name', done);
    });
  });

  describe('when node does not have primary parent path', () => {
    beforeEach(() => {
      fixture.componentInstance.context = {
        row: {
          node: {
            entry: {
              path: {}
            }
          }
        }
      };
    });

    it('should display unknown location message with info button', () => {
      fixture.detectChanges();
      const infoButton = unitTestingUtils.getByCSS('.aca-location-link-info-btn');
      const unknownLocation = getCell();
      expect(unknownLocation.nativeElement.innerText.trim()).toBe('APP.BROWSE.SEARCH.UNKNOWN_LOCATION');
      expect(unknownLocation.attributes['title']).toBe('APP.BROWSE.SEARCH.UNKNOWN_LOCATION');
      expect(infoButton.attributes['title']).toBe('APP.BROWSE.SEARCH.VIEW_ADDITIONAL_LOCATIONS');
      expect(infoButton.attributes['aria-label']).toBe('APP.BROWSE.SEARCH.VIEW_ADDITIONAL_LOCATIONS');
      expect(infoButton.nativeElement.innerText.trim()).toBe('info');
    });

    it('should open additional location references dialog on info button click', () => {
      spyOn(dialog, 'open');
      clickInfoButton();
      expect(dialog.open).toHaveBeenCalledWith(DialogComponent, {
        data: {
          title: 'APP.ADDITIONAL_REFERENCES_DIALOG.TITLE',
          confirmButtonTitle: 'APP.ADDITIONAL_REFERENCES_DIALOG.CLOSE',
          isCancelButtonHidden: true,
          isCloseButtonHidden: false,
          dialogSize: DialogSize.Medium,
          contentComponent: NodeLocationReferencesComponent,
          componentData: fixture.componentInstance.context.row.node.entry
        },
        width: '600px',
        restoreFocus: true
      });
    });
  });
});
