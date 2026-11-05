'use strict';

const historyLoaded = Boolean(window.E2E_HISTORY?.days);
const metrics = historyLoaded ? window.E2E_HISTORY : { days: [], tests: [] };
const lastDate = metrics.days.at(-1)?.date ?? new Date().toISOString().slice(0, 10);
const firstDate = metrics.days.length ? metrics.days[0].date : lastDate;
const keptHistoryDays = metrics.historyDays || 14;
const PERIODS = [7, 14, 30, 90].filter((days) => days <= keptHistoryDays);
const LONGEST_PERIOD = PERIODS.at(-1);
const datesWithData = new Set(metrics.days.map((day) => day.date));
const testIds = metrics.tests.map(([suite, file, title]) => computeFnv1aHash(`${suite}${TITLE_SEPARATOR}${file}${TITLE_SEPARATOR}${title}`));
const indexById = new Map(testIds.map((id, index) => [id, index]));

const isPeriod = (days) => Number.isInteger(days) && days >= 1 && days <= LONGEST_PERIOD;
const STATE_VALIDATORS = {
  tab: (value) => Object.hasOwn(TAB_SORT, value),
  days: (value) => /^\d+$/.test(value) && isPeriod(Number(value)),
  end: (value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
  sort: (value) => /^[a-z]*$/.test(value),
  dir: (value) => value === '' || value === 'asc' || value === 'desc',
  test: (value) => /^[0-9a-z]*$/.test(value)
};

const findById = (id) => document.getElementById(id);
const elements = {
  intro: findById('intro'),
  updated: findById('updated'),
  days: findById('days'),
  end: findById('end'),
  dateField: findById('date-field'),
  calendar: findById('calendar'),
  search: findById('q'),
  suite: findById('suite'),
  reset: findById('reset'),
  summary: findById('summary'),
  daysNote: findById('days-note'),
  dataIssues: findById('data-issues'),
  tabs: findById('tabs'),
  panel: findById('panel')
};

let state = readState();
let showAll = false;
let legendOpen = false;
let dataIssuesOpen = false;
let calendarMonth = lastDate.slice(0, 7);
let scrollToOpenTest = Boolean(state.test);
let visibleGroupKeys = [];
let view = { dates: [], comparison: null, suiteTimes: new Map() };
const userToggledGroups = new Map();
const testsShowingAllRuns = new Set();
const testsShowingLocation = new Set();

function readState() {
  const params = new URLSearchParams(location.hash.slice(1));
  const result = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    const value = params.get(key);
    const isAllowed = STATE_VALIDATORS[key] || (() => true);
    if (value !== null && isAllowed(value)) result[key] = value;
  }
  return result;
}

function writeState() {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) {
    if (value && value !== DEFAULTS[key]) params.set(key, value);
  }
  window.history.replaceState(null, '', `#${params.toString()}`);
}

function setState(patch) {
  state = { ...state, ...patch };
  showAll = false;
  writeState();
  render();
}

function getOpenTestIndex() {
  return state.test ? indexById.get(state.test) : undefined;
}

function getPeriodDays() {
  const days = Number(state.days);
  return isPeriod(days) ? days : LONGEST_PERIOD;
}

function getRangeDates() {
  const end = state.end || lastDate;
  const days = getPeriodDays();
  return Array.from({ length: days }, (_, offset) => shiftDate(end, offset - days + 1));
}
