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

import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
// import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Converter } from 'showdown';

@Component({
    selector: 'aca-markdown-view',
    template: `<div class="content" [innerHTML]="content"></div>`,
    styleUrls: ['./markdown-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'aca-markdown-view' }
})
export class MarkdownViewComponent implements OnInit {
    @Input()
    url: string;

    @Input()
    node: MinimalNodeEntryEntity;

    // content: SafeHtml = null;
    content: string = null;

    constructor(
        private apiService: AlfrescoApiService
        // private sanitizer: DomSanitizer
        ) {}

    ngOnInit() {
        this.apiService.nodesApi.getFileContent(this.node.id).then(
            result => {
                const converter = new Converter({
                    tables: true,
                    ghCodeBlocks: true,
                    ghCompatibleHeaderId: true,
                    simplifiedAutoLink: true
                });
                converter.setOption('metadata', true);
                converter.setFlavor('github');

                const html = converter.makeHtml(result);
                // this.content = this.sanitizer.bypassSecurityTrustHtml(html);
                this.content = html;
            },
            err => console.log(err)
        );
    }
}
