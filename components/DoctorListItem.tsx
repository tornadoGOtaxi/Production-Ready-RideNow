import React from 'react';
import type { Ride } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';

interface RideListItemProps {
  ride: Ride;
  onSelect: () => void;
}

const RideListItem: React.FC<RideListItemProps> = ({ ride, onSelect }) => {
  const isClickable = onSelect && typeof onSelect === 'function';

  const statusStyles: { [key: string]: string } = {
    pending: 'border-yellow-500/50',
    accepted: 'border-blue-500/50',
    'in-progress': 'border-blue-500/50',
    completed: 'border-green-500/50',
    cancelled: 'border-red-500/50',
  };
  
  const handleClick = (e: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if(isClickable) {
      if (e.type === 'click' || (e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter')) {
        onSelect();
      }
    }
  };

  return (
    <div 
      onClick={handleClick}
      onKeyDown={handleClick}
      className={`flex flex-col p-4 bg-slate-800 rounded-2xl space-y-3 transition-colors border-l-4 ${statusStyles[ride.status] || 'border-slate-600'} ${isClickable ? 'hover:bg-slate-700/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500' : ''}`}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : -1}
      aria-label={`View details for ride to ${ride.destination}`}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-white truncate w-3/4" title={ride.destination}>
            To: {ride.destination}
        </p>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
            ride.status === 'completed' ? 'bg-green-900 text-green-300' :
            ride.status === 'in-progress' || ride.status === 'accepted' ? 'bg-blue-900 text-blue-300' :
            ride.status === 'cancelled' ? 'bg-red-900 text-red-300' :
            'bg-yellow-900 text-yellow-300'
        }`}>{ride.status}</span>
      </div>
      
      <div className="flex items-start space-x-2 text-sm text-slate-400">
        <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p className="truncate" title={ride.pickupLocation}>{ride.pickupLocation}</p>
      </div>

      <div className="text-xs text-slate-500 text-right">
        {new Date(ride.requestTime).toLocaleString()}
      </div>
    </div>
  );
};

export default RideListItem;
