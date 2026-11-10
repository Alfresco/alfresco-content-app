'use strict';

const TOP_LIMIT = 10;
const RUN_LIMIT = 20;
const SLOW_RUN_FRACTION_ABOVE_AVERAGE = 0.2;
const BRANCH = window.E2E_HISTORY?.branch || 'develop';
const WORKFLOW_NAMES = { 'cron-e2e-chrome.yml': 'Daily chrome run', 'populate-e2e-reports.yml': 'Populate run' };
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
const DEFAULTS = { env: '', tab: 'flaky', failed: '', days: '14', end: '', q: '', suite: '', sort: '', dir: '', test: '' };
const TAB_SORT = {
  flaky: ['retries', 'desc'],
  slowest: ['avg', 'desc'],
  all: ['title', 'asc'],
  runs: ['date', 'desc'],
  reasons: ['attempts', 'desc'],
  excluded: ['title', 'asc']
};
const TAB_GROUPS = [
  { label: 'Tests', tabs: ['flaky', 'slowest', 'all', 'excluded'] },
  { label: 'Runs and failures', tabs: ['runs', 'reasons'] }
];
const LEGACY_FAILED_TAB = 'failed';
const ONLY_FAILED_RUNS = 'only';
const RANDOM_ERROR_PARTS = [
  [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '<uuid>'],
  [/(?<=[A-Za-z0-9]-)(?=[a-z0-9]*\d)(?=[a-z0-9]*[a-z])[a-z0-9]{5}(?![A-Za-z0-9])/g, '<id>'],
  [/\b\d{6,}\b/g, '<number>']
];
const MIN_FLAKY_RUNS_BEFORE_FIX = 5;
const MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED = 3;
const TREND_SORT_WEIGHT_BY_DAY_RESULT = { failed: 2, retried: 1, passed: 0, environment: 0 };
const INFRA_FAILURE_SORT_RANK = 2;
const TEST_FAILURE_SORT_RANK = 1;
const TEST_ID_PATTERN = /\bXAT-\d+\b/g;
const TREND_LABELS = { passed: 'passed', retried: 'needed a retry', failed: 'failed', environment: 'not counted (environment problem)' };
const TREND_DOT_CLASSES = {
  passed: 'aca-dot-passed',
  retried: 'aca-dot-retried',
  failed: 'aca-dot-failed',
  environment: 'aca-dot-environment'
};
const NO_RUN_DOT_CLASS = 'aca-dot-none';
const E2E_JOBS_RESULT_HELP =
  'The workflow was still running when this data was collected (it publishes this dashboard), so this is the result of its E2E jobs.';
