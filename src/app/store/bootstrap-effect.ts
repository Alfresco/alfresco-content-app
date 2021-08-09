import {
  APP_BOOTSTRAP_LISTENER,
  InjectionToken,
  Inject,
  Type
} from '@angular/core';
import { EffectSources } from '@ngrx/effects';

export const BOOTSTRAP_EFFECTS = new InjectionToken('Bootstrap Effects');

export function bootstrapEffects(effects: Type<any>[], sources: EffectSources) {
  return () => {
    effects.forEach(effect => sources.addEffects(effect));
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
