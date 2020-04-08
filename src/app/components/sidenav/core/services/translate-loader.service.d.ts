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
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ComponentTranslationModel } from '../models/component.model';
export declare class TranslateLoaderService implements TranslateLoader {
  private http;
  private prefix;
  private suffix;
  private providers;
  private queue;
  private defaultLang;
  constructor(http: HttpClient);
  setDefaultLang(value: string): void;
  registerProvider(name: string, path: string): void;
  providerRegistered(name: string): boolean;
  fetchLanguageFile(
    lang: string,
    component: ComponentTranslationModel,
    fallbackUrl?: string
  ): Observable<void>;
  getComponentToFetch(lang: string): Array<Observable<any>>;
  init(lang: string): void;
  isComponentInQueue(lang: string, name: string): boolean;
  getFullTranslationJSON(lang: string): any;
  getTranslation(lang: string): Observable<any>;
}
