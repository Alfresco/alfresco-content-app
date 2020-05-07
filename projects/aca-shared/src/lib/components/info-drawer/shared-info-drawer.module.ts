import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoDrawerComponent } from './info-drawer.component';
import { InfoDrawerModule } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { MatProgressBarModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, InfoDrawerModule, MatProgressBarModule, ExtensionsModule],
  declarations: [InfoDrawerComponent],
  exports: [InfoDrawerComponent]
})
export class SharedInfoDrawerModule {}
