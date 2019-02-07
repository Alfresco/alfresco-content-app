import { ExtensionService } from '@alfresco/adf-extensions';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { AosEditOnlineService } from './aos-extension.service';
import { AosEffects } from './effects/aos.effects';

import { canOpenWithOffice } from './evaluators';

@NgModule({
  imports: [EffectsModule.forFeature([AosEffects])],
  providers: [AosEditOnlineService]
})
export class AosExtensionModule {
  constructor(extensions: ExtensionService) {
    extensions.setEvaluators({
      'aos.canOpenWithOffice': canOpenWithOffice
    });
  }
}
