import { GOAL_OPTIONS } from '@/domain/goals';
import { useSession } from '@/app/session';
import { Icon } from '@/components/Icon';
import { backPath, navigate } from '@/app/router';

export function GoalScreen() {
  const { goal, setGoal } = useSession();

  return (
    <section className="narrow">
      <div className="screen-head">
        <h1>What CLB level are you aiming for?</h1>
        <p>Pip writes scores, tips and improved answers for this level. Choose a level to save it and go back to your practice.</p>
      </div>

      <div className="goal-grid" role="radiogroup" aria-label="CLB goal">
        {GOAL_OPTIONS.map((option) => {
          const selected = goal === option.level;
          return (
            <button
              key={option.level}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`goal-option ${selected ? 'is-selected' : ''}`}
              onClick={() => {
                setGoal(option.level);
                navigate(backPath());
              }}
            >
              <span className="goal-level">CLB {option.level}</span>
              <span className="goal-label">{option.label}</span>
              <span className="goal-hint">{option.hint}</span>
              {selected && <span className="goal-current"><Icon name="check" size="sm" /> Your goal</span>}
            </button>
          );
        })}
      </div>

      <p className="fine-print">Your goal is kept until you close this tab. You can change it at any time from the top of the page.</p>
    </section>
  );
}
