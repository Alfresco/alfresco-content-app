'use strict';

function createEmptyTestTotals(index) {
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

function getWorstResultOfDay({ failures, flakyRuns, retries }) {
  if (failures) return 'failed';
  if (flakyRuns || retries) return 'retried';
  return 'passed';
}

function addDayTotals(tests, day) {
  for (const [index, runs, retries, flakyRuns, failures, durationSum, durationCount, durationMax, setupSum = 0] of day.tests) {
    if (!tests.has(index)) tests.set(index, createEmptyTestTotals(index));
    const test = tests.get(index);
    test.runs += runs;
    test.retries += retries;
    test.flakyRuns += flakyRuns;
    test.failures += failures;
    test.durationSum += durationSum;
    test.durationCount += durationCount;
    test.setupSum += setupSum;
    test.max = Math.max(test.max, durationMax);
    test.daily.set(day.date, getWorstResultOfDay({ failures, flakyRuns, retries }));
    if (!day.results) test.daysWithoutDetail += 1;
  }
}

function addDayRunResults(tests, day) {
  const getErrorText = (errorIndex) => (errorIndex == null ? null : (day.errors?.[errorIndex] ?? null));
  for (const [index, runIndex, suiteAttempt, outcome, retries, duration, setup, attempts] of day.results || []) {
    tests.get(index)?.runResults.push({
      date: day.date,
      run: day.runs[runIndex],
      suiteAttempt,
      outcome,
      retries,
      duration,
      setup,
      attempts: attempts?.map(([status, attemptDuration, errorIndex]) => [status, attemptDuration, getErrorText(errorIndex)])
    });
  }
}

function findRunsRescuedBySuiteRerun(runResults) {
  const resultsByRun = new Map();
  for (const result of runResults) {
    const id = result.run?.id;
    if (!resultsByRun.has(id)) resultsByRun.set(id, []);
    resultsByRun.get(id).push(result);
  }
  const rescued = new Set();
  for (const [id, results] of resultsByRun) {
    const failedInFirstSuiteAttempt = results.some((result) => result.suiteAttempt === 1 && result.outcome === 'failed');
    const passedInSuiteRerun = results.some((result) => result.suiteAttempt > 1 && result.outcome !== 'failed');
    if (failedInFirstSuiteAttempt && passedInSuiteRerun) rescued.add(id);
  }
  return rescued;
}

function finishTestTotals(test) {
  test.avg = test.durationCount ? test.durationSum / test.durationCount : 0;
  test.setup = test.durationCount ? test.setupSum / test.durationCount : 0;
  test.retried = test.flakyRuns + test.failures;
  test.rate = test.runs ? test.retried / test.runs : 0;
  test.runsRescuedBySuiteRerun = findRunsRescuedBySuiteRerun(test.runResults);
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

function sumSuiteTimes(days) {
  const timesBySuite = new Map();
  for (const day of days) {
    for (const run of day.runs) {
      for (const [name, [, , setup, testsTime, total]] of Object.entries(run.suites || {})) {
        if (total == null || setup == null || testsTime == null) continue;
        const suite = timesBySuite.get(name) || { jobs: 0, total: 0, setup: 0, tests: 0 };
        suite.jobs += 1;
        suite.total += total;
        suite.setup += setup;
        suite.tests += testsTime;
        timesBySuite.set(name, suite);
      }
    }
  }
  return timesBySuite;
}

function collectPeriodDataIssues(data, dates) {
  const collectIssues = data.days.flatMap((day) => (day.issues || []).map((issue) => ({ ...issue, date: issue.date || day.date })));
  const loadIssues = (metrics.loadIssues || []).filter((issue) => dates.includes(issue.date));
  return [...collectIssues, ...loadIssues].sort((first, second) => String(first.date).localeCompare(String(second.date)));
}

function matchesFilters(test) {
  const query = state.q.trim().toLowerCase();
  if (state.suite && test.suite !== state.suite) return false;
  return !query || `${test.title} ${test.suite} ${test.file}`.toLowerCase().includes(query);
}

function getTabFilter(tab) {
  if (tab === 'flaky') return isFlaky;
  if (tab === 'slowest') return (test) => test.durationCount > 0;
  return () => true;
}

function isFailedRun(run) {
  return FAILED_CONCLUSIONS.has(run.conclusion);
}

function getRunTime(run) {
  return String(run.createdAt || run.date);
}
