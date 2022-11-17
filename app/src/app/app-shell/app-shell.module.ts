/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, provideRoutes, RouterModule, Route } from '@angular/router';
import { ShellDummyGuard, SHELL_LAYOUT_ROUTE } from './app-shell.routes';
import { BlankPageComponent, SidenavLayoutModule } from '@alfresco/adf-core';
import { ExtensionService, ExtensionsModule, provideExtensionConfig } from '@alfresco/adf-extensions';
import { ShellLayoutComponent } from './components/shell/shell.component';

export interface AppShellRoutesConfig {
  shellParentRoute?: Route;
  shellChildren: Routes;
}

@NgModule({
  imports: [SidenavLayoutModule, ExtensionsModule, RouterModule.forChild([]), CommonModule],
  exports: [ShellLayoutComponent],
  declarations: [ShellLayoutComponent],
  providers: [provideExtensionConfig(['shell.plugin.json'])]
})
export class AppShellModule {
  static withRoutes(routes: Routes | AppShellRoutesConfig): ModuleWithProviders<AppShellModule> {
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
