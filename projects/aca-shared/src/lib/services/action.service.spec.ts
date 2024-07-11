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

import { TestBed } from '@angular/core/testing';
import { ActionService } from './action.service';
import { take } from 'rxjs/operators';

describe('ActionService', () => {
  let service: ActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionService);
  });

  it('should dispatch and filter actions by type', (done) => {
    const testAction = { type: 'testAction' };
    service
      .ofType('testAction')
      .pipe(take(1))
      .subscribe((action) => {
        expect(action).toEqual(testAction);
        done();
      });
    service.dispatch(testAction);
  });

  it('should not emit actions of a different type', () => {
    const testAction = { type: 'testAction' };
    const otherAction = { type: 'otherAction' };
    let emitted = false;

    service.ofType(testAction.type).subscribe(() => {
      emitted = true;
    });

    service.dispatch(otherAction);
    expect(emitted).toBeFalse();
  });

  it('should handle dispatching null actions gracefully', () => {
    expect(() => service.dispatch(null)).not.toThrow();
  });

  it('should initially emit a startup action', (done) => {
    service.actions$.pipe(take(1)).subscribe((action) => {
      expect(action.type).toBe('startup');
      done();
    });
  });
});
