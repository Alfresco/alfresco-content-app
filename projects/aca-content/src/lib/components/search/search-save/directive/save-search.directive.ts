/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SaveSearchDialogComponent } from '../dialog/save-search-dialog.component';

interface SaveSearchDirectiveDialogData {
  searchUrl: string;
}

@Directive({
  selector: '[acaSaveSearch]',
  standalone: true
})
export class SaveSearchDirective {
  /** Encoded search query */
  @Input()
  acaSaveSearchQuery: string;

  constructor(
    private readonly dialogRef: MatDialog,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    this.elementRef.nativeElement.focus();
    this.openDialog();
  }

  private openDialog(): void {
    this.dialogRef.open(SaveSearchDialogComponent, { ...this.getDialogConfig(), restoreFocus: true });
  }

  private getDialogConfig(): { data: SaveSearchDirectiveDialogData } {
    return {
      data: { searchUrl: this.acaSaveSearchQuery }
    };
  }
}
