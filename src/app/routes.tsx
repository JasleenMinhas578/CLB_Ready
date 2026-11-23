import { lazy, type ComponentType } from 'react';
import type { RouteParams } from './router';
import { HomeScreen } from '@/features/home/HomeScreen';
import { GoalScreen } from '@/features/goal/GoalScreen';
import { SkillScreen } from '@/features/skill/SkillScreen';
import { TaskScreen } from '@/features/task/TaskScreen';
import { ResultsScreen } from '@/features/results/ResultsScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';

// The lab pulls in the AI libraries, so it loads only when opened.
const LabScreen = lazy(() => import('@/features/lab/LabScreen'));

export interface RouteDef {
  pattern: string;
  component: ComponentType<{ params: RouteParams }>;
  /** `exam` = full-screen, test-style frame with no site header or footer. */
  layout?: 'site' | 'exam';
}

/** Route table. A new screen = one new line here. */
export const ROUTES: readonly RouteDef[] = [
  { pattern: '/', component: HomeScreen },
  { pattern: '/goal', component: GoalScreen },
  { pattern: '/practice/:skillId/:moduleId', component: SkillScreen },
  { pattern: '/task/:moduleId/:taskTypeId', component: TaskScreen, layout: 'exam' },
  { pattern: '/results', component: ResultsScreen },
  { pattern: '/settings', component: SettingsScreen },
  { pattern: '/lab', component: LabScreen },
];
