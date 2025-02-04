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

import { Component, EventEmitter, Input, Output, ViewEncapsulation, ViewChild, ElementRef, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  selector: 'app-search-input-control',
  templateUrl: './search-input-control.component.html',
  styleUrls: ['./search-input-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-search-control' }
})
export class SearchInputControlComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  /** Type of the input field to render, e.g. "search" or "text" (default). */
  @Input()
  inputType = 'text';

  /** Emitted when the search is submitted pressing ENTER button.
   * The search term is provided as value of the event.
   */
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  submit: EventEmitter<any> = new EventEmitter();

  /** Emitted when the search term is changed. The search term is provided
   * in the 'value' property of the returned object.  If the term is less
   * than three characters in length then the term is truncated to an empty
   * string.
   */
  @Output()
  searchChange: EventEmitter<string> = new EventEmitter();

  @ViewChild('searchInput', { static: true })
  searchInput: ElementRef;

  searchFieldFormControl = new FormControl('');

  get searchTerm(): string {
    return this.searchFieldFormControl.value.replace('text:', 'TEXT:');
  }

  set searchTerm(value: string) {
    this.searchFieldFormControl.setValue(value);
  }

  ngOnInit() {
    this.searchFieldFormControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((searchTermValue) => {
      this.searchFieldFormControl.markAsTouched();
      this.searchChange.emit(searchTermValue);
    });
  }

  searchSubmit() {
    if (!this.searchFieldFormControl.errors) {
      this.submit.emit(this.searchTerm);
    }
  }

  clear() {
    this.searchTerm = '';
    this.searchChange.emit('');
  }

  isTermTooShort() {
    return !!(this.searchTerm && this.searchTerm.length < 2);
  }
}
