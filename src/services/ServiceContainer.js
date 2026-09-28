/**
 * Service Container - Dependency injection for services.
 * Creates and wires together repositories and services.
 */

import { databaseManager } from '../database/DatabaseManager.js';
import { migrateToLatest } from '../database/MigrationRunner.js';
import migrations from '../database/migrations/index.js';
import TaskRepository from '../repositories/TaskRepository.js';
import CategoryRepository from '../repositories/CategoryRepository.js';
import TaskService from './TaskService.js';
import CategoryService from './CategoryService.js';
import { mockTasks } from '../data/mockData.js';

class ServiceContainer {
  constructor() {
    this._initialized = false;
    this._taskRepository = null;
    this._categoryRepository = null;
    this._taskService = null;
    this._categoryService = null;
    this._dbAvailable = false;
  }

  async initialize() {
    if (this._initialized) return;

    try {
      await databaseManager.initialize();
      const connection = databaseManager.getConnection();

      await migrateToLatest(migrations, connection);

      this._taskRepository = new TaskRepository(connection);
      this._categoryRepository = new CategoryRepository(connection);

      this._taskService = new TaskService(this._taskRepository, this._categoryRepository);
      this._categoryService = new CategoryService(this._categoryRepository);
      this._dbAvailable = true;

      this._initialized = true;
      console.log('[ServiceContainer] Database services initialized');
      return;
    } catch (error) {
      console.warn('[ServiceContainer] Falling back to mock data mode:', error.message);

      this._taskService = {
        async getTasks() {
          return mockTasks;
        },
        async getTaskById(id) {
          return mockTasks.find((task) => String(task.id) === String(id)) || null;
        },
        async getTodayTasks() {
          return mockTasks.filter((task) => task.isToday);
        },
        async getUpcomingTasks() {
          return mockTasks.filter((task) => task.isUpcoming);
        },
        async getOverdueTasks() {
          return mockTasks.filter((task) => task.isOverdue);
        },
        async getCompletedTasks() {
          return mockTasks.filter((task) => task.completed);
        },
        async getTodayProgress() {
          return { completed: 3, total: 8 };
        },
        async createTask(data) {
          return { ...data, id: Date.now() };
        },
        async updateTask(id, data) {
          return { id, ...data };
        },
        async deleteTask() {},
        async toggleTaskComplete(id) {
          return id;
        },
        async searchTasks(searchTerm) {
          const term = String(searchTerm || '').toLowerCase();
          return mockTasks.filter((task) => task.title.toLowerCase().includes(term));
        },
      };

      this._categoryService = {
        async getCategories() {
          return [
            { id: 1, name: 'Work', color: '#4A90D9', icon: 'briefcase' },
            { id: 2, name: 'Personal', color: '#7B61FF', icon: 'person' },
            { id: 3, name: 'Health', color: '#2ECC71', icon: 'heart' },
          ];
        },
      };

      this._dbAvailable = false;
      this._initialized = true;
    }
  }

  get taskService() {
    return this._taskService;
  }

  get categoryService() {
    return this._categoryService;
  }

  get taskRepository() {
    if (!this._initialized) {
      throw new Error('ServiceContainer not initialized. Call initialize() first.');
    }
    return this._taskRepository;
  }

  get categoryRepository() {
    if (!this._initialized) {
      throw new Error('ServiceContainer not initialized. Call initialize() first.');
    }
    return this._categoryRepository;
  }

  get dbAvailable() {
    return this._dbAvailable;
  }
}

export const serviceContainer = new ServiceContainer();
export { ServiceContainer };
