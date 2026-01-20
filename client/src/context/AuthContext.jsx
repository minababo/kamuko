import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check auth status on app load
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    // Verify token is still valid by making a request to the API
                    const response = await api.get('/auth/me');
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Token is invalid, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setIsLoading(false);
        };

        checkAuthStatus();
    }, []);

    // Login function
    const login = useCallback(async (email, password) => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data;

            // Store JWT in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Register function
    const register = useCallback(async (data) => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/register', data);
            const { token, user: userData } = response.data;

            // Store JWT in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    // Update profile function
    const updateProfile = useCallback(async (data) => {
        try {
            setIsLoading(true);
            const response = await api.put('/auth/profile', data);
            const updatedUser = response.data.user;

            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Profile update failed';
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
