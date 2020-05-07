import { Injectable } from '@angular/core';
import { AppStore, getRuleContext } from '@alfresco/aca-shared/store';
import { ExtensionService, SelectionState } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class SharedExtensionService {
  selection: SelectionState;

  constructor(
    protected store: Store<AppStore>,
    protected extensions: ExtensionService
  ) {
    this.store.select(getRuleContext).subscribe(result => {
      this.selection = result.selection;
    });
  }

  runActionById(id: string) {
    const action = this.extensions.getActionById(id);
    if (action) {
      const { type, payload } = action;
      const context = {
        selection: this.selection
      };
      const expression = this.extensions.runExpression(payload, context);

      this.store.dispatch({ type, payload: expression });
    } else {
      this.store.dispatch({ type: id });
    }
  }
}
