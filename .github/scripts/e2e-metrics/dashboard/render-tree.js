'use strict';

function createGroup(kind, name, key, level) {
  return { kind, name, key, level, groups: new Map(), tests: [] };
}

function getGroupKey(groupNames) {
  return JSON.stringify(groupNames);
}

function getGroupNamesOfTest(test) {
  return [test.suite, test.file, ...splitTitle(test).describes];
}

function expandGroupsOfTest(index) {
  const [suite, file, title] = metrics.tests[index];
  const groupNames = getGroupNamesOfTest({ suite, file, title });
  groupNames.forEach((_, level) => userToggledGroups.set(getGroupKey(groupNames.slice(0, level + 1)), true));
}

function getGroupKind(level) {
  if (level === 0) return 'suite';
  if (level === 1) return 'file';
  return 'describe';
}

function buildTree(tests) {
  const root = createGroup('root', '', '', -1);
  const openIndex = getOpenTestIndex();
  for (const test of tests) {
    const groupNames = getGroupNamesOfTest(test);
    let node = root;
    groupNames.forEach((name, level) => {
      if (!node.groups.has(name)) {
        node.groups.set(name, createGroup(getGroupKind(level), name, getGroupKey(groupNames.slice(0, level + 1)), level));
      }
      node = node.groups.get(name);
      if (test.index === openIndex) node.containsOpenTest = true;
    });
    node.tests.push(test);
  }
  summarizeGroup(root);
  return root;
}

function summarizeGroup(group) {
  const totals = { testCount: 0, runs: 0, retries: 0, retried: 0, failures: 0, durationSum: 0, durationCount: 0, setupSum: 0, max: 0 };
  const addToTotals = (item, testCount) => {
    totals.testCount += testCount;
    for (const key of ['runs', 'retries', 'retried', 'failures', 'durationSum', 'durationCount', 'setupSum']) totals[key] += item[key];
    totals.max = Math.max(totals.max, item.max);
  };
  for (const child of group.groups.values()) addToTotals(summarizeGroup(child), child.testCount);
  for (const test of group.tests) addToTotals(test, 1);
  Object.assign(group, totals, {
    avg: totals.durationCount ? totals.durationSum / totals.durationCount : 0,
    setup: totals.durationCount ? totals.setupSum / totals.durationCount : 0,
    rate: totals.runs ? totals.retried / totals.runs : 0
  });
  return group;
}

function isGroupOpen(group, siblingCount) {
  if (userToggledGroups.has(group.key)) return userToggledGroups.get(group.key);
  const searching = Boolean(state.q.trim());
  const onlyGroupAtThisLevel = siblingCount === 1;
  return searching || onlyGroupAtThisLevel || Boolean(group.containsOpenTest);
}

function renderSuiteHealth(name) {
  const stats = view.suiteStats.get(getSuiteStatsKey(name));
  if (!stats || state.tab === 'excluded') return '';
  const parts = [];
  if (stats.failedRuns) {
    const environmentPart = stats.environmentFailedRuns ? ` (${numberFormat.format(stats.environmentFailedRuns)} on an environment check)` : '';
    parts.push(
      `<span class="aca-is-failed">CI job failed in ${numberFormat.format(stats.failedRuns)} of ${pluralize(stats.runs, 'run')}</span>${environmentPart}`
    );
  }
  if (stats.incidents) {
    parts.push(pluralize(stats.incidents, 'suite incident'));
  }
  if (!parts.length) return '';
  return `
    <div class="aca-suite-timing" title="${escapeHtml(SUITE_HEALTH_HELP)}">${parts.join(' · ')}</div>
  `;
}

function renderSuiteTiming(name) {
  const times = view.suiteStats.get(getSuiteStatsKey(name));
  if (!times?.jobs || state.tab === 'excluded') return '';
  const share = times.setup / times.total;
  const formatAverageSeconds = (sum) => formatDuration((sum / times.jobs) * 1000);
  const title = `Average of ${pluralize(times.jobs, 'suite job')} in this period. Setup is the time before the tests start: runner preparation, ACS deploy, installs and browser setup.`;
  return `
    <div class="aca-suite-timing" title="${title}">
      CI job ${formatAverageSeconds(times.total)} on average:
      ${formatAverageSeconds(times.setup)} setup (${formatPercent(share)}),
      ${formatAverageSeconds(times.tests)} tests
    </div>
  `;
}

