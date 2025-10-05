
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Profile</h1>
      <Card>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="text-center">
                <img src={user.avatarUrl} alt="User Avatar" className="h-32 w-32 rounded-full mx-auto" />
                <Button variant="secondary" className="mt-4 text-sm">Change Photo</Button>
            </div>
            <div className="flex-1 w-full">
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" defaultValue={user.name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" defaultValue={user.email} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea rows={4} defaultValue={user.profile.bio} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    {user.profile.skills && (
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Skills</label>
                            <input type="text" defaultValue={user.profile.skills.join(', ')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                    )}
                    <div className="text-right">
                        <Button>Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
