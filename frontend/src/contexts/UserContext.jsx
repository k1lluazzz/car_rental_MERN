import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                
                if (token && storedUser) {
                    // Verify token with backend
                    try {
                        await axios.get('http://localhost:5000/api/users/verify', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setUser(JSON.parse(storedUser));
                    } catch (error) {
                        // If token is invalid, clear storage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    };

    if (loading) {
        return null; // hoặc loading spinner
    }

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
