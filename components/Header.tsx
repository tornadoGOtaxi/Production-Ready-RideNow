import React, { useState } from 'react';
import type { User } from '../types';
import { CarIcon } from './icons/DentalIcon'; // Repurposed icon

interface LoginScreenProps {
  onLogin: (username: string, password: string) => boolean;
  demoUsers: User[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, demoUsers }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid username or password.');
    } else {
      setError('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -m-4">
        <div className="w-full max-w-sm p-8 space-y-8 bg-slate-800 rounded-2xl shadow-lg">
            <div className="text-center">
                <div className="flex justify-center items-center gap-3 mb-4">
                    <CarIcon className="w-10 h-10 text-blue-400"/>
                    <h1 className="text-4xl font-bold text-white">Tornado Go</h1>
                </div>
                <p className="text-slate-400">Your ride in Taylorville, IL.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    aria-label="Username"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    aria-label="Password"
                />
                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                    Login
                </button>
            </form>
        </div>
    </div>
  );
};

export default LoginScreen;