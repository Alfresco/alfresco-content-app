/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

export const errorStrings = {
  errorMessageNotPresent: 'Error message is not displayed',
  nameIsRequiredError: 'Name is required',
  nameWithSpecialCharactersError: `Name can't contain these characters * " < > \\ / ? : |`,
  nameEndWithDotError: `Name can't end with a period .`,
  nameContainOnlySpacesError: `Name can't contain only spaces`,
  titleLengthLimitError: 'Use 256 characters or less for title',
  descriptionLengthLimitError: 'Use 512 characters or less for description',
  nameAlreadyUsedError: 'This name is already in use, try a different name.',

  folderNameIsRequired: 'Folder name is required',
  folderNameCantEndWithAPeriod: `Folder name can't end with a period .`,
  folderNameCantContainTheseCharacters: `Folder name can't contain these characters`,
  folderNameCantContainOnlySpaces: `Folder name can't contain only spaces`,
  thereIsAlreadyAFolderWithThisName: `There's already a folder with this name. Try a different name.`
};
