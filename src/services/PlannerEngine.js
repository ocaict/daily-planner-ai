/**
 * PlannerEngine — Deterministic daily scheduling algorithm.
 *
 * Pure logic, no UI, no database, no AI. Takes structured input and produces
 * a proposed daily plan with scheduled items, unscheduled tasks, conflicts,
 * and unused time.
 */

import {
  timeToMinutes,
  minutesToTime,
  getCurrentDate,
} from '../utils/DateUtils.js';

const SCORING_WEIGHTS = Object.freeze({
  priority: { high: 30, medium: 20, low: 10 },
  deadlineBase: 25,
  deadlinePerDay: -5,
  overdue: 40,
  scheduledBonus: 15,
});

const PLANNING_STYLES = Object.freeze({
  balanced: { priorityWeight: 1.0, deadlineWeight: 1.0 },
  priority: { priorityWeight: 1.5, deadlineWeight: 0.5 },
  deadline: { priorityWeight: 0.5, deadlineWeight: 1.5 },
});

export class PlannerEngine {
  /**
   * @param {object} [options]
   * @param {object} [options.weights] - Scoring weights override
   */
  constructor(options = {}) {
    this.weights = options.weights || SCORING_WEIGHTS;
  }

  /**
   * Generate a proposed daily plan.
   * @param {object} input
   * @param {string} input.date - YYYY-MM-DD
   * @param {string} [input.dayStart] - HH:MM
   * @param {string} [input.dayEnd] - HH:MM
   * @param {Array} [input.tasks] - Task objects to schedule
   * @param {Array} [input.existingBlocks] - Existing time blocks
   * @param {object} [input.preferences] - Planning style preferences
   * @returns {object} Proposed daily plan
   */
  generatePlan(input) {
    const {
      date,
      dayStart = '08:00',
      dayEnd = '22:00',
      tasks = [],
      existingBlocks = [],
      preferences = {},
    } = input;

    const style = PLANNING_STYLES[preferences.planningStyle] || PLANNING_STYLES.balanced;
    const dayStartMin = timeToMinutes(dayStart);
    const dayEndMin = timeToMinutes(dayEnd);

    if (dayEndMin <= dayStartMin) {
      return this._emptyPlan(date, 'Day end must be after day start');
    }

    const scheduled = tasks.filter((t) => t.startTime && !t.completed);
    const unscheduled = tasks.filter((t) => !t.startTime && !t.completed);
    const completed = tasks.filter((t) => t.completed);

    const blocks = this._buildBlocks(dayStartMin, dayEndMin, scheduled, existingBlocks);
    const conflicts = this._detectConflicts(scheduled, dayStartMin, dayEndMin);

    const availableSlots = this._computeAvailableSlots(blocks, dayStartMin, dayEndMin);
    const { scheduledItems, remainingSlots, unscheduledTasks } = this._scheduleUnscheduled(
      unscheduled,
      availableSlots,
      remainingSlots => remainingSlots,
      style,
      date
    );

    const allScheduled = [
      ...scheduled.map((t) => ({
        taskId: t.id,
        startTime: t.startTime,
        endTime: minutesToTime(timeToMinutes(t.startTime) + (t.durationMinutes || 30)),
        reason: 'Already scheduled',
        task: t,
      })),
      ...scheduledItems,
    ];

    const totalAvailable = dayEndMin - dayStartMin;
    const usedMinutes = allScheduled.reduce((sum, item) => {
      return sum + (timeToMinutes(item.endTime) - timeToMinutes(item.startTime));
    }, 0);
    const unusedMinutes = Math.max(0, totalAvailable - usedMinutes);

    return {
      date,
      scheduledItems: allScheduled,
      unscheduledTasks,
      conflicts,
      unusedMinutes,
      totalAvailableMinutes: totalAvailable,
      completed,
    };
  }

  /**
   * Score a task for scheduling priority.
   * @param {object} task
   * @param {string} date - YYYY-MM-DD
   * @param {object} style
   * @returns {number}
   */
  scoreTask(task, date, style) {
    let score = 0;

    score += (this.weights.priority[task.priority] || 10) * style.priorityWeight;

    if (task.date === date) {
      score += this.weights.deadlineBase * style.deadlineWeight;
    } else if (task.date && task.date < date) {
      score += this.weights.overdue;
    }

    if (task.startTime) {
      score += this.weights.scheduledBonus;
    }

    return score;
  }

