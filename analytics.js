(() => {
  'use strict';
  const id = window.LEAH_ANALYTICS?.measurementId;
  if (!/^G-[A-Z0-9]+$/.test(id || '')) return;
  const preferenceKey = 'leah-analytics-consent-v1';
  let accepted = false;
  let loaded = false;
  let banner;
  function readPreference() {
    try { return localStorage.getItem(preferenceKey); } catch { return null; }
  }
  function remember(value) {
    try { localStorage.setItem(preferenceKey, value); } catch { /* session only */ }
  }
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  // Intentionally exclude query strings, fragments, form values and user IDs.
  function safeLocation() { return location.origin + location.pathname; }
  function sourceHost() {
    try { return new URL(document.referrer).origin; } catch { return ''; }
  }
  function campaign() {
    const query = new URLSearchParams(location.search);
    const allowed = {
      utm_source: ['instagram', 'facebook', 'whatsapp', 'email'],
      utm_medium: ['social', 'email', 'message', 'referral'],
      utm_campaign: ['lanzamiento', 'primeras-3-empresas', 'prospectos']
    };
    const fields = { utm_source: 'campaign_source', utm_medium: 'campaign_medium', utm_campaign: 'campaign_name' };
    const result = {};
    Object.keys(allowed).forEach(key => {
      const value = query.get(key);
      if (allowed[key].includes(value)) result[fields[key]] = value;
    });
    return result;
  }
  function start() {
    accepted = true;
    if (loaded) return;
    loaded = true;
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    gtag('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: safeLocation(), page_referrer: sourceHost(), ...campaign() });
    gtag('event', 'page_view', { page_location: safeLocation(), page_referrer: sourceHost() });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }
  function track(name) {
    if (accepted) gtag('event', name, { page_location: safeLocation(), page_referrer: sourceHost() });
  }
  function choose(value) {
    remember(value);
    banner.hidden = true;
    if (value === 'accepted') start();
    else {
      accepted = false;
      if (loaded) {
        window['ga-disable-' + id] = true;
        gtag('consent', 'update', { analytics_storage: 'denied' });
        // Stop queued interactions and reload under the declined preference.
        location.reload();
      }
    }
  }
  function mount() {
    banner = document.createElement('section');
    banner.className = 'analytics-consent';
    banner.setAttribute('aria-label', 'Preferencias de analítica');
    banner.innerHTML = '<p>¿Nos ayudas a mejorar LEAH? Si aceptas, Google Analytics medirá visitas y clics. No enviamos los datos de tu formulario. <a href="/privacidad.html#analitica">Más información</a></p><div><button type="button" data-choice="declined">Rechazar analítica</button><button type="button" data-choice="accepted">Aceptar analítica</button></div>';
    banner.querySelectorAll('button').forEach(button => button.addEventListener('click', () => choose(button.dataset.choice)));
    document.body.append(banner);
    const settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'analytics-preferences';
    settings.textContent = 'Preferencias de analítica';
    settings.addEventListener('click', () => { banner.hidden = false; banner.querySelector('button').focus(); });
    (document.querySelector('footer') || document.body).append(settings);
    const preference = readPreference();
    banner.hidden = preference === 'accepted' || preference === 'declined';
    if (preference === 'accepted') start();
    document.addEventListener('click', event => {
      const link = event.target.closest?.('a[href]');
      if (!link) return;
      let url;
      try { url = new URL(link.href, location.href); } catch { return; }
      if (url.hostname === 'ileonardo88.github.io' && url.pathname === '/demo') track('trial_click');
      else if (url.origin === location.origin && url.pathname === '/demo.html') track('demo_guide_click');
      else if (url.protocol === 'mailto:') track('email_click');
      else if (['wa.me', 'api.whatsapp.com'].includes(url.hostname)) track('whatsapp_click');
    });
    document.addEventListener('leah:commercial-success', () => track('generate_lead'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();


