import { NgModule } from '@angular/core';
import { CodeEditorModule } from '@ngstack/code-editor';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcaDevToolsComponent } from './aca-dev-tools.component';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { ExtensionService } from '@alfresco/adf-extensions';

@NgModule({
    imports: [
        FlexLayoutModule,
        CodeEditorModule.forChild(),
        CoreModule.forChild(),
        ContentModule.forChild()
    ],
    declarations: [AcaDevToolsComponent],
    exports: [AcaDevToolsComponent],
    entryComponents: [AcaDevToolsComponent]
})
export class AcaDevToolsModule {
    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'app.dev.tools.component': AcaDevToolsComponent
        });
    }
}
