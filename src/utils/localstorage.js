const getItem = params => localStorage.getItem(params)
const setItem = (key, value) => localStorage.setItem(key, value)
const removeItem = key => localStorage.removeItem(key)
const clearStorage = () => localStorage.clear()

export { clearStorage, getItem, removeItem, setItem }
