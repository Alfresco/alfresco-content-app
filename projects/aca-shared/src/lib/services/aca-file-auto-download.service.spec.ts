import { TestBed } from '@angular/core/testing';
import { AcaFileAutoDownloadService, initialState, LibTestingModule } from '@alfresco/aca-shared';
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '@alfresco/adf-core';
import { FileAutoDownloadComponent } from '@alfresco/adf-content-services';
import { provideMockStore } from '@ngrx/store/testing';

describe('AcaFileAutoDownloadService', () => {
  let service: AcaFileAutoDownloadService;
  let appConfig: AppConfigService;

  const mockDialogRef = {
    open: jasmine.createSpy('open')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule],
      providers: [provideMockStore({ initialState }), { provide: MatDialog, useValue: mockDialogRef }]
    });

    service = TestBed.inject(AcaFileAutoDownloadService);
    appConfig = TestBed.inject(AppConfigService);
  });

  it('shouldFileAutoDownload should return true if fileSize exceeds configured threshold and file auto download is enabled', () => {
    appConfig.config.viewer = {
      enableFileAutoDownload: true,
      fileAutoDownloadSizeThresholdInMB: 10
    };
    const shouldAutDownloadFlag = service.shouldFileAutoDownload(11000000);
    expect(shouldAutDownloadFlag).toBe(true);
  });

  it('shouldFileAutoDownload should return false if fileSize does not exceeds configured threshold and file auto download is enabled', () => {
    appConfig.config.viewer = {
      enableFileAutoDownload: true,
      fileAutoDownloadSizeThresholdInMB: 10
    };
    const shouldAutDownloadFlag = service.shouldFileAutoDownload(500000);
    expect(shouldAutDownloadFlag).toBe(false);
  });

  it('shouldFileAutoDownload should return false if fileSize exceeds configured threshold but file auto download is disabled', () => {
    appConfig.config.viewer = {
      enableFileAutoDownload: false,
      fileAutoDownloadSizeThresholdInMB: 10
    };
    const shouldAutDownloadFlag = service.shouldFileAutoDownload(11000000);
    expect(shouldAutDownloadFlag).toBe(false);
  });

  it('autoDownloadFile should open FileAutoDownload dialog when called', () => {
    const nodeEntity: any = { entry: { isFile: true } };
    service.autoDownloadFile(nodeEntity);
    expect(mockDialogRef.open).toHaveBeenCalledWith(FileAutoDownloadComponent, { disableClose: true, data: nodeEntity });
  });
});
