/*
 * Copyright 2005-2019 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import * as angularJson from 'angular.json';

export const getApps = () => {
  return Object.keys(angularJson.projects)
    .map((projectName) => ({ name: projectName, ...angularJson.projects[projectName] }))
    .filter((project) => project.projectType === 'application')
    .filter((project) => project.name.indexOf('e2e') === -1);
};

export const getE2Es = () => {
  return Object.keys(angularJson.projects)
    .map((projectName) => ({ name: projectName, ...angularJson.projects[projectName] }))
    .filter((project) => project.projectType === 'application')
    .filter((project) => project.name.endsWith('-e2e'));
};

export const getLibs = () => {
  return Object.keys(angularJson.projects)
    .map((projectName) => ({ name: projectName, ...angularJson.projects[projectName] }))
    .filter((project) => project.projectType === 'library');
};
