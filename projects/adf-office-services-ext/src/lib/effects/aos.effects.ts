import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { AOS_ACTION, AosAction } from '../actions/aos.actions';
import { AosEditOnlineService } from '../aos-extension.service';

@Injectable()
export class AosEffects {
  constructor(
    private actions$: Actions,
    private aosEditOnlineService: AosEditOnlineService
  ) {}

  @Effect({ dispatch: false })
  openOffice$ = this.actions$.pipe(
    ofType<AosAction>(AOS_ACTION),
    map(action => {
      if (action.payload) {
        this.aosEditOnlineService.onActionEditOnlineAos(action.payload);
      }
    })
  );
}
