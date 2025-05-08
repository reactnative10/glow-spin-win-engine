
import React, { useState } from 'react';
import PrizeWheel from './Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const generateSampleItems = () => {
  const items = [
    { id: 'item-1', name: 'White Shoes' },
    { id: 'item-2', name: 'Jacket' },
    { id: 'item-3', name: 'Hat' },
    { id: 'item-4', name: '$1 Coupon' },
    { id: 'item-5', name: '$5 Coupon' },
    { id: 'item-6', name: '$10 Coupon' },
    { id: 'item-7', name: '$25 Coupon' },
    { id: 'item-8', name: 'Bottle' }
  ];
  return items;
};

const PrizeSelector: React.FC = () => {
  const sampleItems = generateSampleItems();
  const [winningItemId, setWinningItemId] = useState(sampleItems[0].id);
  const [lastWinner, setLastWinner] = useState<{ id: string; name: string } | null>(null);

  const handleSpinComplete = (winner: { id: string; name: string }) => {
    setLastWinner(winner);
    console.log('Winner:', winner);
  };

  const handleWinningItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWinningItemId(e.target.value);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Prize Spinner</h1>
      
      <div className="w-full mb-8">
        <Label htmlFor="winningItem" className="text-white mb-2 block">Select Winning Prize:</Label>
        <select
          id="winningItem"
          value={winningItemId}
          onChange={handleWinningItemChange}
          className="w-full bg-gray-800 text-white p-2 rounded-md border border-gray-700 focus:ring-2 focus:ring-spinner-blue focus:border-transparent"
        >
          {sampleItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      
      <PrizeWheel 
        items={sampleItems}
        winningItemId={winningItemId}
        onSpinComplete={handleSpinComplete}
      />
      
      {lastWinner && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg text-white border border-gray-700">
          <h2 className="text-xl font-semibold">You Won:</h2>
          <p className="text-spinner-skyBlue text-2xl">{lastWinner.name}</p>
        </div>
      )}
      
      <p className="text-gray-400 text-sm mt-8 text-center">
        The spinner will always land on your selected prize after at least 2 full rotations.
      </p>
    </div>
  );
};

export default PrizeSelector;
