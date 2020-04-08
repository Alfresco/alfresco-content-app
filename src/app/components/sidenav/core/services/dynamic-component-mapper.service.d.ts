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
import { Type } from '@angular/core';
export interface DynamicComponentModel {
  type: string;
}
export declare type DynamicComponentResolveFunction = (
  model: DynamicComponentModel
) => Type<{}>;
export declare class DynamicComponentResolver {
  static fromType(type: Type<{}>): DynamicComponentResolveFunction;
}
export declare abstract class DynamicComponentMapper {
  protected defaultValue: Type<{}>;
  protected types: {
    [key: string]: DynamicComponentResolveFunction;
  };
  /**
   * Gets the currently active DynamicComponentResolveFunction for a field type.
   * @param type The type whose resolver you want
   * @param defaultValue Default type returned for types that are not yet mapped
   * @returns Resolver function
   */
  getComponentTypeResolver(
    type: string,
    defaultValue?: Type<{}>
  ): DynamicComponentResolveFunction;
  /**
   * Sets or optionally replaces a DynamicComponentResolveFunction for a field type.
   * @param type The type whose resolver you want to set
   * @param resolver The new resolver function
   * @param override The new resolver will only replace an existing one if this parameter is true
   */
  setComponentTypeResolver(
    type: string,
    resolver: DynamicComponentResolveFunction,
    override?: boolean
  ): void;
  /**
   * Finds the component type that is needed to render a form field.
   * @param model Form field model for the field to render
   * @param defaultValue Default type returned for field types that are not yet mapped.
   * @returns Component type
   */
  resolveComponentType(
    model: DynamicComponentModel,
    defaultValue?: Type<{}>
  ): Type<{}>;
}
