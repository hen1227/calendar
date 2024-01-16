import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useContext, useEffect, useState} from "react";
import sendAPICall from "./APIs";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    async function fetchUserData() {
        try {
            const token = await AsyncStorage.getItem('token');

            if (token) {
                const user = {token: token}
                sendAPICall( '/account', 'GET', null, user, true)
                    .then((data) => {
                        // console.log("Got user data", data)
                        data.token = token;
                        // console.log("Logging in ", data);
                        setCurrentUser(data);
                    })
                    .catch(err => {
                        console.log("Error getting user data", err);
                        setCurrentUser(null);
                    });
            }
        } catch (error) {
            await AsyncStorage.removeItem('token');
        } finally {
            setIsAuthLoading(false);
        }
    }

    useEffect(() => {
        fetchUserData().then(r => console.log('fetched user data'));
    }, []);

    const login = async (token, user) => {
        await AsyncStorage.setItem('token', token);
        user.token = token;
        setCurrentUser(user);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setCurrentUser(null);
    };

    const refreshCurrentUser = async () => {
        fetchUserData().then(r => console.log('fetched user data'));
    }

    const value = {
        currentUser,
        isAuthLoading,
        login,
        logout,
        refreshCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}