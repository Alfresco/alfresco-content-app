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
import { OnInit } from '@angular/core';
import {
  BpmProductVersionModel,
  EcmProductVersionModel
} from '../../models/product-version.model';
import { ObjectDataTableAdapter } from '../../datatable/data/object-datatable-adapter';
import { AuthenticationService } from '../../services/authentication.service';
import { DiscoveryApiService } from '../../services/discovery-api.service';
export declare class AboutProductVersionComponent implements OnInit {
  private authService;
  private discovery;
  ecmVersion: EcmProductVersionModel;
  bpmVersion: BpmProductVersionModel;
  status: ObjectDataTableAdapter;
  license: ObjectDataTableAdapter;
  modules: ObjectDataTableAdapter;
  constructor(
    authService: AuthenticationService,
    discovery: DiscoveryApiService
  );
  ngOnInit(): void;
  setECMInfo(): void;
  setBPMInfo(): void;
}
