'use strict';

function collectExcludedTests() {
  return Object.entries(metrics.excluded || {})
    .flatMap(([suite, { tests }]) =>
      tests.map(([file, title, path, line, id, reason, scope]) => ({ index: -1, suite, file, title, path, line, id, reason, scope }))
    )
    .filter(matchesFilters);
}

function renderExclusionReason(reason) {
  if (!/^https?:\/\//.test(reason)) return escapeHtml(reason);
  const ticket = reason.split('/').findLast(Boolean);
  return renderExternalLink(reason, escapeHtml(ticket));
}

function buildExcludedColumns() {
  return [
    {
      key: 'title',
      label: 'Test',
      cls: 'aca-test',
      help: EXCLUDED_HELP.title,
      sortValue: (test) => `${test.suite} ${test.title}`
    },
    {
      key: 'scope',
      label: 'Excluded for',
      help: EXCLUDED_HELP.scope,
      sortValue: (test) => test.scope,
      render: (item) => (item.kind ? '' : escapeHtml(EXCLUDED_SCOPE_LABELS[item.scope] || item.scope))
    },
    {
      key: 'ticket',
      label: 'Ticket',
      help: EXCLUDED_HELP.ticket,
      sortValue: (test) => test.reason,
      render: (item) => (item.kind ? '' : renderExclusionReason(item.reason))
    }
  ];
}

function renderExcludedTestRow(test, columns, levelStyle) {
  const cells = columns
    .map((column) =>
      column.key === 'title'
        ? `<td class="${getCellClass(column)} aca-tree-cell" style="${levelStyle}">${renderTreeTestTitle(test)}</td>`
        : `<td class="${getCellClass(column)}">${column.render(test)}</td>`
    )
    .join('');
  return `
    <tr>
      <td></td>
      ${cells}
    </tr>
  `;
}

function renderExcludedTreeRows(group, columns, sort) {
  const levelStyle = `--level:${group.level + 1}`;
  const groupSign = sort.key === 'title' && sort.dir === 'desc' ? -1 : 1;
  const groups = [...group.groups.values()].sort((first, second) => first.name.localeCompare(second.name) * groupSign);
  const groupRows = groups.map((child) => {
    const open = isGroupOpen(child, group.groups.size);
    ui.visibleGroupKeys.push(child.key);
    const row = renderGroupRow(child, open, columns, levelStyle);
    return open ? `${row}${renderExcludedTreeRows(child, columns, sort)}` : row;
  });
  const testRows = group.tests.map((test) => renderExcludedTestRow(test, columns, levelStyle));
  return [...groupRows, ...testRows].join('');
}

function renderExcluded(rows) {
  const columns = buildExcludedColumns();
  const sort = sortRows(rows, columns, (first, second) => first.title.localeCompare(second.title));
  const legend = renderLegend(columns.map((column) => [column.label, column.help]));
  if (!rows.length) {
    const empty = state.q || state.suite ? 'No excluded tests match these filters.' : 'No tests are excluded.';
    elements.panel.innerHTML = `
      <p class="aca-empty">${empty}</p>
      ${legend}
    `;
    return;
  }
  ui.visibleGroupKeys = [];
  const body = renderExcludedTreeRows(buildTree(rows), columns, sort);
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
