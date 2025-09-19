"use client"
import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/configs/firebaseConfig';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const createUser = useMutation(api.users.CreateNewUser);

    const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
        setIsLoading(true);
        setError('');

        // Validate inputs
        if (!email || !password) {
            throw new Error('Please fill in all fields');
        }

        // Clean up email
        const cleanEmail = email.trim().toLowerCase();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
            const user = userCredential.user;

            if (!user) {
                throw new Error('No user data returned');
            }

            // Create or update user in Convex
            await createUser({
                name: user.displayName || cleanEmail.split('@')[0],
                email: cleanEmail,
                pictureURL: user.photoURL || "",
                firebaseUID: user.uid
            });

            // Get fresh token and set cookie
            const token = await user.getIdToken();
            document.cookie = `auth-token=${token}; path=/; max-age=3600`;

            router.push('/dashboard');
        } catch (authError) {
            console.error('Auth error:', authError);
            switch (authError.code) {
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    setError('Invalid email or password');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many login attempts. Please try again later');
                    break;
                case 'auth/network-request-failed':
                    setError('Network error. Please check your connection');
                    break;
                default:
                    setError('Login failed. Please try again');
            }
        }
    } catch (error) {
        console.error('General error:', error);
        setError(error.message || 'An unexpected error occurred');
    } finally {
        setIsLoading(false);
    }
};

    const handleGoogleLogin = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            setError('');

            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ 
                prompt: 'select_account',
                access_type: 'offline'
            });

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user) {
                throw new Error('No user data returned from Google');
            }

            try {
                // Convex mutation to create or update the user
                await createUser({
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    pictureURL: user.photoURL || "",
                    firebaseUID: user.uid
                });
            } catch (convexError) {
                console.error('Convex error:', convexError);
                // Continue with login even if Convex update fails
            }

            // Get fresh token
            const token = await user.getIdToken(true);
            
            // Set secure cookie
            document.cookie = `auth-token=${token}; path=/; secure; samesite=strict; max-age=3600`;

            router.push('/dashboard');
        } catch (error) {
            console.error('Google login error:', error);
            setError(
                error.code === 'auth/popup-closed-by-user'
                    ? 'Login was cancelled. Please try again.'
                    : error.code === 'auth/cancelled-popup-request'
                    ? 'Another login attempt is in progress.'
                    : error.code === 'auth/network-request-failed'
                    ? 'Network error. Please check your connection.'
                    : 'Failed to login with Google. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Login Form */}
            <div className="w-1/2 flex items-center justify-center bg-black p-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <Image 
                            src="/VidCraft.png" 
                            alt="Logo" 
                            width={200} 
                            height={200} 
                            className="mx-auto"
                        />
                        <h2 className="mt-6 text-3xl font-bold text-center">Welcome back</h2>
                        <p className="mt-2 text-center text-gray-600">
                            Sign in to continue your journey
                        </p>
                        {error && (
                            <p className="mt-2 p-2 bg-red-50 text-red-500 text-center rounded">
                                {error}
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-[#FFE03A] rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-[#FFE03A] rounded-md"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 bg-[#FFE03A] font-bold text-black rounded-md hover:bg-[#FFE03A]/70 
                                disabled:bg-[#CBFC00] disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-black  rounded-lg">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white 
                            text-gray-800 rounded-md border hover:bg-gray-50 disabled:bg-gray-100 
                            disabled:cursor-not-allowed transition-colors"
                    >
                        <img src="https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0.jpg" alt="Google" className="w-5 h-5" />
                        {isLoading ? 'Connecting...' : 'Continue with Google'}
                    </button>

                    <p className="text-center text-sm text-white">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="text-[#EFFB53] hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="w-1/2 bg-gradient-to-r from-[#FFE03A] to-[#EFFB53] hidden lg:block">
                <div className="h-full flex items-center justify-center p-8">
                    <div className="relative w-full h-full">
                        <Image
                            src="/login-page.gif"
                            alt="AI Video Generator Demo"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
