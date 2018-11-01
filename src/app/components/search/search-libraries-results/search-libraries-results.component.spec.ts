import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLibrariesResultsComponent } from './search-results.component';

describe('SearchComponent', () => {
  let component: SearchLibrariesResultsComponent;
  let fixture: ComponentFixture<SearchLibrariesResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchLibrariesResultsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLibrariesResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
