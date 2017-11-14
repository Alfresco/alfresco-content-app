import { Component, Input, ChangeDetectionStrategy, OnInit, ViewEncapsulation } from '@angular/core';
import { DataColumn, DataRow, DataTableAdapter } from 'ng2-alfresco-datatable';
import { PathInfoEntity } from 'alfresco-js-api';

@Component({
    selector: 'app-location-link',
    template: `
        <a href="" [title]="tooltip" [routerLink]="link">
            {{ displayText }}
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
    displayText = '';

    @Input()
    tooltip = '';

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

    private getDisplayText(path: PathInfoEntity): string {
        let result = path.elements[path.elements.length - 1].name;

        if (result === 'documentLibrary') {
            result = path.elements[path.elements.length - 2].name;
        }

        result = result.replace('Company Home', 'Personal Files');

        return result;
    }

    // todo: review once 5.2.3 is out
    private getTooltip(path: PathInfoEntity): string {
        let result = path.name;

        result = result.replace('documentLibrary/', '');
        result = result.replace('/documentLibrary', '');
        result = result.replace('/Company Home/Sites', 'File Libraries');
        result = result.replace('/Company Home', 'Personal Files');

        return result;
    }
}
