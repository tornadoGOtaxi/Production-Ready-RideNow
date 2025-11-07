import React, { useEffect, useRef } from 'react';
import type { Ride, User, Message, LatLng } from '../types';
import Chat from './BottomNav'; // Repurposed as Chat component
import { MapPinIcon } from './icons/MapPinIcon';

// Since we can't use a package manager, we declare the Leaflet object from the global scope.
declare const L: any;

interface RideDetailScreenProps {
  ride: Ride;
  user: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  allUsers: User[];
}

const RideDetailScreen: React.FC<RideDetailScreenProps> = ({ ride, user, messages, onSendMessage, onBack, allUsers }) => {
  const driver = ride.driverId ? allUsers.find(u => u.id === ride.driverId) : null;
  const passenger = allUsers.find(u => u.id === ride.passengerId);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current && ride.pickupCoords) {
      const map = L.map(mapContainerRef.current).setView([ride.pickupCoords.lat, ride.pickupCoords.lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      mapInstanceRef.current = map;

      // Add pickup marker
      L.marker([ride.pickupCoords.lat, ride.pickupCoords.lng]).addTo(map)
        .bindPopup('Pickup Location');

      // Add destination marker
      if(ride.destinationCoords) {
        L.marker([ride.destinationCoords.lat, ride.destinationCoords.lng]).addTo(map)
          .bindPopup('Destination');
      }
    }
  }, [ride.pickupCoords, ride.destinationCoords]);
  
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && ride.driverLocation) {
        const driverLatLng = [ride.driverLocation.lat, ride.driverLocation.lng];
        if (!driverMarkerRef.current) {
            // Create driver marker if it doesn't exist
            const driverIcon = L.divIcon({
                html: '🚕',
                className: 'text-2xl',
                iconSize: [24, 24],
            });
            driverMarkerRef.current = L.marker(driverLatLng, { icon: driverIcon }).addTo(map);
        } else {
            // Update driver marker position
            driverMarkerRef.current.setLatLng(driverLatLng);
        }
        map.panTo(driverLatLng, { animate: true });
    }
  }, [ride.driverLocation]);


  const handleShareLocation = () => {
    if (ride.driverLocation) {
      const link = `https://maps.google.com/?q=${ride.driverLocation.lat},${ride.driverLocation.lng}`;
      onSendMessage(`Here is my current location: ${link}`);
    } else {
      alert("Current location not available to share.");
    }
  };

  const statusDisplay: { [key: string]: { text: string; bg: string; text_color: string } } = {
    pending: { text: 'Pending', bg: 'bg-yellow-900', text_color: 'text-yellow-300' },
    accepted: { text: 'Accepted', bg: 'bg-blue-900', text_color: 'text-blue-300' },
    'in-progress': { text: 'In Progress', bg: 'bg-blue-900', text_color: 'text-blue-300' },
    arrived: { text: 'Driver Arrived', bg: 'bg-indigo-900', text_color: 'text-indigo-300' },
    'picked-up': { text: 'Picked Up', bg: 'bg-purple-900', text_color: 'text-purple-300' },
    completed: { text: 'Completed', bg: 'bg-green-900', text_color: 'text-green-300' },
    cancelled: { text: 'Cancelled', bg: 'bg-red-900', text_color: 'text-red-300' },
  };
  const currentStatus = statusDisplay[ride.status] || statusDisplay.pending;

  return (
    <div className="space-y-4">
      <header className="flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-800" aria-label="Go back">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-bold ml-2">Ride Details</h2>
      </header>

      <div ref={mapContainerRef} className="w-full h-64 bg-slate-700 rounded-lg z-0" id="map"></div>

      <div className="p-4 bg-slate-800 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${currentStatus.bg} ${currentStatus.text_color}`}>
              {currentStatus.text}
            </span>
            {ride.fare && <span className="text-xl font-bold text-white">${ride.fare.toFixed(2)}</span>}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
              <MapPinIcon className="w-5 h-5 mt-1 text-green-400 flex-shrink-0" />
              <div>
                  <p className="text-slate-400">From</p>
                  <p className="font-medium text-white">{ride.pickupLocation}</p>
              </div>
          </div>
          <div className="flex items-start space-x-3">
              <MapPinIcon className="w-5 h-5 mt-1 text-red-400 flex-shrink-0" />
              <div>
                  <p className="text-slate-400">To</p>
                  <p className="font-medium text-white">{ride.destination}</p>
              </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-800 rounded-2xl">
        <div className="grid grid-cols-2 gap-4">
            {/* Passenger Info */}
            {passenger && (
              <div>
                  <p className="text-sm text-slate-400 mb-1">Passenger</p>
                  <div className="flex items-center space-x-3">
                      <img src={passenger.avatarUrl} alt={passenger.name} className="w-10 h-10 rounded-full object-cover"/>
                      <span className="font-bold text-white truncate">{passenger.name.split(' ')[0]}</span>
                  </div>
              </div>
            )}
            {/* Driver Info */}
            {driver && (
              <div>
                  <p className="text-sm text-slate-400 mb-1">Driver</p>
                  <div className="flex items-center space-x-3">
                      <img src={driver.avatarUrl} alt={driver.name} className="w-10 h-10 rounded-full object-cover"/>
                      <span className="font-bold text-white truncate">{driver.name.split(' ')[0]}</span>
                  </div>
              </div>
            )}
        </div>
        {user.role === 'driver' && ride.status !== 'completed' && ride.status !== 'cancelled' && (
            <button
                onClick={handleShareLocation}
                className="mt-4 w-full bg-slate-700 text-white font-bold py-2 rounded-lg hover:bg-slate-600 transition-colors"
            >
                Share My Location
            </button>
        )}
      </div>
      
      <Chat
        messages={messages}
        onSendMessage={onSendMessage}
        currentUser={user}
        allUsers={allUsers}
      />
    </div>
  );
};

export default RideDetailScreen;