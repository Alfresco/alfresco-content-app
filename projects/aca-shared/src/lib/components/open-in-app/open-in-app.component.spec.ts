import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { OpenInAppComponent } from './open-in-app.component';

describe('OpenInAppComponent', () => {
  let fixture: ComponentFixture<OpenInAppComponent>;
  let component: OpenInAppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenInAppComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: { redirectUrl: 'mockRedirectUrl' } }]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenInAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should redirect to app when click on `Open in App` button` ', async () => {
    let currentLocation: any;
    const windowStub = {
      location: {
        set href(value) {
          currentLocation = value;
        }
      }
    } as Window & typeof globalThis;
    component.window = windowStub;
    const saveButton = fixture.debugElement.query(By.css('[data-automation-id="open-in-app-button"]')).nativeElement;
    saveButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(currentLocation).toBe('mockRedirectUrl');
  });
});
