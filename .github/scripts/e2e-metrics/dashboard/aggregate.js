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
    environmentRuns: 0,
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

function getCountedDayTotals(
  [runs, retries, flakyRuns, failures],
  [environmentRuns = 0, environmentRetries = 0, environmentFlakyRuns = 0, environmentFailures = 0]
) {
  if (!isHidingEnvironmentProblems()) return { runs, retries, flakyRuns, failures };
  return {
    runs: runs - environmentRuns,
    retries: retries - environmentRetries,
    flakyRuns: flakyRuns - environmentFlakyRuns,
    failures: failures - environmentFailures
  };
}

function addDayTotals(tests, day) {
  for (const [
    index,
    allRuns,
    allRetries,
    allFlakyRuns,
    allFailures,
    durationSum,
    durationCount,
    durationMax,
    setupSum = 0,
    ...environment
  ] of day.tests) {
    if (!tests.has(index)) tests.set(index, createEmptyTestTotals(index));
    const test = tests.get(index);
    const { runs, retries, flakyRuns, failures } = getCountedDayTotals([allRuns, allRetries, allFlakyRuns, allFailures], environment);
    test.runs += runs;
    test.retries += retries;
    test.flakyRuns += flakyRuns;
    test.failures += failures;
    test.environmentRuns += environment[0] || 0;
    test.durationSum += durationSum;
    test.durationCount += durationCount;
    test.setupSum += setupSum;
    test.max = Math.max(test.max, durationMax);
    if (runs > 0) test.daily.set(day.date, getWorstResultOfDay({ failures, flakyRuns, retries }));
    else if (!test.daily.has(day.date)) test.daily.set(day.date, 'environment');
    if (!day.results) test.daysWithoutDetail += 1;
  }
}

function addDayRunResults(tests, day) {
  const getErrorText = (errorIndex) => (errorIndex == null ? null : (day.errors?.[errorIndex] ?? null));
  for (const [index, runIndex, suiteAttempt, outcome, retries, duration, setup, attempts, environment] of day.results || []) {
    tests.get(index)?.runResults.push({
      date: day.date,
      run: day.runs[runIndex],
      suiteAttempt,
      outcome,
      retries,
      duration,
      setup,
      attempts: attempts?.map(([status, attemptDuration, errorIndex]) => [status, attemptDuration, getErrorText(errorIndex)]),
      environment: environment || null
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
  const countedTests = [...tests.values()].filter((test) => test.runs > 0);
  const timedTests = [...tests.values()].filter((test) => test.durationCount > 0);
  const environmentRuns = [...tests.values()].reduce((sum, test) => sum + test.environmentRuns, 0);
  return { days, tests: countedTests, timedTests, environmentRuns };
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

function getSuiteStatsKey(name) {
  return String(name).toLowerCase().replace(/\s+/g, '-');
}

function getSuiteStats(statsBySuite, name) {
  const key = getSuiteStatsKey(name);
  if (!statsBySuite.has(key)) {
    statsBySuite.set(key, { jobs: 0, total: 0, setup: 0, tests: 0, runs: 0, failedRuns: 0, environmentFailedRuns: 0, incidents: 0 });
  }
  return statsBySuite.get(key);
}

function addSuiteJobTimes(statsBySuite, run) {
  for (const [name, [, , setup, testsTime, total]] of Object.entries(run.suites || {})) {
    if (total == null || setup == null || testsTime == null) continue;
    const suite = getSuiteStats(statsBySuite, name);
    suite.jobs += 1;
    suite.total += total;
    suite.setup += setup;
    suite.tests += testsTime;
  }
}

function addSuiteJobOutcomes(statsBySuite, run) {
  const failureKindBySuite = new Map((run.failure || []).filter(([kind]) => kind !== 'infra').map(([kind, name]) => [getSuiteStatsKey(name), kind]));
  const suitesInRun = new Set([...Object.keys(run.suites || {}).map(getSuiteStatsKey), ...failureKindBySuite.keys()]);
  for (const key of suitesInRun) {
    const suite = getSuiteStats(statsBySuite, key);
    suite.runs += 1;
    if (failureKindBySuite.has(key)) suite.failedRuns += 1;
    if (failureKindBySuite.get(key) === 'environment') suite.environmentFailedRuns += 1;
  }
  for (const [name] of run.incidents || []) {
    getSuiteStats(statsBySuite, name).incidents += 1;
  }
}

function collectSuiteStats(days) {
  const statsBySuite = new Map();
  for (const day of days) {
    for (const run of day.runs) {
      addSuiteJobTimes(statsBySuite, run);
      addSuiteJobOutcomes(statsBySuite, run);
    }
  }
  return statsBySuite;
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
  return () => true;
}

function isFailedRun(run) {
  return FAILED_CONCLUSIONS.has(run.conclusion);
}

function getRunTime(run) {
  return String(run.createdAt || run.date);
}
