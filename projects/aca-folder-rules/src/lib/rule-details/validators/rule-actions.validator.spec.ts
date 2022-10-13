import { FormControl, ValidatorFn } from '@angular/forms';
import { ruleActionsValidator, ruleActionValidator } from './rule-actions.validator';
import { actionsTransformedListMock, incompleteMandatoryParameterMock, missingMandatoryParameterMock, nonExistentActionDefinitionIdMock, validActionMock, validActionsMock } from '../../mock/actions.mock';

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
