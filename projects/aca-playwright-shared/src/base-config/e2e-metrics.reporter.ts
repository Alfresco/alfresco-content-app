/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import type { FullConfig, Reporter, Suite, TestCase, TestResult, TestStep } from '@playwright/test/reporter';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Writes per-test retry and duration metrics for the E2E metrics report (.github/scripts/e2e-metrics).
 *
 * Playwright's `result.duration` covers beforeEach/afterEach hooks and the test body, but not beforeAll hooks,
 * which run once per worker and are only reported as steps of the first test that needed them. To show the full
 * cost of every test, each test is charged all beforeAll hooks of its describe blocks: the measured duration when
 * the hook ran for that test, otherwise the average duration of that hook in this run. afterAll hooks are ignored.
 */

export const E2E_METRICS_FORMAT = 'aca-e2e-metrics';

type HookType = 'beforeAll' | 'beforeEach';

interface HookLocation {
  file: string;
  line: number;
  column: number;
}

// Suite hooks are not part of the public reporter API; without them only the hooks that ran for a test are counted.
interface SuiteWithHooks extends Suite {
  _hooks?: { type: string; location?: HookLocation }[];
}

interface ResultHooks {
  beforeAll: Map<string, number>;
  beforeEach: number;
}

interface E2eMetricsResult {
  retry: number;
  status: TestResult['status'];
  duration: number;
  beforeAll: number;
  beforeEach: number;
  error?: string;
}

interface E2eMetricsTest {
  project: string;
  file: string;
  path: string | null;
  line: number;
  title: string;
  outcome: ReturnType<TestCase['outcome']>;
  results: E2eMetricsResult[];
}

const hookId = (location?: HookLocation): string | undefined => (location ? `${location.file}:${location.line}:${location.column}` : undefined);

const average = (values: number[] = []): number => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);

// Long enough to tell errors apart (e.g. which locator timed out), short enough to keep the metrics files small.
const ERROR_MAX_LENGTH = 200;
// Terminal colour codes (ESC [ ... m) that Playwright adds to error messages.
const ANSI_PATTERN = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');

/** First non-empty line of the error, without terminal colours, e.g. "TimeoutError: locator.click: Timeout 30000ms exceeded." */
const errorSummary = (result: TestResult): string | undefined => {
  const message = result.error?.message ?? result.error?.value;
  const line = message
    ?.replace(ANSI_PATTERN, '')
    .split('\n')
    .map((text) => text.trim())
    .find(Boolean);
  return line && line.length > ERROR_MAX_LENGTH ? `${line.slice(0, ERROR_MAX_LENGTH - 1)}…` : line;
};

export default class E2eMetricsReporter implements Reporter {
  private readonly outputFile: string;
  private readonly hookTypes = new Map<string, HookType>();
  private readonly beforeAllByTest = new Map<TestCase, string[]>();
  private readonly hookDurations = new Map<string, number[]>();
  private readonly resultHooks = new Map<TestResult, ResultHooks>();
  private rootSuite?: Suite;

  constructor(options: { outputFile?: string } = {}) {
    this.outputFile = options.outputFile ?? process.env.E2E_METRICS_FILE ?? 'e2e-metrics.json';
  }

  printsToStdio(): boolean {
    return false;
  }

  onBegin(_config: FullConfig, suite: Suite): void {
    this.rootSuite = suite;
    for (const test of suite.allTests()) {
      const beforeAll: string[] = [];
      for (let parent: SuiteWithHooks | undefined = test.parent; parent; parent = parent.parent) {
        for (const hook of parent._hooks ?? []) {
          const id = hookId(hook.location);
          if (id && (hook.type === 'beforeAll' || hook.type === 'beforeEach')) {
            this.hookTypes.set(id, hook.type);
            if (hook.type === 'beforeAll') {
              beforeAll.push(id);
            }
          }
        }
      }
      this.beforeAllByTest.set(test, beforeAll);
    }
  }

  onStepEnd(_test: TestCase, result: TestResult, step: TestStep): void {
    const id = hookId(step.location) ?? step.title;
    const type = step.category === 'hook' ? this.hookType(step, id) : undefined;
    if (!type) {
      return;
    }

    const hooks = this.resultHooks.get(result) ?? { beforeAll: new Map<string, number>(), beforeEach: 0 };
    this.resultHooks.set(result, hooks);
    if (type === 'beforeEach') {
      hooks.beforeEach += step.duration;
      return;
    }
    hooks.beforeAll.set(id, step.duration);
    if (!step.error) {
      this.hookDurations.set(id, [...(this.hookDurations.get(id) ?? []), step.duration]);
    }
  }

  onEnd(): void {
    const tests = (this.rootSuite?.allTests() ?? []).map((test) => this.testMetrics(test));
    fs.mkdirSync(path.dirname(path.resolve(this.outputFile)), { recursive: true });
    fs.writeFileSync(this.outputFile, JSON.stringify({ format: E2E_METRICS_FORMAT, version: 1, tests }));
  }

  private hookType(step: TestStep, id: string): HookType | undefined {
    if (this.hookTypes.has(id)) {
      return this.hookTypes.get(id);
    }
    if (step.title === 'beforeAll hook') {
      return 'beforeAll';
    }
    return step.title === 'beforeEach hook' ? 'beforeEach' : undefined;
  }

  private testMetrics(test: TestCase): E2eMetricsTest {
    const testDir = test.parent.project()?.testDir ?? path.dirname(test.location.file);
    const repoPath = path.relative(process.cwd(), test.location.file);
    return {
      project: test.parent.project()?.name ?? '',
      file: path.relative(testDir, test.location.file).split(path.sep).join('/'),
      path: repoPath.startsWith('..') ? null : repoPath.split(path.sep).join('/'),
      line: test.location.line,
      title: test.titlePath().slice(3).join(' › '),
      outcome: test.outcome(),
      results: test.results.map((result) => this.resultMetrics(test, result))
    };
  }

  private resultMetrics(test: TestCase, result: TestResult): E2eMetricsResult {
    const hooks = this.resultHooks.get(result);
    const beforeAllIds = new Set([...(this.beforeAllByTest.get(test) ?? []), ...(hooks?.beforeAll.keys() ?? [])]);
    let beforeAll = 0;
    for (const id of beforeAllIds) {
      beforeAll += hooks?.beforeAll.get(id) ?? average(this.hookDurations.get(id));
    }
    const metrics: E2eMetricsResult = {
      retry: result.retry,
      status: result.status,
      duration: result.duration,
      beforeAll: Math.round(beforeAll),
      beforeEach: Math.round(hooks?.beforeEach ?? 0)
    };
    const error = result.status === 'passed' || result.status === 'skipped' ? undefined : errorSummary(result);
    return error ? { ...metrics, error } : metrics;
  }
}
