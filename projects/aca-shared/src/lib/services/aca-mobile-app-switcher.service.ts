import { AppConfigService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AcaMobileAppSwitcherService {
  constructor(private config: AppConfigService) {}

  checkForMobileApp() {
    const mobileAppSwitchConfig: any = this.config.get<any>('mobileAppSwitch', {});
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.indexOf('android') > -1;
    const isIphone = ua.indexOf('iphone') > -1;
    if (isIphone === true) {
      const url = window.location.href;
      const app = {
        launchApp: () => {
          window.location.href = mobileAppSwitchConfig.isIphone + url;
        },
        openWebApp: () => {
          window.location.href = mobileAppSwitchConfig.appleStore;
        }
      };
      app.launchApp();
    } else if (isAndroid === true) {
      const url = window.location.href;
      const app = {
        launchApp: () => {
          setTimeout(() => {
            window.location.href = mobileAppSwitchConfig.isAndroidPart1 + url + mobileAppSwitchConfig.isAndroidPart2;
          }, 500);
        },
        openWebApp: () => {
          window.location.href = mobileAppSwitchConfig.googlePlayStore;
        }
      };
      app.launchApp();
    } else {
      //navigate to website url
    }
  }
}
