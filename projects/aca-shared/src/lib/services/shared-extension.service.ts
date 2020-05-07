import { Injectable } from '@angular/core';
import { AppStore, getRuleContext } from '@alfresco/aca-shared/store';
import {
  ContentActionRef,
  ExtensionService,
  SelectionState,
  SidebarTabRef
} from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { SettingsGroupRef } from '../../../../../src/app/types';

@Injectable({
  providedIn: 'root'
})
export class SharedExtensionService {
  selection: SelectionState;
  sidebar: Array<SidebarTabRef> = [];

  constructor(
    protected store: Store<AppStore>,
    protected extensions: ExtensionService
  ) {
    this.store.select(getRuleContext).subscribe(result => {
      this.selection = result.selection;
    });
  }

  getSidebarTabs(): Array<SidebarTabRef> {
    return this.sidebar.filter(action => this.filterVisible(action));
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

  filterVisible(
    action: ContentActionRef | SettingsGroupRef | SidebarTabRef
  ): boolean {
    if (action && action.rules && action.rules.visible) {
      return this.extensions.evaluateRule(action.rules.visible, this);
    }
    return true;
  }
}
