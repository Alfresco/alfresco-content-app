'use strict';

function collectRuns(days) {
  const query = state.q.trim().toLowerCase();
  return days
    .flatMap((day) => day.runs.map((run) => ({ ...run, date: day.date, issues: (day.issues || []).filter((issue) => issue.runId === run.id) })))
    .filter((run) => !query || `${run.title} ${run.workflow}`.toLowerCase().includes(query));
}

function render() {
  const dates = getRangeDates();
  const data = aggregate(dates);
  Object.assign(view, { dates, comparison: compareFlakyWithPreviousPeriod(dates, data.tests), suiteStats: collectSuiteStats(data.days) });
  const suites = [...new Set([...metrics.tests.map(([suite]) => suite), ...Object.keys(metrics.excluded || {})])].sort((first, second) =>
    first.localeCompare(second)
  );
  const filteredTests = data.tests.filter(matchesFilters);
  const runs = collectRuns(data.days);
  const failedRuns = runs.filter(isFailedRun);
  renderMasthead();
  renderFilters(suites);
  renderSummary(data, dates);
  const excludedTests = collectExcludedTests();
  const failureReasons = collectFailureReasons(filteredTests);
  renderTabs({
    flaky: filteredTests.filter(getTabFilter('flaky')).length,
    all: filteredTests.length,
    runs: runs.length,
    reasons: failureReasons.length,
    excluded: excludedTests.length
  });
  if (state.tab === 'runs') renderRuns(state.failed === ONLY_FAILED_RUNS ? failedRuns : runs, failedRuns.length);
  else if (state.tab === 'excluded') renderExcluded(excludedTests);
  else if (state.tab === 'reasons') renderFailureReasons(failureReasons);
  else if (state.tab === 'slowest') renderTests(data.timedTests.filter(matchesFilters));
  else renderTests(filteredTests.filter(getTabFilter(state.tab)));
  if (ui.scrollToOpenTest) {
    ui.scrollToOpenTest = false;
    document.querySelector('tr.aca-test-row[aria-expanded="true"]')?.scrollIntoView({ block: 'center' });
  }
}

const TAB_KEY_STEPS = { ArrowRight: 1, ArrowLeft: -1 };

function getTargetTabPosition(key, current, count) {
  if (key in TAB_KEY_STEPS) return (current + TAB_KEY_STEPS[key] + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}

function handleTabKeydown(event, activateTab) {
  const tabs = [...event.currentTarget.querySelectorAll('[role="tab"]')];
  const current = tabs.indexOf(event.target.closest('[role="tab"]'));
  const target = current < 0 ? null : getTargetTabPosition(event.key, current, tabs.length);
  if (target === null) return;
  event.preventDefault();
  activateTab(tabs[target])?.focus({ preventScroll: true });
}

function showTab(tab, patch = {}) {
  setState({ tab, sort: '', dir: '', failed: '', ...patch });
  return elements.tabs.querySelector(`[data-tab="${tab}"]`);
}

function toggleRow(row) {
  const index = Number(row.dataset.index);
  state.test = getOpenTestIndex() === index ? '' : testIds[index];
  writeState();
  render();
  document.querySelector(`tr.aca-test-row[data-index="${index}"]`)?.focus();
}

async function copyTestLink(button) {
  try {
    await navigator.clipboard.writeText(location.href);
    button.textContent = 'Link copied';
  } catch (error) {
    button.textContent = 'Copy failed, use the address bar';
    button.title = error.message;
  }
}

function toggleGroup(row) {
  const key = row.dataset.group;
  userToggledGroups.set(key, row.getAttribute('aria-expanded') !== 'true');
  render();
  document.querySelector(`tr.aca-group-row[data-group="${CSS.escape(key)}"]`)?.focus();
}

function toggleTestInSet(testIndexes, index, toggleAttribute) {
  if (testIndexes.has(index)) testIndexes.delete(index);
  else testIndexes.add(index);
  render();
  document.querySelector(`[${toggleAttribute}="${index}"]`)?.focus();
}

function toggleTopList() {
  const openRowPosition = [...elements.panel.querySelectorAll('tr.aca-test-row')].findIndex((row) => row.getAttribute('aria-expanded') === 'true');
  const collapseHidesOpenTest = ui.showAll && openRowPosition >= TOP_LIMIT;
  if (collapseHidesOpenTest) {
    state.test = '';
    writeState();
  }
  ui.showAll = !ui.showAll;
  render();
  findById('toggle-rows')?.focus();
}

function handlePanelClick(event) {
  if (event.target.closest('a')) return;
  const copyButton = event.target.closest('[data-copy-link]');
  if (copyButton) {
    void copyTestLink(copyButton);
    return;
  }
  const openTestButton = event.target.closest('[data-open-test]');
  if (openTestButton) {
    expandGroupsOfTest(indexById.get(openTestButton.dataset.openTest));
    ui.scrollToOpenTest = true;
    setState({ tab: 'all', sort: '', dir: '', test: openTestButton.dataset.openTest });
    return;
  }
  const groupsButton = event.target.closest('[data-groups]');
  if (groupsButton) {
    expandAllGroups(groupsButton.dataset.groups === 'open');
    elements.panel.querySelector(`[data-groups="${groupsButton.dataset.groups}"]`)?.focus();
    return;
  }
  const runsToggle = event.target.closest('[data-runs-toggle]');
  if (runsToggle) {
    toggleTestInSet(testsShowingAllRuns, Number(runsToggle.dataset.runsToggle), 'data-runs-toggle');
    return;
  }
  const pathToggle = event.target.closest('[data-path-toggle]');
  if (pathToggle) {
    toggleTestInSet(testsShowingLocation, Number(pathToggle.dataset.pathToggle), 'data-path-toggle');
    return;
  }
  if (event.target.id === 'toggle-rows') {
    toggleTopList();
    return;
  }
  const header = event.target.closest('th[data-sort]');
  if (header) {
    const current = header.getAttribute('aria-sort');
    setState({ sort: header.dataset.sort, dir: current === 'descending' ? 'asc' : 'desc' });
    elements.panel.querySelector(`th[data-sort="${header.dataset.sort}"] .aca-sort-button`)?.focus();
    return;
  }
  const reasonRow = event.target.closest('tr.aca-reason-row');
  if (reasonRow) {
    toggleReason(reasonRow);
    return;
  }
  const row = event.target.closest('tr.aca-test-row');
  if (row) toggleRow(row);
  const groupRow = event.target.closest('tr.aca-group-row');
  if (groupRow) toggleGroup(groupRow);
}

function handlePanelKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const row = event.target.closest('tr.aca-test-row, tr.aca-group-row, tr.aca-reason-row');
  if (!row || event.target.closest('a, button')) return;
  event.preventDefault();
  if (row.classList.contains('aca-reason-row')) toggleReason(row);
  else if (row.classList.contains('aca-group-row')) toggleGroup(row);
  else toggleRow(row);
}

