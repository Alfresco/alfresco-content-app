import { LoginPage, BrowsingPage, FILES, RepoClient, Utils, UploadNewVersionDialog } from '@alfresco/aca-testing-shared';
import { VersionManagePage } from '../../../projects/aca-testing-shared/src/components/version-manage/version-manager';
import { Viewer } from '../../../projects/aca-testing-shared/src/components';

describe('Version component actions', () => {
  const versionManagePage = new VersionManagePage();
  const viewerPage = new Viewer();

  const username = `user-${Utils.random()}`;

  let fileId: string;

  const filesToUpload = [FILES.pdfFile, FILES.docxFile, FILES.xlsxFile, FILES.jpgFile, FILES.docxFile2, FILES.xlsxFile2];

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const uploadNewVersionDialog = new UploadNewVersionDialog();
  const { searchInput } = page.header;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    fileId = (await apis.user.upload.uploadFile(filesToUpload[0])).entry.id;
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(fileId);
    done();
  });

  describe('on Personal Files', () => {
    beforeAll(async (done) => {
      await apis.user.shared.shareFilesByIds([fileId]);
      await loginPage.loginWith(username);
      await page.clickPersonalFilesAndWait();

      for (let i = 0; i < filesToUpload.length - 1; i++) {
        await dataTable.selectItem(filesToUpload[i]);
        await toolbar.clickMoreActionsUploadNewVersion();
        await Utils.uploadFileNewVersion(filesToUpload[i + 1]);

        await page.waitForDialog();

        await uploadNewVersionDialog.majorOption.click();
        await uploadNewVersionDialog.enterDescription('new major version description');
        await uploadNewVersionDialog.uploadButton.click();
        await uploadNewVersionDialog.waitForDialogToClose();
      }
      done();
    });

    it('[C586766] Should be possible to view a previous document version', async () => {
      await dataTable.selectItem(filesToUpload[5]);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('1.0');
      await viewerPage.expectUrlToContain('1.0');
    });

    it('[C586767] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[0]);
    });

    it('[C586768] Should be possible to download a previous document version', async () => {
      await viewerPage.clickDownloadButton();

      expect(await Utils.fileExistsOnOS(filesToUpload[0])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Shared Files', () => {
    beforeAll(async (done) => {
      await loginPage.loginWith(username);
      await page.clickSharedFilesAndWait();
      done();
    });

    it('[C586776] Should be possible to view a previous document version', async () => {
      await dataTable.selectItem(filesToUpload[5]);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('2.0');
      await viewerPage.expectUrlToContain('2.0');
    });

    it('[C586777] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[1]);
    });

    it('[C586778] Should be possible to download a previous document version', async () => {
      await viewerPage.clickDownloadButton();

      expect(await Utils.fileExistsOnOS(filesToUpload[1])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Recent Files', () => {
    beforeAll(async (done) => {
      await loginPage.loginWith(username);
      await page.clickRecentFilesAndWait();
      done();
    });

    it('[C586769] Should be possible to view a previous document version', async () => {
      await dataTable.selectItem(filesToUpload[5]);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('3.0');
      await viewerPage.expectUrlToContain('3.0');
    });

    it('[C586770] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[2]);
    });

    it('[C586771] Should be possible to download a previous document version', async () => {
      await viewerPage.clickDownloadButton();

      expect(await Utils.fileExistsOnOS(filesToUpload[2])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Favorite Files', () => {
    beforeAll(async (done) => {
      await apis.user.favorites.addFavoritesByIds('file', [fileId]);
      await apis.user.favorites.waitForApi({ expect: 1 });
      await loginPage.loginWith(username);
      await page.clickFavoritesAndWait();
      done();
    });

    it('[C586772] Should be possible to view a previous document version', async () => {
      await dataTable.selectItem(filesToUpload[5]);
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('4.0');
      await viewerPage.expectUrlToContain('4.0');
    });

    it('[C586773] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[3]);
    });

    it('[C586774] Should be possible to download a previous document version', async () => {
      await viewerPage.clickDownloadButton();

      expect(await Utils.fileExistsOnOS(filesToUpload[3])).toBe(true, 'File not found in download location');
    });
  });

  describe('on Search Results', () => {
    beforeAll(async (done) => {
      await loginPage.loginWith(username);
      done();
    });

    it('[C586779] Should be possible to view a previous document version', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(filesToUpload[5]);
      await dataTable.waitForBody();
      await dataTable.selectItem(filesToUpload[5], 'Personal Files');
      await toolbar.clickMoreActionsManageVersions();
      await versionManagePage.viewFileVersion('5.0');
      await viewerPage.expectUrlToContain('5.0');
    });

    it('[C586780] Previous document version title should be the same in Preview mode as the Uploaded File', async () => {
      expect(await viewerPage.getFileTitle()).toContain(filesToUpload[4]);
    });

    it('[C586781] Should be possible to download a previous document version', async () => {
      await viewerPage.clickDownloadButton();

      expect(await Utils.fileExistsOnOS(filesToUpload[4])).toBe(true, 'File not found in download location');
    });
  });
});
