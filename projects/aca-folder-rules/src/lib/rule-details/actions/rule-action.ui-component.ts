import { Component, forwardRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ActionDefinitionTransformed, RuleAction } from '../../model/rule-action.model';
import { CardViewItem } from '@alfresco/adf-core/lib/card-view/interfaces/card-view-item.interface';
import { CardViewBoolItemModel, CardViewTextItemModel, CardViewUpdateService, UpdateNotification } from '@alfresco/adf-core';
import { ActionParameterDefinition } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
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
export class RuleActionUiComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private _actionDefinitions: ActionDefinitionTransformed[];
  @Input()
  get actionDefinitions(): ActionDefinitionTransformed[] {
    return this._actionDefinitions;
  }
  set actionDefinitions(value: ActionDefinitionTransformed[]) {
    this._actionDefinitions = value.sort((a, b) => a.title.localeCompare(b.title));
  }

  private _readOnly = false;
  @Input()
  get readOnly(): boolean {
    return this._readOnly;
  }
  set readOnly(isReadOnly: boolean) {
    this.setDisabledState(isReadOnly);
  }

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

  onChange: (action: RuleAction) => void = () => undefined;
  onTouch: () => void = () => undefined;

  constructor(private cardViewUpdateService: CardViewUpdateService) {}

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
    this.form.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.setDefaultParameters();
        this.setCardViewProperties();
        this.onChange({
          actionDefinitionId: this.selectedActionDefinitionId,
          params: this.parameters
        });
        this.onTouch();
      });

    this.cardViewUpdateService.itemUpdated$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((updateNotification: UpdateNotification) => {
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

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  setCardViewProperties() {
    this.cardViewItems = (this.selectedActionDefinition?.parameterDefinitions ?? []).map((paramDef) => {
      const cardViewPropertiesModel = {
        label: paramDef.displayLabel + (paramDef.mandatory ? ' *' : ''),
        key: paramDef.name,
        editable: true,
        ...(paramDef.mandatory ? {
          validators: [{
            message: 'ACA_FOLDER_RULES.RULE_DETAILS.ERROR.REQUIRED',
            isValid: (value: unknown) => !!value
          }]
        } : {})
      };
      switch (paramDef.type) {
        case 'd:boolean':
          return new CardViewBoolItemModel({
            ...cardViewPropertiesModel,
            value: this.parameters[paramDef.name] ?? false
          });
        default:
          return new CardViewTextItemModel({
            ...cardViewPropertiesModel,
            value: this.parameters[paramDef.name] ?? ''
          });
      }
    });
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
      this._readOnly = true;
      this.form.disable();
    } else {
      this._readOnly = false;
      this.form.enable();
    }
  }
}
