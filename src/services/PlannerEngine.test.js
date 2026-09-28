/**
 * Unit tests for PlannerEngine.
 * Run with: node --test
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { PlannerEngine } from './PlannerEngine.js';

describe('PlannerEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new PlannerEngine();
  });

  describe('generatePlan', () => {
    it('returns an empty plan for a day with no tasks', () => {
      const plan = engine.generatePlan({
        date: '2026-09-28',
        dayStart: '08:00',
        dayEnd: '17:00',
        tasks: [],
      });

      assert.equal(plan.date, '2026-09-28');
      assert.equal(plan.scheduledItems.length, 0);
      assert.equal(plan.unscheduledTasks.length, 0);
      assert.equal(plan.conflicts.length, 0);
      assert.equal(plan.unusedMinutes, 540);
    });

    it('schedules unscheduled tasks into available slots', () => {
      const plan = engine.generatePlan({
        date: '2026-09-28',
        dayStart: '08:00',
        dayEnd: '17:00',
        tasks: [
          { id: 1, title: 'Task A', durationMinutes: 60, priority: 'high', date: '2026-09-28' },
          { id: 2, title: 'Task B', durationMinutes: 30, priority: 'medium', date: '2026-09-28' },
        ],
      });

      assert.equal(plan.scheduledItems.length, 2);
      assert.equal(plan.unscheduledTasks.length, 0);
      assert.ok(plan.unusedMinutes < 540);
    });

    it('preserves existing scheduled tasks', () => {
      const plan = engine.generatePlan({
        date: '2026-09-28',
        dayStart: '08:00',
        dayEnd: '17:00',
        tasks: [
          { id: 1, title: 'Meeting', startTime: '10:00', durationMinutes: 60, priority: 'high', date: '2026-09-28' },
          { id: 2, title: 'Task A', durationMinutes: 30, priority: 'medium', date: '2026-09-28' },
        ],
      });

      const meeting = plan.scheduledItems.find((i) => i.taskId === 1);
      assert.equal(meeting.startTime, '10:00');
      assert.equal(meeting.endTime, '11:00');
    });

    it('detects overlapping tasks', () => {
      const plan = engine.generatePlan({
        date: '2026-09-28',
        dayStart: '08:00',
        dayEnd: '17:00',
        tasks: [
          { id: 1, title: 'Task A', startTime: '10:00', durationMinutes: 60, priority: 'high', date: '2026-09-28' },
          { id: 2, title: 'Task B', startTime: '10:30', durationMinutes: 60, priority: 'high', date: '2026-09-28' },
        ],
      });

      assert.ok(plan.conflicts.length > 0);
      assert.equal(plan.conflicts[0].type, 'overlap');
    });

    it('detects tasks outside planning hours', () => {
      const plan = engine.generatePlan({
        date: '2026-09-28',
        dayStart: '08:00',
        dayEnd: '17:00',
        tasks: [
          { id: 1, title: 'Early task', startTime: '06:00', durationMinutes: 60, priority: 'high', date: '2026-09-28' },
        ],
      });

      assert.ok(plan.conflicts.length > 0);
      assert.equal(plan.conflicts[0].type, 'outside-hours');
    });

    it('marks overdue tasks', () => {
      const plan = engine.generatePlan({
        date: '2026-09-28',
        dayStart: '08:00',
        dayEnd: '17:00',
        tasks: [
          { id: 1, title: 'Overdue', durationMinutes: 30, priority: 'high', date: '2026-09-20' },
        ],
      });

      assert.equal(plan.scheduledItems.length, 1);
      assert.ok(plan.scheduledItems[0].reason.includes('Overdue'));
    });

    it('does not schedule completed tasks', () => {
      const plan = engine.generatePlan({
        date: '2026-09-28',
        dayStart: '08:00',
        dayEnd: '17:00',
        tasks: [
          { id: 1, title: 'Done', durationMinutes: 30, priority: 'high', date: '2026-09-28', completed: true },
        ],
      });

      assert.equal(plan.scheduledItems.length, 0);
      assert.equal(plan.completed.length, 1);
    });

    it('returns unscheduled tasks when no time available', () => {
      const plan = engine.generatePlan({
        date: '2026-09-28',
        dayStart: '08:00',
        dayEnd: '09:00',
        tasks: [
          { id: 1, title: 'Task A', durationMinutes: 120, priority: 'high', date: '2026-09-28' },
        ],
      });

      assert.equal(plan.scheduledItems.length, 0);
      assert.equal(plan.unscheduledTasks.length, 1);
    });

    it('handles invalid day start/end', () => {
      const plan = engine.generatePlan({
        date: '2026-09-28',
        dayStart: '17:00',
        dayEnd: '08:00',
        tasks: [],
      });

      assert.ok(plan.reason);
    });
  });

  describe('scoreTask', () => {
    it('scores high priority higher than low', () => {
      const high = engine.scoreTask({ priority: 'high' }, '2026-09-28', { priorityWeight: 1, deadlineWeight: 1 });
      const low = engine.scoreTask({ priority: 'low' }, '2026-09-28', { priorityWeight: 1, deadlineWeight: 1 });
      assert.ok(high > low);
    });

    it('scores due-today higher than future', () => {
      const today = engine.scoreTask({ priority: 'medium', date: '2026-09-28' }, '2026-09-28', { priorityWeight: 1, deadlineWeight: 1 });
      const future = engine.scoreTask({ priority: 'medium', date: '2026-10-05' }, '2026-09-28', { priorityWeight: 1, deadlineWeight: 1 });
      assert.ok(today > future);
    });

    it('scores overdue higher than future', () => {
      const overdue = engine.scoreTask({ priority: 'medium', date: '2026-09-20' }, '2026-09-28', { priorityWeight: 1, deadlineWeight: 1 });
      const future = engine.scoreTask({ priority: 'medium', date: '2026-10-05' }, '2026-09-28', { priorityWeight: 1, deadlineWeight: 1 });
      assert.ok(overdue > future);
    });
  });
});
