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

import { Directive, HostListener, Input } from '@angular/core';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContextMenuService } from './context-menu.service';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { SetSelectedNodesAction } from '../../store/actions';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { DataRow } from '@alfresco/adf-core';
import { MinimalNodeEntity } from 'alfresco-js-api';

@Directive({
    selector: '[acaContextActions]'
})
export class ContextActionsDirective {
    private overlayRef: ContextMenuOverlayRef = null;

    // tslint:disable-next-line:no-input-rename
    @Input('acaContextEnable') enabled = true;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event && this.overlayRef) {
            this.clearSelection();
            this.overlayRef.close();
        }
    }

    @HostListener('contextmenu', ['$event'])
    onContextMenuEvent(event: MouseEvent) {
        if (event) {
            event.preventDefault();

            if (this.enabled) {
                this.execute(event);
            }
        }
    }

    constructor(
        private documentList: DocumentListComponent,
        private store: Store<AppStore>,
        private contextMenuService: ContextMenuService
    ) { }

    private execute(event: MouseEvent) {
        const selected = this.getSelectedRow(event);

        if (selected) {
            if (!this.isInSelection(selected)) {
                this.clearSelection();

                this.documentList.dataTable.selectRow(selected, true);
                this.documentList.selection.push((<any>selected).node);

                this.updateSelection();
            }

            this.render(event);
        }
    }

    private render(event: MouseEvent) {
        if (this.overlayRef) {
            this.overlayRef.close();
        }

        this.overlayRef = this.contextMenuService.open({
            source: event,
            hasBackdrop: false,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            panelClass: 'cdk-overlay-pane',
        });
    }

    private updateSelection() {
        this.store.dispatch(
            new SetSelectedNodesAction(this.documentList.selection)
        );
    }

    private isInSelection(row: DataRow): MinimalNodeEntity {
        return this.documentList.selection.find((selected) =>
            row.getValue('name') === selected.entry.name);
    }

    private getSelectedRow(event): DataRow {
        const rowElement = this.findAncestor(<HTMLElement>event.target, 'adf-datatable-row');

        if (!rowElement) {
            return null;
        }

        const rowName = rowElement.querySelector('.adf-data-table-cell--text .adf-datatable-cell')
            .textContent
            .trim();

        return this.documentList.data.getRows()
            .find((row: DataRow) => row.getValue('name') === rowName);
    }

    private clearSelection() {
        this.documentList.data.getRows().map((row: DataRow) => {
            return this.documentList.dataTable.selectRow(row, false);
        });

        this.documentList.selection = [];
    }

    private findAncestor (el: Element, className: string): Element {
        // tslint:disable-next-line:curly
        while ((el = el.parentElement) && !el.classList.contains(className));
        return el;
    }
}
