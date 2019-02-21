import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppExtensionService } from '../../extensions/extension.service';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { SharedLinkEntry } from '@alfresco/js-api';
import { SetSelectedNodesAction } from '../../store/actions';
import { flatMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-shared-link-view',
  templateUrl: 'shared-link-view.component.html',
  styleUrls: ['shared-link-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-shared-link-view' }
})
export class SharedLinkViewComponent implements OnInit {
  sharedLinkId: string = null;
  viewerToolbarActions: Array<ContentActionRef> = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppStore>,
    private extensions: AppExtensionService,
    private alfrescoApiService: AlfrescoApiService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        flatMap(params =>
          forkJoin(
            this.alfrescoApiService.sharedLinksApi.getSharedLink(params.id),
            of(params.id)
          )
        )
      )
      .subscribe(([sharedEntry, sharedId]: [SharedLinkEntry, string]) => {
        this.store.dispatch(new SetSelectedNodesAction([<any>sharedEntry]));
        this.sharedLinkId = sharedId;
      });

    this.viewerToolbarActions = this.extensions.getViewerToolbarActions();
  }

  trackByActionId(index: number, action: ContentActionRef) {
    return action.id;
  }
}
