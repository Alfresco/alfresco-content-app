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
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import { AppConfigService } from '../app-config/app-config.service';
export declare class DebugAppConfigService extends AppConfigService {
  private storage;
  constructor(storage: StorageService, http: HttpClient);
  /** @override */
  get<T>(key: string, defaultValue?: T): T;
}
