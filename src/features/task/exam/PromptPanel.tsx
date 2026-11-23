import type { TaskType } from '@/domain/tasks/types';
import type { PracticePrompt } from '@/content/types';

interface PromptPanelProps {
  task: TaskType;
  prompt: PracticePrompt;
  /** For choice tasks: which option is picked, and a handler to pick one. */
  selected?: 0 | 1 | null;
  onSelect?: (option: 0 | 1) => void;
  /** Lock the options once the choosing time is over. */
  optionsLocked?: boolean;
}

/** The task instructions, bullet points, picture and options, test-style. */
export function PromptPanel({ task, prompt, selected = null, onSelect, optionsLocked = false }: PromptPanelProps) {
  return (
    <section className="exam-panel prompt-panel" aria-label="Task instructions">
      <p className="exam-prompt">{prompt.text}</p>
      {prompt.points && (
        <ul className="exam-points">
          {prompt.points.map((point) => <li key={point}>{point}</li>)}
        </ul>
      )}

      {prompt.options && (
        <fieldset className="exam-options" disabled={!onSelect || optionsLocked}>
          <legend className="sr-only">Choose one option</legend>
          {prompt.options.map((option, index) => {
            const value = index as 0 | 1;
            return (
              <label key={option} className={`exam-option ${selected === value ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name={`${prompt.id}-option`}
                  checked={selected === value}
                  onChange={() => onSelect?.(value)}
                />
                <span className="exam-option-letter">Option {index === 0 ? 'A' : 'B'}</span>
                <span>{option}</span>
              </label>
            );
          })}
        </fieldset>
      )}

      {task.needsImage &&
        (prompt.image ? (
          <img className="exam-image" src={prompt.image.src} alt={prompt.image.alt} />
        ) : (
          <div className="exam-image-placeholder" role="img" aria-label="Picture not added yet">
            Picture for this task is added in a later step.
          </div>
        ))}

      {prompt.draft && <p className="exam-note">Draft practice prompt.</p>}
    </section>
  );
}
