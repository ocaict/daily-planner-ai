/**
 * Mock data for Stage 1 UI development.
 * Will be replaced by real data services in later stages.
 */

export const mockProgress = {
  completed: 3,
  total: 8,
};

export const mockSchedule = [
  { time: '09:00', title: 'Team standup', completed: true, category: 'Work' },
  { time: '10:30', title: 'Review pull requests', completed: true, category: 'Work' },
  { time: '12:00', title: 'Lunch with Sarah', completed: false, category: 'Personal' },
  { time: '14:00', title: 'Design review', completed: false, category: 'Work' },
  { time: '16:00', title: 'Write documentation', completed: false, category: 'Work' },
];

export const mockOverdue = [
  { title: 'Submit expense report', dueDate: 'Sep 24', priority: 'high' },
  { title: 'Call dentist', dueDate: 'Sep 23', priority: 'medium' },
  { title: 'Renew gym membership', dueDate: 'Sep 22', priority: 'low' },
];

export const mockUpcoming = [
  { title: 'Prepare presentation', dueDate: 'Sep 28', category: 'Work' },
  { title: 'Buy groceries', dueDate: 'Sep 27', category: 'Personal' },
  { title: 'Book flights', dueDate: 'Sep 30', category: 'Travel' },
];

export const mockTasks = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finalize the Q4 project proposal for client review',
    category: 'Work',
    priority: 'high',
    dueDate: '2026-09-26',
    dueTime: '14:00',
    isToday: true,
    isUpcoming: false,
    isOverdue: false,
    completed: false,
    hasReminder: true,
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, vegetables',
    category: 'Personal',
    priority: 'medium',
    dueDate: '2026-09-26',
    dueTime: '18:00',
    isToday: true,
    isUpcoming: false,
    isOverdue: false,
    completed: true,
    hasReminder: false,
  },
  {
    id: '3',
    title: 'Submit expense report',
    description: 'September expenses',
    category: 'Work',
    priority: 'high',
    dueDate: '2026-09-24',
    dueTime: null,
    isToday: false,
    isUpcoming: false,
    isOverdue: true,
    completed: false,
    hasReminder: false,
  },
  {
    id: '4',
    title: 'Call dentist',
    description: 'Schedule cleaning appointment',
    category: 'Health',
    priority: 'medium',
    dueDate: '2026-09-23',
    dueTime: null,
    isToday: false,
    isUpcoming: false,
    isOverdue: true,
    completed: false,
    hasReminder: false,
  },
  {
    id: '5',
    title: 'Prepare presentation',
    description: 'Q4 roadmap slides for Monday meeting',
    category: 'Work',
    priority: 'high',
    dueDate: '2026-09-28',
    dueTime: '09:00',
    isToday: false,
    isUpcoming: true,
    isOverdue: false,
    completed: false,
    hasReminder: true,
  },
  {
    id: '6',
    title: 'Book flights',
    description: 'Round trip to conference',
    category: 'Travel',
    priority: 'low',
    dueDate: '2026-09-30',
    dueTime: null,
    isToday: false,
    isUpcoming: true,
    isOverdue: false,
    completed: false,
    hasReminder: false,
  },
];
