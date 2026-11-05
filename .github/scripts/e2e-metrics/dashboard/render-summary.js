'use strict';

function renderMasthead() {
  const repositoryLink = metrics.repository
    ? renderExternalLink(`${metrics.serverUrl}/${metrics.repository}/actions`, 'Workflow runs on GitHub')
    : '';
  elements.intro.innerHTML = `
    Flaky and slow Playwright tests from E2E runs on the ${escapeHtml(BRANCH)} branch.
    ${repositoryLink}
  `;
  const generated = new Date(metrics.generatedAt);
  const stale = Date.now() - generated.getTime() > STALE_AFTER_HOURS * 60 * 60 * 1000;
  const updated = generated.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  const staleTitle = stale ? ' title="Not updated in the last day. Check the E2E metrics report workflow."' : '';
  elements.updated.classList.toggle('aca-is-stale', stale);
  elements.updated.innerHTML = `
    Updated <time datetime="${escapeHtml(metrics.generatedAt)}"${staleTitle}>${escapeHtml(updated)}</time>
    <br />
    ${pluralize(metrics.days.length, 'day')} of history
  `;
}

function renderPeriodOption(days) {
  return `<option value="${days}">Last ${pluralize(days, 'day')}</option>`;
}

function renderSuiteOption(suite) {
  return `<option${suite === state.suite ? ' selected' : ''}>${escapeHtml(suite)}</option>`;
}

function renderFilters(suites) {
  const days = getPeriodDays();
  const periodOptions = [...new Set([...PERIODS, days])].sort((first, second) => first - second);
  elements.days.innerHTML = periodOptions.map(renderPeriodOption).join('');
  elements.days.value = String(days);
  elements.end.textContent = formatDate(state.end || lastDate, { year: 'numeric' });
  if (elements.search.value !== state.q) elements.search.value = state.q;
  elements.suite.innerHTML = `
    <option value="">All suites</option>
    ${suites.map(renderSuiteOption).join('')}
  `;
}

function renderStat({ tab, label, value, cls = '', title }) {
  return `
    <button
      type="button"
      class="aca-stat ${cls}"
      data-tab="${tab}"
      title="${escapeHtml(title || `Show the ${label.toLowerCase()}`)}"
    >
      <div class="aca-value">${value}</div>
      <div class="aca-label">${escapeHtml(label)}</div>
    </button>
  `;
}

function renderSummary(data, dates) {
  const runs = data.days.flatMap((day) => day.runs);
  const failedRuns = runs.filter(isFailedRun);
  const flakyCount = data.tests.filter(getTabFilter('flaky')).length;
  const recentlyFlakyCount = view.comparison ? view.comparison.recentlyFlakyIndexes.size : 0;
  const slowest = data.tests.filter(getTabFilter('slowest')).reduce((top, test) => (!top || test.avg > top.avg ? test : top), null);
  const recentlyFlakyText = recentlyFlakyCount ? `, ${numberFormat.format(recentlyFlakyCount)} recently flaky` : '';
  const stats = [
    {
      tab: 'flaky',
      label: 'Flaky tests',
      value: `
        ${numberFormat.format(flakyCount)}
        <small>of ${numberFormat.format(data.tests.length)}${recentlyFlakyText}</small>
      `,
      cls: flakyCount ? 'aca-is-retried' : ''
    },
    {
      tab: 'slowest',
      label: 'Slowest test',
      value: slowest ? formatDuration(slowest.avg) : 'none',
      cls: slowest ? 'aca-is-slow' : '',
      title: slowest ? `${slowest.title} (${slowest.suite}), average of its passed attempts. Show the slowest tests` : 'Show the slowest tests'
    },
    { tab: 'runs', label: 'Workflow runs', value: numberFormat.format(runs.length) },
    {
      tab: 'failed',
      label: 'Failed workflows',
      value: numberFormat.format(failedRuns.length),
      cls: failedRuns.length ? 'aca-is-failed' : ''
    }
  ];
  elements.summary.innerHTML = stats.map(renderStat).join('');
  const missing = dates.length - data.days.length;
  elements.daysNote.hidden = missing === 0;
  elements.daysNote.textContent = `No data was collected for ${missing} of the ${pluralize(dates.length, 'day')} in this period.`;
  renderDataIssues(collectPeriodDataIssues(data, dates));
}

function renderDataIssue(issue) {
  const runLink = issue.runUrl ? ` (${renderExternalLink(issue.runUrl, 'run')})` : '';
  return `
    <li>
      <b>${escapeHtml(formatDate(issue.date))}</b> ${escapeHtml(issue.effect)}${runLink}
      <code>${escapeHtml(issue.message)}</code>
    </li>
  `;
}

function renderDataIssues(issues) {
  const box = elements.dataIssues;
  box.hidden = issues.length === 0;
  if (!issues.length) return;
  const affectedDays = new Set(issues.map((issue) => issue.date)).size;
  box.innerHTML = `
    <summary>
      ${renderEmoji('⚠️')}${pluralize(issues.length, 'data problem')} on ${pluralize(affectedDays, 'day')} in this period.
      The numbers may be incomplete.
    </summary>
    <ul>${issues.map(renderDataIssue).join('')}</ul>
  `;
  box.open = dataIssuesOpen;
}

function renderTabs(counts) {
  const tabs = [
    ['flaky', '🔁', 'Flaky tests', counts.flaky],
    ['slowest', '🐢', 'Slowest tests', null],
    ['failed', '', 'Failed workflows', counts.failed],
    ['all', '', 'All tests', counts.all],
    ['runs', '', 'Workflow runs', counts.runs]
  ];
  elements.tabs.innerHTML = tabs
    .map(([id, icon, label, count]) => {
      const countBadge = count == null ? '' : ` <span class="aca-secondary">${numberFormat.format(count)}</span>`;
      return `
        <button type="button" role="tab" data-tab="${id}" aria-selected="${state.tab === id}">
          ${renderEmoji(icon)}${label}${countBadge}
        </button>
      `;
    })
    .join('');
}
