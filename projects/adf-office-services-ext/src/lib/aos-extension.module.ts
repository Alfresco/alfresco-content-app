import { ExtensionService } from '@alfresco/adf-extensions';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { AosEditOnlineService } from './aos-extension.service';
import { AosEffects } from './effects/aos.effects';

@NgModule({
  imports: [EffectsModule.forFeature([AosEffects])],
  providers: [AosEditOnlineService]
})
export class AosExtensionModule {
  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      // 'aos-edit-online.main.component': AosExtensionComponent
    });
  }
}
