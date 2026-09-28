/**
 * TabBar — Bottom navigation for the app (plain HTML, no ion-tabs dependency)
 * Uses inline SVG icons to avoid the ion-icon SVG loading issue on Android.
 */

const ICONS = {
  today: `<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="48" y="80" width="416" height="384" rx="48" stroke="currentColor" stroke-width="32" fill="none"/>
    <circle cx="296" cy="232" r="24" fill="currentColor"/>
    <circle cx="376" cy="232" r="24" fill="currentColor"/>
    <circle cx="296" cy="312" r="24" fill="currentColor"/>
    <circle cx="216" cy="312" r="24" fill="currentColor"/>
    <circle cx="376" cy="312" r="24" fill="currentColor"/>
    <circle cx="216" cy="392" r="24" fill="currentColor"/>
    <circle cx="296" cy="392" r="24" fill="currentColor"/>
    <line x1="128" y1="48" x2="128" y2="128" stroke="currentColor" stroke-width="32" stroke-linecap="round"/>
    <line x1="384" y1="48" x2="384" y2="128" stroke="currentColor" stroke-width="32" stroke-linecap="round"/>
    <line x1="48" y1="160" x2="464" y2="160" stroke="currentColor" stroke-width="32"/>
  </svg>`,

  tasks: `<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="176 176 272 272 480 64" stroke="currentColor" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M416 224v224a48 48 0 01-48 48H80a48 48 0 01-48-48V144a48 48 0 0148-48h248" stroke="currentColor" stroke-width="32" stroke-linecap="round" fill="none"/>
  </svg>`,

  calendar: `<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="48" y="80" width="416" height="384" rx="48" stroke="currentColor" stroke-width="32" fill="none"/>
    <line x1="128" y1="48" x2="128" y2="128" stroke="currentColor" stroke-width="32" stroke-linecap="round"/>
    <line x1="384" y1="48" x2="384" y2="128" stroke="currentColor" stroke-width="32" stroke-linecap="round"/>
    <line x1="48" y1="160" x2="464" y2="160" stroke="currentColor" stroke-width="32"/>
    <rect x="120" y="216" width="72" height="72" rx="8" fill="currentColor" opacity="0.4"/>
    <rect x="216" y="216" width="72" height="72" rx="8" fill="currentColor" opacity="0.4"/>
    <rect x="312" y="216" width="72" height="72" rx="8" fill="currentColor"/>
  </svg>`,

  ai: `<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M259.92 262.91L216.4 149.77a9 9 0 00-16.8 0L156.08 262.91a9 9 0 01-5.17 5.17L37.77 311.6a9 9 0 000 16.8l113.14 43.52a9 9 0 015.17 5.17l43.52 113.14a9 9 0 0016.8 0l43.52-113.14a9 9 0 015.17-5.17l113.14-43.52a9 9 0 000-16.8l-113.14-43.52a9 9 0 01-5.17-5.17z" stroke="currentColor" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M399 66a9 9 0 00-16.8 0l-20.55 53.3a9 9 0 01-5.17 5.17L302.77 145a9 9 0 000 16.8l54.71 21.08a9 9 0 015.17 5.17L383.2 242a9 9 0 0016.8 0l20.55-53.3a9 9 0 015.17-5.17L481.23 162a9 9 0 000-16.8l-54.71-21.08a9 9 0 01-5.17-5.17z" stroke="currentColor" stroke-width="28" fill="none"/>
  </svg>`,

  settings: `<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.1 16.1 0 0015.16-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z" stroke="currentColor" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,
};

export function renderTabBar() {
  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'ai', label: 'AI' },
    { id: 'settings', label: 'Settings' },
  ];

  const buttons = tabs.map((t) => `
    <button class="app-tab-btn" role="tab" data-tab="${t.id}" aria-label="${t.label}" id="tab-btn-${t.id}">
      <span class="app-tab-icon">${ICONS[t.id]}</span>
      <span class="app-tab-label">${t.label}</span>
    </button>
  `).join('');

  return `<nav class="app-tab-bar" role="tablist" aria-label="Main navigation">${buttons}</nav>`;
}

export default renderTabBar;
