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

**Sample URL format**: `https://reportportal.envalfresco.com/ui/#alfresco-content-app/launches/all/<launch-id>`

- Project name: `alfresco-content-app`
- Tests are reported only in CI environments (not locally)


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

