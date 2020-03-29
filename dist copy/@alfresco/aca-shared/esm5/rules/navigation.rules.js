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
/**
 * Checks if a Preview route is activated.
 * JSON ref: `app.navigation.isPreview`
 * @param {?} context
 * @return {?}
 */
export function isPreview(context) {
  var url = context.navigation.url;
  return (
    url &&
    (url.includes('/preview/') ||
      url.includes('viewer:view') ||
      url.includes('/view/'))
  );
}
/**
 * Checks if a **Favorites** route is activated.
 * JSON ref: `app.navigation.isFavorites`
 * @param {?} context
 * @return {?}
 */
export function isFavorites(context) {
  var url = context.navigation.url;
  return url && url.startsWith('/favorites') && !isPreview(context);
}
/**
 * Checks if the activated route is not **Favorites**.
 * JSON ref: `app.navigation.isNotFavorites`
 * @param {?} context
 * @return {?}
 */
export function isNotFavorites(context) {
  return !isFavorites(context);
}
/**
 * Checks if a **Shared Files** route is activated.
 * JSON ref: `app.navigation.isSharedFiles`
 * @param {?} context
 * @return {?}
 */
export function isSharedFiles(context) {
  var url = context.navigation.url;
  return url && url.startsWith('/shared') && !isPreview(context);
}
/**
 * Checks if the activated route is not **Shared Files**.
 * JSON ref: `app.navigation.isNotSharedFiles`
 * @param {?} context
 * @return {?}
 */
export function isNotSharedFiles(context) {
  return !isSharedFiles(context);
}
/**
 * Checks if a **Trashcan** route is activated.
 * JSON ref: `app.navigation.isTrashcan`
 * @param {?} context
 * @return {?}
 */
export function isTrashcan(context) {
  var url = context.navigation.url;
  return url && url.startsWith('/trashcan');
}
/**
 * Checks if the activated route is not **Trashcan**.
 * JSON ref: `app.navigation.isNotTrashcan`
 * @param {?} context
 * @return {?}
 */
export function isNotTrashcan(context) {
  return !isTrashcan(context);
}
/**
 * Checks if a **Personal Files** route is activated.
 * JSON ref: `app.navigation.isPersonalFiles`
 * @param {?} context
 * @return {?}
 */
export function isPersonalFiles(context) {
  var url = context.navigation.url;
  return url && url.startsWith('/personal-files');
}
/**
 * Checks if a **Library Files** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 * @param {?} context
 * @return {?}
 */
export function isLibraryFiles(context) {
  var url = context.navigation.url;
  return url && url.startsWith('/libraries');
}
/**
 * Checks if a **Library Files** or **Library Search Result** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 * @param {?} context
 * @return {?}
 */
export function isLibraries(context) {
  var url = context.navigation.url;
  return (
    url && (url.endsWith('/libraries') || url.startsWith('/search-libraries'))
  );
}
/**
 * Checks if the activated route is neither **Libraries** nor **Library Search Results**.
 * JSON ref: `app.navigation.isNotLibraries`
 * @param {?} context
 * @return {?}
 */
export function isNotLibraries(context) {
  return !isLibraries(context);
}
/**
 * Checks if a **Recent Files** route is activated.
 * JSON ref: `app.navigation.isRecentFiles`
 * @param {?} context
 * @return {?}
 */
export function isRecentFiles(context) {
  var url = context.navigation.url;
  return url && url.startsWith('/recent-files');
}
/**
 * Checks if the activated route is not **Recent Files**.
 * JSON ref: `app.navigation.isNotRecentFiles`
 * @param {?} context
 * @return {?}
 */
export function isNotRecentFiles(context) {
  return !isRecentFiles(context);
}
/**
 * Checks if a **Search Results** route is activated.
 * JSON ref: `app.navigation.isSearchResults`
 * @param {?} context
 * @return {?}
 */
export function isSearchResults(context /*,
...args: RuleParameter[]*/) {
  var url = context.navigation.url;
  return url && url.startsWith('/search');
}
/**
 * Checks if the activated route is not **Search Results**.
 * JSON ref: `app.navigation.isNotSearchResults`
 * @param {?} context
 * @return {?}
 */
