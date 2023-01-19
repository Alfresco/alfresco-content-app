/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { MinimalNodeEntity, MinimalNodeEntryEntity } from '@alfresco/js-api';

export abstract class DocumentBasePageService {
  abstract canUpdateNode(node: MinimalNodeEntity): boolean;
  abstract canUploadContent(node: MinimalNodeEntryEntity): boolean;
}
