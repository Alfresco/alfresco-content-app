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

import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  OnInit,
  inject,
  DestroyRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, StatusChangeEvent, TouchedChangeEvent, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { noWhitespaceValidator, noLeadingTrailingOperatorsValidator } from '@alfresco/aca-shared';
import { combineLatest } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

@Component({
  imports: [CommonModule, TranslatePipe, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  selector: 'app-search-input-control',
  templateUrl: './search-input-control.component.html',
  styleUrls: ['./search-input-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-search-control' }
})
export class SearchInputControlComponent implements OnInit, OnChanges {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** Type of the input field to render, e.g. "search" or "text" (default). */
  @Input()
  inputType = 'text';

  /**
   * Indicates whether the search is constrained by libraries.
   * If true, specific error messaging or validation behavior may be triggered.
   */
  @Input()
  hasLibrariesConstraint = false;

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

  /** Emitted when the input control has a validation error. */
  @Output()
  validationError = new EventEmitter<string>();

  @ViewChild('searchInput', { static: true })
  searchInput: ElementRef;

  searchFieldFormControl = new FormControl('', [Validators.required, noWhitespaceValidator(), noLeadingTrailingOperatorsValidator()]);

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

    this.searchFieldFormControl.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof TouchedChangeEvent || event instanceof StatusChangeEvent) {
        if (this.searchFieldFormControl.touched) {
          this.emitValidationError();
        } else {
          this.validationError.emit('');
        }
      }
    });
    combineLatest([
      this.route.queryParams,
      this.router.events.pipe(
        filter((e): e is NavigationStart => e instanceof NavigationStart),
        startWith(null)
      )
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params]) => {
        if (params['q'] && !this.searchFieldFormControl.value) {
          setTimeout(() => this.searchFieldFormControl.setValue('*'));
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hasLibrariesConstraint'] && !changes['hasLibrariesConstraint'].firstChange) {
      this.emitValidationError();
    }
  }

  searchSubmit() {
    this.searchFieldFormControl.markAsTouched();

    const trimmedTerm = this.searchTerm?.trim();
    if (this.searchFieldFormControl.valid && trimmedTerm) {
      this.submit.emit(trimmedTerm);
    }
  }

  clear() {
    this.searchTerm = '';
    this.searchChange.emit('');
  }

  onBlur() {
    this.searchFieldFormControl.markAsUntouched();
  }

  isTermTooShort() {
    return this.searchTerm.trim()?.length < 2;
  }

  emitValidationError(): void {
    const errors = this.searchFieldFormControl.errors;
    if (errors?.whitespace) {
      this.validationError.emit('SEARCH.INPUT.WHITESPACE');
    } else if (errors?.operators) {
      this.validationError.emit('SEARCH.INPUT.OPERATORS');
    } else if (errors?.required) {
      this.validationError.emit('SEARCH.INPUT.REQUIRED');
    } else if (this.hasLibrariesConstraint && this.isTermTooShort()) {
      this.validationError.emit('SEARCH.INPUT.MIN_LENGTH');
    } else {
      this.validationError.emit('');
    }
  }
}
