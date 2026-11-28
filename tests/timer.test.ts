import { describe, expect, it } from 'vitest';
import { formatSeconds, passedWarning, warningText } from '@/domain/timer';

describe('formatSeconds', () => {
  it('shows minutes and seconds, rounding up', () => {
    expect(formatSeconds(82)).toBe('1:22');
    expect(formatSeconds(0.2)).toBe('0:01');
    expect(formatSeconds(-3)).toBe('0:00');
  });
});

describe('passedWarning', () => {
  it('returns nothing before the first warning', () => {
    expect(passedWarning(1500, 1620)).toBeNull();
    expect(passedWarning(300.4, 1620)).toBeNull();
  });

  it('returns the latest warning passed', () => {
    expect(passedWarning(300, 1620)).toBe(300);
    expect(passedWarning(61, 1620)).toBe(300);
    expect(passedWarning(59.8, 1620)).toBe(60);
    expect(passedWarning(4, 1620)).toBe(10);
    expect(passedWarning(0, 1620)).toBe(10);
  });

  it('skips warnings as long as the phase or longer', () => {
    expect(passedWarning(65, 90)).toBeNull();
    expect(passedWarning(55, 90)).toBe(60);
    expect(passedWarning(9, 90)).toBe(10);
    expect(passedWarning(50, 60)).toBeNull();
    expect(passedWarning(5, 10)).toBeNull();
  });
});

describe('warningText', () => {
  it('reads naturally', () => {
    expect(warningText(300)).toBe('5 minutes left');
    expect(warningText(60)).toBe('1 minute left');
    expect(warningText(10)).toBe('10 seconds left');
  });
});
