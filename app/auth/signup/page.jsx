"use client"
import { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/configs/firebaseConfig';
import { useRouter } from 'next/navigation';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from 'next/link';
import Image from 'next/image';

export default function SignupPage() {
    const [name, setName] = useState(''); // Add name state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const DEFAULT_AVATAR = "/default_user-image.jpg";


    const createUser = useMutation(api.users.CreateNewUser);

    const handleSignup = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
        setIsLoading(true);
        setError('');

        // Validate inputs
        if (!name.trim()) {
            throw new Error('Name is required');
        }

        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Create Firebase user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Create Convex user
        await createUser({
            name: name.trim(),
            email: email.toLowerCase(),
            pictureURL: DEFAULT_AVATAR,
            firebaseUID: firebaseUser.uid
        });

        // Get token and redirect
        const token = await firebaseUser.getIdToken();
        document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Lax`;
        router.push('/dashboard');
    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle specific Firebase errors with user-friendly messages
        if (error.code === 'auth/email-already-in-use') {
            setError('You already have an account, please Sign in');
        } else if (error.code === 'auth/weak-password') {
            setError('Password should be at least 6 characters');
        } else if (error.code === 'auth/invalid-email') {
            setError('Please enter a valid email address');
        } else {
            setError(error.message || 'Failed to create account');
        }
    } finally {
        setIsLoading(false);
    }
};

    const handleGoogleSignup = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            setError('');

            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user) {
                throw new Error('No user data returned from Google');
            }

            try {
                // Save Google user to Convex
                await createUser({
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    pictureURL: user.photoURL || "",
                    firebaseUID: user.uid
                });
            } catch (convexError) {
                console.error('Convex error:', convexError);
                // Continue with signup even if Convex fails
            }

            // Save token in cookie
            const token = await user.getIdToken(true);
            document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Lax`;

            router.push('/dashboard');
        } catch (error) {
            console.error('Google signup error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                setError('Sign up was cancelled. Please try again');
            } else {
                setError('Failed to sign up with Google');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 flex items-center justify-center bg-black p-4 sm:p-6 md:p-8">
                <div className="max-w-md w-full space-y-6 sm:space-y-8">
                    <div>
                        <Image 
                            src="/VidCraft.png"
                            alt="Logo" 
                            width={200}
                            height={200}
                            className="mx-auto"
                        />
                        <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-center text-white">Create Account</h2>
                        <p className="mt-2 text-center text-gray-400 text-sm sm:text-base">
                            Join us and start creating amazing videos
                        </p>
                        {error && (
                            <p className="mt-2 p-3 bg-red-50 text-red-500 text-center rounded text-sm">
                                {error}
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleSignup} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full px-3 py-3 sm:py-2 border border-[#FFE03A] rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE03A] focus:border-transparent"
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-3 py-3 sm:py-2 border border-[#FFE03A] rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE03A] focus:border-transparent"
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-3 py-3 sm:py-2 border border-[#FFE03A] rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE03A] focus:border-transparent"
                                    required
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 sm:py-2 px-4 bg-[#FFE03A] font-bold text-black rounded-md hover:bg-[#FFE03A]/70
                                disabled:bg-[#CBFC00] disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="relative py-3 sm:py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-black text-gray-400 rounded-lg">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignup}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-white 
                            text-gray-800 rounded-md border hover:bg-gray-50 disabled:bg-gray-100 
                            disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                    >
                        <img src="https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0.jpg" alt="Google" className="w-4 h-4 sm:w-5 sm:h-5" />
                        {isLoading ? 'Connecting...' : 'Continue with Google'}
                    </button>

                    <p className="text-center text-xs sm:text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-[#FFE03A] hover:underline font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="w-full md:w-1/2 bg-gradient-to-r from-[#CBFC00] to-[#FFE03A] hidden md:block">
                <div className="h-64 md:h-full flex items-center justify-center p-4 md:p-8">
                    <div className="relative w-full h-full max-w-md md:max-w-none">
                        <Image
                            src="/signup-page-img.png"
                            alt="Authentication"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}