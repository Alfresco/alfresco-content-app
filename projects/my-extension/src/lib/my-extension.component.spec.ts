import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExtensionComponent } from './my-extension.component';

describe('MyExtensionComponent', () => {
  let component: MyExtensionComponent;
  let fixture: ComponentFixture<MyExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyExtensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
