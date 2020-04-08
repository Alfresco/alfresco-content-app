/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Injectable } from '@angular/core';
import * as i0 from '@angular/core';
export class DownloadService {
  constructor() {
    this.saveData = /**
     * @return {?}
     */
    (function() {
      /** @type {?} */
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      return (
        /**
         * @param {?} fileData
         * @param {?} format
         * @param {?} fileName
         * @return {?}
         */
        function(fileData, format, fileName) {
          /** @type {?} */
          let blob = null;
          if (format === 'blob' || format === 'data') {
            blob = new Blob([fileData], { type: 'octet/stream' });
          }
          if (format === 'object' || format === 'json') {
            /** @type {?} */
            const json = JSON.stringify(fileData);
            blob = new Blob([json], { type: 'octet/stream' });
          }
          if (blob) {
            if (
              typeof window.navigator !== 'undefined' &&
              window.navigator.msSaveOrOpenBlob
            ) {
              navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              /** @type {?} */
              const url = window.URL.createObjectURL(blob);
              a.href = url;
              a.download = fileName;
              a.click();
              window.URL.revokeObjectURL(url);
            }
          }
        }
      );
    })();
  }
  /**
   * Invokes content download for a Blob with a file name.
   * @param {?} blob Content to download.
   * @param {?} fileName Name of the resulting file.
   * @return {?}
   */
  downloadBlob(blob, fileName) {
    this.saveData(blob, 'blob', fileName);
  }
  /**
   * Invokes content download for a data array with a file name.
   * @param {?} data Data to download.
   * @param {?} fileName Name of the resulting file.
   * @return {?}
   */
  downloadData(data, fileName) {
    this.saveData(data, 'data', fileName);
  }
  /**
   * Invokes content download for a JSON object with a file name.
   * @param {?} json JSON object to download.
   * @param {?} fileName Name of the resulting file.
   * @return {?}
   */
  downloadJSON(json, fileName) {
    this.saveData(json, 'json', fileName);
  }
  /**
   * Invokes the download of the file by its URL address.
   * @param {?} url Url address pointing to the file.
   * @param {?} fileName Name of the file download.
   * @return {?}
   */
  downloadUrl(url, fileName) {
    if (url && fileName) {
      /** @type {?} */
      const link = document.createElement('a');
      link.style.display = 'none';
      link.download = fileName;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
DownloadService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */
DownloadService.ctorParameters = () => [];
/** @nocollapse */ DownloadService.ngInjectableDef = i0.defineInjectable({
  factory: function DownloadService_Factory() {
    return new DownloadService();
  },
  token: DownloadService,
  providedIn: 'root'
});
if (false) {
  /**
   * @type {?}
   * @private
   */
  DownloadService.prototype.saveData;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInNlcnZpY2VzL2Rvd25sb2FkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFLM0MsTUFBTSxPQUFPLGVBQWU7SUFHeEI7UUFDSSxJQUFJLENBQUMsUUFBUSxHQUFHOzs7UUFBQzs7a0JBQ1AsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO1lBQ3JDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUV6Qjs7Ozs7O1lBQU8sVUFBUyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVE7O29CQUNsQyxJQUFJLEdBQUcsSUFBSTtnQkFFZixJQUFJLE1BQU0sS0FBSyxNQUFNLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTtvQkFDeEMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztpQkFDekQ7Z0JBRUQsSUFBSSxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7OzBCQUNwQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7b0JBQ3JDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7aUJBQ3JEO2dCQUVELElBQUksSUFBSSxFQUFFO29CQUNOLElBQ0ksT0FBTyxNQUFNLENBQUMsU0FBUyxLQUFLLFdBQVc7d0JBQ3ZDLE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQ25DO3dCQUNFLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQzlDO3lCQUFNOzs4QkFDRyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO3dCQUM1QyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQzt3QkFDYixDQUFDLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzt3QkFDdEIsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUVWLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUNuQztpQkFDSjtZQUNMLENBQUMsRUFBQztRQUNOLENBQUMsRUFBQyxFQUFFLENBQUM7SUFDVCxDQUFDOzs7Ozs7O0lBT0QsWUFBWSxDQUFDLElBQVUsRUFBRSxRQUFnQjtRQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDMUMsQ0FBQzs7Ozs7OztJQU9ELFlBQVksQ0FBQyxJQUFTLEVBQUUsUUFBZ0I7UUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Ozs7Ozs7SUFPRCxZQUFZLENBQUMsSUFBUyxFQUFFLFFBQWdCO1FBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMxQyxDQUFDOzs7Ozs7O0lBT0QsV0FBVyxDQUFDLEdBQVcsRUFBRSxRQUFnQjtRQUNyQyxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUU7O2tCQUNYLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztZQUV4QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7WUFFaEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbkM7SUFDTCxDQUFDOzs7WUF2RkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7Ozs7Ozs7O0lBRUcsbUNBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIERvd25sb2FkU2VydmljZSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBzYXZlRGF0YTogRnVuY3Rpb247XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zYXZlRGF0YSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgICAgICAgICAgYS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZmlsZURhdGEsIGZvcm1hdCwgZmlsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmxvYiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnYmxvYicgfHwgZm9ybWF0ID09PSAnZGF0YScpIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvYiA9IG5ldyBCbG9iKFtmaWxlRGF0YV0sIHsgdHlwZTogJ29jdGV0L3N0cmVhbScgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ29iamVjdCcgfHwgZm9ybWF0ID09PSAnanNvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KGZpbGVEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvYiA9IG5ldyBCbG9iKFtqc29uXSwgeyB0eXBlOiAnb2N0ZXQvc3RyZWFtJyB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYmxvYikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygd2luZG93Lm5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlT3JPcGVuQmxvYlxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5tc1NhdmVPck9wZW5CbG9iKGJsb2IsIGZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5ocmVmID0gdXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5kb3dubG9hZCA9IGZpbGVOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5jbGljaygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIGNvbnRlbnQgZG93bmxvYWQgZm9yIGEgQmxvYiB3aXRoIGEgZmlsZSBuYW1lLlxuICAgICAqIEBwYXJhbSBibG9iIENvbnRlbnQgdG8gZG93bmxvYWQuXG4gICAgICogQHBhcmFtIGZpbGVOYW1lIE5hbWUgb2YgdGhlIHJlc3VsdGluZyBmaWxlLlxuICAgICAqL1xuICAgIGRvd25sb2FkQmxvYihibG9iOiBCbG9iLCBmaWxlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2F2ZURhdGEoYmxvYiwgJ2Jsb2InLCBmaWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyBjb250ZW50IGRvd25sb2FkIGZvciBhIGRhdGEgYXJyYXkgd2l0aCBhIGZpbGUgbmFtZS5cbiAgICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIGRvd25sb2FkLlxuICAgICAqIEBwYXJhbSBmaWxlTmFtZSBOYW1lIG9mIHRoZSByZXN1bHRpbmcgZmlsZS5cbiAgICAgKi9cbiAgICBkb3dubG9hZERhdGEoZGF0YTogYW55LCBmaWxlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2F2ZURhdGEoZGF0YSwgJ2RhdGEnLCBmaWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyBjb250ZW50IGRvd25sb2FkIGZvciBhIEpTT04gb2JqZWN0IHdpdGggYSBmaWxlIG5hbWUuXG4gICAgICogQHBhcmFtIGpzb24gSlNPTiBvYmplY3QgdG8gZG93bmxvYWQuXG4gICAgICogQHBhcmFtIGZpbGVOYW1lIE5hbWUgb2YgdGhlIHJlc3VsdGluZyBmaWxlLlxuICAgICAqL1xuICAgIGRvd25sb2FkSlNPTihqc29uOiBhbnksIGZpbGVOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zYXZlRGF0YShqc29uLCAnanNvbicsIGZpbGVOYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIHRoZSBkb3dubG9hZCBvZiB0aGUgZmlsZSBieSBpdHMgVVJMIGFkZHJlc3MuXG4gICAgICogQHBhcmFtIHVybCBVcmwgYWRkcmVzcyBwb2ludGluZyB0byB0aGUgZmlsZS5cbiAgICAgKiBAcGFyYW0gZmlsZU5hbWUgTmFtZSBvZiB0aGUgZmlsZSBkb3dubG9hZC5cbiAgICAgKi9cbiAgICBkb3dubG9hZFVybCh1cmw6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAodXJsICYmIGZpbGVOYW1lKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gICAgICAgICAgICBsaW5rLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWU7XG4gICAgICAgICAgICBsaW5rLmhyZWYgPSB1cmw7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
