import { lazy, type ComponentType } from 'react';
import type { RouteParams } from './router';
import { HomeScreen } from '@/features/home/HomeScreen';
import { GoalScreen } from '@/features/goal/GoalScreen';
import { SkillScreen } from '@/features/skill/SkillScreen';
import { TaskScreen } from '@/features/task/TaskScreen';
import { ResultsScreen } from '@/features/results/ResultsScreen';

// The lab pulls in the AI libraries, so it loads only when opened.
const LabScreen = lazy(() => import('@/features/lab/LabScreen'));

export interface RouteDef {
  pattern: string;
  component: ComponentType<{ params: RouteParams }>;
}

/** Route table. A new screen = one new line here. */
export const ROUTES: readonly RouteDef[] = [
  { pattern: '/', component: HomeScreen },
  { pattern: '/goal', component: GoalScreen },
  { pattern: '/practice/:skillId/:moduleId', component: SkillScreen },
  { pattern: '/task/:moduleId/:taskTypeId', component: TaskScreen },
  { pattern: '/results/sample', component: ResultsScreen },
  { pattern: '/lab', component: LabScreen },
];
