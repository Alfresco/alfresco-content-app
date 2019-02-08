import { Action } from '@ngrx/store';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';

export const AOS_ACTION = 'AOS_ACTION';

export class AosAction implements Action {
  readonly type = AOS_ACTION;
  constructor(public payload: MinimalNodeEntryEntity) {}
}
