import { Component, Input, ChangeDetectionStrategy, OnInit, ViewEncapsulation } from '@angular/core';
import { DataColumn, DataRow, DataTableAdapter } from 'ng2-alfresco-datatable';
import { AlfrescoApiService } from 'ng2-alfresco-core';
import { PathInfoEntity, AlfrescoApi } from 'alfresco-js-api';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'app-location-link',
    template: `
        <a href="" [title]="tooltip | async" [routerLink]="link">
            {{ displayText | async }}
        </a>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        'class': 'app-location-link'
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

    constructor(private apiService: AlfrescoApiService) {
    }

    ngOnInit() {
        if (this.context) {
            const data: DataTableAdapter = this.context.data;
            const col: DataColumn = this.context.col;
            const row: DataRow = this.context.row;
            const value: PathInfoEntity = data.getValue(row, col);

            if (value.name && value.elements) {
                const isLibraryPath = this.isLibraryContent(value);

                this.displayText = this.getDisplayText(value);
                this.tooltip = this.getTooltip(value);

                const parent = value.elements[value.elements.length - 1];
                const area = isLibraryPath ? '/libraries' : '/personal-files';

                this.link = [ area, parent.id ];
            }
        }
    }

    private isLibraryContent(path: PathInfoEntity): boolean {
        if (path && path.elements.length >= 2 && path.elements[1].name === 'Sites') {
            return true;
        }
        return false;
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
            if (elements.length === 1) {
                elements[0].name = 'Personal Files';
            } else if (elements[1].name === 'Sites') {
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
            } else if (elements[1].name === 'User Homes') {
                elements.splice(0, 3);
                elements.unshift({ id: null, name: 'Personal Files'});
            }
        }

        const result = elements.map(e => e.name).join('/');
        return Observable.of(result);
    }
}
