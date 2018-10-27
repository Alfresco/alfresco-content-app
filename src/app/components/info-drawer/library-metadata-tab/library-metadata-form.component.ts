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

import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SiteEntry } from 'alfresco-js-api';
import { Store } from '@ngrx/store';
import { UpdateLibraryAction } from '../../../store/actions';
import { AppStore } from '../../../store/states/app.state';

@Component({
  selector: 'app-library-metadata-form',
  templateUrl: './library-metadata-form.component.html'
})
export class LibraryMetadataFormComponent implements OnInit, OnChanges {
  @Input()
  node: SiteEntry;

  edit: boolean;

  libraryType = [
    { value: 'PUBLIC', label: 'LIBRARY.VISIBILITY.PUBLIC' },
    { value: 'PRIVATE', label: 'LIBRARY.VISIBILITY.PRIVATE' },
    { value: 'MODERATED', label: 'LIBRARY.VISIBILITY.MODERATED' }
  ];

  form: FormGroup = new FormGroup({
    id: new FormControl({ value: '', disabled: true }),
    title: new FormControl({ value: '' }, [
      Validators.required,
      Validators.maxLength(256)
    ]),
    description: new FormControl({ value: '' }, [Validators.maxLength(512)]),
    visibility: new FormControl(this.libraryType[0].value)
  });

  constructor(protected store: Store<AppStore>) {}

  get canUpdateLibrary() {
    return (
      this.node && this.node.entry && this.node.entry.role === 'SiteManager'
    );
  }

  getVisibilityLabel(value) {
    return this.libraryType.find(type => type.value === value).label;
  }

  toggleEdit() {
    this.edit = !this.edit;
  }

  cancel() {
    this.updateForm(this.node);
    this.toggleEdit();
  }

  ngOnInit() {
    this.updateForm(this.node);
  }

  ngOnChanges() {
    this.updateForm(this.node);
  }

  update() {
    if (this.form.valid) {
      this.store.dispatch(new UpdateLibraryAction(this.form.value));
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
}
