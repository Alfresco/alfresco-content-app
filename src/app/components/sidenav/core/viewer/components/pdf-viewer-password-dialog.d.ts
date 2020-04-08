/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';
export declare class PdfPasswordDialogComponent implements OnInit {
  private dialogRef;
  data: any;
  passwordFormControl: FormControl;
  constructor(dialogRef: MatDialogRef<PdfPasswordDialogComponent>, data: any);
  ngOnInit(): void;
  isError(): boolean;
  isValid(): boolean;
  submit(): void;
}
