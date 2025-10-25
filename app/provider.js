"use client"
import React, { useContext, useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/configs/firebaseConfig'
import { AuthContext } from './_context/AuthContext'
import { LanguageProvider } from './_context/LanguageContext'
import { useMutation } from "convex/react";
import { api } from '@/convex/_generated/api'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

function Provider({ children }) {
    const [user, setUser] = useState();
    const CreateUser = useMutation(api.users.CreateNewUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // Create or get user in Convex
                    const result = await CreateUser({
                        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                        email: firebaseUser.email,
                        pictureURL: firebaseUser.photoURL || "/default_user-image.jpg",
                        firebaseUID: firebaseUser.uid // Add this
                    });

                    // Combine Firebase and Convex user data
                    setUser({
                        ...firebaseUser,
                        ...result,
                        id: result._id // Ensure we have the Convex ID
                    });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth state change error:", error);
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [CreateUser]);

    return (
        <LanguageProvider>
            <AuthContext.Provider value={{ user, setUser }}>
                <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
                    <NextThemesProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </NextThemesProvider>
                </PayPalScriptProvider>
            </AuthContext.Provider>
        </LanguageProvider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within Provider");
    }
    return context;
};

export default Provider;