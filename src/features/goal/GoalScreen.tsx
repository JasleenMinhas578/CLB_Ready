import { GOAL_OPTIONS } from '@/domain/goals';
import { useSession } from '@/app/session';
import { navigate } from '@/app/router';

export function GoalScreen() {
  const { goal, setGoal } = useSession();

  return (
    <section className="narrow">
      <div className="screen-head">
        <h1>What CLB level are you aiming for?</h1>
        <p>Feedback and improved answers will be written for this level. You can change it any time.</p>
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
                navigate('/');
              }}
            >
              <span className="goal-level">CLB {option.level}</span>
              <span className="goal-label">{option.label}</span>
              <span className="goal-hint">{option.hint}</span>
            </button>
          );
        })}
      </div>

      <p className="fine-print">Your goal is kept only until you close this tab.</p>
    </section>
  );
}
