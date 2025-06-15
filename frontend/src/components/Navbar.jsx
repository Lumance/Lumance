import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { UseAuth } from '../contexts/AuthContext';
import { CircleUserRound, Menu, X, ChevronDown, LogOut, LogIn } from 'lucide-react';
import { NAV_ITEMS } from '../utils/utils';
import logo from '/vite.svg';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = UseAuth();
    const navigate = useNavigate();
    const profileRef = useRef(null);

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

    return (
        <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-gray-200/10">
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={toggleMenu}
                />
            )}

            <div className="container mx-auto flex justify-between items-center py-4">
                <div className="flex-1 flex justify-start">
                    <Link to="/" className='relative'>
                        <img src={logo} alt="Logo" className="h-10 w-auto transition-transform hover:scale-105" />
                    </Link>
                </div>

                <ul className="hidden md:flex space-x-10 justify-center">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.label}>
                            <Link
                                to={item.route}
                                className="relative text-gray-300 hover:text-white transition-colors font-satoshi font-medium text-sm uppercase "
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex-1 flex justify-end items-center space-x-4">
                    {user ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                {user?.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt="User Avatar"
                                        referrerPolicy="no-referrer"
                                        className="h-10 w-10 rounded-full object-cover cursor-pointer"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r cursor-pointer from-purple-500 to-blue-500 flex items-center justify-center">
                                        <CircleUserRound className="h-6 w-6 text-white" />
                                    </div>
                                )}
                                <ChevronDown className={`h-4 w-4 cursor-pointer text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all"
                            >
                                Sign Up
                            </Link>
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
                </div>
            </div>

            {mobileMenuOpen && (
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
            )}
        </nav>
    );
};

export default Navbar;