import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoDrawerComponent } from './info-drawer.component';
import { InfoDrawerModule } from '@alfresco/adf-core';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, InfoDrawerModule, MatProgressSpinnerModule],
  declarations: [InfoDrawerComponent],
  exports: [InfoDrawerComponent]
})
export class SharedInfoDrawerModule {}
