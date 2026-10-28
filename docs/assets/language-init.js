/* Root serves the full English homepage without JavaScript; redirect Chinese browsers before page paint. */
(() => {
  let preferred;
  try {
    const stored = localStorage.getItem('lgt-language');
    if (stored === 'zh' || stored === 'en') preferred = stored;
  } catch {}
  if (!preferred) {
    const first = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    preferred = /^zh(?:-|$)/i.test(first) ? 'zh' : 'en';
  }
  if (preferred === 'zh') {
    location.replace(new URL('zh/' + location.search + location.hash, location.href).href);
  }
})();
