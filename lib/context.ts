import { createContext } from 'react';

export const UserContext = createContext<any>({ user: null, username: null });