import { NgModule } from '@angular/core';
import { AcaDevToolsModule } from '@denysvuika/aca-dev-tools';

// Main entry point for external extensions only.
// For any application-specific code use CoreExtensionsModule instead.

@NgModule({
  imports: [AcaDevToolsModule]
})
export class AppExtensionsModule {}
