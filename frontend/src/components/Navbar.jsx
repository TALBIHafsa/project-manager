import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="text-xl font-bold text-blue-600">
                        ProjectManager
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 text-sm">
                            {user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;