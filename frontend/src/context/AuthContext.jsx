import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('asc360_user')); } catch { return null; }
    });
    const [token, setToken] = useState(() => localStorage.getItem('asc360_token'));

    const login = useCallback(async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: t, user: u } = res.data;
        localStorage.setItem('asc360_token', t);
        localStorage.setItem('asc360_user', JSON.stringify(u));
        setToken(t);
        setUser(u);
        return u;
    }, []);

    const register = useCallback(async (data) => {
        const res = await api.post('/auth/register', data);
        const { token: t, user: u } = res.data;
        localStorage.setItem('asc360_token', t);
        localStorage.setItem('asc360_user', JSON.stringify(u));
        setToken(t);
        setUser(u);
        return u;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('asc360_token');
        localStorage.removeItem('asc360_user');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
