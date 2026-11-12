'use strict';

const compareByMostFailuresThenTitle = (first, second) => second.failures - first.failures || String(first.title).localeCompare(String(second.title));

function sortRows(rows, columns, tieBreak = compareByMostFailuresThenTitle) {
  const [defaultKey, defaultDir] = TAB_SORT[state.tab];
  const key = columns.some((candidate) => candidate.key === state.sort) ? state.sort : defaultKey;
  const dir = state.sort === key && state.dir ? state.dir : defaultDir;
  const column = columns.find((candidate) => candidate.key === key);
  const getValue = column.sortValue || ((row) => row[key]);
  const sign = dir === 'asc' ? 1 : -1;
  rows.sort((first, second) => {
    const firstValue = getValue(first);
    const secondValue = getValue(second);
    const comparison = typeof firstValue === 'string' ? firstValue.localeCompare(secondValue) : firstValue - secondValue;
    return comparison * sign || tieBreak(first, second);
  });
  return { key, dir };
}

function getCellClass(column) {
  return [column.num ? 'aca-num' : '', column.cls || '', column.primary ? 'aca-primary' : ''].join(' ').trim();
}

function renderHeaderCell(column, sort) {
  const sortDirection = sort.dir === 'asc' ? 'ascending' : 'descending';
  const ariaSort = sort.key === column.key ? ` aria-sort="${sortDirection}"` : '';
  const numClass = column.num ? ' class="aca-num"' : '';
  return `
    <th
      scope="col"
      data-sort="${column.key}"
      ${ariaSort}
      ${numClass}
      title="${escapeHtml([column.help || COLUMN_HELP[column.key], COLUMN_NOTES[column.key] && `Important: ${COLUMN_NOTES[column.key]}`].filter(Boolean).join(' '))}"
    >
      <button type="button" class="aca-sort-button">${escapeHtml(column.label)}</button>
    </th>
  `;
}

function renderHeaderRow(columns, sort, lead = '#') {
  const leadCell =
    lead === null
      ? ''
      : `
        <th class="aca-num" scope="col">
          <span class="aca-secondary">${escapeHtml(lead)}</span>
        </th>
      `;
  return `
    <tr>
      ${leadCell}
      ${columns.map((column) => renderHeaderCell(column, sort)).join('')}
    </tr>
  `;
}

function renderDefinitionNote(note) {
  if (!note) return '';
  return `
    <p class="aca-legend-note">
      <span class="aca-info-icon" aria-hidden="true">i</span>
      <span>
        <strong>Important:</strong>
        ${escapeHtml(note)}
      </span>
    </p>
  `;
}

function renderDefinition([term, text, note]) {
  return `
    <dt>${escapeHtml(term)}</dt>
    <dd>
      ${escapeHtml(text)}
      ${renderDefinitionNote(note)}
    </dd>
  `;
}

function renderLegend(entries) {
  return `
    <details class="aca-legend" id="legend"${ui.legendOpen ? ' open' : ''}>
      <summary>What the columns mean</summary>
      <p>${escapeHtml(TAB_INTRO[state.tab])}</p>
      <dl>${entries.map(renderDefinition).join('')}</dl>
    </details>
  `;
}

function renderRowToggle(total, limit, noun) {
  if (total <= limit) return '';
  const label = ui.showAll ? `Show the top ${limit} only` : `Show all ${numberFormat.format(total)} ${noun}`;
  return `
    <div class="aca-more">
      <button type="button" id="toggle-rows" aria-expanded="${ui.showAll}">${label}</button>
    </div>
  `;
}
