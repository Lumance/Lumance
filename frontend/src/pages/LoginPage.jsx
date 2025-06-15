import LoginForm from '../components/LoginForm'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Link } from 'react-router-dom'
import SEOHead from '../utils/SEOHead'

const LoginPage = () => {
    return (
        <>
            <SEOHead
                title="Login - Cashablanca"
                description="Log in to your Cashablanca account to manage your finances, track expenses, and achieve your financial goals with ease."
                url="login"
            />
            <div className="min-h-screen w-full animated-background overflow-hidden relative">
                <div className="absolute inset-0 w-full h-full">
                    {/* Abstract shapes */}
                    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-black/25 blur-[100px]" />
                    <div className="absolute bottom-[-20%] left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-black/25 blur-[100px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-black/30 blur-[100px]" />
                </div>
                <div className="relative min-h-screen w-full flex">
                    {/* Left side - Login Form */}
                    <div className="w-full lg:w-11/20 min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
                        <header className="py-8">
                            <Link to='/' className="text-3xl font-semibold text-white">
                                Cashablanca
                            </Link>
                        </header>
                        <main className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                            <div className="space-y-4 mb-8 text-center items-center">
                                <h2 className="text-4xl font-bold text-white text-nowrap">
                                    {/* <span className="font-normal">Hello, </span> */}
                                    <span className="font-bold text-[#E5E5E5]">Control. Grow. Thrive.</span>
                                </h2>
                                <p className="text-[#E5E5E5]">
                                    Your money, your rules — log in to stay in control and keep your goals on track.
                                </p>
                            </div>
                            <div className="glass-card rounded-2xl p-8 shadow-xl">
                                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                                    <LoginForm />
                                </GoogleOAuthProvider>
                            </div>
                        </main>
                        <footer className="py-6">
                            <div className="flex justify-center space-x-6 text-sm">
                                <a
                                    href="#"
                                    className="text-white/80 hover:text-white hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.5)] transition-all"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="#"
                                    className="text-white/80 hover:text-white hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.5)] transition-all"
                                >
                                    Need Help?
                                </a>
                            </div>
                        </footer>
                    </div>
                    {/* Right side - Illustration */}
                    <div className="hidden lg:block w-9/20 p-3">
                        <div
                            className="h-full w-full bg-center bg-cover rounded-3xl"
                            style={{
                                backgroundImage: "url('https://cdn.pixabay.com/photo/2019/09/22/16/20/finance-4496461_1280.png')",
                            }}
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage