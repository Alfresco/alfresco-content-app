/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { Node } from '@alfresco/js-api';
import { ContentNodeSelectorPanelComponent, ValidationFunction } from '@alfresco/adf-content-services';

interface CreateAssociationForm {
  associationType: FormControl<string>;
}

export interface CreateAssociationDialogData {
  node?: Node;
}

export interface CreateAssociationDialogResult {
  associationType: string;
  target: Node;
}

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TranslatePipe,
    ContentNodeSelectorPanelComponent
  ],
  selector: 'app-create-association-dialog',
  templateUrl: './create-association-dialog.component.html',
  styleUrls: ['./create-association-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-create-association-dialog' }
})
export class CreateAssociationDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<CreateAssociationDialogComponent, CreateAssociationDialogResult>>(MatDialogRef);

  readonly form = new FormGroup<CreateAssociationForm>({
    associationType: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  currentFolderId = '-my-';
  selectedTarget: Node | null = null;

  validateSelection: ValidationFunction = (node: Node): boolean => !!node?.isFile && this.isJsonFile(node);

  private isJsonFile(node: Node): boolean {
    return node.content?.mimeType === 'application/json' || !!node.name?.toLowerCase().endsWith('.json');
  }

  onNodeSelect(nodes: Node[]): void {
    this.selectedTarget = nodes?.length ? nodes[0] : null;
  }

  submit(): void {
    if (this.form.invalid || !this.selectedTarget) {
      return;
    }

    this.dialogRef.close({
      associationType: this.form.controls.associationType.value,
      target: this.selectedTarget
    });
  }
}
