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
 * @param {?} node
 * @return {?}
 */
export function isLocked(node) {
  const { entry } = node;
  return (
    (entry && entry.isLocked) ||
    (entry.properties &&
      (entry.properties['cm:lockType'] === 'READ_ONLY_LOCK' ||
        entry.properties['cm:lockType'] === 'WRITE_LOCK'))
  );
}
/**
 * @param {?} node
 * @return {?}
 */
export function isLibrary(node) {
  const { entry } = node;
  return (
    (entry.guid &&
      entry.id &&
      entry.preset &&
      entry.title &&
      entry.visibility) ||
    entry.nodeType === 'st:site'
  );
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS51dGlscy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL25vZGUudXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsTUFBTSxVQUFVLFFBQVEsQ0FBQyxJQUFxQjtVQUN0QyxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUk7SUFFdEIsT0FBTyxDQUNMLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDekIsQ0FBQyxLQUFLLENBQUMsVUFBVTtZQUNmLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxnQkFBZ0I7Z0JBQ25ELEtBQUssQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FDdkQsQ0FBQztBQUNKLENBQUM7Ozs7O0FBRUQsTUFBTSxVQUFVLFNBQVMsQ0FBQyxJQUEyQjtVQUM3QyxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUk7SUFFdEIsT0FBTyxDQUNMLENBQUMsS0FBSyxDQUFDLElBQUk7UUFDVCxLQUFLLENBQUMsRUFBRTtRQUNSLEtBQUssQ0FBQyxNQUFNO1FBQ1osS0FBSyxDQUFDLEtBQUs7UUFDWCxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ25CLEtBQUssQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUM3QixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNMb2NrZWQobm9kZTogeyBlbnRyeTogTm9kZSB9KTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgZW50cnkgfSA9IG5vZGU7XG5cbiAgcmV0dXJuIChcbiAgICAoZW50cnkgJiYgZW50cnkuaXNMb2NrZWQpIHx8XG4gICAgKGVudHJ5LnByb3BlcnRpZXMgJiZcbiAgICAgIChlbnRyeS5wcm9wZXJ0aWVzWydjbTpsb2NrVHlwZSddID09PSAnUkVBRF9PTkxZX0xPQ0snIHx8XG4gICAgICAgIGVudHJ5LnByb3BlcnRpZXNbJ2NtOmxvY2tUeXBlJ10gPT09ICdXUklURV9MT0NLJykpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0xpYnJhcnkobm9kZTogeyBlbnRyeTogTm9kZSB8IGFueSB9KTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgZW50cnkgfSA9IG5vZGU7XG5cbiAgcmV0dXJuIChcbiAgICAoZW50cnkuZ3VpZCAmJlxuICAgICAgZW50cnkuaWQgJiZcbiAgICAgIGVudHJ5LnByZXNldCAmJlxuICAgICAgZW50cnkudGl0bGUgJiZcbiAgICAgIGVudHJ5LnZpc2liaWxpdHkpIHx8XG4gICAgZW50cnkubm9kZVR5cGUgPT09ICdzdDpzaXRlJ1xuICApO1xufVxuIl19
