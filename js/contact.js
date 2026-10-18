/* Yagya Krishi Udhyog — contact + WhatsApp lead form.
   Validates in the current language, then opens WhatsApp with a prepared
   message. Nothing is stored on a server; the page never claims a message
   was delivered — it only states that WhatsApp was opened with the text. */
(function () {
  'use strict';

  var U = window.YK_UTIL;
  var CFG = window.YK_CONFIG || {};
  var STORE_KEY = CFG.draftKey || 'yk_enquiry_draft';

  var LABELS = {
    name: 'wa.label_name',
    phone: 'wa.label_phone',
    email: 'contact.form.email',
    location: 'contact.form.location'
  };

  function t(key, vars) { return U.t(key, vars); }

  /* Every [data-wa-link] gets the greeting (or its own data-wa-message) as
     ?text= so the first WhatsApp line is always in the selected language. */
  function refreshWaLinks() {
    var links = document.querySelectorAll('[data-wa-link]');
    for (var i = 0; i < links.length; i++) {
      var custom = links[i].getAttribute('data-wa-message');
      links[i].setAttribute('href', U.waUrl(custom || null));
    }
  }

  function digits(value) {
    return String(value || '').replace(/\D/g, '');
  }

  var RULES = {
    name: function (value) {
      if (!value.trim() || value.trim().length < 2) return 'form.err_required';
      return '';
    },
    phone: function (value) {
      if (!value.trim()) return 'form.err_required';
      var d = digits(value);
      if (d.length < 7 || d.length > 15) return 'form.err_phone';
      return '';
    },
    email: function (value) {
      if (!value.trim()) return '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) return 'form.err_email';
      return '';
    },
    interest: function (value) {
      return value ? '' : 'form.err_select';
    },
    message: function (value) {
      if (!value.trim() || value.trim().length < 5) return 'form.err_required';
      return '';
    }
  };

  function fieldWrap(name) {
    return document.querySelector('.field[data-field="' + name + '"]');
  }

  function fieldInput(name) {
    var wrap = fieldWrap(name);
    return wrap ? wrap.querySelector('input, select, textarea') : null;
  }

  function errorNode(name) {
    var wrap = fieldWrap(name);
    return wrap ? wrap.querySelector('.field__error') : document.getElementById('err-' + name);
  }

  function clearField(name) {
    var wrap = fieldWrap(name);
    if (wrap) wrap.classList.remove('is-invalid');
    var err = errorNode(name);
    if (err) err.textContent = '';
  }

  function markField(name, messageKey) {
    var wrap = fieldWrap(name);
    if (wrap) wrap.classList.add('is-invalid');
    var err = errorNode(name);
    if (err) err.textContent = t(messageKey);
  }

  function validate() {
    var names = ['name', 'phone', 'email', 'interest', 'message'];
    var invalid = [];
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var input = fieldInput(name);
      if (!input) continue;
      var rule = RULES[name];
      var errorKey = rule ? rule(input.value) : '';
      if (errorKey) {
        markField(name, errorKey);
        invalid.push(name);
      } else {
        clearField(name);
      }
    }
    return invalid;
  }

  function buildMessage() {
    var name = (fieldInput('name') || { value: '' }).value.trim();
    var phone = (fieldInput('phone') || { value: '' }).value.trim();
    var email = (fieldInput('email') || { value: '' }).value.trim();
    var location = (fieldInput('location') || { value: '' }).value.trim();
    var interestEl = fieldInput('interest');
    var message = (fieldInput('message') || { value: '' }).value.trim();
    var interest = '';
    if (interestEl && interestEl.selectedIndex >= 0) {
      interest = (interestEl.options[interestEl.selectedIndex].textContent || '').trim();
    }

    var lines = [];
    lines.push(t('wa.greeting'));
    lines.push('');
    lines.push(t('wa.form_message'));
    lines.push('');
    lines.push(t(LABELS.name) + ': ' + name);
    lines.push(t(LABELS.phone) + ': ' + phone);
    if (email) lines.push(t(LABELS.email) + ': ' + email);
    if (location) lines.push(t(LABELS.location) + ': ' + location);
    if (interest) lines.push(t('contact.form.interest') + ': ' + interest);
    lines.push('');
    lines.push(t('wa.label_message') + ':');
    lines.push(message);
    lines.push('');
    lines.push(t('wa.closing'));
    return lines.join('\n');
  }

  /* ------------------------------------------------------------- feedback */

  function showErrors(invalid) {
    var box = document.getElementById('form-errors');
    var result = document.getElementById('form-result');
    if (result) result.classList.remove('is-visible');
    if (!box) return;
    box.textContent = t('form.error_summary');
    box.classList.add('is-visible');
    if (invalid.length) {
      var first = fieldInput(invalid[0]);
      if (first && typeof first.focus === 'function') first.focus();
    } else {
      box.focus();
    }
  }

  function showResult(url, opened) {
    var box = document.getElementById('form-result');
    var text = document.getElementById('form-result-text');
    var link = document.getElementById('form-result-link');
    var errors = document.getElementById('form-errors');
    if (errors) {
      errors.classList.remove('is-visible');
      errors.textContent = '';
    }
    if (text) text.textContent = t(opened ? 'form.success' : 'form.use_link');
    if (link) link.setAttribute('href', url);
    if (box) box.classList.add('is-visible');
  }

  /* ---------------------------------------------------------------- draft */

  function readDraft() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveDraft() {
    if (!form) return;
    var data = {
      name: (fieldInput('name') || { value: '' }).value,
      phone: (fieldInput('phone') || { value: '' }).value,
      email: (fieldInput('email') || { value: '' }).value,
      location: (fieldInput('location') || { value: '' }).value,
      interest: (fieldInput('interest') || { value: '' }).value,
      message: (fieldInput('message') || { value: '' }).value
    };
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* blocked */ }
  }

  function clearDraft() {
    try { window.localStorage.removeItem(STORE_KEY); } catch (e) { /* blocked */ }
  }

  function applyDraft(draft) {
    if (!draft) return;
    var names = ['name', 'phone', 'email', 'location', 'interest', 'message'];
    for (var i = 0; i < names.length; i++) {
      var input = fieldInput(names[i]);
      if (input && !input.value && draft[names[i]]) input.value = draft[names[i]];
    }
  }

  /* Prefills the enquiry when arriving from a catalogue card
     (?interest=feed&item=Pig%20Feed…). */
  function applyQueryPrefill() {
    var params = new URLSearchParams(location.search);
    var interest = params.get('interest');
    var item = params.get('item');
    var select = fieldInput('interest');
    if (interest && select) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === interest) {
          select.value = interest;
          break;
        }
      }
    }
    var message = fieldInput('message');
    if (item && message && !message.value) {
      message.value = t('wa.product_prefix') + ' ' + item + '\n' + t('wa.product_suffix');
    }
  }

  /* ------------------------------------------------------------------ init */

  var draftTimer = null;
  var form = null;

  function onSubmit(e) {
    e.preventDefault();
    var invalid = validate();
    if (invalid.length) {
      showErrors(invalid);
      return;
    }
    var url = U.waUrl(buildMessage());
    var opened = null;
    try {
      opened = window.open(url, '_blank', 'noopener');
    } catch (err) {
      opened = null;
    }
    showResult(url, !!opened);
    clearDraft();
  }

  function init() {
    refreshWaLinks();
    form = document.getElementById('lead-form');
    if (!form) return;

    applyDraft(readDraft());
    applyQueryPrefill();

    form.addEventListener('submit', onSubmit);

    var names = ['name', 'phone', 'email', 'location', 'interest', 'message'];
    for (var i = 0; i < names.length; i++) {
      (function (name) {
        var input = fieldInput(name);
        if (!input) return;
        input.addEventListener('input', function () {
          clearField(name);
          clearTimeout(draftTimer);
          draftTimer = setTimeout(saveDraft, 500);
        });
        input.addEventListener('change', function () {
          clearField(name);
          clearTimeout(draftTimer);
          draftTimer = setTimeout(saveDraft, 500);
        });
      })(names[i]);
    }
  }

  function refresh() {
    refreshWaLinks();
  }

  window.YK_CONTACT = { init: init, refresh: refresh };
})();
