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
import { LibrariesBaseComponent } from './libraries-base.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { CustomEmptyContentTemplateDirective, PaginationComponent, UnitTestingUtils } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { SiteEntry } from '@alfresco/js-api';
import { Router } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { RouterEffects } from '@alfresco/aca-shared/store';
import { LibraryEffects } from '../../store/effects';
import { getTitleElementText } from '../../testing/test-utils';
import { librariesMock, libraryPaginationMock } from '../../mock/libraries-mock';
import { DebugElement } from '@angular/core';

describe('LibrariesBaseComponent', () => {
  let component: LibrariesBaseComponent;
  let fixture: ComponentFixture<LibrariesBaseComponent>;
  let unitTestingUtils: UnitTestingUtils;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule, LibrariesBaseComponent],
      providers: [provideEffects([RouterEffects, LibraryEffects])]
    }).compileComponents();
    fixture = TestBed.createComponent(LibrariesBaseComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);

    component.list = librariesMock;
    fixture.detectChanges();
  });

  it('should set title based on selectedRowItemsCount', () => {
    component.titleKey = 'TITLE_TRANSLATION_KEY';
    fixture.detectChanges();

    expect(getTitleElementText(fixture)).toBe('TITLE_TRANSLATION_KEY');

    component.selectedRowItemsCount = 5;
    fixture.detectChanges();

    expect(getTitleElementText(fixture)).toBe('APP.HEADER.SELECTED');
  });

  it('should show empty state when list is empty', () => {
    component.list = null;
    component.emptyTitleKey = 'EMPTY_TITLE';
    component.emptySubtitleKey = 'EMPTY_SUBTITLE';
    fixture.detectChanges();
    const emptyContent = unitTestingUtils.getByDirective(CustomEmptyContentTemplateDirective);

    expect(emptyContent.nativeElement.textContent).toContain('EMPTY_TITLE');
    expect(emptyContent.nativeElement.textContent).toContain('EMPTY_SUBTITLE');
  });

  describe('Pagination events', () => {
    let paginationComponent: DebugElement;

    beforeEach(() => {
      paginationComponent = unitTestingUtils.getByDirective(PaginationComponent);
    });

    it('should emit changePageSize event', () => {
      spyOn(component.changePageSize, 'emit');
      paginationComponent.triggerEventHandler('changePageSize', libraryPaginationMock);
      expect(component.changePageSize.emit).toHaveBeenCalledWith(libraryPaginationMock);
    });

    it('should emit changePageNumber event', () => {
      spyOn(component.changePageNumber, 'emit');
      paginationComponent.triggerEventHandler('changePageNumber', libraryPaginationMock);
      expect(component.changePageNumber.emit).toHaveBeenCalledWith(libraryPaginationMock);
    });

    it('should emit nextPage event', () => {
      spyOn(component.nextPage, 'emit');
      paginationComponent.triggerEventHandler('nextPage', libraryPaginationMock);
      expect(component.nextPage.emit).toHaveBeenCalledWith(libraryPaginationMock);
    });

    it('should emit prevPage event', () => {
      spyOn(component.prevPage, 'emit');
      paginationComponent.triggerEventHandler('prevPage', libraryPaginationMock);
      expect(component.prevPage.emit).toHaveBeenCalledWith(libraryPaginationMock);
    });
  });

  describe('Node navigation', () => {
    it('should not navigate when node is null or missing guid', () => {
      spyOn(router, 'navigate').and.stub();
      component.navigateTo(null);
      expect(router.navigate).not.toHaveBeenCalled();

      component.navigateTo({ entry: {} } as SiteEntry);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should dispatch navigation action when node has guid', () => {
      spyOn(component['store'], 'dispatch').and.stub();
      component.navigateTo({ entry: { guid: 'guid' } } as SiteEntry);
      expect(component['store'].dispatch).toHaveBeenCalled();
    });

    it('should handle node double click', () => {
      spyOn(component, 'navigateTo').and.stub();
      const documentList = unitTestingUtils.getByDirective(DocumentListComponent);
      documentList.triggerEventHandler('node-dblclick', { detail: { node: { entry: { guid: 'guid' } } } });
      expect(component.navigateTo).toHaveBeenCalledWith({ entry: { guid: 'guid' } } as SiteEntry);
    });

    it('should handle name click', () => {
      spyOn(component, 'navigateTo').and.stub();
      const documentList = unitTestingUtils.getByDirective(DocumentListComponent);
      documentList.triggerEventHandler('name-click', { detail: { node: { entry: { guid: 'guid' } } } });
      expect(component.navigateTo).toHaveBeenCalledWith({ entry: { guid: 'guid' } } as SiteEntry);
    });
  });
});
