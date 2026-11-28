/**
 * CLB targets a learner can aim for. Labels follow CELPIP's published
 * level descriptors (7 adequate, 8 good, 9 effective, 10 highly effective,
 * 11 and 12 advanced proficiency).
 */
export type ClbGoal = 7 | 8 | 9 | 10 | 11 | 12;

export interface GoalOption {
  level: ClbGoal;
  label: string;
  hint: string;
}

export const GOAL_OPTIONS: readonly GoalOption[] = [
  { level: 7, label: 'Adequate', hint: 'A common target for Express Entry' },
  { level: 8, label: 'Good', hint: 'Clear, organized answers with some range' },
  { level: 9, label: 'Effective', hint: 'Precise words and well-developed ideas' },
  { level: 10, label: 'Highly effective', hint: 'Fluent, detailed and natural' },
  { level: 11, label: 'Advanced', hint: 'Rich vocabulary and very few errors' },
  { level: 12, label: 'Advanced', hint: 'The top level: near-expert control' },
];
