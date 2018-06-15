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

import { Component, Input, ChangeDetectionStrategy, OnInit, ViewEncapsulation } from '@angular/core';
import { AlfrescoApiService, DataColumn, DataRow, DataTableAdapter } from '@alfresco/adf-core';
import { PathInfoEntity } from 'alfresco-js-api';
import { Observable } from 'rxjs/Rx';

import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import {  NavigateToLocationAction } from '../../store/actions';

@Component({
    selector: 'app-location-link',
    template: `
        <a href="" [title]="tooltip | async" (click)="goToLocation()">
            {{ displayText | async }}
        </a>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        'class': 'app-location-link adf-location-cell'
    }
})
export class LocationLinkComponent implements OnInit {

    @Input()
    context: any;

    @Input()
    link: any[];

    @Input()
    displayText: Observable<string>;

    @Input()
    tooltip: Observable<string>;

    constructor(
        private store: Store<AppStore>,
        private apiService: AlfrescoApiService) {
    }

    goToLocation() {
        if (this.context) {
            const { node } = this.context.row;

            this.store.dispatch(new NavigateToLocationAction(node.entry));
        }
    }

    ngOnInit() {
        if (this.context) {
            const data: DataTableAdapter = this.context.data;
            const col: DataColumn = this.context.col;
            const row: DataRow = this.context.row;
            const path: PathInfoEntity  = data.getValue(row, col);
            const value = path || this.context.row.node.entry.path;

            if (value && value.name && value.elements) {
                this.displayText = this.getDisplayText(value);
                this.tooltip = this.getTooltip(value);
            }
        }
    }

    // todo: review once 5.2.3 is out
    private getDisplayText(path: PathInfoEntity): Observable<string> {
        const elements = path.elements.map(e => e.name);

        // for admin users
        if (elements.length === 1 && elements[0] === 'Company Home') {
            return Observable.of('Personal Files');
        }

        // for non-admin users
        if (elements.length === 3 && elements[0] === 'Company Home' && elements[1] === 'User Homes') {
            return Observable.of('Personal Files');
        }

        const result = elements[elements.length - 1];

        if (result === 'documentLibrary') {
            const fragment = path.elements[path.elements.length - 2];

            return new Observable<string>(observer => {
                this.apiService.nodesApi.getNodeInfo(fragment.id).then(
                    (node) => {
                        observer.next(node.properties['cm:title'] || node.name || fragment.name);
                        observer.complete();
                    },
                    (err) => {
                        observer.next(fragment.name);
                        observer.complete();
                    }
                );
            });
        }

        return Observable.of(result);
    }

    // todo: review once 5.2.3 is out
    private getTooltip(path: PathInfoEntity): Observable<string> {
        const elements = path.elements.map(e => Object.assign({}, e));

        if (elements[0].name === 'Company Home') {
            elements[0].name = 'Personal Files';

            if (elements.length > 2) {
                if (elements[1].name === 'Sites') {
                    const fragment = elements[2];

                    return new Observable<string>(observer => {
                        this.apiService.nodesApi.getNodeInfo(fragment.id).then(
                            (node) => {
                                elements.splice(0, 2);
                                elements[0].name = node.properties['cm:title'] || node.name || fragment.name;
                                elements.splice(1, 1);
                                elements.unshift({ id: null, name: 'File Libraries' });

                                observer.next(elements.map(e => e.name).join('/'));
                                observer.complete();
                            },
                            (err) => {
                                elements.splice(0, 2);
                                elements.unshift({ id: null, name: 'File Libraries' });
                                elements.splice(2, 1);

                                observer.next(elements.map(e => e.name).join('/'));
                                observer.complete();
                            }
                        );
                    });
                }

                if (elements[1].name === 'User Homes') {
                    elements.splice(0, 3);
                    elements.unshift({ id: null, name: 'Personal Files'});
                }
            }
        }

        const result = elements.map(e => e.name).join('/');
        return Observable.of(result);
    }
}
