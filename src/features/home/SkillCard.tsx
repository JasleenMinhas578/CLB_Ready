import type { Skill } from '@/domain/skills';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import { href } from '@/app/router';
import { Icon } from '@/components/Icon';
import type { NextTask } from '@/services/progress/progress';

/** One skill on the home page: what you do in it, and a link to the module where its next task is. */
export function SkillCard({ skill, next }: { skill: Skill; next: NextTask }) {
  const count = getTaskTypesForSkill(skill.id).length;
  const unit = skill.id === 'reading' || skill.id === 'listening' ? 'parts' : 'tasks';
  return (
    <a className={`skill-card skill-${skill.id}`} href={href(`/practice/${skill.id}/${next.moduleId}`)}>
      <span className="skill-badge"><Icon name={skill.id} size="lg" /></span>
      <span className="skill-text">
        <strong>{skill.name}</strong>
        <span>{skill.blurb}</span>
        <small>{count} {unit} in each module</small>
      </span>
      <Icon name="arrow-right" />
    </a>
  );
}
