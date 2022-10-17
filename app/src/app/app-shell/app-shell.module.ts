import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Routes, provideRoutes, RouterModule } from '@angular/router';
import { ShellDummyGuard, SHELL_LAYOUT_ROUTE } from './app-shell.routes';
import { BlankPageComponent, SidenavLayoutModule } from '@alfresco/adf-core';
import { ExtensionService, ExtensionsModule, provideExtensionConfig } from '@alfresco/adf-extensions';
import { ShellLayoutComponent } from './components/shell/shell.component';
import { ContentModule } from '@alfresco/adf-content-services';

@NgModule({
  imports: [SidenavLayoutModule, ContentModule, ExtensionsModule, RouterModule.forChild([]), CommonModule, TranslateModule.forChild()],
  exports: [ShellLayoutComponent],
  declarations: [ShellLayoutComponent],
  providers: [provideExtensionConfig(['shell.plugin.json'])]
})
export class AppShellModule {
  static withChildren(childRouters: Routes[]): ModuleWithProviders<AppShellModule> {
    const shellLayoutRoute = SHELL_LAYOUT_ROUTE;

    childRouters.forEach((childRoute) => {
      shellLayoutRoute.children.push(...childRoute);
    });

    return {
      ngModule: AppShellModule,
      providers: provideRoutes([shellLayoutRoute])
    };
  }

  constructor(extensions: ExtensionService) {
    extensions.setAuthGuards({
      'app.shell.dummy.guard': ShellDummyGuard
    });

    extensions.setComponents({
      'app.shell.blank': BlankPageComponent
    });
  }
}
