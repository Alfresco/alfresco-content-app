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
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
export class LockedByComponent {
  constructor() {}
  /**
   * @return {?}
   */
  ngOnInit() {
    this.node = this.context.row.node;
  }
  /**
   * @return {?}
   */
  writeLockedBy() {
    return (
      this.node &&
      this.node.entry.properties &&
      this.node.entry.properties['cm:lockOwner'] &&
      this.node.entry.properties['cm:lockOwner'].displayName
    );
  }
}
LockedByComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'aca-locked-by',
        template: `
    <mat-icon class="locked_by--icon">lock</mat-icon>
    <span class="locked_by--name">{{ writeLockedBy() }}</span>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        encapsulation: ViewEncapsulation.None,
        host: {
          class: 'aca-locked-by'
        },
        styles: [
          '.aca-locked-by{display:flex;align-items:center;padding:0 10px;color:var(--theme-text-color,rgba(0,0,0,.54))}.aca-locked-by .locked_by--icon{font-size:14px;width:14px;height:14px}.aca-locked-by .locked_by--name{font-size:12px;padding:0 2px}'
        ]
      }
    ]
  }
];
/** @nocollapse */
LockedByComponent.ctorParameters = () => [];
LockedByComponent.propDecorators = {
  context: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  LockedByComponent.prototype.context;
  /** @type {?} */
  LockedByComponent.prototype.node;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ja2VkLWJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvbG9ja2VkLWJ5L2xvY2tlZC1ieS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBaUJ2QixNQUFNLE9BQU8saUJBQWlCO0lBTTVCLGdCQUFlLENBQUM7Ozs7SUFFaEIsUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQ3BDLENBQUM7Ozs7SUFFRCxhQUFhO1FBQ1gsT0FBTyxDQUNMLElBQUksQ0FBQyxJQUFJO1lBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTtZQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1lBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQ3ZELENBQUM7SUFDSixDQUFDOzs7WUFoQ0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixRQUFRLEVBQUU7OztHQUdUO2dCQUVELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRSxlQUFlO2lCQUN2Qjs7YUFDRjs7Ozs7c0JBRUUsS0FBSzs7OztJQUFOLG9DQUNhOztJQUViLGlDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE5vZGVFbnRyeSB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhY2EtbG9ja2VkLWJ5JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bWF0LWljb24gY2xhc3M9XCJsb2NrZWRfYnktLWljb25cIj5sb2NrPC9tYXQtaWNvbj5cbiAgICA8c3BhbiBjbGFzcz1cImxvY2tlZF9ieS0tbmFtZVwiPnt7IHdyaXRlTG9ja2VkQnkoKSB9fTwvc3Bhbj5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJy4vbG9ja2VkLWJ5LmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdhY2EtbG9ja2VkLWJ5J1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIExvY2tlZEJ5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KClcbiAgY29udGV4dDogYW55O1xuXG4gIG5vZGU6IE5vZGVFbnRyeTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5ub2RlID0gdGhpcy5jb250ZXh0LnJvdy5ub2RlO1xuICB9XG5cbiAgd3JpdGVMb2NrZWRCeSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5ub2RlICYmXG4gICAgICB0aGlzLm5vZGUuZW50cnkucHJvcGVydGllcyAmJlxuICAgICAgdGhpcy5ub2RlLmVudHJ5LnByb3BlcnRpZXNbJ2NtOmxvY2tPd25lciddICYmXG4gICAgICB0aGlzLm5vZGUuZW50cnkucHJvcGVydGllc1snY206bG9ja093bmVyJ10uZGlzcGxheU5hbWVcbiAgICApO1xuICB9XG59XG4iXX0=
