import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdfModule } from './adf.module';
import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';

import { LoginComponent } from './components/login/login.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES, {
      enableTracing: true
    }),
    AdfModule
  ],
  declarations: [
    AppComponent,
    LoginComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
