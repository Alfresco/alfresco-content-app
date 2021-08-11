/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { APP_BOOTSTRAP_LISTENER, InjectionToken, Inject, Type } from '@angular/core';
import { EffectSources } from '@ngrx/effects';

export const BOOTSTRAP_EFFECTS = new InjectionToken('Bootstrap Effects');

export function bootstrapEffects(effects: Type<any>[], sources: EffectSources) {
  return () => {
    effects.forEach((effect) => sources.addEffects(effect));
  };
}

export function createInstances(...instances: any[]) {
  return instances;
}

export function provideBootstrapEffects(effects: Type<any>[]) {
  return [
    effects,
    { provide: BOOTSTRAP_EFFECTS, deps: effects, useFactory: createInstances },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      multi: true,
      useFactory: bootstrapEffects,
      deps: [[new Inject(BOOTSTRAP_EFFECTS)], EffectSources]
    }
  ];
}
