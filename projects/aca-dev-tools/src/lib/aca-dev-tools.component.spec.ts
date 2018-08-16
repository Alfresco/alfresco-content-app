import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcaDevToolsComponent } from './aca-dev-tools.component';

describe('AcaDevToolsComponent', () => {
  let component: AcaDevToolsComponent;
  let fixture: ComponentFixture<AcaDevToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcaDevToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcaDevToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
