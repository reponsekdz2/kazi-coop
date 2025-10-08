
// FIX: Created CooperativesPage.tsx to display cooperative information.
import React, { useState } from 'react';
import { useCooperative } from '../contexts/CooperativeContext';
import Card from '../components/ui/Card';
import { Cooperative } from '../types';
import CooperativeDetailView from '../components/cooperatives/CooperativeDetailView';

const CooperativesPage: React.FC = () => {
    const { cooperatives } = useCooperative();
    const [selectedCooperative, setSelectedCooperative] = useState<Cooperative | null>(cooperatives[0] || null);

    if (!selectedCooperative && cooperatives.length > 0) {
        setSelectedCooperative(cooperatives[0]);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2">
                <h1 className="text-3xl font-bold text-dark dark:text-light">Cooperatives (Ikimina)</h1>
                {cooperatives.map(coop => (
                    <Card key={coop.id} className={`!p-4 cursor-pointer ${selectedCooperative?.id === coop.id ? 'border-2 border-primary' : ''}`} onClick={() => setSelectedCooperative(coop)}>
                        <h3 className="font-bold text-dark dark:text-light">{coop.name}</h3>
                        <p className="text-sm text-gray-500">{coop.members.length} members</p>
                    </Card>
                ))}
            </div>
            <div className="lg:col-span-2 overflow-y-auto pr-2">
                {selectedCooperative ? (
                    <CooperativeDetailView cooperative={selectedCooperative} />
                ) : (
                    <Card className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Select a cooperative to view its details.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CooperativesPage;
