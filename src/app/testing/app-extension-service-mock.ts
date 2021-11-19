import { ContentActionRef } from '@alfresco/adf-extensions';
import { Observable } from 'rxjs';
import { getContentActionRef } from './content-action-ref';

/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */
export class AppExtensionServiceMock {
    getMainAction(): Observable<ContentActionRef> {
        return getContentActionRef();
    }

    runActionById(_id: string) {}
}