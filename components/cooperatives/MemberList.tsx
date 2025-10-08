
import React from 'react';
import { CooperativeMember } from '../../types';
import { USERS } from '../../constants';
import Button from '../layout/Button';
import { useCooperative } from '../../contexts/CooperativeContext';

interface MemberListProps {
    members: CooperativeMember[];
    cooperativeId: string;
}

const MemberList: React.FC<MemberListProps> = ({ members, cooperativeId }) => {
    const { approveMember } = useCooperative();
    
    const getStatusChip = (status: CooperativeMember['status']) => {
        switch (status) {
            case 'active':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
            case 'pending_approval':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending Approval</span>;
            case 'awaiting_agreement':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Awaiting Agreement</span>;
            case 'inactive':
                 return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>;
        }
    }

    return (
        <div className="space-y-2 max-h-96 overflow-y-auto">
            {members.map(member => {
                const user = USERS.find(u => u.id === member.userId);
                if (!user) return null;
                return (
                    <div key={member.userId} className="flex items-center justify-between p-2 rounded hover:bg-light dark:hover:bg-gray-700/50">
                        <div className="flex items-center gap-3">
                            <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                            <div>
                                <p className="font-semibold text-dark dark:text-light">{user.name}</p>
                                <p className="text-xs text-gray-500">Joined: {new Date(member.joinDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {getStatusChip(member.status)}
                            {member.status === 'pending_approval' && (
                                <Button size="sm" onClick={() => approveMember(cooperativeId, member.userId)}>Approve</Button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MemberList;
