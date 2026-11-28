import type { Skill } from '@/domain/skills';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import { href } from '@/app/router';
import { Icon } from '@/components/Icon';

interface SkillCardProps {
  skill: Skill;
  moduleId: string;
}

/**
 * One candy-coloured skill card. Coming-soon skills render frosted and
 * greyed, are not links, and are announced as unavailable.
 */
export function SkillCard({ skill, moduleId }: SkillCardProps) {
  const taskCount = getTaskTypesForSkill(skill.id).length;
  const available = skill.status === 'available';

  const body = (
    <>
      <span className="skill-icon"><Icon name={skill.id} size="lg" /></span>
      <h3>{skill.name}</h3>
      <p>{skill.blurb}</p>
      <span className="skill-meta">{available ? `${taskCount} ${skill.id === 'reading' || skill.id === 'listening' ? 'parts' : 'tasks'}` : 'Coming soon'}</span>
    </>
  );

  if (!available) {
    return (
      <div className={`skill-card flavour-${skill.flavour} is-soon`} aria-disabled="true">
        <div className="skill-card-inner" aria-hidden="true">{body}</div>
        <span className="soon-ribbon">Coming soon</span>
        <span className="sr-only">{skill.name} practice is coming soon.</span>
      </div>
    );
  }

  return (
    <a className={`skill-card flavour-${skill.flavour}`} href={href(`/practice/${skill.id}/${moduleId}`)}>
      <div className="skill-card-inner">{body}</div>
    </a>
  );
}
