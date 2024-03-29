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

import { FormControl, ValidatorFn } from '@angular/forms';
import { ruleActionsValidator, ruleActionValidator } from './rule-actions.validator';
import {
  actionsTransformedListMock,
  incompleteMandatoryParameterMock,
  missingMandatoryParameterMock,
  nonExistentActionDefinitionIdMock,
  validActionMock,
  validActionsMock
} from '../../mock/actions.mock';

describe('ruleActionsValidator', () => {
  let validatorFn: ValidatorFn;

  beforeEach(() => {
    validatorFn = ruleActionValidator(actionsTransformedListMock);
  });

  it('should return null for a valid action', () => {
    const control = new FormControl(validActionMock);
    expect(validatorFn(control)).toBeNull();
  });

  it('should return a validation error for an non-existent action definition ID', () => {
    const control = new FormControl(nonExistentActionDefinitionIdMock);
    expect(validatorFn(control)).toEqual({ ruleActionInvalid: true });
  });

  it('should return a validation error for an missing mandatory parameter', () => {
    const control = new FormControl(missingMandatoryParameterMock);
    expect(validatorFn(control)).toEqual({ ruleActionInvalid: true });
  });

  it('should return a validation error for an incomplete mandatory parameter', () => {
    const control = new FormControl(incompleteMandatoryParameterMock);
    expect(validatorFn(control)).toEqual({ ruleActionInvalid: true });
  });

  it('should return null for valid actions', () => {
    const multipleActionsValidatorFn = ruleActionsValidator(actionsTransformedListMock);
    const control = new FormControl(validActionsMock);
    expect(multipleActionsValidatorFn(control)).toBeNull();
  });
});
