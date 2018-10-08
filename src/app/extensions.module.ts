import { NgModule } from '@angular/core';
import { CodeEditorModule } from '@ngstack/code-editor';

// Main entry point for external extensions only.
// For any application-specific code use CoreExtensionsModule instead.

@NgModule({
  imports: [
    // Provides entry point for dynamic module registration,
    // do not remove the line below
    // $DYNAMIC_MODULES_PLACEHOLDER$
    CodeEditorModule.forRoot({
      // use local Monaco installation
      baseUrl: 'assets/monaco',
      // use local Typings Worker
      typingsWorkerUrl: 'assets/workers/typings-worker.js'
    })
  ]
})
export class AppExtensionsModule {}
