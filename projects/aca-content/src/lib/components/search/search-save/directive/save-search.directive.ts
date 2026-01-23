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

import { DestroyRef, Directive, ElementRef, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SaveSearchDialogComponent } from '../dialog/save-search-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SaveSearchDirectiveDialogData } from '../dialog/save-search-directive-dialog-data';

@Directive({
  selector: '[acaSaveSearch]',
  standalone: true
})
export class SaveSearchDirective {
  /** Encoded search query */
  @Input()
  acaSaveSearchQuery: string;

  /** Outputs a true value when search was successfully saved */
  @Output()
  searchSaved = new EventEmitter<boolean>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialog);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  constructor(private readonly overlayContainer: OverlayContainer) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    this.elementRef.nativeElement.focus();
    this.openDialog();
  }

  private openDialog(): void {
    this.overlayContainer.getContainerElement().setAttribute('role', 'dialog');
    const dialog = this.dialogRef.open(SaveSearchDialogComponent, {
      ...this.getDialogConfig(),
      restoreFocus: true,
      ariaLabelledBy: 'aca-save-search-dialog-title'
    });
    dialog
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: boolean) => {
        if (value) {
          this.searchSaved.emit(value);
        }
      });
  }

  private getDialogConfig(): { data: SaveSearchDirectiveDialogData } {
    return {
      data: { searchUrl: this.acaSaveSearchQuery }
    };
  }
}
