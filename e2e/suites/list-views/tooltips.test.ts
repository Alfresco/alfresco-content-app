/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { SIDEBAR_LABELS } from '../../configs';
import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('File / folder tooltips', () => {
    const username = `user-${Utils.random()}`;

    const apis = {
        admin: new RepoClient(),
        user: new RepoClient(username, username)
    };

    const parent = `parent-${Utils.random()}`;

    const file = `file1-${Utils.random()}`;
    const fileWithDesc = `file2-${Utils.random()}`;
    const fileWithTitle = `file3-${Utils.random()}`;
    const fileWithTitleAndDesc = `file4-${Utils.random()}`;
    const fileNameEqTitleEqDesc = `file5-${Utils.random()}`;
    const fileNameEqTitleDiffDesc = `file6-${Utils.random()}`;
    const fileNameEqDescDiffTitle = `file7-${Utils.random()}`;
    const fileTitleEqDesc = `file8-${Utils.random()}`;
    let parentId, file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id;

    const fileTitle = 'file title';
    const fileDescription = 'file description';

    const loginPage = new LoginPage();
    const logoutPage = new LogoutPage();
    const page = new BrowsingPage();
    const { dataTable } = page;

    beforeAll(done => {
        apis.admin.people.createUser(username)
            .then(() => apis.user.nodes.createFolder( parent ))
            .then(resp => parentId = resp.data.entry.id)

            .then(() => Promise.all([
                apis.user.nodes.createFile(file, parentId).then(resp => file1Id = resp.data.entry.id),
                apis.user.nodes.createFile(fileWithDesc, parentId, '', fileDescription).then(resp => file2Id = resp.data.entry.id),
                apis.user.nodes.createFile(fileWithTitle, parentId, fileTitle).then(resp => file3Id = resp.data.entry.id),
                apis.user.nodes.createFile(fileWithTitleAndDesc, parentId, fileTitle, fileDescription)
                    .then(resp => file4Id = resp.data.entry.id),
                apis.user.nodes.createFile(fileNameEqTitleEqDesc, parentId, fileNameEqTitleEqDesc, fileNameEqTitleEqDesc)
                    .then(resp => file5Id = resp.data.entry.id),
                apis.user.nodes.createFile(fileNameEqTitleDiffDesc, parentId, fileNameEqTitleDiffDesc, fileDescription)
                    .then(resp => file6Id = resp.data.entry.id),
                apis.user.nodes.createFile(fileNameEqDescDiffTitle, parentId, fileTitle, fileNameEqDescDiffTitle)
                    .then(resp => file7Id = resp.data.entry.id),
                apis.user.nodes.createFile(fileTitleEqDesc, parentId, fileTitle, fileTitle).then(resp => file8Id = resp.data.entry.id)
            ]))

            .then(() => apis.user.shared.shareFilesByIds([ file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id ]))

            .then(() => apis.user.favorites.addFavoritesByIds('file', [
                file1Id, file2Id, file3Id, file4Id, file5Id, file6Id, file7Id, file8Id
            ]))

            .then(() => loginPage.loginWith(username))
            .then(done);
    });

    afterAll(done => {
        Promise.all([
            apis.user.nodes.deleteNodes([ parent ]),
            apis.admin.trashcan.emptyTrash(),
            logoutPage.load()
        ])
        .then(done);
    });

    xit('');

    describe('on Personal Files', () => {
        beforeAll(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES)
                .then(() => dataTable.doubleClickOnItemNameRow(parent))
                .then(done);
        });

        it('File with name, no title, no description', () => {
            expect(dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
        });

        it('File with name and description, no title', () => {
            expect(dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
        });

        it('File with name and title, no description', () => {
            expect(dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
        });

        it('File with name and title and description, all different', () => {
            expect(dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
        });

        it('File with name and title and description, all equal', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
        });

        it('File with name = title, different description', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
        });

        it('File with name = description, different title', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
        });

        it('File with title = description, different name', () => {
            expect(dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
        });
    });

    describe('on Recent Files', () => {
        beforeAll(done => {
            apis.user.search.waitForApi(username, { expect: 8 })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.RECENT_FILES))
                .then(done);
        });

        it('File with name, no title, no description', () => {
            expect(dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
        });

        it('File with name and description, no title', () => {
            expect(dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
        });

        it('File with name and title, no description', () => {
            expect(dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
        });

        it('File with name and title and description, all different', () => {
            expect(dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
        });

        it('File with name and title and description, all equal', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
        });

        it('File with name = title, different description', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
        });

        it('File with name = description, different title', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
        });

        it('File with title = description, different name', () => {
            expect(dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
        });
    });

    // disabled until ACA-518 is done
    xdescribe('on Shared Files', () => {
        beforeAll(done => {
            apis.user.shared.waitForApi({ expect: 8 })
                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.SHARED_FILES))
                .then(done);
        });

        it('File with name, no title, no description', () => {
            expect(dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
        });

        it('File with name and description, no title', () => {
            expect(dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
        });

        it('File with name and title, no description', () => {
            expect(dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
        });

        it('File with name and title and description, all different', () => {
            expect(dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
        });

        it('File with name and title and description, all equal', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
        });

        it('File with name = title, different description', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
        });

        it('File with name = description, different title', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
        });

        it('File with title = description, different name', () => {
            expect(dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
        });
    });

    describe('on Favorites', () => {
        beforeAll(done => {
            page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.FAVORITES).then(done);
        });

        it('File with name, no title, no description', () => {
            expect(dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
        });

        it('File with name and description, no title', () => {
            expect(dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
        });

        it('File with name and title, no description', () => {
            expect(dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
        });

        it('File with name and title and description, all different', () => {
            expect(dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
        });

        it('File with name and title and description, all equal', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
        });

        it('File with name = title, different description', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
        });

        it('File with name = description, different title', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
        });

        it('File with title = description, different name', () => {
            expect(dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
        });
    });

    describe('on Trash', () => {
        const parentForTrash = `parent-${Utils.random()}`;
        let parentForTrashId, file1TrashId, file2TrashId, file3TrashId, file4TrashId;
        let file5TrashId, file6TrashId, file7TrashId, file8TrashId;

        beforeAll(done => {
            apis.user.nodes.createFolder( parentForTrash )
                .then(resp => parentForTrashId = resp.data.entry.id)
                .then(() => Promise.all([
                    apis.user.nodes.createFile(file, parentForTrashId)
                        .then(resp => file1TrashId = resp.data.entry.id),
                    apis.user.nodes.createFile(fileWithDesc, parentForTrashId, '', fileDescription)
                        .then(resp => file2TrashId = resp.data.entry.id),
                    apis.user.nodes.createFile(fileWithTitle, parentForTrashId, fileTitle)
                        .then(resp => file3TrashId = resp.data.entry.id),
                    apis.user.nodes.createFile(fileWithTitleAndDesc, parentForTrashId, fileTitle, fileDescription)
                        .then(resp => file4TrashId = resp.data.entry.id),
                    apis.user.nodes.createFile(fileNameEqTitleEqDesc, parentForTrashId, fileNameEqTitleEqDesc, fileNameEqTitleEqDesc)
                        .then(resp => file5TrashId = resp.data.entry.id),
                    apis.user.nodes.createFile(fileNameEqTitleDiffDesc, parentForTrashId, fileNameEqTitleDiffDesc, fileDescription)
                        .then(resp => file6TrashId = resp.data.entry.id),
                    apis.user.nodes.createFile(fileNameEqDescDiffTitle, parentForTrashId, fileTitle, fileNameEqDescDiffTitle)
                        .then(resp => file7TrashId = resp.data.entry.id),
                    apis.user.nodes.createFile(fileTitleEqDesc, parentForTrashId, fileTitle, fileTitle)
                        .then(resp => file8TrashId = resp.data.entry.id)
                ]))

                .then(() => apis.user.nodes.deleteNodesById([
                    file1TrashId, file2TrashId, file3TrashId, file4TrashId, file5TrashId, file6TrashId, file7TrashId, file8TrashId
                ], false))

                .then(() => page.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.TRASH))
                .then(done);
        });

        afterAll(done => {
            apis.user.nodes.deleteNodes([ parentForTrash ]).then(done);
        });

        it('File with name, no title, no description', () => {
            expect(dataTable.getItemNameTooltip(file)).toEqual(`${file}`);
        });

        it('File with name and description, no title', () => {
            expect(dataTable.getItemNameTooltip(fileWithDesc)).toEqual(`${fileWithDesc}\n${fileDescription}`);
        });

        it('File with name and title, no description', () => {
            expect(dataTable.getItemNameTooltip(fileWithTitle)).toEqual(`${fileWithTitle}\n${fileTitle}`);
        });

        it('File with name and title and description, all different', () => {
            expect(dataTable.getItemNameTooltip(fileWithTitleAndDesc)).toEqual(`${fileTitle}\n${fileDescription}`);
        });

        it('File with name and title and description, all equal', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqTitleEqDesc)).toEqual(`${fileNameEqTitleEqDesc}`);
        });

        it('File with name = title, different description', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqTitleDiffDesc)).toEqual(`${fileNameEqTitleDiffDesc}\n${fileDescription}`);
        });

        it('File with name = description, different title', () => {
            expect(dataTable.getItemNameTooltip(fileNameEqDescDiffTitle)).toEqual(`${fileTitle}\n${fileNameEqDescDiffTitle}`);
        });

        it('File with title = description, different name', () => {
            expect(dataTable.getItemNameTooltip(fileTitleEqDesc)).toEqual(`${fileTitle}`);
        });
    });
});
