import { NgModule } from '@angular/core';
import { AcaDevToolsModule, AcaDevToolsComponent } from 'aca-dev-tools';
import { ExtensionService } from './extensions/extension.service';
import { CodeEditorModule } from '@ngstack/code-editor';

// Main entry point for external extensions only.
// For any application-specific code use CoreExtensionsModule instead.

@NgModule({
    imports: [
        CodeEditorModule.forRoot({
            // use local Monaco installation
            baseUrl: 'assets/monaco',
            // use local Typings Worker
            typingsWorkerUrl: 'assets/workers/typings-worker.js'
        }),
        AcaDevToolsModule
    ]
})
export class ExtensionsModule {
    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'app.dev.tools.component': AcaDevToolsComponent
        });
    }
}
