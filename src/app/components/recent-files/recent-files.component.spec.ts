/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { CoreModule, AlfrescoApiService } from 'ng2-alfresco-core';

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

        it('should reload on toggleFavorite event', () => {
            fixture.detectChanges();

            contentService.toggleFavorite.next();

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
