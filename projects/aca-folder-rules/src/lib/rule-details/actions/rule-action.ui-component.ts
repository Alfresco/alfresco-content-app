import { Component, forwardRef, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActionDefinitionTransformed, RuleAction } from '../../model/rule-action.model';
import { CardViewItem } from '@alfresco/adf-core/lib/card-view/interfaces/card-view-item.interface';
import { CardViewBoolItemModel, CardViewTextItemModel } from '@alfresco/adf-core';

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
    }
  ]
})
export class RuleActionUiComponent implements ControlValueAccessor, OnDestroy {
  _actionDefinitions: ActionDefinitionTransformed[];
  @Input()
  get actionDefinitions(): ActionDefinitionTransformed[] {
    return this._actionDefinitions;
  };
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
    actionDefinitionId: new FormControl('copy')
  });

  cardViewItems: CardViewItem[] = [];

  get selectedActionDefinitionId(): string {
    return this.form.get('actionDefinitionId').value;
  }

  get selectedActionDefinition(): ActionDefinitionTransformed {
    return this.actionDefinitions.find((actionDefinition: ActionDefinitionTransformed) => actionDefinition.id === this.selectedActionDefinitionId);
  }

  private formSubscription = this.form.valueChanges.subscribe((value: any) => {
    this.setCardViewProperties({});
    this.onChange(value);
    this.onTouch();
  });

  onChange: (action: RuleAction) => void = () => undefined;
  onTouch: () => void = () => undefined;

  writeValue(action: RuleAction) {
    this.form.setValue({
      actionDefinitionId: action.actionDefinitionId
    });
    this.setCardViewProperties(action.params);
  }

  registerOnChange(fn: (action: RuleAction) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  setCardViewProperties(defaultValues: unknown) {
    this.cardViewItems = (this.selectedActionDefinition?.parameterDefinitions ?? []).map((parameterDef) => {
      const cardViewPropertiesModel = {
        label: parameterDef.displayLabel,
        key: parameterDef.name,
        editable: true
      }
      switch (parameterDef.type) {
        case 'd:boolean':
          return new CardViewBoolItemModel({
            ...cardViewPropertiesModel,
            value: defaultValues[parameterDef.name] ?? false
          });
        default:
          return new CardViewTextItemModel({
            ...cardViewPropertiesModel,
            value: defaultValues[parameterDef.name] ?? ''
          });
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
