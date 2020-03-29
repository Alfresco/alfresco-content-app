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
/** @enum {string} */
var SearchActionTypes = {
  SearchByTerm: 'SEARCH_BY_TERM',
  ToggleFilter: 'TOGGLE_SEARCH_FILTER',
  ShowFilter: 'SHOW_SEARCH_FILTER',
  HideFilter: 'HIDE_SEARCH_FILTER'
};
export { SearchActionTypes };
var SearchByTermAction = /** @class */ (function() {
  function SearchByTermAction(payload, searchOptions) {
    this.payload = payload;
    this.searchOptions = searchOptions;
    this.type = SearchActionTypes.SearchByTerm;
  }
  return SearchByTermAction;
})();
export { SearchByTermAction };
if (false) {
  /** @type {?} */
  SearchByTermAction.prototype.type;
  /** @type {?} */
  SearchByTermAction.prototype.payload;
  /** @type {?} */
  SearchByTermAction.prototype.searchOptions;
}
var ToggleSearchFilterAction = /** @class */ (function() {
  function ToggleSearchFilterAction() {
    this.type = SearchActionTypes.ToggleFilter;
  }
  return ToggleSearchFilterAction;
})();
export { ToggleSearchFilterAction };
if (false) {
  /** @type {?} */
  ToggleSearchFilterAction.prototype.type;
}
var ShowSearchFilterAction = /** @class */ (function() {
  function ShowSearchFilterAction() {
    this.type = SearchActionTypes.ShowFilter;
  }
  return ShowSearchFilterAction;
})();
export { ShowSearchFilterAction };
if (false) {
  /** @type {?} */
  ShowSearchFilterAction.prototype.type;
}
var HideSearchFilterAction = /** @class */ (function() {
  function HideSearchFilterAction() {
    this.type = SearchActionTypes.HideFilter;
  }
  return HideSearchFilterAction;
})();
export { HideSearchFilterAction };
if (false) {
  /** @type {?} */
  HideSearchFilterAction.prototype.type;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmFjdGlvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZS8iLCJzb3VyY2VzIjpbImFjdGlvbnMvc2VhcmNoLmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNkJFLGNBQWUsZ0JBQWdCO0lBQy9CLGNBQWUsc0JBQXNCO0lBQ3JDLFlBQWEsb0JBQW9CO0lBQ2pDLFlBQWEsb0JBQW9COzs7QUFHbkM7SUFFRSw0QkFDUyxPQUFlLEVBQ2YsYUFBbUM7UUFEbkMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGtCQUFhLEdBQWIsYUFBYSxDQUFzQjtRQUhuQyxTQUFJLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxDQUFDO0lBSTVDLENBQUM7SUFDTix5QkFBQztBQUFELENBQUMsQUFORCxJQU1DOzs7O0lBTEMsa0NBQStDOztJQUU3QyxxQ0FBc0I7O0lBQ3RCLDJDQUEwQzs7QUFJOUM7SUFBQTtRQUNXLFNBQUksR0FBRyxpQkFBaUIsQ0FBQyxZQUFZLENBQUM7SUFDakQsQ0FBQztJQUFELCtCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7Ozs7SUFEQyx3Q0FBK0M7O0FBR2pEO0lBQUE7UUFDVyxTQUFJLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFDO0lBQy9DLENBQUM7SUFBRCw2QkFBQztBQUFELENBQUMsQUFGRCxJQUVDOzs7O0lBREMsc0NBQTZDOztBQUcvQztJQUFBO1FBQ1csU0FBSSxHQUFHLGlCQUFpQixDQUFDLFVBQVUsQ0FBQztJQUMvQyxDQUFDO0lBQUQsNkJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQzs7OztJQURDLHNDQUE2QyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgU2VhcmNoT3B0aW9uTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvc2VhcmNoLW9wdGlvbi5tb2RlbCc7XG5cbmV4cG9ydCBlbnVtIFNlYXJjaEFjdGlvblR5cGVzIHtcbiAgU2VhcmNoQnlUZXJtID0gJ1NFQVJDSF9CWV9URVJNJyxcbiAgVG9nZ2xlRmlsdGVyID0gJ1RPR0dMRV9TRUFSQ0hfRklMVEVSJyxcbiAgU2hvd0ZpbHRlciA9ICdTSE9XX1NFQVJDSF9GSUxURVInLFxuICBIaWRlRmlsdGVyID0gJ0hJREVfU0VBUkNIX0ZJTFRFUidcbn1cblxuZXhwb3J0IGNsYXNzIFNlYXJjaEJ5VGVybUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBTZWFyY2hBY3Rpb25UeXBlcy5TZWFyY2hCeVRlcm07XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBwYXlsb2FkOiBzdHJpbmcsXG4gICAgcHVibGljIHNlYXJjaE9wdGlvbnM/OiBTZWFyY2hPcHRpb25Nb2RlbFtdXG4gICkge31cbn1cblxuZXhwb3J0IGNsYXNzIFRvZ2dsZVNlYXJjaEZpbHRlckFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBTZWFyY2hBY3Rpb25UeXBlcy5Ub2dnbGVGaWx0ZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTaG93U2VhcmNoRmlsdGVyQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFNlYXJjaEFjdGlvblR5cGVzLlNob3dGaWx0ZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBIaWRlU2VhcmNoRmlsdGVyQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFNlYXJjaEFjdGlvblR5cGVzLkhpZGVGaWx0ZXI7XG59XG4iXX0=
