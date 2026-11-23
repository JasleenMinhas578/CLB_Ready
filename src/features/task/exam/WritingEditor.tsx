import { useRef, type KeyboardEvent } from 'react';
import { countWords } from '../phases';
import { createHistory, record, redo, replaceRange, undo, type EditorHistory } from './editorHistory';
import { targetText } from './wordTarget';

interface WritingEditorProps {
  value: string;
  onChange: (text: string) => void;
  disabled?: boolean;
  wordRange: { min: number; max: number };
}

/**
 * Test-style writing box: Cut, Copy, Paste, Undo and Redo buttons, no spell
 * check, and a word count underneath. Copy and paste use an in-page
 * clipboard so the browser never asks for clipboard permission.
 */
export function WritingEditor({ value, onChange, disabled = false, wordRange }: WritingEditorProps) {
  const area = useRef<HTMLTextAreaElement>(null);
  const history = useRef<EditorHistory>(createHistory(value));
  const clipboard = useRef('');

  const apply = (next: string, caret?: number, newStep = false) => {
    history.current = record(history.current, next, performance.now(), newStep);
    onChange(next);
    if (caret != null) {
      requestAnimationFrame(() => {
        area.current?.focus();
        area.current?.setSelectionRange(caret, caret);
      });
    }
  };

  const selection = () => {
    const el = area.current;
    return el ? { start: el.selectionStart, end: el.selectionEnd } : { start: value.length, end: value.length };
  };

  const copy = () => {
    const { start, end } = selection();
    if (start === end) return;
    clipboard.current = value.slice(start, end);
    void navigator.clipboard?.writeText(clipboard.current).catch(() => undefined);
    area.current?.focus();
  };

  const cut = () => {
    const { start, end } = selection();
    if (start === end) return;
    clipboard.current = value.slice(start, end);
    void navigator.clipboard?.writeText(clipboard.current).catch(() => undefined);
    const result = replaceRange(value, start, end, '');
    apply(result.text, result.caret, true);
  };

  const paste = () => {
    if (!clipboard.current) return;
    const { start, end } = selection();
    const result = replaceRange(value, start, end, clipboard.current);
    apply(result.text, result.caret, true);
  };

  const step = (direction: 'undo' | 'redo') => {
    history.current = direction === 'undo' ? undo(history.current) : redo(history.current);
    onChange(history.current.present);
    area.current?.focus();
  };

  // Keep Ctrl/Cmd+Z and Y working with our own history.
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = event.metaKey || event.ctrlKey;
    if (!mod) return;
    const key = event.key.toLowerCase();
    if (key === 'z' && !event.shiftKey) {
      event.preventDefault();
      step('undo');
    } else if (key === 'y' || (key === 'z' && event.shiftKey)) {
      event.preventDefault();
      step('redo');
    }
  };

  const words = countWords(value);
  const inRange = words >= wordRange.min && words <= wordRange.max;
  const tools: { label: string; run: () => void; disabled?: boolean }[] = [
    { label: 'Cut', run: cut },
    { label: 'Copy', run: copy },
    { label: 'Paste', run: paste },
    { label: 'Undo', run: () => step('undo'), disabled: history.current.past.length === 0 },
    { label: 'Redo', run: () => step('redo'), disabled: history.current.future.length === 0 },
  ];

  return (
    <section className="exam-panel editor-panel" aria-label="Your answer">
      <div className="editor-toolbar" role="toolbar" aria-label="Editing tools">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            className="exam-tool"
            // Keep the text selection when clicking a tool.
            onMouseDown={(event) => event.preventDefault()}
            onClick={tool.run}
            disabled={disabled || tool.disabled}
          >
            {tool.label}
          </button>
        ))}
      </div>

      <label className="sr-only" htmlFor="answer">Your answer</label>
      <textarea
        id="answer"
        ref={area}
        className="exam-textarea"
        value={value}
        disabled={disabled}
        onChange={(event) => apply(event.target.value)}
        onKeyDown={onKeyDown}
        // No spell check, autocorrect or grammar extensions, as on test day.
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        data-lt-active="false"
      />

      <p className={`exam-wordcount ${inRange ? 'is-good' : ''}`} aria-live="polite">
        <span className="exam-wordcount-number">
          Word count:<strong>{words}</strong>
        </span>
        <span>{targetText(words, wordRange)}</span>
      </p>
    </section>
  );
}
