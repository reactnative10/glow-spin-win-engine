
import React, { useState, useRef, useEffect } from 'react';
import SpinnerItem from './SpinnerItem';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface Item {
  id: string;
  name: string;
}

interface SpinnerProps {
  items: Item[];
  winningItemId?: string;
  onSpinComplete?: (item: Item) => void;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  items, 
  winningItemId,
  onSpinComplete 
}) => {
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const [spinDuration, setSpinDuration] = useState(0);
  const [spinnerStyle, setSpinnerStyle] = useState({});
  const spinnerRef = useRef<HTMLDivElement>(null);
  const ITEM_HEIGHT = 54; // height of each item in pixels

  // Generate more items to ensure we have at least 120
  const generateMoreItems = (baseItems: Item[]): Item[] => {
    const result: Item[] = [];
    const numberOfSets = Math.ceil(120 / baseItems.length);
    
    for (let i = 0; i < numberOfSets; i++) {
      baseItems.forEach((item) => {
        result.push({
          ...item,
          id: i === 0 ? item.id : `${item.id}-${i}`
        });
      });
    }
    
    return result;
  };
  
  const extendedItems = generateMoreItems(items);
  
  const calculateSpinToWinningItem = () => {
    if (!winningItemId) return { duration: 0, targetIndex: 0 };
    
    // Find the original winning item index
    const originalWinningIndex = items.findIndex(item => item.id === winningItemId);
    if (originalWinningIndex === -1) {
      console.error('Winning item not found in items list');
      return { duration: 0, targetIndex: 0 };
    }
    
    // Calculate how many full rotations we want (at least 2)
    const fullRotations = 2;
    const totalItems = extendedItems.length;
    
    // Calculate the total number of items to spin through
    // This includes the full rotations plus the items needed to reach the winning item
    const targetIndex = (fullRotations * totalItems) + originalWinningIndex;
    
    // Calculate duration based on item count (more items = longer spin)
    // This gives a nice acceleration and deceleration feel
    const baseDuration = 4; // base duration in seconds
    const duration = baseDuration + (fullRotations * 0.5);
    
    return { duration, targetIndex };
  };
  
  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    const { duration, targetIndex } = calculateSpinToWinningItem();
    setSpinDuration(duration);
    
    // Calculate the distance to move
    const moveDistance = targetIndex * ITEM_HEIGHT;
    
    // Set the CSS for the spinning animation
    setSpinnerStyle({
      transform: `translateY(-${moveDistance}px)`,
      transition: `transform ${duration}s cubic-bezier(0.1, 0.7, 0.1, 1)`
    });
    
    // Track active item during spinning
    let currentItem = 0;
    const trackActiveItem = setInterval(() => {
      const containerRect = spinnerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const centerY = containerRect.top + (containerRect.height / 2);
        const elements = spinnerRef.current?.children || [];
        
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i] as HTMLElement;
          const rect = element.getBoundingClientRect();
          const itemCenterY = rect.top + (rect.height / 2);
          
          // Check if this item is crossing the center line
          if (Math.abs(itemCenterY - centerY) < 10) {
            setActiveItemIndex(i);
            currentItem = i;
            break;
          }
        }
      }
    }, 50);
    
    // Handle spin completion
    setTimeout(() => {
      clearInterval(trackActiveItem);
      setIsSpinning(false);
      
      // Find the winning item that landed on the center
      const winningItem = extendedItems[currentItem % extendedItems.length];
      
      // Call the onSpinComplete callback with the winning item
      if (onSpinComplete && winningItem) {
        onSpinComplete(winningItem);
      }
      
      // Show a toast notification
      toast({
        title: "Congratulations!",
        description: `You won: ${winningItem?.name || 'a prize'}!`,
      });
    }, duration * 1000);
  };
  
  // Reset the spinner position after spinning is complete
  useEffect(() => {
    if (!isSpinning && spinDuration > 0) {
      // Add a small delay before resetting to ensure the animation is complete
      const timer = setTimeout(() => {
        setSpinnerStyle({
          transform: 'translateY(0)',
          transition: 'none'
        });
        setActiveItemIndex(-1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isSpinning, spinDuration]);
  
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md mx-auto">
      {/* Spinner container */}
      <div className="relative w-full h-[270px] overflow-hidden border-4 border-gray-800 rounded-lg bg-gray-900 shadow-lg">
        {/* Center indicator line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-spinner-red z-20 transform -translate-y-1/2 shadow-[0_0_10px_rgba(234,56,76,0.7)]" />
        
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 pointer-events-none" />
        
        {/* Spinner items */}
        <div 
          ref={spinnerRef}
          className="absolute top-0 left-0 w-full transition-transform"
          style={spinnerStyle}
        >
          {/* Buffer items at the top for continuous looping effect */}
          {extendedItems.map((item, index) => (
            <SpinnerItem
              key={`${item.id}-${index}`}
              id={item.id}
              name={item.name}
              isActive={index === activeItemIndex}
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* Spin button */}
      <Button 
        className="px-8 py-6 text-xl font-bold bg-spinner-blue hover:bg-spinner-skyBlue transition-all duration-300 disabled:opacity-50"
        onClick={startSpin} 
        disabled={isSpinning}
      >
        {isSpinning ? 'Spinning...' : 'Spin to Win!'}
      </Button>
    </div>
  );
};

export default Spinner;
