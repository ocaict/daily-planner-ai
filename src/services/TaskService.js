import { Task } from '../models/Task.js';
import { AppError } from '../utils/ErrorHandler.js';
import { getCurrentDate } from '../utils/DateUtils.js';

export default class TaskService {
  constructor(taskRepository, categoryRepository, notificationService = null) {
    this.taskRepository = taskRepository;
    this.categoryRepository = categoryRepository;
    this.notificationService = notificationService;
  }

  async getTasks() {
    try {
      return await this.taskRepository.findAll();
    } catch (error) {
      throw this.#wrapError(error, 'Unable to load tasks. Please try again.', 'TASKS_FETCH_ERROR');
    }
  }

  async getTaskById(id) {
    try {
      return await this.taskRepository.findById(id);
    } catch (error) {
      throw this.#wrapError(error, 'Unable to load task. Please try again.', 'TASK_FETCH_ERROR');
    }
  }

  async createTask(data) {
    const task = new Task(data);
    const validationErrors = task.validate();

    if (validationErrors.length > 0) {
      throw new AppError(
        `Task validation failed: ${validationErrors.join(', ')}`,
        `Please fix the following: ${validationErrors.join(', ')}`,
        'TASK_VALIDATION_ERROR'
      );
    }

    const now = Date.now();
    const newTask = new Task({ ...task, completed: false, createdAt: now, updatedAt: now });

    try {
      const created = await this.taskRepository.create(newTask);
      if (this.notificationService) {
        await this.notificationService.scheduleTaskReminder(created);
      }
      return created;
    } catch (error) {
      throw this.#wrapError(error, 'Unable to create task. Please try again.', 'TASK_CREATE_ERROR');
    }
  }

  async updateTask(id, data) {
    let existing;
    try {
      existing = await this.taskRepository.findById(id);
    } catch (error) {
      throw this.#wrapError(error, 'Unable to load task. Please try again.', 'TASK_FETCH_ERROR');
    }

    if (!existing) {
      throw new AppError(`Task ${id} not found`, 'Task not found.', 'TASK_NOT_FOUND');
    }

    const task = new Task({ ...existing, ...data, id });
    const validationErrors = task.validate();

    if (validationErrors.length > 0) {
      throw new AppError(
        `Task validation failed: ${validationErrors.join(', ')}`,
        `Please fix the following: ${validationErrors.join(', ')}`,
        'TASK_VALIDATION_ERROR'
      );
    }

    const updatedTask = new Task({
      ...task,
      createdAt: existing.createdAt,
      updatedAt: Date.now(),
    });

    try {
      const result = await this.taskRepository.update(updatedTask);
      if (this.notificationService) {
        await this.notificationService.updateTaskReminder(result);
      }
      return result;
    } catch (error) {
      throw this.#wrapError(error, 'Unable to update task. Please try again.', 'TASK_UPDATE_ERROR');
    }
  }

  async deleteTask(id) {
    try {
      await this.taskRepository.delete(id);
      if (this.notificationService) {
        await this.notificationService.cancelTaskReminder(id);
      }
    } catch (error) {
      throw this.#wrapError(error, 'Unable to delete task. Please try again.', 'TASK_DELETE_ERROR');
    }
  }

  async completeTask(id) {
    try {
      const result = await this.taskRepository.completeTask(id);
      if (this.notificationService) {
        await this.notificationService.cancelTaskReminder(id);
      }
      return result;
    } catch (error) {
      throw this.#wrapError(error, 'Unable to complete task. Please try again.', 'TASK_COMPLETE_ERROR');
    }
  }

  async uncompleteTask(id) {
    try {
      const result = await this.taskRepository.uncompleteTask(id);
      if (this.notificationService) {
        const task = await this.taskRepository.findById(id);
        if (task) {
          await this.notificationService.scheduleTaskReminder(task);
        }
      }
      return result;
    } catch (error) {
      throw this.#wrapError(error, 'Unable to update task. Please try again.', 'TASK_UNCOMPLETE_ERROR');
    }
  }

  async toggleTaskComplete(id) {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new AppError(`Task ${id} not found`, 'Task not found.', 'TASK_NOT_FOUND');
    }

    return task.completed ? this.uncompleteTask(id) : this.completeTask(id);
  }

  async searchTasks(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) return [];

    try {
      return await this.taskRepository.search(searchTerm.trim());
    } catch (error) {
      throw this.#wrapError(error, 'Unable to search tasks. Please try again.', 'TASK_SEARCH_ERROR');
    }
  }

  async getTasksByDate(date) {
    try {
      return await this.taskRepository.findByDate(date);
    } catch (error) {
      throw this.#wrapError(error, 'Unable to load tasks for this date.', 'TASKS_BY_DATE_ERROR');
    }
  }

  async getOverdueTasks() {
    try {
      return await this.taskRepository.findOverdue();
    } catch (error) {
      throw this.#wrapError(error, 'Unable to load overdue tasks.', 'OVERDUE_TASKS_ERROR');
    }
  }

  async getCompletedTasks() {
    try {
      return await this.taskRepository.findCompleted();
    } catch (error) {
      throw this.#wrapError(error, 'Unable to load completed tasks.', 'COMPLETED_TASKS_ERROR');
    }
  }

  async getUpcomingTasks() {
    try {
      return await this.taskRepository.findUpcoming();
    } catch (error) {
      throw this.#wrapError(error, 'Unable to load upcoming tasks.', 'UPCOMING_TASKS_ERROR');
    }
  }

  async getTodayTasks() {
    return this.getTasksByDate(getCurrentDate());
  }

  async getTodayProgress() {
    const tasks = await this.getTodayTasks();
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    return { completed, total, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
  }

  async getCategories() {
    try {
      return await this.categoryRepository.findAll();
    } catch (error) {
      throw this.#wrapError(error, 'Unable to load categories.', 'CATEGORIES_FETCH_ERROR');
    }
  }

  #wrapError(error, userMessage, code) {
    if (error instanceof AppError) return error;
    return new AppError(error.message, userMessage, code);
  }
}
