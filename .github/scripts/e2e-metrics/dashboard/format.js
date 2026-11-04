'use strict';

const DAY_MS = 24 * 60 * 60 * 1000;
const numberFormat = new Intl.NumberFormat('en-GB');

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function fnv1aHash(text) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.codePointAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function shiftDate(date, days) {
  return new Date(Date.parse(date + 'T00:00:00Z') + days * DAY_MS).toISOString().slice(0, 10);
}

function formatDate(date, options = {}) {
  return new Date(date + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC', ...options });
}

function formatDuration(ms) {
  const totalSeconds = Math.round(ms / 100) / 10;
  if (totalSeconds < 60) return totalSeconds.toFixed(1) + 's';
  const wholeSeconds = Math.round(ms / 1000);
  return Math.floor(wholeSeconds / 60) + 'm ' + String(wholeSeconds % 60).padStart(2, '0') + 's';
}

function percent(value) {
  return (value * 100).toFixed(value > 0 && value < 0.1 ? 1 : 0) + '%';
}

function plural(count, word) {
  return numberFormat.format(count) + ' ' + word + (count === 1 ? '' : 's');
}

function emoji(icon) {
  return icon ? '<span class="aca-emoji" aria-hidden="true">' + icon + '</span>' : '';
}
