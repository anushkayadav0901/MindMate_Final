import React from 'react';
import { environments } from '../../utils/vrTherapyUtils';
import { VREnvironment } from './VREnvironments/types';

interface VREnvironmentSelectorProps {
  onSelect: (environment: VREnvironment) => void;
}

export const VREnvironmentSelector: React.FC<VREnvironmentSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {environments.map((env) => (
        <div
          key={env.id}
          onClick={() => onSelect(env)}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 cursor-pointer 
                     hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-indigo-200"
        >
          <div className="text-6xl mb-4">{env.icon}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{env.name}</h3>
          <p className="text-gray-600">{env.description}</p>
        </div>
      ))}
    </div>
  );
};
