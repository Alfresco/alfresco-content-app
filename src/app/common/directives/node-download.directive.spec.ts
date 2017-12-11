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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CoreModule, AlfrescoApiService } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material';
import { Component, DebugElement } from '@angular/core';
import { DownloadFileDirective } from './node-download.directive';

@Component({
    template: '<div [app-download-node]="selection"></div>'
})
class TestComponent {
    selection;
}

describe('DownloadFileDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let dialog: MatDialog;
    let apiService: AlfrescoApiService;
    let contentService;
    let dialogSpy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                TestComponent,
                DownloadFileDirective
            ],
            providers: [
                AlfrescoApiService
            ]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(DownloadFileDirective));
        dialog = TestBed.get(MatDialog);
        apiService = TestBed.get(AlfrescoApiService);
        contentService = apiService.getInstance().content;
        dialogSpy = spyOn(dialog, 'open');
    });

    it('should not download node when selection is empty', () => {
        spyOn(apiService, 'getInstance');
        component.selection = [];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(apiService.getInstance).not.toHaveBeenCalled();
    });

    it('should not download zip when selection has no nodes', () => {
        component.selection = [];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(dialogSpy).not.toHaveBeenCalled();
    });

    it('should download selected node as file', () => {
        spyOn(contentService, 'getContentUrl');
        const node = { entry: { id: 'node-id', isFile: true } };
        component.selection = [node];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(contentService.getContentUrl).toHaveBeenCalledWith(node.entry.id, true);
    });

    it('should download selected files nodes as zip', () => {
        const node1 = { entry: { id: 'node-1' } };
        const node2 = { entry: { id: 'node-2' } };
        component.selection = [node1, node2];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(dialogSpy.calls.argsFor(0)[1].data).toEqual({ nodeIds: [ 'node-1', 'node-2' ] });
    });

    it('should download selected folder node as zip', () => {
        const node = { entry: { isFolder: true, id: 'node-id' } };
        component.selection = [node];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(dialogSpy.calls.argsFor(0)[1].data).toEqual({ nodeIds: [ 'node-id' ] });
    });

    it('should create link element to download file node', () => {
        const dummyLinkElement = {
            download: null,
            href: null,
            click: () => null,
            style: {
                display: null
            }
        };

        const node = { entry: { name: 'dummy', isFile: true, id: 'node-id' } };

        spyOn(contentService, 'getContentUrl').and.returnValue('somewhere-over-the-rainbow');
        spyOn(document, 'createElement').and.returnValue(dummyLinkElement);
        spyOn(document.body, 'appendChild').and.stub();
        spyOn(document.body, 'removeChild').and.stub();

        component.selection = [node];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(document.createElement).toHaveBeenCalled();
        expect(dummyLinkElement.download).toBe('dummy');
        expect(dummyLinkElement.href).toContain('somewhere-over-the-rainbow');
    });
});
