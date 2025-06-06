import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from './Button'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { UseAuth } from '../contexts/AuthContext'

const LoginForm = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const { refreshUser } = UseAuth() // Assuming you have a function to refresh user state

    const handleSubmit = async (e) => {
        e.preventDefault()

        setIsLoading(true)
        setError('')

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setIsLoading(false);
            return setError('Please enter a valid email address');
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password: password.trim() }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Login failed');

            await refreshUser(); // Assuming you have a function to refresh user state

            data.user.isOnboarded ? navigate('/dashboard') : navigate('/onboarding');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        flow: 'auth-code',
        prompt: 'consent select_account',
        onSuccess: async ({ code }) => {
            setIsLoading(true);
            setError('');

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ code }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Google login failed');

                await refreshUser();

                data.user.isOnboarded ? navigate('/dashboard') : navigate('/onboarding');
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        },
        onError: (e) => {
            if (e.error === 'access_denied') {
                return navigate('/login'); // If user denies access, redirect to login
            }

            console.error('Google login error:', e);
            setError('Google login failed');
            setIsLoading(false);
        },
        onNonOAuthError: (e) => {
            console.error('Google login error:', e);
            setError('Popup closed or blocked');
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            {error && (
                <div className="p-4 text-sm text-red-100 bg-red-500/20 rounded-lg border border-red-500/30">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 shadow-input focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent transition duration-[1.5s] ease-out focus:ring-offset-0 text-white placeholder:text-white/70"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white">
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setError('')
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 shadow-input focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent transition duration-[1.5s] ease-out focus:ring-offset-0 text-white placeholder:text-white/70"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <EyeOffIcon className="h-5 w-5 text-white/70" />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-white/70" />
                        )}
                    </button>
                </div>
            </div>

            <div className="pt-2">
                <Button type="submit" fullWidth disabled={isLoading} className='hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-shadow duration-200 ease-in-out cursor-pointer'>
                    {isLoading ? 'Logging in...' : 'Log In'} {/* Add loading spinner here if needed with smooth css */}
                </Button>
            </div>

            <div className="relative flex items-center">
                <div className="flex-grow border-t-[1.5px] border-white/20"></div>
                <span className="flex-shrink mx-4 text-sm text-white/80">or</span>
                <div className="flex-grow border-t-[1.5px] border-white/20"></div>
            </div>

            <Button type="button" variant="google" fullWidth onClick={() => {
                setError('');
                handleGoogleLogin()
            }} disabled={isLoading} className='cursor-pointer'>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                    <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <div className="text-center space-y-4">
                <Link to="/forgot-password" className="text-sm text-white/80 hover:text-white hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.5)] transition-all">
                    Forgot your password?
                </Link>
                <div className="text-sm text-white/80">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-white hover:text-navy hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.5)] transition-colors duration-200 ease-in-out">
                        Sign up
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default LoginForm