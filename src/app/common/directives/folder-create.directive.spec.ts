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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component  } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdDialogModule, MdDialog } from '@angular/material';

import { FolderCreateDirective } from './folder-create.directive';
import { ContentManagementService } from '../services/content-management.service';

@Component({
    template: '<div [app-create-folder]="parentNode"></div>'
})
class TestComponent {
    parentNode = '';
}

describe('FolderCreateDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element;
    let node: any;
    let dialog: MdDialog;
    let contentService: ContentManagementService;
    let dialogRefMock;

    const event: any = {
        type: 'click',
        preventDefault: () => null
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ MdDialogModule ],
            declarations: [
                TestComponent,
                FolderCreateDirective
            ]
            ,
            providers: [
                ContentManagementService
            ]
        });

        fixture = TestBed.createComponent(TestComponent);
        element = fixture.debugElement.query(By.directive(FolderCreateDirective));
        dialog = TestBed.get(MdDialog);
        contentService = TestBed.get(ContentManagementService);
    });

    beforeEach(() => {
        node = { entry: { id: 'nodeId' } };

        dialogRefMock = {
            afterClosed: val =>  Observable.of(val)
        };

        spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    });

    it('emits createFolder event when input value is not undefined', () => {
        spyOn(dialogRefMock, 'afterClosed').and.returnValue(Observable.of(node));

        contentService.createFolder.subscribe((val) => {
            expect(val).toBe(node);
        });

        element.triggerEventHandler('click', event);
        fixture.detectChanges();
    });

    it('does not emits createFolder event when input value is undefined', () => {
        spyOn(dialogRefMock, 'afterClosed').and.returnValue(Observable.of(null));
        spyOn(contentService.createFolder, 'next');

        element.triggerEventHandler('click', event);
        fixture.detectChanges();

        expect(contentService.createFolder.next).not.toHaveBeenCalled();
    });
});
