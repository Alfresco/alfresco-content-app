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
import { Injectable } from '@angular/core';
import { Observable, forkJoin, throwError, of } from 'rxjs';
import { ComponentTranslationModel } from '../models/component.model';
import { ObjectUtils } from '../utils/object-utils';
import { map, catchError, retry } from 'rxjs/operators';
import * as i0 from '@angular/core';
import * as i1 from '@angular/common/http';
export class TranslateLoaderService {
  /**
   * @param {?} http
   */
  constructor(http) {
    this.http = http;
    this.prefix = 'i18n';
    this.suffix = '.json';
    this.providers = [];
    this.queue = [];
    this.defaultLang = 'en';
  }
  /**
   * @param {?} value
   * @return {?}
   */
  setDefaultLang(value) {
    this.defaultLang = value || 'en';
  }
  /**
   * @param {?} name
   * @param {?} path
   * @return {?}
   */
  registerProvider(name, path) {
    /** @type {?} */
    const registered = this.providers.find(
      /**
       * @param {?} provider
       * @return {?}
       */
      (provider => provider.name === name)
    );
    if (registered) {
      registered.path = path;
    } else {
      this.providers.push(
        new ComponentTranslationModel({ name: name, path: path })
      );
    }
  }
  /**
   * @param {?} name
   * @return {?}
   */
  providerRegistered(name) {
    return this.providers.find(
      /**
       * @param {?} x
       * @return {?}
       */
      x => x.name === name
    )
      ? true
      : false;
  }
  /**
   * @param {?} lang
   * @param {?} component
   * @param {?=} fallbackUrl
   * @return {?}
   */
  fetchLanguageFile(lang, component, fallbackUrl) {
    /** @type {?} */
    const translationUrl =
      fallbackUrl ||
      `${component.path}/${this.prefix}/${lang}${this.suffix}?v=${Date.now()}`;
    return this.http.get(translationUrl).pipe(
      map(
        /**
         * @param {?} res
         * @return {?}
         */
        res => {
          component.json[lang] = res;
        }
      ),
      retry(3),
      catchError(
        /**
         * @return {?}
         */
        () => {
          if (!fallbackUrl && lang.includes('-')) {
            const [langId] = lang.split('-');
            if (langId && langId !== this.defaultLang) {
              /** @type {?} */
              const url = `${component.path}/${this.prefix}/${langId}${
                this.suffix
              }?v=${Date.now()}`;
              return this.fetchLanguageFile(lang, component, url);
            }
          }
          return throwError(`Failed to load ${translationUrl}`);
        }
      )
    );
  }
  /**
   * @param {?} lang
   * @return {?}
   */
  getComponentToFetch(lang) {
    /** @type {?} */
    const observableBatch = [];
    if (!this.queue[lang]) {
      this.queue[lang] = [];
    }
    this.providers.forEach(
      /**
       * @param {?} component
       * @return {?}
       */
      component => {
        if (!this.isComponentInQueue(lang, component.name)) {
          this.queue[lang].push(component.name);
          observableBatch.push(this.fetchLanguageFile(lang, component));
        }
      }
    );
    return observableBatch;
  }
  /**
   * @param {?} lang
   * @return {?}
   */
  init(lang) {
    if (this.queue[lang] === undefined) {
      this.queue[lang] = [];
    }
  }
  /**
   * @param {?} lang
   * @param {?} name
   * @return {?}
   */
  isComponentInQueue(lang, name) {
    return (this.queue[lang] || []).find(
      /**
       * @param {?} x
       * @return {?}
       */
      x => x === name
    )
      ? true
      : false;
  }
  /**
   * @param {?} lang
   * @return {?}
   */
  getFullTranslationJSON(lang) {
    /** @type {?} */
    let result = {};
    this.providers
      .slice(0)
      .sort(
        /**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => {
          if (a.name === 'app') {
            return 1;
          }
          if (b.name === 'app') {
            return -1;
          }
          return a.name.localeCompare(b.name);
        }
      )
      .forEach(
        /**
         * @param {?} model
         * @return {?}
         */
        model => {
          if (model.json && model.json[lang]) {
            result = ObjectUtils.merge(result, model.json[lang]);
          }
        }
      );
    return result;
  }
  /**
   * @param {?} lang
   * @return {?}
   */
  getTranslation(lang) {
    /** @type {?} */
    let hasFailures = false;
    /** @type {?} */
    const batch = [
      ...this.getComponentToFetch(lang).map(
        /**
         * @param {?} observable
         * @return {?}
         */
        (observable => {
          return observable.pipe(
            catchError(
              /**
               * @param {?} error
               * @return {?}
               */
              error => {
                console.warn(error);
                hasFailures = true;
                return of(error);
              }
            )
          );
        })
      )
    ];
    return new Observable
    /**
     * @param {?} observer
     * @return {?}
     */(observer => {
      if (batch.length > 0) {
        forkJoin(batch).subscribe(
          /**
           * @return {?}
           */
          () => {
            /** @type {?} */
            const fullTranslation = this.getFullTranslationJSON(lang);
            if (fullTranslation) {
              observer.next(fullTranslation);
            }
            if (hasFailures) {
              observer.error('Failed to load some resources');
            } else {
              observer.complete();
            }
          }
          /**
           * @return {?}
           */,
          () => {
            observer.error('Failed to load some resources');
          }
        );
      } else {
        /** @type {?} */
        const fullTranslation = this.getFullTranslationJSON(lang);
        if (fullTranslation) {
          observer.next(fullTranslation);
          observer.complete();
        }
      }
    });
  }
}
TranslateLoaderService.decorators = [
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
TranslateLoaderService.ctorParameters = () => [{ type: HttpClient }];
/** @nocollapse */ TranslateLoaderService.ngInjectableDef = i0.defineInjectable(
  {
    factory: function TranslateLoaderService_Factory() {
      return new TranslateLoaderService(i0.inject(i1.HttpClient));
    },
    token: TranslateLoaderService,
    providedIn: 'root'
  }
);
if (false) {
  /**
   * @type {?}
   * @private
   */
  TranslateLoaderService.prototype.prefix;
  /**
   * @type {?}
   * @private
   */
  TranslateLoaderService.prototype.suffix;
  /**
   * @type {?}
   * @private
   */
  TranslateLoaderService.prototype.providers;
  /**
   * @type {?}
   * @private
   */
  TranslateLoaderService.prototype.queue;
  /**
   * @type {?}
   * @private
   */
  TranslateLoaderService.prototype.defaultLang;
  /**
   * @type {?}
   * @private
   */
  TranslateLoaderService.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLWxvYWRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsic2VydmljZXMvdHJhbnNsYXRlLWxvYWRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUFLeEQsTUFBTSxPQUFPLHNCQUFzQjs7OztJQVEvQixZQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBTjVCLFdBQU0sR0FBVyxNQUFNLENBQUM7UUFDeEIsV0FBTSxHQUFXLE9BQU8sQ0FBQztRQUN6QixjQUFTLEdBQWdDLEVBQUUsQ0FBQztRQUM1QyxVQUFLLEdBQWdCLEVBQUUsQ0FBQztRQUN4QixnQkFBVyxHQUFXLElBQUksQ0FBQztJQUduQyxDQUFDOzs7OztJQUVELGNBQWMsQ0FBQyxLQUFhO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQztJQUNyQyxDQUFDOzs7Ozs7SUFFRCxnQkFBZ0IsQ0FBQyxJQUFZLEVBQUUsSUFBWTs7Y0FDakMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSTs7OztRQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxR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c0JBQXNCLENBQUMsSUFBSSxDQUFDO2dCQUN6RCxJQUFJLGVBQWUsRUFBRTtvQkFDakIsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDL0IsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUN2QjthQUNKO1FBQ0wsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7WUFqSkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7O1lBWFEsVUFBVTs7Ozs7Ozs7SUFjZix3Q0FBZ0M7Ozs7O0lBQ2hDLHdDQUFpQzs7Ozs7SUFDakMsMkNBQW9EOzs7OztJQUNwRCx1Q0FBZ0M7Ozs7O0lBQ2hDLDZDQUFtQzs7Ozs7SUFFdkIsc0NBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQgeyBUcmFuc2xhdGVMb2FkZXIgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIGZvcmtKb2luLCB0aHJvd0Vycm9yLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ29tcG9uZW50VHJhbnNsYXRpb25Nb2RlbCB9IGZyb20gJy4uL21vZGVscy9jb21wb25lbnQubW9kZWwnO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMgfSBmcm9tICcuLi91dGlscy9vYmplY3QtdXRpbHMnO1xuaW1wb3J0IHsgbWFwLCBjYXRjaEVycm9yLCByZXRyeSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGVMb2FkZXJTZXJ2aWNlIGltcGxlbWVudHMgVHJhbnNsYXRlTG9hZGVyIHtcblxuICAgIHByaXZhdGUgcHJlZml4OiBzdHJpbmcgPSAnaTE4bic7XG4gICAgcHJpdmF0ZSBzdWZmaXg6IHN0cmluZyA9ICcuanNvbic7XG4gICAgcHJpdmF0ZSBwcm92aWRlcnM6IENvbXBvbmVudFRyYW5zbGF0aW9uTW9kZWxbXSA9IFtdO1xuICAgIHByaXZhdGUgcXVldWU6IHN0cmluZyBbXVtdID0gW107XG4gICAgcHJpdmF0ZSBkZWZhdWx0TGFuZzogc3RyaW5nID0gJ2VuJztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xuICAgIH1cblxuICAgIHNldERlZmF1bHRMYW5nKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0TGFuZyA9IHZhbHVlIHx8ICdlbic7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJQcm92aWRlcihuYW1lOiBzdHJpbmcsIHBhdGg6IHN0cmluZykge1xuICAgICAgICBjb25zdCByZWdpc3RlcmVkID0gdGhpcy5wcm92aWRlcnMuZmluZCgocHJvdmlkZXIpID0+IHByb3ZpZGVyLm5hbWUgPT09IG5hbWUpO1xuICAgICAgICBpZiAocmVnaXN0ZXJlZCkge1xuICAgICAgICAgICAgcmVnaXN0ZXJlZC5wYXRoID0gcGF0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvdmlkZXJzLnB1c2gobmV3IENvbXBvbmVudFRyYW5zbGF0aW9uTW9kZWwoeyBuYW1lOiBuYW1lLCBwYXRoOiBwYXRoIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3ZpZGVyUmVnaXN0ZXJlZChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLmZpbmQoKHgpID0+IHgubmFtZSA9PT0gbmFtZSkgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgZmV0Y2hMYW5ndWFnZUZpbGUobGFuZzogc3RyaW5nLCBjb21wb25lbnQ6IENvbXBvbmVudFRyYW5zbGF0aW9uTW9kZWwsIGZhbGxiYWNrVXJsPzogc3RyaW5nKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uVXJsID0gZmFsbGJhY2tVcmwgfHwgYCR7Y29tcG9uZW50LnBhdGh9LyR7dGhpcy5wcmVmaXh9LyR7bGFuZ30ke3RoaXMuc3VmZml4fT92PSR7RGF0ZS5ub3coKX1gO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHRyYW5zbGF0aW9uVXJsKS5waXBlKFxuICAgICAgICAgICAgbWFwKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Lmpzb25bbGFuZ10gPSByZXM7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHJldHJ5KDMpLFxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFmYWxsYmFja1VybCAmJiBsYW5nLmluY2x1ZGVzKCctJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2xhbmdJZF0gPSBsYW5nLnNwbGl0KCctJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhbmdJZCAmJiBsYW5nSWQgIT09IHRoaXMuZGVmYXVsdExhbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke2NvbXBvbmVudC5wYXRofS8ke3RoaXMucHJlZml4fS8ke2xhbmdJZH0ke3RoaXMuc3VmZml4fT92PSR7RGF0ZS5ub3coKX1gO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mZXRjaExhbmd1YWdlRmlsZShsYW5nLCBjb21wb25lbnQsIHVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoYEZhaWxlZCB0byBsb2FkICR7dHJhbnNsYXRpb25Vcmx9YCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudFRvRmV0Y2gobGFuZzogc3RyaW5nKTogQXJyYXk8T2JzZXJ2YWJsZTxhbnk+PiB7XG4gICAgICAgIGNvbnN0IG9ic2VydmFibGVCYXRjaCA9IFtdO1xuICAgICAgICBpZiAoIXRoaXMucXVldWVbbGFuZ10pIHtcbiAgICAgICAgICAgIHRoaXMucXVldWVbbGFuZ10gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb3ZpZGVycy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0NvbXBvbmVudEluUXVldWUobGFuZywgY29tcG9uZW50Lm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWV1ZVtsYW5nXS5wdXNoKGNvbXBvbmVudC5uYW1lKTtcblxuICAgICAgICAgICAgICAgIG9ic2VydmFibGVCYXRjaC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoTGFuZ3VhZ2VGaWxlKGxhbmcsIGNvbXBvbmVudClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZUJhdGNoO1xuICAgIH1cblxuICAgIGluaXQobGFuZzogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnF1ZXVlW2xhbmddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucXVldWVbbGFuZ10gPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzQ29tcG9uZW50SW5RdWV1ZShsYW5nOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gKHRoaXMucXVldWVbbGFuZ10gfHwgW10pLmZpbmQoKHgpID0+IHggPT09IG5hbWUpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH1cblxuICAgIGdldEZ1bGxUcmFuc2xhdGlvbkpTT04obGFuZzogc3RyaW5nKTogYW55IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIHRoaXMucHJvdmlkZXJzXG4gICAgICAgICAgICAuc2xpY2UoMClcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGEubmFtZSA9PT0gJ2FwcCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiLm5hbWUgPT09ICdhcHAnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZvckVhY2goKG1vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsLmpzb24gJiYgbW9kZWwuanNvbltsYW5nXSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBPYmplY3RVdGlscy5tZXJnZShyZXN1bHQsIG1vZGVsLmpzb25bbGFuZ10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZ2V0VHJhbnNsYXRpb24obGFuZzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgbGV0IGhhc0ZhaWx1cmVzID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGJhdGNoID0gW1xuICAgICAgICAgICAgLi4udGhpcy5nZXRDb21wb25lbnRUb0ZldGNoKGxhbmcpLm1hcCgob2JzZXJ2YWJsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRmFpbHVyZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgXTtcblxuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChiYXRjaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9ya0pvaW4oYmF0Y2gpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZnVsbFRyYW5zbGF0aW9uID0gdGhpcy5nZXRGdWxsVHJhbnNsYXRpb25KU09OKGxhbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bGxUcmFuc2xhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZnVsbFRyYW5zbGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNGYWlsdXJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBzb21lIHJlc291cmNlcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcignRmFpbGVkIHRvIGxvYWQgc29tZSByZXNvdXJjZXMnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bGxUcmFuc2xhdGlvbiA9IHRoaXMuZ2V0RnVsbFRyYW5zbGF0aW9uSlNPTihsYW5nKTtcbiAgICAgICAgICAgICAgICBpZiAoZnVsbFRyYW5zbGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZnVsbFRyYW5zbGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