const ENVIRONMENT_REASON_LABELS = {
  incident: 'suite-wide incident in this suite attempt',
  error: 'environment error'
};
const ENVIRONMENT_HELP =
  'Every E2E job deploys its own local ACS. A test run counts as affected by an environment problem when at least 4 and at least half of its suite\'s tests needed a retry or failed in the same suite attempt (suite incident), or when all its failed attempts failed with an environment error: a network error, an HTTP 5xx, 401 or 403 response, or a search indexing helper that gave up after its retries ("… not found after 90 retries", "… not indexed for …", "… not found in search results"). A failed "Deploy local ACS" or "Before e2e" step stops the job before its tests run, so it only shows as the cause of the failed run. With "Hide environment problems" checked, the affected test runs are not counted in runs, retries and failures; durations always include them.';

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
    'One dot per day of the period, oldest first: green passed, amber needed a retry, red failed after all retries, teal ring not counted because of an environment problem, empty did not run. "Recently flaky" marks tests that were not flaky in the previous period of the same length.'
};
const TAB_INTRO = {
  flaky: `Tests that needed at least one retry or failed in the selected period, ordered by retries. "Recently flaky" under the trend marks tests that were not flaky in the previous period of the same length; tests that had at least ${MIN_FLAKY_RUNS_BEFORE_FIX} flaky runs then and only clean runs now (at least ${MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED}) are listed under the table as fixed.`,
  slowest: 'Tests that passed at least once in the selected period, ordered by average duration.',
  all: 'Every test that ran in the selected period, grouped by suite, test file and describe block. Group rows show the totals of their tests; suite rows also show the average CI time of the suite job, split into setup before the tests (ACS deploy, installs) and the tests themselves, and, when it happened, how often the CI job failed and how many suite incidents it had. Click a group to expand or collapse it.',
  runs: `Workflow runs whose test results are included: the daily chrome E2E run and "E2E dashboard - Populate E2E Reports" runs on ${BRANCH}. Check "Only failed runs" to see the runs that failed or timed out; a failed run still provides results for the tests that ran.`,
  reasons:
    'Errors of the failed attempts in the selected period, grouped by message, so one cause that breaks many tests shows as one row. Only clearly random parts of test data names are replaced, so different failures are never merged; a failure whose message differs in other ways shows as several rows. Retries count as attempts. With "Hide environment problems" checked, test runs affected by environment problems are left out.',
  excluded:
    'Tests that are currently excluded from the chrome E2E runs, so they never run and do not appear in the other tabs. The list comes from the latest collected run of each suite and does not depend on the selected period.'
};
const SUITE_HEALTH_HELP =
  'How often the CI job of this suite failed in the selected period (because of its tests or a failed "Deploy local ACS" or "Before e2e" step), out of the workflow runs that ran it, and how many suite incidents it had: suite attempts where at least 4 and at least half of its tests needed a retry or failed. "Failed runs" in the columns counts single test runs instead.';
const COLUMN_NOTES = {
  avg: 'The setup is counted in full for every test instead of once for the whole suite, so the duration is how long the test would take if it ran on its own.'
};
const REASON_HELP = {
  reason:
    'The first line of the error of the failed attempts, with the random parts of test data names replaced by <id>, <uuid> or <number>, so the same failure in different runs is counted once. Open a row to see every original message and the tests that failed with it.',
  attempts: 'Failed attempts with this error, including retries. A test that failed 3 times in one run counts 3 times.',
  runs: 'Test runs (a test in one workflow run) with at least one failed attempt with this error.',
  tests: 'Different tests that failed with this error. A high number usually points to one shared cause.',
  seen: 'Day of the latest failed attempt with this error.'
};
const EXCLUDED_SCOPE_LABELS = { all: 'All browsers', chromium: 'Chromium' };
const EXCLUDED_HELP = {
  title:
    'Test that is excluded from the chrome E2E runs in the exclude.tests.json file of its suite, grouped by suite, test file and describe block.',
  scope: 'Whether the test is excluded for all browsers ("all" in exclude.tests.json) or only for the browser of the run.',
  ticket: 'The reason given in exclude.tests.json, usually the Jira ticket to fix and re-enable the test.'
};
const RUNS_HELP = {
  date: 'Day the workflow run started (UTC).',
  workflow: 'Workflow file that produced the results.',
  run: 'Link to the workflow run on GitHub, with its logs and artifacts.',
  result:
    'Outcome of the whole workflow run. A failed run still provides results for the tests that ran. For a run that was still in progress when its data was collected (the run that publishes the dashboard), the result of its E2E jobs is shown instead, marked "(E2E jobs)". Sorting puts failed runs first, then timed out, in progress, cancelled and successful runs.',
  cause:
    'Why a failed run failed: tests failing in a suite, an environment check ("Deploy local ACS" or "Before e2e") failing before the tests, or another infrastructure step (build, installs) failing before or around the tests. Suite incidents (at least 4 and at least half of a suite\'s tests needed a retry or failed in one suite attempt) are listed too. Links open the failed step. "Data missing" means part of the run\'s results could not be collected from GitHub, so its numbers are incomplete.'
};
