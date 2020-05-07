import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarMenuItemComponent } from './toolbar-menu-item/toolbar-menu-item.component';
import { ToolbarMenuComponent } from './toolbar-menu/toolbar-menu.component';
import { ToolbarActionComponent } from './toolbar-action/toolbar-action.component';
import { ToolbarButtonComponent } from './toolbar-button/toolbar-button.component';
import { CoreModule } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';

@NgModule({
  imports: [CommonModule, CoreModule, ExtensionsModule],
  declarations: [
    ToolbarButtonComponent,
    ToolbarActionComponent,
    ToolbarMenuItemComponent,
    ToolbarMenuComponent
  ],
  exports: [
    ToolbarButtonComponent,
    ToolbarActionComponent,
    ToolbarMenuItemComponent,
    ToolbarMenuComponent
  ]
})
export class ToolbarModule {}
