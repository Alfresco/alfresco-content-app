/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  ValidationErrors
} from '@angular/forms';
import { QueriesApi, SiteEntry, SitePaging } from '@alfresco/js-api';
import { Store } from '@ngrx/store';
import {
  AppStore,
  SnackbarAction,
  SnackbarActionTypes,
  SnackbarErrorAction,
  SnackbarInfoAction,
  UpdateLibraryAction,
  isAdmin
} from '@alfresco/aca-shared/store';
import { debounceTime, filter, mergeMap, takeUntil } from 'rxjs/operators';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Observable, from, Subject } from 'rxjs';
import { ErrorStateMatcher, MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { A11yModule } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { Actions, ofType } from '@ngrx/effects';

export class InstantErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form?.submitted;
    return !!(control?.invalid && (control?.dirty || control?.touched || isSubmitted));
  }
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    A11yModule,
    MatButtonModule
  ],
  selector: 'app-library-metadata-form',
  templateUrl: './library-metadata-form.component.html',
  styleUrls: ['./library-metadata-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LibraryMetadataFormComponent implements OnInit, OnChanges, OnDestroy {
  private _queriesApi: QueriesApi;
  private _titleErrorTranslationKey: string;

  get queriesApi(): QueriesApi {
    this._queriesApi = this._queriesApi ?? new QueriesApi(this.alfrescoApiService.getInstance());
    return this._queriesApi;
  }

  get titleErrorTranslationKey(): string {
    return this._titleErrorTranslationKey;
  }

  @Input()
  node: SiteEntry;

  libraryTitleExists = false;

  libraryType = [
    { value: 'PUBLIC', label: 'LIBRARY.VISIBILITY.PUBLIC' },
    { value: 'PRIVATE', label: 'LIBRARY.VISIBILITY.PRIVATE' },
    { value: 'MODERATED', label: 'LIBRARY.VISIBILITY.MODERATED' }
  ];

  form: UntypedFormGroup = new UntypedFormGroup({
    id: new UntypedFormControl({ value: '', disabled: true }),
    title: new UntypedFormControl({ value: '' }, [Validators.required, Validators.maxLength(256), this.validateEmptyName]),
    description: new UntypedFormControl({ value: '' }, [Validators.maxLength(512)]),
    visibility: new UntypedFormControl(this.libraryType[0].value)
  });

  matcher = new InstantErrorStateMatcher();
  canUpdateLibrary = false;
  isAdmin = false;

  onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private alfrescoApiService: AlfrescoApiService, protected store: Store<AppStore>, private actions$: Actions) {}

  toggleEdit() {
    if (this.form.enabled) {
      this.form.disable({
        emitEvent: false
      });
    } else {
      this.form.enable({
        emitEvent: false
      });
      this.form.controls.id.disable();
    }
  }

  cancel() {
    this.updateForm(this.node);
    this.toggleEdit();
    this.form.markAsPristine();
  }

  ngOnInit() {
    this.toggleEdit();
    this.updateForm(this.node);
    this.form.controls.title.statusChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        () =>
          (this._titleErrorTranslationKey = this.form.controls.title.errors?.empty
            ? 'LIBRARY.ERRORS.ONLY_SPACES'
            : 'LIBRARY.ERRORS.TITLE_TOO_LONG_OR_MISSING')
      );
    this.form.controls['title'].valueChanges
      .pipe(
        debounceTime(300),
        mergeMap((title) => this.findLibraryByTitle(title)),
        takeUntil(this.onDestroy$)
      )
      .subscribe((result) => {
        const { entries } = result.list;

        if (entries.length) {
          if (this.form.controls.title.value === this.node.entry.title) {
            this.libraryTitleExists = false;
          } else {
            this.libraryTitleExists = this.form.controls.title.value === entries[0].entry.title;
          }
        } else {
          this.libraryTitleExists = false;
        }
      });
    this.store
      .select(isAdmin)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.isAdmin = value;
      });
    this.canUpdateLibrary = this.node?.entry?.role === 'SiteManager' || this.isAdmin;
    this.handleUpdatingEvent<SnackbarInfoAction>(SnackbarActionTypes.Info, 'LIBRARY.SUCCESS.LIBRARY_UPDATED', () =>
      Object.assign(this.node.entry, this.form.value)
    );
    this.handleUpdatingEvent<SnackbarErrorAction>(SnackbarActionTypes.Error, 'LIBRARY.ERRORS.LIBRARY_UPDATE_ERROR', () => this.form.markAsDirty());
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnChanges() {
    this.updateForm(this.node);
    this.canUpdateLibrary = this.node?.entry?.role === 'SiteManager' || this.isAdmin;
  }

  update() {
    if (this.canUpdateLibrary && this.form.valid) {
      this.form.markAsPristine();
      this.store.dispatch(
        new UpdateLibraryAction({
          ...this.form.value,
          title: this.form.value.title.trim()
        })
      );
    }
  }

  private updateForm(node: SiteEntry) {
    const { entry } = node;

    this.form.setValue({
      id: entry.id,
      title: entry.title,
      description: entry.description || '',
      visibility: entry.visibility
    });
  }

  private findLibraryByTitle(libraryTitle: string): Observable<SitePaging | { list: { entries: any[] } }> {
    return from(
      this.queriesApi
        .findSites(libraryTitle.trim(), {
          maxItems: 1,
          fields: ['title']
        })
        .catch(() => ({ list: { entries: [] } }))
    );
  }

  private handleUpdatingEvent<T extends SnackbarAction>(actionType: SnackbarActionTypes, payload: string, handle: () => void): void {
    this.actions$
      .pipe(
        ofType<T>(actionType),
        filter((action) => action.payload === payload),
        takeUntil(this.onDestroy$)
      )
      .subscribe(handle);
  }

  private validateEmptyName(control: FormControl<string>): ValidationErrors {
    return control.value.length && !control.value.trim() ? { empty: true } : null;
  }
}
