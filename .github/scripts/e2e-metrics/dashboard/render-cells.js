'use strict';

function escapeAndLinkTestCaseIds(text) {
  const html = escapeHtml(text);
  if (!metrics.testCaseUrl) return html;
  return html.replace(TEST_ID_PATTERN, (id) => {
    const url = escapeHtml(metrics.testCaseUrl.replace('{id}', id));
    return `<a class="aca-test-id" href="${url}" target="_blank" rel="noopener">${id}</a>`;
  });
}

function splitTitle(test) {
  const parts = test.title.split(TITLE_SEPARATOR);
  return { describes: parts.slice(0, -1), name: parts.at(-1) };
}

function buildJobUrl(run, job, step) {
  const stepAnchor = step ? `#step:${step}:1` : '';
  return `${run.url}/job/${job}${stepAnchor}`;
}

function renderSourceLink(test) {
  const lineSuffix = test.line ? `:${test.line}` : '';
  const label = `${escapeHtml(test.file)}${lineSuffix}`;
  if (!test.path || !metrics.repository) return label;
  const lineAnchor = test.line ? `#L${test.line}` : '';
  const url = `${metrics.serverUrl}/${metrics.repository}/blob/${BRANCH}/${test.path}${lineAnchor}`;
  return renderExternalLink(url, label);
}

function renderKindBadge(kind) {
  return `<span class="aca-group-kind ${GROUP_KINDS[kind].badgeClass}">${GROUP_KINDS[kind].label}</span>`;
}

function renderTestLocation(test, describes, name) {
  const levels = [
    `${renderKindBadge('suite')} ${escapeHtml(test.suite)}`,
    `${renderKindBadge('file')} ${renderSourceLink(test)}`,
    ...describes.map((describe) => `${renderKindBadge('describe')} ${escapeHtml(describe)}`)
  ];
  const levelItems = levels.map((item, level) => `<li style="--level:${level}">${item}</li>`).join('');
  return `
    <ul class="aca-test-path">
      ${levelItems}
      <li class="aca-test-path-name" style="--level:${levels.length}">${escapeAndLinkTestCaseIds(name)}</li>
    </ul>
  `;
}

function renderTestNameWithPath(test) {
  const { describes, name } = splitTitle(test);
  const open = testsShowingLocation.has(test.index);
  const html = `
    <div class="aca-test-title">${escapeAndLinkTestCaseIds(name)}</div>
    <div class="aca-test-meta">
      <button
        type="button"
        class="aca-path-toggle"
        data-path-toggle="${test.index}"
        aria-expanded="${open}"
        title="Show the suite, file and describe blocks of this test"
      >${open ? '▾' : '▸'} Location</button>
    </div>
  `;
  return open ? `${html}${renderTestLocation(test, describes, name)}` : html;
}

function describeTrend(test) {
  const counts = { passed: 0, retried: 0, failed: 0 };
  test.daily.forEach((status, date) => view.dates.includes(date) && counts[status]++);
  return `Days passed ${counts.passed}, needed a retry ${counts.retried}, failed ${counts.failed}`;
}

function renderTrendDot(test, date) {
  const status = test.daily.get(date);
  const dotClass = status ? TREND_DOT_CLASSES[status] : NO_RUN_DOT_CLASS;
  const title = `${formatDate(date)}: ${status ? TREND_LABELS[status] : 'did not run'}`;
  return `<span class="aca-dot ${dotClass}" title="${escapeHtml(title)}"></span>`;
}

function renderTrendDots(test) {
  const dots = `
    <span class="aca-trend" aria-label="${escapeHtml(describeTrend(test))}">
      ${view.dates.map((date) => renderTrendDot(test, date)).join('')}
    </span>
  `;
  if (!view.comparison?.recentlyFlakyIndexes.has(test.index)) return dots;
  return `
    ${dots}
    <span
      class="aca-trend-note"
      title="Flaky in this period, but not in the previous ${pluralize(view.comparison.days, 'day')}"
    >Recently flaky</span>
  `;
}

function renderMeasure(value, max, text) {
  const minimumVisibleWidth = value > 0 ? 2 : 0;
  const width = max > 0 ? Math.max((value / max) * 100, minimumVisibleWidth) : 0;
  return `
    <div class="aca-measure">
      <span>${text}</span>
      <div class="aca-track"><div class="aca-fill" style="width:${width.toFixed(1)}%"></div></div>
    </div>
  `;
}
