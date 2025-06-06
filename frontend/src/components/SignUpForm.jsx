import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from './Button'
import { EyeIcon, EyeOffIcon, ArrowLeft } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'

const LoginForm = () => {
    const navigate = useNavigate()

    const [step, setStep] = useState(1) // Step 1: Fill form, Step 2: Enter OTP

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
    const otpRefs = useRef([]);
    const [shakeOtp, setShakeOtp] = useState(false);

    const [resendTimer, setResendTimer] = useState(120) // 2 minutes countdown for resend OTP

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return; // Only allow digits

        const newOtp = [...otpDigits];
        newOtp[index] = value;
        setOtpDigits(newOtp);

        // Move to next input if value entered
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otpDigits[index] === '') otpRefs.current[index - 1]?.focus();
        } else if (e.key === 'Enter') {
            handleOtpSubmit(e);
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('Text').trim();
        if (/^\d{6}$/.test(pasteData)) {
            setOtpDigits(pasteData.split(''));
            otpRefs.current[5]?.focus();
        }
    };

    const getOtp = () => otpDigits.join(''); // Call this to get the full OTP

    useEffect(() => {
        if (step === 2) otpRefs.current[0]?.focus();
    }, [step]);


    // Countdown for resend
    useEffect(() => {
        if (resendTimer <= 0) return;

        const intervalId = setInterval(() => {
            setResendTimer((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [resendTimer]);

    const handleInitialSubmit = async (e) => {
        e.preventDefault()

        setIsLoading(true)
        setError('')
        setSuccess('') // email and password fields if invalid otp to empty string also reset otp box text if invalid
        setOtpDigits(Array(6).fill(''));

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setIsLoading(false);
            return setError('Please enter a valid email address');
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to send OTP')
            }

            setSuccess('OTP sent to your email');
            setResendTimer(120);
            setStep(2);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            if (getOtp().length !== 6) {
                setShakeOtp(true);
                setError('Please enter all 6 digits');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, email, password: password.trim(), otp: getOtp() }),
            });

            if (!response.ok) {
                const data = await response.json();
                setOtpDigits(Array(6).fill(''));
                setSuccess('');
                setShakeOtp(true);

                setTimeout(() => otpRefs.current[0]?.focus(), 10);
                throw new Error(data.error || 'Invalid OTP or Registration failed');
            };

            navigate('/onboarding'); // Redirect to onboarding after signup
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        // e.preventDefault();

        setIsLoading(true);
        setError('');
        setSuccess('');
        setOtpDigits(Array(6).fill(''));

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Failed to resend OTP')
            }

            setSuccess('OTP resent to your email');
            setResendTimer(120);
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

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

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Google login failed');
                }

                navigate('/dashboard');
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        },
        onError: (e) => {
            if (e.error === 'access_denied') {
                return navigate('/login');
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
        <form onSubmit={step === 1 ? handleInitialSubmit : handleOtpSubmit} className="w-full max-w-md space-y-6" onKeyDown={(e) => {
            if (e.key === 'Enter' && step === 2) e.preventDefault();
        }}>
            {step === 2 && (error || success) && (
                <div className="flex items-center -ml-2 -mt-2 space-x-2">
                    <button
                        onClick={() => {
                            setError('')
                            setSuccess('')
                            setOtpDigits(Array(6).fill(''))
                            setStep(1)
                        }}
                        className="text-white p-2 rounded-full hover:bg-white/10 cursor-pointer transition duration-500 ease-in-out"
                        aria-label="Back"
                    >
                        <ArrowLeft />
                    </button>
                    <div
                        className={`w-full py-3 text-center text-sm rounded-lg border ${error
                            ? "text-red-100 bg-red-500/20 border-red-500/30"
                            : "text-green-100 bg-green-500/20 border-green-500"
                            }`}
                    >
                        {error || success}
                    </div>
                </div>
            )}

            {step !== 2 && error && (
                <div className="-my-2 -mt-4 mb-[10px] py-[12px] text-sm text-center text-red-100 bg-red-500/20 rounded-lg border border-red-500/30">
                    {error}
                </div>
            )}

            {step !== 2 && success && (
                <div className="-my-2 -mt-4 mb-[10px] py-[12px] text-sm text-center text-green-100 bg-green-500/20 border border-green-500/30 rounded-lg">
                    {success}
                </div>
            )}

            {step === 1 && (
                <>
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-white">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                setError('')
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 shadow-input focus:outline-none focus:ring-2 focus:ring-light-blue focus:border-transparent transition duration-[1.5s] ease-out focus:ring-offset-0 text-white placeholder:text-white/70"
                            placeholder="John Doe"
                            required
                            disabled={isLoading}
                        />
                    </div>
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
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 shadow-input focus:outline-none focus:ring-2 focus:ring-light-blue focus:border-transparent transition duration-[1.5s] ease-out focus:ring-offset-0 text-white placeholder:text-white/70"
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
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 shadow-input focus:outline-none focus:ring-2 focus:ring-light-blue focus:border-transparent transition duration-[1.5s] ease-out focus:ring-offset-0 text-white placeholder:text-white/70"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$"
                                title="Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a symbol."
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
                </>
            )}

            {step === 2 && (
                <>
                    {/* className="w-full px-4 py-3 rounded-xl bg-white/10 text-white" */}
                    <div className="space-y-2">
                        <label className="text-sm text-white block text-center">Enter 6-digit OTP</label>
                        <div
                            className={`flex justify-between gap-2 ${shakeOtp ? 'shake' : ''
                                }`}
                            onAnimationEnd={() => setShakeOtp(false)}
                        >
                            {otpDigits.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{1}"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    onPaste={(e) => handleOtpPaste(e)}
                                    ref={(el) => (otpRefs.current[index] = el)}
                                    className="w-12 h-12 text-center text-lg text-white bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-light-blue transition"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-white/80">
                        <p>
                            Didn't receive the code?{' '}
                            {resendTimer > 0 ? (
                                <span className="text-cyan-300">Resend in {resendTimer}s</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-cyan-400 cursor-pointer underline" // more css from signuppage
                                >
                                    Resend OTP
                                </button>
                            )}
                        </p>
                    </div>
                </>
            )}

            <div className="pt-2">
                <Button
                    type="submit"
                    variant='signup'
                    fullWidth
                    disabled={isLoading}
                    className={`hover:shadow-[0_0_12px_rgba(23,195,178,0.6)] transition-shadow duration-1000 ease-in-out cursor-pointer rounded-lg py-2 px-4`}
                >
                    {isLoading ? (step === 1 ? 'Sending OTP...' : 'Verifying OTP...') : (step === 1 ? 'Sign Up' : 'Verify OTP')}
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
                <div className="text-sm text-white/80">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-white hover:text-cyan-300 hover:drop-shadow-[0_0_6px_rgba(103,232,249,0.7)] transition-colors duration-200 ease-in-out">
                        Login
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default LoginForm