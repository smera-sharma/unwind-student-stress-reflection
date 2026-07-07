/**
 * Safe local storage utility helper.
 * Prevents application crashes from corrupted values or malformed JSON formats.
 */
export const safeStorage = {
  getItem: (key, fallback = null) => {
    try {
      const val = localStorage.getItem(key);
      if (val === null) return fallback;
      try {
        return JSON.parse(val);
      } catch {
        return val; // Fallback to raw string value
      }
    } catch (e) {
      console.warn(`Error parsing localStorage key "${key}", falling back:`, e);
      return fallback;
    }
  },
  setItem: (key, val) => {
    try {
      const stringVal = typeof val === 'string' ? val : JSON.stringify(val);
      localStorage.setItem(key, stringVal);
    } catch (e) {
      console.error(`Error writing to localStorage key "${key}":`, e);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing localStorage key "${key}":`, e);
    }
  }
};

export default safeStorage;
