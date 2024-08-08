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

import * as app from './app.rules';
import { getFileExtension } from './app.rules';
import { TestRuleContext } from './test-rule-context';
import { NodeEntry, RepositoryInfo, StatusInfo } from '@alfresco/js-api';

describe('app.evaluators', () => {
  let context: TestRuleContext;

  beforeEach(() => {
    context = createTestContext();
  });

  describe('getFileExtension', () => {
    it('should return no extension when input is null', () => {
      expect(getFileExtension(null)).toBe(null);
    });

    it('should extract file extension', () => {
      expect(getFileExtension('test.docx')).toBe('docx');
    });

    it('should not extract file extension', () => {
      expect(getFileExtension('unknown')).toBe(null);
    });
  });

  describe('canDownloadSelection', () => {
    it('should return [false] if selection is empty', () => {
      context.selection.isEmpty = true;

      expect(app.canDownloadSelection(context)).toBe(false);
    });

    it('should return [false] for the trashcan entries', () => {
      context.selection.isEmpty = false;
      context.navigation = { url: '/trashcan' };

      expect(app.canDownloadSelection(context)).toBe(false);
    });

    it('should allow downloading files', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [{ entry: { isFile: true } } as NodeEntry];

      expect(app.canDownloadSelection(context)).toBe(true);
    });

    it('should allow downloading folders', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [{ entry: { isFolder: true } } as NodeEntry];

      expect(app.canDownloadSelection(context)).toBe(true);
    });

    it('should now allow downloading unknown selection', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [{ entry: {} } as NodeEntry];

      expect(app.canDownloadSelection(context)).toBe(false);
    });
  });

  describe('isWriteLocked', () => {
    it('should return [true] if lock type is set', () => {
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK' } } } as any;

      expect(app.isWriteLocked(context)).toBe(true);
    });

    it('should return [false] if lock type is not set', () => {
      context.selection.file = { entry: { properties: {} } } as any;

      expect(app.isWriteLocked(context)).toBe(false);
    });

    it('should return [false] if selection not present', () => {
      context = {} as any;

      expect(app.isWriteLocked(context)).toBe(false);
    });
  });

  describe('canShowExpand', () => {
    it('should return false when isLibraries returns true', () => {
      context.navigation.url = '/libraries';

      expect(app.canShowExpand(context)).toBe(false);
    });

    it('should return false when isDetails returns true', () => {
      context.navigation.url = '/details';

      expect(app.canShowExpand(context)).toBe(false);
    });
  });

  describe('hasLockedFiles', () => {
    it('should return [false] if selection not present', () => {
      context = {} as any;
      expect(app.hasLockedFiles(context)).toBe(false);
    });

    it('should return [false] if nodes not present', () => {
      context.selection.nodes = null;

      expect(app.hasLockedFiles(context)).toBe(false);
    });

    it('should return [false] if no files selected', () => {
      context.selection.nodes = [{ entry: { isFile: false } } as any, { entry: { isFile: false } } as any];

      expect(app.hasLockedFiles(context)).toBe(false);
    });

    it('should return [true] when one of files is locked', () => {
      context.selection.nodes = [{ entry: { isFile: true, isLocked: true } } as any, { entry: { isFile: true, isLocked: false } } as any];

      expect(app.hasLockedFiles(context)).toBe(true);
    });

    it('should return [true] when one of files has readonly lock', () => {
      context.selection.nodes = [
        { entry: { isFile: true, isLocked: false } } as any,
        { entry: { isFile: true, isLocked: false, properties: { 'cm:lockType': 'READ_ONLY_LOCK' } } } as any
      ];

      expect(app.hasLockedFiles(context)).toBe(true);
    });
  });

  describe('canUpdateSelectedNode', () => {
    it('should return [false] if selection not preset', () => {
      context = {} as any;

      expect(app.canUpdateSelectedNode(context)).toBe(false);
    });

    it('should return [false] if selection is empty', () => {
      context.selection.isEmpty = true;

      expect(app.canUpdateSelectedNode(context)).toBe(false);
    });

    it('should return [false] if first selection is not a file', () => {
      context.selection.isEmpty = false;
      context.selection.first = { entry: { isFile: false } } as any;
      context.permissions = { check: () => false };

      expect(app.canUpdateSelectedNode(context)).toBe(false);
    });

    it('should return [false] if the file is locked', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [{ entry: { isFile: true, isLocked: true } } as any];
      context.selection.first = { entry: { isFile: true, isLocked: true } } as any;
      context.permissions = { check: () => true };

      expect(app.canUpdateSelectedNode(context)).toBe(false);
    });

    it('should evaluate allowable operation for the file', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [
        { entry: { isFile: true, allowableOperationsOnTarget: [] } } as any,
        { entry: { isFile: true, allowableOperationsOnTarget: [] } } as any
      ];
      context.permissions = { check: () => true };

      expect(app.canUpdateSelectedNode(context)).toBe(true);
    });
  });

  describe('canUploadVersion', () => {
    it('should return [true] if user has locked it previously', () => {
      context.navigation.url = '/personal-files';
      context.profile = { id: 'user1' } as any;
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK', 'cm:lockOwner': { id: 'user1' } } } } as any;

      expect(app.canUploadVersion(context)).toBe(true);
    });

    it('should return [false] if other user has locked it previously', () => {
      context.navigation.url = '/personal-files';
      context.profile = { id: 'user2' } as any;
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK', 'cm:lockOwner': { id: 'user1' } } } } as any;

      expect(app.canUploadVersion(context)).toBe(false);
    });

    it('should check the [update] operation when no write lock present', () => {
      let checked = false;
      context.navigation.url = '/personal-files';
      context.selection.isEmpty = false;
      context.selection.file = { entry: { isFile: true } } as any;
      context.selection.nodes = [{ entry: { isFile: true } } as any];
      context.selection.first = { entry: { isFile: true } } as any;
      context.permissions = { check: () => (checked = true) };

      expect(app.canUploadVersion(context)).toBe(true);
      expect(checked).toBe(true);
    });

    it('should return [true] if route is `/favorites`', () => {
      context.navigation.url = '/favorites';
      context.selection.file = {} as any;

      expect(app.canUploadVersion(context)).toBe(true);
    });

    it('should return [true] if route is `/shared`', () => {
      context.navigation.url = '/shared';
      context.selection.file = {} as any;

      expect(app.canUploadVersion(context)).toBe(true);
    });
  });

  describe('isShared', () => {
    it('should return true if route is shared files and single selection', () => {
      context.navigation.url = '/shared';
      context.selection.file = {} as any;

      expect(app.isShared(context)).toBe(true);
    });

    it('should return false if route is shared files and multiple selection', () => {
      context.navigation.url = '/shared';
      context.selection.file = null;

      expect(app.isShared(context)).toBe(false);
    });

    it('should return false if route is trashcan route', () => {
      context.navigation.url = '/trashcan';
      context.selection.file = {} as any;

      expect(app.isShared(context)).toBe(false);
    });

    it('should return false if selection is not shared', () => {
      context.navigation.url = '/other';
      context.selection.file = { entry: { properties: {} } } as any;

      expect(app.isShared(context)).toBe(false);
    });

    it('should return true if selection is shared', () => {
      context.navigation.url = '/other';
      context.selection.file = { entry: { properties: { 'qshare:sharedId': 'some-id' } } } as any;

      expect(app.isShared(context)).toBe(true);
    });
  });

  describe('canShowLogout', () => {
    it('should return false when `withCredentials` property is true', () => {
      context.withCredentials = true;

      expect(app.canShowLogout(context)).toBe(false);
    });

    it('should return true when `withCredentials` property is false', () => {
      context.withCredentials = false;

      expect(app.canShowLogout(context)).toBe(true);
    });
  });

  describe('isLibraryManager', () => {
    it('should return true when role is SiteManager', () => {
      context.selection.library = { entry: { role: 'SiteManager' } } as any;

      expect(app.isLibraryManager(context)).toBe(true);
    });

    it('should return false when role is different than SiteManager and user is not an admin', () => {
      context.selection.library = { entry: { role: 'SiteCollaborator' } } as any;
      context.profile = { isAdmin: false } as any;

      expect(app.isLibraryManager(context)).toBe(false);
    });

    it('should return true if user is an admin no matter what the role is', () => {
      context.selection.library = { entry: { role: null } } as any;
      context.profile = { isAdmin: true } as any;

      expect(app.isLibraryManager(context)).toBe(true);
    });
  });

  describe('canOpenWithOffice', () => {
    const appConfig = {
      get: (key: string) => key
    };

    it('should return [false] if using SSO', () => {
      context.appConfig = appConfig as any;
      context.auth = { isOauth: () => true };

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if no selection present', () => {
      context.appConfig = appConfig as any;
      context.selection = null;

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if no file selected', () => {
      context.appConfig = appConfig as any;
      context.selection.file = null;

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file has no entry', () => {
      context.appConfig = appConfig as any;
      context.selection.file = { entry: null };

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file has no properties', () => {
      context.appConfig = appConfig as any;
      context.selection.file = { entry: { properties: null } } as any;

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file is locked', () => {
      context.appConfig = appConfig as any;
      context.selection.file = { entry: { isLocked: true, properties: {} } } as any;

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file has no extension', () => {
      context.appConfig = appConfig as any;
      context.selection.file = { entry: { name: 'readme', isLocked: false, properties: {} } } as any;

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if extension is not supported', () => {
      context.appConfig = appConfig as any;
      context.selection.file = { entry: { name: 'run.exe', isLocked: false, properties: {} } } as any;

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file has write lock', () => {
      context.appConfig = appConfig as any;
      context.selection.file = { entry: { name: 'document.docx', isLocked: false, properties: { 'cm:lockType': 'WRITE_LOCK' } } } as any;

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if selected file has read-only lock', () => {
      context.appConfig = appConfig as any;
      context.selection.file = { entry: { name: 'document.docx', isLocked: false, properties: { 'cm:lockType': 'READ_ONLY_LOCK' } } } as any;

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if current user is not lock owner', () => {
      context.appConfig = appConfig as any;
      context.selection.file = {
        entry: { name: 'document.docx', isLocked: false, properties: { 'cm:lockType': 'READ_ONLY_LOCK', 'cm:lockOwner': { id: 'user2' } } }
      } as any;
      context.profile = { id: 'user1' } as any;

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if current user is lock owner', () => {
      context.appConfig = appConfig as any;
      context.selection.file = {
        entry: { name: 'document.docx', isLocked: false, properties: { 'cm:lockType': 'READ_ONLY_LOCK', 'cm:lockOwner': { id: 'user1' } } }
      } as any;
      context.profile = { id: 'user1' } as any;

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [false] if permissions check is false', () => {
      context.appConfig = appConfig as any;
      context.selection.file = { entry: { name: 'document.docx', isLocked: false, properties: {} } } as any;
      context.permissions = { check: () => false };

      expect(app.canOpenWithOffice(context)).toBeFalsy();
    });

    it('should return [true] if all checks succeed', () => {
      context.appConfig = { get: () => true } as any;
      context.selection.file = { entry: { name: 'document.docx', isLocked: false, properties: {} } } as any;
      context.permissions = { check: () => true };

      expect(app.canOpenWithOffice(context)).toBeTruthy();
    });
  });

  describe('canEditAspects', () => {
    it('should return false for multiselection', () => {
      context.selection.count = 2;

      expect(app.canEditAspects(context)).toBe(false);
    });

    it('should return false if user cannot update the selected node', () => {
      context.permissions.check = spyOn(context.permissions, 'check').and.returnValue(false);

      expect(app.canEditAspects(context)).toBe(false);
    });

    it('should return false if the selected node is write locked', () => {
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK' } } } as NodeEntry;

      expect(app.canEditAspects(context)).toBe(false);
    });

    it('should return false if the context is trashcan', () => {
      context.navigation = { url: '/trashcan' };

      expect(app.canEditAspects(context)).toBe(false);
    });

    it('should return true if all conditions are met', () => {
      expect(app.canEditAspects(context)).toBe(true);
    });
  });

  describe('canManagePermissions', () => {
    it('should return false if user cannot update the selected node', () => {
      context.permissions.check = spyOn(context.permissions, 'check').and.returnValue(false);

      expect(app.canManagePermissions(context)).toBe(false);
    });

    it('should return false if the context is trashcan', () => {
      context.navigation = { url: '/trashcan' };

      expect(app.canManagePermissions(context)).toBe(false);
    });

    it('should return false if many nodes are selected', () => {
      context.selection.count = 2;
      expect(app.canManagePermissions(context)).toBe(false);
    });

    it('should return false if the selected node is a smart folder', () => {
      context.selection.first = { entry: { aspectNames: ['smf:customConfigSmartFolder'], isFolder: true } } as NodeEntry;
      expect(app.canManagePermissions(context)).toBe(false);
    });

    it('should return true if user can update the selected node and it is not a trashcan nor smart folder nor multiselect', () => {
      expect(app.canManagePermissions(context)).toBe(true);
    });
  });

  describe('areTagsEnabled', () => {
    it('should call context.appConfig.get with correct parameters', () => {
      context.appConfig = { get: jasmine.createSpy() } as any;

      app.areTagsEnabled(context);
      expect(context.appConfig.get).toHaveBeenCalledWith('plugins.tagsEnabled', true);
    });

    it('should return true if get from appConfig returns true', () => {
      expect(
        app.areTagsEnabled({
          appConfig: {
            get: () => true
          }
        } as any)
      ).toBeTrue();
    });

    it('should return false if get from appConfig returns false', () => {
      expect(
        app.areTagsEnabled({
          appConfig: {
            get: () => false
          }
        } as any)
      ).toBeFalse();
    });
  });

  describe('areCategoriesEnabled', () => {
    it('should call context.appConfig.get with correct parameters', () => {
      context.appConfig = { get: jasmine.createSpy() } as any;

      app.areCategoriesEnabled(context);
      expect(context.appConfig.get).toHaveBeenCalledWith('plugins.categoriesEnabled', true);
    });

    it('should return true if get from appConfig returns true', () => {
      expect(
        app.areCategoriesEnabled({
          appConfig: {
            get: () => true
          }
        } as any)
      ).toBeTrue();
    });

    it('should return false if get from appConfig returns false', () => {
      expect(
        app.areCategoriesEnabled({
          appConfig: {
            get: () => false
          }
        } as any)
      ).toBeFalse();
    });
  });

  describe('isContentServiceEnabled', () => {
    it('should call context.appConfig.get with correct parameters', () => {
      context.appConfig = { get: jasmine.createSpy() } as any;

      app.isContentServiceEnabled(context);
      expect(context.appConfig.get).toHaveBeenCalledWith('plugins.contentService');
    });

    it('should return true if contentService plugin is enabled', () => {
      expect(
        app.isContentServiceEnabled({
          appConfig: {
            get: () => true
          }
        } as any)
      ).toBeTrue();
      expect(
        app.isContentServiceEnabled({
          appConfig: {
            get: () => 'true'
          }
        } as any)
      ).toBeTrue();
    });

    it('should return false if contentService plugin is disabled', () => {
      expect(
        app.isContentServiceEnabled({
          appConfig: {
            get: () => false
          }
        } as any)
      ).toBeFalse();
    });
  });

  describe('canCopyNode', () => {
    it('should return false when nothing is selected', () => {
      context.selection.isEmpty = true;
      expect(app.canCopyNode(context)).toBeFalse();
    });

    it('should return false when selection exists and user is in trashcan', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/trashcan/test';
      expect(app.canCopyNode(context)).toBeFalse();
    });

    it('should return false when selection exists and user is in library', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/test/libraries';
      expect(app.canCopyNode(context)).toBeFalse();

      context.navigation.url = '/search-libraries/test';
      expect(app.canCopyNode(context)).toBeFalse();
    });

    it('should return true when selection exists and user is outside library and trashcan', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/personal-files';
      expect(app.canCopyNode(context)).toBeTrue();
    });
  });

  describe('canAddFavorite', () => {
    it('should return false when nothing is selected', () => {
      context.selection.isEmpty = true;
      expect(app.canAddFavorite(context)).toBeFalse();
    });

    it('should return false when selection exists but user is in trashcan, favorites or library', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/trashcan/test';
      expect(app.canAddFavorite(context)).toBeFalse();

      context.navigation.url = '/favorites/test';
      expect(app.canAddFavorite(context)).toBeFalse();

      context.navigation.url = '/test/libraries';
      expect(app.canAddFavorite(context)).toBeFalse();

      context.navigation.url = '/search-libraries/test';
      expect(app.canAddFavorite(context)).toBeFalse();
    });

    it('should return false when each selected node is already a favorite', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [{ entry: { isFavorite: true } as any }, { entry: { isFavorite: true } as any }];
      context.navigation.url = '/personal-files';
      expect(app.canAddFavorite(context)).toBeFalse();
    });

    it('should return true when some selected nodes are not favorite', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [{ entry: { isFavorite: true } as any }, { entry: { isFavorite: false } as any }];
      context.navigation.url = '/personal-files';
      expect(app.canAddFavorite(context)).toBeTrue();
    });
  });

  describe('canRemoveFavorite', () => {
    it('should return false when nothing is selected', () => {
      context.selection.isEmpty = true;
      expect(app.canRemoveFavorite(context)).toBeFalse();
    });

    it('should return false when selection exists but user is in trashcan', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/trashcan/test';
      expect(app.canRemoveFavorite(context)).toBeFalse();
    });

    it('should return true when user is in favorites page', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/favorites/test';
      expect(app.canRemoveFavorite(context)).toBeTrue();
    });

    it('should return false when only some selected nodes are favorite', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [{ entry: { isFavorite: true } as any }, { entry: { isFavorite: false } as any }];
      context.navigation.url = '/personal-files';
      expect(app.canRemoveFavorite(context)).toBeFalse();
    });

    it('should return true when each selected node is favorite', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [{ entry: { isFavorite: true } as any }, { entry: { isFavorite: true } as any }];
      context.navigation.url = '/personal-files';
      expect(app.canRemoveFavorite(context)).toBeTrue();
    });
  });

  describe('canShareFile', () => {
    beforeEach(() => {
      context.repository.status = new StatusInfo();
      context.selection.isEmpty = false;
    });

    it('should return false when nothing is selected', () => {
      context.selection.file = null;
      expect(app.canShareFile(context)).toBeFalse();
    });

    it('should return false when selection exists and user is in trashcan', () => {
      context.selection.file = {} as any;
      context.navigation.url = '/trashcan/test';
      expect(app.canShareFile(context)).toBeFalse();
    });

    it('should return false when quick share is disabled', () => {
      context.selection.file = {} as any;
      context.navigation.url = '/personal-files';
      context.repository.status.isQuickShareEnabled = false;
      expect(app.canShareFile(context)).toBeFalse();
    });

    it('should return false when selected file is already shared', () => {
      context.selection.file = { entry: { properties: { 'qshare:sharedId': 'some-id' } } as any };
      context.navigation.url = '/personal-files';
      context.repository.status.isQuickShareEnabled = true;
      expect(app.canShareFile(context)).toBeFalse();
    });

    it('should return true when selected file is not already shared', () => {
      context.selection.file = {} as any;
      context.navigation.url = '/personal-files';
      context.repository.status.isQuickShareEnabled = true;
      expect(app.canShareFile(context)).toBeTrue();
    });
  });

  describe('canToggleJoinLibrary', () => {
    beforeEach(() => {
      context.profile = {} as any;
    });

    it('should return false when no library is selected', () => {
      context.selection.library = null;
      expect(app.canToggleJoinLibrary(context)).toBeFalse();
    });

    it('should return false when selected library is private and user is not admin', () => {
      context.selection.library = { entry: { visibility: 'PRIVATE' } } as any;
      context.profile.isAdmin = false;
      expect(app.canToggleJoinLibrary(context)).toBeFalse();
    });

    it('should return false when user already has a library role', () => {
      context.selection.library = { entry: { role: 'test' } } as any;
      context.profile.isAdmin = false;
      expect(app.canToggleJoinLibrary(context)).toBeFalse();
    });

    it('should return true when user has no role in not private library', () => {
      context.selection.library = { entry: { visibility: 'PUBLIC' } } as any;
      context.profile.isAdmin = false;
      expect(app.canToggleJoinLibrary(context)).toBeTrue();
    });

    it('should return true when user has no role in private library with admin rights', () => {
      context.selection.library = { entry: { visibility: 'PRIVATE' } } as any;
      context.profile.isAdmin = true;
      expect(app.canToggleJoinLibrary(context)).toBeTrue();
    });
  });

  describe('canEditFolder', () => {
    it('should return false when no folder is selected', () => {
      context.selection.folder = null;
      expect(app.canEditFolder(context)).toBeFalse();
    });

    it('should return false when user is in trashcan', () => {
      context.navigation.url = '/trashcan/test';
      expect(app.canEditFolder(context)).toBeFalse();
    });

    it('should return true when user is in favorites and has selected folder', () => {
      context.navigation.url = '/favorites/test';
      context.selection.folder = {} as any;
      expect(app.canEditFolder(context)).toBeTrue();
    });

    it('should return false when selected folder cannot be updated', () => {
      context.navigation.url = '/personal-files';
      context.selection.folder = {} as any;
      context.permissions = { check: () => false };
      expect(app.canEditFolder(context)).toBeFalse();
    });

    it('should return true when selected folder can be updated', () => {
      context.navigation.url = '/personal-files';
      context.selection.folder = {} as any;
      context.permissions = { check: () => true };
      expect(app.canEditFolder(context)).toBeTrue();
    });

    it('should verify if user has update permission in the folder', () => {
      context.navigation.url = '/personal-files';
      context.selection.folder = { entry: { allowableOperations: ['update'] } } as any;
      spyOn(context.permissions, 'check');
      app.canEditFolder(context);
      expect(context.permissions.check).toHaveBeenCalledWith(context.selection.folder.entry, ['update']);
    });
  });

  describe('canDeleteSelection', () => {
    it('should return false when selection is empty', () => {
      context.selection.isEmpty = true;
      expect(app.canDeleteSelection(context)).toBeFalse();
    });

    it('should return false when user is in trashcan or library', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/trashcan/test';
      expect(app.canDeleteSelection(context)).toBeFalse();

      context.navigation.url = '/test/libraries';
      expect(app.canDeleteSelection(context)).toBeFalse();

      context.navigation.url = '/search-libraries/test';
      expect(app.canDeleteSelection(context)).toBeFalse();
    });

    it('should return false when selection contain locked file', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/personal-files';
      context.selection.nodes = [{ entry: { isFile: true, isLocked: true } } as any];
      expect(app.canDeleteSelection(context)).toBeFalse();
    });

    it('should return true when user is in search result page', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/search/test';
      expect(app.canDeleteSelection(context)).toBeTrue();
    });

    it('should return true when user is in favorites', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/favorites/test';
      context.selection.nodes = [];
      expect(app.canDeleteSelection(context)).toBeTrue();
    });

    it('should return false when permission check fails', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/personal-files';
      context.selection.nodes = [{ entry: {} } as any];
      context.permissions = { check: () => false };
      expect(app.canDeleteSelection(context)).toBeFalse();
    });

    it('should return true when permission requirements are met', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/personal-files';
      context.selection.nodes = [{ entry: {} } as any];
      context.permissions = { check: () => true };
      expect(app.canDeleteSelection(context)).toBeTrue();
    });

    it('should verify if user has delete permissions on node', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/personal-files';
      context.selection.nodes = [{ entry: { allowableOperations: ['delete'] } } as any];
      spyOn(context.permissions, 'check');
      app.canDeleteSelection(context);
      expect(context.permissions.check).toHaveBeenCalledWith(context.selection.nodes, ['delete']);
    });
  });

  describe('canUnshareNodes', () => {
    it('should return false when selection is empty', () => {
      context.selection.isEmpty = true;
      expect(app.canUnshareNodes(context)).toBeFalse();
    });

    it('should return false when permission check fails', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [{} as any];
      context.permissions = { check: () => false };
      expect(app.canUnshareNodes(context)).toBeFalse();
    });

    it('should return true when permission requirements are met', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [{} as any];
      context.permissions = { check: () => true };
      expect(app.canUnshareNodes(context)).toBeTrue();
    });

    it('should verify if user have delete permission on selected node', () => {
      context.selection.isEmpty = false;
      context.selection.nodes = [{ allowableOperationsOnTarget: ['delete'] } as any];
      spyOn(context.permissions, 'check');
      app.canUnshareNodes(context);
      expect(context.permissions.check).toHaveBeenCalledWith(context.selection.nodes, ['delete'], { target: 'allowableOperationsOnTarget' });
    });
  });

  describe('hasSelection', () => {
    it('should return false when nothing is selected', () => {
      context.selection.isEmpty = true;
      expect(app.hasSelection(context)).toBeFalse();
    });

    it('should return true when something is selected', () => {
      context.selection.isEmpty = false;
      expect(app.hasSelection(context)).toBeTrue();
    });
  });

  describe('canCreateFolder', () => {
    it('should return false when content service is disabled', () => {
      context.appConfig = { get: () => false } as any;
      expect(app.canCreateFolder(context)).toBeFalse();
    });

    it('should return false when user is outside personal files or libraries', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/favorite/test';
      expect(app.canCreateFolder(context)).toBeFalse();
    });

    it('should return false when current folder does not exist', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/personal-files/test';
      context.navigation.currentFolder = null;
      expect(app.canCreateFolder(context)).toBeFalse();
    });

    it('should return false when permission check fails', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/personal-files/test';
      context.navigation.currentFolder = {} as any;
      context.permissions = { check: () => false };
      expect(app.canCreateFolder(context)).toBeFalse();
    });

    it('should return true when permission requirements are met', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/personal-files/test';
      context.navigation.currentFolder = {} as any;
      context.permissions = { check: () => true };
      expect(app.canCreateFolder(context)).toBeTrue();
    });

    it('should verify is user has create permission on current folder', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/personal-files/test';
      context.navigation.currentFolder = { allowableOperations: ['create'] } as any;
      spyOn(context.permissions, 'check');
      app.canCreateFolder(context);
      expect(context.permissions.check).toHaveBeenCalledWith(context.navigation.currentFolder, ['create']);
    });
  });

  describe('canCreateLibrary', () => {
    it('should return false when content service is disabled', () => {
      context.appConfig = { get: () => false } as any;
      expect(app.canCreateLibrary(context)).toBeFalse();
    });

    it('should return false when user is outside libraries', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/favorite/test';
      expect(app.canCreateLibrary(context)).toBeFalse();
    });

    it('should return true when content service is enabled and user is in libraries', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/test/libraries';
      expect(app.canCreateLibrary(context)).toBeTrue();
    });
  });

  describe('canUpload', () => {
    it('should return false when content service is disabled', () => {
      context.appConfig = { get: () => false } as any;
      expect(app.canUpload(context)).toBeFalse();
    });

    it('should return false when user is outside personal files or libraries', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/favorite/test';
      expect(app.canUpload(context)).toBeFalse();
    });

    it('should return false when current folder does not exist', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/personal-files/test';
      context.navigation.currentFolder = null;
      expect(app.canUpload(context)).toBeFalse();
    });

    it('should return false when permission check fails', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/personal-files/test';
      context.navigation.currentFolder = {} as any;
      context.permissions = { check: () => false };
      expect(app.canUpload(context)).toBeFalse();
    });

    it('should return true when permission requirements are met', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/personal-files/test';
      context.navigation.currentFolder = {} as any;
      context.permissions = { check: () => true };
      expect(app.canUpload(context)).toBeTrue();
    });

    it('should verify if user has create permission on current folder', () => {
      context.appConfig = { get: () => true } as any;
      context.navigation.url = '/personal-files/test';
      context.navigation.currentFolder = { allowableOperations: ['create'] } as any;
      spyOn(context.permissions, 'check');
      app.canCreateFolder(context);
      expect(context.permissions.check).toHaveBeenCalledWith(context.navigation.currentFolder, ['create']);
    });
  });

  describe('hasFileSelected', () => {
    it('should return false when no file is selected', () => {
      context.selection.file = null;
      expect(app.hasFileSelected(context)).toBeFalse();
    });

    it('should return true when file is selected', () => {
      context.selection.file = {} as any;
      expect(app.hasFileSelected(context)).toBeTrue();
    });
  });

  describe('hasFolderSelected', () => {
    it('should return false when no folder is selected', () => {
      context.selection.folder = null;
      expect(app.hasFolderSelected(context)).toBeFalse();
    });

    it('should return true when folder is selected', () => {
      context.selection.folder = {} as any;
      expect(app.hasFolderSelected(context)).toBeTrue();
    });
  });

  describe('hasLibrarySelected', () => {
    it('should return false when no library is selected', () => {
      context.selection.library = null;
      expect(app.hasLibrarySelected(context)).toBeFalse();
    });

    it('should return true when library is selected', () => {
      context.selection.library = {} as any;
      expect(app.hasLibrarySelected(context)).toBeTrue();
    });
  });

  describe('isPrivateLibrary', () => {
    it('should return false when library is not private', () => {
      context.selection.library = { entry: { visibility: 'PUBLIC' } } as any;
      expect(app.isPrivateLibrary(context)).toBeFalse();
    });

    it('should return true when library is private', () => {
      context.selection.library = { entry: { visibility: 'PRIVATE' } } as any;
      expect(app.isPrivateLibrary(context)).toBeTrue();
    });
  });

  describe('hasLibraryRole', () => {
    it('should return false when library has no role', () => {
      context.selection.library = { entry: { role: '' } } as any;
      expect(app.hasLibraryRole(context)).toBeFalse();
    });

    it('should return true when library has a role', () => {
      context.selection.library = { entry: { role: 'test' } } as any;
      expect(app.hasLibraryRole(context)).toBeTrue();
    });
  });

  describe('hasNoLibraryRole', () => {
    it('should return false when library has a role', () => {
      context.selection.library = { entry: { role: 'test' } } as any;
      expect(app.hasNoLibraryRole(context)).toBeFalse();
    });

    it('should return true when library has no role', () => {
      context.selection.library = { entry: { role: '' } } as any;
      expect(app.hasNoLibraryRole(context)).toBeTrue();
    });
  });

  describe('isMultiselection', () => {
    it('should return false when there is no or single selection', () => {
      context.selection.isEmpty = true;
      expect(app.isMultiselection(context)).toBeFalse();

      context.selection.isEmpty = false;
      context.selection.count = 1;
      expect(app.isMultiselection(context)).toBeFalse();
    });

    it('should return true when there is multiple selection', () => {
      context.selection.isEmpty = false;
      context.selection.count = 5;
      expect(app.isMultiselection(context)).toBeTrue();
    });
  });

  describe('canUpdateSelectedFolder', () => {
    it('should return false when no folder is selected', () => {
      context.selection.folder = null;
      expect(app.canUpdateSelectedFolder(context)).toBeFalse();
    });

    it('should return true when user is in favorites', () => {
      context.selection.folder = {} as any;
      context.navigation.url = '/favorites/test';
      expect(app.canUpdateSelectedFolder(context)).toBeTrue();
    });

    it('should return false when permission check fails', () => {
      context.selection.folder = {} as any;
      context.navigation.url = '/personal-files/test';
      context.permissions = { check: () => false };
      expect(app.canUpdateSelectedFolder(context)).toBeFalse();
    });

    it('should return true when permission requirements are met', () => {
      context.selection.folder = {} as any;
      context.navigation.url = '/personal-files/test';
      context.permissions = { check: () => true };
      expect(app.canUpdateSelectedFolder(context)).toBeTrue();
    });

    it('should verify if user has update permission on selected folder', () => {
      context.selection.folder = { entry: {} } as any;
      context.navigation.url = '/personal-files/test';
      spyOn(context.permissions, 'check');
      app.canUpdateSelectedFolder(context);
      expect(context.permissions.check).toHaveBeenCalledWith(context.selection.folder.entry, ['update']);
    });
  });

  describe('isUserWriteLockOwner', () => {
    beforeEach(() => {
      context.profile = {} as any;
    });

    it('should return false when there is no lock', () => {
      context.selection.file = { entry: { properties: [] } } as any;
      expect(app.isUserWriteLockOwner(context)).toBeFalse();
    });

    it('should return false when user id does not match lock owner id', () => {
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK', 'cm:lockOwner': { id: 'test' } } } } as any;
      context.profile.id = 'test1';
      expect(app.isUserWriteLockOwner(context)).toBeFalse();
    });

    it('should return true when user is the owner of the lock', () => {
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK', 'cm:lockOwner': { id: 'test1' } } } } as any;
      context.profile.id = 'test1';
      expect(app.isUserWriteLockOwner(context)).toBeTrue();
    });
  });

  describe('canLockFile', () => {
    it('should return false when file is already locked', () => {
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK' } } } as any;
      expect(app.canLockFile(context)).toBeFalse();
    });

    it('should return false when permission check fails', () => {
      context.selection.file = { entry: { properties: {} } } as any;
      context.permissions = { check: () => false };
      expect(app.canLockFile(context)).toBeFalse();
    });

    it('should return true when file has no lock and permission requirements are met', () => {
      context.selection.file = { entry: { properties: {} } } as any;
      context.permissions = { check: () => true };
      expect(app.canLockFile(context)).toBeTrue();
    });
  });

  describe('canUnlockFile', () => {
    beforeEach(() => {
      context.profile = {} as any;
    });

    it('should return false when file has no lock', () => {
      context.selection.file = { entry: { properties: [] } } as any;
      expect(app.canUnlockFile(context)).toBeFalse();
    });

    it('should return false when file is locked but user is not the owner of the lock and does not have the delete permission', () => {
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK', 'cm:lockOwner': { id: 'test' } } } } as any;
      context.profile.id = 'test1';
      context.permissions = { check: () => false };
      expect(app.canUnlockFile(context)).toBeFalse();
    });

    it('should return true when file is locked and permission requirements are met', () => {
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK', 'cm:lockOwner': { id: 'test' } } } } as any;
      context.profile.id = 'test1';
      context.permissions = { check: () => true };
      expect(app.canUnlockFile(context)).toBeTrue();
    });

    it('should return true when file is locked and user is the owner of the lock', () => {
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK', 'cm:lockOwner': { id: 'test1' } } } } as any;
      context.profile.id = 'test1';
      context.permissions = { check: () => false };
      expect(app.canUnlockFile(context)).toBeTrue();
    });

    it('should verify if user has delete permission on current file', () => {
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK', 'cm:lockOwner': { id: 'test' } } } } as any;
      context.profile.id = 'test1';
      spyOn(context.permissions, 'check');
      app.canUnlockFile(context);
      expect(context.permissions.check).toHaveBeenCalledWith(context.selection.file.entry, ['delete']);
    });
  });

  describe('isTrashcanItemSelected', () => {
    it('should return false when user is not in trashcan', () => {
      context.navigation.url = '/personal-files/test';
      expect(app.isTrashcanItemSelected(context)).toBeFalse();
    });

    it('should return false when nothing is selected', () => {
      context.navigation.url = '/trashcan/test';
      context.selection.isEmpty = true;
      expect(app.isTrashcanItemSelected(context)).toBeFalse();
    });

    it('should return true when user is in trashcan and node is selected', () => {
      context.navigation.url = '/trashcan/test';
      context.selection.isEmpty = false;
      expect(app.isTrashcanItemSelected(context)).toBeTrue();
    });
  });

  describe('canViewFile', () => {
    it('should return false when user is in trashcan', () => {
      context.navigation.url = '/trashcan/test';
      expect(app.canViewFile(context)).toBeFalse();
    });

    it('should return false when nothing is selected', () => {
      context.navigation.url = '/personal-files/test';
      context.selection.file = null;
      expect(app.canViewFile(context)).toBeFalse();
    });

    it('should return true when user is not in trashcan and file is selected', () => {
      context.navigation.url = '/personal-files/test';
      context.selection.file = {} as any;
      expect(app.canViewFile(context)).toBeTrue();
    });
  });

  describe('canLeaveLibrary', () => {
    it('should return false when no library is selected', () => {
      context.selection.library = null;
      expect(app.canLeaveLibrary(context)).toBeFalse();
    });

    it('should return false when user does not have library role', () => {
      context.selection.library = { entry: { role: null } } as any;
      expect(app.canLeaveLibrary(context)).toBeFalse();
    });

    it('should return true when user has a library role', () => {
      context.selection.library = { entry: { role: 'test' } } as any;
      expect(app.canLeaveLibrary(context)).toBeTrue();
    });
  });

  describe('canToggleSharedLink', () => {
    beforeEach(() => {
      context.repository.status = new StatusInfo();
    });

    it('should return false when no file is selected', () => {
      context.selection.file = null;
      expect(app.canToggleSharedLink(context)).toBeFalse();
    });

    it('should return false when file is not shared and user cannot share it', () => {
      context.selection.file = { entry: { properties: {} } } as any;
      context.repository.status.isQuickShareEnabled = false;
      expect(app.canToggleSharedLink(context)).toBeFalse();
    });

    it('should return true when file is already shared', () => {
      context.selection.file = { entry: { properties: { 'qshare:sharedId': 'some-id' } } } as any;
      context.repository.status.isQuickShareEnabled = false;
      expect(app.canToggleSharedLink(context)).toBeTrue();
    });

    it('should return true when file can be shared', () => {
      context.selection.file = { entry: { properties: {} } } as any;
      context.repository.status.isQuickShareEnabled = true;
      expect(app.canToggleSharedLink(context)).toBeTrue();
    });
  });

  describe('canShowInfoDrawer', () => {
    it('should return false when nothing is selected', () => {
      context.selection.isEmpty = true;
      expect(app.canShowInfoDrawer(context)).toBeFalse();
    });

    it('should return false when user is in libraries or trashcan', () => {
      context.selection.isEmpty = false;
      context.navigation.url = '/trashcan/test';
      expect(app.canShowInfoDrawer(context)).toBeFalse();

      context.navigation.url = '/test/libraries';
      expect(app.canShowInfoDrawer(context)).toBeFalse();
    });

    it('should return true when selection exists and user is not in trashcan or libraries', () => {
      context.navigation.url = '/personal-files/test';
      context.selection.isEmpty = false;
      expect(app.canShowInfoDrawer(context)).toBeTrue();
    });
  });

  describe('canManageFileVersions', () => {
    it('should return false when no file is selected', () => {
      context.selection.file = null;
      expect(app.canManageFileVersions(context)).toBeFalse();
    });

    it('should return false when user is in trashcan', () => {
      context.selection.file = {} as any;
      context.navigation.url = '/trashcan/test';
      expect(app.canManageFileVersions(context)).toBeFalse();
    });

    it('should return false when locked file is selected', () => {
      context.selection.file = {} as any;
      context.selection.nodes = [{ entry: { isFile: true, isLocked: true } } as any];
      context.navigation.url = '/personal-files/test';
      expect(app.canManageFileVersions(context)).toBeFalse();
    });

    it('should return true when non-locked file is selected', () => {
      context.selection.file = {} as any;
      context.selection.nodes = [{ entry: { isFile: true, isLocked: false } } as any];
      context.navigation.url = '/personal-files/test';
      expect(app.canManageFileVersions(context)).toBeTrue();
    });
  });

  describe('canToggleEditOffline', () => {
    beforeEach(() => {
      context.profile = {} as any;
    });

    it('should return false when no file is selected', () => {
      context.selection.file = null;
      expect(app.canToggleEditOffline(context)).toBeFalse();
    });

    it('should return false when user is in trashcan', () => {
      context.selection.file = {} as any;
      context.navigation.url = '/trashcan/test';
      expect(app.canToggleEditOffline(context)).toBeFalse();
    });

    it('should return false when user cannot lock or unlock files', () => {
      context.navigation.url = '/personal-files/test';
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK', 'cm:lockOwner': { id: 'test' } } } } as any;
      context.profile.id = 'test1';
      context.permissions = { check: () => false };
      expect(app.canToggleEditOffline(context)).toBeFalse();
    });

    it('should return true when user can lock file', () => {
      context.navigation.url = '/personal-files/test';
      context.selection.file = {} as any;
      context.permissions = { check: () => true };
      expect(app.canToggleEditOffline(context)).toBeTrue();
    });

    it('should return true when user can unlock file', () => {
      context.navigation.url = '/personal-files/test';
      context.selection.file = { entry: { properties: { 'cm:lockType': 'WRITE_LOCK', 'cm:lockOwner': { id: 'test1' } } } } as any;
      context.profile.id = 'test1';
      expect(app.canToggleEditOffline(context)).toBeTrue();
    });
  });

  describe('canInfoPreview', () => {
    it('should return false when user is not is search results page', () => {
      context.navigation.url = '/trashcan/test';
      expect(app.canInfoPreview(context)).toBeFalse();
    });

    it('should return false when multiple nodes are selected', () => {
      context.navigation.url = '/search/test';
      context.selection.isEmpty = false;
      context.selection.count = 5;
      expect(app.canInfoPreview(context)).toBeFalse();
    });

    it('should return false when folder is selected', () => {
      context.navigation.url = '/search/test';
      context.selection.isEmpty = false;
      context.selection.count = 1;
      context.selection.folder = {} as any;
      expect(app.canInfoPreview(context)).toBeFalse();
    });

    it('should return false when user is in preview', () => {
      context.navigation.url = '/preview/test';
      context.selection.isEmpty = false;
      context.selection.count = 1;
      context.selection.folder = null;
      expect(app.canInfoPreview(context)).toBeFalse();
    });

    it('should return true when user is in search results page and single file is selected', () => {
      context.navigation.url = '/search/test';
      context.selection.isEmpty = false;
      context.selection.count = 1;
      context.selection.folder = null;
      context.selection.file = {} as any;
      expect(app.canInfoPreview(context)).toBeTrue();
    });
  });

  describe('isSmartFolder', () => {
    it('should return false when there is no selection', () => {
      context.selection.isEmpty = true;
      expect(app.isSmartFolder(context)).toBeFalse();
    });

    it('should return false when selected node is not folder', () => {
      context.selection.isEmpty = false;
      context.selection.first = { entry: { isFolder: false } } as any;
      expect(app.isSmartFolder(context)).toBeFalse();
    });

    it('should return false when selected folder does not have smart folder aspect', () => {
      context.selection.isEmpty = false;
      context.selection.first = { entry: { isFolder: true, aspectNames: ['test'] } } as any;
      expect(app.isSmartFolder(context)).toBeFalse();
    });

    it('should return true when selected folder contains one of smart folder aspects', () => {
      context.selection.isEmpty = false;
      context.selection.first = { entry: { isFolder: true, aspectNames: ['smf:customConfigSmartFolder'] } } as any;
      expect(app.isSmartFolder(context)).toBeTrue();

      context.selection.first = { entry: { isFolder: true, aspectNames: ['smf:systemConfigSmartFolder'] } } as any;
      expect(app.isSmartFolder(context)).toBeTrue();
    });
  });
});

function createTestContext(): TestRuleContext {
  const context = new TestRuleContext();
  context.repository = {
    version: {
      major: 10
    },
    edition: '',
    status: undefined
  } as unknown as RepositoryInfo;

  context.permissions = {
    check() {
      return true;
    }
  };
  context.selection.isEmpty = false;
  return context;
}
