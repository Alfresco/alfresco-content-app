'use strict';

const REASON_MESSAGE_LIMIT = 10;

function normalizeErrorMessage(error) {
  return RANDOM_ERROR_PARTS.reduce((text, [pattern, placeholder]) => text.replace(pattern, placeholder), error);
}

function createFailureReason(key) {
  return { key, attempts: 0, testRuns: new Set(), testAttempts: new Map(), suites: new Set(), messages: new Map(), lastSeen: '' };
}

function addFailedAttempt(reason, test, result, error) {
  reason.attempts += 1;
  reason.testRuns.add(`${test.index}:${result.run?.id}:${result.suiteAttempt}`);
  reason.testAttempts.set(test.index, (reason.testAttempts.get(test.index) || 0) + 1);
  reason.suites.add(test.suite);
  reason.messages.set(error, (reason.messages.get(error) || 0) + 1);
  const seen = String(result.run?.createdAt || result.date);
  if (seen > reason.lastSeen) reason.lastSeen = seen;
}

function addFailedAttemptsOfResult(reasons, test, result) {
  for (const [status, , error] of result.attempts || []) {
    if (status === 'passed' || !error) continue;
    const key = normalizeErrorMessage(error);
    if (!reasons.has(key)) reasons.set(key, createFailureReason(key));
    addFailedAttempt(reasons.get(key), test, result, error);
  }
}

function collectFailureReasons(tests) {
  const reasons = new Map();
  for (const test of tests) {
    for (const result of test.runResults) {
      if (result.environment && isHidingEnvironmentProblems()) continue;
      addFailedAttemptsOfResult(reasons, test, result);
    }
  }
  return [...reasons.values()].map((reason) => ({
    ...reason,
    testRunCount: reason.testRuns.size,
    testCount: reason.testAttempts.size,
    environment: isEnvironmentError(reason.key)
  }));
}

function renderReasonMessage(reason) {
  const message = escapeHtml(reason.key).replace(/&lt;(id|uuid|number)&gt;/g, '<span class="aca-placeholder">&lt;$1&gt;</span>');
  const environmentBadge = reason.environment ? '<span class="aca-environment-badge">likely environment</span>' : '';
  return `
    <div class="aca-reason">${message}</div>
    ${environmentBadge}
    <div class="aca-test-meta">${pluralize(reason.suites.size, 'suite')}</div>
  `;
}

function buildReasonColumns() {
  return [
    { key: 'reason', label: 'Error', cls: 'aca-test', help: REASON_HELP.reason, sortValue: (reason) => reason.key, render: renderReasonMessage },
    {
      key: 'attempts',
      label: 'Failed attempts',
      num: true,
      primary: true,
      help: REASON_HELP.attempts,
      sortValue: (reason) => reason.attempts,
      render: (reason) => numberFormat.format(reason.attempts)
    },
    {
      key: 'runs',
      label: 'Test runs',
      num: true,
      help: REASON_HELP.runs,
      sortValue: (reason) => reason.testRunCount,
      render: (reason) => numberFormat.format(reason.testRunCount)
    },
    {
      key: 'tests',
      label: 'Tests',
      num: true,
      help: REASON_HELP.tests,
      sortValue: (reason) => reason.testCount,
      render: (reason) => numberFormat.format(reason.testCount)
    },
    {
      key: 'seen',
      label: 'Last seen',
      help: REASON_HELP.seen,
      sortValue: (reason) => reason.lastSeen,
      render: (reason) => formatDate(reason.lastSeen.slice(0, 10))
    }
  ];
}

function renderReasonTest([index, attempts]) {
  const [suite, , title] = metrics.tests[index];
  return `
    <li>
      <button type="button" class="aca-link-button" data-open-test="${testIds[index]}">${escapeHtml(title.split(TITLE_SEPARATOR).pop())}</button>
      <span class="aca-secondary">${escapeHtml(suite)}, ${pluralize(attempts, 'failed attempt')}</span>
    </li>
  `;
}

