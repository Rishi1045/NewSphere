import React, { createContext, useState, useEffect, useContext } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Check if token is valid
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    fetchUser();
                }
            } catch (error) {
                logout();
            }
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch (error) {
            console.error("Error fetching user", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async (googleToken) => {
        try {
            const res = await api.post('/auth/google', { token: googleToken });
            const { token: jwtToken, user: userData } = res.data;

            localStorage.setItem('token', jwtToken);
            setToken(jwtToken);
            setUser(userData);
            api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
            toast.success(`Welcome back, ${userData.name}!`);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            toast.error("Login failed. Please try again.");
            return false;
        }
    };

    const logout = () => {
        googleLogout();
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        toast.success("Successfully logged out");
    };

    return (
        <AuthContext.Provider value={{ user, token, loginWithGoogle, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
