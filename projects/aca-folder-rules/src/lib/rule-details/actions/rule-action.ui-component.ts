import { Component, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup } from '@angular/forms';
import { ActionDefinitionTransformed, RuleAction } from '../../model/rule-action.model';

@Component({
  selector: 'aca-rule-action',
  templateUrl: './rule-action.ui-component.html',
  styleUrls: ['./rule-action.ui-component.scss']
})
export class RuleActionUiComponent implements ControlValueAccessor {
  @Input()
  actionDefinitions: ActionDefinitionTransformed[];

  form = new FormGroup({
    actionDefinitionId: new FormControl('copy')
  });

  onChange: (action: RuleAction) => void = () => undefined;
  onTouch: () => void = () => undefined;

  writeValue(action: RuleAction) {
    this.form.setValue(action);
  }

  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
}
