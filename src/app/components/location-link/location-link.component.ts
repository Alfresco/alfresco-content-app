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

import { Component, Input, ChangeDetectionStrategy, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { PathInfo, MinimalNodeEntity } from 'alfresco-js-api';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { NavigateToParentFolder } from '../../store/actions';
import { ContentApiService } from '../../services/content-api.service';

@Component({
    selector: 'aca-location-link',
    template: `
        <a href="" [title]="nodeLocation$ | async" (click)="goToLocation()">
            {{ displayText | async }}
        </a>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'aca-location-link adf-location-cell' }
})
export class LocationLinkComponent implements OnInit {
    private _path: PathInfo;

    nodeLocation$ = new BehaviorSubject(null);

    @Input()
    context: any;

    @Input()
    link: any[];

    @Input()
    displayText: Observable<string>;

    @Input()
    tooltip: Observable<string>;

    @HostListener('mouseenter') onMouseEnter() {
        this.getTooltip(this._path);
    }

    constructor(
        private store: Store<AppStore>,
        private contentApi: ContentApiService) {
    }

    goToLocation() {
        if (this.context) {
            const node: MinimalNodeEntity  = this.context.row.node;
            this.store.dispatch(new NavigateToParentFolder(node));
        }
    }

    ngOnInit() {
        if (this.context) {
            const node: MinimalNodeEntity  = this.context.row.node;
            if (node && node.entry && node.entry.path) {
                const path = node.entry.path;

                if (path && path.name && path.elements) {
                    this.displayText = this.getDisplayText(path);
                    this._path = path;
                }
            }
        }
    }

    // todo: review once 5.2.3 is out
    private getDisplayText(path: PathInfo): Observable<string> {
        const elements = path.elements.map(e => e.name);

        // for admin users
        if (elements.length === 1 && elements[0] === 'Company Home') {
            return of('Personal Files');
        }

        // for non-admin users
        if (elements.length === 3 && elements[0] === 'Company Home' && elements[1] === 'User Homes') {
            return of('Personal Files');
        }

        const result = elements[elements.length - 1];

        if (result === 'documentLibrary') {
            const fragment = path.elements[path.elements.length - 2];

            return new Observable<string>(observer => {
                this.contentApi.getNodeInfo(fragment.id).subscribe(
                    node => {
                        observer.next(node.properties['cm:title'] || node.name || fragment.name);
                        observer.complete();
                    },
                    () => {
                        observer.next(fragment.name);
                        observer.complete();
                    }
                );
            });
        }

        return of(result);
    }

    // todo: review once 5.2.3 is out
    private getTooltip(path: PathInfo) {
        let result: string = null;

        const elements = path.elements.map(e => Object.assign({}, e));

        if (elements[0].name === 'Company Home') {
            elements[0].name = 'Personal Files';

            if (elements.length > 2) {
                if (elements[1].name === 'Sites') {
                    const fragment = elements[2];
                        this.contentApi.getNodeInfo(fragment.id).subscribe(
                            node => {
                                elements.splice(0, 2);
                                elements[0].name = node.properties['cm:title'] || node.name || fragment.name;
                                elements.splice(1, 1);
                                elements.unshift({ id: null, name: 'File Libraries' });

                                result = elements.map(e => e.name).join('/');
                                this.nodeLocation$.next(result);
                            },
                            () => {
                                elements.splice(0, 2);
                                elements.unshift({ id: null, name: 'File Libraries' });
                                elements.splice(2, 1);

                                result = elements.map(e => e.name).join('/');
                                this.nodeLocation$.next(result);
                            }
                        );
                }

                if (elements[1].name === 'User Homes') {
                    elements.splice(0, 3);
                    elements.unshift({ id: null, name: 'Personal Files'});
                }
            }
        }

        result = elements.map(e => e.name).join('/');
        this.nodeLocation$.next(result);
    }
}
