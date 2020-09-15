import { NgModule } from '@angular/core';
import { ExtensionService } from '@alfresco/adf-extensions';
import { AcaAboutComponent } from './aca-about.component';

@NgModule({
  declarations: [AcaAboutComponent],
  imports: [],
  exports: [AcaAboutComponent]
})
export class AcaAboutModule {
  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      'app.about.component': AcaAboutComponent
    });
  }
}
