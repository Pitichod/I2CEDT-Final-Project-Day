  // Show admin panel only if admin token is verified by backend
  const sourcesAdminPanel = document.getElementById('sourcesAdminPanel');
  const urlParams = new URLSearchParams(window.location.search);
import { CONFIG } from '../config.js';
  let isAdmin = false;


// ...existing code...
// sources.js - Handles logic for Sources tab in SPA
// Manages sources CRUD operations and UI rendering

import { getSources, createSource, updateSource, deleteSource } from '../api.js';

export function initSourcesTab() {
  const sourcesList = document.getElementById('sourcesList');
  const srcUrl = document.getElementById('srcUrl');
  const srcNote = document.getElementById('srcNote');
  const srcContext = document.getElementById('srcContext');
  const srcId = document.getElementById('srcId');
  const srcCreateBtn = document.getElementById('srcCreateBtn');
  const srcUpdateBtn = document.getElementById('srcUpdateBtn');

  async function renderSources() {
    const sources = await getSources();
    sourcesList.innerHTML = '';
    sources.forEach(src => {
      const div = document.createElement('div');
      div.className = 'card';
      let html = `<b>URL:</b> <a href="${src.url}" target="_blank">${src.url}</a><br><b>Note:</b> ${src.note || ''}<br><b>Context:</b> ${src.context || ''}`;
      if (isAdmin) {
        html += `<br><button data-id="${src._id}" class="btn danger">Delete</button>`;
      }
      div.innerHTML = html;
      if (isAdmin) {
        div.querySelector('button').onclick = async (e) => {
          e.stopPropagation();
          const adminToken = urlParams.get('admin');
          const result = await deleteSource(src._id, adminToken);
          if (result.error) {
            alert(result.error);
            return;
          }
          renderSources();
        };
      }
      div.onclick = () => {
        srcUrl.value = src.url;
        srcNote.value = src.note || '';
        srcContext.value = src.context || '';
        srcId.value = src._id;
      };
      sourcesList.appendChild(div);
    });
  }

  srcCreateBtn.onclick = async () => {
    const adminToken = urlParams.get('admin');
    await createSource({ url: srcUrl.value, note: srcNote.value, context: srcContext.value, adminToken });
    srcUrl.value = '';
    srcNote.value = '';
    srcContext.value = '';
    srcId.value = '';
    renderSources();
  };

  srcUpdateBtn.onclick = async () => {
    if (!srcId.value) return;
    const adminToken = urlParams.get('admin');
    const result = await updateSource(srcId.value, { url: srcUrl.value, note: srcNote.value, context: srcContext.value, adminToken });
    if (result.error) {
      alert(result.error);
      return;
    }
    srcUrl.value = '';
    srcNote.value = '';
    srcContext.value = '';
    srcId.value = '';
    renderSources();
  };

  async function verifyAdminToken() {
    const adminToken = urlParams.get('admin');
    if (!sourcesAdminPanel) return;
    if (!adminToken) {
      sourcesAdminPanel.style.display = 'none';
      isAdmin = false;
      renderSources();
      return;
    }
    // Use GET request to verify admin token (no data created)
    const res = await fetch(`${CONFIG.BACKEND_URL}/api/sources/verify-admin?adminToken=${encodeURIComponent(adminToken)}`);
    const result = await res.json();
    if (result.error && result.error.includes('Invalid admin token')) {
      sourcesAdminPanel.style.display = 'none';
      isAdmin = false;
    } else {
      sourcesAdminPanel.style.display = '';
      isAdmin = true;
    }
    renderSources();
  }

  verifyAdminToken();
}
