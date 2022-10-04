import { Component, forwardRef, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActionDefinitionTransformed, RuleAction } from '../../model/rule-action.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'aca-rule-action-list',
  templateUrl: './rule-action-list.ui-component.html',
  styleUrls: ['./rule-action-list.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-action-list' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RuleActionListUiComponent)
    }
  ]
})
export class RuleActionListUiComponent implements ControlValueAccessor, OnDestroy {
  @Input()
  actionDefinitions: ActionDefinitionTransformed[] = [];
  @Input()
  readOnly = false;

  formArray = new FormArray([]);
  private formArraySubscription: Subscription;

  get formControls(): FormControl[] {
    return this.formArray.controls as FormControl[];
  }

  onChange: (actions: RuleAction[]) => void = () => undefined;
  onTouch: () => void = () => undefined;

  writeValue(actions: RuleAction[]) {
    if (actions.length === 0) {
      actions = [
        {
          actionDefinitionId: null,
          params: {}
        }
      ];
    }
    this.formArray = new FormArray(actions.map((action: RuleAction) => new FormControl(action)));
    this.formArraySubscription?.unsubscribe();
    this.formArraySubscription = this.formArray.valueChanges.subscribe((value: any) => {
      this.onChange(value);
      this.onTouch();
    });
  }

  registerOnChange(fn: (actions: RuleAction[]) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }

  addAction() {
    const newAction: RuleAction = {
      actionDefinitionId: null,
      params: {}
    };
    this.formArray.push(new FormControl(newAction));
  }

  ngOnDestroy() {
    this.formArraySubscription?.unsubscribe();
  }

  removeAction(control: FormControl) {
    const index = this.formArray.value.indexOf(control.value);
    this.formArray.removeAt(index);
  }
}