export function isNotSearchResults(context) {
  return !isSearchResults(context);
}
/**
 * Checks if a **Shared Preview** route is activated.
 * JSON ref: `app.navigation.isSharedPreview`
 * @param {?} context
 * @return {?}
 */
export function isSharedPreview(context) {
  var url = context.navigation.url;
  return (
    url &&
    (url.startsWith('/shared/preview/') ||
      (url.startsWith('/shared') && url.includes('viewer:view')))
  );
}
/**
 * Checks if a **Favorites Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 * @param {?} context
 * @return {?}
 */
export function isFavoritesPreview(context) {
  var url = context.navigation.url;
  return (
    url &&
    (url.startsWith('/favorites/preview/') ||
      (url.startsWith('/favorites') && url.includes('viewer:view')))
  );
}
/**
 * Checks if a **Shared File Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 * @param {?} context
 * @return {?}
 */
export function isSharedFileViewer(context) {
  var url = context.navigation.url;
  return url && url.startsWith('/preview/s/');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi5ydWxlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkL3J1bGVzLyIsInNvdXJjZXMiOlsibmF2aWdhdGlvbi5ydWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0JBLE1BQU0sVUFBVSxTQUFTLENBQUMsT0FBb0I7SUFDcEMsSUFBQSw0QkFBRztJQUNYLE9BQU8sQ0FDTCxHQUFHO1FBQ0gsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUN4QixHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztZQUMzQixHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQzFCLENBQUM7QUFDSixDQUFDOzs7Ozs7O0FBTUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxPQUFvQjtJQUN0QyxJQUFBLDRCQUFHO0lBQ1gsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwRSxDQUFDOzs7Ozs7O0FBTUQsTUFBTSxVQUFVLGNBQWMsQ0FBQyxPQUFvQjtJQUNqRCxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLENBQUM7Ozs7Ozs7QUFNRCxNQUFNLFVBQVUsYUFBYSxDQUFDLE9BQW9CO0lBQ3hDLElBQUEsNEJBQUc7SUFDWCxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pFLENBQUM7Ozs7Ozs7QUFNRCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsT0FBb0I7SUFDbkQsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQyxDQUFDOzs7Ozs7O0FBTUQsTUFBTSxVQUFVLFVBQVUsQ0FBQyxPQUFvQjtJQUNyQyxJQUFBLDRCQUFHO0lBQ1gsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM1QyxDQUFDOzs7Ozs7O0FBTUQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxPQUFvQjtJQUNoRCxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlCLENBQUM7Ozs7Ozs7QUFNRCxNQUFNLFVBQVUsZUFBZSxDQUFDLE9BQW9CO0lBQzFDLElBQUEsNEJBQUc7SUFDWCxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDbEQsQ0FBQzs7Ozs7OztBQU1ELE1BQU0sVUFBVSxjQUFjLENBQUMsT0FBb0I7SUFDekMsSUFBQSw0QkFBRztJQUNYLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDN0MsQ0FBQzs7Ozs7OztBQU1ELE1BQU0sVUFBVSxXQUFXLENBQUMsT0FBb0I7SUFDdEMsSUFBQSw0QkFBRztJQUNYLE9BQU8sQ0FDTCxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUMzRSxDQUFDO0FBQ0osQ0FBQzs7Ozs7OztBQU1ELE1BQU0sVUFBVSxjQUFjLENBQUMsT0FBb0I7SUFDakQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixDQUFDOzs7Ozs7O0FBTUQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxPQUFvQjtJQUN4QyxJQUFBLDRCQUFHO0lBQ1gsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNoRCxDQUFDOzs7Ozs7O0FBTUQsTUFBTSxVQUFVLGdCQUFnQixDQUFDLE9BQW9CO0lBQ25ELE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakMsQ0FBQzs7Ozs7OztBQU1ELE1BQU0sVUFBVSxlQUFlLENBQzdCLE9BQW9CLENBQUM7MEJBQ0s7SUFFbEIsSUFBQSw0QkFBRztJQUNYLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUMsQ0FBQzs7Ozs7OztBQU1ELE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxPQUFvQjtJQUNyRCxPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25DLENBQUM7Ozs7Ozs7QUFNRCxNQUFNLFVBQVUsZUFBZSxDQUFDLE9BQW9CO0lBQzFDLElBQUEsNEJBQUc7SUFDWCxPQUFPLENBQ0wsR0FBRztRQUNILENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztZQUNqQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQzlELENBQUM7QUFDSixDQUFDOzs7Ozs7O0FBTUQsTUFBTSxVQUFVLGtCQUFrQixDQUFDLE9BQW9CO0lBQzdDLElBQUEsNEJBQUc7SUFDWCxPQUFPLENBQ0wsR0FBRztRQUNILENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQztZQUNwQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQ2pFLENBQUM7QUFDSixDQUFDOzs7Ozs7O0FBTUQsTUFBTSxVQUFVLGtCQUFrQixDQUFDLE9BQW9CO0lBQzdDLElBQUEsNEJBQUc7SUFDWCxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IFJ1bGVDb250ZXh0IH0gZnJvbSAnQGFsZnJlc2NvL2FkZi1leHRlbnNpb25zJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBQcmV2aWV3IHJvdXRlIGlzIGFjdGl2YXRlZC5cbiAqIEpTT04gcmVmOiBgYXBwLm5hdmlnYXRpb24uaXNQcmV2aWV3YFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQcmV2aWV3KGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgdXJsIH0gPSBjb250ZXh0Lm5hdmlnYXRpb247XG4gIHJldHVybiAoXG4gICAgdXJsICYmXG4gICAgKHVybC5pbmNsdWRlcygnL3ByZXZpZXcvJykgfHxcbiAgICAgIHVybC5pbmNsdWRlcygndmlld2VyOnZpZXcnKSB8fFxuICAgICAgdXJsLmluY2x1ZGVzKCcvdmlldy8nKSlcbiAgKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSAqKkZhdm9yaXRlcyoqIHJvdXRlIGlzIGFjdGl2YXRlZC5cbiAqIEpTT04gcmVmOiBgYXBwLm5hdmlnYXRpb24uaXNGYXZvcml0ZXNgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zhdm9yaXRlcyhjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICBjb25zdCB7IHVybCB9ID0gY29udGV4dC5uYXZpZ2F0aW9uO1xuICByZXR1cm4gdXJsICYmIHVybC5zdGFydHNXaXRoKCcvZmF2b3JpdGVzJykgJiYgIWlzUHJldmlldyhjb250ZXh0KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGFjdGl2YXRlZCByb3V0ZSBpcyBub3QgKipGYXZvcml0ZXMqKi5cbiAqIEpTT04gcmVmOiBgYXBwLm5hdmlnYXRpb24uaXNOb3RGYXZvcml0ZXNgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vdEZhdm9yaXRlcyhjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gIWlzRmF2b3JpdGVzKGNvbnRleHQpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhICoqU2hhcmVkIEZpbGVzKiogcm91dGUgaXMgYWN0aXZhdGVkLlxuICogSlNPTiByZWY6IGBhcHAubmF2aWdhdGlvbi5pc1NoYXJlZEZpbGVzYFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTaGFyZWRGaWxlcyhjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICBjb25zdCB7IHVybCB9ID0gY29udGV4dC5uYXZpZ2F0aW9uO1xuICByZXR1cm4gdXJsICYmIHVybC5zdGFydHNXaXRoKCcvc2hhcmVkJykgJiYgIWlzUHJldmlldyhjb250ZXh0KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGFjdGl2YXRlZCByb3V0ZSBpcyBub3QgKipTaGFyZWQgRmlsZXMqKi5cbiAqIEpTT04gcmVmOiBgYXBwLm5hdmlnYXRpb24uaXNOb3RTaGFyZWRGaWxlc2BcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTm90U2hhcmVkRmlsZXMoY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgcmV0dXJuICFpc1NoYXJlZEZpbGVzKGNvbnRleHQpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhICoqVHJhc2hjYW4qKiByb3V0ZSBpcyBhY3RpdmF0ZWQuXG4gKiBKU09OIHJlZjogYGFwcC5uYXZpZ2F0aW9uLmlzVHJhc2hjYW5gXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1RyYXNoY2FuKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgdXJsIH0gPSBjb250ZXh0Lm5hdmlnYXRpb247XG4gIHJldHVybiB1cmwgJiYgdXJsLnN0YXJ0c1dpdGgoJy90cmFzaGNhbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgYWN0aXZhdGVkIHJvdXRlIGlzIG5vdCAqKlRyYXNoY2FuKiouXG4gKiBKU09OIHJlZjogYGFwcC5uYXZpZ2F0aW9uLmlzTm90VHJhc2hjYW5gXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vdFRyYXNoY2FuKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIHJldHVybiAhaXNUcmFzaGNhbihjb250ZXh0KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSAqKlBlcnNvbmFsIEZpbGVzKiogcm91dGUgaXMgYWN0aXZhdGVkLlxuICogSlNPTiByZWY6IGBhcHAubmF2aWdhdGlvbi5pc1BlcnNvbmFsRmlsZXNgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1BlcnNvbmFsRmlsZXMoY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgY29uc3QgeyB1cmwgfSA9IGNvbnRleHQubmF2aWdhdGlvbjtcbiAgcmV0dXJuIHVybCAmJiB1cmwuc3RhcnRzV2l0aCgnL3BlcnNvbmFsLWZpbGVzJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgKipMaWJyYXJ5IEZpbGVzKiogcm91dGUgaXMgYWN0aXZhdGVkLlxuICogSlNPTiByZWY6IGBhcHAubmF2aWdhdGlvbi5pc0xpYnJhcnlGaWxlc2BcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTGlicmFyeUZpbGVzKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgdXJsIH0gPSBjb250ZXh0Lm5hdmlnYXRpb247XG4gIHJldHVybiB1cmwgJiYgdXJsLnN0YXJ0c1dpdGgoJy9saWJyYXJpZXMnKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSAqKkxpYnJhcnkgRmlsZXMqKiBvciAqKkxpYnJhcnkgU2VhcmNoIFJlc3VsdCoqIHJvdXRlIGlzIGFjdGl2YXRlZC5cbiAqIEpTT04gcmVmOiBgYXBwLm5hdmlnYXRpb24uaXNMaWJyYXJ5RmlsZXNgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0xpYnJhcmllcyhjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICBjb25zdCB7IHVybCB9ID0gY29udGV4dC5uYXZpZ2F0aW9uO1xuICByZXR1cm4gKFxuICAgIHVybCAmJiAodXJsLmVuZHNXaXRoKCcvbGlicmFyaWVzJykgfHwgdXJsLnN0YXJ0c1dpdGgoJy9zZWFyY2gtbGlicmFyaWVzJykpXG4gICk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBhY3RpdmF0ZWQgcm91dGUgaXMgbmVpdGhlciAqKkxpYnJhcmllcyoqIG5vciAqKkxpYnJhcnkgU2VhcmNoIFJlc3VsdHMqKi5cbiAqIEpTT04gcmVmOiBgYXBwLm5hdmlnYXRpb24uaXNOb3RMaWJyYXJpZXNgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vdExpYnJhcmllcyhjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gIWlzTGlicmFyaWVzKGNvbnRleHQpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhICoqUmVjZW50IEZpbGVzKiogcm91dGUgaXMgYWN0aXZhdGVkLlxuICogSlNPTiByZWY6IGBhcHAubmF2aWdhdGlvbi5pc1JlY2VudEZpbGVzYFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNSZWNlbnRGaWxlcyhjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICBjb25zdCB7IHVybCB9ID0gY29udGV4dC5uYXZpZ2F0aW9uO1xuICByZXR1cm4gdXJsICYmIHVybC5zdGFydHNXaXRoKCcvcmVjZW50LWZpbGVzJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBhY3RpdmF0ZWQgcm91dGUgaXMgbm90ICoqUmVjZW50IEZpbGVzKiouXG4gKiBKU09OIHJlZjogYGFwcC5uYXZpZ2F0aW9uLmlzTm90UmVjZW50RmlsZXNgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vdFJlY2VudEZpbGVzKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIHJldHVybiAhaXNSZWNlbnRGaWxlcyhjb250ZXh0KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSAqKlNlYXJjaCBSZXN1bHRzKiogcm91dGUgaXMgYWN0aXZhdGVkLlxuICogSlNPTiByZWY6IGBhcHAubmF2aWdhdGlvbi5pc1NlYXJjaFJlc3VsdHNgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NlYXJjaFJlc3VsdHMoXG4gIGNvbnRleHQ6IFJ1bGVDb250ZXh0IC8qLFxuICAuLi5hcmdzOiBSdWxlUGFyYW1ldGVyW10qL1xuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgdXJsIH0gPSBjb250ZXh0Lm5hdmlnYXRpb247XG4gIHJldHVybiB1cmwgJiYgdXJsLnN0YXJ0c1dpdGgoJy9zZWFyY2gnKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGFjdGl2YXRlZCByb3V0ZSBpcyBub3QgKipTZWFyY2ggUmVzdWx0cyoqLlxuICogSlNPTiByZWY6IGBhcHAubmF2aWdhdGlvbi5pc05vdFNlYXJjaFJlc3VsdHNgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vdFNlYXJjaFJlc3VsdHMoY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgcmV0dXJuICFpc1NlYXJjaFJlc3VsdHMoY29udGV4dCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgKipTaGFyZWQgUHJldmlldyoqIHJvdXRlIGlzIGFjdGl2YXRlZC5cbiAqIEpTT04gcmVmOiBgYXBwLm5hdmlnYXRpb24uaXNTaGFyZWRQcmV2aWV3YFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTaGFyZWRQcmV2aWV3KGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgdXJsIH0gPSBjb250ZXh0Lm5hdmlnYXRpb247XG4gIHJldHVybiAoXG4gICAgdXJsICYmXG4gICAgKHVybC5zdGFydHNXaXRoKCcvc2hhcmVkL3ByZXZpZXcvJykgfHxcbiAgICAgICh1cmwuc3RhcnRzV2l0aCgnL3NoYXJlZCcpICYmIHVybC5pbmNsdWRlcygndmlld2VyOnZpZXcnKSkpXG4gICk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgKipGYXZvcml0ZXMgUHJldmlldyoqIHJvdXRlIGlzIGFjdGl2YXRlZC5cbiAqIEpTT04gcmVmOiBgYXBwLm5hdmlnYXRpb24uaXNGYXZvcml0ZXNQcmV2aWV3YFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGYXZvcml0ZXNQcmV2aWV3KGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgdXJsIH0gPSBjb250ZXh0Lm5hdmlnYXRpb247XG4gIHJldHVybiAoXG4gICAgdXJsICYmXG4gICAgKHVybC5zdGFydHNXaXRoKCcvZmF2b3JpdGVzL3ByZXZpZXcvJykgfHxcbiAgICAgICh1cmwuc3RhcnRzV2l0aCgnL2Zhdm9yaXRlcycpICYmIHVybC5pbmNsdWRlcygndmlld2VyOnZpZXcnKSkpXG4gICk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgKipTaGFyZWQgRmlsZSBQcmV2aWV3Kiogcm91dGUgaXMgYWN0aXZhdGVkLlxuICogSlNPTiByZWY6IGBhcHAubmF2aWdhdGlvbi5pc0Zhdm9yaXRlc1ByZXZpZXdgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NoYXJlZEZpbGVWaWV3ZXIoY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgY29uc3QgeyB1cmwgfSA9IGNvbnRleHQubmF2aWdhdGlvbjtcbiAgcmV0dXJuIHVybCAmJiB1cmwuc3RhcnRzV2l0aCgnL3ByZXZpZXcvcy8nKTtcbn1cbiJdfQ==
