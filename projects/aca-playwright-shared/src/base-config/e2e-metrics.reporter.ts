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
import { ExclusionJson, getTestExclusions, TestExclusion } from '../utils/exclude-tests';

export const E2E_METRICS_FORMAT = 'aca-e2e-metrics';

const BEFORE_ALL = 'beforeAll';
const BEFORE_EACH = 'beforeEach';
const TRACKED_HOOK_TYPES = [BEFORE_ALL, BEFORE_EACH] as const;
const HOOK_STEP_TITLE_SUFFIX = ' hook';

type HookType = (typeof TRACKED_HOOK_TYPES)[number];

const isTrackedHookType = (type: string): type is HookType => (TRACKED_HOOK_TYPES as readonly string[]).includes(type);

interface HookLocation {
  file: string;
  line: number;
  column: number;
}

interface SuiteWithPrivateHooks extends Suite {
  _hooks?: { type: string; location?: HookLocation }[];
}

interface HookTimings {
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

interface E2eTestLocation {
  project: string;
  file: string;
  path: string | null;
  line: number;
  title: string;
}

interface E2eMetricsTest extends E2eTestLocation {
  outcome: ReturnType<TestCase['outcome']>;
  results: E2eMetricsResult[];
}

type E2eExcludedTest = E2eTestLocation & TestExclusion;

const hookId = (location?: HookLocation): string | undefined => (location ? `${location.file}:${location.line}:${location.column}` : undefined);

const average = (values: number[] = []): number => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);

const EXCLUDED_TESTS_FILE_NAME = 'exclude.tests.json';
const EXCLUDED_TESTS_REPORT_KIND = 'excluded';
const ERROR_MAX_LENGTH = 200;
const TITLE_PATH_ROOT_PROJECT_AND_FILE_SEGMENTS = 3;
const ANSI_COLOR_CODES_PATTERN = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');

const readExclusions = (configFile?: string): TestExclusion[] => {
  const exclusionsFile = configFile ? path.join(path.dirname(configFile), EXCLUDED_TESTS_FILE_NAME) : '';
  if (!exclusionsFile || !fs.existsSync(exclusionsFile)) {
    return [];
  }
  const exclusions: ExclusionJson = JSON.parse(fs.readFileSync(exclusionsFile, 'utf8'));
  return getTestExclusions(exclusions);
};

const firstErrorLineWithoutColors = (result: TestResult): string | undefined => {
  const message = result.error?.message ?? result.error?.value;
  const line = message
    ?.replace(ANSI_COLOR_CODES_PATTERN, '')
    .split('\n')
    .map((text) => text.trim())
    .find(Boolean);
  return line && line.length > ERROR_MAX_LENGTH ? `${line.slice(0, ERROR_MAX_LENGTH - 1)}…` : line;
};

export default class E2eMetricsReporter implements Reporter {
  private readonly outputFile: string;
  private readonly excludedOnly: boolean;
  private excludedTests: E2eExcludedTest[] = [];
  private excludedTestsSuite: string | null = null;
  private readonly hookTypes = new Map<string, HookType>();
  private readonly beforeAllHookIdsByTest = new Map<TestCase, string[]>();
  private readonly successfulHookDurations = new Map<string, number[]>();
  private readonly hookTimingsByResult = new Map<TestResult, HookTimings>();
  private rootSuite?: Suite;

  constructor(options: { outputFile?: string; excludedOnly?: boolean } = {}) {
    this.outputFile = options.outputFile ?? process.env.E2E_METRICS_FILE ?? 'e2e-metrics.json';
    this.excludedOnly = Boolean(options.excludedOnly);
  }

  printsToStdio(): boolean {
    return false;
  }

  onBegin(config: FullConfig, suite: Suite): void {
    if (this.excludedOnly) {
      this.excludedTests = this.findExcludedTests(config, suite);
      this.excludedTestsSuite = config.projects[0]?.name ?? null;
      return;
    }
    this.rootSuite = suite;
    for (const test of suite.allTests()) {
      this.beforeAllHookIdsByTest.set(test, this.registerHooksAbove(test));
    }
  }

