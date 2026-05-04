const guestRoleLabelsRu: Record<string, string> = {
  staff: 'персонал',
  'staff member': 'сотрудник',
  bartender: 'бармен',
  chef: 'шеф-повар',
  'pastry chef': 'кондитер',
  'cold station': 'холодный цех',
  'hot station': 'горячий цех',
  cashier: 'кассир',
  kitchen: 'кухня',
  runner: 'раннер',
  waiter: 'официант',
  guest: 'гость',
}

export const getGuestRoleLabelRu = (role: string) => {
  const normalizedRole = role.trim().toLowerCase()

  return guestRoleLabelsRu[normalizedRole] ?? role
}