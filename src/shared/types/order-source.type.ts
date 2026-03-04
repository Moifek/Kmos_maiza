export const ORDER_SOURCE = {
  POS: 'pos',
  WEB: 'web',
  MOBILE: 'mobile',
  THIRD_PARTY: 'third_party',
} as const;

export type OrderSource = (typeof ORDER_SOURCE)[keyof typeof ORDER_SOURCE];
