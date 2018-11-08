import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppConfigPipe, DataTableComponent } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchLibrariesResultsComponent } from './search-libraries-results.component';
import { SearchLibrariesQueryBuilderService } from './search-libraries-query-builder.service';
import { DocumentListComponent } from '@alfresco/adf-content-services';

describe('SearchLibrariesResultsComponent', () => {
  let component: SearchLibrariesResultsComponent;
  let fixture: ComponentFixture<SearchLibrariesResultsComponent>;

  const emptyPage = { list: { pagination: { totalItems: 0 }, entries: [] } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [
        DataTableComponent,
        DocumentListComponent,
        SearchLibrariesResultsComponent,
        AppConfigPipe
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SearchLibrariesQueryBuilderService]
    });

    fixture = TestBed.createComponent(SearchLibrariesResultsComponent);
    component = fixture.componentInstance;
  });

  it('should show empty page by default', async () => {
    spyOn(component, 'onSearchResultLoaded').and.callThrough();
    fixture.detectChanges();

    expect(component.onSearchResultLoaded).toHaveBeenCalledWith(emptyPage);
  });
});
