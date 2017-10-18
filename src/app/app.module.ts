import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AdfModule } from './adf.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AdfModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
