// =============================================
// UTILS.JS — SHARED UTILITIES
// =============================================

// ─── Toast Notifications ──────────────────────

let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

const TOAST_ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

export function showToast(message, type = 'info', duration = 4000) {
  const container = getToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type]}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── Loading Screen ───────────────────────────

export function showLoading(text = 'Memuat...') {
  let screen = document.getElementById('loading-screen');
  if (!screen) {
    screen = document.createElement('div');
    screen.id = 'loading-screen';
    screen.className = 'loading-screen';
    screen.innerHTML = `
      <div class="loading-logo">🤖</div>
      <div class="loading-spinner"></div>
      <div class="loading-text" id="loading-text">${text}</div>
    `;
    document.body.appendChild(screen);
  } else {
    document.getElementById('loading-text').textContent = text;
    screen.style.display = 'flex';
  }
}

export function hideLoading() {
  const screen = document.getElementById('loading-screen');
  if (screen) {
    screen.style.opacity = '0';
    screen.style.transition = 'opacity 0.3s';
    setTimeout(() => {
      screen.style.display = 'none';
      screen.style.opacity = '1';
    }, 300);
  }
}

// ─── Button Loading ───────────────────────────

export function setButtonLoading(btn, loading) {
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-text">Loading...</span>';
    btn.classList.add('btn-loading');
    btn.disabled = true;
  } else {
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
    btn.classList.remove('btn-loading');
    btn.disabled = false;
  }
}

// ─── Format Tanggal ───────────────────────────

export function formatDate(timestamp) {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatDateTime(timestamp) {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function timeAgo(timestamp) {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

// ─── Status Helpers ───────────────────────────

const STATUS_LABELS = {
  daftar: 'Terdaftar',
  tes_tulis: 'Tes Tulis',
  wawancara: 'Wawancara',
  diterima: 'Diterima',
  ditolak: 'Ditolak'
};

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function renderStatusBadge(status) {
  return `<span class="badge status-${status}">${getStatusLabel(status)}</span>`;
}

// ─── Divisi Helpers ───────────────────────────

export const DIVISI_INFO = {
  'Aburobonema (KRAI)': {
    singkat: 'KRAI',
    icon: '🤖',
    color: 'krai',
    cssColor: 'var(--krai-color)'
  },
  'Aroc-PL (KRSBI)': {
    singkat: 'KRSBI',
    icon: '⚽',
    color: 'krsbi',
    cssColor: 'var(--krsbi-color)'
  },
  'Robosarema (KRSRI)': {
    singkat: 'KRSRI',
    icon: '🦾',
    color: 'krsri',
    cssColor: 'var(--krsri-color)'
  }
};

export function renderDivisiBadge(divisi) {
  const info = DIVISI_INFO[divisi] || {};
  return `<span class="badge badge-${info.color || 'muted'}">${info.icon || ''} ${info.singkat || divisi}</span>`;
}

// ─── Generate Token ───────────────────────────

export function generateToken(nim) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = nim + '-';
  for (let i = 0; i < 8; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

// ─── QR Code Generator ────────────────────────

export function generateQRCode(elementId, url, size = 200) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = '';
  // Uses qrcode.js library loaded via CDN
  if (typeof QRCode !== 'undefined') {
    new QRCode(el, {
      text: url,
      width: size,
      height: size,
      colorDark: '#00c8ff',
      colorLight: '#04040f',
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}

// ─── Modal ────────────────────────────────────

export function openModal(modalId) {
  document.getElementById(modalId)?.classList.add('active');
}

export function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('active');
}

export function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay')?.classList.remove('active');
    });
  });
}

// ─── Clipboard ───────────────────────────────

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Berhasil disalin ke clipboard!', 'success');
  } catch {
    showToast('Gagal menyalin teks.', 'error');
  }
}

// ─── Export CSV ───────────────────────────────

export function exportToCSV(data, filename = 'export.csv') {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─── Confirm Dialog ───────────────────────────

export function showConfirm(message) {
  return window.confirm(message);
}

// ─── Countdown Timer ─────────────────────────

export class CountdownTimer {
  constructor(durationMinutes, onTick, onExpire) {
    this.totalSeconds = durationMinutes * 60;
    this.remaining = this.totalSeconds;
    this.onTick = onTick;
    this.onExpire = onExpire;
    this.interval = null;
  }

  start() {
    this.onTick(this.remaining);
    this.interval = setInterval(() => {
      this.remaining--;
      this.onTick(this.remaining);
      if (this.remaining <= 0) {
        this.stop();
        this.onExpire();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}

// ─── Sanitize HTML ────────────────────────────

export function escapeHtml(text) {
  const el = document.createElement('div');
  el.textContent = text;
  return el.innerHTML;
}
