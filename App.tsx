import React, { useState, useEffect, useRef } from 'react';
import type { User, Role, Ride, Message, LatLng } from './types';

// Component Imports (files are repurposed)
import LoginScreen from './components/Header';
import PassengerDashboard from './components/FeaturedDoctorCard';
import DriverDashboard from './components/SearchBar';
import AdminDashboard from './components/CategoryGrid';
import RideDetailScreen from './components/DoctorList';
import FloatingIcon from './components/FloatingIcon';
import GuestRideRequest from './components/GuestRideRequest';

// MOCK DATA
const DEMO_USERS: User[] = [
  { id: 1, name: 'John Passenger', username: 'passenger', password: 'p', role: 'passenger', avatarUrl: `https://i.pravatar.cc/150?u=passenger${Date.now()}` },
  { id: 2, name: 'Jane Driver', username: 'driver', password: 'd', role: 'driver', avatarUrl: `https://i.pravatar.cc/150?u=driver${Date.now()}` },
  { id: 3, name: 'Admin User', username: 'admin', password: 'a', role: 'admin', avatarUrl: `https://i.pravatar.cc/150?u=admin${Date.now()}` },
  { id: 4, name: 'Mike Passenger', username: 'mike', password: 'm', role: 'passenger', avatarUrl: `https://i.pravatar.cc/150?u=mike${Date.now()}` },
];

const INITIAL_RIDES: Ride[] = [
    {
        id: 1, passengerId: 1, driverId: 2,
        pickupLocation: '123 Main St, Taylorville, IL', destination: 'Taylorville Municipal Airport, IL',
        status: 'in-progress', requestTime: new Date(Date.now() - 10 * 60 * 1000),
        pickupTime: new Date(Date.now() - 5 * 60 * 1000), fare: 15.50,
        pickupCoords: { lat: 39.5495, lng: -89.2937 },
        destinationCoords: { lat: 39.5312, lng: -89.3248 },
        driverLocation: { lat: 39.5450, lng: -89.3100 },
    },
    {
        id: 2, passengerId: 4,
        pickupLocation: 'Walmart Supercenter, Taylorville, IL', destination: '100 W Market St, Taylorville, IL',
        status: 'pending', requestTime: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
        id: 3, passengerId: 1, driverId: 2,
        pickupLocation: 'Manners Park, Taylorville, IL', destination: '123 Main St, Taylorville, IL',
        status: 'completed', requestTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        pickupTime: new Date(Date.now() - 1.9 * 60 * 60 * 1000), dropoffTime: new Date(Date.now() - 1.8 * 60 * 60 * 1000),
        fare: 12.00
    },
];

const INITIAL_MESSAGES: Message[] = [
    { id: 1, rideId: 1, senderId: 1, text: "I'm by the main entrance.", timestamp: new Date(Date.now() - 7 * 60 * 1000) },
    { id: 2, rideId: 1, senderId: 2, text: "Okay, I'm in a blue sedan. I'll be there in 2 minutes.", timestamp: new Date(Date.now() - 6 * 60 * 1000) }
];
// --- END MOCK DATA ---

