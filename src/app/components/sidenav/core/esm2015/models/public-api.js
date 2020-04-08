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
export { FileUploadOptions, FileUploadStatus, FileModel } from './file.model';
export { AllowableOperationsEnum } from './allowable-operations.enum';
export { PermissionsEnum } from './permissions.enum';
export {
  BpmProductVersionModel,
  VersionModel,
  LicenseModel,
  VersionStatusModel,
  VersionModuleModel,
  EcmProductVersionModel
} from './product-version.model';
export { UserProcessModel } from './user-process.model';
export { CommentModel } from './comment.model';
export { EcmCompanyModel } from './ecm-company.model';
export { RedirectionModel } from './redirection.model';
export { PaginationModel } from './pagination.model';
export {} from './oauth-config.model';
export { RequestPaginationModel } from './request-pagination.model';
export { DecimalNumberModel } from './decimal-number.model';
export { BpmUserModel } from './bpm-user.model';
export { EcmUserModel } from './ecm-user.model';
export {} from './identity-group.model';
export {} from './identity-user.model';
export { IdentityRoleModel } from './identity-role.model';
export {} from './identity-group.model';
export { SearchTextStateEnum } from './search-text-input.model';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbIm1vZGVscy9wdWJsaWMtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLCtEQUFjLGNBQWMsQ0FBQztBQUM3Qix3Q0FBYyw2QkFBNkIsQ0FBQztBQUM1QyxnQ0FBYyxvQkFBb0IsQ0FBQztBQUNuQyxtSUFBYyx5QkFBeUIsQ0FBQztBQUN4QyxpQ0FBYyxzQkFBc0IsQ0FBQztBQUNyQyw2QkFBYyxpQkFBaUIsQ0FBQztBQUNoQyxnQ0FBYyxxQkFBcUIsQ0FBQztBQUNwQyxpQ0FBYyxxQkFBcUIsQ0FBQztBQUNwQyxnQ0FBYyxvQkFBb0IsQ0FBQztBQUNuQyxlQUFjLHNCQUFzQixDQUFDO0FBQ3JDLHVDQUFjLDRCQUE0QixDQUFDO0FBQzNDLG1DQUFjLHdCQUF3QixDQUFDO0FBQ3ZDLDZCQUFjLGtCQUFrQixDQUFDO0FBQ2pDLDZCQUFjLGtCQUFrQixDQUFDO0FBQ2pDLGVBQWMsd0JBQXdCLENBQUM7QUFDdkMsZUFBYyx1QkFBdUIsQ0FBQztBQUN0QyxrQ0FBYyx1QkFBdUIsQ0FBQztBQUN0QyxlQUFjLHdCQUF3QixDQUFDO0FBQ3ZDLG9DQUFjLDJCQUEyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9maWxlLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vYWxsb3dhYmxlLW9wZXJhdGlvbnMuZW51bSc7XG5leHBvcnQgKiBmcm9tICcuL3Blcm1pc3Npb25zLmVudW0nO1xuZXhwb3J0ICogZnJvbSAnLi9wcm9kdWN0LXZlcnNpb24ubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi91c2VyLXByb2Nlc3MubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9jb21tZW50Lm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vZWNtLWNvbXBhbnkubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9yZWRpcmVjdGlvbi5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL3BhZ2luYXRpb24ubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9vYXV0aC1jb25maWcubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9yZXF1ZXN0LXBhZ2luYXRpb24ubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9kZWNpbWFsLW51bWJlci5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL2JwbS11c2VyLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vZWNtLXVzZXIubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9pZGVudGl0eS1ncm91cC5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL2lkZW50aXR5LXVzZXIubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9pZGVudGl0eS1yb2xlLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vaWRlbnRpdHktZ3JvdXAubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9zZWFyY2gtdGV4dC1pbnB1dC5tb2RlbCc7XG4iXX0=
