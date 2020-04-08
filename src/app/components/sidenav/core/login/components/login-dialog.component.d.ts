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
import { LoginDialogComponentData } from './login-dialog-component-data.interface';
import { LoginDialogPanelComponent } from './login-dialog-panel.component';
export declare class LoginDialogComponent {
  data: LoginDialogComponentData;
  loginPanel: LoginDialogPanelComponent;
  buttonActionName: string;
  constructor(data: LoginDialogComponentData);
  close(): void;
  submitForm(): void;
  onLoginSuccess(event: any): void;
  isFormValid(): boolean;
}
