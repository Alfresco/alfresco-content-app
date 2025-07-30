/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ruleCompositeConditionValidator } from './rule-composite-condition.validator';
import { RuleCompositeCondition } from '../../model/rule-composite-condition.model';

describe('ruleCompositeConditionValidator', () => {
  let validatorFn: ValidatorFn;

  beforeEach(() => {
    validatorFn = ruleCompositeConditionValidator();
  });

  it('should return null for root condition with empty compositeConditions and empty simpleConditions', () => {
    const mockCondition = {
      compositeConditions: [],
      simpleConditions: []
    } as RuleCompositeCondition;

    const control = new FormControl(mockCondition);
    expect(validatorFn(control)).toBeNull();
  });

  it('should return validation error for nested condition with empty simpleConditions and no nested compositeConditions', () => {
    const mockCondition = {
      compositeConditions: [
        {
          compositeConditions: [],
          simpleConditions: []
        }
      ],
      simpleConditions: []
    } as RuleCompositeCondition;

    const control = new FormControl(mockCondition);
    expect(validatorFn(control)).toEqual({ ruleCompositeConditionInvalid: true });
  });

  it('should return validation error for deeply nested invalid composite conditions', () => {
    const mockCondition = {
      compositeConditions: [
        {
          compositeConditions: [
            {
              compositeConditions: [],
              simpleConditions: []
            }
          ],
          simpleConditions: []
        }
      ],
      simpleConditions: []
    } as RuleCompositeCondition;

    const control = new FormControl(mockCondition);
    expect(validatorFn(control)).toEqual({ ruleCompositeConditionInvalid: true });
  });
});
