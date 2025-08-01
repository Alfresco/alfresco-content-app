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
import { noWhitespaceValidator } from './no-whitespace.validator';

describe('noWhitespaceValidator', () => {
  const validatorFn = noWhitespaceValidator();

  it('should return null for valid non-whitespace input', () => {
    const control = new FormControl('valid input');
    expect(validatorFn(control)).toBeNull();
  });

  it('should return error for input with only spaces', () => {
    const control = new FormControl('    ');
    expect(validatorFn(control)).toEqual({ whitespace: true });
  });

  it('should return error for empty string', () => {
    const control = new FormControl('');
    expect(validatorFn(control)).toBeNull();
  });

  it('should return null for input with leading and trailing spaces but valid content inside', () => {
    const control = new FormControl('   valid   ');
    expect(validatorFn(control)).toBeNull();
  });
});
