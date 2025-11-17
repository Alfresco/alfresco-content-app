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

import { Component, DestroyRef, ElementRef, inject, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { QueriesApi, SiteEntry, SitePaging } from '@alfresco/js-api';
import { Store } from '@ngrx/store';
import { AppStore, isAdmin, UpdateLibraryAction } from '@alfresco/aca-shared/store';
import { AppHookService } from '@alfresco/aca-shared';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { from, Observable } from 'rxjs';
import { ErrorStateMatcher, MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgForOf } from '@angular/common';

export class InstantErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form?.submitted;
    return !!(control?.invalid && (control?.dirty || control?.touched || isSubmitted));
  }
}

@Component({
  imports: [
    MatCardModule,
    TranslatePipe,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    NgForOf
  ],
  selector: 'app-library-metadata-form',
  templateUrl: './library-metadata-form.component.html',
  styleUrls: ['./library-metadata-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LibraryMetadataFormComponent implements OnInit, OnChanges {
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

  @ViewChild('libraryNameInput')
  private readonly libraryNameInput: ElementRef<HTMLInputElement>;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly alfrescoApiService: AlfrescoApiService,
    protected readonly store: Store<AppStore>,
    private readonly appHookService: AppHookService
  ) {}

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
      this.libraryNameInput.nativeElement.focus();
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
      .pipe(takeUntilDestroyed(this.destroyRef))
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
        takeUntilDestroyed(this.destroyRef)
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.isAdmin = value;
      });
    this.canUpdateLibrary = this.node?.entry?.role === 'SiteManager' || this.isAdmin;
    this.appHookService.libraryUpdated.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      Object.assign(this.node.entry, this.form.value);
    });
    this.appHookService.libraryUpdateFailed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.form.markAsDirty();
    });
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

  private validateEmptyName(control: FormControl<string>): ValidationErrors {
    return control.value.length && !control.value.trim() ? { empty: true } : null;
  }
}
