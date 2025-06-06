import { Link } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SignUpForm from '../components/SignUpForm'

const SignUp = () => {
  return (
    <div className='min-h-screen w-full animated-ocean-background overflow-hidden relative'>
      <div className='absolute inset-0 w-full h-full'>
        {/* Abstract shapes */}
        <div className='absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-black/25 blur-[100px]' />
        <div className='absolute bottom-[-20%] left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-black/25 blur-[100px]' />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-black/30 blur-[100px]" />
      </div>

      <div className='relative min-h-screen w-full flex'>
        <div className='hidden lg:block w-9/20 p-3'>
          <div
            className='h-full w-full bg-center bg-cover rounded-3xl'
            style={{
              backgroundImage: "url('https://cdn.pixabay.com/photo/2019/09/22/16/20/finance-4496461_1280.png')",
            }}
            aria-hidden='true'
          />
        </div>

        <div className="w-full lg:w-11/20 min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
          <header className="py-8 self-center">
            <Link to='/' className="text-3xl font-semibold text-white">
              Cashablanca
            </Link>
          </header>
          <main className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="space-y-4 mb-8 text-center">
              <h2 className="text-4xl font-bold text-white whitespace-nowrap">
                {/* <span className="font-normal">Hello, </span> */}
                <span className="font-bold text-[#E5E5E5]">Welcome to Cashablanca!</span>
              </h2>
              <p className="text-[#E5E5E5]">
                Take charge of your finances — sign up and start your journey today.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <SignUpForm />
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
      </div>
    </div>
  )
}

export default SignUp