import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { UserRole, Cooperative, User } from '../types';
import { COOPERATIVES, USERS } from '../constants';

// --- Main Page ---
const CooperativesPage: React.FC = () => {
    const { user } = useAuth();

    if (user?.role === UserRole.COOP_ADMIN) {
        return <AdminCooperativesView />;
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

  if (userCooperative) {
      return (
          <div>
              <h1 className="text-3xl font-bold text-dark mb-6">My Cooperative</h1>
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
      )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark">Join a Cooperative</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COOPERATIVES.map(coop => (
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

export default CooperativesPage;