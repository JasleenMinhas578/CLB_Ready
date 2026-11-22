/**
 * CLB targets a learner can aim for. Labels follow CELPIP's published
 * level descriptors (7 adequate, 8 good, 9 effective, 10 highly effective).
 */
export type ClbGoal = 7 | 8 | 9 | 10;

export interface GoalOption {
  level: ClbGoal;
  label: string;
  hint: string;
}

export const GOAL_OPTIONS: readonly GoalOption[] = [
  { level: 7, label: 'Adequate', hint: 'A common target for Express Entry' },
  { level: 8, label: 'Good', hint: 'Clear, organized answers with some range' },
  { level: 9, label: 'Effective', hint: 'Precise words and well-developed ideas' },
  { level: 10, label: 'Highly effective', hint: 'Near-expert control and detail' },
];

export function isClbGoal(value: number): value is ClbGoal {
  return GOAL_OPTIONS.some((option) => option.level === value);
}
