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

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { CoreModule, AlfrescoApiService } from '@alfresco/adf-core';

import { CommonModule } from '../../common/common.module';
import { ContentManagementService } from '../../common/services/content-management.service';
import { LocationLinkComponent } from '../location-link/location-link.component';
import { RecentFilesComponent } from './recent-files.component';

describe('RecentFiles Routed Component', () => {
    let fixture;
    let component;
    let router: Router;
    let alfrescoApi: AlfrescoApiService;
    let contentService: ContentManagementService;
    let page;
    let person;

    beforeEach(() => {
        page = {
            list: {
                entries: [ { entry: { id: 1 } }, { entry: { id: 2 } } ],
                pagination: { data: 'data'}
            }
        };

        person = { entry: { id: 'bogus' } };
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [
                    CoreModule,
                    RouterTestingModule,
                    CommonModule
                ],
                declarations: [
                    LocationLinkComponent,
                    RecentFilesComponent
                ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(RecentFilesComponent);
            component = fixture.componentInstance;

            router = TestBed.get(Router);
            contentService = TestBed.get(ContentManagementService);
            alfrescoApi = TestBed.get(AlfrescoApiService);
        });
    }));

    beforeEach(() => {
        spyOn(alfrescoApi.peopleApi, 'getPerson').and.returnValue(Promise.resolve({
             entry: { id: 'personId' }
        }));

        spyOn(alfrescoApi.searchApi, 'search').and.returnValue(Promise.resolve(page));
    });

    describe('OnInit()', () => {
        beforeEach(() => {
            spyOn(component, 'refresh').and.stub();
        });

        it('should reload nodes on onDeleteNode event', () => {
            fixture.detectChanges();

            contentService.deleteNode.next();

            expect(component.refresh).toHaveBeenCalled();
        });

        it('should reload on onRestoreNode event', () => {
            fixture.detectChanges();

            contentService.restoreNode.next();

            expect(component.refresh).toHaveBeenCalled();
        });

        it('should reload on move node event', () => {
            fixture.detectChanges();

            contentService.moveNode.next();

            expect(component.refresh).toHaveBeenCalled();
        });
    });

    describe('onNodeDoubleClick()', () => {
        beforeEach(() => {
            spyOn(component, 'fetchNodes').and.callFake(val => val);
        });

        it('open preview if node is file', () => {
            spyOn(router, 'navigate').and.stub();
            const node: any = { isFile: true };

            component.onNodeDoubleClick(node);
            fixture.detectChanges();

            expect(router.navigate).toHaveBeenCalledWith(['/preview', node.id]);
        });

        it('does not open preview if node is folder', () => {
            spyOn(router, 'navigate').and.stub();
            const node: any = { isFolder: true };

            component.onNodeDoubleClick(node);
            fixture.detectChanges();

            expect(router.navigate).not.toHaveBeenCalled();
        });
    });

    describe('refresh', () => {
        it('should call document list reload', () => {
            spyOn(component.documentList, 'reload');
            fixture.detectChanges();

            component.refresh();

            expect(component.documentList.reload).toHaveBeenCalled();
        });
    });
});
