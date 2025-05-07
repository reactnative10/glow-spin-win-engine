
import React, { useState } from 'react';
import Spinner from './Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const generateSampleItems = () => {
  const items = [];
  for (let i = 1; i <= 40; i++) {
    items.push({
      id: `item-${i}`,
      name: `Prize ${i}`
    });
  }
  return items;
};

const SpinnerDemo: React.FC = () => {
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
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Prize Spinner</h1>
      
      <div className="w-full mb-8">
        <Label htmlFor="winningItem" className="text-white mb-2 block">Select Winning Prize:</Label>
        <select
          id="winningItem"
          value={winningItemId}
          onChange={handleWinningItemChange}
          className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-spinner-blue focus:border-transparent"
        >
          {sampleItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      
      <Spinner 
        items={sampleItems}
        winningItemId={winningItemId}
        onSpinComplete={handleSpinComplete}
      />
      
      {lastWinner && (
        <div className="mt-8 p-4 bg-gray-700 rounded-lg text-white">
          <h2 className="text-xl font-semibold">Last Winner:</h2>
          <p className="text-spinner-skyBlue">{lastWinner.name}</p>
        </div>
      )}
      
      <p className="text-gray-400 text-sm mt-8 text-center">
        The spinner will always land on your selected prize after at least 2 full rotations.
        <br />Each item will glow as it passes through the center line.
      </p>
    </div>
  );
};

export default SpinnerDemo;
