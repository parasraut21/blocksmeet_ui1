import React, { useState, useEffect, useContext } from 'react';
import { generateId } from '../helpers';

const UserContext = React.createContext();

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({ children }) {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const n = typeof window !== "undefined" ? localStorage.getItem('username') : null;

    if (n) {
      setUsername(n);
    } else {
      let name;
      while (!name || name.trim() === '') {
        name = prompt('Please enter your name:');
      }
      if (typeof window !== "undefined") {
        localStorage.setItem('username', name);
      }
      setUsername(name);
    }

    let uid = typeof window !== "undefined" ? localStorage.getItem('uid') : null;
    if (!uid) {
      uid = generateId();
      if (typeof window !== "undefined") {
        localStorage.setItem('uid', uid);
      }
      setId(uid);
    } else {
      setId(uid);
    }
  }, []);

  function updateUsername(u) {
    if (typeof window !== "undefined") {
      localStorage.setItem('username', u);
    }
    setUsername(u);
  }

  const value = { id, username, updateUsername };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
