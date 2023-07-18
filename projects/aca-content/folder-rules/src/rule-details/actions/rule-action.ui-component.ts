/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, forwardRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionDefinitionTransformed, RuleAction } from '../../model/rule-action.model';
import { CardViewItem } from '@alfresco/adf-core/lib/card-view/interfaces/card-view-item.interface';
import {
  CardViewBoolItemModel,
  CardViewModule,
  CardViewSelectItemModel,
  CardViewSelectItemOption,
  CardViewTextItemModel,
  CardViewUpdateService,
  UpdateNotification
} from '@alfresco/adf-core';
import { ActionParameterDefinition, Node } from '@alfresco/js-api';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActionParameterConstraint, ConstraintValue } from '../../model/action-parameter-constraint.model';
import { ContentNodeSelectorComponent, ContentNodeSelectorComponentData, NodeAction } from '@alfresco/adf-content-services';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, CardViewModule],
  selector: 'aca-rule-action',
  templateUrl: './rule-action.ui-component.html',
  styleUrls: ['./rule-action.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-action' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RuleActionUiComponent)
    },
    CardViewUpdateService
  ]
})
export class RuleActionUiComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input()
  nodeId = '';

  @Input()
  actionDefinitions: ActionDefinitionTransformed[];

  @Input()
  readOnly = false;

  private _parameterConstraints = [];
  @Input()
  get parameterConstraints(): ActionParameterConstraint[] {
    return this._parameterConstraints;
  }
  set parameterConstraints(value) {
    this._parameterConstraints = value.map((obj) => ({ ...obj, constraints: this.parseConstraintsToSelectOptions(obj.constraints) }));
  }

  isFullWidth = false;

  form = new FormGroup({
    actionDefinitionId: new FormControl('', Validators.required)
  });

  cardViewItems: CardViewItem[] = [];
  parameters: { [key: string]: unknown } = {};
  private onDestroy$ = new Subject<boolean>();

  get selectedActionDefinitionId(): string {
    return this.form.get('actionDefinitionId').value;
  }

  get selectedActionDefinition(): ActionDefinitionTransformed {
    return this.actionDefinitions.find((actionDefinition: ActionDefinitionTransformed) => actionDefinition.id === this.selectedActionDefinitionId);
  }

  get cardViewStyle() {
    return this.isFullWidth ? { width: '100%' } : {};
  }

  onChange: (action: RuleAction) => void = () => undefined;
  onTouch: () => void = () => undefined;

  constructor(private cardViewUpdateService: CardViewUpdateService, private dialog: MatDialog, private translate: TranslateService) {}

  writeValue(action: RuleAction) {
    this.form.setValue({
      actionDefinitionId: action.actionDefinitionId
    });
    this.parameters = {
      ...this.parameters,
      ...action.params
    };
    this.setCardViewProperties();
  }

  registerOnChange(fn: (action: RuleAction) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  ngOnInit() {
    this.actionDefinitions = this.actionDefinitions.sort((firstActionDefinition, secondActionDefinition) =>
      firstActionDefinition.title.localeCompare(secondActionDefinition.title)
    );

    this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.setDefaultParameters();
      this.setCardViewProperties();
      this.onChange({
        actionDefinitionId: this.selectedActionDefinitionId,
        params: this.parameters
      });
      this.onTouch();
    });

    this.cardViewUpdateService.itemUpdated$.pipe(takeUntil(this.onDestroy$)).subscribe((updateNotification: UpdateNotification) => {
      this.parameters = {
        ...this.parameters,
        ...updateNotification.changed
      };
      this.onChange({
        actionDefinitionId: this.selectedActionDefinitionId,
        params: this.parameters
      });
      this.onTouch();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const readOnly = changes['readOnly']?.currentValue;
    if (readOnly !== undefined && readOnly !== null) {
      this.readOnly = readOnly;
      this.setDisabledState(readOnly);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  setCardViewProperties() {
    this.cardViewItems = (this.selectedActionDefinition?.parameterDefinitions ?? []).map((paramDef) => {
      this.isFullWidth = false;
      const constraintsForDropdownBox = this._parameterConstraints.find((obj) => obj.name === paramDef.name);
      const cardViewPropertiesModel = {
        label: paramDef.displayLabel + (paramDef.mandatory ? ' *' : ''),
        key: paramDef.name,
        editable: true,
        ...(paramDef.mandatory
          ? {
              validators: [
                {
                  message: 'ACA_FOLDER_RULES.RULE_DETAILS.ERROR.REQUIRED',
                  isValid: (value: unknown) => !!value
                }
              ]
            }
          : {})
      };
      switch (paramDef.type) {
        case 'd:boolean':
          return new CardViewBoolItemModel({
            ...cardViewPropertiesModel,
            value: this.parameters[paramDef.name] ?? false
          });
        case 'd:noderef':
          if (!constraintsForDropdownBox && !this.readOnly && paramDef.name !== 'category-value') {
            return new CardViewTextItemModel({
              ...cardViewPropertiesModel,
              icon: 'folder',
              default: '',
              clickable: true,
              clickCallBack: this.openSelectorDialog.bind(this, paramDef.name),
              value: this.parameters[paramDef.name]
            });
          }
        //  falls through
        default:
          if (constraintsForDropdownBox && !this.readOnly) {
            this.isFullWidth = true;
            return new CardViewSelectItemModel({
              ...cardViewPropertiesModel,
              value: (this.parameters[paramDef.name] as string) ?? '',
              options$: of(constraintsForDropdownBox.constraints)
            });
          }
          return new CardViewTextItemModel({
            ...cardViewPropertiesModel,
            value: this.parameters[paramDef.name] ?? ''
          });
      }
    });
  }

  private openSelectorDialog(paramDefName) {
    const data: ContentNodeSelectorComponentData = {
      title: this.translate.instant('ACA_FOLDER_RULES.RULE_DETAILS.PLACEHOLDER.CHOOSE_FOLDER'),
      actionName: NodeAction.CHOOSE,
      currentFolderId: this.nodeId,
      select: new Subject<Node[]>()
    };

    this.dialog.open(ContentNodeSelectorComponent, {
      data,
      panelClass: 'adf-content-node-selector-dialog',
      width: '630px'
    });

    data.select.subscribe(
      (selections: Node[]) => {
        if (selections[0].id) {
          this.writeValue({
            actionDefinitionId: this.selectedActionDefinitionId,
            params: {
              ...this.parameters,
              [paramDefName]: selections[0].id
            }
          });
          this.onChange({
            actionDefinitionId: this.selectedActionDefinitionId,
            params: this.parameters
          });
          this.onTouch();
        }
      },
      (error) => {
        console.error(error);
      },
      () => {
        this.dialog.closeAll();
      }
    );
  }

  setDefaultParameters() {
    this.parameters = {};
    (this.selectedActionDefinition?.parameterDefinitions ?? []).forEach((paramDef: ActionParameterDefinition) => {
      switch (paramDef.type) {
        case 'd:boolean':
          this.parameters[paramDef.name] = false;
          break;
        default:
          this.parameters[paramDef.name] = '';
      }
    });
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.readOnly = true;
      this.form.disable();
    } else {
      this.readOnly = false;
      this.form.enable();
    }
  }

  private parseConstraintsToSelectOptions(constraints: ConstraintValue[]): CardViewSelectItemOption<unknown>[] {
    return constraints
      .sort((a, b) => {
        if (!a.label && b.label) {
          return 1;
        }
        if (!b.label && a.label) {
          return -1;
        }
        return a.label?.localeCompare(b.label) ?? -1;
      })
      .map((constraint) => ({
        key: constraint.value,
        label: constraint.label ? `${constraint.label} [${constraint.value}]` : constraint.value
      }));
  }
}
