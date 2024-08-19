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

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { IconComponent } from '@alfresco/adf-core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector: 'aca-my-fa-component',
  templateUrl: './my-fa-component.component.html',
  styleUrls: ['./my-fa-component.component.css'],
  imports: [ReactiveFormsModule, IconComponent, MatIconModule]
})
export class MyFaComponentComponent implements OnInit {
  constructor() {}
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  searchControl = new FormControl('');
  @Output() inputField = new EventEmitter<string>();

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(
      (results) => {
        this.inputField.emit(results);
        console.error('data', results);
      },
      (error) => {
        console.error('error', error);
      }
    );
  }

  focusInput(): void {
    this.inputElement.nativeElement.focus();
  }
}
