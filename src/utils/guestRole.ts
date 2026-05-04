const guestRoleLabelsRu: Record<string, string> = {
  staff: 'персоналу',
  'staff member': 'сотруднику',
  bartender: 'бармену',
  chef: 'шеф-повару',
  'pastry chef': 'кондитеру',
  'cold station': 'холодному цеху',
  'hot station': 'горячему цеху',
  cashier: 'кассиру',
  kitchen: 'кухне',
  runner: 'раннеру',
  waiter: 'официанту',
  guest: 'гостю',
  hostess: 'хостес',
  steward: 'стюарду',
  expediter: 'экспедитеру',
  barback: 'помощнику бармена',
  'floor lead': 'старшему смены',
}

export const getGuestRoleLabelRu = (role: string) => {
  const normalizedRole = role.trim().toLowerCase()

  return guestRoleLabelsRu[normalizedRole] ?? role
}