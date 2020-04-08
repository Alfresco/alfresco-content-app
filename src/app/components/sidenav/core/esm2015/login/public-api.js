/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export { LoginHeaderDirective } from './directives/login-header.directive';
export { LoginFooterDirective } from './directives/login-footer.directive';
export { LoginComponent } from './components/login.component';
export { LoginDialogComponent } from './components/login-dialog.component';
export {} from './components/login-dialog-component-data.interface';
export {
  LoginDialogPanelComponent
} from './components/login-dialog-panel.component';
export { LoginErrorEvent } from './models/login-error.event';
export { LoginSubmitEvent } from './models/login-submit.event';
export { LoginSuccessEvent } from './models/login-success.event';
export { LoginModule } from './login.module';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImxvZ2luL3B1YmxpYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEscUNBQWMscUNBQXFDLENBQUM7QUFDcEQscUNBQWMscUNBQXFDLENBQUM7QUFFcEQsK0JBQWMsOEJBQThCLENBQUM7QUFDN0MscUNBQWMscUNBQXFDLENBQUM7QUFDcEQsZUFBYyxvREFBb0QsQ0FBQztBQUNuRSwwQ0FBYywyQ0FBMkMsQ0FBQztBQUUxRCxnQ0FBYyw0QkFBNEIsQ0FBQztBQUMzQyxpQ0FBYyw2QkFBNkIsQ0FBQztBQUM1QyxrQ0FBYyw4QkFBOEIsQ0FBQztBQUU3Qyw0QkFBYyxnQkFBZ0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vZGlyZWN0aXZlcy9sb2dpbi1oZWFkZXIuZGlyZWN0aXZlJztcbmV4cG9ydCAqIGZyb20gJy4vZGlyZWN0aXZlcy9sb2dpbi1mb290ZXIuZGlyZWN0aXZlJztcblxuZXhwb3J0ICogZnJvbSAnLi9jb21wb25lbnRzL2xvZ2luLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2NvbXBvbmVudHMvbG9naW4tZGlhbG9nLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2NvbXBvbmVudHMvbG9naW4tZGlhbG9nLWNvbXBvbmVudC1kYXRhLmludGVyZmFjZSc7XG5leHBvcnQgKiBmcm9tICcuL2NvbXBvbmVudHMvbG9naW4tZGlhbG9nLXBhbmVsLmNvbXBvbmVudCc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbW9kZWxzL2xvZ2luLWVycm9yLmV2ZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbW9kZWxzL2xvZ2luLXN1Ym1pdC5ldmVudCc7XG5leHBvcnQgKiBmcm9tICcuL21vZGVscy9sb2dpbi1zdWNjZXNzLmV2ZW50JztcblxuZXhwb3J0ICogZnJvbSAnLi9sb2dpbi5tb2R1bGUnO1xuIl19
