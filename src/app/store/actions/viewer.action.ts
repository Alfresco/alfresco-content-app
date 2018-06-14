import { Action } from '@ngrx/store';
import { NodeInfo } from './node.action';

export const VIEW_NODE = 'VIEW_NODE';

export class ViewNodeAction implements Action {
    readonly type = VIEW_NODE;
    constructor(public payload: NodeInfo) {}
}
