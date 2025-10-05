import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { UserRole, Cooperative, User } from '../types';
import { COOPERATIVES, USERS } from '../constants';
import { ArrowTrendingUpIcon, BuildingOffice2Icon, CheckBadgeIcon, ClockIcon, CurrencyDollarIcon, SparklesIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline';


// --- Main Page ---
const CooperativesPage: React.FC = () => {
    const { user } = useAuth();

    if (user?.role === UserRole.COOP_ADMIN) {
        return <AdminCooperativesView />;
    }
    if (user?.role === UserRole.EMPLOYER) {
        return <EmployerIkiminaView />;
    }
    return <SeekerCooperativesView />;
};


// --- Seeker View ---
const SeekerCooperativesView: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoop, setSelectedCoop] = useState<Cooperative | null>(null);

  const handleViewDetails = (coop: Cooperative) => {
    setSelectedCoop(coop);
    setIsModalOpen(true);
  };

  const handleJoin = () => {
    addToast(`Your request to join ${selectedCoop?.name} has been sent!`, 'success');
    setIsModalOpen(false);
  };
  
  const userCooperative = COOPERATIVES.find(c => c.id === user?.cooperativeId);
  const communityCooperatives = COOPERATIVES.filter(c => c.type === 'Community' && c.id !== user?.cooperativeId);

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Cooperatives & Ikimina</h1>
      
      {/* User's Current Cooperative */}
      {userCooperative && (
          <div className="mb-8">
              <h2 className="text-2xl font-semibold text-dark mb-4">My Membership</h2>
              <Card>
                 <div className="text-center">
                    <img src={userCooperative.logoUrl} alt={`${userCooperative.name} logo`} className="h-24 w-24 mb-4 rounded-full mx-auto" />
                    <h2 className="text-2xl font-bold text-dark">{userCooperative.name}</h2>
                    <p className="text-gray-500 mb-4">{userCooperative.description}</p>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${user.cooperativeStatus === 'Member' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        Status: {user.cooperativeStatus}
                    </span>
                 </div>
              </Card>
          </div>
      )}

      {/* Community Cooperatives */}
      <div>
        <h2 className="text-2xl font-semibold text-dark mb-4">Join a Community Cooperative</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityCooperatives.map(coop => (
            <Card key={coop.id} className="flex flex-col">
                <div className="flex-grow text-center">
                <img src={coop.logoUrl} alt={`${coop.name} logo`} className="h-16 w-16 mb-4 rounded-full object-contain mx-auto" />
                <h2 className="text-xl font-bold text-dark mb-2">{coop.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{coop.description}</p>
                </div>
                <Button variant="secondary" onClick={() => handleViewDetails(coop)}>View Details</Button>
            </Card>
            ))}
        </div>
      </div>
      
      {selectedCoop && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCoop.name}>
            <div className="text-center">
                <img src={selectedCoop.logoUrl} alt={`${selectedCoop.name} logo`} className="h-24 w-24 mb-4 rounded-full mx-auto" />
                <p className="text-gray-600 mb-6">{selectedCoop.description}</p>
                <div className="flex justify-around bg-light p-4 rounded-lg mb-6">
                    <div>
                        <p className="text-gray-500 text-sm">Members</p>
                        <p className="font-bold text-lg text-dark">{selectedCoop.members.length}</p>
                    </div>
                     <div>
                        <p className="text-gray-500 text-sm">Total Savings</p>
                        <p className="font-bold text-lg text-dark">RWF {selectedCoop.savings.toLocaleString()}</p>
                    </div>
                </div>
                <Button onClick={handleJoin} className="w-full">Request to Join</Button>
            </div>
        </Modal>
      )}
    </div>
  );
};


