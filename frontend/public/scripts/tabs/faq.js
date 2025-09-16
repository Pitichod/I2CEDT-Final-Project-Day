// faq.js - Handles logic for FAQ tab in SPA
// Manages FAQ CRUD operations and UI rendering

import { getFaqs, createFaq, updateFaq, deleteFaq } from '../api.js';
import { CONFIG } from '../config.js';

export function initFaqTab() {
  // Show admin panel only if admin token is verified by backend
  const faqAdminPanel = document.getElementById('faqAdminPanel');
  const urlParams = new URLSearchParams(window.location.search);
  let isAdmin = false;
  async function verifyAdminToken() {
    const adminToken = urlParams.get('admin');
    if (!faqAdminPanel) return;
    if (!adminToken) {
      faqAdminPanel.style.display = 'none';
      isAdmin = false;
      return;
    }
    // Use GET request to verify admin token (no data created)
    const res = await fetch(`${CONFIG.BACKEND_URL}/api/faq/verify-admin?adminToken=${encodeURIComponent(adminToken)}`);
    const result = await res.json();
    if (result.error && result.error.includes('Invalid admin token')) {
      faqAdminPanel.style.display = 'none';
      isAdmin = false;
    } else {
      faqAdminPanel.style.display = '';
      isAdmin = true;
    }
    renderFaqs();
  }
  verifyAdminToken();
  const faqList = document.getElementById('faqList');
  const faqQ = document.getElementById('faqQ');
  const faqA = document.getElementById('faqA');
  const faqId = document.getElementById('faqId');
  const faqCreateBtn = document.getElementById('faqCreateBtn');
  const faqUpdateBtn = document.getElementById('faqUpdateBtn');

  async function renderFaqs() {
    const faqs = await getFaqs();
    faqList.innerHTML = '';
    faqs.forEach(faq => {
      const div = document.createElement('div');
      div.className = 'card';
      // Format answer: preserve tabs and newlines for readability
      const formattedAnswer = faq.answer
        .replace(/\n/g, '<br>')
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
      let html = `<b>Q:</b> ${faq.question}<br><b>A:</b> ${formattedAnswer}`;
      if (isAdmin) {
        html += `<br><button data-id="${faq._id}" class="btn danger">Delete</button>`;
      }
      div.innerHTML = html;
      if (isAdmin) {
        div.querySelector('button').onclick = async (e) => {
          e.stopPropagation();
          const adminToken = urlParams.get('admin');
          const result = await deleteFaq(faq._id, adminToken);
          if (result.error) {
            alert(result.error);
            return;
          }
          renderFaqs();
        };
      }
      div.onclick = () => {
        faqQ.value = faq.question;
        faqA.value = faq.answer;
        faqId.value = faq._id;
      };
      faqList.appendChild(div);
    });
  }


  faqCreateBtn.onclick = async () => {
    const adminToken = urlParams.get('admin');
    await createFaq({ question: faqQ.value, answer: faqA.value, adminToken });
    faqQ.value = '';
    faqA.value = '';
    faqId.value = '';
    renderFaqs();
  };


  faqUpdateBtn.onclick = async () => {
    if (!faqId.value) return;
    const adminToken = urlParams.get('admin');
    const result = await updateFaq(faqId.value, { question: faqQ.value, answer: faqA.value, adminToken });
    if (result.error) {
      alert(result.error);
      return;
    }
    faqQ.value = '';
    faqA.value = '';
    faqId.value = '';
    renderFaqs();
  };

  renderFaqs();
}