function renderTreeTestTitle(test) {
  return `
    <div class="aca-test-title">${escapeAndLinkTestCaseIds(splitTitle(test).name)}</div>
    <div class="aca-test-meta">${renderSourceLink(test)}</div>
  `;
}

function renderGroupRow(group, open, columns, levelStyle) {
  const name = `
    <div class="aca-group-name">
      <span class="aca-chevron" aria-hidden="true">${open ? '▾' : '▸'}</span>
      ${renderKindBadge(group.kind)}
      ${escapeHtml(group.name)}
      <span class="aca-count-of">${pluralize(group.testCount, 'test')}</span>
    </div>
    ${group.kind === 'suite' ? `${renderSuiteTiming(group.name)}${renderSuiteHealth(group.name)}` : ''}
  `;
  const cells = columns
    .map((column) =>
      column.key === 'title'
        ? `<td class="${getCellClass(column)} aca-tree-cell" style="${levelStyle}">${name}</td>`
        : `<td class="${getCellClass(column)}">${column.render(group)}</td>`
    )
    .join('');
  return `
    <tr
      class="aca-group-row ${GROUP_KINDS[group.kind].rowClass}"
      tabindex="0"
      aria-expanded="${open}"
      data-group="${escapeHtml(group.key)}"
    >
      <td></td>
      ${cells}
    </tr>
  `;
}

function renderTreeRows(group, columns, sort) {
  const getDisplayName = (item) => (item.kind ? item.name : splitTitle(item).name);
  const getSortValue = (item) => (sort.key === 'title' ? getDisplayName(item) : item[sort.key]);
  const sign = sort.dir === 'asc' ? 1 : -1;
  const children = [...group.groups.values(), ...group.tests].sort((first, second) => {
    const firstValue = getSortValue(first);
    const secondValue = getSortValue(second);
    const comparison = typeof firstValue === 'string' ? firstValue.localeCompare(secondValue) : firstValue - secondValue;
    return comparison * sign || Boolean(second.kind) - Boolean(first.kind) || getDisplayName(first).localeCompare(getDisplayName(second));
  });
  const levelStyle = `--level:${group.level + 1}`;
  return children
    .map((child) => {
      if (!child.kind) return renderTestRow(child, columns, '<td></td>', renderTreeTestTitle, levelStyle);
      const open = isGroupOpen(child, group.groups.size);
      ui.visibleGroupKeys.push(child.key);
      const row = renderGroupRow(child, open, columns, levelStyle);
      return open ? `${row}${renderTreeRows(child, columns, sort)}` : row;
    })
    .join('');
}

function renderTree(rows, columns, sort, legend) {
  ui.visibleGroupKeys = [];
  const body = renderTreeRows(buildTree(rows), columns, sort);
  elements.panel.innerHTML = `
    <div class="aca-tree-tools">
      <button type="button" class="aca-link-button" data-groups="open">Expand all</button>
      <button type="button" class="aca-link-button" data-groups="close">Collapse all</button>
    </div>
    <div class="aca-table-wrap">
      <table class="aca-tree">
        <thead>${renderHeaderRow(columns, sort, '')}</thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    ${legend}
  `;
}

function expandAllGroups(open) {
  if (!open) {
    ui.visibleGroupKeys.forEach((key) => userToggledGroups.set(key, false));
    render();
    return;
  }
  let hiddenGroupsRemain = true;
  while (hiddenGroupsRemain) {
    const visibleGroupCountBefore = ui.visibleGroupKeys.length;
    ui.visibleGroupKeys.forEach((key) => userToggledGroups.set(key, true));
    render();
    hiddenGroupsRemain = ui.visibleGroupKeys.length > visibleGroupCountBefore;
  }
}
