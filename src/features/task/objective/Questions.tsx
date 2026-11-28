import type { ChoiceQuestion, ReadingBlock } from '@/content/objective';

export type Answers = Record<string, number | null>;

interface AnswerProps {
  answers: Answers;
  onAnswer: (questionId: string, option: number) => void;
  disabled?: boolean;
}

/** One question with its options as radio buttons. */
export function ChoiceField({ question, number, answers, onAnswer, disabled }: AnswerProps & { question: ChoiceQuestion; number: number }) {
  const chosen = answers[question.id] ?? null;
  return (
    <fieldset className="choice-field" disabled={disabled}>
      <legend>
        <span className="choice-number">{number}.</span> {question.text}
      </legend>
      {question.options.map((option, index) => (
        <label key={option} className={`exam-option ${chosen === index ? 'is-selected' : ''}`}>
          <input type="radio" name={question.id} checked={chosen === index} onChange={() => onAnswer(question.id, index)} />
          <span>{option}</span>
        </label>
      ))}
    </fieldset>
  );
}

/** A list of questions, numbered by `numbers` when given, otherwise from `startAt`. */
export function QuestionList({ questions, startAt = 1, numbers, ...rest }: AnswerProps & {
  questions: ChoiceQuestion[];
  startAt?: number;
  numbers?: Map<string, number>;
}) {
  return (
    <div className="question-list">
      {questions.map((question, index) => (
        <ChoiceField key={question.id} question={question} number={numbers?.get(question.id) ?? startAt + index} {...rest} />
      ))}
    </div>
  );
}

function paragraphs(body: string): string[] {
  return body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
}

/** A passage paragraph with `[[id]]` blanks turned into dropdowns. */
function ClozeParagraph({ text, questions, numbers, ...rest }: AnswerProps & { text: string; questions: Map<string, ChoiceQuestion>; numbers: Map<string, number> }) {
  const pieces = text.split(/(\[\[[\w-]+\]\])/);
  return (
    <p>
      {pieces.map((piece, index) => {
        const id = piece.match(/^\[\[([\w-]+)\]\]$/)?.[1];
        const question = id ? questions.get(id) : undefined;
        if (!id || !question) return <span key={index}>{piece}</span>;
        const chosen = rest.answers[id];
        return (
          <label key={id} className="cloze-blank">
            <span className="sr-only">Blank {numbers.get(id)}</span>
            <span className="cloze-number" aria-hidden="true">{numbers.get(id)}</span>
            <select
              value={chosen ?? ''}
              disabled={rest.disabled}
              onChange={(event) => rest.onAnswer(id, Number(event.target.value))}
            >
              <option value="" disabled>Choose…</option>
              {question.options.map((option, optionIndex) => (
                <option key={option} value={optionIndex}>{option}</option>
              ))}
            </select>
          </label>
        );
      })}
    </p>
  );
}

/** Renders reading blocks: plain passages, tables and passages with blanks. */
export function PassageView({ blocks, questions, numbers, ...rest }: AnswerProps & {
  blocks: ReadingBlock[];
  questions: ChoiceQuestion[];
  /** Question id → number shown to the learner. */
  numbers: Map<string, number>;
}) {
  const byId = new Map(questions.map((question) => [question.id, question]));
  return (
    <div className="passage">
      {blocks.map((block, index) => (
        <section key={index} className={`passage-block is-${block.kind}`}>
          {block.title && <h3>{block.title}</h3>}
          {block.kind === 'table' ? (
            <div className="passage-table-wrap">
              <table className="passage-table">
                <thead>
                  <tr>{block.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr key={row.join('|')}>
                      {row.map((cell, cellIndex) => (cellIndex === 0 ? <th key={cellIndex} scope="row">{cell}</th> : <td key={cellIndex}>{cell}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {block.note && <p className="passage-note">{block.note}</p>}
            </div>
          ) : block.kind === 'cloze' ? (
            paragraphs(block.body).map((text) => <ClozeParagraph key={text} text={text} questions={byId} numbers={numbers} {...rest} />)
          ) : (
            paragraphs(block.body).map((text) => <p key={text}>{text}</p>)
          )}
        </section>
      ))}
    </div>
  );
}
