// feedback.js - Handles logic for Feedback tab in SPA
// Manages feedback submission, star rating, and UI rendering

import { getFeedback, createFeedback, updateFeedback, deleteFeedback } from '../api.js';

export function initFeedbackTab() {
  const feedbackList = document.getElementById('feedbackList');
  const fbName = document.getElementById('fbName');
  const fbComment = document.getElementById('fbComment');
  const fbSend = document.getElementById('fbSend');
  const stars = document.getElementById('stars');
  let selectedStars = 0;

  async function renderFeedback() {
    const feedbacks = await getFeedback();
    feedbackList.innerHTML = '';
    // Get current userId
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', userId);
    }
    // My Feedback panel
    const myFeedbacks = feedbacks.filter(fb => fb.userId === userId);
    if (myFeedbacks.length) {
      const myPanel = document.createElement('div');
      myPanel.className = 'my-feedback-panel';
      myPanel.innerHTML = '<h3>My Feedback</h3>';
      myFeedbacks.forEach(fb => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<b>${fb.name || 'Anonymous'}</b> <span>(${fb.stars}★)</span><br><textarea class="my-fb-edit" rows="2">${fb.comment}</textarea><br>` +
          `<button class="my-fb-update" style="display:none">Update</button> <button class="my-fb-delete">Delete</button>`;
        const editBox = div.querySelector('.my-fb-edit');
        const updateBtn = div.querySelector('.my-fb-update');
        // Show update button only if changed
        editBox.addEventListener('input', () => {
          if (editBox.value !== fb.comment) {
            updateBtn.style.display = '';
          } else {
            updateBtn.style.display = 'none';
          }
        });
        // Update button
        updateBtn.onclick = async () => {
          const newComment = editBox.value;
          const result = await updateFeedback(fb._id, { name: fb.name, comment: newComment, stars: fb.stars, userId });
          if (result.error) alert(result.error);
          renderFeedback();
        };
        // Delete button
        div.querySelector('.my-fb-delete').onclick = async () => {
          if (!confirm('Delete your feedback?')) return;
          const result = await deleteFeedback(fb._id, { userId });
          if (result.error) alert(result.error);
          renderFeedback();
        };
        myPanel.appendChild(div);
      });
      feedbackList.appendChild(myPanel);
    }
    // Recent Feedback panel (carousel for 5 most recent feedbacks)
    const recentPanel = document.createElement('div');
    recentPanel.className = 'recent-feedback-panel';
    recentPanel.innerHTML = '<h3>Recent Feedback</h3>';
    // Sort feedbacks by createdAt descending (excluding user's own)
    const others = feedbacks.filter(fb => fb.userId !== userId);
    const sorted = others.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    let carouselIndex = 0;
    function renderCarousel() {
      // Remove old cards
      recentPanel.querySelectorAll('.card').forEach(card => card.remove());
      // Show 5 feedbacks starting from carouselIndex
      const visible = sorted.slice(carouselIndex, carouselIndex + 5);
      visible.forEach(fb => {
        const div = document.createElement('div');
        div.className = 'card';
        // Format * and ** in comment as HTML
        let formattedComment = fb.comment
          // Bold: **text**
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          // List: * text (at line start)
          .replace(/(^|\n)\* (.+)/g, '$1<li>$2</li>');
        // Wrap lists in <ul> if any <li>
        if (formattedComment.includes('<li>')) {
          formattedComment = '<ul style="margin:8px 0 0 18px;">' + formattedComment + '</ul>';
        }
        div.innerHTML = `<b>${fb.name || 'Anonymous'}</b> <span>(${fb.stars}★)</span><br>${formattedComment}`;
        recentPanel.appendChild(div);
      });
    }
    renderCarousel();
    // Add carousel controls and auto-advance if more than 5 feedbacks
    let autoCarouselTimer;
    function renderCarouselSmooth() {
      const cards = recentPanel.querySelectorAll('.card');
      cards.forEach(card => {
        card.style.transition = 'opacity 0.3s';
        card.style.opacity = '0';
      });
      setTimeout(() => {
        renderCarousel();
        const newCards = recentPanel.querySelectorAll('.card');
        newCards.forEach(card => {
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s';
            card.style.opacity = '1';
          }, 10);
        });
      }, 300);
    }
    if (sorted.length > 5) {
      const controls = document.createElement('div');
      controls.className = 'carousel-controls';
      const prevBtn = document.createElement('button');
      prevBtn.textContent = '←';
      prevBtn.onclick = () => {
        if (carouselIndex > 0) {
          carouselIndex--;
          renderCarouselSmooth();
          resetAutoCarousel();
        }
      };
      const nextBtn = document.createElement('button');
      nextBtn.textContent = '→';
      nextBtn.onclick = () => {
        if (carouselIndex < sorted.length - 5) {
          carouselIndex++;
          renderCarouselSmooth();
          resetAutoCarousel();
        }
      };
      controls.appendChild(prevBtn);
      controls.appendChild(nextBtn);
      recentPanel.appendChild(controls);
      // Auto-advance every 10 seconds
      function autoCarousel() {
        if (carouselIndex < sorted.length - 5) {
          carouselIndex++;
        } else {
          carouselIndex = 0;
        }
        renderCarouselSmooth();
      }
      function resetAutoCarousel() {
        if (autoCarouselTimer) clearInterval(autoCarouselTimer);
        autoCarouselTimer = setInterval(autoCarousel, 10000);
      }
      resetAutoCarousel();
    }
    feedbackList.appendChild(recentPanel);
  }

  // Star rating
  Array.from(stars.children).forEach(star => {
    star.onclick = () => {
      selectedStars = parseInt(star.getAttribute('data-val'));
      Array.from(stars.children).forEach(s => s.classList.remove('active'));
      for (let i = 0; i < selectedStars; i++) stars.children[i].classList.add('active');
    };
  });

  fbSend.onclick = async () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', userId);
    }
    if (!fbComment.value) return;
    if (!selectedStars) {
      alert('Please select a star rating before submitting feedback.');
      return;
    }
    await createFeedback({ name: fbName.value, comment: fbComment.value, stars: selectedStars, userId });
    fbName.value = '';
    fbComment.value = '';
    Array.from(stars.children).forEach(s => s.classList.remove('active'));
    selectedStars = 0;
    renderFeedback();
  };

  renderFeedback();
}
