import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcaSharedComponent } from './aca-shared.component';

describe('AcaSharedComponent', () => {
  let component: AcaSharedComponent;
  let fixture: ComponentFixture<AcaSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcaSharedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcaSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
