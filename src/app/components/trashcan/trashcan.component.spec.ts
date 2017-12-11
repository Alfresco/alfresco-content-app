/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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

import { TestBed, async } from '@angular/core/testing';
import { CoreModule, AlfrescoApiService } from '@alfresco/adf-core';
import { TrashcanComponent } from './trashcan.component';
import { CommonModule } from '../../common/common.module';
import { LocationLinkComponent } from '../location-link/location-link.component';
import { ContentManagementService } from '../../common/services/content-management.service';

describe('TrashcanComponent', () => {
    let fixture;
    let component;
    let alfrescoApi: AlfrescoApiService;
    let contentService: ContentManagementService;
    let page;

    beforeEach(() => {
        page = {
            list: {
                entries: [ { entry: { id: 1 } }, { entry: { id: 2 } } ],
                pagination: { data: 'data'}
            }
        };
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                CommonModule
            ],
            declarations: [
                LocationLinkComponent,
                TrashcanComponent
            ],
            providers: [
                ContentManagementService
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(TrashcanComponent);
            component = fixture.componentInstance;

            alfrescoApi = TestBed.get(AlfrescoApiService);
            contentService = TestBed.get(ContentManagementService);

            component.documentList = {
                loadTrashcan:  jasmine.createSpy('loadTrashcan'),
                resetSelection: jasmine.createSpy('resetSelection')
            };
        });
    }));

    beforeEach(() => {
        spyOn(alfrescoApi.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve(page));
    });

    describe('onRestoreNode()', () => {
        it('should call refresh()', () => {
            spyOn(component, 'refresh');
            fixture.detectChanges();

            contentService.restoreNode.next();

            expect(component.refresh).toHaveBeenCalled();
        });
    });

    describe('refresh()', () => {
        it('calls child component to reload', () => {
            component.refresh();
            expect(component.documentList.loadTrashcan).toHaveBeenCalled();
        });

        it('calls child component to reset selection', () => {
            component.refresh();
            expect(component.documentList.resetSelection).toHaveBeenCalled();
        });
    });
});
