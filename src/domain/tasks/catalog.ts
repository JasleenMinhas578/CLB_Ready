import type { SkillId } from '../skills';
import type { TaskType } from './types';

/**
 * The 10 CELPIP-style task types.
 * TODO(before launch): confirm every timing against CELPIP's free official
 * sample test. Tasks 2 and 3 are confirmed by public prep sites.
 */
export const TASK_TYPES: readonly TaskType[] = [
  {
    id: 'speaking-1', skill: 'speaking', order: 1, needsImage: false,
    title: 'Giving advice',
    summary: 'Give practical advice to someone facing a choice or problem.',
    timing: { prepSeconds: 30, answerSeconds: 90 },
  },
  {
    id: 'speaking-2', skill: 'speaking', order: 2, needsImage: false,
    title: 'Talking about a personal experience',
    summary: 'Tell a short story about something that happened to you.',
    timing: { prepSeconds: 30, answerSeconds: 60 },
  },
  {
    id: 'speaking-3', skill: 'speaking', order: 3, needsImage: true,
    title: 'Describing a scene',
    summary: 'Describe a picture to someone who cannot see it.',
    timing: { prepSeconds: 30, answerSeconds: 60 },
  },
  {
    id: 'speaking-4', skill: 'speaking', order: 4, needsImage: true,
    sharesImageWith: 'speaking-3',
    title: 'Making predictions',
    summary: 'Say what will probably happen next in the same picture.',
    timing: { prepSeconds: 30, answerSeconds: 60 },
  },
  {
    id: 'speaking-5', skill: 'speaking', order: 5, needsImage: true,
    title: 'Comparing and persuading',
    summary: 'Choose one of two options and persuade someone it is better.',
    timing: { selectSeconds: 60, prepSeconds: 60, answerSeconds: 60 },
  },
  {
    id: 'speaking-6', skill: 'speaking', order: 6, needsImage: false,
    title: 'Dealing with a difficult situation',
    summary: 'Pick a hard choice and explain it politely to the person involved.',
    timing: { prepSeconds: 60, answerSeconds: 60 },
  },
  {
    id: 'speaking-7', skill: 'speaking', order: 7, needsImage: false,
    title: 'Expressing opinions',
    summary: 'Give your opinion on a topic and support it with reasons.',
    timing: { prepSeconds: 30, answerSeconds: 90 },
  },
  {
    id: 'speaking-8', skill: 'speaking', order: 8, needsImage: true,
    title: 'Describing an unusual situation',
    summary: 'Describe something strange in a picture to someone on the phone.',
    timing: { prepSeconds: 30, answerSeconds: 60 },
  },
  {
    id: 'writing-1', skill: 'writing', order: 1, needsImage: false,
    title: 'Writing an email',
    summary: 'Write an email that covers every point asked, in the right tone.',
    timing: { minutes: 27 }, wordRange: { min: 150, max: 200 },
  },
  {
    id: 'writing-2', skill: 'writing', order: 2, needsImage: false,
    title: 'Responding to survey questions',
    summary: 'Pick one of two options and support your choice with reasons.',
    timing: { minutes: 26 }, wordRange: { min: 150, max: 200 },
  },
];

export function getTaskType(id: string): TaskType | undefined {
  return TASK_TYPES.find((task) => task.id === id);
}

export function getTaskTypesForSkill(skill: SkillId): TaskType[] {
  return TASK_TYPES.filter((task) => task.skill === skill).sort((a, b) => a.order - b.order);
}
