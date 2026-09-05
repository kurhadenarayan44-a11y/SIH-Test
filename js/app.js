/**
 * js/app.js
 * Main Application Orchestration & Rural Accessibility Controls:
 * - Dynamic Font Resizer (A- / A / A+)
 * - Day / Night Contrast Mode Toggle
 * - 1551 Kisan Call Centre Direct Hotline
 * - Text-to-Speech (Audio Readout) via window.speechSynthesis
 * - Voice Search Simulation for Mandi Queries with Web Audio Chime
 * - 3-Step Visual Rural Guide Interactions
 * - Interactive Mandi Bhav Table with Search, Filter & Pagination
 */

// Global Font Sizing (14px, 16px, 19px)
const FONT_SIZES = [14, 16, 19];
let currentFontIndex = 1;

window.initAccessibility = function() {
  const savedFont = localStorage.getItem('kisan_font_size');
  if (savedFont) {
    const parsed = parseInt(savedFont, 10);
    const idx = FONT_SIZES.indexOf(parsed);
    if (idx !== -1) currentFontIndex = idx;
  }
  window.applyFontSize();

  const savedTheme = localStorage.getItem('kisan_theme') || 'day';
  window.setTheme(savedTheme);

  const btnFontMinus = document.getElementById('btnFontMinus');
  const btnFontReset = document.getElementById('btnFontReset');
  const btnFontPlus = document.getElementById('btnFontPlus');

  if (btnFontMinus) btnFontMinus.addEventListener('click', () => window.scaleFont(-1));
  if (btnFontReset) btnFontReset.addEventListener('click', () => window.resetFont());
  if (btnFontPlus) btnFontPlus.addEventListener('click', () => window.scaleFont(1));

  const btnThemeToggle = document.getElementById('btnThemeToggle');
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      const current = document.body.classList.contains('night-mode') ? 'night' : 'day';
      window.setTheme(current === 'day' ? 'night' : 'day');
    });
  }
};

window.scaleFont = function(delta) {
  currentFontIndex = Math.max(0, Math.min(FONT_SIZES.length - 1, currentFontIndex + delta));
  window.applyFontSize();
};

window.resetFont = function() {
  currentFontIndex = 1;
  window.applyFontSize();
};

window.applyFontSize = function() {
  const size = FONT_SIZES[currentFontIndex];
  document.documentElement.style.fontSize = `${size}px`;
  localStorage.setItem('kisan_font_size', size);

  const buttons = [
    document.getElementById('btnFontMinus'),
    document.getElementById('btnFontReset'),
    document.getElementById('btnFontPlus')
  ];
  buttons.forEach((btn, idx) => {
    if (btn) {
      if (idx === currentFontIndex) btn.classList.add('font-btn-active');
      else btn.classList.remove('font-btn-active');
    }
  });
};

window.setTheme = function(theme) {
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  if (theme === 'night') {
    document.body.classList.add('night-mode');
    document.body.classList.remove('day-mode');
    localStorage.setItem('kisan_theme', 'night');
    if (btnThemeToggle) {
      btnThemeToggle.innerHTML = `🌙 <span class="theme-label" data-i18n="night_mode">High-Contrast Night</span>`;
    }
  } else {
    document.body.classList.remove('night-mode');
    document.body.classList.add('day-mode');
    localStorage.setItem('kisan_theme', 'day');
    if (btnThemeToggle) {
      btnThemeToggle.innerHTML = `☀️ <span class="theme-label" data-i18n="day_mode">Emerald Day</span>`;
    }
  }

  if (typeof window.renderForecastChart === 'function') {
    window.renderForecastChart();
  }
};

// ==========================================
// Text-to-Speech (Audio Readout Engine)
// ==========================================
const LANG_VOICE_MAP = {
  hi: 'hi-IN',
  mr: 'mr-IN',
  pa: 'pa-IN',
  gu: 'gu-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  or: 'or-IN',
  en: 'en-IN'
};

