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
export declare class BpmProductVersionModel {
  edition: string;
  majorVersion: string;
  revisionVersion: string;
  minorVersion: string;
  type: string;
  constructor(obj?: any);
}
export declare class VersionModel {
  major: string;
  minor: string;
  patch: string;
  hotfix: string;
  schema: number;
  label: string;
  display: string;
  constructor(obj?: any);
}
export declare class LicenseModel {
  issuedAt: string;
  expiresAt: string;
  remainingDays: number;
  holder: string;
  mode: string;
  isClusterEnabled: boolean;
  isCryptodocEnabled: boolean;
  constructor(obj?: any);
}
export declare class VersionStatusModel {
  isReadOnly: boolean;
  isAuditEnabled: boolean;
  isQuickShareEnabled: boolean;
  isThumbnailGenerationEnabled: boolean;
  constructor(obj?: any);
}
export declare class VersionModuleModel {
  id: string;
  title: string;
  description: string;
  version: string;
  installDate: string;
  installState: string;
  versionMin: string;
  versionMax: string;
  constructor(obj?: any);
}
export declare class EcmProductVersionModel {
  edition: string;
  version: VersionModel;
  license: LicenseModel;
  status: VersionStatusModel;
  modules: VersionModuleModel[];
  constructor(obj?: any);
}
