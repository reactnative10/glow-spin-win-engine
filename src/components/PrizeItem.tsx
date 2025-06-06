
import React from 'react';
import { cn } from '@/lib/utils';

interface PrizeItemProps {
  id: string;
  name: string;
  isActive: boolean;
  index: number;
}

const getRandomColor = (index: number) => {
  const colors = [
    'bg-spinner-purple',
    'bg-spinner-lightPurple',
    'bg-spinner-magenta',
    'bg-spinner-orange',
    'bg-spinner-blue',
    'bg-spinner-skyBlue'
  ];
  return colors[index % colors.length];
};

const PrizeItem: React.FC<PrizeItemProps> = ({ id, name, isActive, index }) => {
  const bgColor = getRandomColor(index);
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center py-3 px-4 w-full text-white font-medium transition-all duration-300",
        bgColor,
        isActive && "animate-glow z-10 scale-110"
      )}
      data-id={id}
    >
      {name}
    </div>
  );
};

export default PrizeItem;
