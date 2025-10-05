
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PencilIcon, EnvelopeIcon, BriefcaseIcon } from '@heroicons/react/24/solid';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading profile...</div>;
  }

  const { name, email, role, avatarUrl, profile } = user;

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <Card className="text-center">
            <div className="relative inline-block mb-4">
              <img src={avatarUrl} alt={name} className="h-32 w-32 rounded-full mx-auto" />
              <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors">
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-dark">{name}</h2>
            <p className="text-gray-500">{profile.title || role}</p>
            {profile.company && <p className="text-gray-600 font-semibold">{profile.company}</p>}
            <div className="mt-4 flex flex-col items-center space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                <span>{email}</span>
              </div>
              <div className="flex items-center">
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                <span>{role}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-dark">About Me</h3>
              <Button variant="secondary">Edit Bio</Button>
            </div>
            <p className="text-gray-700">{profile.bio}</p>
          </Card>
          
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-dark">Skills</h3>
              <Button variant="secondary">Edit Skills</Button>
            </div>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added yet.</p>
            )}
          </Card>
          
          {profile.completeness !== undefined && (
            <Card>
                <h3 className="text-xl font-bold text-dark mb-4">Profile Completeness</h3>
                <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-accent h-2.5 rounded-full" style={{ width: `${profile.completeness}%` }}></div>
                    </div>
                    <span className="text-sm font-semibold text-dark ml-4">{profile.completeness}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Complete your profile to get better job recommendations.</p>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
