
import React, { useState, useMemo } from 'react';
import { Cooperative, UserRole } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useCooperative } from '../../contexts/CooperativeContext';
// FIX: Import mock data from the new constants file.
import { USERS } from '../../constants';
import { BuildingOffice2Icon, UsersIcon, BanknotesIcon, PencilIcon } from '@heroicons/react/24/solid';
import AgreeToRulesModal from '../ui/AgreeToRulesModal';
import ContributionModal from '../ui/ContributionModal';
import EditCooperativeModal from '../ui/EditCooperativeModal';
import MemberList from './MemberList';

interface CooperativeDetailViewProps {
    cooperative: Cooperative;
}

const CooperativeDetailView: React.FC<CooperativeDetailViewProps> = ({ cooperative }) => {
    const { user } = useAuth();
    const { joinCooperative } = useCooperative();
    const [isAgreeModalOpen, setIsAgreeModalOpen] = useState(false);
    const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const userMembership = useMemo(() => {
        return cooperative.members.find(m => m.userId === user?.id);
    }, [cooperative.members, user]);

    const isManager = user?.id === cooperative.creatorId;

    const handleJoin = () => {
        setIsAgreeModalOpen(true);
    };

    const handleAgreeAndJoin = () => {
        joinCooperative(cooperative.id);
        setIsAgreeModalOpen(false);
    }
    
    return (
        <Card>
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-dark dark:text-light">{cooperative.name}</h2>
                {isManager && <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(true)}><PencilIcon className="h-4 w-4 mr-2 inline"/>Edit</Button>}
            </div>
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 my-2">
                <span className="flex items-center"><BuildingOffice2Icon className="h-4 w-4 mr-1"/> Created by {USERS.find(u => u.id === cooperative.creatorId)?.name}</span>
                <span className="flex items-center"><UsersIcon className="h-4 w-4 mr-1"/> {cooperative.members.length} Members</span>
                <span className="flex items-center"><BanknotesIcon className="h-4 w-4 mr-1"/> RWF {cooperative.totalSavings.toLocaleString()} Total Savings</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap mt-4">{cooperative.description}</p>
            <h3 className="font-bold text-dark dark:text-light mt-4 mb-2">Rules & Regulations</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{cooperative.rulesAndRegulations}</p>
            
            <div className="mt-6">
                {!userMembership && <Button onClick={handleJoin}>Join Cooperative</Button>}
                {userMembership?.status === 'pending_approval' && <Button disabled>Request Pending</Button>}
                {userMembership?.status === 'active' && <Button onClick={() => setIsContributeModalOpen(true)}>Make Contribution</Button>}
            </div>

            {isManager && (
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                     <h3 className="font-bold text-dark dark:text-light mb-2">Member Management</h3>
                     <MemberList members={cooperative.members} cooperativeId={cooperative.id} />
                </div>
            )}
            
            <AgreeToRulesModal isOpen={isAgreeModalOpen} onClose={() => setIsAgreeModalOpen(false)} cooperative={cooperative} onAgree={handleAgreeAndJoin} />
            <ContributionModal isOpen={isContributeModalOpen} onClose={() => setIsContributeModalOpen(false)} cooperative={cooperative} />
            <EditCooperativeModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} cooperative={cooperative} onSave={() => {}} />
        </Card>
    );
};

export default CooperativeDetailView;