/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ContentActionRef, ContentActionType } from '@alfresco/adf-extensions';
import { Observable, of } from 'rxjs';

export const ACTION_TITLE = 'ACTION_TITLE';
export const ACTION_CLICK = 'ACTION_CLICK';

export const getContentActionRef = (): Observable<ContentActionRef[]> => {
    return of([{
        id: 'id',
        type: ContentActionType.button,
        title: ACTION_TITLE,
        actions: {
            click: ACTION_CLICK
        }
    }]);
}
