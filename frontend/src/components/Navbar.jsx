import { Link } from 'react-router-dom';
import { useState } from 'react';
import { disablePageScroll, enablePageScroll } from "scroll-lock";

import logo from '/vite.svg';
import { NAV_ITEMS } from '../../utils';
import CrossButton from './CrossButton';
import MenuButton from './MenuButton';

const Navbar = () => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        if (mobileDrawerOpen) {
            setMobileDrawerOpen(false);
            enablePageScroll();
        } else {
            setMobileDrawerOpen(true);
            disablePageScroll();
        }
    };

    return (
        <nav className='absolute top-0 z-50 w-full'>
            {mobileDrawerOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur z-10 transition-opacity duration-300"></div>
            )}
            <div className="absolute inset-0 backdrop-blur-lg [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.9)_30%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.1)_100%)] pointer-events-none"></div>
            <div className="relative z-20 flex justify-between items-center px-4 lg:px-14 py-2">
                <div className="flex items-center flex-shrink-0 pr-3">
                    <img className="h-25 w-auto aspect-square rounded-full" src={logo} alt="logo" />
                </div >
                <ul className='hidden relative z-20 md:flex flex-col items-center justify-center m-auto md:flex-row md:py-5'>
                    {NAV_ITEMS.map(({ label, route }, index) => (
                        <Link to={route}><li className="block relative font-poppins text-[1.25rem] leading-6 text-white transition-colors hover:text-light-purple
                            font-semibold py-8 px-6 md:text-[14px] 
                            md:py-5 md:px-6 lg:px-8 lg:text-[20px] 
                            xl:px-14 xl:text-[24px] 2xl:px-[66px] 2xl:text-[19px]
                            3xl:px-20 3xl:text-[16px]
                            xxl:px-24 xxl:text-[20px]"
                            key={index}>{label}</li></Link>
                    ))}
                </ul>
                <div className='hidden md:flex justify-between items-center text-white font-semibold gap-x-10 md:gap-x-5 max-md:text-[12px]'>
                    <Link className='transition-colors hover:text-black hover:bg-white/80 hover:border-0 py-3 px-3 rounded-md duration-300' to={'/login'}>Log In</Link>
                    <Link className='transition-colors hover:text-black bg-gradient-to-r from-violet-800 to-violet-950 py-2 px-3 rounded-md duration-300' to={'/signup'}>Sign Up</Link>
                </div>
                <div className='md:hidden flex flex-col justify-end'>
                    <button onClick={toggleDrawer}>
                        {mobileDrawerOpen ? <CrossButton /> : <MenuButton />}
                    </button>
                </div>
            </div>
            <div>
                {mobileDrawerOpen && (
                    <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
                        <ul>
                            {NAV_ITEMS.map(({ label, route }, index) => (
                                <Link to={route}>
                                    <li className="block relative font-poppins text-[18px] leading-6 text-white transition-colors hover:text-light-purple
                            font-semibold py-5 px-8"
                                        key={index}>{label}
                                    </li>
                                </Link>
                            ))}
                        </ul>
                        <div className='flex space-x-6 pt-6 text-white font-semibold items-center'>
                            <Link className='transition-colors hover:text-black hover:bg-white/80 hover:border-0 py-3 px-3 rounded-md duration-300' to={'/login'}>Log In</Link>
                            <Link className='transition-colors hover:text-black bg-gradient-to-r from-violet-800 to-violet-950 py-2 px-3 rounded-md duration-300' to={'/signup'}>Sign Up</Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar