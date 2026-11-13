# Playwright E2E Tests

This directory contains end-to-end (E2E) tests for the Alfresco Content Application using Playwright.

## Table of Contents

- [Running Tests Locally](#running-tests-locally)
- [Running Tests in CI](#running-tests-in-ci)
- [Viewing Test Results](#viewing-test-results)
- [Browser Support](#browser-support)
- [Excluding Tests](#excluding-tests)
- [Test Configuration](#test-configuration)
- [Troubleshooting](#troubleshooting)

## Running Tests Locally

### Prerequisites

1. Install dependencies:
   ```bash
   npm ci
   ```

2. Install Playwright browsers:
   ```bash
   # Install Chromium only (default)
   npm run ci:playwright:install
   
   # Install all browsers (Chromium, Chrome, Firefox, WebKit, MS Edge)
   npm run ci:playwright:install:all
   ```
   
   **Note**: Chrome/Chromium and MS Edge use real browser binaries. Firefox uses Playwright's patched version. Safari/WebKit uses emulation (not supported in CI).

### Running a Specific Test Suite

Each test suite can be run independently using Nx:

```bash
# Run authentication tests
nx run authentication-e2e:e2e

# Run viewer tests
nx run viewer-e2e:e2e

# Run search tests
nx run search-e2e:e2e
```

### Running with Options

You can run tests with various configurations:

```bash
# Run in UI mode (interactive)
nx run authentication-e2e:e2e --configuration=ui

# Run in headed mode (see browser)
nx run authentication-e2e:e2e --configuration=headed

# Run in debug mode
nx run authentication-e2e:e2e --configuration=debug
```

### Running with Specific Browser

Set the `PLAYWRIGHT_BROWSER` environment variable:

```bash
# Run with Firefox
PLAYWRIGHT_BROWSER=firefox nx run authentication-e2e:e2e

# Run with WebKit
PLAYWRIGHT_BROWSER=webkit nx run authentication-e2e:e2e

# Run with MS Edge
PLAYWRIGHT_BROWSER=msedge nx run authentication-e2e:e2e

# Run with Chrome (default)
PLAYWRIGHT_BROWSER=chrome nx run authentication-e2e:e2e
```

### Running All Tests

To run all test suites, you can use the CI command:

```bash
# Set the E2E_TARGET environment variable to the suite name
E2E_TARGET=authentication npm run ci:e2e
```

## Running Tests in CI

### Pull Request Workflow

When a pull request is opened, synchronized, or reopened against `master` or `develop` branches, the following happens:

1. **Lint** - Code linting checks
2. **Build** - Application build
3. **Unit Tests** - Unit test execution
4. **E2E Playwright Tests** - All test suites run across multiple browsers

#### Test Matrix

The CI runs tests in a matrix configuration:

- **Browsers**: `all`, `chromium`, `firefox`, `webkit`, `msedge`
- **Test Suites**: All available test suites

Each combination of browser and test suite runs in parallel, creating multiple test jobs.

#### Example Job Name Format

```
E2E | chromium | authentication | Playwright
E2E | firefox | viewer | Playwright
```

### Scheduled Workflows

Tests also run on a schedule:
- **Schedule**: Every weekday at 12:00 UTC (`0 12 * * 1-5`)
- **Configuration**: Same as pull request workflow

### CI Environment Variables

The following environment variables are set in CI:

```yaml
BASE_URL: http://localhost
ADMIN_EMAIL: admin
ADMIN_PASSWORD: admin
PLAYWRIGHT_E2E_HOST: http://localhost:4200
PLAYWRIGHT_BROWSER: ${{ matrix.browser }}
MAXINSTANCES: 2
RETRY_COUNT: 2
```

### CI Test Execution Flow

1. Deploy Local ACS
2. Install Dependencies (`npm ci`)
3. Install Playwright Browsers
4. Start Application
5. Run Tests
6. Collect Artifacts (reports, screenshots, videos, traces)

## Viewing Test Results

When tests run in CI, results are available in two places: **GitHub Actions** and **Report Portal**.

### Viewing Results in GitHub Actions

1. Navigate to the repository's **Actions** tab and select the workflow run
2. Find the specific test job (e.g., `E2E | chromium | authentication | Playwright`)
3. View test output and logs in the job output
4. Download test artifacts on failure:
   - Screenshots, videos (`.webm`), and traces (`.zip`)
   - Analyze traces using: `npx playwright show-trace <trace-file.zip>`
5. Application logs are available as artifacts named `logs-<browser>-<suite-name>`

### Viewing Results in Report Portal

CI e2e test results are automatically reported to Report Portal for analysis and historical tracking. The Report Portal URL is available in the GitHub Actions workflow run under "Run e2e Playwright" section.

**Sample URL format**: `https://reportportal-dev.studio.dev.experience.hyland.com/ui/#alfresco-content-app/launches/all/<launch-id>`

- Project name: `alfresco-content-app`
- Tests are reported only in CI environments (not locally)

### E2E Dashboard (Flaky and Slow Tests)

Flaky and slow tests are tracked on the **E2E dashboard**, published to GitHub Pages (`https://alfresco.github.io/alfresco-content-app/`) by the [E2E dashboard - Daily collection](../../.github/workflows/e2e-metrics-report.yml) workflow. Only runs on `develop` are counted. All workflows that feed the dashboard are named `E2E dashboard - …` in the Actions tab.

1. **Data collection** - the [E2E dashboard - Daily chrome E2E run](../../.github/workflows/cron-e2e-chrome.yml) and the [E2E dashboard - Populate E2E Reports](../../.github/workflows/populate-e2e-reports.yml) workflow (runs the suites in chrome against a locally deployed ACS, like the cron runs and pull requests) write a metrics report of every suite attempt (`E2E_METRICS_FILE`, written by the [e2e-metrics reporter](../../projects/aca-playwright-shared/src/base-config/e2e-metrics.reporter.ts), including the first line of the error of every failed attempt), plus the list of its excluded tests (`excluded.json`, from a quick `playwright test --list` run of the same config in the **List excluded tests** step of the [run-e2e-playwright](../../.github/actions/run-e2e-playwright/action.yml) action), and upload them as an `e2e-metrics-<browser>-<suite>` artifact (kept for 14 days). The collection also reads the jobs of each run: the job and test step of every suite (for links and CI timing) and, for failed runs, which step failed.
2. **Daily** (04:00 UTC) - the previous UTC day's runs are compacted into an `e2e-metrics-daily-<date>` artifact (kept for 28 days, so a 14-day report and the 14 days before it can always be loaded) with per-test and per-run results, and the dashboard is rebuilt and deployed. The dashboard keeps 28 days of daily totals, so a period can be compared with the one before it, and 14 days of per-run results, which keeps the stored data small. The published data is also uploaded as the `e2e-dashboard-history` artifact (kept for 90 days), which the next build starts from; only when that artifact does not exist (the first build, or no build for 90 days) is the published `data/history.json` read from GitHub Pages instead. If the history cannot be read, nothing is published, so the history is never lost. Do not add `concurrency` to the jobs that call the publish workflow: on `develop`, the called workflow then did not start at all and GitHub showed no error. Builds are therefore not serialized: if two of them overlap, the one that finishes last is published, and Populate runs collected live for the current day can be missing from the dashboard until the next daily collection, which reloads them from the daily artifacts of the last 28 days.
3. **Weekly** (Mondays) - a short card is posted to the E2E Teams channel: the period, the change since the previous period (flaky tests, failed test runs and the share of test runs that needed a retry), the 3 most flaky and 3 slowest tests and an **Open report** button. The button opens the dashboard once it is published to GitHub Pages, otherwise the workflow run. The full flaky/slowest/recently flaky/fixed lists are in the workflow run summary and in the `e2e-metrics-weekly-<date>` artifact. The card is built and sent by a separate job of the daily collection, so it is still posted when the dashboard publish of that run fails.

The dashboard lets you pick the date range, search tests (title, file or XAT id), filter by suite, sort the lists and click a test to see each of its runs: the result, retries, every attempt with its time and error message, and how the run compares with the test's average. Run links open the step that ran the tests in the suite's job. The tab bar can be used with the keyboard (arrow keys, Home and End). The view, including the open test, is kept in the URL, so it can be shared as a link (**Copy link to this test**). XAT ids link to Jira (override with the `E2E_TEST_CASE_URL` repository variable, `{id}` is replaced).

The tabs are grouped into **Tests** (Flaky tests, Slowest tests, All tests, Excluded tests) and **Runs and failures** (Workflow runs, Failure reasons).

- **Flaky tests** - retries and runs (e.g. `4 in 10 runs`), the share of runs that needed a retry and a trend dot per day. **Recently flaky** under the trend marks tests that were not flaky in the previous period of the same length; tests that had at least 5 flaky runs (needed a retry or failed) in the previous period and at least 3 runs since, all without a retry, are listed as **Fixed** under the list
- **Slowest tests** - average duration of passed attempts, from longest to shortest. Durations include the test's `beforeAll` and `beforeEach` hooks (shown separately as setup) and its `afterEach` hooks, so a duration is how long the test would take if it ran on its own; `afterAll` hooks are not counted. Playwright runs a `beforeAll` hook once per worker, so a hook shared by several tests is counted in full for each of them
- **All tests** - every test grouped by suite, file and describe block. Suite rows also show the average CI time of the suite job, split into setup before the tests (ACS deploy, installs) and the tests themselves. When it happened, suite rows also say in how many runs the CI job of the suite failed (and how many of those on an environment check) and how many suite incidents it had
- **Excluded tests** - tests that are excluded from the chrome runs in the `exclude.tests.json` of their suite, grouped like **All tests**, with whether they are excluded for all browsers or one browser and a link to the ticket. The list comes from the latest collected run of each suite, not from the selected period
- **Workflow runs** - every workflow run whose results are included; check **Only failed runs** (or click the **Failed workflows** summary card) to see the runs that failed, with their cause: tests failing in a suite, an environment check (`Deploy local ACS` or `Before e2e`) failing, or another infrastructure step (build, installs...) failing. Runs that failed before producing any test result are listed too
- **Failure reasons** - the errors of the failed attempts in the period, grouped by message so one cause that breaks many tests shows as one row, with the number of failed attempts, test runs and tests and the last day it happened. Only clearly random parts of test data names are replaced (`<id>`, `<uuid>`, `<number>`: UUIDs, numbers of 6+ digits and the 5-character `Utils.random()` suffix after a hyphen when it mixes letters and digits, such as `folder-x9k2m`), so different failures are never merged; labels such as `user1` are kept, and a random suffix made of letters or digits only (`folder-qwert`) is not replaced, so such a failure can show as several rows. Open a row to see every original message and the tests, and open a test from there. Errors are kept for 14 days, so when a longer period is selected, the tab says which of its days are not included

**Environment problems** - every suite job deploys its own local ACS, and a broken ACS or slow search indexing can fail tests that are fine. A test run is marked as affected by an environment problem when:

- its suite had a **suite incident**: at least 4 and at least half of the suite's tests needed a retry or failed in the same suite attempt (tests that did not run, for example after a timeout, count in the suite's tests). When the whole suite is re-run, only the attempt with the incident is marked
- all its failed attempts failed with an **environment error**: a network error (`net::ERR_*` other than `ERR_ABORTED`, `ECONNRESET`, `ETIMEDOUT`...), an HTTP 5xx, 401 or 403 response, or a search indexing helper of [search-api.ts](../../projects/aca-playwright-shared/src/api/search-api.ts) that gave up after its retries (`… not found after 90 retries`, `… not indexed for …`, `… not found in search results`, `waitForNodes: Timed out waiting …`). Other failures, such as timeouts, assertions and strict mode violations, count as test failures. These attempts are labelled **likely environment** on the dashboard

The **Hide environment problems** filter (checked by default) leaves these test runs out of the runs, retries and failures; durations always include them. The dashboard says how many test runs were left out, marks them in the runs of a test and shows the days with only such runs as a teal ring in the trend. A failed `Deploy local ACS` or `Before e2e` step stops the suite job before its tests run, so it is shown as an **Environment check failed** cause of the workflow run instead of an infrastructure one. `Check Search Indexing` runs with `continue-on-error`, and GitHub reports such a step as successful, so its failures are not detected. The weekly report always leaves these test runs out and says how many were left out.

To backfill a missing day or post the summary on demand, run the **E2E dashboard - Daily collection** workflow manually with the `date` and `post-report` inputs. Without a `date`, a manual run collects today (runs still in progress are not included); the daily scheduled run collects the previous day.

**When the GitHub API fails** - temporary errors (network errors, HTTP 5xx, rate limits) are retried up to 3 times, waiting for GitHub's `Retry-After` or rate-limit reset when given. A request that still fails does not stop the workflow: the rest of the day is collected and the problem is recorded as a **data problem** (what is missing and why, e.g. the results of one suite in one run). Data problems are shown as a warning banner on the dashboard (and as **Data missing** next to the affected workflow runs), in a **Data problems** section of the report, as one warning line on the Teams card and as warning annotations on the workflow run. Re-run the **E2E dashboard - Daily collection** workflow for that `date` to fill the gap. Test reports of the E2E runs are kept for 14 days; collecting a day whose reports have expired records a data problem for each expired report, and the dashboard keeps the data it published for that day.

To add data on demand, run **E2E dashboard - Populate E2E Reports** from `develop`. With the report checkbox checked, it also updates the dashboard with today's runs and posts a summary covering the last `report-days` days (default 14). Its last job, **Check that the dashboard was published**, fails with an error and a step summary that says how to publish the run manually if publishing did not succeed. Runs from other branches are never published; they upload a dashboard preview with that branch's runs of the last 14 days as the `e2e-dashboard` artifact instead (open `index.html` from it locally).

GitHub Pages must be enabled once by a repository admin: **Settings → Pages → Source: GitHub Actions**. A custom dashboard URL can be set with the `E2E_DASHBOARD_URL` repository variable; without it, the URL is read from the repository's GitHub Pages settings.

The [multibrowser cron run](../../.github/workflows/cron-e2e.yml) (firefox, webkit, msedge) runs every Saturday and is not counted in the dashboard.

#### Adding, renaming or removing suites

The dashboard picks up suites from the matrix of the [E2E Playwright reusable workflow](../../.github/workflows/e2e-playwright-reusable.yml), so most changes need nothing else:

- **New suite**: add the matrix entry and its `e2e/playwright/<suite>/playwright.config.ts` as usual. Tests are grouped under the project name passed to `createSuiteProjects`; the matrix name should be that name in lower case with hyphens instead of spaces (`Info Drawer` → `info-drawer`), so that CI job failures are shown on the right suite row. Its excluded tests are read from the `exclude.tests.json` next to the config. If a suite job runs its tests without a metrics report, the daily collection records a **data problem** naming the suite, so a missed job does not go unnoticed.
- **Renaming a suite, a test file or a test**: tests are identified by suite, file and title, so the renamed ones start as new tests and the old names disappear from the dashboard after the 28 days of history. Expect them in **Recently flaky** if they were flaky before.
- **Removing a suite**: its tests and excluded tests disappear once they are older than the history (28 days).

## Browser Support

The tests support the following browsers:

- **Chromium** (default) - Uses real Google Chrome browser
- **Firefox** - Uses Playwright's patched version
- **WebKit** - Safari-based browser (uses emulation, not supported in CI)
- **MS Edge** - Uses real Microsoft Edge browser

Browser-specific test exclusions are supported (see [Excluding Tests](#excluding-tests)).

## Excluding Tests

### How It Works

Test exclusion is handled through `exclude.tests.json` files located in each test suite directory. The exclusion system:

1. Reads the `exclude.tests.json` file for the current test suite
2. Checks the `PLAYWRIGHT_BROWSER` environment variable to determine the current browser
3. Applies exclusions based on:
   - **`all`** - Excludes tests for all browsers
   - **`chromium`** - Excludes tests only for Chromium
   - **`firefox`** - Excludes tests only for Firefox
   - **`webkit`** - Excludes tests only for WebKit
   - **`msedge`** - Excludes tests only for MS Edge

### Exclusion File Format

Each `exclude.tests.json` file follows this structure:

```json
{
  "all": {
    "XAT-4370": "https://hyland.atlassian.net/browse/ACS-5479"
  },
  "firefox": {
    "XAT-17773": "https://hyland.atlassian.net/browse/ACS-10917"
  },
  "webkit": {
    "XAT-5417": "https://hyland.atlassian.net/browse/ACS-10917"
  }
}
```

### Adding Test Exclusions

 **Example**:
   ```json
   {
     "all": {
       "XAT-4370": "https://hyland.atlassian.net/browse/ACS-5479"
     },
     "firefox": {
       "XAT-17773": "https://hyland.atlassian.net/browse/ACS-10917"
     }
   }
   ```

### How Exclusions Are Applied

- The exclusion system uses regex patterns to match test IDs
- Tests matching excluded IDs are skipped during execution
- Console output shows which tests are excluded and why
- Example console output:
  ```
  [ 🎭 Playwright Excludes - Authentication ] ❌ Tests excluded for browser 'firefox' because of 🐛 : XAT-17773 (from keys: all, firefox)
  ```

### Best Practices

- **Always include a Jira ticket** - Link to the bug or issue tracking the problem
- **Use specific browser exclusions** - Only exclude tests from browsers where they fail
- **Review exclusions regularly** - Remove exclusions when bugs are fixed
- **Document the reason** - The Jira ticket URL serves as documentation

## Test Configuration

### Global Configuration

Global test configuration is defined in `projects/aca-playwright-shared/src/base-config/playwright.config.ts`:

- **Timeout**: Global test timeout
- **Retries**: 2 retries on CI, 0 locally
- **Workers**: 3 parallel workers
- **Headless**: `true` on CI, configurable locally
- **Traces**: Retained on failure
- **Videos**: Retained on failure
- **Screenshots**: Captured only on failure

### Suite-Specific Configuration

Each test suite has its own `playwright.config.ts` that:
- Extends the global configuration
- Applies test exclusions via `grepInvert`
- Defines suite-specific projects

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PLAYWRIGHT_BROWSER` | Browser to use for tests | `chromium` |
| `PLAYWRIGHT_E2E_HOST` | Base URL for the application | `http://localhost:4200` |
| `PLAYWRIGHT_HEADLESS` | Run in headless mode | `true` (CI) / `false` (local) |


## Troubleshooting

### Tests Fail Locally

1. **Check application is running**:
   ```bash
   npm start
   ```
   Ensure the app is accessible at `http://localhost:4200`

2. **Verify browser installation**:
   ```bash
   npx playwright install
   ```

3. **Check environment variables**:
   ```bash
   echo $PLAYWRIGHT_BROWSER
   echo $PLAYWRIGHT_E2E_HOST
   ```

### CI Failures

When tests fail in CI:

1. Navigate to the failed job in GitHub Actions
2. Download test artifacts (screenshots, videos, traces) from the job's Artifacts section
3. Analyze traces using: `npx playwright show-trace <trace-file.zip>`

#### Additional Debugging Steps

1. Verify environment - Ensure all required services (ACS) are deployed correctly
2. Check environment variables - Verify all required secrets and variables are set
3. Review related logs - Check ACS deployment logs and application logs

### Debug Mode

Run tests in debug mode to step through execution:

```bash
nx run authentication-e2e:e2e --configuration=debug
```

This will:
- Open Playwright Inspector
- Allow step-by-step execution
- Show browser DevTools

## Additional Resources

- Project-specific test utilities: `projects/aca-playwright-shared/`

