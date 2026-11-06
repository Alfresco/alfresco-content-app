'use strict';

function buildTestColumns(rows) {
  const maxRate = Math.max(0, ...rows.map((test) => test.rate));
  const title = {
    key: 'title',
    label: 'Test',
    cls: 'aca-test',
    sortValue: (test) => `${test.suite} ${test.title}`,
    render: renderTestNameWithPath
  };
  const retries = {
    key: 'retries',
    label: 'Retries',
    num: true,
    render: (test) => `
      <span class="${test.retries ? 'aca-is-retried' : ''}">${numberFormat.format(test.retries)}</span>
      <span class="aca-count-of">in ${pluralize(test.runs, 'run')}</span>
    `
  };
  const rate = {
    key: 'rate',
    label: 'Retried runs',
    num: true,
    render: (test) =>
      renderMeasure(
        test.rate,
        maxRate,
        `
          ${numberFormat.format(test.retried)}
          <span class="aca-count-of">(${formatPercent(test.rate)})</span>
        `
      )
  };
  const failures = {
    key: 'failures',
    label: 'Failed runs',
    num: true,
    render: (test) => `
      <span class="${test.failures ? 'aca-is-failed' : ''}">
        ${numberFormat.format(test.failures)}
      </span>
    `
  };
  const avg = {
    key: 'avg',
    label: 'Avg duration',
    num: true,
    render: (test) =>
      test.durationCount
        ? formatDuration(test.avg)
        : `
          <span class="aca-secondary" title="No passed attempt with timing data in this period">–</span>
        `
  };
  const setup = { key: 'setup', label: 'Setup', num: true, render: (test) => (test.durationCount ? formatDuration(test.setup) : '') };
  const max = { key: 'max', label: 'Longest', num: true, render: (test) => (test.durationCount ? formatDuration(test.max) : '') };
  const runs = { key: 'runs', label: 'Runs', num: true, render: (test) => numberFormat.format(test.runs) };
  const trend = {
    key: 'trend',
    label: 'Trend',
    sortValue: (test) =>
      [...test.daily].reduce((sum, [date, status]) => sum + (view.dates.includes(date) ? TREND_SORT_WEIGHT_BY_DAY_RESULT[status] : 0), 0),
    render: renderTrendDots
  };
  if (state.tab === 'flaky') return [title, { ...retries, primary: true }, rate, failures, trend, avg];
  if (state.tab === 'slowest') return [title, { ...avg, primary: true }, setup, max, runs];
  return [title, runs, retries, rate, failures, avg, setup, max];
}

function renderTestRow(test, columns, leadCell, renderTitle, titleCellStyle) {
  const open = test.index === getOpenTestIndex();
  const cells = columns
    .map((column) =>
      column.key === 'title' && renderTitle
        ? `<td class="${getCellClass(column)} aca-tree-cell" style="${titleCellStyle}">${renderTitle(test)}</td>`
        : `<td class="${getCellClass(column)}">${column.render(test)}</td>`
    )
    .join('');
  const row = `
    <tr class="aca-test-row" tabindex="0" aria-expanded="${open}" data-index="${test.index}">
      ${leadCell}
      ${cells}
    </tr>
  `;
  return open ? `${row}${renderDetailRow(test, columns.length)}` : row;
}

function renderFixedTest(test) {
  return `
    <li>
      ${escapeAndLinkTestCaseIds(splitTitle(test).name)}
      <span class="aca-secondary">${escapeHtml(test.suite)}, ${pluralize(test.runs, 'clean run')}</span>
    </li>
  `;
}

function renderFixedSection() {
  if (!view.comparison) {
    return `
      <p class="aca-detail-note">
        No data for the previous ${pluralize(view.dates.length, 'day')}, so recently flaky and fixed tests are not shown.
      </p>
    `;
  }
  const fixed = view.comparison.fixed.filter(matchesFilters).sort((first, second) => String(first.title).localeCompare(String(second.title)));
  const intro = `At least ${pluralize(MIN_FLAKY_RUNS_BEFORE_FIX, 'flaky run')} in the previous ${pluralize(view.comparison.days, 'day')}, then at least ${MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED} runs since, all without a retry.`;
  const fixedList = fixed.length
    ? `
      <ul>${fixed.map(renderFixedTest).join('')}</ul>
    `
    : `
      <p class="aca-secondary">None in this period.</p>
    `;
  return `
    <section class="aca-fixed">
      <h2>${renderEmoji('✅')}Fixed <span class="aca-secondary">${numberFormat.format(fixed.length)}</span></h2>
      <p class="aca-detail-note">${escapeHtml(intro)}</p>
      ${fixedList}
    </section>
  `;
}

function renderTests(rows) {
  const columns = buildTestColumns(rows);
  const sort = sortRows(rows, columns);
  const legend = renderLegend(columns.map((column) => [column.label, COLUMN_HELP[column.key]]));
  const fixedSection = state.tab === 'flaky' ? renderFixedSection() : '';
  if (!rows.length) {
    elements.panel.innerHTML = `
      <p class="aca-empty">No tests match these filters. Clear the search or choose a longer period.</p>
      ${fixedSection}
      ${legend}
    `;
    return;
  }
  if (state.tab === 'all') {
    renderTree(rows, columns, sort, legend);
    return;
  }
  const noun = state.tab === 'flaky' ? 'flaky tests' : 'tests by duration';
  const openTestIsBelowTopList = rows.findIndex((test) => test.index === getOpenTestIndex()) >= TOP_LIMIT;
  const visibleTests = ui.showAll || openTestIsBelowTopList ? rows : rows.slice(0, TOP_LIMIT);
  const testRows = visibleTests
    .map((test, position) => {
      const rankCell = `<td class="aca-num aca-rank">${position + 1}</td>`;
      return renderTestRow(test, columns, rankCell);
    })
    .join('');
  elements.panel.innerHTML = `
    <div class="aca-table-wrap">
      <table>
        <thead>${renderHeaderRow(columns, sort)}</thead>
        <tbody>${testRows}</tbody>
      </table>
    </div>
    ${renderRowToggle(rows.length, TOP_LIMIT, noun)}
    ${fixedSection}
    ${legend}
  `;
}
