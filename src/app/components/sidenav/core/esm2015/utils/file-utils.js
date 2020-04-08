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
/**
 * @record
 */
export function FileInfo() {}
if (false) {
  /** @type {?|undefined} */
  FileInfo.prototype.entry;
  /** @type {?|undefined} */
  FileInfo.prototype.file;
  /** @type {?|undefined} */
  FileInfo.prototype.relativeFolder;
}
export class FileUtils {
  /**
   * @param {?} folder
   * @return {?}
   */
  static flatten(folder) {
    /** @type {?} */
    const reader = folder.createReader();
    /** @type {?} */
    const files = [];
    return new Promise
    /**
     * @param {?} resolve
     * @return {?}
     */(resolve => {
      /** @type {?} */
      const iterations = [];
      /**
       * @return {?}
       */
      (function traverse() {
        reader.readEntries(
          /**
           * @param {?} entries
           * @return {?}
           */
          entries => {
            if (!entries.length) {
              Promise.all(iterations).then(
                /**
                 * @return {?}
                 */
                () => resolve(files)
              );
            } else {
              iterations.push(
                Promise.all(
                  entries.map(
                    /**
                     * @param {?} entry
                     * @return {?}
                     */
                    entry => {
                      if (entry.isFile) {
                        return new Promise
                        /**
                         * @param {?} resolveFile
                         * @return {?}
                         */(resolveFile => {
                          entry.file(
                            /**
                             * @param {?} file
                             * @return {?}
                             */
                            function(file) {
                              files.push({
                                entry: entry,
                                file: file,
                                relativeFolder: entry.fullPath.replace(
                                  /\/[^\/]*$/,
                                  ''
                                )
                              });
                              resolveFile();
                            }
                          );
                        });
                      } else {
                        return FileUtils.flatten(entry).then(
                          /**
                           * @param {?} result
                           * @return {?}
                           */
                          result => {
                            files.push(...result);
                          }
                        );
                      }
                    }
                  )
                )
              );
              // Try calling traverse() again for the same dir, according to spec
              traverse();
            }
          }
        );
      })();
    });
  }
  /**
   * @param {?} fileList
   * @return {?}
   */
  static toFileArray(fileList) {
    /** @type {?} */
    const result = [];
    if (fileList && fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        result.push(fileList[i]);
      }
    }
    return result;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS11dGlscy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInV0aWxzL2ZpbGUtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsOEJBSUM7OztJQUhHLHlCQUFZOztJQUNaLHdCQUFZOztJQUNaLGtDQUF3Qjs7QUFHNUIsTUFBTSxPQUFPLFNBQVM7Ozs7O0lBRWxCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBVzs7Y0FDaEIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUU7O2NBQzlCLEtBQUssR0FBZSxFQUFFO1FBQzVCLE9BQU8sSUFBSSxPQUFPOzs7O1FBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTs7a0JBQ3JCLFVBQVUsR0FBRyxFQUFFO1lBQ3JCOzs7WUFBQyxTQUFTLFFBQVE7Z0JBQ2QsTUFBTSxDQUFDLFdBQVc7Ozs7Z0JBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7d0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSTs7O3dCQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDO3FCQUN0RDt5QkFBTTt3QkFDSCxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUc7Ozs7d0JBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTs0QkFDOUMsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dDQUNkLE9BQU8sSUFBSSxPQUFPOzs7O2dDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7b0NBQy9CLEtBQUssQ0FBQyxJQUFJOzs7O29DQUFDLFVBQVUsSUFBVTt3Q0FDM0IsS0FBSyxDQUFDLElBQUksQ0FBQzs0Q0FDUCxLQUFLLEVBQUUsS0FBSzs0Q0FDWixJQUFJLEVBQUUsSUFBSTs0Q0FDVixjQUFjLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQzt5Q0FDMUQsQ0FBQyxDQUFDO3dDQUNILFdBQVcsRUFBRSxDQUFDO29DQUNsQixDQUFDLEVBQUMsQ0FBQztnQ0FDUCxDQUFDLEVBQUMsQ0FBQzs2QkFDTjtpQ0FBTTtnQ0FDSCxPQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSTs7OztnQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO29DQUM1QyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7Z0NBQzFCLENBQUMsRUFBQyxDQUFDOzZCQUNOO3dCQUNMLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQzt3QkFDTCxtRUFBbUU7d0JBQ25FLFFBQVEsRUFBRSxDQUFDO3FCQUNkO2dCQUNMLENBQUMsRUFBQyxDQUFDO1lBQ1AsQ0FBQyxFQUFDLEVBQUUsQ0FBQztRQUNULENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQWtCOztjQUMzQixNQUFNLEdBQUcsRUFBRTtRQUVqQixJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM1QjtTQUNKO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBGaWxlSW5mbyB7XG4gICAgZW50cnk/OiBhbnk7XG4gICAgZmlsZT86IEZpbGU7XG4gICAgcmVsYXRpdmVGb2xkZXI/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBGaWxlVXRpbHMge1xuXG4gICAgc3RhdGljIGZsYXR0ZW4oZm9sZGVyOiBhbnkpOiBQcm9taXNlPEZpbGVJbmZvW10+IHtcbiAgICAgICAgY29uc3QgcmVhZGVyID0gZm9sZGVyLmNyZWF0ZVJlYWRlcigpO1xuICAgICAgICBjb25zdCBmaWxlczogRmlsZUluZm9bXSA9IFtdO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZXJhdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIChmdW5jdGlvbiB0cmF2ZXJzZSgpIHtcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEVudHJpZXMoKGVudHJpZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbnRyaWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoaXRlcmF0aW9ucykudGhlbigoKSA9PiByZXNvbHZlKGZpbGVzKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRpb25zLnB1c2goUHJvbWlzZS5hbGwoZW50cmllcy5tYXAoKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5LmlzRmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmVGaWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyeS5maWxlKGZ1bmN0aW9uIChmaWxlOiBGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5OiBlbnRyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmVGb2xkZXI6IGVudHJ5LmZ1bGxQYXRoLnJlcGxhY2UoL1xcL1teXFwvXSokLywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUZpbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRmlsZVV0aWxzLmZsYXR0ZW4oZW50cnkpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXMucHVzaCguLi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJ5IGNhbGxpbmcgdHJhdmVyc2UoKSBhZ2FpbiBmb3IgdGhlIHNhbWUgZGlyLCBhY2NvcmRpbmcgdG8gc3BlY1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhdmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHRvRmlsZUFycmF5KGZpbGVMaXN0OiBGaWxlTGlzdCk6IEZpbGVbXSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gICAgICAgIGlmIChmaWxlTGlzdCAmJiBmaWxlTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZmlsZUxpc3RbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG4iXX0=
