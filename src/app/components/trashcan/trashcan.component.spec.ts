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

import { TestBed, async } from '@angular/core/testing';
import { CoreModule, AlfrescoApiService } from 'ng2-alfresco-core';
import { TrashcanComponent } from './trashcan.component';
import { CommonModule } from '../../common/common.module';
import { LocationLinkComponent } from '../location-link/location-link.component';

describe('TrashcanComponent', () => {
    let fixture;
    let component;
    let alfrescoApi: AlfrescoApiService;
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
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(TrashcanComponent);
            component = fixture.componentInstance;

            alfrescoApi = TestBed.get(AlfrescoApiService);

            component.documentList = {
                loadTrashcan:  jasmine.createSpy('loadTrashcan'),
                resetSelection: jasmine.createSpy('resetSelection')
            };
        });
    }));

    beforeEach(() => {
        spyOn(alfrescoApi.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve(page));
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
