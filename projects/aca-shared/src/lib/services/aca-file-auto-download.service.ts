import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '@alfresco/adf-core';
import { NodeEntry } from '@alfresco/js-api';
import { FileAutoDownloadComponent } from '@alfresco/adf-content-services';

const BYTES_TO_MB_CONVERSION_VALUE = 1048576;

@Injectable({
  providedIn: 'root'
})
export class AcaFileAutoDownloadService {
  constructor(private dialog: MatDialog, private appConfig: AppConfigService) {}

  public shouldFileAutoDownload(fileSizeInBytes: number): boolean {
    const sizeInMB = fileSizeInBytes / BYTES_TO_MB_CONVERSION_VALUE;

    const fileAutoDownloadFlag: boolean = this.appConfig.get('viewer.enableFileAutoDownload', true);
    const sizeThreshold: number = this.appConfig.get('viewer.fileAutoDownloadSizeThresholdInMB', 15);

    return fileAutoDownloadFlag && sizeInMB && sizeInMB > sizeThreshold;
  }

  public autoDownloadFile(node: NodeEntry) {
    this.dialog.open(FileAutoDownloadComponent, { disableClose: true, data: node });
  }
}
