import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from './Button'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import Google from '../assets/svg/Google'

const LoginForm = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const { refreshUser } = useAuth() // Assuming you have a function to refresh user state

    useEffect(() => {
        const timer = setTimeout(() => {
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                setError('Please enter a valid email address');
            } else if (error === 'Please enter a valid email address') {
                setError('');
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [email, error]);

    const handleSubmit = async (e) => {
        e.preventDefault()

        setIsLoading(true)
        setError('')

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
                    className="w-full px-4 py-3 rounded-xl font-poppins font-light bg-white/10 border border-white/20 shadow-input focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent transition duration-[1.5s] ease-out focus:ring-offset-0 text-white placeholder:text-white/70"
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
                        className="w-full px-4 py-3 rounded-xl font-poppins font-light tracking-wider bg-white/10 border border-white/20 shadow-input focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent transition duration-[1.5s] ease-out focus:ring-offset-0 text-white placeholder:text-white/70"
                        placeholder="••••••••"
                        required
                        minLength={8}
                        pattern='.{8,}'
                        title="Password must be at least 8 characters"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-4 rounded-xl flex items-center cursor-pointer"
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
                <Button type="submit" fullWidth disabled={isLoading} className='hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-shadow duration-300 ease-in-out cursor-pointer'>
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
            }} disabled={isLoading} className='cursor-pointer duration-300'>
                <Google />
                {isLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <div className="text-center space-y-4 font-satoshi">
                <Link to="/forgot-password" className="font-semibold text-white/80 duration-300 hover:text-white hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.5)] transition-all">
                    Forgot your password?
                </Link>
                <div className="text-sm text-white/80 font-poppins font-light">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-white hover:text-navy hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.5)] transition-all duration-300 ease-in-out">
                        Sign up
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default LoginForm