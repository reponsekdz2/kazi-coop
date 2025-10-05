import React, { useState } from 'react';

interface RingHubItem {
  id: string;
  imageUrl: string;
  label: string;
}

interface RingHubProps {
  items: RingHubItem[];
  size?: number;
  onSelect?: (id: string) => void;
  children?: React.ReactNode;
}

const RingHub: React.FC<RingHubProps> = ({ items, size = 300, onSelect, children }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const radius = size / 2.5;
  const center = size / 2;
  const itemSize = size / 6;

  const handleItemClick = (id: string) => {
      setSelectedId(id);
      if (onSelect) {
          onSelect(id);
      }
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Dashed Circle */}
      <svg width={size} height={size} className="absolute top-0 left-0">
          <circle 
            cx={center} 
            cy={center} 
            r={radius} 
            fill="none" 
            stroke="lightgray" 
            strokeWidth="2" 
            strokeDasharray="4 4"
          />
      </svg>
      
      {/* Central Content Area */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-inner flex items-center justify-center p-4"
        style={{ width: radius * 1.5, height: radius * 1.5 }}
      >
        {children}
      </div>

      {/* Items on the Ring */}
      {items.map((item, index) => {
        const angle = (index / items.length) * 2 * Math.PI - Math.PI / 2;
        const x = center + radius * Math.cos(angle) - itemSize / 2;
        const y = center + radius * Math.sin(angle) - itemSize / 2;
        
        const isSelected = selectedId === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`absolute rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none ${isSelected ? 'scale-110 ring-4 ring-primary' : 'ring-2 ring-white'}`}
            style={{
              width: itemSize,
              height: itemSize,
              top: y,
              left: x,
              backgroundImage: `url(${item.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            title={item.label}
          />
        );
      })}
    </div>
  );
};

export default RingHub;
