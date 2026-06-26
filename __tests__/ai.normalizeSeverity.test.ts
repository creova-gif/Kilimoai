import { normalizeSeverity } from '../lib/ai';

describe('normalizeSeverity', () => {
  it('maps English severity words', () => {
    expect(normalizeSeverity('critical')).toBe('critical');
    expect(normalizeSeverity('High')).toBe('high');
    expect(normalizeSeverity('moderate')).toBe('medium');
    expect(normalizeSeverity('low')).toBe('low');
  });

  it('maps Swahili severity words', () => {
    expect(normalizeSeverity('hatari kubwa')).toBe('critical');
    expect(normalizeSeverity('kali')).toBe('high');
    expect(normalizeSeverity('wastani')).toBe('medium');
    expect(normalizeSeverity('ndogo')).toBe('low');
  });

  it('returns undefined for empty / non-string / unknown', () => {
    expect(normalizeSeverity('')).toBeUndefined();
    expect(normalizeSeverity(null)).toBeUndefined();
    expect(normalizeSeverity(42)).toBeUndefined();
    expect(normalizeSeverity('banana')).toBeUndefined();
  });
});
