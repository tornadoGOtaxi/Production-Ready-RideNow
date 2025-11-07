import React from 'react';
import type { User, Ride } from '../types';
import RideListItem from './DoctorListItem'; // Repurposed
import { LogoutIcon } from './icons/HeartIcon'; // Repurposed

interface DriverDashboardProps {
  user: User;
  rides: Ride[];
  onAcceptRide: (rideId: number) => void;
  onSelectRide: (rideId: number) => void;
  onLogout: () => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, rides, onAcceptRide, onSelectRide, onLogout }) => {
  const pendingRides = rides.filter(r => r.status === 'pending');
  const myRides = rides.filter(r => r.driverId === user.id && r.status !== 'completed' && r.status !== 'cancelled');

  return (
    <div className="space-y-6">
       <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-400">You are online.</p>
        </div>
        <button onClick={onLogout} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors" aria-label="Logout">
          <LogoutIcon className="w-6 h-6 text-slate-300" />
        </button>
      </header>

      <main className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Pending Requests</h3>
          <div className="space-y-4">
            {pendingRides.length > 0 ? (
              pendingRides.map(ride => (
                <div key={ride.id} className="bg-slate-800 rounded-2xl p-4">
                    <RideListItem ride={ride} onSelect={() => {}} />
                    <button 
                        onClick={() => onAcceptRide(ride.id)}
                        className="mt-3 w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Accept Ride
                    </button>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No pending ride requests.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">My Active Rides</h3>
          <div className="space-y-4">
            {myRides.length > 0 ? (
                myRides.map(ride => (
                    <RideListItem key={ride.id} ride={ride} onSelect={() => onSelectRide(ride.id)} />
                ))
            ) : (
                <p className="text-slate-400 text-center py-4">You have no active rides.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
