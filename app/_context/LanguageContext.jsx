"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en')

    useEffect(() => {
        // Load language from localStorage on mount
        const savedLanguage = localStorage.getItem('language')
        if (savedLanguage) {
            setLanguage(savedLanguage)
        }
    }, [])

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage)
        localStorage.setItem('language', newLanguage)
    }

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

