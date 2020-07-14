/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { Component, OnDestroy, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface VersionFormEntry {
  comment: string;
  version: boolean;
}

@Component({
  selector: 'app-node-version-form',
  templateUrl: './node-version-form.component.html',
  styleUrls: ['./node-version-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-node-version-form__container' },
  exportAs: 'nodeVersionForm'
})
export class AppNodeVersionFormComponent implements OnInit, OnDestroy {
  @Output() update: EventEmitter<VersionFormEntry> = new EventEmitter();

  form: FormGroup;

  private onDestroy$: Subject<boolean> = new Subject<boolean>();
  private versionOptions = [
    { label: 'VERSION.FORM.VERSION.MINOR', value: false },
    { label: 'VERSION.FORM.VERSION.MAJOR', value: true }
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      comment: [''],
      version: [this.versionOptions[0].value]
    });

    this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((values: VersionFormEntry) => {
      this.update.emit(values);
    });
  }

  get versions() {
    return this.versionOptions;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
