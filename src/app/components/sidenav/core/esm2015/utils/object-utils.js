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
export class ObjectUtils {
  /**
   * Gets a value from an object by composed key
   * ObjectUtils.getValue({ item: { nodeType: 'cm:folder' }}, 'item.nodeType') ==> 'cm:folder'
   * @param {?} target
   * @param {?} key
   * @return {?}
   */
  static getValue(target, key) {
    if (!target) {
      return undefined;
    }
    /** @type {?} */
    const keys = key.split('.');
    key = '';
    do {
      key += keys.shift();
      /** @type {?} */
      const value = target[key];
      if (value !== undefined && (typeof value === 'object' || !keys.length)) {
        target = value;
        key = '';
      } else if (!keys.length) {
        target = undefined;
      } else {
        key += '.';
      }
    } while (keys.length);
    return target;
  }
  /**
   * @param {...?} objects
   * @return {?}
   */
  static merge(...objects) {
    /** @type {?} */
    const result = {};
    objects.forEach(
      /**
       * @param {?} source
       * @return {?}
       */
      source => {
        Object.keys(source).forEach(
          /**
           * @param {?} prop
           * @return {?}
           */
          prop => {
            if (prop in result && Array.isArray(result[prop])) {
              result[prop] = result[prop].concat(source[prop]);
            } else if (prop in result && typeof result[prop] === 'object') {
              result[prop] = ObjectUtils.merge(result[prop], source[prop]);
            } else {
              result[prop] = source[prop];
            }
          }
        );
      }
    );
    return result;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LXV0aWxzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsidXRpbHMvb2JqZWN0LXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE1BQU0sT0FBTyxXQUFXOzs7Ozs7OztJQU9wQixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQVcsRUFBRSxHQUFXO1FBRXBDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDVCxPQUFPLFNBQVMsQ0FBQztTQUNwQjs7Y0FFSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDM0IsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUVULEdBQUc7WUFDQyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztrQkFDZCxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUN6QixJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3BFLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2YsR0FBRyxHQUFHLEVBQUUsQ0FBQzthQUNaO2lCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNyQixNQUFNLEdBQUcsU0FBUyxDQUFDO2FBQ3RCO2lCQUFNO2dCQUNILEdBQUcsSUFBSSxHQUFHLENBQUM7YUFDZDtTQUNKLFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUV0QixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPOztjQUNiLE1BQU0sR0FBRyxFQUFFO1FBRWpCLE9BQU8sQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU87Ozs7WUFBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNqQyxJQUFJLElBQUksSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtvQkFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQ3BEO3FCQUFNLElBQUksSUFBSSxJQUFJLE1BQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxRQUFRLEVBQUU7b0JBQzNELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDaEU7cUJBQU07b0JBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDL0I7WUFDTCxDQUFDLEVBQUMsQ0FBQztRQUNQLENBQUMsRUFBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGNsYXNzIE9iamVjdFV0aWxzIHtcbiAgICAvKipcbiAgICAgKiBHZXRzIGEgdmFsdWUgZnJvbSBhbiBvYmplY3QgYnkgY29tcG9zZWQga2V5XG4gICAgICogT2JqZWN0VXRpbHMuZ2V0VmFsdWUoeyBpdGVtOiB7IG5vZGVUeXBlOiAnY206Zm9sZGVyJyB9fSwgJ2l0ZW0ubm9kZVR5cGUnKSA9PT4gJ2NtOmZvbGRlcidcbiAgICAgKiBAcGFyYW0gdGFyZ2V0XG4gICAgICogQHBhcmFtIGtleVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRWYWx1ZSh0YXJnZXQ6IGFueSwga2V5OiBzdHJpbmcpOiBhbnkge1xuXG4gICAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qga2V5cyA9IGtleS5zcGxpdCgnLicpO1xuICAgICAgICBrZXkgPSAnJztcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBrZXkgKz0ga2V5cy5zaGlmdCgpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0YXJnZXRba2V5XTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnIHx8ICFrZXlzLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBrZXkgPSAnJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBrZXkgKz0gJy4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlIChrZXlzLmxlbmd0aCk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWVyZ2UoLi4ub2JqZWN0cyk6IGFueSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIG9iamVjdHMuZm9yRWFjaCgoc291cmNlKSA9PiB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcCBpbiByZXN1bHQgJiYgQXJyYXkuaXNBcnJheShyZXN1bHRbcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wXSA9IHJlc3VsdFtwcm9wXS5jb25jYXQoc291cmNlW3Byb3BdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb3AgaW4gcmVzdWx0ICYmIHR5cGVvZiByZXN1bHRbcHJvcF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wXSA9IE9iamVjdFV0aWxzLm1lcmdlKHJlc3VsdFtwcm9wXSwgc291cmNlW3Byb3BdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuIl19
