export const USER_ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  KITCHEN_STAFF: 'kitchen_staff',
  CASHIER: 'cashier',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