window.playAudioChime = function() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Ignore audio context autoplay restrictions gracefully
  }
};

window.speakText = function(text, langOverride) {
  if (!('speechSynthesis' in window)) {
    window.showToast("Speech synthesis not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const lang = langOverride || window.currentLanguage || 'en';
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_VOICE_MAP[lang] || 'hi-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  window.showToast(`🔊 ${text.length > 55 ? text.substring(0, 55) + '...' : text}`);
  window.speechSynthesis.speak(utterance);
};

// Readout single Mandi Bhav row
window.readMandiRow = function(recordId) {
  const r = window.MANDI_RECORDS.find(rec => rec.id === recordId);
  if (!r) return;

  const lang = window.currentLanguage || 'en';
  let speech = "";

  if (lang === 'hi') {
    speech = `${r.market} मंडी, ${r.state} में ${r.commodity} ${r.variety} का मॉडल भाव ₹${r.modal_price} प्रति क्विंटल है। न्यूनतम भाव ₹${r.min_price} और अधिकतम भाव ₹${r.max_price} है।`;
  } else if (lang === 'mr') {
    speech = `${r.market} बाजार समितीत ${r.commodity} चे मॉडेल भाव ₹${r.modal_price} प्रति क्विंटल आहे. किमान दर ₹${r.min_price} आणि कमाल दर ₹${r.max_price} आहे.`;
  } else if (lang === 'pa') {
    speech = `${r.market} ਮੰਡੀ ਵਿੱਚ ${r.commodity} ਦਾ ਮਾਡਲ ਭਾਅ ₹${r.modal_price} ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ।`;
  } else {
    speech = `${r.market} APMC in ${r.district}, ${r.state}. ${r.commodity} ${r.variety} modal price is ₹${r.modal_price} per Quintal. Minimum rate is ₹${r.min_price}, maximum rate is ₹${r.max_price}. Trend is ${r.trend}.`;
  }

  window.speakText(speech, lang);
};

// ==========================================
// Voice Search Simulation
// ==========================================
window.initVoiceSearch = function() {
  const micBtn = document.getElementById('btnVoiceSearch');
  if (!micBtn) return;

  micBtn.addEventListener('click', () => {
    window.playAudioChime();
    window.openModal('voiceSearchModal');
  });
};

window.executeVoiceQuery = function(queryText) {
  const searchInput = document.getElementById('mandiSearchInput');
  if (searchInput) {
    searchInput.value = queryText;
    window.currentMandiPage = 1;
    window.refreshMandiTable();
    window.closeModal('voiceSearchModal');

    window.speakText(`Searching live mandi arrivals for ${queryText}`);
    window.showToast(`Voice Query Recognized: "${queryText}"`);
  }
};

// ==========================================
// Interactive Mandi Bhav Table Engine
// ==========================================
window.currentMandiPage = 1;
window.mandiPageSize = 15;

window.setTableCommodityFilter = function(commodityName) {
  const select = document.getElementById('mandiCommodityFilter');
  if (select) select.value = commodityName;
  window.currentMandiPage = 1;
  window.refreshMandiTable();
};

window.initMandiTable = function() {
  const stateSelect = document.getElementById('mandiStateFilter');
  const commoditySelect = document.getElementById('mandiCommodityFilter');
  const searchInput = document.getElementById('mandiSearchInput');

  if (stateSelect && window.MANDI_STATES) {
    window.MANDI_STATES.forEach(st => {
      const opt = document.createElement('option');
      opt.value = st;
      opt.textContent = st;
      stateSelect.appendChild(opt);
    });

    stateSelect.addEventListener('change', () => {
      window.currentMandiPage = 1;
      window.refreshMandiTable();
    });
  }

  if (commoditySelect && window.MANDI_COMMODITIES) {
    window.MANDI_COMMODITIES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      commoditySelect.appendChild(opt);
    });

    commoditySelect.addEventListener('change', () => {
      window.currentMandiPage = 1;
      window.refreshMandiTable();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      window.currentMandiPage = 1;
      window.refreshMandiTable();
    });
  }

  window.refreshMandiTable();
};

