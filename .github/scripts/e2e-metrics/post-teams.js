/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

'use strict';

/**
 * Posts an Adaptive Card built by `weekly-report.js` (CARD_FILE, default `e2e-metrics-weekly/teams-card.json`)
 * to Teams (TEAMS_WEBHOOK_URL). Used to notify only after the dashboard has been deployed.
 */

const fs = require('fs');
const { postToTeams } = require('./lib');

async function main() {
  const cardFile = process.env.CARD_FILE || 'e2e-metrics-weekly/teams-card.json';
  await postToTeams(JSON.parse(fs.readFileSync(cardFile, 'utf8')));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
