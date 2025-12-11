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

import { FormControl } from '@angular/forms';
import { noLeadingTrailingOperatorsValidator } from './no-leading-trailing-operators.validator';

describe('noLeadingTrailingOperatorsValidator', () => {
  const validatorFn = noLeadingTrailingOperatorsValidator();

  it('should return null for valid input without operators', () => {
    const control = new FormControl('valid input');
    expect(validatorFn(control)).toBeNull();
  });

  it('should return null for empty input', () => {
    const control = new FormControl('');
    expect(validatorFn(control)).toBeNull();
  });

  it('should return null for valid input with operators', () => {
    const control = new FormControl('valid AND input OR phrase');
    expect(validatorFn(control)).toBeNull();
  });

  it('should return error for input with leading AND operator', () => {
    const control = new FormControl('AND input');
    expect(validatorFn(control)).toEqual({ operators: true });
  });

  it('should return error for input with leading OR operator', () => {
    const control = new FormControl('OR input');
    expect(validatorFn(control)).toEqual({ operators: true });
  });

  it('should return error for input with trailing AND operator', () => {
    const control = new FormControl('input AND');
    expect(validatorFn(control)).toEqual({ operators: true });
  });

  it('should return error for input with trailing OR operator', () => {
    const control = new FormControl('input OR');
    expect(validatorFn(control)).toEqual({ operators: true });
  });

  it('should return error for input with only operator', () => {
    const control = new FormControl('AND OR');
    expect(validatorFn(control)).toEqual({ operators: true });
  });
});
