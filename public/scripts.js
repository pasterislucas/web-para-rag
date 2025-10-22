(function () {
  const listEl = document.getElementById('pdf-list');
  const emptyEl = document.getElementById('empty-state');
  const fileInput = document.getElementById('file-input');
  const localPreview = document.getElementById('local-preview');
  const localIframe = document.getElementById('local-iframe');

  async function fetchManifest() {
    try {
      const res = await fetch('./pdfs/manifest.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo leer manifest.json');
      return await res.json();
    } catch (e) {
      return { items: [] };
    }
  }

  function formatBytes(bytes) {
    if (typeof bytes !== 'number' || Number.isNaN(bytes)) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let value = bytes;
    while (value >= 1024 && i < units.length - 1) {
      value /= 1024;
      i++;
    }
    return `${value.toFixed(1)} ${units[i]}`;
  }

  function renderList(items) {
    listEl.innerHTML = '';
    if (!items || items.length === 0) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    for (const item of items) {
      const card = document.createElement('article');
      card.className = 'pdf-card';
      const title = document.createElement('h3');
      title.textContent = item.title || item.file;
      const meta = document.createElement('div');
      meta.className = 'pdf-meta';
      const size = item.size ? ` · ${formatBytes(item.size)}` : '';
      meta.textContent = `${item.file}${size}`;

      const actions = document.createElement('div');
      actions.className = 'actions';

      const viewBtn = document.createElement('a');
      viewBtn.className = 'btn primary';
      viewBtn.href = `./pdfs/${encodeURIComponent(item.file)}`;
      viewBtn.target = '_blank';
      viewBtn.rel = 'noopener noreferrer';
      viewBtn.textContent = 'Ver';

      const embedBtn = document.createElement('button');
      embedBtn.className = 'btn';
      embedBtn.textContent = 'Abrir integrado';
      embedBtn.addEventListener('click', () => {
        openInViewer(`./pdfs/${encodeURIComponent(item.file)}`);
      });

      actions.appendChild(viewBtn);
      actions.appendChild(embedBtn);

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(actions);
      listEl.appendChild(card);
    }
  }

  function openInViewer(src) {
    const viewerSection = ensureGlobalViewer();
    const iframe = viewerSection.querySelector('iframe');
    iframe.src = src;
    viewerSection.hidden = false;
    iframe.focus();
  }

  function ensureGlobalViewer() {
    let viewer = document.getElementById('global-viewer');
    if (!viewer) {
      viewer = document.createElement('div');
      viewer.id = 'global-viewer';
      viewer.className = 'viewer';
      const iframe = document.createElement('iframe');
      iframe.title = 'Visor de PDF';
      viewer.appendChild(iframe);
      const container = document.querySelector('.container');
      const firstPanel = container.firstElementChild;
      container.insertBefore(viewer, firstPanel.nextSibling);
    }
    return viewer;
  }

  async function init() {
    const manifest = await fetchManifest();
    renderList(Array.isArray(manifest.items) ? manifest.items : []);
  }

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      localPreview.hidden = true;
      localIframe.src = '';
      return;
    }
    if (file.type !== 'application/pdf') {
      alert('Por favor selecciona un archivo PDF.');
      fileInput.value = '';
      localPreview.hidden = true;
      localIframe.src = '';
      return;
    }
    const url = URL.createObjectURL(file);
    localIframe.src = url;
    localPreview.hidden = false;
  });

  document.addEventListener('DOMContentLoaded', init);
})();