  private registerHooksAbove(test: TestCase): string[] {
    const beforeAllHookIds: string[] = [];
    for (let parent: SuiteWithPrivateHooks | undefined = test.parent; parent; parent = parent.parent) {
      for (const hook of parent._hooks ?? []) {
        const id = hookId(hook.location);
        if (id && isTrackedHookType(hook.type)) {
          this.hookTypes.set(id, hook.type);
          if (hook.type === BEFORE_ALL) {
            beforeAllHookIds.push(id);
          }
        }
      }
    }
    return beforeAllHookIds;
  }

  onStepEnd(_test: TestCase, result: TestResult, step: TestStep): void {
    const id = hookId(step.location) ?? step.title;
    const type = step.category === 'hook' ? this.hookType(step, id) : undefined;
    if (!type) {
      return;
    }

    const hooks = this.hookTimingsByResult.get(result) ?? { beforeAll: new Map<string, number>(), beforeEach: 0 };
    this.hookTimingsByResult.set(result, hooks);
    if (type === BEFORE_EACH) {
      hooks.beforeEach += step.duration;
      return;
    }
    hooks.beforeAll.set(id, step.duration);
    if (!step.error) {
      this.successfulHookDurations.set(id, [...(this.successfulHookDurations.get(id) ?? []), step.duration]);
    }
  }

  onEnd(): void {
    const report = this.excludedOnly
      ? { kind: EXCLUDED_TESTS_REPORT_KIND, suite: this.excludedTestsSuite, tests: this.excludedTests }
      : { tests: (this.rootSuite?.allTests() ?? []).map((test) => this.testMetrics(test)) };
    fs.mkdirSync(path.dirname(path.resolve(this.outputFile)), { recursive: true });
    fs.writeFileSync(this.outputFile, JSON.stringify({ format: E2E_METRICS_FORMAT, version: 1, ...report }));
  }

  private findExcludedTests(config: FullConfig, suite: Suite): E2eExcludedTest[] {
    const exclusions = readExclusions(config.configFile);
    return suite.allTests().flatMap((test) => {
      const titleText = test.titlePath().join(' ');
      const exclusion = exclusions.find(({ id }) => new RegExp(id).test(titleText));
      return exclusion ? [{ ...this.testLocation(test), ...exclusion }] : [];
    });
  }

  private hookType(step: TestStep, id: string): HookType | undefined {
    if (this.hookTypes.has(id)) {
      return this.hookTypes.get(id);
    }
    return TRACKED_HOOK_TYPES.find((type) => step.title === `${type}${HOOK_STEP_TITLE_SUFFIX}`);
  }

  private testLocation(test: TestCase): E2eTestLocation {
    const testDir = test.parent.project()?.testDir ?? path.dirname(test.location.file);
    const repoPath = path.relative(process.cwd(), test.location.file);
    return {
      project: test.parent.project()?.name ?? '',
      file: path.relative(testDir, test.location.file).split(path.sep).join('/'),
      path: repoPath.startsWith('..') ? null : repoPath.split(path.sep).join('/'),
      line: test.location.line,
      title: test.titlePath().slice(TITLE_PATH_ROOT_PROJECT_AND_FILE_SEGMENTS).join(' › ')
    };
  }

  private testMetrics(test: TestCase): E2eMetricsTest {
    return {
      ...this.testLocation(test),
      outcome: test.outcome(),
      results: test.results.map((result) => this.resultMetrics(test, result))
    };
  }

  private resultMetrics(test: TestCase, result: TestResult): E2eMetricsResult {
    const hookTimings = this.hookTimingsByResult.get(result);
    const metrics: E2eMetricsResult = {
      retry: result.retry,
      status: result.status,
      duration: result.duration,
      beforeAll: Math.round(this.beforeAllDurationChargedToTest(test, hookTimings)),
      beforeEach: Math.round(hookTimings?.beforeEach ?? 0)
    };
    const error = result.status === 'passed' || result.status === 'skipped' ? undefined : firstErrorLineWithoutColors(result);
    return error ? { ...metrics, error } : metrics;
  }

  private beforeAllDurationChargedToTest(test: TestCase, hookTimings?: HookTimings): number {
    const beforeAllHookIds = new Set([...(this.beforeAllHookIdsByTest.get(test) ?? []), ...(hookTimings?.beforeAll.keys() ?? [])]);
    let total = 0;
    for (const id of beforeAllHookIds) {
      const measuredForThisTest = hookTimings?.beforeAll.get(id);
      total += measuredForThisTest ?? average(this.successfulHookDurations.get(id));
    }
    return total;
  }
}
