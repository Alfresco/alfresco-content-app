import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ViewNodeAction, VIEW_NODE } from '../actions/viewer.action';
import { Router } from '@angular/router';

@Injectable()
export class ViewerEffects {
    constructor(private actions$: Actions, private router: Router) {}

    @Effect({ dispatch: false })
    viewNode$ = this.actions$.pipe(
        ofType<ViewNodeAction>(VIEW_NODE),
        map(action => {
            const node = action.payload;
            if (!node) {
                return;
            }

            let previewLocation = this.router.url;
            if (previewLocation.lastIndexOf('/') > 0) {
                previewLocation = previewLocation.substr(
                    0,
                    this.router.url.indexOf('/', 1)
                );
            }
            previewLocation = previewLocation.replace(/\//g, '');

            const path = [previewLocation];
            if (node.parentId) {
                path.push(node.parentId);
            }
            path.push('preview', node.id);
            this.router.navigateByUrl(path.join('/'));
        })
    );
}
