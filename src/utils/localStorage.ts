export const setLocalStorage = (key: string, value: any) => {
  if (typeof value === 'object') {
    localStorage.setItem(key, JSON.stringify(value));
    return;
  }
  localStorage.setItem(key, value);
};

export const getLocalStorage = (key: string) => {
  if(!localStorage || localStorage === undefined) return null;
  const value = localStorage.getItem(key);
  if (!value) return '';
  return JSON.parse(value);
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
