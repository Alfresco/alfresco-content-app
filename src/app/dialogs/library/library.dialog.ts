/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Observable } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SiteBody, SiteEntry } from 'alfresco-js-api';
import { ContentApiService } from '../../services/content-api.service';
import { SiteIdValidator, forbidSpecialCharacters } from './form.validators';
import { debounceTime } from 'rxjs/operators';


@Component({
    selector: 'app-library-dialog',
    styleUrls: ['./library.dialog.scss'],
    templateUrl: './library.dialog.html'
})
export class LibraryDialogComponent implements OnInit {
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    createTitle = 'LIBRARY.DIALOG.CREATE_TITLE';
    form: FormGroup;
    visibilityOption: any;
    visibilityOptions = [
        { value: 'PUBLIC', label: 'LIBRARY.VISIBILITY.PUBLIC', disabled: false },
        { value: 'PRIVATE', label: 'LIBRARY.VISIBILITY.PRIVATE', disabled: false },
        { value: 'MODERATED', label: 'LIBRARY.VISIBILITY.MODERATED', disabled: false }
    ];

    constructor(
        private formBuilder: FormBuilder,
        private dialog: MatDialogRef<LibraryDialogComponent>,
        private contentApi: ContentApiService
    ) {}

    ngOnInit() {
        const validators = {
            id: [ Validators.required, Validators.maxLength(72), forbidSpecialCharacters ],
            title: [ Validators.required, Validators.maxLength(256) ],
            description: [ Validators.maxLength(512) ]
        };

        this.form = this.formBuilder.group({
            title: ['', validators.title ],
            id: [ '', validators.id, SiteIdValidator.createValidator(this.contentApi) ],
            description: [ '', validators.description ],
        });

        this.visibilityOption = this.visibilityOptions[0].value;

        this.form.controls['title'].valueChanges
            .pipe(debounceTime(300))
            .subscribe((titleValue: string) => {
                if (!titleValue.trim().length) {
                    return;
                }

                if (!this.form.controls['id'].dirty) {
                    this.form.patchValue({ id: this.sanitize(titleValue.trim()) });
                    this.form.controls['id'].markAsTouched();
                }
            });
    }

    get title(): string {
        const { title } = this.form.value;

        return (title || '').trim();
    }

    get id(): string {
        const { id } = this.form.value;

        return (id || '').trim();
    }

    get description(): string {
        const { description } = this.form.value;

        return (description || '').trim();
    }

    get visibility(): string {
        return this.visibilityOption || '';
    }

    submit() {
        const { form, dialog } = this;

        if (!form.valid) { return; }

        this.create().subscribe(
                (node: SiteEntry) => {

                    this.success.emit(node);
                    dialog.close(node);
                },
                (error) => this.handleError(error)
            );
    }

    visibilityChangeHandler(event) {
        this.visibilityOption = event.value;
    }

    private create(): Observable<SiteEntry> {
        const { contentApi, title, id, description, visibility  } = this;
        const siteBody = <SiteBody>{
            id,
            title,
            description,
            visibility
        };

        return contentApi.createSite(siteBody);
    }

    private sanitize(input: string) {
        return input
            .replace(/[\s]/g, '-')
            .replace(/[^A-Za-z0-9-]/g, '');
    }

    private handleError(error: any): any {
        const { error: { statusCode } } = JSON.parse(error.message);

        if (statusCode === 409) {
            this.form.controls['id'].setErrors({ message: 'LIBRARY.ERRORS.CONFLICT' });
        }

        return error;
    }
}
