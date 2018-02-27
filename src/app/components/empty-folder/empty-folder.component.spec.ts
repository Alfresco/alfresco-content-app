import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyFolderComponent } from './empty-folder.component';

describe('EmptyFolderComponent', () => {
  let component: EmptyFolderComponent;
  let fixture: ComponentFixture<EmptyFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
