/* Shared controls for root, localized homepages and changelogs. */
(() => {
  const root = document.documentElement;
  const zh = root.lang.startsWith('zh');
  const system = matchMedia('(prefers-color-scheme: dark)');
  const lang = document.querySelector('#language-control');
  const theme = document.querySelector('#appearance-control');
  if (!lang || !theme) return;
  const trigger = theme.querySelector('summary');
  const options = [...theme.querySelectorAll('button[data-mode]')];
  if (!trigger || options.length !== 3) return;
  const details = [...document.querySelectorAll('.nav-control')];
  const labels = zh
    ? { system: '跟随系统', light: '浅色', dark: '深色' }
    : { system: 'System', light: 'Light', dark: 'Dark' };
  let mode = 'system';
  try {
    const saved = localStorage.getItem('lgt-appearance');
    if (['system', 'light', 'dark'].includes(saved)) mode = saved;
  } catch {}

  function render() {
    const effective = mode === 'system' ? (system.matches ? 'dark' : 'light') : mode;
    root.dataset.theme = effective;
    root.dataset.appearanceMode = mode;
    root.style.colorScheme = effective;
    document.querySelectorAll('.hero-icon,.brand-icon').forEach(icon => {
      const current = icon.getAttribute('src') || '';
      const next = current.replace(/app-icon-(?:light|dark)\.png$/, `app-icon-${effective}.png`);
      if (next !== current) icon.setAttribute('src', next);
    });
    trigger.setAttribute('aria-label', (zh ? '外观：' : 'Appearance: ') + labels[mode]);
    trigger.title = trigger.getAttribute('aria-label');
    for (const button of options) {
      const selected = button.dataset.mode === mode;
      button.setAttribute('aria-pressed', String(selected));
      const check = button.querySelector('.check');
      if (check) check.textContent = selected ? '✓' : '';
    }
  }

  for (const button of options) {
    button.addEventListener('click', () => {
      mode = button.dataset.mode;
      try { localStorage.setItem('lgt-appearance', mode); } catch {}
      render();
      theme.open = false;
      trigger.focus();
    });
  }
  system.addEventListener?.('change', () => { if (mode === 'system') render(); });
  for (const menu of details) {
    menu.addEventListener('toggle', () => {
      if (menu.open) for (const other of details) if (other !== menu) other.open = false;
    });
  }
  document.addEventListener('click', event => {
    for (const menu of details) if (!menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    for (const menu of details) {
      if (menu.open) {
        menu.open = false;
        menu.querySelector('summary')?.focus();
      }
    }
  });
  for (const link of lang.querySelectorAll('a[hreflang]')) {
    link.addEventListener('click', () => {
      const chosen = link.hreflang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
      try { localStorage.setItem('lgt-language', chosen); } catch {}
      if (['#downloads', '#history'].includes(location.hash) && !location.pathname.includes('/changelog/')) {
        link.hash = location.hash;
      }
    });
  }
  render();
})();
