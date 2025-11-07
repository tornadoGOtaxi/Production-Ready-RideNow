import { ComponentType, SVGProps } from 'react';

export type Role = 'passenger' | 'driver' | 'admin';

export interface User {
  id: number;
  name: string;
  username: string;
  password?: string;
  role: Role;
  avatarUrl: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Ride {
  id: number;
  passengerId: number;
  driverId?: number;
  pickupLocation: string;
  destination: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'arrived' | 'picked-up' | 'completed' | 'cancelled';
  requestTime: Date;
  pickupTime?: Date;
  dropoffTime?: Date;
  fare?: number;
  
  // For live map functionality
  pickupCoords?: LatLng;
  destinationCoords?: LatLng;
  driverLocation?: LatLng;
}

export interface Message {
  id: number;
  rideId: number;
  senderId: number;
  text: string;
  timestamp: Date;
}