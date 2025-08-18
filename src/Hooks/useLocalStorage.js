import { useState, useEffect } from "react";

function useLocalStorageObject(initialValue, key) {
  const [value, setValue] = useState(() => {
    const valueFromLocalStorage = localStorage.getItem(key);
    if (valueFromLocalStorage !== null) {
      return JSON.parse(valueFromLocalStorage);
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const updateField = (field, newValue) => {
    setValue((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  return [value, updateField];
}

export default useLocalStorageObject;
