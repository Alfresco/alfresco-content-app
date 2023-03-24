import { TestBed } from '@angular/core/testing';
import { AppStore, SharedStoreModule, UpdateLibraryAction } from '@alfresco/aca-shared/store';
import { EffectsModule } from '@ngrx/effects';
import { LibraryEffects } from './library.effects';
import { Store } from '@ngrx/store';
import { SiteBodyCreate, TagBody } from '@alfresco/js-api';
import { ContentManagementService } from '../../services/content-management.service';
import { of } from 'rxjs';
import { SelectionState } from '@alfresco/adf-extensions';
import { AppTestingModule } from '../../testing/app-testing.module';

describe('LibraryEffects', () => {
  let store: Store<AppStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SharedStoreModule, EffectsModule.forRoot([LibraryEffects])]
    });
    store = TestBed.inject(Store);
  });

  describe('updateLibrary$', () => {
    it('should call updateLibrary on ContentManagementService with correct parameters', () => {
      const selectionState = {
        library: {
          entry: {
            id: 'some id',
            guid: 'some guid'
          }
        }
      } as SelectionState;
      spyOn(store, 'select').and.returnValue(of(selectionState));
      const contentManagementService = TestBed.inject(ContentManagementService);
      spyOn(contentManagementService, 'updateLibrary');
      const site = new SiteBodyCreate();
      site.title = 'some title';
      site.description = 'some description';
      site.visibility = 'PUBLIC';
      const removedTags = ['tag1'];
      const linkedTags = [new TagBody()];

      store.dispatch(new UpdateLibraryAction(site, removedTags, linkedTags));
      expect(contentManagementService.updateLibrary).toHaveBeenCalledWith(
        selectionState.library.entry.id,
        {
          title: site.title,
          description: site.description,
          visibility: site.visibility
        },
        selectionState.library.entry.guid,
        removedTags,
        linkedTags
      );
    });
  });
});
