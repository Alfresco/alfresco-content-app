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
import { RouterTestingModule } from '@angular/router/testing';
import { AlfrescoContentService } from '@alfresco/adf-core';

import { BrowsingFilesService } from '../../common/services/browsing-files.service';

import { SidenavComponent } from './sidenav.component';
import { CommonModule } from './../../common/common.module';

describe('SidenavComponent', () => {
    let fixture;
    let component: SidenavComponent;
    let contentService: AlfrescoContentService;
    let browsingService: BrowsingFilesService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                CommonModule
            ],
            declarations: [
                SidenavComponent
            ]
        })
        .compileComponents()
        .then(() => {
            contentService = TestBed.get(AlfrescoContentService);
            browsingService = TestBed.get(BrowsingFilesService);

            fixture = TestBed.createComponent(SidenavComponent);
            component = fixture.componentInstance;

            fixture.detectChanges();
        });
    }));

    it('updates node on change', () => {
        const node: any = { entry: { id: 'someNodeId' } };

        browsingService.onChangeParent.next(<any>node);

        expect(component.node).toBe(node);
    });

    it('can create content', () => {
        spyOn(contentService, 'hasPermission').and.returnValue(true);
        const node: any = {};

        expect(component.canCreateContent(node)).toBe(true);
        expect(contentService.hasPermission).toHaveBeenCalledWith(node, 'create');
    });

    it('cannot create content for missing node', () => {
        spyOn(contentService, 'hasPermission').and.returnValue(true);

        expect(component.canCreateContent(null)).toBe(false);
        expect(contentService.hasPermission).not.toHaveBeenCalled();
    });

    it('cannot create content based on permission', () => {
        spyOn(contentService, 'hasPermission').and.returnValue(false);
        const node: any = {};

        expect(component.canCreateContent(node)).toBe(false);
        expect(contentService.hasPermission).toHaveBeenCalledWith(node, 'create');
    });
});
