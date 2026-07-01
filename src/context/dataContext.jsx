"use client"
import React, { createContext, useState, useContext, useEffect } from "react";

const dataContext = createContext();

const useDataContext = () => {return useContext(dataContext)};

const DataContextProvider = ({children})=>{
    const [userData, setUserData] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [theme, setTheme] = useState("dark"); // Default theme

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            try {
                setUserData(JSON.parse(storedUser));
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Error parsing stored user data", e);
            }
        }
        
        // Retrieve and apply theme
        const storedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(storedTheme);
        document.documentElement.className = storedTheme;
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
        document.documentElement.className = nextTheme;
    };

    return (
        <dataContext.Provider value={{
            userData, setUserData,
            isLoggedIn, setIsLoggedIn,
            theme, toggleTheme
        }}>
            {children}
        </dataContext.Provider>
    )
};

export {useDataContext};
export default DataContextProvider;