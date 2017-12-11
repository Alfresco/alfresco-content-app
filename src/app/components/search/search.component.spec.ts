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

    describe('onItemClicked()', () => {
        it('opens preview if node is file', () => {
            spyOn(router, 'navigate').and.stub();
            const node = { entry: { isFile: true, id: 'node-id' } };

            component.onItemClicked(node);

            expect(router.navigate).toHaveBeenCalledWith(['/preview', node.entry.id]);
        });

        it('navigates if node is folder', () => {
            const node = { entry: { isFolder: true } };
            spyOn(router, 'navigate');

            component.onItemClicked(node);

            expect(router.navigate).toHaveBeenCalled();
        });
    });
});