type View = 'login' | 'passenger' | 'driver' | 'admin' | 'rideDetail' | 'guestRequest';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('login');
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [rides, setRides] = useState<Ride[]>(INITIAL_RIDES);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [pickupLocation, setPickupLocation] = useState<LatLng | string>('Fetching location...');
  const [selectedRideId, setSelectedRideId] = useState<number | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const rideUpdateInterval = useRef<number | null>(null);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(setNotificationPermission);
    }
  }, []);

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && notificationPermission === 'granted') {
      new Notification(title, {
        body: options?.body,
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOSAxN2gyYy42IDAgMS0uNCAxLTF2LTNjMC0uOS0uNy0xLjctMS41LTEuOUMxOC43IDEwLjYgMTYgMTAgMTYgMTBzLTEuMy0xLjQtMi4yLTIuM2MtLjUtLjQtMS4xLS43LTEuOC0uN0g1Yy0uNiAwLTEuMS40LTEuNC45TDIgMTJ2OWMwIC42LjQgMSAxIDFoMiIgLz48Y2lyY2xlIGN4PSI3IiBjeT0iMTciIHI9IjIiIC8+PHBhdGggZD0iTTkgMTdoNiIgLz48Y2lyY2xlIGN4PSIxNyIgY3k9IjE3IiByPSIyIiAvPjwvc3ZnPg==', // Simple Car Icon
        ...options,
      });
    }
  };

  // --- Real-time Ride Simulation ---
  useEffect(() => {
    const activeRide = rides.find(r => r.id === selectedRideId && (r.status === 'in-progress' || r.status === 'arrived' || r.status === 'picked-up'));

    if (activeRide && activeRide.driverLocation && activeRide.pickupCoords && activeRide.destinationCoords) {
      if(rideUpdateInterval.current) clearInterval(rideUpdateInterval.current);
      
      rideUpdateInterval.current = window.setInterval(() => {
        setRides(prevRides => {
          const currentRide = prevRides.find(r => r.id === activeRide.id);
          if (!currentRide || !currentRide.driverLocation || !currentRide.pickupCoords || !currentRide.destinationCoords) return prevRides;
          
          let target: LatLng;
          let nextStatus: Ride['status'] | null = null;
          
          if (currentRide.status === 'in-progress' || currentRide.status === 'arrived') {
              target = currentRide.pickupCoords;
          } else { // picked-up
              target = currentRide.destinationCoords;
          }

          const newDriverLocation = { ...currentRide.driverLocation };
          const latDiff = target.lat - newDriverLocation.lat;
          const lngDiff = target.lng - newDriverLocation.lng;

          const distance = Math.sqrt(latDiff*latDiff + lngDiff*lngDiff);
          
          if(distance < 0.0005) { // Arrived at target
              if(currentRide.status === 'in-progress') nextStatus = 'arrived';
              else if(currentRide.status === 'arrived') { /* do nothing, wait for passenger */ }
              else if(currentRide.status === 'picked-up') nextStatus = 'completed';
          } else {
             // Move driver closer to target
             newDriverLocation.lat += latDiff * 0.1;
             newDriverLocation.lng += lngDiff * 0.1;
          }
          
          return prevRides.map(r => {
            if (r.id === currentRide.id) {
                if (nextStatus) {
                   if(nextStatus === 'arrived') sendNotification('Driver has Arrived!', { body: 'Your driver is at the pickup location.' });
                   if(nextStatus === 'completed') {
                       if(rideUpdateInterval.current) clearInterval(rideUpdateInterval.current);
                       sendNotification('Ride Completed', { body: 'You have arrived at your destination.' });
                       return { ...r, driverLocation: newDriverLocation, status: nextStatus, dropoffTime: new Date() };
                   }
                }
                return { ...r, driverLocation: newDriverLocation, status: nextStatus || r.status };
            }
            return r;
          });
        });
      }, 2000);

    } else {
      if (rideUpdateInterval.current) clearInterval(rideUpdateInterval.current);
    }
    
    return () => {
       if (rideUpdateInterval.current) clearInterval(rideUpdateInterval.current);
    }
  }, [selectedRideId, rides]);

  // --- Geocoding Utility ---
  const geocodeAddress = async (address: string): Promise<LatLng | null> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
    } catch (error) {
        console.error("Geocoding failed:", error);
    }
    return null;
  };
  
  useEffect(() => {
    if (currentUser?.role === 'passenger' || currentView === 'guestRequest') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPickupLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {
          setPickupLocation('Could not get location. Please enter manually.');
        },
        { enableHighAccuracy: true }
      );
    }
  }, [currentUser, currentView]);
  
  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setCurrentView(user.role);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleRequestRide = async (destination: string) => {
    if (!currentUser) return;
    const destCoords = await geocodeAddress(destination);
    if (!destCoords) {
        alert("Could not find coordinates for the destination. Please try a different address.");
        return;
    }

    const newRide: Ride = {
      id: Date.now(),
      passengerId: currentUser.id,
      pickupLocation: typeof pickupLocation === 'object' ? `${pickupLocation.lat.toFixed(5)}, ${pickupLocation.lng.toFixed(5)}` : pickupLocation,
      destination,
      status: 'pending',
      requestTime: new Date(),
      destinationCoords: destCoords,
    };
    setRides([newRide, ...rides]);
  };
  
  const handleAcceptRide = async (rideId: number) => {
    if (!currentUser || currentUser.role !== 'driver') return;
    
    const rideToAccept = rides.find(r => r.id === rideId);
    if (!rideToAccept) return;
    
    const pickupCoords = typeof pickupLocation === 'object' ? pickupLocation : await geocodeAddress(rideToAccept.pickupLocation);
    if (!pickupCoords) {
        alert("Could not get coordinates for pickup. Cannot accept ride.");
        return;
    }

    sendNotification('Ride Accepted!', { body: 'A driver is on the way to the pickup location.' });
    
    const driverStartPosition = { lat: pickupCoords.lat + 0.05, lng: pickupCoords.lng + 0.05 }; // Simulate driver starting nearby
    
    setRides(rides.map(r => r.id === rideId ? { ...r, status: 'accepted', driverId: currentUser.id, pickupCoords, driverLocation: driverStartPosition } : r));

    // Wait a moment, then start the 'in-progress' state and simulation
    setTimeout(() => {
      setRides(prevRides => prevRides.map(r => r.id === rideId ? { ...r, status: 'in-progress' } : r));
      sendNotification('Driver is Approaching', { body: 'Your Tornado Go driver is on the way.' });
    }, 2000);

    setSelectedRideId(rideId);
    setCurrentView('rideDetail');
  };
  
  const handleSelectRide = (