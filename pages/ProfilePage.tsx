import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PencilIcon } from '@heroicons/react/24/solid';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="text-center">
            <img src={user.avatarUrl} alt={user.name} className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-primary" />
            <h2 className="text-2xl font-bold text-dark">{user.name}</h2>
            <p className="text-gray-500">{user.role}</p>
            <Button variant="secondary" className="mt-4 w-full">Change Picture</Button>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-dark">Personal Information</h3>
              <Button variant="secondary">
                <PencilIcon className="h-4 w-4 mr-2 inline" />
                Edit
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-dark font-semibold">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-dark font-semibold">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-dark font-semibold">{user.role}</p>
              </div>
               <div>
                <label className="text-sm font-medium text-gray-500">Password</label>
                <button className="text-primary text-sm font-semibold">Change Password</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
