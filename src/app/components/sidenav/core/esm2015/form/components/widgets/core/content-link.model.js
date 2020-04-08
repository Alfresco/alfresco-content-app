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
/* tslint:disable:component-selector  */
export class ContentLinkModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    this.contentAvailable = obj && obj.contentAvailable;
    this.created = obj && obj.created;
    this.createdBy = (obj && obj.createdBy) || {};
    this.id = obj && obj.id;
    this.link = obj && obj.link;
    this.mimeType = obj && obj.mimeType;
    this.name = obj && obj.name;
    this.previewStatus = obj && obj.previewStatus;
    this.relatedContent = obj && obj.relatedContent;
    this.simpleType = obj && obj.simpleType;
    this.thumbnailStatus = obj && obj.thumbnailStatus;
    this.nodeId = obj && obj.nodeId;
  }
  /**
   * @return {?}
   */
  hasPreviewStatus() {
    return this.previewStatus === 'supported' ? true : false;
  }
  /**
   * @return {?}
   */
  isTypeImage() {
    return this.simpleType === 'image' ? true : false;
  }
  /**
   * @return {?}
   */
  isTypePdf() {
    return this.simpleType === 'pdf' ? true : false;
  }
  /**
   * @return {?}
   */
  isTypeDoc() {
    return this.simpleType === 'word' || this.simpleType === 'content'
      ? true
      : false;
  }
  /**
   * @return {?}
   */
  isThumbnailReady() {
    return this.thumbnailStatus === 'created';
  }
  /**
   * @return {?}
   */
  isThumbnailSupported() {
    return (
      this.isTypeImage() ||
      ((this.isTypePdf() || this.isTypeDoc()) && this.isThumbnailReady())
    );
  }
}
if (false) {
  /** @type {?} */
  ContentLinkModel.prototype.contentAvailable;
  /** @type {?} */
  ContentLinkModel.prototype.created;
  /** @type {?} */
  ContentLinkModel.prototype.createdBy;
  /** @type {?} */
  ContentLinkModel.prototype.id;
  /** @type {?} */
  ContentLinkModel.prototype.nodeId;
  /** @type {?} */
  ContentLinkModel.prototype.link;
  /** @type {?} */
  ContentLinkModel.prototype.mimeType;
  /** @type {?} */
  ContentLinkModel.prototype.name;
  /** @type {?} */
  ContentLinkModel.prototype.previewStatus;
  /** @type {?} */
  ContentLinkModel.prototype.relatedContent;
  /** @type {?} */
  ContentLinkModel.prototype.simpleType;
  /** @type {?} */
  ContentLinkModel.prototype.thumbnailUrl;
  /** @type {?} */
  ContentLinkModel.prototype.contentRawUrl;
  /** @type {?} */
  ContentLinkModel.prototype.contentBlob;
  /** @type {?} */
  ContentLinkModel.prototype.thumbnailStatus;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC1saW5rLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZm9ybS9jb21wb25lbnRzL3dpZGdldHMvY29yZS9jb250ZW50LWxpbmsubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJDLE1BQU0sT0FBTyxnQkFBZ0I7Ozs7SUFrQjFCLFlBQVksR0FBUztRQUNqQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNwRCxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQztRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQztRQUM5QyxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDO1FBQ2hELElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFDeEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztRQUNsRCxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3BDLENBQUM7Ozs7SUFFRCxnQkFBZ0I7UUFDWixPQUFPLElBQUksQ0FBQyxhQUFhLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUM3RCxDQUFDOzs7O0lBRUQsV0FBVztRQUNQLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3RELENBQUM7Ozs7SUFFRCxTQUFTO1FBQ0wsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDcEQsQ0FBQzs7OztJQUVELFNBQVM7UUFDTCxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUN0RixDQUFDOzs7O0lBRUQsZ0JBQWdCO1FBQ1osT0FBTyxJQUFJLENBQUMsZUFBZSxLQUFLLFNBQVMsQ0FBQztJQUM5QyxDQUFDOzs7O0lBRUQsb0JBQW9CO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUNyRyxDQUFDO0NBQ0o7OztJQXRERyw0Q0FBMEI7O0lBQzFCLG1DQUFjOztJQUNkLHFDQUFlOztJQUNmLDhCQUFXOztJQUNYLGtDQUFlOztJQUNmLGdDQUFjOztJQUNkLG9DQUFpQjs7SUFDakIsZ0NBQWE7O0lBQ2IseUNBQXNCOztJQUN0QiwwQ0FBd0I7O0lBQ3hCLHNDQUFtQjs7SUFDbkIsd0NBQXFCOztJQUNyQix5Q0FBc0I7O0lBQ3RCLHVDQUFrQjs7SUFDbEIsMkNBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuIC8qIHRzbGludDpkaXNhYmxlOmNvbXBvbmVudC1zZWxlY3RvciAgKi9cblxuIGltcG9ydCB7IFJlbGF0ZWRDb250ZW50UmVwcmVzZW50YXRpb24gfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcblxuIGV4cG9ydCBjbGFzcyBDb250ZW50TGlua01vZGVsIGltcGxlbWVudHMgUmVsYXRlZENvbnRlbnRSZXByZXNlbnRhdGlvbiB7XG5cbiAgICBjb250ZW50QXZhaWxhYmxlOiBib29sZWFuO1xuICAgIGNyZWF0ZWQ6IERhdGU7XG4gICAgY3JlYXRlZEJ5OiBhbnk7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBub2RlSWQ6IHN0cmluZztcbiAgICBsaW5rOiBib29sZWFuO1xuICAgIG1pbWVUeXBlOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHByZXZpZXdTdGF0dXM6IHN0cmluZztcbiAgICByZWxhdGVkQ29udGVudDogYm9vbGVhbjtcbiAgICBzaW1wbGVUeXBlOiBzdHJpbmc7XG4gICAgdGh1bWJuYWlsVXJsOiBzdHJpbmc7XG4gICAgY29udGVudFJhd1VybDogc3RyaW5nO1xuICAgIGNvbnRlbnRCbG9iOiBCbG9iO1xuICAgIHRodW1ibmFpbFN0YXR1czogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3Iob2JqPzogYW55KSB7XG4gICAgICAgIHRoaXMuY29udGVudEF2YWlsYWJsZSA9IG9iaiAmJiBvYmouY29udGVudEF2YWlsYWJsZTtcbiAgICAgICAgdGhpcy5jcmVhdGVkID0gb2JqICYmIG9iai5jcmVhdGVkO1xuICAgICAgICB0aGlzLmNyZWF0ZWRCeSA9IG9iaiAmJiBvYmouY3JlYXRlZEJ5IHx8IHt9O1xuICAgICAgICB0aGlzLmlkID0gb2JqICYmIG9iai5pZDtcbiAgICAgICAgdGhpcy5saW5rID0gb2JqICYmIG9iai5saW5rO1xuICAgICAgICB0aGlzLm1pbWVUeXBlID0gb2JqICYmIG9iai5taW1lVHlwZTtcbiAgICAgICAgdGhpcy5uYW1lID0gb2JqICYmIG9iai5uYW1lO1xuICAgICAgICB0aGlzLnByZXZpZXdTdGF0dXMgPSBvYmogJiYgb2JqLnByZXZpZXdTdGF0dXM7XG4gICAgICAgIHRoaXMucmVsYXRlZENvbnRlbnQgPSBvYmogJiYgb2JqLnJlbGF0ZWRDb250ZW50O1xuICAgICAgICB0aGlzLnNpbXBsZVR5cGUgPSBvYmogJiYgb2JqLnNpbXBsZVR5cGU7XG4gICAgICAgIHRoaXMudGh1bWJuYWlsU3RhdHVzID0gb2JqICYmIG9iai50aHVtYm5haWxTdGF0dXM7XG4gICAgICAgIHRoaXMubm9kZUlkID0gb2JqICYmIG9iai5ub2RlSWQ7XG4gICAgfVxuXG4gICAgaGFzUHJldmlld1N0YXR1cygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJldmlld1N0YXR1cyA9PT0gJ3N1cHBvcnRlZCcgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgaXNUeXBlSW1hZ2UoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpbXBsZVR5cGUgPT09ICdpbWFnZScgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgaXNUeXBlUGRmKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGVUeXBlID09PSAncGRmJyA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBpc1R5cGVEb2MoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpbXBsZVR5cGUgPT09ICd3b3JkJyB8fCB0aGlzLnNpbXBsZVR5cGUgPT09ICdjb250ZW50JyA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBpc1RodW1ibmFpbFJlYWR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50aHVtYm5haWxTdGF0dXMgPT09ICdjcmVhdGVkJztcbiAgICB9XG5cbiAgICBpc1RodW1ibmFpbFN1cHBvcnRlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNUeXBlSW1hZ2UoKSB8fCAoKHRoaXMuaXNUeXBlUGRmKCkgfHwgdGhpcy5pc1R5cGVEb2MoKSkgJiYgdGhpcy5pc1RodW1ibmFpbFJlYWR5KCkpO1xuICAgIH1cbn1cbiJdfQ==