function renderReasonOriginalMessage([message, attempts]) {
  return `
    <li>
      <code>${escapeHtml(message)}</code>
      <span class="aca-secondary">${pluralize(attempts, 'attempt')}</span>
    </li>
  `;
}

function renderReasonDetailRow(reason, colspan) {
  const byMostAttempts = (first, second) => second[1] - first[1];
  const tests = [...reason.testAttempts].sort(byMostAttempts);
  const messages = [...reason.messages].sort(byMostAttempts);
  const hiddenMessages = messages.slice(REASON_MESSAGE_LIMIT);
  const moreMessages = hiddenMessages.length
    ? `
      <details class="aca-reason-more">
        <summary>Show ${pluralize(hiddenMessages.length, 'other message')}</summary>
        <ul class="aca-reason-list">${hiddenMessages.map(renderReasonOriginalMessage).join('')}</ul>
      </details>
    `
    : '';
  return `
    <tr class="aca-detail">
      <td></td>
      <td colspan="${colspan}">
        <h2>Tests</h2>
        <ul class="aca-reason-list">${tests.map(renderReasonTest).join('')}</ul>
        <h2>Original messages</h2>
        <ul class="aca-reason-list">${messages.slice(0, REASON_MESSAGE_LIMIT).map(renderReasonOriginalMessage).join('')}</ul>
        ${moreMessages}
      </td>
    </tr>
  `;
}

function renderReasonRow(reason, position, columns) {
  const open = ui.openReasonKey === reason.key;
  const cells = columns.map((column) => `<td class="${getCellClass(column)}">${column.render(reason)}</td>`).join('');
  const row = `
    <tr class="aca-reason-row" tabindex="0" aria-expanded="${open}" data-reason="${escapeHtml(reason.key)}">
      <td class="aca-num aca-rank">${position + 1}</td>
      ${cells}
    </tr>
  `;
  return open ? `${row}${renderReasonDetailRow(reason, columns.length)}` : row;
}

function renderDaysWithoutDetailsNote() {
  const daysWithoutDetails = metrics.days.filter((day) => view.dates.includes(day.date) && day.tests.length && !day.results);
  if (!daysWithoutDetails.length) return '';
  const firstDay = formatDate(daysWithoutDetails[0].date);
  const lastDay = formatDate(daysWithoutDetails.at(-1).date);
  const range = firstDay === lastDay ? firstDay : `${firstDay} – ${lastDay}`;
  return `
    <p class="aca-detail-note">
      Failed attempts and their errors are kept for ${metrics.detailDays || 14} days, so
      ${pluralize(daysWithoutDetails.length, 'selected day')} (${range}) ${daysWithoutDetails.length === 1 ? 'is' : 'are'} not included here.
    </p>
  `;
}

function renderFailureReasons(reasons) {
  const columns = buildReasonColumns();
  const legend = renderLegend(columns.map((column) => [column.label, column.help]));
  const daysWithoutDetailsNote = renderDaysWithoutDetailsNote();
  if (!reasons.length) {
    elements.panel.innerHTML = `
      ${daysWithoutDetailsNote}
      <p class="aca-empty">No failed attempts with an error message match these filters in this period.</p>
      ${legend}
    `;
    return;
  }
  const sort = sortRows(reasons, columns, (first, second) => first.key.localeCompare(second.key));
  const visibleReasons = ui.showAll ? reasons : reasons.slice(0, TOP_LIMIT);
  elements.panel.innerHTML = `
    ${daysWithoutDetailsNote}
    <div class="aca-table-wrap">
      <table>
        <thead>${renderHeaderRow(columns, sort)}</thead>
        <tbody>${visibleReasons.map((reason, position) => renderReasonRow(reason, position, columns)).join('')}</tbody>
      </table>
    </div>
    ${renderRowToggle(reasons.length, TOP_LIMIT, 'failure reasons')}
    ${legend}
  `;
}

function toggleReason(row) {
  const key = row.dataset.reason;
  ui.openReasonKey = ui.openReasonKey === key ? null : key;
  render();
  elements.panel.querySelector(`tr.aca-reason-row[data-reason="${CSS.escape(key)}"]`)?.focus();
}
