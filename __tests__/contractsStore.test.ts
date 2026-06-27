// AsyncStorage is touched at module load (persist middleware); use the bundled mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { canAdvance, nextStatuses } from '../store/useContractsStore';

describe('contract lifecycle transitions', () => {
  it('allows valid forward transitions', () => {
    expect(canAdvance('draft', 'sent')).toBe(true);
    expect(canAdvance('under_review', 'signed')).toBe(true);
    expect(canAdvance('active', 'completed')).toBe(true);
  });

  it('rejects invalid skips', () => {
    expect(canAdvance('draft', 'signed')).toBe(false);
    expect(canAdvance('draft', 'completed')).toBe(false);
    expect(canAdvance('sent', 'active')).toBe(false);
  });

  it('treats terminal states as terminal', () => {
    expect(nextStatuses('completed')).toEqual([]);
    expect(nextStatuses('cancelled')).toEqual([]);
  });

  it('allows cancelling from early states but not once active', () => {
    for (const s of ['draft', 'sent', 'under_review', 'signed'] as const) {
      expect(canAdvance(s, 'cancelled')).toBe(true);
    }
    // An active contract must be disputed rather than directly cancelled.
    expect(canAdvance('active', 'cancelled')).toBe(false);
    expect(canAdvance('active', 'disputed')).toBe(true);
  });
});
