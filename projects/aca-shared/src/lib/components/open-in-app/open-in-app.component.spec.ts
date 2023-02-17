import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { OpenInAppComponent } from './open-in-app.component';

describe('OpenInAppComponent', () => {
  let fixture: ComponentFixture<OpenInAppComponent>;
  let component: OpenInAppComponent;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
    open: jasmine.createSpy('open')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenInAppComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { redirectUrl: 'mockRedirectUrl' } },
        { provide: MatDialog, useValue: mockDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenInAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should redirect to app when click on `Open in App` button` ', async () => {
    let currentLocation: string | string[];
    const windowStub: Window & typeof globalThis = {
      location: {
        set href(value: string | string[]) {
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

  it('should set the value `mobile_notification_expires_in` in session storage on dialog close', async () => {
    component.onCloseDialog();
    expect(sessionStorage.getItem('mobile_notification_expires_in')).not.toBe(null);
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
