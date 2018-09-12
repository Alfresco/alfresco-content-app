import { NgModule } from '@angular/core';
import { AcaDevToolsModule } from 'aca-dev-tools';
import { CodeEditorModule } from '@ngstack/code-editor';
import { MyExtensionModule } from 'my-extension';

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
        AcaDevToolsModule,
        MyExtensionModule
    ]
})
export class AppExtensionsModule {}
