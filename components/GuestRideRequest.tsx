
import React, { useState } from 'react';
import type { LatLng } from '../types';

interface GuestRideRequestProps {
    onBack: () => void;
    pickupLocation: LatLng | string;
    onRequestRide: (destination: string, name: string, phone: string, email: string) => void;
}

const GuestRideRequest: React.FC<GuestRideRequestProps> = ({ onBack, pickupLocation, onRequestRide }) => {
    const [destination, setDestination] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (destination.trim() && name.trim() && phone.trim() && email.trim()) {
            onRequestRide(destination, name, phone, email);
        }
    };
    
    const pickupDisplay = typeof pickupLocation === 'string'
    ? pickupLocation
    : `Current Location (Lat: ${pickupLocation.lat.toFixed(4)}, Lng: ${pickupLocation.lng.toFixed(4)})`;

    return (
        <div className="space-y-4">
            <header className="flex items-center">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-800" aria-label="Go back">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-xl font-bold ml-2">Guest Ride Request</h2>
            </header>
            
            <main>
                <div className="rounded-2xl bg-slate-800 p-5 shadow-lg space-y-4">
                     <p className="text-slate-400 text-sm">Request a ride without an account. Please provide your details below.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={pickupDisplay}
                            readOnly
                            className="w-full bg-slate-700 text-slate-300 placeholder-slate-400 rounded-lg py-3 px-4 focus:outline-none cursor-not-allowed"
                            aria-label="Pickup Location"
                        />
                         <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Your Name"
                        />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Your Email"
                        />
                         <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Your Phone Number"
                        />
                        <input
                            type="text"
                            placeholder="Enter destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            required
                            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Destination"
                        />
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!destination.trim() || !name.trim() || !phone.trim() || !email.trim()}>
                            Request Ride Now
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default GuestRideRequest;