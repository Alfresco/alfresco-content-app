'use strict';

const compareByNewestRun = (first, second) => getRunTime(second).localeCompare(getRunTime(first));

function formatConclusion(conclusion) {
  return conclusion ? `${conclusion.charAt(0).toUpperCase()}${conclusion.slice(1).replaceAll('_', ' ')}` : 'In progress';
}

function renderRunResult(run) {
  const resultClass = isFailedRun(run) ? 'aca-is-failed' : '';
  const e2eJobsNote = `<span class="aca-secondary" title="${E2E_JOBS_RESULT_HELP}">(E2E jobs)</span>`;
  return `
    <span class="${resultClass}">${escapeHtml(formatConclusion(run.conclusion))}</span>
    ${run.conclusionFrom === 'e2e-jobs' ? e2eJobsNote : ''}
  `;
}

function buildRunColumns() {
  return [
    { key: 'date', label: 'Date', help: RUNS_HELP.date, sortValue: getRunTime, render: (run) => formatDate(run.date) },
    {
      key: 'workflow',
      label: 'Workflow',
      help: RUNS_HELP.workflow,
      sortValue: (run) => String(run.workflow || ''),
      render: (run) => escapeHtml(run.workflow)
    },
    {
      key: 'run',
      label: 'Run',
      help: RUNS_HELP.run,
      sortValue: (run) => String(run.title || run.id),
      render: (run) => renderExternalLink(run.url, escapeHtml(run.title || run.id))
    },
    {
      key: 'result',
      label: 'Result',
      help: RUNS_HELP.result,
      sortValue: (run) => CONCLUSION_SORT_RANK_WORST_LAST.indexOf(run.conclusion ?? null),
      render: renderRunResult
    },
    {
      key: 'cause',
      label: 'Cause',
      help: RUNS_HELP.cause,
      sortValue: (run) =>
        (run.failure || []).reduce((rank, [kind]) => Math.max(rank, kind === 'tests' ? TEST_FAILURE_SORT_RANK : INFRA_FAILURE_SORT_RANK), 0),
      render: renderFailureCause
    }
  ];
}

function renderEnvironmentProblems(run) {
  const renderCheckLink = ([name, job, step, stepName]) => {
    const text = `${stepName || 'job failed'} (${name})`;
    return run.url && job ? renderExternalLink(buildJobUrl(run, job, step), escapeHtml(text)) : escapeHtml(text);
  };
  const parts = [];
  if (run.environment?.length) {
    parts.push(`<span class="aca-cause-environment">Environment check failed:</span> ${run.environment.map(renderCheckLink).join(', ')}`);
  }
  if (run.incidents?.length) {
    const incidentTexts = run.incidents.map(([suite, suiteAttempt, affected, tests]) =>
      escapeHtml(`${suite}, suite attempt ${suiteAttempt} (${affected} of ${tests} tests needed a retry or failed)`)
    );
    parts.push(`<span class="aca-cause-environment">Suite incident:</span> ${incidentTexts.join(', ')}`);
  }
  return parts;
}

function renderFailureCause(run) {
  const entries = (run.failure || []).map(([kind, name, job, step, stepName]) => ({ kind, name, job, step, stepName }));
  const environmentProblems = renderEnvironmentProblems(run);
  const missingData = (run.issues || []).map((issue) => escapeHtml(issue.effect)).join('; ');
  const dataProblems = missingData
    ? `
      <span class="aca-cause-data">${renderEmoji('⚠️')}Data missing:</span>
      ${missingData}
    `
    : '';
  if (!entries.length && !environmentProblems.length) return dataProblems || (isFailedRun(run) ? '<span class="aca-secondary">–</span>' : '');
  const renderStepLink = (entry, text) =>
    run.url && entry.job ? renderExternalLink(buildJobUrl(run, entry.job, entry.step), escapeHtml(text)) : escapeHtml(text);
  const testCauses = entries.filter((cause) => cause.kind === 'tests');
  const infraCauses = entries.filter((cause) => cause.kind === 'infra');
  const parts = [...environmentProblems];
  if (infraCauses.length) {
    const infraLinks = infraCauses.map((cause) => renderStepLink(cause, `${cause.stepName || 'job failed'} (${cause.name})`)).join(', ');
    parts.push(`<span class="aca-cause-infra">Infrastructure:</span> ${infraLinks}`);
  }
  if (testCauses.length) {
    const testLinks = testCauses.map((cause) => renderStepLink(cause, cause.name)).join(', ');
    parts.push(`<span class="aca-is-failed">Tests failed:</span> ${testLinks}`);
  }
  if (dataProblems) parts.push(dataProblems);
  return parts.join('<br />');
}

function renderRunRow(run, columns) {
  return `
    <tr>
      ${columns.map((column) => `<td>${column.render(run)}</td>`).join('')}
    </tr>
  `;
}

function renderOnlyFailedToggle(failedCount) {
  const checked = state.failed === ONLY_FAILED_RUNS ? ' checked' : '';
  return `
    <div class="aca-runs-tools">
      <label class="aca-check">
        <input type="checkbox" data-only-failed${checked} />
        Only failed runs (${numberFormat.format(failedCount)})
      </label>
    </div>
  `;
}

function renderRuns(runs, failedCount) {
  const columns = buildRunColumns();
  const legend = renderLegend(columns.map((column) => [column.label, column.help]));
  const onlyFailedToggle = renderOnlyFailedToggle(failedCount);
  if (!runs.length) {
    const empty =
      state.failed === ONLY_FAILED_RUNS
        ? 'No failed workflow runs in this period.'
        : 'No workflow runs match these filters. Clear the search or choose a longer period.';
    elements.panel.innerHTML = `
      ${onlyFailedToggle}
      <p class="aca-empty">${empty}</p>
      ${legend}
    `;
    return;
  }
  const sort = sortRows(runs, columns, compareByNewestRun);
  elements.panel.innerHTML = `
    ${onlyFailedToggle}
    <div class="aca-table-wrap">
      <table>
        <thead>${renderHeaderRow(columns, sort, null)}</thead>
        <tbody>${runs.map((run) => renderRunRow(run, columns)).join('')}</tbody>
      </table>
    </div>
    ${legend}
  `;
}
