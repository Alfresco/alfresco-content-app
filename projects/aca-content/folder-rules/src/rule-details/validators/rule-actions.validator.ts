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

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  ActionDefinitionTransformed,
  ActionParameterDefinitionTransformed,
  isRuleAction,
  isRuleActions,
  RuleAction
} from '../../model/rule-action.model';

const isRuleActionValid = (value: unknown, actionDefinitions: ActionDefinitionTransformed[]): boolean => {
  const actionDefinition = isRuleAction(value)
    ? actionDefinitions.find((actionDef: ActionDefinitionTransformed) => value.actionDefinitionId === actionDef.id)
    : undefined;
  return (
    isRuleAction(value) &&
    actionDefinition &&
    actionDefinition.parameterDefinitions.reduce(
      (isValid: boolean, paramDef: ActionParameterDefinitionTransformed) => isValid && (!paramDef.mandatory || !!value.params[paramDef.name]),
      true
    )
  );
};

const isRuleActionsValid = (value: unknown, actionDefinitions: ActionDefinitionTransformed[]): boolean =>
  isRuleActions(value) &&
  value.reduce((isValid: boolean, currentAction: RuleAction) => isValid && isRuleActionValid(currentAction, actionDefinitions), true);

export const ruleActionValidator =
  (actionDefinitions: ActionDefinitionTransformed[]): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    isRuleActionValid(control.value, actionDefinitions) ? null : { ruleActionInvalid: true };

export const ruleActionsValidator =
  (actionDefinitions: ActionDefinitionTransformed[]): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    isRuleActionsValid(control.value, actionDefinitions) ? null : { ruleActionsInvalid: true };
