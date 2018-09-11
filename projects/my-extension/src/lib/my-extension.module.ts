import { NgModule } from '@angular/core';
import { MyExtensionComponent } from './my-extension.component';
import { ExtensionService } from '@alfresco/adf-extensions';

@NgModule({
  imports: [
  ],
  declarations: [MyExtensionComponent],
  exports: [MyExtensionComponent],
  entryComponents: [MyExtensionComponent]
})
export class MyExtensionModule {
    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'my-extension.main.component': MyExtensionComponent,
        });
    }
}