window.refreshMandiTable = function() {
  const tbody = document.getElementById('mandiTableBody');
  const paginationEl = document.getElementById('mandiPaginationInfo');
  if (!tbody) return;

  const state = document.getElementById('mandiStateFilter')?.value || '';
  const commodity = document.getElementById('mandiCommodityFilter')?.value || '';
  const search = document.getElementById('mandiSearchInput')?.value || '';

  const offset = (window.currentMandiPage - 1) * window.mandiPageSize;
  const res = window.filterMandiRecords({
    state: state,
    commodity: commodity,
    searchQuery: search,
    offset: offset,
    limit: window.mandiPageSize
  });

  tbody.innerHTML = '';

  res.results.forEach(r => {
    const tr = document.createElement('tr');
    let trendBadge = `<span class="badge-trend-flat">= Flat</span>`;
    if (r.trend === 'Up') trendBadge = `<span class="badge-trend-up">▲ +Up</span>`;
    if (r.trend === 'Down') trendBadge = `<span class="badge-trend-down">▼ -Down</span>`;

    tr.innerHTML = `
      <td><strong>${r.state}</strong></td>
      <td>${r.district}</td>
      <td><span class="mandi-name" style="font-weight: 700; color: var(--text-main);">${r.market}</span></td>
      <td><span class="commodity-tag">${r.commodity}</span></td>
      <td><small class="variety-name">${r.variety}</small></td>
      <td>₹${r.min_price.toLocaleString('en-IN')}</td>
      <td>₹${r.max_price.toLocaleString('en-IN')}</td>
      <td><strong class="modal-price-val">₹${r.modal_price.toLocaleString('en-IN')}</strong></td>
      <td>${trendBadge}</td>
      <td>
        <button class="btn-icon-read" onclick="window.readMandiRow('${r.id}')" title="Listen to Rate">
          🔊 Read
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (paginationEl) {
    const totalPages = Math.ceil(res.total / window.mandiPageSize) || 1;
    paginationEl.innerHTML = `
      <span>Showing <strong>${res.total === 0 ? 0 : offset + 1} - ${Math.min(offset + window.mandiPageSize, res.total)}</strong> of <strong>${res.total.toLocaleString('en-IN')}</strong> national APMC lots</span>
      <div class="pagination-controls">
        <button class="btn btn-sm btn-outline" onclick="window.changeMandiPage(-1)" ${window.currentMandiPage <= 1 ? 'disabled' : ''}>← Prev</button>
        <span class="page-num" style="font-weight: 800; padding: 0 6px;">Page ${window.currentMandiPage} of ${totalPages}</span>
        <button class="btn btn-sm btn-outline" onclick="window.changeMandiPage(1)" ${window.currentMandiPage >= totalPages ? 'disabled' : ''}>Next →</button>
      </div>
    `;
  }
};

window.changeMandiPage = function(delta) {
  window.currentMandiPage = Math.max(1, window.currentMandiPage + delta);
  window.refreshMandiTable();
};

// ==========================================
// Modal Utilities
// ==========================================
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('modal-open');
    document.body.classList.add('modal-backdrop-active');
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('modal-open');
    document.body.classList.remove('modal-backdrop-active');
  }
};

// Global Toast System
window.showToast = function(msg) {
  let toastContainer = document.getElementById('globalToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'globalToastContainer';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-bubble';
  toast.textContent = msg;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
};

// Initialize App on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.initAccessibility();
  window.initAuth();
  window.initMandiTable();
  window.initVoiceSearch();
  window.initMarketplace();
  window.initAnalytics();
  window.initRatingSystem();

  const savedLang = localStorage.getItem('kisan_lang') || 'en';
  window.setLanguage(savedLang);

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('modal-open');
        document.body.classList.remove('modal-backdrop-active');
      }
    });
  });
});
