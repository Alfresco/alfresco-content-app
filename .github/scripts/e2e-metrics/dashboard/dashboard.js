(function () {
  'use strict';

  const TOP_LIMIT = 10;
  const RUN_LIMIT = 20;
  const SLOW_RUN_FRACTION_ABOVE_AVERAGE = 0.2;
  const WORKFLOW_NAMES = { 'cron-e2e-chrome.yml': 'Daily chrome run', 'populate-e2e-reports.yml': 'Populate run' };
  const OUTCOME_BY_HISTORY_CODE = { p: 'passed', r: 'retried', f: 'failed' };
  const ATTEMPT_STATUS_BY_HISTORY_CODE = { p: 'passed', f: 'failed', t: 'timedOut', i: 'interrupted' };
  const OUTCOME_LABELS = { passed: ['Passed', 'aca-secondary'], retried: ['Passed on retry', 'aca-is-retried'], failed: ['Failed', 'aca-is-failed'] };
  const ATTEMPT_LABELS = { passed: 'passed', failed: 'failed', timedOut: 'timed out', interrupted: 'interrupted' };
  const FAILED_CONCLUSIONS = new Set(['failure', 'timed_out']);
  const CONCLUSION_SORT_RANK_WORST_LAST = ['success', 'neutral', 'skipped', 'cancelled', null, 'timed_out', 'failure'];
  const TITLE_SEPARATOR = ' › ';
  const GROUP_KINDS = {
    suite: { label: 'Suite', badgeClass: 'aca-kind-suite', rowClass: 'aca-group-suite' },
    file: { label: 'File', badgeClass: 'aca-kind-file', rowClass: 'aca-group-file' },
    describe: { label: 'Describe', badgeClass: 'aca-kind-describe', rowClass: '' }
  };
  const STALE_AFTER_HOURS = 36;
  const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const metrics = window.E2E_HISTORY;
  const $ = (id) => document.getElementById(id);
  const elements = {
    intro: $('intro'),
    updated: $('updated'),
    days: $('days'),
    end: $('end'),
    dateField: $('date-field'),
    calendar: $('calendar'),
    search: $('q'),
    suite: $('suite'),
    reset: $('reset'),
    summary: $('summary'),
    daysNote: $('days-note'),
    dataIssues: $('data-issues'),
    tabs: $('tabs'),
    panel: $('panel')
  };

  if (!metrics || !metrics.days) {
    document.querySelector('main').innerHTML =
      '<p class="aca-empty">The data file (data/history.js) could not be loaded. Check the last run of the E2E metrics report workflow.</p>';
    return;
  }

  const DEFAULTS = { tab: 'flaky', days: '14', end: '', q: '', suite: '', sort: '', dir: '', test: '' };
  const TAB_SORT = { flaky: ['retries', 'desc'], slowest: ['avg', 'desc'], all: ['title', 'asc'], runs: ['date', 'desc'], failed: ['date', 'desc'] };
  const MIN_FLAKY_RUNS_BEFORE_FIX = 5;
  const MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED = 3;
  const TREND_SORT_WEIGHT_BY_DAY_RESULT = { failed: 2, retried: 1, passed: 0 };
  const INFRA_FAILURE_SORT_RANK = 2;
  const TEST_FAILURE_SORT_RANK = 1;
  const TEST_ID_PATTERN = /\bXAT-\d+\b/g;
  const TREND_LABELS = { passed: 'passed', retried: 'needed a retry', failed: 'failed' };
  const TREND_DOT_CLASSES = { passed: 'aca-dot-passed', retried: 'aca-dot-retried', failed: 'aca-dot-failed' };
  const NO_RUN_DOT_CLASS = 'aca-dot-none';
  const lastDate = metrics.days.length ? metrics.days[metrics.days.length - 1].date : new Date().toISOString().slice(0, 10);
  const firstDate = metrics.days.length ? metrics.days[0].date : lastDate;
  const keptHistoryDays = metrics.historyDays || 14;
  const PERIODS = [7, 14, 30, 90].filter((days) => days <= keptHistoryDays);
  const LONGEST_PERIOD = PERIODS[PERIODS.length - 1];
  const isPeriod = (days) => Number.isInteger(days) && days >= 1 && days <= LONGEST_PERIOD;
  const STATE_VALIDATORS = {
    tab: (value) => Object.hasOwn(TAB_SORT, value),
    days: (value) => /^\d+$/.test(value) && isPeriod(Number(value)),
    end: (value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
    sort: (value) => /^[a-z]*$/.test(value),
    dir: (value) => value === '' || value === 'asc' || value === 'desc',
    test: (value) => /^[0-9a-z]*$/.test(value)
  };
  const datesWithData = new Set(metrics.days.map((day) => day.date));

  const COLUMN_HELP = {
    title:
      'Name of the test. In the flaky and slowest lists, Location shows its suite, file and describe blocks; in All tests they are the groups above it. Click a row to see every run of the test: its result, retries, each attempt and how long it took.',
    retries:
      'How many times Playwright retried the test. On CI a failed test is retried up to 2 times, so one run can add 2 retries and the total can be higher than the number of runs.',
    rate: 'Runs that needed at least one retry, whether the test passed in the end or not, and their share of all runs. A run counts once however many retries it needed: 17 retried runs out of 31, 10 of them retried twice and 7 once, give 27 retries and 55%.',
    failures: 'Runs where the test still failed after all retries.',
    avg: 'Average time of the passed attempts: beforeAll and beforeEach hooks (setup), the test itself and its afterEach hooks. afterAll hooks are not counted. Failed attempts are left out so timeouts do not distort the average.',
    setup:
      'Part of the average duration spent in beforeAll and beforeEach hooks. Playwright runs a beforeAll hook once per worker, but every test that depends on it is charged its full time, so the sum of all durations is higher than the real run time.',
    max: 'The longest passed attempt in the selected period, including setup.',
    runs: 'Executions of the test in workflow runs. When a whole suite is re-run, each attempt counts as a run.',
    trend:
      'One dot per day of the period, oldest first: green passed, amber needed a retry, red failed after all retries, empty did not run. "Recently flaky" marks tests that were not flaky in the previous period of the same length.'
  };
  const TAB_INTRO = {
    flaky:
      'Tests that needed at least one retry or failed in the selected period, ordered by retries. "Recently flaky" under the trend marks tests that were not flaky in the previous period of the same length; tests that had at least ' +
      MIN_FLAKY_RUNS_BEFORE_FIX +
      ' flaky runs then and only clean runs now (at least ' +
      MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED +
      ') are listed under the table as fixed.',
    slowest: 'Tests that passed at least once in the selected period, ordered by average duration.',
    all: 'Every test that ran in the selected period, grouped by suite, test file and describe block. Group rows show the totals of their tests; suite rows also show the average CI time of the suite job, split into setup before the tests (ACS deploy, installs) and the tests themselves. Click a group to expand or collapse it.',
    runs:
      'Workflow runs whose test results are included: the daily chrome run and Populate E2E reports runs on ' + (metrics.branch || 'develop') + '.',
    failed: 'Workflow runs that failed or timed out. A failed run still provides results for the tests that ran.'
  };
  const RUNS_HELP = {
    date: 'Day the workflow run started (UTC).',
    workflow: 'Workflow file that produced the results.',
    run: 'Link to the workflow run on GitHub, with its logs and artifacts.',
    result:
      'Outcome of the whole workflow run. A failed run still provides results for the tests that ran. For a run that was still in progress when its data was collected (the run that publishes the dashboard), the result of its E2E jobs is shown instead, marked "(E2E jobs)". Sorting puts failed runs first, then timed out, in progress, cancelled and successful runs.',
    cause:
      'Why a failed run failed: tests failing in a suite, or an infrastructure step (build, ACS deploy, installs) failing before or around the tests. Links open the failed step. "Data missing" means part of the run\'s results could not be collected from GitHub, so its numbers are incomplete.'
  };

  let state = readState();
  let showAll = false;
  let legendOpen = false;
  let dataIssuesOpen = false;
  let calendarMonth = lastDate.slice(0, 7);
  const testIds = metrics.tests.map(([suite, file, title]) => fnv1aHash(suite + TITLE_SEPARATOR + file + TITLE_SEPARATOR + title));
  const indexById = new Map(testIds.map((id, index) => [id, index]));
  let scrollToOpenTest = Boolean(state.test);
  const userToggledGroups = new Map();
  let visibleGroupKeys = [];
  let view = { dates: [], comparison: null, suiteTimes: new Map() };
  const testsShowingAllRuns = new Set();
  const testsShowingLocation = new Set();

  function openTestIndex() {
    return state.test ? indexById.get(state.test) : undefined;
  }

  function escapeAndLinkTestCaseIds(text) {
    const html = esc(text);
    if (!metrics.testCaseUrl) return html;
    return html.replace(
      TEST_ID_PATTERN,
      (id) => '<a class="aca-test-id" href="' + esc(metrics.testCaseUrl.replace('{id}', id)) + '" target="_blank" rel="noopener">' + id + '</a>'
    );
  }

  function readState() {
    const params = new URLSearchParams(location.hash.slice(1));
    const result = { ...DEFAULTS };
    for (const key of Object.keys(DEFAULTS)) {
      const value = params.get(key);
      const isAllowed = STATE_VALIDATORS[key] || (() => true);
      if (value !== null && isAllowed(value)) result[key] = value;
    }
    return result;
  }

  function writeState() {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(state)) {
      if (value && value !== DEFAULTS[key]) params.set(key, value);
    }
    window.history.replaceState(null, '', '#' + params.toString());
  }

  function setState(patch) {
    state = { ...state, ...patch };
    showAll = false;
    writeState();
    render();
  }

  function periodDays() {
    const days = Number(state.days);
    return isPeriod(days) ? days : LONGEST_PERIOD;
  }

  function rangeDates() {
    const end = state.end || lastDate;
    const days = periodDays();
    return Array.from({ length: days }, (_, offset) => shiftDate(end, offset - days + 1));
  }

  function emptyTestTotals(index) {
    const [suite, file, title, path, line] = metrics.tests[index];
    return {
      index,
      suite,
      file,
      title,
      path,
      line,
      runs: 0,
      retries: 0,
      flakyRuns: 0,
      failures: 0,
      durationSum: 0,
      durationCount: 0,
      setupSum: 0,
      max: 0,
      runResults: [],
      daysWithoutDetail: 0,
      daily: new Map()
    };
  }

  function worstResultOfDay({ failures, flakyRuns, retries }) {
    if (failures) return 'failed';
    if (flakyRuns || retries) return 'retried';
    return 'passed';
  }

  function addDayTotals(tests, day) {
    for (const [index, runs, retries, flakyRuns, failures, durationSum, durationCount, durationMax, setupSum = 0] of day.tests) {
      if (!tests.has(index)) tests.set(index, emptyTestTotals(index));
      const test = tests.get(index);
      test.runs += runs;
      test.retries += retries;
      test.flakyRuns += flakyRuns;
      test.failures += failures;
      test.durationSum += durationSum;
      test.durationCount += durationCount;
      test.setupSum += setupSum;
      test.max = Math.max(test.max, durationMax);
      test.daily.set(day.date, worstResultOfDay({ failures, flakyRuns, retries }));
      if (!day.results) test.daysWithoutDetail += 1;
    }
  }

  function addDayRunResults(tests, day) {
    const errorText = (errorIndex) => (errorIndex == null ? null : (day.errors?.[errorIndex] ?? null));
    for (const [index, runIndex, suiteAttempt, outcomeCode, retries, duration, setup, attempts] of day.results || []) {
      const decodedAttempts = attempts?.map(([statusCode, attemptDuration, errorIndex]) => [
        ATTEMPT_STATUS_BY_HISTORY_CODE[statusCode] ?? statusCode,
        attemptDuration,
        errorText(errorIndex)
      ]);
      tests.get(index)?.runResults.push({
        date: day.date,
        run: day.runs[runIndex],
        suiteAttempt,
        outcome: OUTCOME_BY_HISTORY_CODE[outcomeCode] ?? 'failed',
        retries,
        duration,
        setup,
        attempts: decodedAttempts
      });
    }
  }

  function finishTestTotals(test) {
    test.avg = test.durationCount ? test.durationSum / test.durationCount : 0;
    test.setup = test.durationCount ? test.setupSum / test.durationCount : 0;
    test.retried = test.flakyRuns + test.failures;
    test.rate = test.runs ? test.retried / test.runs : 0;
    test.runsRescuedBySuiteRerun = runsRescuedBySuiteRerun(test.runResults);
  }

  function aggregate(dates) {
    const inRange = new Set(dates);
    const days = metrics.days.filter((day) => inRange.has(day.date));
    const tests = new Map();
    for (const day of days) {
      addDayTotals(tests, day);
      addDayRunResults(tests, day);
    }
    tests.forEach(finishTestTotals);
    return { days, tests: [...tests.values()] };
  }

  function runsRescuedBySuiteRerun(runResults) {
    const byRun = new Map();
    for (const result of runResults) {
      const id = result.run?.id;
      if (!byRun.has(id)) byRun.set(id, []);
      byRun.get(id).push(result);
    }
    const rescued = new Set();
    for (const [id, results] of byRun) {
      const failedInFirstSuiteAttempt = results.some((result) => result.suiteAttempt === 1 && result.outcome === 'failed');
      const passedInSuiteRerun = results.some((result) => result.suiteAttempt > 1 && result.outcome !== 'failed');
      if (failedInFirstSuiteAttempt && passedInSuiteRerun) rescued.add(id);
    }
    return rescued;
  }

  const isFlaky = (test) => test.retries > 0 || test.failures > 0;

  function compareFlakyWithPreviousPeriod(dates, current) {
    const previousDates = dates.map((date) => shiftDate(date, -dates.length));
    const previous = aggregate(previousDates);
    if (!previous.days.length) return null;
    const previousByIndex = new Map(previous.tests.map((test) => [test.index, test]));
    const currentByIndex = new Map(current.map((test) => [test.index, test]));
    const wasFlakyInPreviousPeriod = (test) => previousByIndex.has(test.index) && isFlaky(previousByIndex.get(test.index));
    const wasFlakyEnoughToCountAsFixed = (test) => test.retried >= MIN_FLAKY_RUNS_BEFORE_FIX;
    const ranOnlyCleanEnoughInCurrentPeriod = (test) =>
      currentByIndex.get(test.index)?.runs >= MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED && !isFlaky(currentByIndex.get(test.index));
    return {
      days: dates.length,
      recentlyFlakyIndexes: new Set(current.filter((test) => isFlaky(test) && !wasFlakyInPreviousPeriod(test)).map((test) => test.index)),
      fixed: previous.tests
        .filter((test) => wasFlakyEnoughToCountAsFixed(test) && ranOnlyCleanEnoughInCurrentPeriod(test))
        .map((test) => currentByIndex.get(test.index))
    };
  }

  function sourceLink(test) {
    const label = esc(test.file) + (test.line ? ':' + test.line : '');
    if (!test.path || !metrics.repository) return label;
    const url =
      metrics.serverUrl + '/' + metrics.repository + '/blob/' + (metrics.branch || 'develop') + '/' + test.path + (test.line ? '#L' + test.line : '');
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + label + '</a>';
  }

  function kindBadge(kind) {
    return '<span class="aca-group-kind ' + GROUP_KINDS[kind].badgeClass + '">' + GROUP_KINDS[kind].label + '</span>';
  }

  function testNameWithPath(test) {
    const { describes, name } = titleParts(test);
    const open = testsShowingLocation.has(test.index);
    let html =
      '<div class="aca-test-title">' +
      escapeAndLinkTestCaseIds(name) +
      '</div>' +
      '<div class="aca-test-meta"><button type="button" class="aca-path-toggle" data-path-toggle="' +
      test.index +
      '" aria-expanded="' +
      open +
      '" title="Show the suite, file and describe blocks of this test">' +
      (open ? '▾' : '▸') +
      ' Location</button></div>';
    if (open) {
      const levels = [
        kindBadge('suite') + ' ' + esc(test.suite),
        kindBadge('file') + ' ' + sourceLink(test),
        ...describes.map((describe) => kindBadge('describe') + ' ' + esc(describe))
      ];
      html +=
        '<ul class="aca-test-path">' +
        levels.map((item, level) => '<li style="--level:' + level + '">' + item + '</li>').join('') +
        '<li class="aca-test-path-name" style="--level:' +
        levels.length +
        '">' +
        escapeAndLinkTestCaseIds(name) +
        '</li></ul>';
    }
    return html;
  }

  function trendDots(test) {
    const dots =
      '<span class="aca-trend" aria-label="' +
      esc(trendLabel(test)) +
      '">' +
      view.dates
        .map((date) => {
          const status = test.daily.get(date);
          return (
            '<span class="aca-dot ' +
            (status ? TREND_DOT_CLASSES[status] : NO_RUN_DOT_CLASS) +
            '" title="' +
            esc(formatDate(date) + ': ' + (status ? TREND_LABELS[status] : 'did not run')) +
            '"></span>'
          );
        })
        .join('') +
      '</span>';
    return view.comparison?.recentlyFlakyIndexes.has(test.index)
      ? dots +
          '<span class="aca-trend-note" title="Flaky in this period, but not in the previous ' +
          plural(view.comparison.days, 'day') +
          '">Recently flaky</span>'
      : dots;
  }

  function trendLabel(test) {
    const counts = { passed: 0, retried: 0, failed: 0 };
    test.daily.forEach((status, date) => view.dates.includes(date) && counts[status]++);
    return 'Days passed ' + counts.passed + ', needed a retry ' + counts.retried + ', failed ' + counts.failed;
  }

  function measure(value, max, text) {
    const minimumVisibleWidth = value > 0 ? 2 : 0;
    const width = max > 0 ? Math.max((value / max) * 100, minimumVisibleWidth) : 0;
    return (
      '<div class="aca-measure"><span>' +
      text +
      '</span><div class="aca-track"><div class="aca-fill" style="width:' +
      width.toFixed(1) +
      '%"></div></div></div>'
    );
  }

  function renderMasthead() {
    const repo = metrics.repository
      ? ' <a href="' + esc(metrics.serverUrl + '/' + metrics.repository + '/actions') + '" target="_blank" rel="noopener">Workflow runs on GitHub</a>'
      : '';
    elements.intro.innerHTML = 'Flaky and slow Playwright tests from E2E runs on the ' + esc(metrics.branch || 'develop') + ' branch.' + repo;
    const generated = new Date(metrics.generatedAt);
    const stale = Date.now() - generated.getTime() > STALE_AFTER_HOURS * 60 * 60 * 1000;
    const updated = generated.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
    elements.updated.classList.toggle('aca-is-stale', stale);
    elements.updated.innerHTML =
      'Updated <time datetime="' +
      esc(metrics.generatedAt) +
      '"' +
      (stale ? ' title="Not updated in the last day. Check the E2E metrics report workflow."' : '') +
      '>' +
      esc(updated) +
      '</time>' +
      '<br />' +
      plural(metrics.days.length, 'day') +
      ' of history';
  }

  function renderFilters(suites) {
    const days = periodDays();
    const periodOptions = [...new Set([...PERIODS, days])].sort((first, second) => first - second);
    elements.days.innerHTML = periodOptions.map((option) => '<option value="' + option + '">Last ' + plural(option, 'day') + '</option>').join('');
    elements.days.value = String(days);
    elements.end.textContent = formatDate(state.end || lastDate, { year: 'numeric' });
    if (elements.search.value !== state.q) elements.search.value = state.q;
    elements.suite.innerHTML =
      '<option value="">All suites</option>' +
      suites.map((suite) => '<option' + (suite === state.suite ? ' selected' : '') + '>' + esc(suite) + '</option>').join('');
  }

  function renderSummary(data, dates) {
    const runs = data.days.flatMap((day) => day.runs);
    const failedRuns = runs.filter(isFailedRun);
    const flaky = data.tests.filter(tabFilter('flaky')).length;
    const recentlyFlaky = view.comparison ? view.comparison.recentlyFlakyIndexes.size : 0;
    const slowest = data.tests.filter(tabFilter('slowest')).reduce((top, test) => (!top || test.avg > top.avg ? test : top), null);
    const stats = [
      {
        tab: 'flaky',
        label: 'Flaky tests',
        value:
          numberFormat.format(flaky) +
          ' <small>of ' +
          numberFormat.format(data.tests.length) +
          (recentlyFlaky ? ', ' + numberFormat.format(recentlyFlaky) + ' recently flaky' : '') +
          '</small>',
        cls: flaky ? 'aca-is-retried' : ''
      },
      {
        tab: 'slowest',
        label: 'Slowest test',
        value: slowest ? formatDuration(slowest.avg) : 'none',
        cls: slowest ? 'aca-is-slow' : '',
        title: slowest ? slowest.title + ' (' + slowest.suite + '), average of its passed attempts. Show the slowest tests' : 'Show the slowest tests'
      },
      { tab: 'runs', label: 'Workflow runs', value: numberFormat.format(runs.length) },
      {
        tab: 'failed',
        label: 'Failed workflows',
        value: numberFormat.format(failedRuns.length),
        cls: failedRuns.length ? 'aca-is-failed' : ''
      }
    ];
    elements.summary.innerHTML = stats
      .map(
        ({ tab, label, value, cls = '', title }) =>
          '<button type="button" class="aca-stat ' +
          cls +
          '" data-tab="' +
          tab +
          '" title="' +
          esc(title || 'Show the ' + label.toLowerCase()) +
          '">' +
          '<div class="aca-value">' +
          value +
          '</div><div class="aca-label">' +
          esc(label) +
          '</div></button>'
      )
      .join('');
    const missing = dates.length - data.days.length;
    elements.daysNote.hidden = missing === 0;
    elements.daysNote.textContent = 'No data was collected for ' + missing + ' of the ' + plural(dates.length, 'day') + ' in this period.';
    renderDataIssues(periodDataIssues(data, dates));
  }

  function periodDataIssues(data, dates) {
    const collectIssues = data.days.flatMap((day) => (day.issues || []).map((issue) => ({ ...issue, date: issue.date || day.date })));
    const loadIssues = (metrics.loadIssues || []).filter((issue) => dates.includes(issue.date));
    return [...collectIssues, ...loadIssues].sort((first, second) => String(first.date).localeCompare(String(second.date)));
  }

  function renderDataIssues(issues) {
    const box = elements.dataIssues;
    box.hidden = issues.length === 0;
    if (!issues.length) return;
    const affectedDays = new Set(issues.map((issue) => issue.date)).size;
    const item = (issue) =>
      '<li><b>' +
      esc(formatDate(issue.date)) +
      '</b> ' +
      esc(issue.effect) +
      (issue.runUrl ? ' (<a href="' + esc(issue.runUrl) + '" target="_blank" rel="noopener">run</a>)' : '') +
      '<code>' +
      esc(issue.message) +
      '</code></li>';
    box.innerHTML =
      '<summary>' +
      emoji('⚠️') +
      plural(issues.length, 'data problem') +
      ' on ' +
      plural(affectedDays, 'day') +
      ' in this period. The numbers may be incomplete.</summary><ul>' +
      issues.map(item).join('') +
      '</ul>';
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
      .map(
        ([id, icon, label, count]) =>
          '<button type="button" role="tab" data-tab="' +
          id +
          '" aria-selected="' +
          (state.tab === id) +
          '">' +
          emoji(icon) +
          label +
          (count == null ? '' : ' <span class="aca-secondary">' + numberFormat.format(count) + '</span>') +
          '</button>'
      )
      .join('');
  }

  function matchesFilters(test) {
    const query = state.q.trim().toLowerCase();
    if (state.suite && test.suite !== state.suite) return false;
    return !query || (test.title + ' ' + test.suite + ' ' + test.file).toLowerCase().includes(query);
  }

  function tabFilter(tab) {
    if (tab === 'flaky') return (test) => test.retries > 0 || test.failures > 0;
    if (tab === 'slowest') return (test) => test.durationCount > 0;
    return () => true;
  }

  function isFailedRun(run) {
    return FAILED_CONCLUSIONS.has(run.conclusion);
  }

  function runTime(run) {
    return String(run.createdAt || run.date);
  }

  const mostFailuresFirstThenByTitle = (first, second) => second.failures - first.failures || String(first.title).localeCompare(String(second.title));
  const newestRunFirst = (first, second) => runTime(second).localeCompare(runTime(first));

  function sortRows(rows, columns, tieBreak = mostFailuresFirstThenByTitle) {
    const [defaultKey, defaultDir] = TAB_SORT[state.tab];
    const key = columns.some((candidate) => candidate.key === state.sort) ? state.sort : defaultKey;
    const dir = state.sort === key && state.dir ? state.dir : defaultDir;
    const column = columns.find((candidate) => candidate.key === key);
    const value = column.sortValue || ((row) => row[key]);
    const sign = dir === 'asc' ? 1 : -1;
    rows.sort((first, second) => {
      const firstValue = value(first);
      const secondValue = value(second);
      const comparison = typeof firstValue === 'string' ? firstValue.localeCompare(secondValue) : firstValue - secondValue;
      return comparison * sign || tieBreak(first, second);
    });
    return { key, dir };
  }

  function testColumns(rows) {
    const maxRate = Math.max(0, ...rows.map((test) => test.rate));
    const titleColumn = {
      key: 'title',
      label: 'Test',
      cls: 'aca-test',
      sortValue: (test) => test.suite + ' ' + test.title,
      render: (test) => testNameWithPath(test)
    };
    const retries = {
      key: 'retries',
      label: 'Retries',
      num: true,
      render: (test) =>
        '<span class="' +
        (test.retries ? 'aca-is-retried' : '') +
        '">' +
        numberFormat.format(test.retries) +
        '</span> <span class="aca-count-of">in ' +
        plural(test.runs, 'run') +
        '</span>'
    };
    const rate = {
      key: 'rate',
      label: 'Retried runs',
      num: true,
      render: (test) =>
        measure(test.rate, maxRate, numberFormat.format(test.retried) + ' <span class="aca-count-of">(' + percent(test.rate) + ')</span>')
    };
    const failures = {
      key: 'failures',
      label: 'Failed runs',
      num: true,
      render: (test) => '<span class="' + (test.failures ? 'aca-is-failed' : '') + '">' + numberFormat.format(test.failures) + '</span>'
    };
    const avg = {
      key: 'avg',
      label: 'Avg duration',
      num: true,
      render: (test) =>
        test.durationCount
          ? formatDuration(test.avg)
          : '<span class="aca-secondary" title="No passed attempt with timing data in this period">–</span>'
    };
    const setup = { key: 'setup', label: 'Setup', num: true, render: (test) => (test.durationCount ? formatDuration(test.setup) : '') };
    const max = { key: 'max', label: 'Longest', num: true, render: (test) => (test.durationCount ? formatDuration(test.max) : '') };
    const runs = { key: 'runs', label: 'Runs', num: true, render: (test) => numberFormat.format(test.runs) };
    const trend = {
      key: 'trend',
      label: 'Trend',
      sortValue: (test) =>
        [...test.daily].reduce((sum, [date, status]) => sum + (view.dates.includes(date) ? TREND_SORT_WEIGHT_BY_DAY_RESULT[status] : 0), 0),
      render: trendDots
    };
    if (state.tab === 'flaky') return [titleColumn, { ...retries, primary: true }, rate, failures, trend, avg];
    if (state.tab === 'slowest') return [titleColumn, { ...avg, primary: true }, setup, max, runs];
    return [titleColumn, runs, retries, rate, failures, avg, setup, max];
  }

  function runColumns() {
    const conclusionLabel = (conclusion) =>
      conclusion ? conclusion.charAt(0).toUpperCase() + conclusion.slice(1).replaceAll('_', ' ') : 'In progress';
    return [
      { key: 'date', label: 'Date', help: RUNS_HELP.date, sortValue: runTime, render: (run) => formatDate(run.date) },
      {
        key: 'workflow',
        label: 'Workflow',
        help: RUNS_HELP.workflow,
        sortValue: (run) => String(run.workflow || ''),
        render: (run) => esc(run.workflow)
      },
      {
        key: 'run',
        label: 'Run',
        help: RUNS_HELP.run,
        sortValue: (run) => String(run.title || run.id),
        render: (run) => '<a href="' + esc(run.url) + '" target="_blank" rel="noopener">' + esc(run.title || run.id) + '</a>'
      },
      {
        key: 'result',
        label: 'Result',
        help: RUNS_HELP.result,
        sortValue: (run) => CONCLUSION_SORT_RANK_WORST_LAST.indexOf(run.conclusion ?? null),
        render: (run) =>
          '<span class="' +
          (isFailedRun(run) ? 'aca-is-failed' : '') +
          '">' +
          esc(conclusionLabel(run.conclusion)) +
          '</span>' +
          (run.conclusionFrom === 'e2e-jobs'
            ? ' <span class="aca-secondary" title="The workflow was still running when this data was collected (it publishes this dashboard), so this is the result of its E2E jobs.">(E2E jobs)</span>'
            : '')
      },
      {
        key: 'cause',
        label: 'Cause',
        help: RUNS_HELP.cause,
        sortValue: (run) =>
          (run.failure || []).reduce((rank, [kind]) => Math.max(rank, kind === 'infra' ? INFRA_FAILURE_SORT_RANK : TEST_FAILURE_SORT_RANK), 0),
        render: failureCause
      }
    ];
  }

  function jobUrl(run, job, step) {
    return run.url + '/job/' + job + (step ? '#step:' + step + ':1' : '');
  }

  function failureCause(run) {
    const entries = (run.failure || []).map(([kind, name, job, step, stepName]) => ({ kind, name, job, step, stepName }));
    const dataProblems = (run.issues || []).length
      ? '<span class="aca-cause-data">' + emoji('⚠️') + 'Data missing:</span> ' + run.issues.map((issue) => esc(issue.effect)).join('; ')
      : '';
    if (!entries.length) return dataProblems || (isFailedRun(run) ? '<span class="aca-secondary">–</span>' : '');
    const link = (entry, text) =>
      run.url && entry.job
        ? '<a href="' + esc(jobUrl(run, entry.job, entry.step)) + '" target="_blank" rel="noopener">' + esc(text) + '</a>'
        : esc(text);
    const tests = entries.filter((cause) => cause.kind === 'tests');
    const infra = entries.filter((cause) => cause.kind !== 'tests');
    const parts = [];
    if (infra.length) {
      parts.push(
        '<span class="aca-cause-infra">Infrastructure:</span> ' +
          infra.map((cause) => link(cause, (cause.stepName || 'job failed') + ' (' + cause.name + ')')).join(', ')
      );
    }
    if (tests.length) {
      parts.push('<span class="aca-is-failed">Tests failed:</span> ' + tests.map((cause) => link(cause, cause.name)).join(', '));
    }
    if (dataProblems) parts.push(dataProblems);
    return parts.join('<br />');
  }

  function headerRow(columns, sort, lead = '#') {
    const leadCell = lead === null ? '' : '<th class="aca-num" scope="col"><span class="aca-secondary">' + esc(lead) + '</span></th>';
    return (
      '<tr>' +
      leadCell +
      columns
        .map((column) => {
          const sortDirection = sort.dir === 'asc' ? 'ascending' : 'descending';
          const sorted = sort.key === column.key ? ' aria-sort="' + sortDirection + '"' : '';
          return (
            '<th scope="col" data-sort="' +
            column.key +
            '"' +
            sorted +
            (column.num ? ' class="aca-num"' : '') +
            ' title="' +
            esc(column.help || COLUMN_HELP[column.key]) +
            '"><button type="button" class="aca-sort-button">' +
            esc(column.label) +
            '</button></th>'
          );
        })
        .join('') +
      '</tr>'
    );
  }

  function runSummary(test) {
    const runs = plural(test.runs, 'run');
    const stillFailed = test.failures ? ', ' + numberFormat.format(test.failures) + ' of which still failed' : '';
    let text = test.retried
      ? 'Needed a retry in ' + numberFormat.format(test.retried) + ' of ' + runs + stillFailed + '.'
      : 'Passed on the first attempt in all ' + runs + '.';
    const durations = test.runResults.map((result) => result.duration).filter((duration) => duration != null);
    if (durations.length) {
      text +=
        ' Passed runs took ' +
        formatDuration(Math.min(...durations)) +
        ' to ' +
        formatDuration(Math.max(...durations)) +
        ', ' +
        formatDuration(test.avg) +
        ' on average.';
    }
    return text;
  }

  function runLink(result, test) {
    const run = result.run || {};
    const name = WORKFLOW_NAMES[run.workflow] || run.workflow || 'Workflow run';
    const [job, step] = run.suites?.[test.suite] || [];
    const url = run.url && job ? jobUrl(run, job, step) : run.url;
    const title = job ? 'Open the test step of the ' + test.suite + ' job' : 'Open the workflow run';
    const link = url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener" title="' + esc(title) + '">' + esc(name) + '</a>' : esc(name);
    return link + (result.suiteAttempt > 1 ? ' <span class="aca-secondary">(suite re-run ' + result.suiteAttempt + ')</span>' : '');
  }

  function attemptList(result) {
    if (!result.attempts) return '';
    return result.attempts
      .map(
        ([status, duration, error]) =>
          '<div class="aca-attempt"><span class="' +
          (status === 'passed' ? '' : 'aca-attempt-failed') +
          '">' +
          (ATTEMPT_LABELS[status] || status) +
          (duration == null ? '' : ' ' + formatDuration(duration)) +
          '</span>' +
          (error ? '<div class="aca-attempt-error">' + esc(error) + '</div>' : '') +
          '</div>'
      )
      .join('');
  }

  function versusAverage(result, test) {
    if (result.duration == null || !test.durationCount) return '';
    const diff = result.duration - test.avg;
    const text = (diff >= 0 ? '+' : '−') + formatDuration(Math.abs(diff));
    return diff > test.avg * SLOW_RUN_FRACTION_ABOVE_AVERAGE
      ? '<span class="aca-slower">' + text + '</span>'
      : '<span class="aca-secondary">' + text + '</span>';
  }

  function runResultLabel(result, test) {
    const rescuedBySuiteRerun = result.suiteAttempt > 1 && result.outcome !== 'failed' && test.runsRescuedBySuiteRerun.has(result.run?.id);
    if (rescuedBySuiteRerun) return ['Passed on suite re-run', 'aca-is-retried'];
    const rerunWithSerialGroup = result.outcome === 'passed' && result.retries > 0;
    if (rerunWithSerialGroup) return ['Re-run with its serial group', 'aca-is-retried'];
    return OUTCOME_LABELS[result.outcome] || [result.outcome, ''];
  }

  function detailRow(test, colspan) {
    const results = test.runResults
      .slice()
      .sort(
        (first, second) =>
          String(second.run?.createdAt || second.date).localeCompare(String(first.run?.createdAt || first.date)) ||
          second.suiteAttempt - first.suiteAttempt
      );
    const showAllRuns = testsShowingAllRuns.has(test.index);
    const visibleRunResults = showAllRuns ? results : results.slice(0, RUN_LIMIT);
    const rows = visibleRunResults
      .map((result) => {
        const [label, cls] = runResultLabel(result, test);
        return (
          '<tr><td>' +
          formatDate(result.date) +
          '</td><td>' +
          runLink(result, test) +
          '</td><td><span class="' +
          cls +
          '">' +
          label +
          '</span></td>' +
          '<td class="aca-num">' +
          (result.retries || '<span class="aca-secondary">0</span>') +
          '</td><td class="aca-attempts">' +
          attemptList(result) +
          '</td>' +
          '<td class="aca-num">' +
          (result.duration == null ? '<span class="aca-secondary">–</span>' : formatDuration(result.duration)) +
          '</td>' +
          '<td class="aca-num">' +
          (result.setup == null ? '' : formatDuration(result.setup)) +
          '</td><td class="aca-num">' +
          versusAverage(result, test) +
          '</td></tr>'
        );
      })
      .join('');
    let html =
      '<tr class="aca-detail"><td></td><td colspan="' +
      colspan +
      '"><div class="aca-detail-head"><h2>Runs</h2>' +
      '<button type="button" class="aca-link-button" data-copy-link>Copy link to this test</button></div>' +
      '<p class="aca-detail-summary">' +
      esc(runSummary(test)) +
      '</p>' +
      '<p class="aca-detail-trend"><span class="aca-secondary">Last ' +
      plural(view.dates.length, 'day') +
      ':</span> ' +
      trendDots(test) +
      '</p>';
    if (results.length) {
      html +=
        '<table><thead><tr><th>Date</th><th title="Opens the step that ran the tests in the suite job">Run</th><th>Result</th><th class="aca-num">Retries</th><th>Attempts</th>' +
        '<th class="aca-num" title="Passed attempt, including setup">Duration</th><th class="aca-num">Setup</th>' +
        '<th class="aca-num" title="Difference from the average duration in the selected period. Runs more than 20% slower are highlighted.">vs average</th></tr></thead><tbody>' +
        rows +
        '</tbody></table>';
    }
    if (results.length > RUN_LIMIT) {
      html +=
        '<div class="aca-more"><button type="button" data-runs-toggle="' +
        test.index +
        '">' +
        (showAllRuns ? 'Show the latest ' + RUN_LIMIT + ' runs only' : 'Show all ' + results.length + ' runs') +
        '</button></div>';
    }
    if (test.daysWithoutDetail) {
      html +=
        '<p class="aca-detail-note">Run details are kept for ' +
        (metrics.detailDays || 14) +
        ' days, so ' +
        plural(test.daysWithoutDetail, 'earlier day') +
        ' only count towards the totals.</p>';
    }
    return html + '</td></tr>';
  }

  function legend(entries) {
    return (
      '<details class="aca-legend" id="legend"' +
      (legendOpen ? ' open' : '') +
      '><summary>What the columns mean</summary><p>' +
      esc(TAB_INTRO[state.tab]) +
      '</p><dl>' +
      entries.map(([term, text]) => '<dt>' + esc(term) + '</dt><dd>' + esc(text) + '</dd>').join('') +
      '</dl></details>'
    );
  }

  function rowToggle(total, limit, noun) {
    if (total <= limit) return '';
    const label = showAll ? 'Show the top ' + limit + ' only' : 'Show all ' + numberFormat.format(total) + ' ' + noun;
    return '<div class="aca-more"><button type="button" id="toggle-rows" aria-expanded="' + showAll + '">' + label + '</button></div>';
  }

  function renderTests(rows) {
    const columns = testColumns(rows);
    const sort = sortRows(rows, columns);
    const help = legend(columns.map((column) => [column.label, COLUMN_HELP[column.key]]));
    if (!rows.length) {
      elements.panel.innerHTML =
        '<p class="aca-empty">No tests match these filters. Clear the search or choose a longer period.</p>' +
        (state.tab === 'flaky' ? fixedSection() : '') +
        help;
      return;
    }
    if (state.tab === 'all') {
      renderTree(rows, columns, sort, help);
      return;
    }
    const limit = TOP_LIMIT;
    const noun = state.tab === 'flaky' ? 'flaky tests' : 'tests by duration';
    const openTestIsBelowTopList = rows.findIndex((test) => test.index === openTestIndex()) >= limit;
    const visibleTests = showAll || openTestIsBelowTopList ? rows : rows.slice(0, limit);
    let html = '<div class="aca-table-wrap"><table><thead>' + headerRow(columns, sort) + '</thead><tbody>';
    visibleTests.forEach((test, position) => {
      html += testRow(test, columns, '<td class="aca-num aca-rank">' + (position + 1) + '</td>');
    });
    html += '</tbody></table></div>' + rowToggle(rows.length, limit, noun) + (state.tab === 'flaky' ? fixedSection() : '') + help;
    elements.panel.innerHTML = html;
  }

  function fixedSection() {
    if (!view.comparison) {
      return (
        '<p class="aca-detail-note">No data for the previous ' +
        plural(view.dates.length, 'day') +
        ', so recently flaky and fixed tests are not shown.</p>'
      );
    }
    const fixed = view.comparison.fixed.filter(matchesFilters).sort((first, second) => String(first.title).localeCompare(String(second.title)));
    const intro =
      'At least ' +
      plural(MIN_FLAKY_RUNS_BEFORE_FIX, 'flaky run') +
      ' in the previous ' +
      plural(view.comparison.days, 'day') +
      ', then at least ' +
      MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED +
      ' runs since, all without a retry.';
    return (
      '<section class="aca-fixed"><h2>' +
      emoji('✅') +
      'Fixed <span class="aca-secondary">' +
      numberFormat.format(fixed.length) +
      '</span></h2><p class="aca-detail-note">' +
      esc(intro) +
      '</p>' +
      (fixed.length
        ? '<ul>' +
          fixed
            .map(
              (test) =>
                '<li>' +
                escapeAndLinkTestCaseIds(titleParts(test).name) +
                ' <span class="aca-secondary">' +
                esc(test.suite) +
                ', ' +
                plural(test.runs, 'clean run') +
                '</span></li>'
            )
            .join('') +
          '</ul>'
        : '<p class="aca-secondary">None in this period.</p>') +
      '</section>'
    );
  }

  function cellClass(column) {
    return [column.num ? 'aca-num' : '', column.cls || '', column.primary ? 'aca-primary' : ''].join(' ').trim();
  }

  function testRow(test, columns, leadCell, renderTitle, titleCellStyle) {
    const open = test.index === openTestIndex();
    const cells = columns
      .map((column) =>
        column.key === 'title' && renderTitle
          ? '<td class="' + cellClass(column) + ' aca-tree-cell" style="' + titleCellStyle + '">' + renderTitle(test) + '</td>'
          : '<td class="' + cellClass(column) + '">' + column.render(test) + '</td>'
      )
      .join('');
    const html = '<tr class="aca-test-row" tabindex="0" aria-expanded="' + open + '" data-index="' + test.index + '">' + leadCell + cells + '</tr>';
    return open ? html + detailRow(test, columns.length) : html;
  }

  function titleParts(test) {
    const parts = test.title.split(TITLE_SEPARATOR);
    return { describes: parts.slice(0, -1), name: parts[parts.length - 1] };
  }

  function buildTree(tests) {
    const newGroup = (kind, name, key, level) => ({ kind, name, key, level, groups: new Map(), tests: [] });
    const root = newGroup('root', '', '', -1);
    const openIndex = openTestIndex();
    for (const test of tests) {
      const path = [['suite', test.suite], ['file', test.file], ...titleParts(test).describes.map((name) => ['describe', name])];
      let node = root;
      path.forEach(([kind, name], level) => {
        if (!node.groups.has(name)) {
          node.groups.set(name, newGroup(kind, name, JSON.stringify(path.slice(0, level + 1).map(([, groupName]) => groupName)), level));
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
    const add = (item, testCount) => {
      totals.testCount += testCount;
      for (const key of ['runs', 'retries', 'retried', 'failures', 'durationSum', 'durationCount', 'setupSum']) totals[key] += item[key];
      totals.max = Math.max(totals.max, item.max);
    };
    for (const child of group.groups.values()) add(summarizeGroup(child), child.testCount);
    for (const test of group.tests) add(test, 1);
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

  function treeRows(group, columns, sort) {
    const displayName = (item) => (item.kind ? item.name : titleParts(item).name);
    const value = (item) => (sort.key === 'title' ? displayName(item) : item[sort.key]);
    const sign = sort.dir === 'asc' ? 1 : -1;
    const children = [...group.groups.values(), ...group.tests].sort((first, second) => {
      const firstValue = value(first);
      const secondValue = value(second);
      const comparison = typeof firstValue === 'string' ? firstValue.localeCompare(secondValue) : firstValue - secondValue;
      return comparison * sign || Boolean(second.kind) - Boolean(first.kind) || displayName(first).localeCompare(displayName(second));
    });
    const level = group.level + 1;
    const levelStyle = '--level:' + level;
    return children
      .map((child) => {
        if (!child.kind) {
          const title = (test) =>
            '<div class="aca-test-title">' +
            escapeAndLinkTestCaseIds(titleParts(test).name) +
            '</div><div class="aca-test-meta">' +
            sourceLink(test) +
            '</div>';
          return testRow(child, columns, '<td></td>', title, levelStyle);
        }
        const open = isGroupOpen(child, group.groups.size);
        visibleGroupKeys.push(child.key);
        const name =
          '<div class="aca-group-name"><span class="aca-chevron" aria-hidden="true">' +
          (open ? '▾' : '▸') +
          '</span> ' +
          kindBadge(child.kind) +
          ' ' +
          esc(child.name) +
          ' <span class="aca-count-of">' +
          plural(child.testCount, 'test') +
          '</span></div>' +
          (child.kind === 'suite' ? suiteTiming(child.name) : '');
        const cells = columns
          .map((column) =>
            column.key === 'title'
              ? '<td class="' + cellClass(column) + ' aca-tree-cell" style="' + levelStyle + '">' + name + '</td>'
              : '<td class="' + cellClass(column) + '">' + column.render(child) + '</td>'
          )
          .join('');
        const row =
          '<tr class="aca-group-row ' +
          GROUP_KINDS[child.kind].rowClass +
          '" tabindex="0" aria-expanded="' +
          open +
          '" data-group="' +
          esc(child.key) +
          '"><td></td>' +
          cells +
          '</tr>';
        return open ? row + treeRows(child, columns, sort) : row;
      })
      .join('');
  }

  function renderTree(rows, columns, sort, help) {
    visibleGroupKeys = [];
    const body = treeRows(buildTree(rows), columns, sort);
    const tools =
      '<div class="aca-tree-tools"><button type="button" class="aca-link-button" data-groups="open">Expand all</button>' +
      '<button type="button" class="aca-link-button" data-groups="close">Collapse all</button></div>';
    elements.panel.innerHTML =
      tools +
      '<div class="aca-table-wrap"><table class="aca-tree"><thead>' +
      headerRow(columns, sort, '') +
      '</thead><tbody>' +
      body +
      '</tbody></table></div>' +
      help;
  }

  function expandAllGroups(open) {
    if (!open) {
      visibleGroupKeys.forEach((key) => userToggledGroups.set(key, false));
      render();
      return;
    }
    let hiddenGroupsRemain = true;
    while (hiddenGroupsRemain) {
      const visibleGroupCountBefore = visibleGroupKeys.length;
      visibleGroupKeys.forEach((key) => userToggledGroups.set(key, true));
      render();
      hiddenGroupsRemain = visibleGroupKeys.length > visibleGroupCountBefore;
    }
  }

  function renderRuns(runs) {
    const columns = runColumns();
    const help = legend(columns.map((column) => [column.label, column.help]));
    if (!runs.length) {
      const empty =
        state.tab === 'failed'
          ? 'No failed workflow runs in this period.'
          : 'No workflow runs match these filters. Clear the search or choose a longer period.';
      elements.panel.innerHTML = '<p class="aca-empty">' + empty + '</p>' + help;
      return;
    }
    const sort = sortRows(runs, columns, newestRunFirst);
    elements.panel.innerHTML =
      '<div class="aca-table-wrap"><table><thead>' +
      headerRow(columns, sort, null) +
      '</thead><tbody>' +
      runs.map((run) => '<tr>' + columns.map((column) => '<td>' + column.render(run) + '</td>').join('') + '</tr>').join('') +
      '</tbody></table></div>' +
      help;
  }

  function suiteTimes(days) {
    const bySuite = new Map();
    for (const day of days) {
      for (const run of day.runs) {
        for (const [name, [, , setup, testsTime, total]] of Object.entries(run.suites || {})) {
          if (total == null || setup == null || testsTime == null) continue;
          const suite = bySuite.get(name) || { jobs: 0, total: 0, setup: 0, tests: 0 };
          suite.jobs += 1;
          suite.total += total;
          suite.setup += setup;
          suite.tests += testsTime;
          bySuite.set(name, suite);
        }
      }
    }
    return bySuite;
  }

  function suiteTiming(name) {
    const times = view.suiteTimes.get(name);
    if (!times) return '';
    const share = times.setup / times.total;
    const seconds = (sum) => formatDuration((sum / times.jobs) * 1000);
    return (
      '<div class="aca-suite-timing" title="Average of ' +
      plural(times.jobs, 'suite job') +
      ' in this period. Setup is the time before the tests start: runner preparation, ACS deploy, installs and browser setup.">' +
      'CI job ' +
      seconds(times.total) +
      ' on average: ' +
      seconds(times.setup) +
      ' setup (' +
      percent(share) +
      '), ' +
      seconds(times.tests) +
      ' tests</div>'
    );
  }

  function render() {
    const dates = rangeDates();
    const data = aggregate(dates);
    view = { dates, comparison: compareFlakyWithPreviousPeriod(dates, data.tests), suiteTimes: suiteTimes(data.days) };
    const suites = [...new Set(metrics.tests.map(([suite]) => suite))].sort();
    const filtered = data.tests.filter(matchesFilters);
    const query = state.q.trim().toLowerCase();
    const runs = data.days
      .flatMap((day) => day.runs.map((run) => ({ ...run, date: day.date, issues: (day.issues || []).filter((issue) => issue.runId === run.id) })))
      .filter((run) => !query || (run.title + ' ' + run.workflow).toLowerCase().includes(query));
    const failedRuns = runs.filter(isFailedRun);
    renderMasthead();
    renderFilters(suites);
    renderSummary(data, dates);
    renderTabs({ flaky: filtered.filter(tabFilter('flaky')).length, all: filtered.length, runs: runs.length, failed: failedRuns.length });
    if (state.tab === 'runs') renderRuns(runs);
    else if (state.tab === 'failed') renderRuns(failedRuns);
    else renderTests(filtered.filter(tabFilter(state.tab)));
    if (scrollToOpenTest) {
      scrollToOpenTest = false;
      document.querySelector('tr.aca-test-row[aria-expanded="true"]')?.scrollIntoView({ block: 'center' });
    }
  }

  function addMonths(month, count) {
    const [year, monthIndex] = month.split('-').map(Number);
    return new Date(Date.UTC(year, monthIndex - 1 + count, 1)).toISOString().slice(0, 7);
  }

  function renderCalendar() {
    const selected = state.end || lastDate;
    const [year, monthIndex] = calendarMonth.split('-').map(Number);
    const daysInMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
    const offset = (new Date(Date.UTC(year, monthIndex - 1, 1)).getUTCDay() + 6) % 7;
    const title = new Date(Date.UTC(year, monthIndex - 1, 1)).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const tabStopDate = selected.startsWith(calendarMonth) ? selected : clampToDataRange(calendarMonth + '-01');
    let cells = WEEKDAYS.map((day) => '<span class="aca-weekday" aria-hidden="true">' + day + '</span>').join('') + '<span></span>'.repeat(offset);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = calendarMonth + '-' + String(day).padStart(2, '0');
      const disabled = date > lastDate || date < firstDate;
      const hasData = datesWithData.has(date);
      const label = formatDate(date, { weekday: 'long', year: 'numeric' }) + (hasData ? '' : ', no data');
      cells +=
        '<button type="button" class="aca-day' +
        (hasData ? ' aca-has-data' : '') +
        '" data-date="' +
        esc(date) +
        '" aria-label="' +
        esc(label) +
        '" aria-pressed="' +
        (date === selected) +
        '" tabindex="' +
        (date === tabStopDate ? 0 : -1) +
        '"' +
        (disabled ? ' disabled' : '') +
        '>' +
        day +
        '</button>';
    }
    elements.calendar.innerHTML =
      '<div class="aca-calendar-head">' +
      '<button type="button" data-month="-1" aria-label="Previous month"' +
      (calendarMonth <= firstDate.slice(0, 7) ? ' disabled' : '') +
      '>‹</button>' +
      '<strong>' +
      esc(title) +
      '</strong>' +
      '<button type="button" data-month="1" aria-label="Next month"' +
      (calendarMonth >= lastDate.slice(0, 7) ? ' disabled' : '') +
      '>›</button>' +
      '</div><div class="aca-calendar-grid" role="group" aria-label="' +
      esc(title) +
      '">' +
      cells +
      '</div>' +
      '<div class="aca-calendar-foot"><span>Dot: day with data</span><button type="button" class="aca-link-button" data-date="' +
      esc(lastDate) +
      '">Latest day</button></div>';
  }

  function focusDay(date) {
    const button = elements.calendar.querySelector('.aca-day[data-date="' + date + '"]');
    if (button) {
      elements.calendar.querySelectorAll('.aca-day').forEach((day) => (day.tabIndex = -1));
      button.tabIndex = 0;
      button.focus();
    }
  }

  function clampToDataRange(date) {
    if (date > lastDate) return lastDate;
    if (date < firstDate) return firstDate;
    return date;
  }

  function openCalendar() {
    calendarMonth = (state.end || lastDate).slice(0, 7);
    renderCalendar();
    elements.calendar.show();
    elements.end.setAttribute('aria-expanded', 'true');
    focusDay(state.end || lastDate);
  }

  function closeCalendar(returnFocus) {
    if (!elements.calendar.open) return;
    elements.calendar.close();
    elements.end.setAttribute('aria-expanded', 'false');
    if (returnFocus) elements.end.focus();
  }

  elements.end.addEventListener('click', () => (elements.calendar.open ? closeCalendar(false) : openCalendar()));
  elements.calendar.addEventListener('click', (event) => {
    const monthButton = event.target.closest('[data-month]');
    if (monthButton) {
      calendarMonth = addMonths(calendarMonth, Number(monthButton.dataset.month));
      renderCalendar();
      elements.calendar.querySelector('[data-month="' + monthButton.dataset.month + '"]')?.focus();
      return;
    }
    const dayButton = event.target.closest('[data-date]');
    if (dayButton && !dayButton.disabled) {
      closeCalendar(true);
      setState({ end: dayButton.dataset.date === lastDate ? '' : dayButton.dataset.date });
    }
  });
  elements.calendar.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCalendar(true);
      return;
    }
    const day = event.target.closest('.aca-day');
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
    if (!day || !step) return;
    event.preventDefault();
    const next = clampToDataRange(shiftDate(day.dataset.date, step));
    if (next.slice(0, 7) !== calendarMonth) {
      calendarMonth = next.slice(0, 7);
      renderCalendar();
    }
    focusDay(next);
  });
  document.addEventListener('mousedown', (event) => {
    if (!elements.dateField.contains(event.target)) closeCalendar(false);
  });

  elements.days.addEventListener('change', (event) => setState({ days: event.target.value }));
  elements.search.addEventListener('input', (event) => setState({ q: event.target.value }));
  elements.suite.addEventListener('change', (event) => setState({ suite: event.target.value }));
  elements.reset.addEventListener('click', () => setState({ ...DEFAULTS, tab: state.tab }));
  elements.tabs.addEventListener('click', (event) => {
    const tab = event.target.closest('button')?.dataset.tab;
    if (!tab) return;
    setState({ tab, sort: '', dir: '' });
    elements.tabs.querySelector('[data-tab="' + tab + '"]')?.focus({ preventScroll: true });
  });
  elements.summary.addEventListener('click', (event) => {
    const tab = event.target.closest('button[data-tab]')?.dataset.tab;
    if (!tab) return;
    setState({ tab, sort: '', dir: '' });
    const tabButton = elements.tabs.querySelector('[data-tab="' + tab + '"]');
    tabButton?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    tabButton?.focus({ preventScroll: true });
  });

  function toggleRow(row) {
    const index = Number(row.dataset.index);
    state = { ...state, test: openTestIndex() === index ? '' : testIds[index] };
    writeState();
    render();
    document.querySelector('tr.aca-test-row[data-index="' + index + '"]')?.focus();
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
    document.querySelector('tr.aca-group-row[data-group="' + CSS.escape(key) + '"]')?.focus();
  }

  function toggleTestInSet(testIndexes, index, toggleAttribute) {
    if (testIndexes.has(index)) testIndexes.delete(index);
    else testIndexes.add(index);
    render();
    document.querySelector('[' + toggleAttribute + '="' + index + '"]')?.focus();
  }

  function toggleTopList() {
    const openRowPosition = [...elements.panel.querySelectorAll('tr.aca-test-row')].findIndex((row) => row.getAttribute('aria-expanded') === 'true');
    const collapseHidesOpenTest = showAll && openRowPosition >= TOP_LIMIT;
    if (collapseHidesOpenTest) {
      state = { ...state, test: '' };
      writeState();
    }
    showAll = !showAll;
    render();
    $('toggle-rows')?.focus();
  }

  elements.panel.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    const copyButton = event.target.closest('[data-copy-link]');
    if (copyButton) {
      copyTestLink(copyButton);
      return;
    }
    const groupsButton = event.target.closest('[data-groups]');
    if (groupsButton) {
      expandAllGroups(groupsButton.dataset.groups === 'open');
      elements.panel.querySelector('[data-groups="' + groupsButton.dataset.groups + '"]')?.focus();
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
      elements.panel.querySelector('th[data-sort="' + header.dataset.sort + '"] .aca-sort-button')?.focus();
      return;
    }
    const row = event.target.closest('tr.aca-test-row');
    if (row) toggleRow(row);
    const groupRow = event.target.closest('tr.aca-group-row');
    if (groupRow) toggleGroup(groupRow);
  });
  elements.panel.addEventListener(
    'toggle',
    (event) => {
      if (event.target.id === 'legend') legendOpen = event.target.open;
    },
    true
  );
  elements.dataIssues.addEventListener('toggle', (event) => (dataIssuesOpen = event.target.open));
  elements.panel.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const row = event.target.closest('tr.aca-test-row, tr.aca-group-row');
    if (!row || event.target.closest('a, button')) return;
    event.preventDefault();
    row.classList.contains('aca-group-row') ? toggleGroup(row) : toggleRow(row);
  });
  window.addEventListener('hashchange', () => {
    state = readState();
    scrollToOpenTest = Boolean(state.test);
    render();
  });
  render();
})();
