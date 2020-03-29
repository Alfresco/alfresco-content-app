/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
export {
  PageLayoutContentComponent
} from './lib/components/page-layout/page-layout-content.component';
export {
  PageLayoutErrorComponent
} from './lib/components/page-layout/page-layout-error.component';
export {
  PageLayoutHeaderComponent
} from './lib/components/page-layout/page-layout-header.component';
export {
  PageLayoutComponent
} from './lib/components/page-layout/page-layout.component';
export {
  PageLayoutModule
} from './lib/components/page-layout/page-layout.module';
export {
  LockedByComponent
} from './lib/components/locked-by/locked-by.component';
export { LockedByModule } from './lib/components/locked-by/locked-by.module';
export { AppRouteReuseStrategy } from './lib/routing/app.routes.strategy';
export { AppSharedRuleGuard } from './lib/routing/shared.guard';
export { AppService } from './lib/services/app.service';
export { ContentApiService } from './lib/services/content-api.service';
export { NodePermissionService } from './lib/services/node-permission.service';
export {
  GenericErrorComponent
} from './lib/components/generic-error/generic-error.component';
export {
  GenericErrorModule
} from './lib/components/generic-error/generic-error.module';
export {
  ContextActionsDirective
} from './lib/directives/contextmenu/contextmenu.directive';
export {
  ContextActionsModule
} from './lib/directives/contextmenu/contextmenu.module';
export { isLocked, isLibrary } from './lib/utils/node.utils';
export { SharedModule } from './lib/shared.module';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkLyIsInNvdXJjZXMiOlsicHVibGljLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLDJDQUFjLDREQUE0RCxDQUFDO0FBQzNFLHlDQUFjLDBEQUEwRCxDQUFDO0FBQ3pFLDBDQUFjLDJEQUEyRCxDQUFDO0FBQzFFLG9DQUFjLG9EQUFvRCxDQUFDO0FBQ25FLGlDQUFjLGlEQUFpRCxDQUFDO0FBQ2hFLGtDQUFjLGdEQUFnRCxDQUFDO0FBQy9ELCtCQUFjLDZDQUE2QyxDQUFDO0FBRTVELHNDQUFjLG1DQUFtQyxDQUFDO0FBQ2xELG1DQUFjLDRCQUE0QixDQUFDO0FBRTNDLDJCQUFjLDRCQUE0QixDQUFDO0FBQzNDLGtDQUFjLG9DQUFvQyxDQUFDO0FBQ25ELHNDQUFjLHdDQUF3QyxDQUFDO0FBRXZELHNDQUFjLHdEQUF3RCxDQUFDO0FBQ3ZFLG1DQUFjLHFEQUFxRCxDQUFDO0FBRXBFLHdDQUFjLG9EQUFvRCxDQUFDO0FBQ25FLHFDQUFjLGlEQUFpRCxDQUFDO0FBRWhFLG9DQUFjLHdCQUF3QixDQUFDO0FBRXZDLDZCQUFjLHFCQUFxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5leHBvcnQgKiBmcm9tICcuL2xpYi9jb21wb25lbnRzL3BhZ2UtbGF5b3V0L3BhZ2UtbGF5b3V0LWNvbnRlbnQuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2NvbXBvbmVudHMvcGFnZS1sYXlvdXQvcGFnZS1sYXlvdXQtZXJyb3IuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2NvbXBvbmVudHMvcGFnZS1sYXlvdXQvcGFnZS1sYXlvdXQtaGVhZGVyLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9jb21wb25lbnRzL3BhZ2UtbGF5b3V0L3BhZ2UtbGF5b3V0LmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9jb21wb25lbnRzL3BhZ2UtbGF5b3V0L3BhZ2UtbGF5b3V0Lm1vZHVsZSc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9jb21wb25lbnRzL2xvY2tlZC1ieS9sb2NrZWQtYnkuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2NvbXBvbmVudHMvbG9ja2VkLWJ5L2xvY2tlZC1ieS5tb2R1bGUnO1xuXG5leHBvcnQgKiBmcm9tICcuL2xpYi9yb3V0aW5nL2FwcC5yb3V0ZXMuc3RyYXRlZ3knO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvcm91dGluZy9zaGFyZWQuZ3VhcmQnO1xuXG5leHBvcnQgKiBmcm9tICcuL2xpYi9zZXJ2aWNlcy9hcHAuc2VydmljZSc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9zZXJ2aWNlcy9jb250ZW50LWFwaS5zZXJ2aWNlJztcbmV4cG9ydCAqIGZyb20gJy4vbGliL3NlcnZpY2VzL25vZGUtcGVybWlzc2lvbi5zZXJ2aWNlJztcblxuZXhwb3J0ICogZnJvbSAnLi9saWIvY29tcG9uZW50cy9nZW5lcmljLWVycm9yL2dlbmVyaWMtZXJyb3IuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2NvbXBvbmVudHMvZ2VuZXJpYy1lcnJvci9nZW5lcmljLWVycm9yLm1vZHVsZSc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbGliL2RpcmVjdGl2ZXMvY29udGV4dG1lbnUvY29udGV4dG1lbnUuZGlyZWN0aXZlJztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2RpcmVjdGl2ZXMvY29udGV4dG1lbnUvY29udGV4dG1lbnUubW9kdWxlJztcblxuZXhwb3J0ICogZnJvbSAnLi9saWIvdXRpbHMvbm9kZS51dGlscyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbGliL3NoYXJlZC5tb2R1bGUnO1xuIl19
