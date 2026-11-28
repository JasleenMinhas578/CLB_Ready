import type { Skill } from '@/domain/skills';
import { getModuleSummary } from '@/content/modules/catalog';
import { href } from '@/app/router';
import { Icon } from '@/components/Icon';
import type { NextTask } from '@/services/progress/progress';

interface SkillCardProps {
  skill: Skill;
  next: NextTask;
  progress: { done: number; total: number };
}

/** One skill on the home page: what you do in it, how much is done, and a link to the module where its next task is. */
export function SkillCard({ skill, next, progress }: SkillCardProps) {
  const unit = skill.id === 'reading' || skill.id === 'listening' ? 'parts' : 'tasks';
  return (
    <a className={`skill-card skill-${skill.id}`} href={href(`/practice/${skill.id}/${next.moduleId}`)}>
      <span className="skill-badge"><Icon name={skill.id} size="lg" /></span>
      <span className="skill-text">
        <strong>{skill.name}</strong>
        <span>{skill.blurb}</span>
      </span>
      <span className="skill-foot">
        <span className="skill-progress">
          <span className="bar" aria-hidden="true">
            <span className="bar-fill" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
          </span>
          <small>{progress.done} of {progress.total} {unit} done</small>
        </span>
        <span className="skill-go">
          {getModuleSummary(next.moduleId)?.title} <Icon name="arrow-right" />
        </span>
      </span>
    </a>
  );
}
