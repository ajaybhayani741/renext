const keys = value => (value ? Object.keys(value) : null)
const values = value => (value ? Object.values(value) : null)
const entries = value => (value ? Object.entries(value) : null)
const length = value => (value ? value?.length : 0)
const isEqual = (obj1, obj2 = 0) => obj1 === obj2
const notEqual = (obj1, obj2 = 0) => !isEqual(obj1, obj2)
const ternary = (value, truthy, falsy) => (value ? truthy : falsy)
const include = (array, option) => (array ? array.includes(option) : false)
const newArray = (length = 0) => Array.from({ length })
const isArray = value => (value ? Array.isArray(value) : false)
const checkType = value => typeof value
const keyForValue = (obj, val) => keys(obj)?.find(key => isEqual(obj[key], val))
const capitalFirstLetter = word =>
  word?.slice(0, 1)?.toUpperCase() + word?.slice(1)?.toLowerCase()
const getNestedValueByPath = (path = '', obj = {}) =>
  path.split('.').reduce((acc, key) => acc && acc[key], obj)
const removeFalsyValues = obj =>
  Object.fromEntries(entries(obj)?.filter(([_, v]) => v))
const nullOrUndefined = value => value === null || value === undefined

export {
  entries,
  isEqual,
  keys,
  length,
  notEqual,
  values,
  ternary,
  include,
  newArray,
  isArray,
  checkType,
  keyForValue,
  capitalFirstLetter,
  getNestedValueByPath,
  removeFalsyValues,
  nullOrUndefined,
}
