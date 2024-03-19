/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { RepositoryInfo, VersionInfo } from '@alfresco/js-api';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DocumentBasePageService } from '@alfresco/aca-shared';
import { AppState } from '@alfresco/aca-shared/store';

export class DocumentBasePageServiceMock extends DocumentBasePageService {
  canUpdateNode(): boolean {
    return true;
  }
  canUploadContent(): boolean {
    return true;
  }
}

export const INITIAL_APP_STATE: AppState = {
  appName: 'Alfresco Content Application',
  logoPath: 'assets/images/alfresco-logo-white.svg',
  customCssPath: '',
  webFontPath: '',
  sharedUrl: '',
  user: {
    isAdmin: null,
    id: null,
    firstName: '',
    lastName: ''
  },
  selection: {
    nodes: [],
    libraries: [],
    isEmpty: true,
    count: 0
  },
  navigation: {
    currentFolder: null
  },
  currentNodeVersion: null,
  infoDrawerOpened: false,
  infoDrawerPreview: false,
  infoDrawerMetadataAspect: '',
  showFacetFilter: true,
  fileUploadingDialog: true,
  showLoader: false,
  repository: {
    status: {
      isQuickShareEnabled: true
    }
  } as any
};

export const authenticationServiceMock = {
  isEcmLoggedIn: (): boolean => true,
  getRedirect: (): string | null => null,
  setRedirect() {},
  isOauth: (): boolean => false,
  isOAuthWithoutSilentLogin: (): boolean => false
};

export const discoveryApiServiceMock = {
  ecmProductInfo$: new BehaviorSubject<RepositoryInfo | null>(null),
  getEcmProductInfo: (): Observable<RepositoryInfo> =>
    of(
      new RepositoryInfo({
        version: {
          major: '10.0.0'
        } as VersionInfo
      })
    )
};
