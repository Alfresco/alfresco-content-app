/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AbstractControl, FormControl } from '@angular/forms';
import { ContentApiService } from '../../services/content-api.service';

export class SiteIdValidator {
  static createValidator(contentApiService: ContentApiService) {
    let timer;

    return (control: AbstractControl) => {
      if (timer) {
        clearTimeout(timer);
      }

      return new Promise(resolve => {
        timer = setTimeout(() => {
          return contentApiService
            .getSite(control.value)
            .subscribe(
              () => resolve({ message: 'LIBRARY.ERRORS.EXISTENT_SITE' }),
              () => resolve(null)
            );
        }, 300);
      });
    };
  }
}

export function forbidSpecialCharacters({ value }: FormControl) {
  const validCharacters: RegExp = /[^A-Za-z0-9-]/;
  const isValid: boolean = !validCharacters.test(value);

  return isValid
    ? null
    : {
        message: 'LIBRARY.ERRORS.ILLEGAL_CHARACTERS'
      };
}
