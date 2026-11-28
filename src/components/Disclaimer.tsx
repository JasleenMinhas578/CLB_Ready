/** The one legal disclaimer. Footer, FAQ and the exam footnote all use this wording. */
export const DISCLAIMER =
  'CLB Ready is an independent practice tool. It is not affiliated with or endorsed by CELPIP or Paragon Testing ' +
  'Enterprises. CELPIP is a trademark of Paragon Testing Enterprises. Scores are estimates for practice only.';

export function Disclaimer({ className }: { className?: string }) {
  return <p className={className}>{DISCLAIMER}</p>;
}
