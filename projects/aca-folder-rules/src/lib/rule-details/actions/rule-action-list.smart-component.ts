import { Component, forwardRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActionsService } from '../../services/actions.service';
import { ControlValueAccessor, FormArray, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RuleAction } from '../../model/rule-action.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'aca-rule-action-list',
  templateUrl: './rule-action-list.smart-component.html',
  styleUrls: ['./rule-action-list.smart-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-action-list' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RuleActionListSmartComponent)
    }
  ]
})
export class RuleActionListSmartComponent implements ControlValueAccessor, OnDestroy {
  formArray = new FormArray([]);
  private formArraySubscription: Subscription;

  get formControls(): FormControl[] {
    return this.formArray.controls as FormControl[];
  }

  onChange: (actions: RuleAction[]) => void = () => undefined;
  onTouch: () => void = () => undefined;

  constructor(public actionsService: ActionsService) {
    this.actionsService.loadActionDefinitions();
  }

  writeValue(actions: RuleAction[]) {
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
}
