// Admin dashboard logic — login, edit event config, publish to GitHub via functions.
(function () {
  'use strict';

  const API = '/.netlify/functions';
  const TOKEN_KEY = 'guapulo_admin_token';
  const INLINE_LIMIT = 3.5 * 1024 * 1024; // files bigger than this are uploaded in chunks
  const CHUNK_SIZE = 3 * 1024 * 1024;
  const DEPLOY_POLL_MS = 8000;
  const DEPLOY_TIMEOUT_MS = 10 * 60 * 1000;

  const state = {
    config: null,
    assets: { videos: [], images: [] },
    pendingVideo: null, // File
    pendingImage: null, // File
    guests: [],
    unchecked: new Set(), // guest emails excluded from sending (checked by default)
    guestPage: 0
  };
  const GUESTS_PER_PAGE = 10;

  const $ = (id) => document.getElementById(id);

  // ---------------------------------------------------------------------
  // Theme (light/dark switcher — actual attribute is set ASAP in index.html
  // to avoid a flash; this just wires up the toggle button)
  // ---------------------------------------------------------------------
  const THEME_KEY = 'admin_theme';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    const btn = $('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
    applyTheme(next);
  }

  // ---------------------------------------------------------------------
  // Auth helpers
  // ---------------------------------------------------------------------
  const getToken = () => sessionStorage.getItem(TOKEN_KEY);

  async function api(path, options = {}) {
    const res = await fetch(`${API}/${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${getToken()}`,
        ...options.headers
      }
    });
    if (res.status === 401) {
      sessionStorage.removeItem(TOKEN_KEY);
      showLogin();
      throw new Error('Sesión expirada, vuelve a entrar.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
    return data;
  }

  function showLogin() {
    $('login-view').hidden = false;
    $('dashboard-view').hidden = true;
  }

  function showDashboard() {
    $('login-view').hidden = true;
    $('dashboard-view').hidden = false;
  }

  // ---------------------------------------------------------------------
  // Derived-date preview (mirrors lib/event-derive.js)
  // ---------------------------------------------------------------------
  function derivePreview(dateStr, timeStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || !/^\d{2}:\d{2}$/.test(timeStr)) return null;
    const date = new Date(`${dateStr}T${timeStr}:00-05:00`);
    if (isNaN(date.getTime())) return null;
    const fmt = (opts) =>
      new Intl.DateTimeFormat('es-EC', { timeZone: 'America/Guayaquil', ...opts }).format(date);
    const weekday = fmt({ weekday: 'long' });
    const noAccents = weekday.normalize('NFD').replace(/[̀-ͯ]/g, '');
    const [h24, min] = timeStr.split(':').map(Number);
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const ampm = h24 >= 12 ? 'pm' : 'am';
    return {
      short: `${noAccents.toUpperCase()} ${fmt({ day: '2-digit' })}/${fmt({ month: '2-digit' })}`,
      time: `${h12}:${String(min).padStart(2, '0')} ${ampm}`,
      long: `${weekday} ${fmt({ day: 'numeric' })} de ${fmt({ month: 'long' })}`
    };
  }

  function updateDerivedPreview() {
    const d = derivePreview($('f-date').value, $('f-time').value);
    $('d-short').textContent = d ? d.short : '—';
    $('d-time').textContent = d ? d.time : '—';
    $('d-long').textContent = d ? d.long : '—';
  }

  // ---------------------------------------------------------------------
  // Field validation
  // ---------------------------------------------------------------------
  function setFieldError(input, message) {
    const errorEl = input.closest('.field').querySelector('.field-error');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) {
      errorEl.textContent = message || '';
      errorEl.hidden = !message;
    }
  }

  function validateForm() {
    let firstInvalid = null;
    const require = (input, message) => {
      const bad = !input.value.trim();
      setFieldError(input, bad ? message : '');
      if (bad && !firstInvalid) firstInvalid = input;
    };
    require($('f-name'), 'El nombre del evento es obligatorio.');
    require($('f-date'), 'Elige la fecha del evento.');
    require($('f-time'), 'Elige la hora del evento.');
    require($('f-email-subject'), 'El asunto del correo es obligatorio.');

    const hex = $('f-color-hex');
    const hexOk = /^#[0-9a-fA-F]{6}$/.test(hex.value);
    setFieldError(hex, hexOk ? '' : 'Usa formato #RRGGBB, ej. #D0FF00.');
    if (!hexOk && !firstInvalid) firstInvalid = hex;

    const notionDb = $('f-notion-db');
    const notionVal = notionDb.value.trim().replace(/-/g, '');
    const notionOk = notionVal === '' || /^[0-9a-fA-F]{32}$/.test(notionVal);
    setFieldError(notionDb, notionOk ? '' : 'El ID debe tener 32 caracteres (con o sin guiones).');
    if (!notionOk && !firstInvalid) firstInvalid = notionDb;

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  // ---------------------------------------------------------------------
  // Populate form from config
  // ---------------------------------------------------------------------
  function fillSelect(select, items, selectedPath, pendingLabel) {
    select.innerHTML = '';
    for (const item of items) {
      const opt = document.createElement('option');
      opt.value = item.path;
      const mb = (item.size / 1048576).toFixed(1);
      opt.textContent = `${item.path.split('/').pop()} (${mb} MB)`;
      select.appendChild(opt);
    }
    if (pendingLabel) {
      const opt = document.createElement('option');
      opt.value = '__pending__';
      opt.textContent = `⬆ ${pendingLabel} (nuevo)`;
      select.appendChild(opt);
      select.value = '__pending__';
    } else if (selectedPath) {
      select.value = selectedPath;
    }
  }

  function populateForm() {
    const c = state.config;
    $('f-name').value = c.event.name || '';
    $('f-subtitle').value = c.event.subtitle || '';
    $('f-date').value = c.event.date || '';
    $('f-time').value = c.event.time || '';
    $('f-location').value = c.event.location || '';
    $('f-color').value = c.appearance.accent_color || '#D0FF00';
    $('f-color-hex').value = c.appearance.accent_color || '#D0FF00';
    $('f-hero-type').value = c.hero.type || 'video';
    $('f-notion-db').value = (c.notion && c.notion.database_id) || '';
    $('f-email-subject').value = c.email.subject || '';
    $('f-email-location').value = c.email.location || '';
    $('f-email-title').value = c.email.title_line || '';
    $('f-email-intro').value = c.email.intro || '';
    $('f-email-note').value = c.email.note_box || '';
    $('f-email-car').value = c.email.car_directions || '';
    $('f-email-car-url').value = c.email.car_maps_url || '';
    $('f-email-walk').value = c.email.walk_directions || '';
    $('f-email-walk-url').value = c.email.walk_maps_url || '';
    $('f-email-contact-text').value = c.email.contact_text || '';
    $('f-email-contact-email').value = c.email.contact_email || '';
    $('f-email-contact-phone').value = c.email.contact_phone || '';
    const inv = c.invite || {};
    $('f-inv-subject').value = inv.subject || '';
    $('f-inv-message').value = inv.message || '';
    $('f-inv-cta').value = inv.cta_label || '';
    fillSelect($('f-video'), state.assets.videos, c.hero.video);
    fillSelect($('f-image'), state.assets.images, c.hero.image);
    toggleHeroType();
    updateImagePreview();
    updateDerivedPreview();
  }

  function toggleHeroType() {
    $('video-field').style.display = $('f-hero-type').value === 'image' ? 'none' : '';
  }

  function updateImagePreview() {
    const img = $('image-preview');
    if (state.pendingImage) {
      img.src = URL.createObjectURL(state.pendingImage);
      img.hidden = false;
    } else if ($('f-image').value && $('f-image').value !== '__pending__') {
      img.src = `/${$('f-image').value}`;
      img.hidden = false;
    } else {
      img.hidden = true;
    }
  }

  // ---------------------------------------------------------------------
  // Media upload
  // ---------------------------------------------------------------------
  function sanitizeFilename(name) {
    return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-');
  }

  function fileToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
      reader.readAsDataURL(blob);
    });
  }

  /** Returns a media descriptor for admin-publish ({path, inline} or {path, uploadId, totalChunks}). */
  async function uploadFile(file, targetDir, onProgress) {
    const path = `${targetDir}/${sanitizeFilename(file.name)}`;
    if (file.size <= INLINE_LIMIT) {
      onProgress(`Preparando ${file.name}…`);
      return { path, inline: await fileToBase64(file) };
    }
    const uploadId = crypto.randomUUID();
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    for (let i = 0; i < totalChunks; i++) {
      onProgress(`Subiendo ${file.name} — parte ${i + 1} de ${totalChunks}…`);
      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await api('admin-upload', {
        method: 'POST',
        body: JSON.stringify({ uploadId, chunkIndex: i, totalChunks, data: await fileToBase64(chunk) })
      });
    }
    return { path, uploadId, totalChunks };
  }

  // ---------------------------------------------------------------------
  // Publish
  // ---------------------------------------------------------------------
  function setStatus(html, cls) {
    $('publish-status').innerHTML = cls ? `<span class="${cls}">${html}</span>` : html;
  }

  function collectConfig(videoPath, imagePath) {
    const c = JSON.parse(JSON.stringify(state.config));
    c.event.name = $('f-name').value.trim();
    c.event.subtitle = $('f-subtitle').value.trim();
    c.event.date = $('f-date').value;
    c.event.time = $('f-time').value;
    c.event.location = $('f-location').value.trim();
    c.appearance.accent_color = $('f-color-hex').value.trim();
    c.hero.type = $('f-hero-type').value;
    c.hero.video = videoPath;
    c.hero.image = imagePath;
    c.notion = c.notion || {};
    c.notion.database_id = $('f-notion-db').value.trim().replace(/-/g, '');
    c.email.subject = $('f-email-subject').value.trim();
    c.email.event_name = c.event.name;
    c.email.location = $('f-email-location').value.trim();
    c.email.title_line = $('f-email-title').value.trim();
    c.email.intro = $('f-email-intro').value.trim();
    c.email.note_box = $('f-email-note').value.trim();
    c.email.car_directions = $('f-email-car').value.trim();
    c.email.car_maps_url = $('f-email-car-url').value.trim();
    c.email.walk_directions = $('f-email-walk').value.trim();
    c.email.walk_maps_url = $('f-email-walk-url').value.trim();
    c.email.contact_text = $('f-email-contact-text').value.trim();
    c.email.contact_email = $('f-email-contact-email').value.trim();
    c.email.contact_phone = $('f-email-contact-phone').value.trim();
    c.invite = c.invite || {};
    c.invite.subject = $('f-inv-subject').value.trim();
    c.invite.message = $('f-inv-message').value.trim();
    c.invite.cta_label = $('f-inv-cta').value.trim();
    return c;
  }

  async function pollDeploy(configHash) {
    const deadline = Date.now() + DEPLOY_TIMEOUT_MS;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, DEPLOY_POLL_MS));
      try {
        const res = await fetch(`/build-info.json?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const info = await res.json();
          if (info.configHash === configHash) return true;
        }
      } catch { /* network hiccup — keep polling */ }
      setStatus('Netlify está publicando el sitio… (~1 min)', 'status-busy');
    }
    return false;
  }

  async function publish(event) {
    event.preventDefault();
    if (!validateForm()) return;

    const btn = $('publish-btn');
    btn.disabled = true;
    btn.classList.add('is-loading');

    try {
      const media = [];
      let videoPath = $('f-video').value;
      let imagePath = $('f-image').value;

      if (state.pendingVideo) {
        const item = await uploadFile(state.pendingVideo, 'assets', (msg) => setStatus(msg, 'status-busy'));
        media.push(item);
        videoPath = item.path;
      }
      if (state.pendingImage) {
        const item = await uploadFile(state.pendingImage, 'assets/imgs', (msg) => setStatus(msg, 'status-busy'));
        media.push(item);
        imagePath = item.path;
      }

      setStatus('Guardando cambios en GitHub…', 'status-busy');
      const result = await api('admin-publish', {
        method: 'POST',
        body: JSON.stringify({ config: collectConfig(videoPath, imagePath), media })
      });

      setStatus('Cambios guardados ✓ — Netlify está publicando el sitio…', 'status-busy');
      const live = await pollDeploy(result.configHash);

      if (live) {
        setStatus('¡Listo! Los cambios ya están en vivo. <a href="/" target="_blank" rel="noopener">Ver sitio</a>', 'status-ok');
      } else {
        setStatus('Los cambios se guardaron, pero no se pudo confirmar el deploy. Revisa Netlify.', 'status-error');
      }

      // Refresh state so a second publish starts from the new config
      state.pendingVideo = null;
      state.pendingImage = null;
      $('video-upload-label').textContent = 'Subir video nuevo (.mp4)';
      $('image-upload-label').textContent = 'Subir imagen nueva';
      document.querySelectorAll('.upload-drop').forEach((el) => el.classList.remove('has-file'));
      await loadConfig(false);
    } catch (error) {
      setStatus(`Error: ${error.message}`, 'status-error');
    } finally {
      btn.disabled = false;
      btn.classList.remove('is-loading');
    }
  }

  // ---------------------------------------------------------------------
  // Guest list
  // ---------------------------------------------------------------------
  function selectedGuests() {
    return state.guests.filter((g) => !state.unchecked.has(g.email));
  }

  function renderGuests() {
    const rows = $('guest-rows');
    const totalPages = Math.max(1, Math.ceil(state.guests.length / GUESTS_PER_PAGE));
    state.guestPage = Math.min(state.guestPage, totalPages - 1);
    const start = state.guestPage * GUESTS_PER_PAGE;
    const pageGuests = state.guests.slice(start, start + GUESTS_PER_PAGE);

    rows.innerHTML = '';
    for (const guest of pageGuests) {
      const tr = document.createElement('tr');

      const tdCheck = document.createElement('td');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !state.unchecked.has(guest.email);
      cb.setAttribute('aria-label', `Incluir a ${guest.name}`);
      cb.addEventListener('change', () => {
        if (cb.checked) state.unchecked.delete(guest.email);
        else state.unchecked.add(guest.email);
        updateGuestCount();
      });
      tdCheck.appendChild(cb);

      const tdName = document.createElement('td');
      tdName.textContent = guest.name;
      const tdEmail = document.createElement('td');
      tdEmail.textContent = guest.email;
      const tdPhone = document.createElement('td');
      tdPhone.textContent = guest.phone || '—';

      const tdStatus = document.createElement('td');
      if (guest.send_error) {
        tdStatus.textContent = '✕ error';
        tdStatus.className = 'guest-status-error';
        tdStatus.title = guest.send_error;
      } else if (guest.invited_at) {
        tdStatus.textContent = `✓ invitado ${guest.invited_at.slice(0, 10)}`;
        tdStatus.className = 'guest-status-sent';
      } else {
        tdStatus.textContent = 'pendiente';
        tdStatus.className = 'guest-status-pending';
      }

      const tdDel = document.createElement('td');
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'guest-del';
      del.textContent = '✕';
      del.setAttribute('aria-label', `Eliminar a ${guest.name}`);
      del.addEventListener('click', () => removeGuest(guest));
      tdDel.appendChild(del);

      tr.append(tdCheck, tdName, tdEmail, tdPhone, tdStatus, tdDel);
      rows.appendChild(tr);
    }

    $('g-empty').hidden = state.guests.length > 0;
    $('guest-pager').hidden = totalPages <= 1;
    $('g-page-label').textContent = `Página ${state.guestPage + 1} / ${totalPages}`;
    $('g-prev').disabled = state.guestPage === 0;
    $('g-next').disabled = state.guestPage >= totalPages - 1;
    updateGuestCount();
  }

  function updateGuestCount() {
    const selected = selectedGuests().length;
    $('g-count').textContent = state.guests.length
      ? `${selected} de ${state.guests.length} seleccionados`
      : '';
    $('g-send-btn').disabled = selected === 0;
    const label = $('g-send-btn').querySelector('.btn-label');
    label.textContent = selected ? `ENVIAR INVITACIONES (${selected})` : 'ENVIAR INVITACIONES';
    const all = state.guests.length > 0 && state.unchecked.size === 0;
    $('g-select-all').checked = all;
  }

  async function loadGuests() {
    const data = await api('admin-guests');
    state.guests = data.guests;
    renderGuests();
  }

  async function addGuest() {
    const name = $('g-name').value.trim();
    const email = $('g-email').value.trim();
    const phone = $('g-phone').value.trim();
    const errorEl = $('g-add-error');
    errorEl.hidden = true;
    try {
      const data = await api('admin-guests', { method: 'POST', body: JSON.stringify({ name, email, phone }) });
      state.guests = data.guests;
      $('g-name').value = '';
      $('g-email').value = '';
      $('g-phone').value = '';
      $('g-name').focus();
      renderGuests();
    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.hidden = false;
    }
  }

  async function removeGuest(guest) {
    if (!window.confirm(`¿Eliminar a ${guest.name} (${guest.email}) de la lista?`)) return;
    const data = await api('admin-guests', { method: 'DELETE', body: JSON.stringify({ email: guest.email }) });
    state.guests = data.guests;
    state.unchecked.delete(guest.email);
    renderGuests();
  }

  function setInviteStatus(html, cls) {
    $('invite-status').innerHTML = cls ? `<span class="${cls}">${html}</span>` : html;
  }

  async function sendInvites() {
    const targets = selectedGuests();
    if (!targets.length) return;
    if (!window.confirm(`Se enviará la invitación a ${targets.length} invitado(s). ¿Continuar?`)) return;

    const btn = $('g-send-btn');
    btn.disabled = true;
    btn.classList.add('is-loading');

    const overrides = {
      subject: $('f-inv-subject').value.trim(),
      message: $('f-inv-message').value.trim(),
      cta_label: $('f-inv-cta').value.trim()
    };

    let sent = 0;
    let failed = 0;
    for (let i = 0; i < targets.length; i++) {
      const guest = targets[i];
      setInviteStatus(`Enviando ${i + 1} de ${targets.length} — ${guest.name}…`, 'status-busy');
      try {
        const res = await api('admin-send-invite', {
          method: 'POST',
          body: JSON.stringify({ email: guest.email, overrides })
        });
        guest.invited_at = res.invited_at;
        delete guest.send_error;
        sent++;
      } catch (error) {
        guest.send_error = error.message;
        failed++;
      }
      renderGuests();
    }

    if (failed === 0) {
      setInviteStatus(`${sent} invitación(es) enviadas correctamente.`, 'status-ok');
    } else {
      setInviteStatus(`${sent} enviadas, ${failed} fallaron (marcadas con ✕ en la lista).`, 'status-error');
    }
    btn.classList.remove('is-loading');
    updateGuestCount();
  }

  // ---------------------------------------------------------------------
  // Load + wire up
  // ---------------------------------------------------------------------
  async function loadConfig(showLoader = true) {
    if (showLoader) {
      $('dash-loading').hidden = false;
      $('event-form').hidden = true;
    }
    const data = await api('admin-config');
    state.config = data.config;
    state.assets = data.assets;
    populateForm();
    $('dash-loading').hidden = true;
    $('event-form').hidden = false;
    // Guest list loads separately so a Blobs hiccup can't block the event editor
    loadGuests().catch((error) => setInviteStatus(`No se pudo cargar la lista: ${error.message}`, 'status-error'));
  }

  async function handleLogin(event) {
    event.preventDefault();
    const btn = $('login-btn');
    const errorEl = $('login-error');
    errorEl.hidden = true;
    btn.disabled = true;
    btn.classList.add('is-loading');
    try {
      const res = await fetch(`${API}/admin-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: $('login-password').value })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudo iniciar sesión');
      sessionStorage.setItem(TOKEN_KEY, data.token);
      showDashboard();
      await loadConfig();
    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.hidden = false;
      $('login-password').setAttribute('aria-invalid', 'true');
    } finally {
      btn.disabled = false;
      btn.classList.remove('is-loading');
    }
  }

  function wireUp() {
    $('login-form').addEventListener('submit', handleLogin);
    $('event-form').addEventListener('submit', publish);
    $('logout-btn').addEventListener('click', () => {
      sessionStorage.removeItem(TOKEN_KEY);
      showLogin();
    });
    $('theme-toggle').addEventListener('click', toggleTheme);
    applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

    // Derived preview
    $('f-date').addEventListener('input', updateDerivedPreview);
    $('f-time').addEventListener('input', updateDerivedPreview);

    // Color inputs stay in sync
    $('f-color').addEventListener('input', () => {
      $('f-color-hex').value = $('f-color').value.toUpperCase();
      setFieldError($('f-color-hex'), '');
    });
    $('f-color-hex').addEventListener('blur', () => {
      const value = $('f-color-hex').value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(value)) {
        $('f-color').value = value;
        setFieldError($('f-color-hex'), '');
      } else {
        setFieldError($('f-color-hex'), 'Usa formato #RRGGBB, ej. #D0FF00.');
      }
    });

    // Guest list
    $('g-add-btn').addEventListener('click', addGuest);
    for (const id of ['g-name', 'g-email', 'g-phone']) {
      $(id).addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addGuest(); }
      });
    }
    $('g-select-all').addEventListener('change', (e) => {
      state.unchecked = e.target.checked ? new Set() : new Set(state.guests.map((g) => g.email));
      renderGuests();
    });
    $('g-prev').addEventListener('click', () => { state.guestPage--; renderGuests(); });
    $('g-next').addEventListener('click', () => { state.guestPage++; renderGuests(); });
    $('g-send-btn').addEventListener('click', sendInvites);

    $('f-hero-type').addEventListener('change', toggleHeroType);
    $('f-image').addEventListener('change', () => {
      state.pendingImage = null;
      updateImagePreview();
    });

    // File uploads
    $('f-video-upload').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      state.pendingVideo = file;
      $('video-upload-label').textContent = `${file.name} (${(file.size / 1048576).toFixed(1)} MB)`;
      e.target.closest('.field').querySelector('.upload-drop').classList.add('has-file');
      fillSelect($('f-video'), state.assets.videos, null, file.name);
    });
    $('f-image-upload').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      state.pendingImage = file;
      $('image-upload-label').textContent = `${file.name} (${(file.size / 1048576).toFixed(1)} MB)`;
      e.target.closest('.field').querySelector('.upload-drop').classList.add('has-file');
      fillSelect($('f-image'), state.assets.images, null, file.name);
      updateImagePreview();
    });
  }

  async function init() {
    wireUp();
    if (getToken()) {
      showDashboard();
      try {
        await loadConfig();
      } catch (error) {
        // 401 already switched to login; anything else, show it
        if (!$('dashboard-view').hidden) {
          $('dash-loading').textContent = `Error cargando configuración: ${error.message}`;
        }
      }
    } else {
      showLogin();
    }
  }

  init();
})();
