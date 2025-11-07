import React, { useState, useEffect } from 'react';
import type { User, Ride, Role } from '../types';
import { CogIcon } from './icons/SurgeonIcon'; // Repurposed
import { LogoutIcon } from './icons/HeartIcon'; // Repurposed

interface AdminDashboardProps {
  users: User[];
  rides: Ride[];
  onLogout: () => void;
  onViewRide: (rideId: number) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

const UserEditModal: React.FC<{ user: User; onClose: () => void; onSave: (user: User) => void; }> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [role, setRole] = useState<Role>(user.role);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...user, name, role });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="role" className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={e => setRole(e.target.value as Role)}
                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            <option value="passenger">Passenger</option>
                            <option value="driver">Driver</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, rides, onLogout, onViewRide, onUpdateUser, onDeleteUser }) => {
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleSaveUser = (updatedUser: User) => {
      onUpdateUser(updatedUser);
      setEditingUser(null);
  };
  
  return (
    <>
      {editingUser && <UserEditModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CogIcon className="w-8 h-8 text-slate-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-slate-400">Tornado Go Dashboard</p>
            </div>
          </div>
          <button onClick={onLogout} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors" aria-label="Logout">
            <LogoutIcon className="w-6 h-6 text-slate-300" />
          </button>
        </header>
        
        <main className="space-y-8">
          {/* Users Table */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Users</h3>
            <div className="overflow-x-auto bg-slate-800 rounded-lg p-1">
              <table className="min-w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-4 py-3">ID</th>
                    <th scope="col" className="px-4 py-3">Name</th>
                    <th scope="col" className="px-4 py-3">Role</th>
                    <th scope="col" className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="px-4 py-3">{user.id}</td>
                      <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                      <td className="px-4 py-3 capitalize">{user.role}</td>
                      <td className="px-4 py-3 text-center space-x-2">
                        <button onClick={() => setEditingUser(user)} className="font-medium text-blue-400 hover:underline">Edit</button>
                        <button onClick={() => onDeleteUser(user.id)} className="font-medium text-red-400 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rides Table */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Rides</h3>
            <div className="overflow-x-auto bg-slate-800 rounded-lg p-1">
              <table className="min-w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-4 py-3">ID</th>
                    <th scope="col" className="px-4 py-3">Passenger</th>
                    <th scope="col" className="px-4 py-3">Driver</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map(ride => (
                    <tr key={ride.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="px-4 py-3">{ride.id}</td>
                      <td className="px-4 py-3 text-white">P_ID: {ride.passengerId}</td>
                      <td className="px-4 py-3 text-white">{ride.driverId ? `D_ID: ${ride.driverId}` : 'N/A'}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${ride.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{ride.status}</span></td>
                      <td className="px-4 py-3 text-center space-x-2">
                         <button onClick={() => onViewRide(ride.id)} className="font-medium text-blue-400 hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;