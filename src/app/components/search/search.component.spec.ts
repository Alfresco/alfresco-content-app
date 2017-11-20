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
import { CoreModule, AppConfigService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SearchComponent } from './search.component';
import { CommonModule } from './../../common/common.module';

describe('SearchComponent', () => {
    let fixture;
    let component;
    let router: Router;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                RouterTestingModule,
                CommonModule
            ],
            declarations: [
                SearchComponent
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(SearchComponent);
            component = fixture.componentInstance;
            router = TestBed.get(Router);

            fixture.detectChanges();
        });
    }));

    describe('onNodeClicked()', () => {
        it('opens preview if node is file', () => {
            spyOn(router, 'navigate').and.stub();
            const node = { entry: { isFile: true, id: 'node-id' } };

            component.onNodeClicked(node);

            expect(router.navigate).toHaveBeenCalledWith(['/preview', node.entry.id]);
        });

        it('navigates if node is folder', () => {
            const node = { entry: { isFolder: true } };
            spyOn(router, 'navigate');

            component.onNodeClicked(node);

            expect(router.navigate).toHaveBeenCalled();
        });
    });
});
