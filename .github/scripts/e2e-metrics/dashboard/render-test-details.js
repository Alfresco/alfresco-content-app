'use strict';

function summarizeRuns(test) {
  const runs = pluralize(test.runs, 'run');
  const stillFailed = test.failures ? `, ${numberFormat.format(test.failures)} of which still failed` : '';
  const retrySummary = test.retried
    ? `Needed a retry in ${numberFormat.format(test.retried)} of ${runs}${stillFailed}.`
    : `Passed on the first attempt in all ${runs}.`;
  const durations = test.runResults.map((result) => result.duration).filter((duration) => duration != null);
  if (!durations.length) return retrySummary;
  const fastest = formatDuration(Math.min(...durations));
  const slowest = formatDuration(Math.max(...durations));
  return `${retrySummary} Passed runs took ${fastest} to ${slowest}, ${formatDuration(test.avg)} on average.`;
}

function renderRunLink(result, test) {
  const run = result.run || {};
  const name = WORKFLOW_NAMES[run.workflow] || run.workflow || 'Workflow run';
  const [job, step] = run.suites?.[test.suite] || [];
  const url = run.url && job ? buildJobUrl(run, job, step) : run.url;
  const title = job ? `Open the test step of the ${test.suite} job` : 'Open the workflow run';
  const link = url
    ? `<a
        href="${escapeHtml(url)}"
        target="_blank"
        rel="noopener"
        title="${escapeHtml(title)}"
      >${escapeHtml(name)}</a>`
    : escapeHtml(name);
  const suiteRerun = `<span class="aca-secondary">(suite re-run ${result.suiteAttempt})</span>`;
  return `
    ${link}
    ${result.suiteAttempt > 1 ? suiteRerun : ''}
  `;
}

function renderAttempt([status, duration, error]) {
  const statusClass = status === 'passed' ? '' : 'aca-attempt-failed';
  const durationText = duration == null ? '' : ` ${formatDuration(duration)}`;
  const errorBlock = error ? `<div class="aca-attempt-error">${escapeHtml(error)}</div>` : '';
  return `
    <div class="aca-attempt">
      <span class="${statusClass}">${ATTEMPT_LABELS[status] || status}${durationText}</span>
      ${errorBlock}
    </div>
  `;
}

function renderAttemptList(result) {
  return result.attempts ? result.attempts.map(renderAttempt).join('') : '';
}

function renderDifferenceFromAverage(result, test) {
  if (result.duration == null || !test.durationCount) return '';
  const difference = result.duration - test.avg;
  const text = `${difference >= 0 ? '+' : '−'}${formatDuration(Math.abs(difference))}`;
  const className = difference > test.avg * SLOW_RUN_FRACTION_ABOVE_AVERAGE ? 'aca-slower' : 'aca-secondary';
  return `<span class="${className}">${text}</span>`;
}

function getRunResultLabel(result, test) {
  const rescuedBySuiteRerun = result.suiteAttempt > 1 && result.outcome !== 'failed' && test.runsRescuedBySuiteRerun.has(result.run?.id);
  if (rescuedBySuiteRerun) return ['Passed on suite re-run', 'aca-is-retried'];
  const rerunWithSerialGroup = result.outcome === 'passed' && result.retries > 0;
  if (rerunWithSerialGroup) return ['Re-run with its serial group', 'aca-is-retried'];
  return OUTCOME_LABELS[result.outcome] || [result.outcome, ''];
}

function renderRunResultRow(result, test) {
  const [label, labelClass] = getRunResultLabel(result, test);
  const duration = result.duration == null ? '<span class="aca-secondary">–</span>' : formatDuration(result.duration);
  const setup = result.setup == null ? '' : formatDuration(result.setup);
  return `
    <tr>
      <td>${formatDate(result.date)}</td>
      <td>${renderRunLink(result, test)}</td>
      <td><span class="${labelClass}">${label}</span></td>
      <td class="aca-num">${result.retries || '<span class="aca-secondary">0</span>'}</td>
      <td class="aca-attempts">${renderAttemptList(result)}</td>
      <td class="aca-num">${duration}</td>
      <td class="aca-num">${setup}</td>
      <td class="aca-num">${renderDifferenceFromAverage(result, test)}</td>
    </tr>
  `;
}

function renderRunResultTable(visibleRunResults, test) {
  return `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th title="Opens the step that ran the tests in the suite job">Run</th>
          <th>Result</th>
          <th class="aca-num">Retries</th>
          <th>Attempts</th>
          <th class="aca-num" title="Passed attempt, including setup">Duration</th>
          <th class="aca-num">Setup</th>
          <th
            class="aca-num"
            title="Difference from the average duration in the selected period. Runs more than 20% slower are highlighted."
          >vs average</th>
        </tr>
      </thead>
      <tbody>${visibleRunResults.map((result) => renderRunResultRow(result, test)).join('')}</tbody>
    </table>
  `;
}

function renderRunsToggle(test, resultCount, showAllRuns) {
  if (resultCount <= RUN_LIMIT) return '';
  const label = showAllRuns ? `Show the latest ${RUN_LIMIT} runs only` : `Show all ${resultCount} runs`;
  return `
    <div class="aca-more">
      <button type="button" data-runs-toggle="${test.index}">${label}</button>
    </div>
  `;
}

function renderDaysWithoutDetailNote(test) {
  if (!test.daysWithoutDetail) return '';
  return `
    <p class="aca-detail-note">
      Run details are kept for ${metrics.detailDays || 14} days,
      so ${pluralize(test.daysWithoutDetail, 'earlier day')} only count towards the totals.
    </p>
  `;
}

function renderDetailRow(test, colspan) {
  const getResultTime = (result) => String(result.run?.createdAt || result.date);
  const results = test.runResults
    .slice()
    .sort((first, second) => getResultTime(second).localeCompare(getResultTime(first)) || second.suiteAttempt - first.suiteAttempt);
  const showAllRuns = testsShowingAllRuns.has(test.index);
  const visibleRunResults = showAllRuns ? results : results.slice(0, RUN_LIMIT);
  return `
    <tr class="aca-detail">
      <td></td>
      <td colspan="${colspan}">
        <div class="aca-detail-head">
          <h2>Runs</h2>
          <button type="button" class="aca-link-button" data-copy-link>Copy link to this test</button>
        </div>
        <p class="aca-detail-summary">${escapeHtml(summarizeRuns(test))}</p>
        <p class="aca-detail-trend">
          <span class="aca-secondary">Last ${pluralize(view.dates.length, 'day')}:</span>
          ${renderTrendDots(test)}
        </p>
        ${results.length ? renderRunResultTable(visibleRunResults, test) : ''}
        ${renderRunsToggle(test, results.length, showAllRuns)}
        ${renderDaysWithoutDetailNote(test)}
      </td>
    </tr>
  `;
}
