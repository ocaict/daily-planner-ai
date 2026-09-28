/**
 * Daily Planner AI — Application Entry Point (Stage 2)
 *
 * Handles routing, page rendering, tab navigation, theme initialization,
 * and database/service wiring.
 */

import '@ionic/core/css/ionic.bundle.css';
import { defineCustomElements } from '@ionic/core/loader';
import { getConfig } from './config/AppConfig.js';
import { handleError } from './utils/ErrorHandler.js';
import { themeManager } from './utils/ThemeManager.js';
import { serviceContainer } from './services/ServiceContainer.js';
import { TodayPage } from './pages/TodayPage.js';
import { TasksPage } from './pages/TasksPage.js';
import { CalendarPage } from './pages/CalendarPage.js';
import { AIPage } from './pages/AIPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { renderTabBar } from './components/TabBar.js';

// Register Ionic web components
defineCustomElements();

class App {
  constructor() {
    this.initialized = false;
    this.config = null;
    this.currentPage = null;
    this.currentPageName = '';

    // Route definitions
    this.routes = {
      '/': { page: TodayPage, name: 'today', title: 'Today' },
      '/tasks': { page: TasksPage, name: 'tasks', title: 'Tasks' },
      '/calendar': { page: CalendarPage, name: 'calendar', title: 'Calendar' },
      '/ai': { page: AIPage, name: 'ai', title: 'AI Assistant' },
      '/settings': { page: SettingsPage, name: 'settings', title: 'Settings' }
    };
  }

  async initialize() {
    try {
      // Load configuration
      this.config = getConfig();
      console.log(`[App] Environment: ${this.config.environment}`);

      // Initialize theme
      themeManager.init();

      // Initialize database and services
      this.servicesReady = false;
      try {
        await serviceContainer.initialize();
        this.servicesReady = true;
      } catch (dbError) {
        console.warn('[App] Database unavailable:', dbError.message);
        this._showErrorScreen('Database initialization failed. Please restart the app.');
        return;
      }

      // Set up tab bar
      this.renderTabBar();

      // Set up navigation
      this.setupNavigation();

      // Handle initial route
      this.handleRoute(window.location.pathname);

      // Listen for browser back/forward
      window.addEventListener('popstate', () => {
        this.handleRoute(window.location.pathname);
      });

      this.initialized = true;
      console.log('[App] Stage 2 initialized');
    } catch (error) {
      handleError(error, 'App initialization');
      throw error;
    }
  }

  renderTabBar() {
    const slot = document.getElementById('tab-bar-slot');
    if (slot) {
      slot.innerHTML = renderTabBar();
    }
  }

  setupNavigation() {
    // Intercept clicks on links with data-nav attribute
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-nav]');
      if (link) {
        e.preventDefault();
        const path = link.getAttribute('href');
        this.navigate(path);
      }
    });

    // Handle tab button clicks
    document.addEventListener('click', (e) => {
      const tabButton = e.target.closest('.app-tab-btn');
      if (tabButton) {
        const tab = tabButton.getAttribute('data-tab');
        const routeMap = {
          today: '/',
          tasks: '/tasks',
          calendar: '/calendar',
          ai: '/ai',
          settings: '/settings'
        };
        if (routeMap[tab]) {
          e.preventDefault();
          this.navigate(routeMap[tab]);
        }
      }
    });
  }

  navigate(path) {
    if (path === window.location.pathname) return;

    window.history.pushState({}, '', path);
    this.handleRoute(path);
  }

  handleRoute(path) {
    if (path === '') path = '/';

    const route = this.routes[path] || this.routes['/'];

    this.updateActiveTab(route.name);
    this.renderPage(route);
  }

  updateActiveTab(activeName) {
    const tabButtons = document.querySelectorAll('.app-tab-btn');
    tabButtons.forEach((btn) => {
      const tab = btn.getAttribute('data-tab');
      if (tab === activeName) {
        btn.classList.add('tab-active');
      } else {
        btn.classList.remove('tab-active');
      }
    });
  }

  renderPage(route) {
    const container = document.getElementById('app-content');
    if (!container) return;

    // Clean up previous page
    if (this.currentPage && this.currentPage.destroy) {
      this.currentPage.destroy();
    }

    // Create new page instance with services
    const pageInstance = new route.page(
      this.taskService,
      this.categoryService,
      this.plannerService,
      this.settingsService
    );
    this.currentPage = pageInstance;
    this.currentPageName = route.name;

    // Render page HTML
    container.innerHTML = pageInstance.render();

    // Run post-render hook
    if (pageInstance.afterRender) {
      pageInstance.afterRender(container);
    }

    // Scroll to top on page change
    window.scrollTo(0, 0);
  }

  get taskService() {
    return serviceContainer.taskService;
  }

  get categoryService() {
    return serviceContainer.categoryService;
  }

  get plannerService() {
    return serviceContainer.plannerService;
  }

  get settingsService() {
    return serviceContainer.settingsService;
  }

  _showErrorScreen(message) {
    const container = document.getElementById('app-content');
    if (!container) return;
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;padding:2rem;text-align:center;font-family:system-ui,sans-serif;">
        <div style="font-size:3rem;margin-bottom:1rem;">⚠️</div>
        <h2 style="margin:0 0 0.5rem;">Initialization Failed</h2>
        <p style="color:#666;max-width:400px;">${message}</p>
        <button onclick="location.reload()" style="margin-top:1rem;padding:0.5rem 1.5rem;border:1px solid #ccc;border-radius:4px;background:#f5f5f5;cursor:pointer;">Retry</button>
      </div>
    `;
  }
}

// Bootstrap
const app = new App();
app.initialize().catch((err) => {
  console.error('[App] Failed to initialize:', err);
});

// Expose for debugging
window.app = app;

export { app };
