export const JOB_PRIORITY = {
  POS: 1,
  WEB_MOBILE: 2,
  THIRD_PARTY: 3,
} as const;

export type JobPriority = (typeof JOB_PRIORITY)[keyof typeof JOB_PRIORITY];
