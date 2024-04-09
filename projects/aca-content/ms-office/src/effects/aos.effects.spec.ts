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

import { Node } from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { AosAction } from '../actions/aos.actions';
import { AosEditOnlineService, IAosEditOnlineService } from '../aos-extension.service';
import { AosEffects } from './aos.effects';

class AosEditOnlineServiceMock implements IAosEditOnlineService {
  onActionEditOnlineAos(): void {}
}

describe('AosEffects', () => {
  let aosActions$: Observable<AosAction>;
  let effects: AosEffects;
  let aosEditOnlineService: AosEditOnlineService;

  beforeEach(() => {
    aosActions$ = new Observable<AosAction>();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AosEditOnlineService,
          useClass: AosEditOnlineServiceMock
        },
        provideMockActions(() => aosActions$),
        AosEffects
      ]
    });

    effects = TestBed.inject(AosEffects);
    aosEditOnlineService = TestBed.inject(AosEditOnlineService);
  });

  it('should call onActionEditOnlineAos on AOS_ACTION', () => {
    const onActionEditOnlineAosSpy = spyOn(aosEditOnlineService, 'onActionEditOnlineAos');

    const payload = new Node();
    const action = new AosAction(payload);
    aosActions$ = of(action);

    effects.openOffice$.subscribe(() => {});

    expect(onActionEditOnlineAosSpy).toHaveBeenCalledWith(payload);
  });
});
