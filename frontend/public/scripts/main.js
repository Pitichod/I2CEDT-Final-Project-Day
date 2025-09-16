// main.js - Entry point for SPA frontend logic
// Handles tab switching, mode toggle, and imports tab modules

import { initChatTab } from './tabs/chat.js';
import { initFaqTab } from './tabs/faq.js';
import { initSourcesTab } from './tabs/sources.js';
import { initFeedbackTab } from './tabs/feedback.js';
import { initAboutTab } from './tabs/about.js';

document.addEventListener('DOMContentLoaded', function () {
	// Tab switching
	const tabs = document.querySelectorAll('.tab');
	const views = document.querySelectorAll('.view');
	const tabInitMap = {
		chat: initChatTab,
		faq: initFaqTab,
		sources: initSourcesTab,
		feedback: initFeedbackTab,
		about: initAboutTab,
	};
	tabs.forEach(tab => {
		tab.addEventListener('click', function () {
			tabs.forEach(t => t.classList.remove('active'));
			views.forEach(v => v.classList.remove('active'));
			tab.classList.add('active');
			const target = tab.getAttribute('data-target');
			const view = document.getElementById(target);
			if (view) view.classList.add('active');
			// Call tab-specific init if exists
			if (tabInitMap[target]) tabInitMap[target]();
		});
	});

		// Mode toggle (light/dark) with smooth transition and icon switch
		const modeToggle = document.getElementById('modeToggle');
			// Toggle .light for light mode, default is dark
			const setModeIcon = () => {
				if (document.body.classList.contains('light')) {
					modeToggle.textContent = '☀️'; // sun for light mode
				} else {
					modeToggle.textContent = '🌙'; // moon for dark mode
				}
			};
			document.body.style.transition = 'background 0.4s, color 0.4s';
			modeToggle.addEventListener('click', function () {
				document.body.classList.toggle('light');
				setModeIcon();
				if (document.body.classList.contains('light')) {
					localStorage.setItem('mode', 'light');
				} else {
					localStorage.setItem('mode', 'dark');
				}
			});
			// Default to dark, switch to light if saved
			if (localStorage.getItem('mode') === 'light') {
				document.body.classList.add('light');
			} else {
				document.body.classList.remove('light');
			}
			setModeIcon();

	// Initialize default tab
	tabInitMap['chat']();
});
