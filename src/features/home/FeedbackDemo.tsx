import { Fragment, type CSSProperties } from 'react';
import { Icon } from '@/components/Icon';

/**
 * The home page's one moment of motion: a learner's sentence gets marked
 * the way CLB Ready marks it (red out, green in) while the level climbs.
 * Pure CSS, plays once; with reduced motion it shows the finished state.
 */
type Piece = { text: string; kind?: 'cut' | 'add' };

const SENTENCE: Piece[] = [
  { text: 'I think you should join' },
  { text: 'a', kind: 'add' },
  { text: 'club, because' },
  { text: 'is', kind: 'cut' },
  { text: 'it’s', kind: 'add' },
  { text: 'a great way' },
  { text: 'for meet', kind: 'cut' },
  { text: 'to meet', kind: 'add' },
  { text: 'people who' },
  { text: 'likes', kind: 'cut' },
  { text: 'like', kind: 'add' },
  { text: 'the same things.' },
];

export function FeedbackDemo() {
  let step = 0;
  return (
    <figure className="demo-card" aria-label="Example of CLB Ready feedback on a spoken answer">
      <div className="demo-head">
        <span className="demo-dot" aria-hidden="true" />
        <span>Speaking task 1 · Giving advice</span>
      </div>
      <p className="demo-sentence">
        {SENTENCE.map((piece, index) => {
          const delay = piece.kind ? ++step : 0;
          return (
            <Fragment key={index}>
              <span className={piece.kind ? `demo-${piece.kind}` : undefined} style={{ '--step': delay } as CSSProperties}>
                {piece.text}
              </span>{' '}
            </Fragment>
          );
        })}
      </p>
      <div className="demo-level">
        <div className="demo-level-row">
          <span>Estimated level</span>
          <strong className="demo-level-number" aria-label="CLB 6 rising to CLB 9">
            CLB <span className="demo-from">6</span>
            <span className="demo-to">9</span>
          </strong>
        </div>
        <div className="demo-bar" aria-hidden="true">
          <span />
        </div>
      </div>
      <figcaption className="demo-tips">
        <span><Icon name="tick" size="sm" /> 4 grammar fixes</span>
        <span><Icon name="tick" size="sm" /> Sample answer you can hear</span>
        <span><Icon name="tick" size="sm" /> Tips for your goal</span>
      </figcaption>
    </figure>
  );
}
