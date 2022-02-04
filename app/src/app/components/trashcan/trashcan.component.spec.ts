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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlfrescoApiService, NodeFavoriteDirective, DataTableComponent, AppConfigModule } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { TrashcanComponent } from './trashcan.component';
import { AppTestingModule } from '../../testing/app-testing.module';

describe('TrashcanComponent', () => {
  let fixture: ComponentFixture<TrashcanComponent>;
  let component: TrashcanComponent;
  let alfrescoApi: AlfrescoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, AppConfigModule],
      declarations: [DataTableComponent, NodeFavoriteDirective, DocumentListComponent, TrashcanComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(TrashcanComponent);
    component = fixture.componentInstance;

    alfrescoApi = TestBed.inject(AlfrescoApiService);
    alfrescoApi.reset();

    component.documentList = {
      reload: jasmine.createSpy('reload'),
      resetSelection: jasmine.createSpy('resetSelection')
    } as any;
  });

  it('should perform at least a test otherwise karma will complain', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('adf-document-list')).not.toBeNull();
  });
});
