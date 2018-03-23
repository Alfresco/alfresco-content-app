import { Directive, HostListener, Input } from '@angular/core';

import { MinimalNodeEntity } from 'alfresco-js-api';

import { MatDialog } from '@angular/material';
import { VersionManagerDialogComponent } from '../../components/versions/version-manager-dialog.component';

@Directive({
    selector: '[app-version-node]'
})
export class NodeVersionDirective {

    @Input('app-version-node')
    selection: MinimalNodeEntity[];

    @HostListener('click')
    onClick() {
        this.dialog.open(VersionManagerDialogComponent, {
            data: this.selection[0],
            panelClass: 'adf-version-manager-dialog',
            width: '630px'
        });
    }

    constructor(
        private dialog: MatDialog
    ) {}

}
