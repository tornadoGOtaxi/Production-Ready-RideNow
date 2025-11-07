import React, { useState } from 'react';
import type { User, Ride, LatLng } from '../types';
import RideListItem from './DoctorListItem'; // Repurposed
import { LogoutIcon } from './icons/HeartIcon'; // Repurposed

interface PassengerDashboardProps {
  user: User;
  rides: Ride[];
  onRequestRide: (destination: string) => void;
  onSelectRide: (rideId: number) => void;
  pickupLocation: LatLng | string;
  onLogout: () => void;
}

const PassengerDashboard: React.FC<PassengerDashboardProps> = ({ user, rides, onRequestRide, onSelectRide, pickupLocation, onLogout }) => {
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onRequestRide(destination);
      setDestination('');
    }
  };

  const pickupDisplay = typeof pickupLocation === 'string'
    ? pickupLocation
    : `Lat: ${pickupLocation.lat.toFixed(4)}, Lng: ${pickupLocation.lng.toFixed(4)}`;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Hello, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-400">Where to?</p>
        </div>
        <button onClick={onLogout} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors" aria-label="Logout">
          <LogoutIcon className="w-6 h-6 text-slate-300" />
        </button>
      </header>

      <main>
        <div className="rounded-2xl bg-slate-800 p-5 shadow-lg space-y-4">
          <div className="w-full h-40 bg-slate-700 rounded-lg flex items-center justify-center">
            <p className="text-slate-400">Map Placeholder</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={pickupDisplay}
              readOnly
              className="w-full bg-slate-700 text-slate-300 placeholder-slate-400 rounded-lg py-3 px-4 focus:outline-none cursor-not-allowed"
            />
            <input
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!destination.trim()}>
              Request Ride
            </button>
          </form>
        </div>

        <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">My Rides</h3>
            <div className="space-y-4">
                {rides.length > 0 ? (
                    rides.map((ride) => (
                        <RideListItem key={ride.id} ride={ride} onSelect={() => onSelectRide(ride.id)} />
                    ))
                ) : (
                    <p className="text-slate-400 text-center py-4">You have no rides yet.</p>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default PassengerDashboard;