  /**
   * Build time blocks from scheduled tasks and existing blocks.
   * @private
   */
  _buildBlocks(dayStartMin, dayEndMin, scheduledTasks, existingBlocks) {
    const blocks = [];

    for (const task of scheduledTasks) {
      const start = timeToMinutes(task.startTime);
      const duration = task.durationMinutes || 30;
      const end = start + duration;
      blocks.push({ start, end, source: 'scheduled-task', taskId: task.id });
    }

    for (const block of existingBlocks) {
      const start = timeToMinutes(block.startTime);
      const end = timeToMinutes(block.endTime);
      blocks.push({ start, end, source: block.source || 'manual-block' });
    }

    blocks.sort((a, b) => a.start - b.start);

    // Merge overlapping blocks
    const merged = [];
    for (const block of blocks) {
      if (merged.length === 0) {
        merged.push({ ...block });
      } else {
        const last = merged[merged.length - 1];
        if (block.start <= last.end) {
          last.end = Math.max(last.end, block.end);
        } else {
          merged.push({ ...block });
        }
      }
    }

    return merged;
  }

  /**
   * Detect conflicts between scheduled tasks.
   * @private
   */
  _detectConflicts(scheduledTasks, dayStartMin, dayEndMin) {
    const conflicts = [];
    const sorted = [...scheduledTasks].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    for (let i = 0; i < sorted.length; i++) {
      const task = sorted[i];
      const start = timeToMinutes(task.startTime);
      const duration = task.durationMinutes || 30;
      const end = start + duration;

      if (start < dayStartMin) {
        conflicts.push({
          type: 'outside-hours',
          taskId: task.id,
          message: `"${task.title}" starts before planning hours`,
        });
      }
      if (end > dayEndMin) {
        conflicts.push({
          type: 'outside-hours',
          taskId: task.id,
          message: `"${task.title}" ends after planning hours`,
        });
      }

      for (let j = i + 1; j < sorted.length; j++) {
        const other = sorted[j];
        const otherStart = timeToMinutes(other.startTime);
        if (otherStart < end) {
          conflicts.push({
            type: 'overlap',
            taskId: task.id,
            conflictingTaskId: other.id,
            message: `"${task.title}" overlaps with "${other.title}"`,
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * Compute available time slots from blocks.
   * @private
   */
  _computeAvailableSlots(blocks, dayStartMin, dayEndMin) {
    const slots = [];
    let cursor = dayStartMin;

    for (const block of blocks) {
      if (block.start > cursor) {
        slots.push({ start: cursor, end: block.start });
      }
      cursor = Math.max(cursor, block.end);
    }

    if (cursor < dayEndMin) {
      slots.push({ start: cursor, end: dayEndMin });
    }

    return slots;
  }

  /**
   * Schedule unscheduled tasks into available slots.
   * @private
   */
  _scheduleUnscheduled(tasks, availableSlots, _slotFilter, style, date) {
    const sorted = [...tasks].sort(
      (a, b) => this.scoreTask(b, date, style) - this.scoreTask(a, date, style)
    );

    const scheduledItems = [];
    const unscheduledTasks = [];
    let slots = availableSlots.map((s) => ({ ...s }));

    for (const task of sorted) {
      const duration = task.durationMinutes || 30;
      let placed = false;

      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        const slotDuration = slot.end - slot.start;

        if (slotDuration >= duration) {
          const startTime = minutesToTime(slot.start);
          const endTime = minutesToTime(slot.start + duration);

          scheduledItems.push({
            taskId: task.id,
            startTime,
            endTime,
            reason: this._reasonFor(task, date),
            task,
          });

          if (slotDuration === duration) {
            slots.splice(i, 1);
          } else {
            slots[i] = { start: slot.start + duration, end: slot.end };
          }

          placed = true;
          break;
        }
      }

      if (!placed) {
        unscheduledTasks.push(task);
      }
    }

    return { scheduledItems, remainingSlots: slots, unscheduledTasks };
  }

  /**
   * Generate a human-readable reason for scheduling a task.
   * @private
   */
  _reasonFor(task, date) {
    const reasons = [];

    if (task.date && task.date < date) {
      reasons.push('Overdue');
    } else if (task.date === date) {
      reasons.push('Due today');
    }

    if (task.priority === 'high') {
      reasons.push('High priority');
    } else if (task.priority === 'medium') {
      reasons.push('Medium priority');
    }

    return reasons.length > 0 ? reasons.join(' and ') : 'Fits available time';
  }

  /**
   * Return an empty plan with a reason.
   * @private
   */
  _emptyPlan(date, reason) {
    return {
      date,
      scheduledItems: [],
      unscheduledTasks: [],
      conflicts: [],
      unusedMinutes: 0,
      totalAvailableMinutes: 0,
      completed: [],
      reason,
    };
  }
}

export default PlannerEngine;
