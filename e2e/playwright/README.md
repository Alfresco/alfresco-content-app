# Playwright E2E Tests

This directory contains end-to-end (E2E) tests for the Alfresco Content Application using Playwright.

## Table of Contents

- [Running Tests Locally](#running-tests-locally)
- [Running Tests in CI](#running-tests-in-ci)
- [Viewing Test Results](#viewing-test-results)
- [Test Suites](#test-suites)
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
   
   **Note**: 
   - When running Chrome/Chromium tests, the `playwright install chrome` command (included in `ci:playwright:install:all`) installs the Chrome browser binary that Playwright uses. The tests run on the actual Chrome browser, not an emulation.
   - When running MS Edge tests, the `playwright install msedge` command (included in `ci:playwright:install:all`) installs the Edge browser binary that Playwright uses. The tests run on the actual Edge browser, not an emulation.
   - Firefox uses Playwright's patched version (not real Firefox).
   - Safari/WebKit uses emulation (not supported in CI).

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

# Run with Chromium (default)
PLAYWRIGHT_BROWSER=chromium nx run authentication-e2e:e2e
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

- **Browsers**: `chromium`, `firefox`, `webkit`, `msedge`
- **Test Suites**: All 19 test suites (see [Test Suites](#test-suites))

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

1. **Deploy Local ACS** - Sets up Alfresco Content Services locally
2. **Install Dependencies** - Runs `npm ci`
3. **Install Playwright Browsers** - Installs all browsers for multi-browser testing
4. **Install System Dependencies** - Installs system dependencies (especially for WebKit)
5. **Start Application** - Starts the application server
6. **Run Tests** - Executes Playwright tests for the specific suite and browser
7. **Collect Artifacts** - Saves test reports, screenshots, videos, and traces

## Viewing Test Results

When tests run in CI, results are available in two places: **GitHub Actions** and **Report Portal**.

### Viewing Results in GitHub Actions

1. **Navigate to the workflow run**:
   - Go to the repository's **Actions** tab
   - Click on the workflow run (Pull Request or Scheduled)
   - Find the specific test job (e.g., `E2E | chromium | authentication | Playwright`)

2. **View test output**:
   - Test execution logs are displayed in the job output
   - Failed tests are highlighted with error messages and stack traces
   - The `github` reporter provides inline test results

3. **Download test artifacts**:
   - On test failure, Playwright automatically saves:
     - **Screenshots**: Captured at the point of failure
     - **Videos**: Full test execution recordings (`.webm` files)
     - **Traces**: Interactive trace files for debugging (`.zip` files)
   - Artifacts are available in the job's **Artifacts** section at the bottom
   - Download and analyze using Playwright Trace Viewer:
     ```bash
     npx playwright show-trace <trace-file.zip>
     ```

4. **View application logs**:
   - Kubernetes and application logs are collected as artifacts
   - Look for artifacts named `logs-<browser>-<suite-name>`

### Viewing Results in Report Portal

Test results are automatically sent to Report Portal for comprehensive analysis and historical tracking.

#### Finding the Report Portal URL

The Report Portal URL is configured as a GitHub secret. To find it:

1. **For repository administrators**:
   - Go to repository **Settings** → **Secrets and variables** → **Actions**
   - Look for the `REPORT_PORTAL_URL` secret
   - The URL will be visible in the secret value

2. **From workflow file**:
   - Check `.github/workflows/pull-request.yml`
   - Look for `REPORT_PORTAL_URL: ${{ secrets.REPORT_PORTAL_URL }}`
   - The actual URL is stored in GitHub secrets (not visible in the file)

#### Accessing Report Portal

1. **Navigate to Report Portal**:
   - Open the Report Portal URL in your browser
   - Log in with your credentials

2. **Select the project**:
   - Project name: `alfresco-content-app`

3. **Find your test run**:
   - Launches are named: `GitHub Actions - ACA - <browser>`
   - Use filters to find specific runs:
     - **Job**: GitHub job name (e.g., `E2E | chromium | authentication | Playwright`)
     - **Build_type**: `pull_request` or `schedule`
     - **Repository**: GitHub repository name
     - **Branch**: Branch name (e.g., `feature/my-branch`)
     - **Browser**: `chromium`, `firefox`, `webkit`, or `msedge`
   - Each launch description includes a link to the GitHub Actions run

#### Report Portal Features

- **Detailed test execution**: View individual test results with step-by-step execution
- **Failure analysis**: See screenshots, error messages, and logs for failed tests
- **Historical trends**: Track test stability and flakiness over time
- **Advanced filtering**: Filter by browser, suite, date range, or test status
- **Failure-focused**: Only failed tests are shown (`skipPassed: true`) to focus on issues
- **Test steps included**: Detailed step-by-step execution for debugging

#### Report Portal Configuration

- Tests are reported **only in CI environments** (not locally)
- Each browser has its own launch to avoid conflicts when running in parallel
- Launch descriptions include direct links back to the GitHub Actions run
- Test steps are included for detailed analysis

## Test Suites

The following test suites are available:

1. **authentication** - Login, logout, and authentication flows
2. **create-actions** - Creating files, folders, and libraries
3. **folder-rules** - Folder rule management
4. **viewer** - Document viewing functionality
5. **navigation** - Navigation and routing
6. **special-permissions** - Special permission handling
7. **pagination** - Pagination functionality
8. **list-views** - List view displays
9. **share-action** - Sharing functionality
10. **copy-move-actions** - Copy and move operations
11. **library-actions** - Library management
12. **info-drawer** - Information drawer functionality
13. **search** - Search functionality
14. **upload-download-actions** - Upload and download operations
15. **favorite-actions** - Favorite/unfavorite actions
16. **delete-actions** - Delete and restore operations
17. **edit-actions** - Edit operations
18. **smoke-test** - Quick smoke tests
19. **folder-information-actions** - Folder information actions

Each suite is located in its own directory under `e2e/playwright/`.

## Browser Support

The tests support the following browsers:

- **Chromium** (default) - Uses real Google Chrome browser via `channel: 'chrome'`
- **Firefox** - Mozilla Firefox (uses Playwright's patched version, not real Firefox)
- **WebKit** - Safari-based browser (uses emulation, not supported in CI)
- **MS Edge** - Microsoft Edge (uses real Edge browser via `channel: 'msedge'`)

**Browser Implementation Details**:
- **Chrome/Chromium**: Tests run on the actual Google Chrome browser installed on the system (or installed via `playwright install chrome`). This provides more accurate testing compared to emulation, as it uses the real browser engine and behavior that end-users experience.
- **MS Edge**: Tests run on the actual Microsoft Edge browser installed on the system (or installed via `playwright install msedge`). This provides more accurate testing compared to emulation, as it uses the real browser engine and behavior that end-users experience.
- **Firefox**: Playwright uses its own patched version of Firefox for consistent automation. Real Firefox browser cannot be used due to Playwright limitations.
- **Safari/WebKit**: Uses emulation via `devices['Desktop Safari']`. Real Safari is not supported in CI environments.

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

1. **Identify the test ID** - Each test should have a unique ID (e.g., `XAT-4370`)

2. **Determine the scope**:
   - If the test fails on all browsers, add it to `"all"`
   - If it fails only on a specific browser, add it to that browser's section

3. **Add the exclusion**:
   - Open the `exclude.tests.json` file in the relevant test suite directory
   - Add the test ID as a key with a Jira ticket URL as the value

4. **Example**:
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
| `CI` | Indicates CI environment | `false` |

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

### Tests Timeout

- Increase timeout in test configuration
- Check network connectivity
- Verify application is responding

### Browser-Specific Issues

- Install browser-specific dependencies:
  ```bash
  npx playwright install-deps
  ```
- Check browser-specific exclusions in `exclude.tests.json`

### CI Failures

When tests fail in CI, you can view results in multiple ways:

#### Viewing Results in GitHub Actions

1. **Navigate to the failed job**:
   - Go to the "Actions" tab in the GitHub repository
   - Click on the failed workflow run
   - Find the specific failed job (e.g., `E2E | chromium | authentication | Playwright`)

2. **View test output**:
   - The GitHub Actions logs show detailed test execution output
   - Failed tests are highlighted with error messages
   - The `github` reporter provides inline test results in the workflow logs

3. **Download test artifacts**:
   - Playwright automatically saves artifacts on test failure:
     - **Screenshots**: Captured at the point of failure
     - **Videos**: Full test execution recordings
     - **Traces**: Interactive trace files for debugging
   - These artifacts are available in the job's "Artifacts" section
   - Download and use Playwright Trace Viewer to analyze failures:
     ```bash
     npx playwright show-trace <trace-file.zip>
     ```

4. **View logs**:
   - Application logs and Kubernetes logs are collected as artifacts
   - Look for artifacts named `logs-<browser>-<suite-name>`

#### Viewing Results in Report Portal

Test results are automatically sent to Report Portal when running in CI. Report Portal provides a comprehensive dashboard for analyzing test results.

1. **Finding the Report Portal URL**:
   - The Report Portal URL is stored as a GitHub secret: `REPORT_PORTAL_URL`
   - To find it:
     - Go to repository **Settings** → **Secrets and variables** → **Actions**
     - Look for the `REPORT_PORTAL_URL` secret (visible to repository administrators)
     - Alternatively, check the workflow file (`.github/workflows/pull-request.yml`) which references `${{ secrets.REPORT_PORTAL_URL }}`

2. **Accessing Report Portal**:
   - Navigate to the Report Portal URL
   - Log in with your credentials
   - Project name: `alfresco-content-app`

3. **Finding your test run**:
   - Launches are named: `GitHub Actions - ACA - <browser>`
   - Filter by attributes:
     - **Job**: GitHub job name
     - **Build_type**: `pull_request` or `schedule`
     - **Repository**: GitHub repository name
     - **Branch**: Branch name
     - **Browser**: `chromium`, `firefox`, `webkit`, or `msedge`
   - Each launch includes a link back to the GitHub Actions run

4. **Report Portal Features**:
   - **Test execution details**: View individual test results with steps
   - **Failure analysis**: See screenshots, logs, and error messages
   - **Historical trends**: Track test stability over time
   - **Filtering**: Filter by browser, suite, or date range
   - **Only failures shown**: The configuration skips passed tests (`skipPassed: true`) to focus on issues

5. **Report Portal Configuration**:
   - Tests are reported only in CI environments
   - Each browser has its own launch to avoid conflicts
   - Launch descriptions include links to the GitHub Actions run
   - Test steps are included for detailed analysis

#### Additional Debugging Steps

1. **Verify environment** - Ensure all required services (ACS) are deployed correctly
2. **Check environment variables** - Verify all required secrets and variables are set
3. **Review related logs** - Check ACS deployment logs and application logs

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

- [Playwright Documentation](https://playwright.dev/)
- [Nx Documentation](https://nx.dev/)
- Project-specific test utilities: `projects/aca-playwright-shared/`

