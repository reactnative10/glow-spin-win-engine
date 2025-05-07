
import React from 'react';
import SpinnerDemo from '@/components/SpinnerDemo';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 bg-[url('/lovable-uploads/d89baf86-d982-495c-89b9-97ef7ac01075.png')] bg-center bg-cover bg-no-repeat">
      <div className="bg-black/70 p-8 rounded-xl backdrop-blur-sm w-full max-w-xl">
        <SpinnerDemo />
      </div>
    </div>
  );
};

export default Index;
