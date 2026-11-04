(function () {
  'use strict';

  const STORAGE_KEY = 'e2e-dashboard-theme';
  const THEMES = new Set(['light', 'dark']);
  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function savedTheme() {
    try {
      const theme = localStorage.getItem(STORAGE_KEY);
      return THEMES.has(theme) ? theme : null;
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.warn(`The ${theme} theme will not be remembered: ${error.message}`);
    }
  }

  const systemTheme = () => (systemPrefersDark.matches ? 'dark' : 'light');
  const otherTheme = (theme) => (theme === 'dark' ? 'light' : 'dark');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const themeToSwitchTo = otherTheme(theme);
    const switchesToDark = themeToSwitchTo === 'dark';
    button.innerHTML = `<span class="aca-icon" aria-hidden="true">${switchesToDark ? '☾' : '☀'}</span> ${switchesToDark ? 'Dark mode' : 'Light mode'}`;
    button.title = `Switch to ${themeToSwitchTo} mode`;
  }

  applyTheme(savedTheme() || systemTheme());

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(root.dataset.theme);
    document.getElementById('theme-toggle').addEventListener('click', () => {
      const theme = otherTheme(root.dataset.theme);
      saveTheme(theme);
      applyTheme(theme);
    });
    systemPrefersDark.addEventListener('change', () => {
      if (!savedTheme()) applyTheme(systemTheme());
    });
  });
})();
