import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { CircleUserRound, Menu, X, ChevronDown, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NAV_ITEMS, PROFILE_ITEMS } from '../utils/utils';
import GradientText from '../assets/animations/GradientText';
import GlareHover from '../assets/animations/GlareHover';
import logo from '../assets/svg/vite.svg';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const profileRef = useRef(null);

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => {
        if (mobileMenuOpen) {
            setMobileMenuOpen(false);
            enablePageScroll();
        } else {
            setMobileMenuOpen(true);
            disablePageScroll();
        }
    };

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate('/');
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: 'easeOut',
                when: 'beforeChildren',
                staggerChildren: 0.05,
            },
        },
        exit: {
            opacity: 0,
            y: 0,
            transition: {
                duration: 0.15,
                ease: 'easeIn',
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 25 },
        visible: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, y: -5, scale: 0.95 },
    };

    const profileVariants = {
        hidden: { opacity: 0, scale: 0.9, y: -5 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.25,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: -5,
            transition: {
                duration: 0.2,
                ease: 'easeIn',
            },
        },
    };

    return (
        <nav className="fixed top-1.5 w-full py-4 px-15 z-50">
            <div className="flex items-center justify-between">
                {/* Logo - flex-shrink-0 prevents it from shrinking */}
                <motion.div
                    initial={{ opacity: 0, x: -25, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
                    className='pl-4'
                >
                    <Link to="/" className='flex-shrink-0 flex mt-[3px] items-center space-x-3 font-roboto text-2xl'>
                        <img src={logo} alt="Logo" className="h-8 w-auto transition-transform hover:scale-105 active:scale-100" />
                        <span className="hidden md:inline">
                            <GradientText
                                colors={[
                                    "#00FFEF", "#00E6D6", "#00C2D7", "#00A8C5", "#008793", "#00A8C5", "#00C2D7", "#00E6D6", "#00FFEF"
                                ]}
                                animationSpeed={8}
                            >
                                {import.meta.env.VITE_WEBSITE_NAME}
                            </GradientText>
                        </span>
                    </Link>
                </motion.div>

                {/* Centered navigation items */}
                <div className="hidden md:flex absolute top-[16px] left-1/2 items-center transform -translate-x-1/2 bg-secondary/45 rounded-[14px] p-2 px-4 backdrop-blur-md">
                    <ul className="flex gap-12">
                        {NAV_ITEMS.map((item, i) => {
                            const isActive = location.pathname === item.route;

                            return (
                                <motion.li
                                    key={item.label}
                                    initial={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ delay: i * 0.07, type: 'tween', duration: 0.4, ease: 'easeOut' }}
                                    className='relative group'
                                >
                                    <div className={`${isActive ? 'text-white' : 'text-white/60 hover:text-white'} cursor-pointer`}>
                                        <Link to={item.route} className="relative font-satoshi text-[15px] font-medium">
                                            {item.label}
                                            <span
                                                className="absolute left-0 right-0 -bottom-1 h-[1.5px] bg-white
                                                                rounded-full opacity-0 scale-x-0 group-hover:opacity-100
                                                                group-hover:scale-x-100 transition-transform duration-300 origin-center"
                                            />
                                        </Link>
                                    </div>
                                </motion.li>
                            );
                        })}
                    </ul>
                </div>

                {/* Right side items */}
                <motion.div
                    className="flex items-center justify-end flex-1 -mr-2 space-x-4"
                >
                    {user ? (
                        <div className="relative" ref={profileRef}>
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 140, damping: 18 }}
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-x-2 focus:outline-none cursor-pointer"
                            >
                                {user?.avatarUrl ? (
                                    <motion.img
                                        initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                                        animate={
                                            profileOpen
                                                ? { scale: 0, opacity: 0, x: -250, y: 50 }
                                                : { scale: 1, opacity: 1, x: 0, y: 0 }
                                        }
                                        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                                        src={user.avatarUrl}
                                        alt="User Avatar"
                                        referrerPolicy="no-referrer"
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <motion.div
                                        initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                                        animate={
                                            profileOpen
                                                ? { scale: 0, opacity: 0, x: -250, y: 50 }
                                                : { scale: 1, opacity: 1, x: 0, y: 0 }
                                        }
                                        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                                        className="h-10 w-10 rounded-full bg-none cursor-pointer flex items-center justify-center">
                                        <CircleUserRound className="h-10 w-10 text-white" />
                                    </motion.div>
                                )}
                                <ChevronDown className={`h-4 w-4 cursor-pointer text-gray-300 transition-transform duration-450 ${profileOpen ? 'rotate-180' : ''}`} />
                            </motion.button>

                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        key="profile-menu"
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={dropdownVariants}
                                        role="menu"
                                        aria-label="User profile menu"
                                        className="absolute right-0 mt-2 w-72 text-sm bg-[linear-gradient(0deg,hsl(0_0%_5%),hsl(0_0%_10%))] text-white/80 border border-white/20 rounded-2xl shadow-2xl px-6 py-4 z-50 overflow-hidden"
                                    >
                                        {/* Profile section */}
                                        <motion.div
                                            key="user-info"
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={profileVariants}
                                            className="flex items-center gap-4"
                                        >
                                            {user?.avatarUrl ? (
                                                <motion.img
                                                    key="avatar-img"
                                                    src={user.avatarUrl}
                                                    alt="User Avatar"
                                                    referrerPolicy="no-referrer"
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    variants={profileVariants}
                                                />
                                            ) : (
                                                <div className="bg-white/10 rounded-full flex items-center -ml-1 justify-center">
                                                    <CircleUserRound className="h-11 w-11 text-white" />
                                                </div>
                                            )}
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-[15px] text-white font-satoshi font-semibold truncate max-w-[170px]">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-white/50 font-satoshi tracking-wide truncate max-w-[170px]">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </motion.div>

                                        <div className="border-t border-white/10 my-3" />

                                        {/* Menu items */}
                                        <div role="none" className="space-y-1">
                                            {PROFILE_ITEMS.map((item) => (
                                                <motion.div
                                                    key={item.label}
                                                    variants={itemVariants}
                                                >
                                                    <Link
                                                        to={item.route}
                                                        className="flex items-center gap-x-2 px-1.5 py-2 text-white/75 duration-300 hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                        role="menuitem"
                                                    >
                                                        {item.icon}
                                                        {item.label}
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="border-t border-white/10 my-3" />

                                        {/* Sign out */}
                                        <motion.button
                                            key={'signout'}
                                            variants={itemVariants}
                                        >
                                            <Link
                                                to={'/'}
                                                className="flex items-center gap-x-2 px-1.5 py-2 text-white/75 duration-300 hover:text-white transition-colors"
                                                onClick={handleLogout}
                                                role="menuitem"
                                            >
                                                <LogOut />
                                                Sign Out
                                            </Link>
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    ) : (
                        <div className="hidden md:flex items-center h-10 bg-secondary/45 backdrop-blur-md rounded-[14px] text-gray-300">
                            <motion.span
                                initial={{ opacity: 0, x: 25, filter: 'blur(5px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                transition={{ type: 'tween', duration: 0.7, ease: 'easeOut' }}
                                whileHover={{ textShadow: '0px 0px 7px rgba(255,255,255,0.5)' }}
                                className='inline-block -mt-0.5'
                            >
                                <Link
                                    to="/login"
                                    className="px-3.5 py-2 text-[16px] font-medium font-satoshi"
                                >
                                    Log In
                                </Link>
                            </motion.span>

                            {/* 🟨 Wrap both divider + button inside same group */}
                            <div
                                className="flex items-center group"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <motion.div
                                    initial={{ scaleY: 0, opacity: 0 }}
                                    animate={{
                                        scaleY: isHovered ? 0 : 1,
                                        opacity: isHovered ? 0 : 1
                                    }}
                                    transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                                    className="h-5 w-[1px] bg-white/10 mx-1 origin-center"
                                ></motion.div>

                                <GlareHover
                                    glareColor="#ffffff"
                                    glareOpacity={0.5}
                                    glareAngle={-30}
                                    glareSize={300}
                                    transitionDuration={1200}
                                    borderRadius="14px"
                                    background="transparent"
                                    borderColor="transparent"
                                    playOnce={true}
                                    className="rounded-[14px]"
                                >
                                    <Link to="/register" className="px-3.5 py-2 h-10 flex overflow-visible rounded-[14px] group-hover:bg-black transition-all">
                                        <motion.div
                                            initial={{ opacity: 0, x: 25, filter: 'blur(5px)' }}
                                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                            transition={{ type: 'tween', duration: 0.7, ease: 'easeOut' }}
                                            className='-mt-[1.5px]'
                                        >
                                            <span className="text-base font-satoshi font-bold group-hover:text-white transition-all">
                                                Get Started
                                            </span>
                                        </motion.div>
                                    </Link>
                                </GlareHover>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </motion.div>
            </div >

            {/* Mobile menu - remains unchanged */}
            {
                mobileMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                            onClick={toggleMenu}
                        />
                        <div className="fixed top-20 right-0 w-full sm:w-80 bg-gray-900 z-40 h-[calc(100vh-5rem)] overflow-y-auto transition-all duration-300">
                            <div className="px-6 py-8">
                                <ul className="space-y-6">
                                    {NAV_ITEMS.map((item) => (
                                        <li key={item.label}>
                                            <Link
                                                to={item.route}
                                                className="block text-gray-300 hover:text-white transition-colors font-medium text-lg"
                                                onClick={toggleMenu}
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-12 pt-6 border-t border-gray-800">
                                    {user ? (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                className="block py-3 text-gray-300 hover:text-white transition-colors"
                                                onClick={toggleMenu}
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    toggleMenu();
                                                }}
                                                className="w-full text-left py-3 text-gray-300 hover:text-white transition-colors flex items-center"
                                            >
                                                <LogOut className="h-5 w-5 mr-2" />
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <Link
                                                to="/login"
                                                className="block w-full px-4 py-3 rounded-md text-center font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                                                onClick={toggleMenu}
                                            >
                                                <LogIn className="h-5 w-5 inline-block mr-2" />
                                                Log In
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="block w-full px-4 py-3 rounded-md text-center font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all"
                                                onClick={toggleMenu}
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </nav >
    );
};

export default Navbar;