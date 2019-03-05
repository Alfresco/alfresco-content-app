import { ExtensionService } from '@alfresco/adf-extensions';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { AosEditOnlineService } from './aos-extension.service';
import { AosEffects } from './effects/aos.effects';

import { canOpenWithOffice } from './evaluators';
import { TranslationService } from '@alfresco/adf-core';

@NgModule({
  imports: [EffectsModule.forFeature([AosEffects])],
  providers: [AosEditOnlineService]
})
export class AosExtensionModule {
  constructor(extensions: ExtensionService, translation: TranslationService) {
    translation.addTranslationFolder(
      'adf-office-services-ext',
      'assets/adf-office-services-ext'
    );
    extensions.setEvaluators({
      'aos.canOpenWithOffice': canOpenWithOffice
    });
  }
}