function bindEvents() {
  bindCalendarEvents();
  elements.days.addEventListener('change', (event) => setState({ days: event.target.value }));
  elements.search.addEventListener('input', (event) => setState({ q: event.target.value }));
  elements.suite.addEventListener('change', (event) => setState({ suite: event.target.value }));
  elements.hideEnvironment.addEventListener('change', (event) => setState({ env: event.target.checked ? '' : 'include' }));
  elements.reset.addEventListener('click', () => setState({ ...DEFAULTS, tab: state.tab }));
  elements.tabs.addEventListener('click', (event) => {
    const tab = event.target.closest('button')?.dataset.tab;
    if (tab) showTab(tab)?.focus({ preventScroll: true });
  });
  elements.tabs.addEventListener('keydown', (event) => handleTabKeydown(event, (tab) => showTab(tab.dataset.tab)));
  elements.summary.addEventListener('click', (event) => {
    const statButton = event.target.closest('button[data-tab]');
    if (!statButton) return;
    const tabButton = showTab(statButton.dataset.tab, statButton.dataset.failed ? { failed: statButton.dataset.failed } : {});
    tabButton?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    tabButton?.focus({ preventScroll: true });
  });
  elements.panel.addEventListener('click', handlePanelClick);
  elements.panel.addEventListener('change', (event) => {
    if (!event.target.matches('[data-only-failed]')) return;
    setState({ failed: event.target.checked ? ONLY_FAILED_RUNS : '' });
    elements.panel.querySelector('[data-only-failed]')?.focus();
  });
  elements.panel.addEventListener(
    'toggle',
    (event) => {
      if (event.target.id === 'legend') ui.legendOpen = event.target.open;
    },
    true
  );
  elements.panel.addEventListener('keydown', handlePanelKeydown);
  elements.dataIssues.addEventListener('toggle', (event) => (ui.dataIssuesOpen = event.target.open));
  window.addEventListener('hashchange', () => {
    Object.assign(state, readState());
    ui.scrollToOpenTest = Boolean(state.test);
    render();
  });
}

if (historyLoaded) {
  bindEvents();
  render();
} else {
  document.querySelector('main').innerHTML = `
    <p class="aca-empty">
      The data file (data/history.js) could not be loaded. Check the last run of the "E2E dashboard - Daily collection" workflow.
    </p>
  `;
}
