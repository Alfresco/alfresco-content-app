import { BlankPageComponent } from '@alfresco/adf-core';
import { LoginComponent } from './components/login/login.component';

export const APP_ROUTES = [
  {
    path: 'blank',
    component: BlankPageComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'APP.SIGN_IN'
    }
  }
];
