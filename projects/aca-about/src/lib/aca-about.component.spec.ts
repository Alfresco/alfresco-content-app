import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcaAboutComponent } from './aca-about.component';

describe('AcaAboutComponent', () => {
  let component: AcaAboutComponent;
  let fixture: ComponentFixture<AcaAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcaAboutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcaAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
