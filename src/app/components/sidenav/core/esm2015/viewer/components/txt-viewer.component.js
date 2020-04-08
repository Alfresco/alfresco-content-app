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
import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AppConfigService } from './../../app-config/app-config.service';
export class TxtViewerComponent {
  /**
   * @param {?} http
   * @param {?} appConfigService
   */
  constructor(http, appConfigService) {
    this.http = http;
    this.appConfigService = appConfigService;
  }
  /**
   * @param {?} changes
   * @return {?}
   */
  ngOnChanges(changes) {
    /** @type {?} */
    const blobFile = changes['blobFile'];
    if (blobFile && blobFile.currentValue) {
      return this.readBlob(blobFile.currentValue);
    }
    /** @type {?} */
    const urlFile = changes['urlFile'];
    if (urlFile && urlFile.currentValue) {
      return this.getUrlContent(urlFile.currentValue);
    }
    if (!this.urlFile && !this.blobFile) {
      throw new Error('Attribute urlFile or blobFile is required');
    }
    return Promise.resolve();
  }
  /**
   * @private
   * @param {?} url
   * @return {?}
   */
  getUrlContent(url) {
    /** @type {?} */
    const withCredentialsMode = this.appConfigService.get(
      'auth.withCredentials',
      false
    );
    return new Promise
    /**
     * @param {?} resolve
     * @param {?} reject
     * @return {?}
     */((resolve, reject) => {
      this.http
        .get(url, {
          responseType: 'text',
          withCredentials: withCredentialsMode
        })
        .subscribe(
          /**
           * @param {?} res
           * @return {?}
           */
          res => {
            this.content = res;
            resolve();
          }
          /**
           * @param {?} event
           * @return {?}
           */,
          event => {
            reject(event);
          }
        );
    });
  }
  /**
   * @private
   * @param {?} blob
   * @return {?}
   */
  readBlob(blob) {
    return new Promise
    /**
     * @param {?} resolve
     * @param {?} reject
     * @return {?}
     */((resolve, reject) => {
      /** @type {?} */
      const reader = new FileReader();
      reader.onload
      /**
       * @return {?}
       */ = () => {
        this.content = reader.result;
        resolve();
      };
      reader.onerror
      /**
       * @param {?} error
       * @return {?}
       */ = error => {
        reject(error);
      };
      reader.readAsText(blob);
    });
  }
}
TxtViewerComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-txt-viewer',
        template:
          '<pre class="adf-txt-viewer-content">\n    {{content}}\n</pre>\n',
        host: { class: 'adf-txt-viewer' },
        encapsulation: ViewEncapsulation.None,
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
TxtViewerComponent.ctorParameters = () => [
  { type: HttpClient },
  { type: AppConfigService }
];
TxtViewerComponent.propDecorators = {
  urlFile: [{ type: Input }],
  blobFile: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  TxtViewerComponent.prototype.urlFile;
  /** @type {?} */
  TxtViewerComponent.prototype.blobFile;
  /** @type {?} */
  TxtViewerComponent.prototype.content;
  /**
   * @type {?}
   * @private
   */
  TxtViewerComponent.prototype.http;
  /**
   * @type {?}
   * @private
   */
  TxtViewerComponent.prototype.appConfigService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHh0LXZpZXdlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJ2aWV3ZXIvY29tcG9uZW50cy90eHQtdmlld2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQWEsaUJBQWlCLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBU3pFLE1BQU0sT0FBTyxrQkFBa0I7Ozs7O0lBVTNCLFlBQW9CLElBQWdCLEVBQVUsZ0JBQWtDO1FBQTVELFNBQUksR0FBSixJQUFJLENBQVk7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO0lBQ2hGLENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLE9BQXNCOztjQUV4QixRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUNwQyxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsWUFBWSxFQUFFO1lBQ25DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDL0M7O2NBRUssT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDbEMsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRTtZQUNqQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ25EO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztTQUNoRTtRQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Ozs7OztJQUVPLGFBQWEsQ0FBQyxHQUFXOztjQUN2QixtQkFBbUIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFVLHNCQUFzQixFQUFFLEtBQUssQ0FBQztRQUU3RixPQUFPLElBQUksT0FBTzs7Ozs7UUFBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxDQUFDLENBQUMsU0FBUzs7OztZQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2pHLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO2dCQUNuQixPQUFPLEVBQUUsQ0FBQztZQUNkLENBQUM7Ozs7WUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsQixDQUFDLEVBQUMsQ0FBQztRQUNQLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7O0lBRU8sUUFBUSxDQUFDLElBQVU7UUFDdkIsT0FBTyxJQUFJLE9BQU87Ozs7O1FBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7O2tCQUM3QixNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7WUFFL0IsTUFBTSxDQUFDLE1BQU07OztZQUFHLEdBQUcsRUFBRTtnQkFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQztZQUNkLENBQUMsQ0FBQSxDQUFDO1lBRUYsTUFBTSxDQUFDLE9BQU87Ozs7WUFBRyxDQUFDLEtBQVUsRUFBRSxFQUFFO2dCQUM1QixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEIsQ0FBQyxDQUFBLENBQUM7WUFFRixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7O1lBbkVKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQiw2RUFBMEM7Z0JBRTFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRTtnQkFDbkMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3hDOzs7O1lBVlEsVUFBVTtZQUVWLGdCQUFnQjs7O3NCQVdwQixLQUFLO3VCQUdMLEtBQUs7Ozs7SUFITixxQ0FDYTs7SUFFYixzQ0FDZTs7SUFFZixxQ0FBOEI7Ozs7O0lBRWxCLGtDQUF3Qjs7Ozs7SUFBRSw4Q0FBMEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBWaWV3RW5jYXBzdWxhdGlvbiwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXBwQ29uZmlnU2VydmljZSB9IGZyb20gJy4vLi4vLi4vYXBwLWNvbmZpZy9hcHAtY29uZmlnLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FkZi10eHQtdmlld2VyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdHh0LXZpZXdlci5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vdHh0LXZpZXdlci5jb21wb25lbnQuc2NzcyddLFxuICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ2FkZi10eHQtdmlld2VyJyB9LFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgVHh0Vmlld2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblxuICAgIEBJbnB1dCgpXG4gICAgdXJsRmlsZTogYW55O1xuXG4gICAgQElucHV0KClcbiAgICBibG9iRmlsZTogQmxvYjtcblxuICAgIGNvbnRlbnQ6IHN0cmluZyB8IEFycmF5QnVmZmVyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIGFwcENvbmZpZ1NlcnZpY2U6IEFwcENvbmZpZ1NlcnZpY2UpIHtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogUHJvbWlzZTxhbnk+IHtcblxuICAgICAgICBjb25zdCBibG9iRmlsZSA9IGNoYW5nZXNbJ2Jsb2JGaWxlJ107XG4gICAgICAgIGlmIChibG9iRmlsZSAmJiBibG9iRmlsZS5jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWRCbG9iKGJsb2JGaWxlLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmxGaWxlID0gY2hhbmdlc1sndXJsRmlsZSddO1xuICAgICAgICBpZiAodXJsRmlsZSAmJiB1cmxGaWxlLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VXJsQ29udGVudCh1cmxGaWxlLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudXJsRmlsZSAmJiAhdGhpcy5ibG9iRmlsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgdXJsRmlsZSBvciBibG9iRmlsZSBpcyByZXF1aXJlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VXJsQ29udGVudCh1cmw6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IHdpdGhDcmVkZW50aWFsc01vZGUgPSB0aGlzLmFwcENvbmZpZ1NlcnZpY2UuZ2V0PGJvb2xlYW4+KCdhdXRoLndpdGhDcmVkZW50aWFscycsIGZhbHNlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5odHRwLmdldCh1cmwsIHsgcmVzcG9uc2VUeXBlOiAndGV4dCcsIHdpdGhDcmVkZW50aWFsczogd2l0aENyZWRlbnRpYWxzTW9kZSB9KS5zdWJzY3JpYmUoKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHJlcztcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9LCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVhZEJsb2IoYmxvYjogQmxvYik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHJlYWRlci5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19
