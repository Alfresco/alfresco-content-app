import { CommonModule } from '@angular/common';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Routes, provideRoutes, RouterModule, Route } from '@angular/router';
import { ShellDummyGuard, SHELL_LAYOUT_ROUTE } from './app-shell.routes';
import { BlankPageComponent, SidenavLayoutModule } from '@alfresco/adf-core';
import { ExtensionService, ExtensionsModule, provideExtensionConfig } from '@alfresco/adf-extensions';
import { ShellLayoutComponent } from './components/shell/shell.component';
import { ContentModule } from '@alfresco/adf-content-services';
import { Observable } from 'rxjs';

export interface ShellPreferencesService {
  set(preferenceKey: string, value: any): void;
  get(preferenceKey: string, defaultValue: string): string;
}
export interface ShellAppService {
  init(): void;
  pageHeading$: Observable<string>;
  hideSidenavConditions: string[];
  minimizeSidenavConditions: string[];
  preferencesService: ShellPreferencesService;
}

export const SHELL_APP_SERVICE = new InjectionToken<ShellAppService>('SHELL_APP_SERVICE');

export interface AppShellRoutesConfig {
  shellParentRoute?: Route;
  shellChildren: Routes;
}

@NgModule({
  imports: [SidenavLayoutModule, ContentModule, ExtensionsModule, RouterModule.forChild([]), CommonModule, TranslateModule.forChild()],
  exports: [ShellLayoutComponent],
  declarations: [ShellLayoutComponent],
  providers: [provideExtensionConfig(['shell.plugin.json'])]
})
export class AppShellModule {
  static withChildren(routes: Routes | AppShellRoutesConfig): ModuleWithProviders<AppShellModule> {
    if (Array.isArray(routes)) {
      return getModuleForRoutes(routes);
    }

    return getModuleForRouteConfig(routes);
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

function getModuleForRoutes(routes: Routes): ModuleWithProviders<AppShellModule> {
  const shellLayoutRoute = SHELL_LAYOUT_ROUTE;

  routes.forEach((childRoute) => {
    shellLayoutRoute.children.push(childRoute);
  });

  return {
    ngModule: AppShellModule,
    providers: provideRoutes([shellLayoutRoute])
  };
}

function getModuleForRouteConfig(config: AppShellRoutesConfig): ModuleWithProviders<AppShellModule> {
  const shellLayoutRoute = SHELL_LAYOUT_ROUTE;

  const shellParentRoute = config.shellParentRoute;
  const shellChildrenRoutes = config.shellChildren;

  shellLayoutRoute.children.push(...shellChildrenRoutes);

  const rootRoute = shellParentRoute ? shellParentRoute : shellLayoutRoute;

  if (config.shellParentRoute) {
    if (rootRoute.children === undefined) {
      rootRoute.children = [];
    }

    rootRoute.children.push(shellLayoutRoute);
  }

  return {
    ngModule: AppShellModule,
    providers: provideRoutes([rootRoute])
  };
}