// --- Admin View ---
const AdminCooperativesView: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const managedCoop = COOPERATIVES.find(c => c.id === user?.cooperativeId);
    
    if(!managedCoop) return <p>You are not assigned to manage any cooperative.</p>
    
    const pendingMembers = USERS.filter(u => u.cooperativeId === managedCoop.id && u.cooperativeStatus === 'Pending');

    const handleApproval = (member: User, approve: boolean) => {
        addToast(`${member.name}'s membership has been ${approve ? 'approved' : 'rejected'}.`, approve ? 'success' : 'info');
        // Here you would typically update the state/backend
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">Manage "{managedCoop.name}"</h1>
            <Card title="Pending Membership Requests">
                {pendingMembers.length > 0 ? (
                    <div className="space-y-4">
                        {pendingMembers.map(member => (
                            <div key={member.id} className="flex justify-between items-center p-3 bg-light rounded-md">
                                <div className="flex items-center">
                                    <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full mr-4"/>
                                    <div>
                                        <p className="font-bold text-dark">{member.name}</p>
                                        <p className="text-sm text-gray-500">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleApproval(member, true)}>Approve</Button>
                                    <Button variant="danger" onClick={() => handleApproval(member, false)}>Reject</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No pending requests.</p>
                )}
            </Card>
        </div>
    )
};

// --- Employer View ---
const EmployerIkiminaView: React.FC = () => {
    const { user } = useAuth();
    const ikimina = COOPERATIVES.find(c => c.creatorId === user?.id && c.type === 'Corporate');

    if (!ikimina) {
        return <CreateIkiminaPrompt />;
    }

    const pendingMembers = ikimina.members.filter(m => m.cooperativeStatus === 'Pending');

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-2">My Corporate Ikimina</h1>
            <p className="text-gray-500 mb-6">Manage your employee savings and investment group: <span className="font-semibold text-primary">{ikimina.name}</span></p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard icon={UsersIcon} title="Total Members" value={ikimina.members.length} />
                <StatCard icon={CurrencyDollarIcon} title="Total Savings" value={`RWF ${ikimina.savings.toLocaleString()}`} />
                <StatCard icon={ArrowTrendingUpIcon} title="Monthly Growth" value="+5%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Member Management">
                     <div className="space-y-3">
                        {ikimina.members.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-2 bg-light rounded-md">
                                <div className="flex items-center">
                                    <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full mr-3"/>
                                    <div>
                                        <p className="font-semibold text-dark">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.email}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${member.cooperativeStatus === 'Member' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {member.cooperativeStatus}
                                </span>
                            </div>
                        ))}
                     </div>
                </Card>
                 <Card title="Pending Requests">
                    {pendingMembers.length > 0 ? (
                        <div className="space-y-3">
                            {pendingMembers.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-2 bg-light rounded-md">
                                    <p className="font-semibold text-dark">{member.name}</p>
                                    <div className="flex gap-2">
                                        <Button size="sm">Approve</Button>
                                        <Button variant="danger" size="sm">Reject</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 h-full flex items-center justify-center">No pending requests.</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

const CreateIkiminaPrompt: React.FC = () => (
    <div className="text-center py-16">
        <div className="bg-primary/10 text-primary rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <SparklesIcon className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold text-dark mb-4">Launch Your Company's Ikimina</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Boost employee morale, financial wellness, and retention by creating a corporate savings cooperative. It's a powerful benefit that builds a stronger team.
        </p>
        <Button className="!px-8 !py-3 !text-lg">Create Your Ikimina Now</Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
            <FeatureHighlight icon={BuildingOffice2Icon} title="Enhance Company Culture" text="Foster a sense of community and shared goals among your employees." />
            <FeatureHighlight icon={CheckBadgeIcon} title="Promote Financial Wellness" text="Provide your team with a secure and easy way to save and invest together." />
            <FeatureHighlight icon={ClockIcon} title="Simple to Manage" text="Our platform automates contributions and tracking, saving you time and effort." />
        </div>
    </div>
);

const StatCard: React.FC<{icon: React.ElementType, title: string, value: string | number}> = ({icon: Icon, title, value}) => (
    <Card className="flex items-center p-4">
        <div className="bg-primary/10 text-primary rounded-lg p-3 mr-4">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-dark">{value}</p>
        </div>
    </Card>
);

const FeatureHighlight: React.FC<{icon: React.ElementType, title: string, text: string}> = ({icon: Icon, title, text}) => (
    <div className="flex items-start">
        <Icon className="h-8 w-8 text-primary mr-4 flex-shrink-0 mt-1" />
        <div>
            <h3 className="font-bold text-dark mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{text}</p>
        </div>
    </div>
)


export default CooperativesPage;
