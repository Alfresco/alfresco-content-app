/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { CommonModule } from '../common.module';

@Component({
    template: '<div [app-node-info]="selection"></div>'
})
class TestComponent {
    selection;
}

describe('NodeInfoDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let apiService: AlfrescoApiService;
    let nodeService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule
            ],
            declarations: [
                TestComponent
            ]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        apiService = TestBed.get(AlfrescoApiService);
        nodeService = apiService.getInstance().nodes;
    }));

    beforeEach(() => {
        spyOn(nodeService, 'getNodeInfo').and.returnValue(Promise.resolve({
            entry: { name: 'borg' }
        }));
    });

    it('should not get node info onInit when selection is empty', () => {
        component.selection = [];

        fixture.detectChanges();

        expect(nodeService.getNodeInfo).not.toHaveBeenCalled();
    });

    it('should get node info onInit when selection is not empty', () => {
        component.selection = [{ entry: { id: 'id' } }];

        fixture.detectChanges();

        expect(nodeService.getNodeInfo).toHaveBeenCalled();
    });

    it('should not get node info on event when selection is empty', () => {
        component.selection = [];

        fixture.detectChanges();

        document.dispatchEvent(new CustomEvent('click'));

        expect(nodeService.getNodeInfo).not.toHaveBeenCalled();
    });

    it('should get node info on event from selection', () => {
        component.selection = [{ entry: { id: 'id' } }];

        fixture.detectChanges();

        document.dispatchEvent(new CustomEvent('click'));

        expect(nodeService.getNodeInfo).toHaveBeenCalledWith('id');
    });


    it('should get node info of last entry when selecting multiple nodes', fakeAsync(() => {
        component.selection = [
            { entry: { id: 'id1', isFile: true } },
            { entry: { id: 'id2', isFile: true } },
            { entry: { id: 'id3', isFile: true } }
        ];

        fixture.detectChanges();

        document.dispatchEvent(new CustomEvent('click'));

        fixture.detectChanges();
        tick();

        expect(nodeService.getNodeInfo).toHaveBeenCalledWith('id3');
    }));
});
