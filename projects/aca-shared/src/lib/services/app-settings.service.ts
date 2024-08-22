/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { inject, Injectable } from '@angular/core';
import { AppConfigService, CloseButtonPosition } from '@alfresco/adf-core';
import { AlfrescoMimeType, DefaultMimeTypes } from '../constants/mime-types';

@Injectable({ providedIn: 'root' })
export class AppSettingsService {
  private appConfig = inject(AppConfigService);

  /**
   * Get the application copyright text from the app settings.
   */
  get appCopyright(): string {
    return this.appConfig.get<string>('application.copyright', '');
  }

  /**
   * Get the AOS (Alfresco Office Services) host URL from the app settings.
   */
  get aosHost(): string {
    return this.appConfig.get<string>('aosHost');
  }

  /**
   * Get the default landing page from the app settings.
   * Default value: `/personal-files`.
   */
  get landingPage(): string {
    return this.appConfig.get<string>('landingPage', '/personal-files');
  }

  /**
   * Get the list of mime types from the app settings.
   */
  get mimeTypes(): AlfrescoMimeType[] {
    return this.appConfig.get<AlfrescoMimeType[]>('mimeTypes', DefaultMimeTypes);
  }

  /**
   * Get the application name from the app settings.
   */
  get appName(): string {
    return this.appConfig.get<string>('application.name', 'Alfresco Content Application');
  }

  /**
   * Get the application version from the app settings.
   */
  get appVersion(): string {
    return this.appConfig.get<string>('application.version', '1.0.0');
  }

  /**
   * Get the application logo URL from the app settings.
   */
  get appLogoUrl(): string {
    return this.appConfig.get<string>('application.logo', 'assets/images/app-logo.svg');
  }

  /**
   * Get the custom CSS stylesheet path from the app settings.
   */
  get customCssPath(): string {
    return this.appConfig.get<string>('customCssPath', '');
  }

  /**
   * Get the custom web font path from the app settings.
   */
  get webFontPath(): string {
    return this.appConfig.get<string>('webFontPath', '');
  }

  /**
   * Get the base share URL from the app settings.
   */
  get baseShareUrl(): string {
    let result = this.appConfig.get<string>('baseShareUrl', '');
    if (!result.endsWith('/')) {
      result += '/';
    }
    return result;
  }

  /**
   * Get the viewer close button position from the app settings.
   */
  get viewerCloseButtonPosition(): CloseButtonPosition {
    return this.appConfig.get('viewer.closeButtonPosition', CloseButtonPosition.Right);
  }

  /**
   * Get the viewer max retries from the app settings.
   */
  get viewerMaxRetries(): number {
    return this.appConfig.get<number>('viewer.maxRetries', 1);
  }

  /**
   * Enabled state of the comment feature for upload dialog
   */
  get uploadAllowComments(): boolean {
    return this.appConfig.get<boolean>('adf-version-manager.allowComments', true);
  }

  /**
   * Enabled state of the download feature for upload dialog
   */
  get uploadAllowDownload(): boolean {
    return this.appConfig.get<boolean>('adf-version-manager.allowDownload', true);
  }

  /**
   * Gets the enablement of the file auto tryDownload feature from the app settings.
   */
  get autoDownloadEnabled(): boolean {
    return this.appConfig.get<boolean>('viewer.enableFileAutoDownload', true);
  }

  /**
   * Gets the file auto tryDownload size threshold in MB from the app settings.
   */
  get authDownloadThreshold(): number {
    return this.appConfig.get<number>('viewer.fileAutoDownloadSizeThresholdInMB', 15);
  }
}
