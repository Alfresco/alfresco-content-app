'use strict';

function addMonths(month, count) {
  const [year, monthIndex] = month.split('-').map(Number);
  return new Date(Date.UTC(year, monthIndex - 1 + count, 1)).toISOString().slice(0, 7);
}

function clampToDataRange(date) {
  if (date > lastDate) return lastDate;
  if (date < firstDate) return firstDate;
  return date;
}

function renderCalendarDay(date, day, selected, tabStopDate) {
  const disabled = date > lastDate || date < firstDate;
  const hasData = datesWithData.has(date);
  const label = `${formatDate(date, { weekday: 'long', year: 'numeric' })}${hasData ? '' : ', no data'}`;
  return `
    <button
      type="button"
      class="aca-day${hasData ? ' aca-has-data' : ''}"
      data-date="${escapeHtml(date)}"
      aria-label="${escapeHtml(label)}"
      aria-pressed="${date === selected}"
      tabindex="${date === tabStopDate ? 0 : -1}"
      ${disabled ? 'disabled' : ''}
    >${day}</button>
  `;
}

function renderCalendar() {
  const selected = state.end || lastDate;
  const [year, monthIndex] = ui.calendarMonth.split('-').map(Number);
  const daysInMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
  const offset = (new Date(Date.UTC(year, monthIndex - 1, 1)).getUTCDay() + 6) % 7;
  const title = new Date(Date.UTC(year, monthIndex - 1, 1)).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const tabStopDate = selected.startsWith(ui.calendarMonth) ? selected : clampToDataRange(`${ui.calendarMonth}-01`);
  const weekdayCells = WEEKDAYS.map((day) => `<span class="aca-weekday" aria-hidden="true">${day}</span>`).join('');
  const dayCells = Array.from({ length: daysInMonth }, (_, offsetInMonth) => {
    const day = offsetInMonth + 1;
    return renderCalendarDay(`${ui.calendarMonth}-${String(day).padStart(2, '0')}`, day, selected, tabStopDate);
  }).join('');
  elements.calendar.innerHTML = `
    <div class="aca-calendar-head">
      <button
        type="button"
        data-month="-1"
        aria-label="Previous month"
        ${ui.calendarMonth <= firstDate.slice(0, 7) ? 'disabled' : ''}
      >‹</button>
      <strong>${escapeHtml(title)}</strong>
      <button
        type="button"
        data-month="1"
        aria-label="Next month"
        ${ui.calendarMonth >= lastDate.slice(0, 7) ? 'disabled' : ''}
      >›</button>
    </div>
    <div class="aca-calendar-grid" role="group" aria-label="${escapeHtml(title)}">
      ${weekdayCells}${'<span></span>'.repeat(offset)}${dayCells}
    </div>
    <div class="aca-calendar-foot">
      <span>Dot: day with data</span>
      <button type="button" class="aca-link-button" data-date="${escapeHtml(lastDate)}">Latest day</button>
    </div>
  `;
}

function focusDay(date) {
  const button = elements.calendar.querySelector(`.aca-day[data-date="${date}"]`);
  if (button) {
    elements.calendar.querySelectorAll('.aca-day').forEach((day) => (day.tabIndex = -1));
    button.tabIndex = 0;
    button.focus();
  }
}

function openCalendar() {
  ui.calendarMonth = (state.end || lastDate).slice(0, 7);
  renderCalendar();
  elements.calendar.show();
  elements.end.setAttribute('aria-expanded', 'true');
  focusDay(state.end || lastDate);
}

function closeCalendar(returnFocus) {
  if (!elements.calendar.open) return;
  elements.calendar.close();
  elements.end.setAttribute('aria-expanded', 'false');
  if (returnFocus) elements.end.focus();
}

function handleCalendarClick(event) {
  const monthButton = event.target.closest('[data-month]');
  if (monthButton) {
    ui.calendarMonth = addMonths(ui.calendarMonth, Number(monthButton.dataset.month));
    renderCalendar();
    elements.calendar.querySelector(`[data-month="${monthButton.dataset.month}"]`)?.focus();
    return;
  }
  const dayButton = event.target.closest('[data-date]');
  if (dayButton && !dayButton.disabled) {
    closeCalendar(true);
    setState({ end: dayButton.dataset.date === lastDate ? '' : dayButton.dataset.date });
  }
}

function handleCalendarKeydown(event) {
  if (event.key === 'Escape') {
    closeCalendar(true);
    return;
  }
  const day = event.target.closest('.aca-day');
  const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
  if (!day || !step) return;
  event.preventDefault();
  const next = clampToDataRange(shiftDate(day.dataset.date, step));
  if (next.slice(0, 7) !== ui.calendarMonth) {
    ui.calendarMonth = next.slice(0, 7);
    renderCalendar();
  }
  focusDay(next);
}

function bindCalendarEvents() {
  elements.end.addEventListener('click', () => (elements.calendar.open ? closeCalendar(false) : openCalendar()));
  elements.calendar.addEventListener('click', handleCalendarClick);
  elements.calendar.addEventListener('keydown', handleCalendarKeydown);
  document.addEventListener('mousedown', (event) => {
    if (!elements.dateField.contains(event.target)) closeCalendar(false);
  });
}
